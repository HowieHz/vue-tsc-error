import { appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { EOL } from "node:os";

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
const golar = run("golar", "pnpm", ["run", "typecheck:golar"]);

appendSummary([
  "## Raw Typecheck Outcomes",
  "",
  "| Checker | Outcome |",
  "| --- | --- |",
  `| vue-tsc | ${outcomeOf(vueTsc)} |`,
  `| golar | ${outcomeOf(golar)} |`,
]);

if (vueTsc.status !== 0) {
  console.error("Expected vue-tsc to pass, but it failed.");
  process.exit(1);
}

if (golar.status === 0) {
  console.error("Expected golar to fail, but it passed.");
  process.exit(1);
}

for (const fragment of [
  "docs/index.md(1,1): error TS1000000: Element is missing end tag.",
  "docs/index.md(6,1): error TS1000000: Unexpected EOF in tag.",
]) {
  if (!golar.output.includes(fragment)) {
    console.error(`Expected golar diagnostic not found: ${fragment}`);
    process.exit(1);
  }
}

console.log("Reproduction confirmed: vue-tsc passes, while golar reports Markdown tag parse errors.");
