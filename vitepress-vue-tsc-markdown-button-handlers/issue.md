Title: vue-tsc reports TS6133 for handlers referenced only by a VitePress Markdown template

Vue - Official extension or vue-tsc version
`vue-tsc 3.2.8`

VSCode version
`N/A. Reproduced with vue-tsc CLI.`

Vue version
`3.5.34`

TypeScript version
`6.0.3`

System Info
```shell
System:
  OS: Windows 11 10.0.26200
  CPU: (24) x64 AMD Ryzen AI 9 HX 370 w/ Radeon 890M
  Memory: 12.04 GB / 31.12 GB
Binaries:
  Node: 25.9.0
  npm: 11.12.1
  pnpm: 10.33.4
Browsers:
  Edge: Chromium (140.0.3485.54)
```

package.json dependencies
```json
{
  "dependencies": {
    "vue": "^3.5.34"
  },
  "devDependencies": {
    "vitepress": "2.0.0-alpha.17",
    "vue-tsc": "^3.2.8"
  }
}
```

Steps to reproduce
1. Open this reproduction project.
2. Run `pnpm install --ignore-workspace`.
3. Run `pnpm run typecheck`.
4. Inspect `docs/index.md`.

What is expected?
`vue-tsc` should understand that `stepTargetListPage()` and `startEditingTargetListPage()` are used because the Markdown template references them in `@click`.

What is actually happening?
`vue-tsc` reports `TS6133` for both functions even though the Markdown template calls them.
