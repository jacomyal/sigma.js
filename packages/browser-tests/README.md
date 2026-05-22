# @sigma/browser-tests

Browser tests for sigma.js, run with [Playwright](https://playwright.dev/). Two
suites:

- **`examples/`**: screenshots every documented website example. A broad "did
  anything obviously break" check.
- **`regression/`**: one scenario per specific bug.

Pure-logic and type tests do **not** belong here:

| Test kind                                | Tool             | Lives in                         |
| ---------------------------------------- | ---------------- | -------------------------------- |
| Pure logic (no browser)                  | vitest           | the package that owns the code   |
| Type (`*.test-d.ts`)                     | vitest typecheck | the package whose types it tests |
| Browser (canvas / WebGL / DOM rendering) | Playwright       | here                             |

"Regression" is a motive, not a kind: a `camera.ts` math regression is a vitest
unit test; a rendering regression is a Playwright scenario here.

## Running

```sh
npm run test:e2e                       # from this package or the repo root
npm run test:e2e -- --update-snapshots # regenerate snapshots
```

Playwright starts the dev servers itself: the website (for `examples/`) and a
Vite server (for `regression/`).

## Snapshots are Chromium-only

WebGL output depends on the GPU driver, so `playwright.config.ts` pins Chromium
to SwiftShader (software rendering) for every run — local and CI — which makes
screenshots byte-stable. That pinning is Chromium-only, so pixel snapshots stay
Chromium-only. Never regenerate snapshots on a setup that bypasses that config.

## Regression scenarios

A scenario is a single file in `regression/scenarios/`:

```ts
// One sentence: which bug this reproduces.
import Graph from "graphology";
import Sigma from "sigma";

export default (container: HTMLElement) => {
  const graph = new Graph();
  /* …build the graph that triggers the bug… */
  return new Sigma(graph, container, {
    /* … */
  });
};
```

`regression.test.ts` discovers every scenario file and screenshots it. Adding a
scenario needs no other change. The host page renders it and waits for Sigma to
go idle before screenshotting, so **a scenario must reach a steady state** (no
infinite animation or layout).

To browse scenarios manually: `npm run serve:regression`, then open the printed
URL.
