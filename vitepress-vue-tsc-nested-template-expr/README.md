# vitepress-vue-tsc-nested-template-expr

Minimal VitePress reproduction for a `vue-tsc` parsing failure in Markdown files.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck
```

## Expected

`vue-tsc` should accept a valid nested template literal inside `<script setup lang="ts">` in a VitePress Markdown file.

## Actual

`vue-tsc` reports `TS1005` parse errors for this valid expression:

```ts
const label = `Zodiac ${zodiac}${zodiacEmoji ? ` ${zodiacEmoji}` : ""}`;
```

The same JavaScript expression runs correctly in Node.js. This repro keeps everything else minimal so the failure stays focused on VitePress Markdown handling.
