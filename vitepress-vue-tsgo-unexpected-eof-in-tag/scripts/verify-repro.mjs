import { spawnSync } from "node:child_process";

function run(label, command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "pipe",
    shell: true,
    encoding: "utf8",
    ...options,
  });

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

  if (result.error) {
    throw result.error;
  }

  return { label, output, status: result.status ?? 1 };
}

function assertSuccess(step) {
  if (step.status !== 0) {
    process.stderr.write(step.output);
    throw new Error(`${step.label} was expected to succeed, but exited with ${step.status}.`);
  }
}

function assertExpectedFailure(step, pattern) {
  if (step.status === 0) {
    process.stdout.write(step.output);
    throw new Error(`${step.label} was expected to fail, but succeeded.`);
  }

  if (!pattern.test(step.output)) {
    process.stderr.write(step.output);
    throw new Error(`${step.label} failed, but did not contain the expected error pattern: ${pattern}.`);
  }
}

const build = run("docs:build", "pnpm", ["run", "docs:build"]);
assertSuccess(build);

const vueTsc = run("typecheck:vue-tsc", "pnpm", ["run", "typecheck:vue-tsc"]);
assertSuccess(vueTsc);

const vueTsgo = run("typecheck:vue-tsgo", "pnpm", ["run", "typecheck:vue-tsgo"]);
assertExpectedFailure(vueTsgo, /Unexpected EOF in tag\./);

process.stdout.write("Repro verified:\n");
process.stdout.write("- vitepress build passes\n");
process.stdout.write("- vue-tsc passes\n");
process.stdout.write("- vue-tsgo fails with \"Unexpected EOF in tag.\"\n");
