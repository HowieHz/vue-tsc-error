import { appendFileSync, readFileSync } from "node:fs";
import { EOL } from "node:os";
import { spawnSync } from "node:child_process";

const TIMEOUT_MS = 300_000;
const CASES = [
  "two-template-attrs",
  "two-inline-codes",
  "template-then-inline",
  "inline-then-template",
];
const CHECKERS = [
  { name: "vue-tsc", script: "typecheck:vue-tsc" },
  { name: "vue-tsgo", script: "typecheck:vue-tsgo" },
  { name: "golar", script: "typecheck:golar" },
];

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

function isSuccessful(result) {
  return !result.timedOut && result.status === 0;
}

function outcomeLabel(result) {
  if (result.timedOut) {
    return "❌ timeout";
  }
  return result.status === 0 ? "√ success" : "❌ failure";
}

function appendSummary(lines) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }
  appendFileSync(summaryPath, lines.join(EOL) + EOL, "utf8");
}

function loadInstalledVersions() {
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

const versions = loadInstalledVersions();
const dependencies = directDependencyNames();
const docsBuild = run("docs:build", "pnpm", ["run", "docs:build"]);
const results = Object.fromEntries(
  CASES.map((caseName) => [
    caseName,
    Object.fromEntries(
      CHECKERS.map((checker) => [
        checker.name,
        run(
          `${checker.name} ${caseName}`,
          "pnpm",
          ["exec", checker.name, "-p", `tsconfig.case.${caseName}.json`, "--pretty", "false"],
        ),
      ]),
    ),
  ]),
);

const overallSuccess =
  isSuccessful(docsBuild) &&
  CASES.every((caseName) =>
    CHECKERS.every((checker) => isSuccessful(results[caseName][checker.name])),
  );

appendSummary([
  "## Versions",
  "",
  "| Package | Version |",
  "| --- | --- |",
  ...dependencies.map((name) => `| ${name} | ${versions[name] ?? "unknown"} |`),
  "",
  "## Build",
  "",
  "| Step | Outcome |",
  "| --- | --- |",
  `| docs:build | ${outcomeLabel(docsBuild)} |`,
  "",
  "## Typecheck Outcomes",
  "",
  "| Case | vue-tsc | vue-tsgo | golar |",
  "| --- | --- | --- | --- |",
  ...CASES.map(
      (caseName) =>
      `| ${caseName} | ${outcomeLabel(results[caseName]["vue-tsc"])} | ${outcomeLabel(results[caseName]["vue-tsgo"])} | ${outcomeLabel(results[caseName]["golar"])} |`,
  ),
  "",
  `Overall: ${overallSuccess ? "√ success" : "❌ failure"}`,
]);

if (!overallSuccess) {
  process.exit(1);
}
