// Exhaustive grid for per-node rotation alignment, under a fixed camera tilt.
//
// One scene crossing every rotation-relevant axis so a single snapshot guards
// the whole feature:
//   - rotationAlignment      (node shape: "viewport" vs "graph")
//   - labelRotationAlignment (label:      "viewport" vs "graph")
//   - shape                  (square / triangle / diamond)
//   - labelPosition          (right / left / above / below / over)
//   - labelAngle             (a fixed non-zero intrinsic angle)
//   - labelAttachment        (with / without)
//   - camera angle           (always tilted, so viewport vs graph actually differ)
//
// Layout: four blocks stacked vertically, one per (node, label) rotation combo.
// Each block is a 3 shapes x 5 positions grid. A regression in any rotation path
// (vertex quad, label box, frame-pass edge distance, attachment, backdrop)
// shifts pixels here.
import Graph from "graphology";
import Sigma from "sigma";
import { layerFill, sdfDiamond, sdfSquare, sdfTriangle } from "sigma/rendering";
import { DEFAULT_STYLES } from "sigma/types";
import type { LabelAttachmentContent, LabelAttachmentContext, LabelPosition, RotationAlignment } from "sigma/types";

const POSITIONS: LabelPosition[] = ["right", "left", "above", "below", "over"];
const SHAPES = ["square", "triangle", "diamond"] as const;

// The four rotation setups, each its own block.
const BLOCKS: { node: RotationAlignment; label: RotationAlignment }[] = [
  { node: "viewport", label: "viewport" },
  { node: "graph", label: "viewport" },
  { node: "viewport", label: "graph" },
  { node: "graph", label: "graph" },
];

const COLORS = ["#9242D5", "#5B8FF9", "#5AD8A6", "#F6BD16", "#E8684A"];

// Cell + block spacing in graph units (autoRescale fits them to the viewport).
const CELL_W = 110;
const CELL_H = 80;
const BLOCK_GAP = 60; // extra vertical gap between rotation blocks
const NODE_SIZE = 14;
const CAMERA_ANGLE = (25 * Math.PI) / 180; // fixed tilt: viewport vs graph diverge
const LABEL_ANGLE = (12 * Math.PI) / 180; // non-zero intrinsic label angle

// SVG pill showing the node's shape name, in its color — exercises the
// attachment program's placement under rotation.
const measureCtx = document.createElement("canvas").getContext("2d")!;
function drawBadge({ attributes }: LabelAttachmentContext): LabelAttachmentContent {
  const shape = attributes.shape as string;
  const color = attributes.color as string;
  measureCtx.font = "11px sans-serif";
  const width = Math.ceil(measureCtx.measureText(shape).width) + 12;
  return {
    type: "svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="18">
      <rect x="0" y="0" width="${width}" height="18" rx="4" fill="${color}" stroke="white" stroke-width="1px" />
      <text x="${width / 2}" y="13" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#ffffff">${shape}</text>
    </svg>`,
  };
}

export default (container: HTMLElement) => {
  const graph = new Graph();

  let yRow = 0; // running shape-row index across all blocks
  BLOCKS.forEach((block, blockIdx) => {
    SHAPES.forEach((shape) => {
      POSITIONS.forEach((position, posIdx) => {
        const id = `b${blockIdx}-${shape}-${position}`;
        graph.addNode(id, {
          // Rows run horizontally, positions vertically: keeps the grid wide and
          // short so it fills the landscape snapshot instead of a tall column.
          x: yRow * CELL_W + blockIdx * BLOCK_GAP,
          y: -(posIdx * CELL_H),
          size: NODE_SIZE,
          color: COLORS[posIdx],
          label: shape,
          shape,
          labelPosition: position,
          nodeRotation: block.node,
          labelRotation: block.label,
          // Attachment on for diamonds only -> covers the with/without axis
          // within every rotation block. Attachments are only drawn for nodes
          // with a visible backdrop (the placement reuses the backdrop's label
          // box), so diamonds also get a backdrop.
          attachment: shape === "diamond" ? "badge" : null,
          backdrop: shape === "diamond" ? "visible" : "hidden",
        });
      });
      yRow++;
    });
  });

  const renderer = new Sigma(graph, container, {
    primitives: {
      nodes: {
        shapes: [sdfSquare(), sdfTriangle(), sdfDiamond()],
        layers: [layerFill()],
        label: { margin: 8 },
        labelAttachments: { badge: drawBadge },
      },
    },
    styles: {
      nodes: [
        DEFAULT_STYLES.nodes,
        {
          shape: { attribute: "shape" },
          rotationAlignment: { attribute: "nodeRotation" },
          labelRotationAlignment: { attribute: "labelRotation" },
          labelColor: { attribute: "color" },
          labelBackgroundColor: "#ffffffcc",
          labelBackgroundPadding: 3,
          labelPosition: { attribute: "labelPosition", defaultValue: "right" },
          labelAngle: LABEL_ANGLE,
          labelSize: 11,
          labelVisibility: "visible",
          labelAttachment: { attribute: "attachment", defaultValue: null },
          // Backdrop on diamonds: required for their attachments to render, and
          // exercises the backdrop's per-node rotation path too.
          backdropVisibility: { attribute: "backdrop", defaultValue: "hidden" },
          backdropColor: "#ffffffee",
          backdropPadding: 6,
        },
      ],
    },
    settings: {
      itemSizesReference: "positions",
      zoomToSizeRatioFunction: (x: number) => x,
      autoRescale: true,
    },
  });

  // Fixed tilt so "viewport" and "graph" nodes/labels are visibly distinct.
  renderer.getCamera().setState({ angle: CAMERA_ANGLE });

  return renderer;
};
