/**
 * Sigma.js Animation Helpers
 * ===========================
 *
 * Handy helper functions dealing with nodes & edges attributes animation.
 * @module
 */
import Graph from "graphology-types";
import { PlainObject } from "../types";
import { cancelFrame, requestFrame } from "./index";
import easings from "./easings";

/**
 * Defaults.
 */
export type Easing = keyof typeof easings | ((k: number) => number);

export interface AnimateOptions {
  easing: Easing;
  duration: number;
}
export const ANIMATE_DEFAULTS = {
  easing: "quadraticInOut",
  duration: 150,
};

/**
 * Function used to animate the nodes.
 */
export function animateNodes(
  graph: Graph,
  targets: PlainObject<PlainObject<number>>,
  opts: Partial<AnimateOptions>,
  callback?: () => void,
): () => void {
  const options: AnimateOptions = Object.assign({}, ANIMATE_DEFAULTS, opts);

  const easing: (k: number) => number = typeof options.easing === "function" ? options.easing : easings[options.easing];

  const start = Date.now();

  const startPositions: PlainObject<PlainObject<number>> = {};

  for (const node in targets) {
    const attrs = targets[node];
    startPositions[node] = {};

    for (const k in attrs) startPositions[node][k] = graph.getNodeAttribute(node, k);
  }

  let frame: number | null = null;

  const step = () => {
    frame = null;

    let p = (Date.now() - start) / options.duration;

    if (p >= 1) {
      // Animation is done
      for (const node in targets) {
        const attrs = targets[node];

        // We use given values to avoid precision issues and for convenience
        for (const k in attrs) graph.setNodeAttribute(node, k, attrs[k]);
      }

      if (typeof callback === "function") callback();

      return;
    }

    p = easing(p);

    for (const node in targets) {
      const attrs = targets[node];
      const s = startPositions[node];

      for (const k in attrs) graph.setNodeAttribute(node, k, attrs[k] * p + s[k] * (1 - p));
    }

    frame = requestFrame(step);
  };

  step();

  return () => {
    if (frame) cancelFrame(frame);
  };
}
