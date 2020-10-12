/**
 * Sigma.js Animation Helpers
 * ===========================
 *
 * Handy helper functions dealing with nodes & edges attributes animation.
 */
import Graph from "graphology";
import { assign, PlainObject } from "./utils";
import easings from "./easings";
import { NodeAttributes } from "./types";

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
  graph: Graph,
  targets: PlainObject<PlainObject<number>>,
  opts: Partial<AnimateOptions>,
  callback: () => void,
): () => void {
  const options: AnimateOptions = assign<AnimateOptions>({}, ANIMATE_DEFAULTS, opts);

  const easing: (k: number) => number = typeof options.easing === "function" ? options.easing : easings[options.easing];

  const start = Date.now();

  const startPositions: PlainObject<PlainObject<number>> = {};

  Object.keys(targets).forEach((nodeKey: string) => {
    const attrs: Partial<NodeAttributes> = targets[nodeKey];
    startPositions[nodeKey] = {};
    Object.keys(attrs).forEach((attrName: string) => {
      startPositions[nodeKey][attrName] = graph.getNodeAttribute(nodeKey, attrName) as number;
    });
  });

  let frame: number | null = null;

  const step = () => {
    let p = (Date.now() - start) / options.duration;

    if (p >= 1) {
      // Animation is done
      Object.keys(targets).forEach((nodeKey: string) => {
        const nodeAttrsTarget: PlainObject<number> = targets[nodeKey];

        Object.keys(nodeAttrsTarget).forEach((attrName: string) => {
          graph.setNodeAttribute(nodeKey, attrName, nodeAttrsTarget[attrName]);
        });
      });

      if (typeof callback === "function") callback();

      return;
    }

    p = easing(p);

    Object.keys(targets).forEach((nodeKey: string) => {
      const attrs: PlainObject<number> = targets[nodeKey];
      const s: PlainObject<number> = startPositions[nodeKey];

      Object.keys(attrs).forEach((attrName: string) => {
        graph.setNodeAttribute(nodeKey, attrName, attrs[attrName] * p + s[attrName] * (1 - p));
      });
    });

    frame = requestAnimationFrame(step);
  };

  step();

  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}
