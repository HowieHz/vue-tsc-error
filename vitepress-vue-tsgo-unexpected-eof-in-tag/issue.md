Title: vue-tsgo crashes with "Unexpected EOF in tag" for a VitePress Markdown file combining a template-literal attribute and later inline code

Vue - Official extension or vue-tsgo version
`vue-tsgo 0.2.0`

VSCode version
`N/A. Reproduction is prepared as a GitHub Actions workflow in this repo.`

Vue version
`3.5.33`

TypeScript version
`N/A directly in this repro. Triggered through vue-tsgo 0.2.0 and compared against vue-tsc 3.2.7.`

System Info
```shell
GitHub Actions target:
  OS: ubuntu-latest
Binaries:
  Node: 24
  pnpm: 10
```

package.json dependencies
```json
{
  "dependencies": {
    "vue": "^3.5.33"
  },
  "devDependencies": {
    "vitepress": "2.0.0-alpha.17",
    "vue-tsc": "^3.2.7",
    "vue-tsgo": "^0.2.0"
  }
}
```

Steps to reproduce
1. Open this reproduction project.
2. Run the GitHub Actions workflow at `.github/workflows/vitepress-vue-tsgo-unexpected-eof-in-tag.yml`.
3. Inspect `docs/index.md`.

What is expected?
Both `vue-tsgo` and `vue-tsc` should accept this valid VitePress Markdown file:

- the HTML template contains a valid Vue binding with a JavaScript template literal:

```vue
<button :title="`Page ${count}`" type="button">
  Visible page count: {{ count }}
</button>
```

- later Markdown prose contains ordinary inline code: `` `compat-finder` ``

What is actually happening?
The workflow is set up to verify that `pnpm run docs:build` succeeds, `pnpm run typecheck:vue-tsc` succeeds, and `pnpm run typecheck:vue-tsgo` fails during Markdown-to-SFC handling with:

```text
SyntaxError: Unexpected EOF in tag.
```

On the same project and the same `docs/index.md`, `vue-tsc` does not hit this crash.

This only happens when both conditions are present in the same Markdown file. If either:

- the template literal inside the HTML attribute is removed, or
- the later Markdown inline code is removed

then the crash goes away.
