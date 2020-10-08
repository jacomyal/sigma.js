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

  const startPositions: { [key: string]: any } = {};

  Object.keys(targets).forEach((nodeKey: string) => {
    const attrs: Partial<SigmaNode> = targets[nodeKey];
    startPositions[nodeKey] = {};
    Object.keys(attrs).forEach((attrName: string) => {
      const attrValue: any = graph.getNodeAttribute(nodeKey, attrName);
      startPositions[nodeKey][attrName] = attrValue;
    });
  });

  let frame: number | null = null;

  const step = () => {
    let p = (Date.now() - start) / options.duration;

    if (p >= 1) {
      // Animation is done
      Object.keys(targets).forEach((nodeKey: string) => {
        const attrs: { [key: string]: any } = targets[nodeKey];
        Object.keys(attrs).forEach((attrName: string) => {
          const attrValue: any = attrs[attrName];
          graph.setNodeAttribute(nodeKey, attrName, attrValue);
        });
      });

      if (typeof callback === "function") callback();

      return;
    }

    p = easing(p);

    Object.keys(targets).forEach((nodeKey: string) => {
      const attrs: { [key: string]: any } = targets[nodeKey];
      const s: any = startPositions[nodeKey];

      Object.keys(attrs).forEach((attrName: string) => {
        const attrValue: any = attrs[attrName];
        graph.setNodeAttribute(nodeKey, attrName, attrValue * p + s[attrName] * (1 - p));
      });
    });

    frame = requestAnimationFrame(step);
  };

  step();

  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}
