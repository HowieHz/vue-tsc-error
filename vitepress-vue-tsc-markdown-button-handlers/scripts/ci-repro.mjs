import { appendFileSync } from "node:fs";
import { EOL } from "node:os";
import { spawnSync } from "node:child_process";

const TIMEOUT_MS = 120_000;

function run(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: TIMEOUT_MS,
  });

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  const timedOut = result.error?.code === "ETIMEDOUT";

  console.log(`::group::${label}`);
  if (stdout) {
    process.stdout.write(stdout);
  }
  if (stderr) {
    process.stderr.write(stderr);
  }
  if (timedOut) {
    console.error(`Timed out after ${TIMEOUT_MS}ms.`);
  }
  console.log("::endgroup::");

  return {
    status: result.status,
    output: `${stdout}${stderr}`,
    timedOut,
  };
}

function outcomeOf(result) {
  if (result.timedOut) {
    return "timeout";
  }
  return result.status === 0 ? "success" : "failure";
}

function appendSummary(lines) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }
  appendFileSync(summaryPath, lines.join(EOL) + EOL, "utf8");
}

const vueTsc = run("vue-tsc", "pnpm", ["run", "typecheck:vue-tsc"]);
const vueTsgo = run("vue-tsgo", "pnpm", ["run", "typecheck:vue-tsgo"]);
const golar = run("golar", "pnpm", ["run", "typecheck:golar"]);

appendSummary([
  "## Raw Typecheck Outcomes",
  "",
  "| Checker | Outcome |",
  "| --- | --- |",
  `| vue-tsc | ${outcomeOf(vueTsc)} |`,
  `| vue-tsgo | ${outcomeOf(vueTsgo)} |`,
  `| golar | ${outcomeOf(golar)} |`,
]);

if (vueTsc.status === 0) {
  console.error("Expected vue-tsc to fail, but it passed.");
  process.exit(1);
}

for (const fragment of [
  "docs/index.md(9,10): error TS6133: 'stepTargetListPage' is declared but its value is never read.",
  "docs/index.md(14,16): error TS6133: 'startEditingTargetListPage' is declared but its value is never read.",
]) {
  if (!vueTsc.output.includes(fragment)) {
    console.error(`Expected diagnostic not found: ${fragment}`);
    process.exit(1);
  }
}

console.log("Reproduction confirmed: vue-tsc reports TS6133 for handlers used by the Markdown template.");
