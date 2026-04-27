# vitepress-vue-tsgo-unexpected-eof-in-tag

Minimal VitePress reproduction set for `vue-tsgo` Markdown parsing failures around backticks.

## CI Reproduce

Workflow file: `.github/workflows/vitepress-vue-tsgo-unexpected-eof-in-tag.yml`

The workflow:

- `pnpm run docs:build` succeeds
- runs raw `vue-tsc` and `vue-tsgo` commands for each fixture
- leaves the original `vue-tsgo` error output visible in the Actions logs
- fails if all four `vue-tsgo` fixture runs succeed unexpectedly

## Local Commands

```bash
pnpm install --ignore-workspace
pnpm exec vue-tsgo -p tsconfig.case.template-then-inline.json --pretty false
pnpm exec vue-tsc -p tsconfig.case.template-then-inline.json --pretty false
```

## Fixtures

- `docs/cases/two-template-attrs.md`
- `docs/cases/two-inline-codes.md`
- `docs/cases/template-then-inline.md`
- `docs/cases/inline-then-template.md`

Each fixture has a matching `tsconfig.case.*.json` so CI can typecheck it in isolation.

## Actual

`vue-tsgo` and `vue-tsc` are run against the same valid VitePress Markdown fixtures. The CI summary records which combinations pass and fail, and the failing `vue-tsgo` steps expose the raw parser error directly in the log output.
