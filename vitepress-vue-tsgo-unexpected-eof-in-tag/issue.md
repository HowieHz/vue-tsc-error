Title: vue-tsgo crashes with "Unexpected EOF in tag" for a VitePress Markdown file combining a template-literal attribute and later inline code

Vue - Official extension or vue-tsgo version
`vue-tsgo 0.2.0`

VSCode version
`N/A. Reproduced with vue-tsgo CLI.`

Vue version
`3.5.33`

TypeScript version
`N/A directly in this repro. Triggered through vue-tsgo 0.2.0.`

System Info
```shell
System:
  OS: Windows 11 10.0.26200
  CPU: (24) x64 AMD Ryzen AI 9 HX 370 w/ Radeon 890M
Binaries:
  Node: 25.9.0
  pnpm: 10.33.2
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
2. Run `pnpm install --ignore-workspace`.
3. Run `pnpm run typecheck:vue-tsgo`.
4. Run `pnpm run typecheck:vue-tsc`.
5. Inspect `docs/index.md`.

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
`vue-tsgo` crashes during Markdown-to-SFC handling with:

```text
SyntaxError: Unexpected EOF in tag.
```

On the same project and the same `docs/index.md`, `vue-tsc` does not hit this crash.

This only happens when both conditions are present in the same Markdown file. If either:

- the template literal inside the HTML attribute is removed, or
- the later Markdown inline code is removed

then the crash goes away.
