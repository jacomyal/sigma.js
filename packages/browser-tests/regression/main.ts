/// <reference types="vite/client" />
/**
 * Regression host page. `/?s=<name>` renders one scenario and marks the page
 * ready once Sigma settles; `/` lists every scenario.
 */
import type Sigma from "sigma";

type Scenario = (container: HTMLElement) => Sigma | Promise<Sigma>;

// Every scenario module, keyed by file path:
const modules = import.meta.glob<{ default: Scenario }>("./scenarios/*.ts");
const nameOf = (path: string) => path.split("/").pop()!.replace(/\.ts$/, "");

const selected = new URLSearchParams(location.search).get("s");

if (!selected) {
  document.body.innerHTML = `<h1>Regression scenarios</h1><ul>${Object.keys(modules)
    .map(nameOf)
    .sort()
    .map((name) => `<li><a href="?s=${name}">${name}</a></li>`)
    .join("")}</ul>`;
} else {
  const entry = Object.entries(modules).find(([path]) => nameOf(path) === selected);
  if (!entry) throw new Error(`Unknown scenario: ${selected}`);
  const stage = document.getElementById("stage") as HTMLElement;
  entry[1]()
    .then(({ default: scenario }) => scenario(stage))
    .then(awaitIdle)
    .then(() => {
      document.documentElement.dataset.ready = "";
    });
}

// Resolves once Sigma has not rendered for `quietMs`. This lets async glyph
// generation and camera animations finish without a fixed sleep:
function awaitIdle(sigma: Sigma, quietMs = 300): Promise<void> {
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout>;
    const settle = () => {
      sigma.off("afterRender", onRender);
      resolve();
    };
    const onRender = () => {
      clearTimeout(timer);
      timer = setTimeout(settle, quietMs);
    };
    sigma.on("afterRender", onRender);
    timer = setTimeout(settle, quietMs);
  });
}
