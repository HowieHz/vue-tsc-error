# vitepress-golar-missing-global-in-markdown

Minimal VitePress reproduction where `golar tsc` and `vue-tsc` disagree on a missing identifier inside a Markdown SFC script block.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck:golar
pnpm run typecheck:vue-tsc
pnpm run ci:repro
```

## Expected

Both tools should agree on the same Markdown parsing result for `docs/index.md`.

## Actual

`vue-tsc` passes without diagnostics.

`golar tsc` reports:

- `docs/index.md(1,1): error TS1000000: Element is missing end tag.`
- `docs/index.md(6,1): error TS1000000: Unexpected EOF in tag.`

## GitHub Actions

This repo includes a workflow that reproduces the issue in CI for this directory only.
