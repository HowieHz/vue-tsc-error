# vitepress-vue-tsc-template-string-locals

Minimal VitePress reproduction for a `vue-tsc` false positive in Markdown files.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck
```

## Expected

`vue-tsc` should treat helper parameters and locals as used when they are referenced inside a template string returned from a helper that is called by the Markdown template.

## Actual

`vue-tsc` reports `TS6133` for `hourValue`, `start`, and `end` in `docs/index.md`.
