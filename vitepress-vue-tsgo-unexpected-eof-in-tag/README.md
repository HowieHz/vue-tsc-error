# vitepress-vue-tsgo-unexpected-eof-in-tag

Minimal VitePress reproduction for a `vue-tsgo` Markdown parsing failure.

## Reproduce

```bash
pnpm install --ignore-workspace
pnpm run typecheck:vue-tsgo
pnpm run typecheck:vue-tsc
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
