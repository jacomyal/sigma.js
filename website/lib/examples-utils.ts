import { Example } from "./types";

/**
 * Returns the URL of a given example.
 */
export function getExampleURL(example: Example) {
  return `/examples/${example.name}`;
}
