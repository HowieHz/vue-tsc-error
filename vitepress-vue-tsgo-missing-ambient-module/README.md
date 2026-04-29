# vitepress-vue-tsgo-missing-ambient-module

Minimal VitePress reproduction for checker differences around ambient module declarations in VitePress Markdown files.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck:vue-tsc
pnpm run typecheck:vue-tsgo
pnpm run typecheck:golar
pnpm run ci:repro
```

## Expected

All three checkers should accept a VitePress Markdown page that:

- imports `lunar-javascript` from `docs/index.md`
- provides an ambient declaration at `docs/.vitepress/types/browser/lunar-javascript.d.ts`
- includes that declaration file in `tsconfig.json`

## Actual

`vue-tsgo` reports `TS7016` for `lunar-javascript`, as if the declaration file was not loaded.

`vue-tsc` should accept the same project without this error. The CI workflow also runs `golar tsc` as a third comparison track.

## GitHub Actions

This repo includes a workflow that reproduces the issue in CI for this directory only.
