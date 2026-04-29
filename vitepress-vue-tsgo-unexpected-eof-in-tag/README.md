# vitepress-vue-tsgo-unexpected-eof-in-tag

Minimal VitePress reproduction set for Markdown parsing differences around backticks in VitePress fixtures.

## CI Reproduce

Workflow file: `.github/workflows/vitepress-vue-tsgo-unexpected-eof-in-tag.yml`

The workflow:

- `pnpm run docs:build` succeeds
- runs raw `vue-tsc`, `vue-tsgo`, and `golar tsc` commands for each fixture
- records all outcomes in the Actions summary
- requires all three checkers to accept all four fixtures

## Local Commands

```bash
pnpm install --ignore-workspace
pnpm exec vue-tsgo -p tsconfig.case.template-then-inline.json --pretty false
pnpm exec vue-tsc -p tsconfig.case.template-then-inline.json --pretty false
pnpm exec golar tsc -b tsconfig.case.template-then-inline.json
```

## Fixtures

- `docs/cases/two-template-attrs.md`
- `docs/cases/two-inline-codes.md`
- `docs/cases/template-then-inline.md`
- `docs/cases/inline-then-template.md`

Each fixture has a matching `tsconfig.case.*.json` so CI can typecheck it in isolation.

## Actual

`vue-tsc`, `vue-tsgo`, and `golar tsc` are run against the same valid VitePress Markdown fixtures. The CI summary records which combinations pass and fail, and the workflow now expects all three checkers to accept all four fixtures.
