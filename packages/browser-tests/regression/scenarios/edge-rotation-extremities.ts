// Edge clamping against rotated, non-circular nodes — the edge frame-pass path.
//
// Every edge is a *curved* arc between two non-circular nodes, carries an arrow
// on *both* ends, and has a labelled body with a background ribbon. The
// endpoints mix per-node rotation alignment ("graph" rotates with the camera,
// "viewport" does not), so under a fixed camera tilt the edge frame-pass must
// clamp each end to the *rotated* node boundary independently. Curvature also
// drives the per-edge straightening near the extremities. A regression moves
// the arrow tips off the node edge, breaks the straighten blend, or drifts the
// label/background (both read the edge-frame texel) away from the body.
//
// Layout: four blocks stacked vertically, one per (tail, head) rotation combo.
// Each block is a 3-column grid of shape pairs, so every shape appears at both
// a source and a target end, under every rotation mix.
import Graph from "graphology";
import Sigma from "sigma";
import { extremityArrow, layerFill, layerPlain, pathCurved, sdfDiamond, sdfSquare, sdfTriangle } from "sigma/rendering";
import { DEFAULT_STYLES } from "sigma/types";
import type { EdgeLabelPosition, RotationAlignment } from "sigma/types";

type Shape = "square" | "triangle" | "diamond";

// Every shape sits at both a source and a target end across the three columns.
const SHAPE_PAIRS: [Shape, Shape][] = [
  ["square", "triangle"],
  ["triangle", "diamond"],
  ["diamond", "square"],
];

// The four rotation setups, each its own block. "graph" ends rotate with the
// camera, "viewport" ends stay axis-aligned.
// Each block gets a distinct, clearly-visible ribbon color so the backgrounds
// are observable against the white canvas.
const BLOCKS: {
  tail: RotationAlignment;
  head: RotationAlignment;
  labelPosition: EdgeLabelPosition;
  background: string;
}[] = [
  { tail: "graph", head: "graph", labelPosition: "above", background: "#ffd15c" },
  { tail: "viewport", head: "viewport", labelPosition: "below", background: "#8ecae6" },
  { tail: "graph", head: "viewport", labelPosition: "over", background: "#a7e8a0" },
  { tail: "viewport", head: "graph", labelPosition: "above", background: "#e3b6ff" },
];

const SHAPE_COLOR: Record<Shape, string> = {
  square: "#5B8FF9",
  triangle: "#5AD8A6",
  diamond: "#F6BD16",
};
const SHAPE_ABBR: Record<Shape, string> = { square: "sq", triangle: "tri", diamond: "dia" };

// Per-column base curvature; sign flips on alternate rows for variety. Non-zero
// everywhere so no edge degenerates to a straight line.
const CURVATURE = [0.45, -0.3, 0.35];

// Graph-unit geometry (autoRescale fits the whole grid to the viewport).
const NODE_SIZE = 16;
const EDGE_SIZE = 4;
const EDGE_LEN = 130; // source->target distance within a cell
const COL_PITCH = 190; // horizontal distance between cells
const ROW_PITCH = 95; // vertical distance between rotation blocks
const CAMERA_ANGLE = (25 * Math.PI) / 180; // fixed tilt: viewport vs graph diverge
// Zoom out: the tilt + curvature push the grid corners past the auto-rescaled
// fit, so back the camera off to keep every cell on screen.
const CAMERA_RATIO = 2;

export default (container: HTMLElement) => {
  const graph = new Graph();

  BLOCKS.forEach((block, blockIdx) => {
    const y = -(blockIdx * ROW_PITCH);
    SHAPE_PAIRS.forEach(([srcShape, tgtShape], col) => {
      const xLeft = col * COL_PITCH;
      const src = `b${blockIdx}-c${col}-src`;
      const tgt = `b${blockIdx}-c${col}-tgt`;

      graph.addNode(src, {
        x: xLeft,
        y,
        size: NODE_SIZE,
        color: SHAPE_COLOR[srcShape],
        shape: srcShape,
        nodeRotation: block.tail,
      });
      graph.addNode(tgt, {
        x: xLeft + EDGE_LEN,
        y,
        size: NODE_SIZE,
        color: SHAPE_COLOR[tgtShape],
        shape: tgtShape,
        nodeRotation: block.head,
      });

      graph.addEdge(src, tgt, {
        size: EDGE_SIZE,
        color: "#8a97a8",
        curvature: CURVATURE[col] * (blockIdx % 2 === 0 ? 1 : -1),
        label: `${SHAPE_ABBR[srcShape]}->${SHAPE_ABBR[tgtShape]}`,
        labelPosition: block.labelPosition,
        labelBackgroundColor: block.background,
      });
    });
  });

  const renderer = new Sigma(graph, container, {
    primitives: {
      nodes: {
        shapes: [sdfSquare(), sdfTriangle(), sdfDiamond()],
        layers: [layerFill()],
      },
      edges: {
        paths: [pathCurved()],
        // Single arrow definition, used for both ends (head + tail).
        extremities: [extremityArrow({ lengthRatio: 4, widthRatio: 4 })],
        layers: [layerPlain()],
        label: { color: "#1c1c1c" },
      },
    },
    styles: {
      nodes: [
        DEFAULT_STYLES.nodes,
        {
          shape: { attribute: "shape" },
          color: { attribute: "color" },
          rotationAlignment: { attribute: "nodeRotation" },
        },
      ],
      edges: [
        DEFAULT_STYLES.edges,
        {
          size: { attribute: "size" },
          color: { attribute: "color" },
          path: "curved",
          // Arrows on both ends -> exercises source and target clamp + gating.
          head: "arrow",
          tail: "arrow",
          labelVisibility: "visible",
          labelPosition: { attribute: "labelPosition", defaultValue: "auto" },
          labelSize: 11,
          labelBackgroundColor: { attribute: "labelBackgroundColor" },
          labelBackgroundPadding: 4,
        },
      ],
    },
    settings: {
      renderEdgeLabels: true,
      itemSizesReference: "positions",
      zoomToSizeRatioFunction: (x: number) => x,
      autoRescale: true,
    },
  });

  // Fixed tilt so "viewport" and "graph" endpoints clamp to visibly different
  // node boundaries; zoomed out so the rotated grid stays fully on screen.
  renderer.getCamera().setState({ angle: CAMERA_ANGLE, ratio: CAMERA_RATIO });

  return renderer;
};
