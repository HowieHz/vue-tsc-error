Title: vue-tsgo misparses VitePress Markdown fixtures containing backticks and can crash with "Unexpected EOF in tag"

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
3. Inspect the files under `docs/cases/`.

What is expected?
Both `vue-tsgo` and `vue-tsc` should accept these valid VitePress Markdown fixtures:

- `docs/cases/two-template-attrs.md`
- `docs/cases/two-inline-codes.md`
- `docs/cases/template-then-inline.md`
- `docs/cases/inline-then-template.md`

What is actually happening?
The workflow runs raw `vue-tsc` and `vue-tsgo` commands against each fixture. `vue-tsc` is used as the comparison baseline, while failing `vue-tsgo` runs expose the parser error directly in the Actions log, including errors like:

```text
SyntaxError: Unexpected EOF in tag.
```

The fixtures cover these four layouts:

- two HTML attributes containing JavaScript template literals
- two ordinary Markdown inline-code spans
- template-literal attribute first, then Markdown inline code
- Markdown inline code first, then template-literal attribute
