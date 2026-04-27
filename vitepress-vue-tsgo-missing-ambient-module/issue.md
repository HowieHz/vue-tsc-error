Title: vue-tsgo does not pick up an ambient module declaration for a package imported from a VitePress Markdown page

Vue - Official extension or vue-tsgo version
`vue-tsgo 0.2.0`

Vue version
`3.5.33`

System Info
```shell
System:
  OS: Windows 11
  Node: 25.9.0
  pnpm: 10.33.2
```

GitHub Actions
```yaml
ubuntu-latest
Node 24
pnpm 10
```

package.json dependencies
```json
{
  "dependencies": {
    "lunar-javascript": "^1.7.7",
    "vue": "^3.5.33"
  },
  "devDependencies": {
    "@typescript/native-preview": "7.0.0-dev.20260426.1",
    "vitepress": "2.0.0-alpha.17",
    "vue-tsc": "^3.2.7",
    "vue-tsgo": "^0.2.0"
  }
}
```

Steps to reproduce
1. Open this reproduction project.
2. Push the repo and trigger `.github/workflows/vitepress-vue-tsgo-missing-ambient-module.yml`, or run it with `workflow_dispatch`.
3. Inspect the `Verify repro behavior` step.
4. Inspect `docs/index.md` and `docs/.vitepress/types/browser/lunar-javascript.d.ts`.

What is expected?
Both CI checks should agree on this VitePress Markdown page. `vue-tsgo` should resolve the ambient declaration file and accept this import from `docs/index.md`:

```ts
import { Lunar, Solar, type SolarInstance } from "lunar-javascript";
```

What is actually happening?
In CI, `vue-tsc` passes first, then `vue-tsgo` reports:

```text
TS7016: Could not find a declaration file for module 'lunar-javascript'.
```

The declaration file exists and is explicitly included by `tsconfig.json`, but the checker still behaves as if it was not loaded.

The reproduction workflow is intentionally scripted to assert this split behavior:

- `vue-tsc` must pass
- `vue-tsgo` must fail
- the `vue-tsgo` output must include `TS7016` or `Could not find a declaration file for module 'lunar-javascript'`
