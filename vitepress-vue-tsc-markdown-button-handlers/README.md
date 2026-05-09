# vitepress-vue-tsc-markdown-button-handlers

Minimal VitePress reproduction for `TS6133` false positives on handlers that are used only from a VitePress Markdown template.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck:vue-tsc
pnpm run typecheck:vue-tsgo
pnpm run typecheck:golar
pnpm run ci:repro
```

## Expected

All checkers should treat `stepTargetListPage()` and `startEditingTargetListPage()` as used because both are referenced by `@click` handlers in `docs/index.md`.

## Actual

`vue-tsc` reports `TS6133` for both functions even though they are called from the Markdown template.

The CI script records `vue-tsc`, `vue-tsgo`, and `golar tsc` outcomes and currently requires the `vue-tsc` repro to stay active.
