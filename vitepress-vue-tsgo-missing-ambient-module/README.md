# vitepress-vue-tsgo-missing-ambient-module

Minimal VitePress reproduction for a `vue-tsgo` module declaration resolution failure.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck:vue-tsgo
pnpm run typecheck:vue-tsc
```

## Expected

Both `vue-tsgo` and `vue-tsc` should accept a VitePress Markdown page that:

- imports `lunar-javascript` from `docs/index.md`
- provides an ambient declaration at `docs/.vitepress/types/browser/lunar-javascript.d.ts`
- includes that declaration file in `tsconfig.json`

## Actual

`vue-tsgo` reports `TS7016` for `lunar-javascript`, as if the declaration file was not loaded.

`vue-tsc` should accept the same project without this error.
