import { appendFileSync, readFileSync } from "node:fs";
import { EOL } from "node:os";
import { spawnSync } from "node:child_process";

const TIMEOUT_MS = 300_000;

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
    timedOut,
  };
}

function outcomeLabel(result) {
  if (result.timedOut) {
    return "❌ timeout";
  }
  return result.status === 0 ? "√ success" : "❌ failure";
}

function isSuccessful(result) {
  return !result.timedOut && result.status === 0;
}

function appendSummary(lines) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }
  appendFileSync(summaryPath, lines.join(EOL) + EOL, "utf8");
}

function loadDeclaredVersions() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  return {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };
}

function directDependencyNames() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ];
}

const versions = loadDeclaredVersions();
const dependencies = directDependencyNames();
const vueTsc = run("vue-tsc", "pnpm", ["run", "typecheck:vue-tsc"]);
const vueTsgo = run("vue-tsgo", "pnpm", ["run", "typecheck:vue-tsgo"]);
const golar = run("golar", "pnpm", ["run", "typecheck:golar"]);
const overallSuccess = [vueTsc, vueTsgo, golar].every(isSuccessful);

appendSummary([
  "## Versions",
  "",
  "| Package | Version |",
  "| --- | --- |",
  ...dependencies.map((name) => `| ${name} | ${versions[name] ?? "unknown"} |`),
  "",
  "## Typecheck Outcomes",
  "",
  "| Checker | Outcome |",
  "| --- | --- |",
  `| vue-tsc | ${outcomeLabel(vueTsc)} |`,
  `| vue-tsgo | ${outcomeLabel(vueTsgo)} |`,
  `| golar | ${outcomeLabel(golar)} |`,
  "",
  `Overall: ${overallSuccess ? "√ success" : "❌ failure"}`,
]);

if (!overallSuccess) {
  process.exit(1);
}
