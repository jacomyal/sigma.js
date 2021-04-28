import naiveSample from "pandemonium/naive-sample";

import NAMES from "./resources/names.json";

export function getRandomName(): string {
  return naiveSample(2, NAMES).join(" ");
}

export function globalize(variables: Record<string, unknown>): void {
  for (const key in variables) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window[key] = variables[key];
  }
}
