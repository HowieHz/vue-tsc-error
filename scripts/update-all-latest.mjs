#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');

const excludedDirs = new Set([
  '.git',
  '.github',
  '.idea',
  '.vscode',
  'node_modules',
  'scripts',
]);

const rawArgs = process.argv.slice(2);
const dryRun = rawArgs.includes('--dry-run');
const continueOnError = rawArgs.includes('--continue-on-error');

const separatorIndex = rawArgs.indexOf('--');
const forwardedArgs = separatorIndex === -1 ? [] : rawArgs.slice(separatorIndex + 1);
const unknownScriptArgs = rawArgs.filter((arg, index) => {
  if (separatorIndex !== -1 && index >= separatorIndex) return false;
  return arg !== '--dry-run' && arg !== '--continue-on-error';
});

if (unknownScriptArgs.length > 0) {
  console.error(`Unknown script option(s): ${unknownScriptArgs.join(', ')}`);
  console.error('Usage: node scripts/update-all-latest.mjs [--dry-run] [--continue-on-error] [-- <pnpm args>]');
  process.exit(1);
}

const projects = readdirSync(repoRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => !excludedDirs.has(entry.name))
  .map((entry) => ({
    name: entry.name,
    path: join(repoRoot, entry.name),
  }))
  .filter((project) => existsSync(join(project.path, 'package.json')))
  .sort((a, b) => a.name.localeCompare(b.name));

if (projects.length === 0) {
  console.log('No child projects with package.json found.');
  process.exit(0);
}

const pnpmArgs = ['update', '--latest', ...forwardedArgs];

function runPnpm(args, cwd) {
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', 'pnpm', ...args], {
      cwd,
      stdio: 'inherit',
    });
  }

  return spawnSync('pnpm', args, {
    cwd,
    stdio: 'inherit',
  });
}

console.log(`Found ${projects.length} child project(s).`);
console.log(`Command: pnpm ${pnpmArgs.join(' ')}`);

const failures = [];

for (const project of projects) {
  console.log(`\n==> ${project.name}`);

  if (dryRun) {
    console.log(`[dry-run] cd ${project.path}`);
    console.log(`[dry-run] pnpm ${pnpmArgs.join(' ')}`);
    continue;
  }

  const result = runPnpm(pnpmArgs, project.path);

  if (result.error) {
    failures.push(`${project.name}: ${result.error.message}`);
  } else if (result.status !== 0) {
    failures.push(`${project.name}: exited with code ${result.status}`);
  }

  if (failures.length > 0 && !continueOnError) {
    break;
  }
}

if (failures.length > 0) {
  console.error('\nUpdate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(dryRun ? '\nDry run finished.' : '\nAll child projects updated.');
