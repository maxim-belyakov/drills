# Running a drill file

Measured on this Mac on 21.10.2026, the hour before the Regnology coding challenge. Nothing here needs installing.

## TypeScript

```bash
node myfile.ts
```

Node is v25.8.2, and since 23.6 it runs `.ts` directly - no flags, no `tsx`, no `ts-node`, no build step. Verified with a file using a type alias, a union type and `filter` over it.

While writing, keep it re-running on save:

```bash
node --watch myfile.ts
```

**What this mode does not do: it does not check types.** The types are stripped and the code runs. VS Code still underlines mistakes, the terminal will not. That is fine for a drill and worth remembering during a live round, where red squiggles are the only type checking there is.

Three things it refuses: `enum`, `namespace`, and constructor parameter properties (`constructor(private x: string)`). Rewrite those as plain code.

If types have to be checked, `deno` is installed and does check them:

```bash
deno run myfile.ts
```

## JavaScript and JSX drills

The React drills in `week-*` use the harness, not node directly:

```bash
npm run drill <file>
```

`.jsx` does not run in the Mac-side sandbox because esbuild there is a darwin build; run those in the cloud mirror with `lib/` from this repo.

## Java

```bash
./j SomeFile.java
```

H2 comes from `lib/h2.jar` through that launcher.

## Scratch

`scratch/` is ignored. Put throwaway files there instead of in a drill folder, so a half-finished experiment never looks like a drill that was abandoned.
