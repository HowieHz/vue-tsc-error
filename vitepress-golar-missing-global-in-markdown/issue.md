Title: golar tsc misses a missing identifier error that vue-tsc reports in a VitePress Markdown file

Tool versions
- `golar 0.1.7`
- `@golar/vue 0.1.7`
- `vue-tsc 3.2.7`

TypeScript version
- Inherited from the installed dependency graph used by these tools

System Info
```shell
System:
  OS: Windows 11
```

GitHub Actions
```yaml
ubuntu-latest
Node 24
pnpm 10
```

Steps to reproduce
1. Open this reproduction project.
2. Push the repo and trigger `.github/workflows/vitepress-golar-missing-global-in-markdown.yml`, or run it with `workflow_dispatch`.
3. Inspect the `Verify repro behavior` step.
4. Inspect `docs/index.md`.

What is expected?
`golar tsc` and `vue-tsc` should both agree on how `docs/index.md` is parsed.

What is actually happening?
In CI, `vue-tsc` passes without diagnostics.

`golar tsc` reports:

```text
docs/index.md(1,1): error TS1000000: Element is missing end tag.
docs/index.md(6,1): error TS1000000: Unexpected EOF in tag.
```

The reproduction workflow is intentionally scripted to assert this split behavior:

- `vue-tsc` must pass
- `golar` must fail
- the `golar` output must include both `TS1000000` diagnostics above
