/**
 * Sigma.js Animation Helpers
 * ===========================
 *
 * Handy helper functions dealing with nodes & edges attributes animation.
 */
import { assign } from "./utils";
import * as easings from "./easings";

/**
 * Defaults.
 */
const ANIMATE_DEFAULTS = {
  easing: "quadraticInOut",
  duration: 150,
};

/**
 * Function used to animate the nodes.
 */
export function animateNodes(graph, targets, options, callback) {
  options = assign({}, ANIMATE_DEFAULTS, options);

  const easing = typeof options.easing === "function" ? options.easing : easings[options.easing];

  const start = Date.now();

  const startPositions = {};

  for (const node in targets) {
    const attrs = targets[node];
    startPositions[node] = {};

    for (const k in attrs) startPositions[node][k] = graph.getNodeAttribute(node, k);
  }

  let frame = null;

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
