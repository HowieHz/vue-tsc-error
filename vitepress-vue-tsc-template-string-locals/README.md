# vitepress-vue-tsc-template-string-locals

Minimal VitePress reproduction for checker differences around template-string locals in VitePress Markdown files.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck:vue-tsc
pnpm run typecheck:vue-tsgo
pnpm run typecheck:golar
pnpm run ci:repro
```

## Expected

All three checkers should treat helper parameters and locals as used when they are referenced inside a template string returned from a helper that is called by the Markdown template.

## Actual

`vue-tsc` reports `TS6133` for `hourValue`, `start`, and `end` in `docs/index.md`.

The CI workflow runs `vue-tsc`, `vue-tsgo`, and `golar tsc`, records all three outcomes, and currently expects both `vue-tsc` and `golar` to reproduce the TS6133 diagnostics.
