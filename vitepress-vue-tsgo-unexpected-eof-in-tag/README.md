# vitepress-vue-tsgo-unexpected-eof-in-tag

Minimal VitePress reproduction for a `vue-tsgo` Markdown parsing failure.

## CI Reproduce

Workflow file: `.github/workflows/vitepress-vue-tsgo-unexpected-eof-in-tag.yml`

The workflow verifies this exact behavior:

- `pnpm run docs:build` succeeds
- `pnpm run typecheck:vue-tsc` succeeds
- `pnpm run typecheck:vue-tsgo` fails with `SyntaxError: Unexpected EOF in tag.`

## Local Commands

```bash
pnpm install --ignore-workspace
pnpm run ci:repro
```

## Expected

Both `vue-tsgo` and `vue-tsc` should accept a valid VitePress Markdown page that contains:

- a template attribute using a JavaScript template literal
- ordinary Markdown prose with inline code later in the same file

## Actual

`vue-tsgo` crashes with:

```txt
SyntaxError: Unexpected EOF in tag.
```

`vue-tsc` accepts the same file without this crash.

This minimal repro uses:

- a visible button with a valid `` :title="`Page ${count}`" `` template expression
- a later Markdown list item containing inline code: `` `compat-finder` ``

If either the template literal in the HTML attribute or the later Markdown inline code is removed, the failure goes away.
