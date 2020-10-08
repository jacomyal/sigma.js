/**
 * Sigma.js Animation Helpers
 * ===========================
 *
 * Handy helper functions dealing with nodes & edges attributes animation.
 */
import { AbstractGraph, NodeEntry } from "graphology-types";
import { assign } from "./utils";
import { Coordinates } from "./captors/utils";
import easings from "./easings";
import { SigmaNode } from "./renderers/webgl/settings";

/**
 * Defaults.
 */
export interface AnimateOptions {
  easing: string | ((k: number) => number);
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
  graph: AbstractGraph,
  targets: { [key: string]: Partial<SigmaNode> },
  opts: Partial<AnimateOptions>,
  callback: () => void,
) {
  const options: AnimateOptions = assign<AnimateOptions>({}, ANIMATE_DEFAULTS, opts);

  const easing: (k: number) => number = typeof options.easing === "function" ? options.easing : easings[options.easing];

  const start = Date.now();

  const startPositions: { [key: string]: Partial<SigmaNode> } = {};

  Object.keys(targets).forEach((nodeKey: string) => {
    const node: Partial<SigmaNode> = targets[nodeKey];
    startPositions[nodeKey] = {};
    Object.keys(node).forEach((attrName: string) => {
      startPositions[nodeKey][attrName] = graph.getNodeAttribute(nodeKey, attrName);
    });
  });

  let frame: number | null = null;

  const step = () => {
    let p = (Date.now() - start) / options.duration;

    if (p >= 1) {
      // Animation is done
      for (const node in targets) {
        const attrs = targets[node];

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

    frame = requestAnimationFrame(step);
  };

  step();

  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}
