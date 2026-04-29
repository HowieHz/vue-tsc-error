# vitepress-vue-tsc-nested-template-expr

Minimal VitePress reproduction for checker differences around nested template literals in VitePress Markdown files.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck:vue-tsc
pnpm run typecheck:vue-tsgo
pnpm run typecheck:golar
pnpm run ci:repro
```

## Expected

All three checkers should accept a valid nested template literal inside `<script setup lang="ts">` in a VitePress Markdown file.

## Actual

`vue-tsc` reports `TS1005` parse errors for this valid expression:

```ts
const label = `Zodiac ${zodiac}${zodiacEmoji ? ` ${zodiacEmoji}` : ""}`;
```

The CI workflow runs `vue-tsc`, `vue-tsgo`, and `golar tsc`, records all three outcomes, and currently expects both `vue-tsc` and `golar` to reproduce the TS1005 diagnostics.
