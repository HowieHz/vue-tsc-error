import { spawnSync } from "node:child_process";

function run(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";

  console.log(`::group::${label}`);
  if (stdout) {
    process.stdout.write(stdout);
  }
  if (stderr) {
    process.stderr.write(stderr);
  }
  console.log("::endgroup::");

  return {
    status: result.status,
    output: `${stdout}${stderr}`,
  };
}

const vueTsc = run("vue-tsc", "pnpm", ["run", "typecheck:vue-tsc"]);

if (vueTsc.status !== 0) {
  console.error("Expected vue-tsc to pass, but it failed.");
  process.exit(1);
}

const vueTsgo = run("vue-tsgo", "pnpm", ["run", "typecheck:vue-tsgo"]);

if (vueTsgo.status === 0) {
  console.error("Expected vue-tsgo to fail, but it passed.");
  process.exit(1);
}

const expectedFragments = [
  "Could not find a declaration file for module 'lunar-javascript'",
  "TS7016",
];

const matched = expectedFragments.some((fragment) => vueTsgo.output.includes(fragment));

if (!matched) {
  console.error("vue-tsgo failed, but the expected TS7016 diagnostics were not found in output.");
  process.exit(1);
}

console.log("Reproduction confirmed: vue-tsc passes and vue-tsgo reports TS7016 for lunar-javascript.");
