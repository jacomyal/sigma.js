/**
 * Sigma.js Fitted Extent
 * ======================
 *
 * Expands a node extent so node sizes (and, optionally, labels) stay within the
 * default framing, not just node positions. Drives `autoRescaleContent`.
 *
 * @module
 */
import { Coordinates, Dimensions, Extent } from "../types";
import { createNormalizationFunction, matrixFromCamera, multiplyVec2 } from "../utils";

/** Default camera: centered, unrotated, ratio 1 — the reference framing. */
const NULL_CAMERA_STATE = { x: 0.5, y: 0.5, angle: 0, ratio: 1 };
/** Iterations cap; the px<->unit fixed point converges geometrically. */
const MAX_ITERATIONS = 8;
/** Stop once the extent moves less than this fraction of its span. */
const CONVERGENCE_RATIO = 1e-3;

/** Axis-aligned box around a node center, viewport px (y points down). */
export interface NodeContentBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface FittedExtentInput<D extends { size: number }> {
  /** Starting extent (node positions only), in graph units. */
  extent: { x: Extent; y: Extent };
  /** Un-normalized node positions, keyed by node. */
  coords: Record<string, Coordinates>;
  /** Per-node display data; `size` drives the radius, the rest feeds nodeLabelBox. */
  nodeData: Record<string, D>;
  dimensions: Dimensions;
  stagePadding: number;
  zoomToSizeRatioFunction: (ratio: number) => number;
  itemSizesReference: "screen" | "positions";
  /** When set, grows each node's box to enclose its label. */
  fitLabels: boolean;
  /** Label AABB around the node center in viewport px, or null when none. */
  nodeLabelBox: (data: D, nodeRadius: number) => NodeContentBox | null;
}

/**
 * Returns an extent that frames node sizes (and labels, when `fitLabels` is set)
 * rather than only node positions.
 *
 * Node radii and labels are sized in fixed pixels (in `"screen"` mode, and
 * always for labels), while the extent is in graph units, so the px<->unit factor
 * depends on the resulting framing. We therefore iterate until it stabilizes; it
 * converges quickly, since content shrinks relative to the graph as the extent
 * grows. Returns the input extent unchanged when there are no nodes.
 */
export function computeFittedExtent<D extends { size: number }>(input: FittedExtentInput<D>): { x: Extent; y: Extent } {
  const {
    coords,
    nodeData,
    dimensions,
    stagePadding,
    zoomToSizeRatioFunction,
    itemSizesReference,
    fitLabels,
    nodeLabelBox,
  } = input;

  const keys = Object.keys(coords);
  if (!keys.length) return input.extent;

  // Node size at the default camera ratio (1), mirroring scaleSize(size, 1):
  const zoomAtDefault = zoomToSizeRatioFunction(1) || 1;
  const sizeInPositions = itemSizesReference === "positions";
  const { width, height } = dimensions;
  let extent = input.extent;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const normalize = createNormalizationFunction(extent);
    const graphDimensions = {
      width: extent.x[1] - extent.x[0] || 1,
      height: extent.y[1] - extent.y[0] || 1,
    };
    const matrix = matrixFromCamera(NULL_CAMERA_STATE, dimensions, graphDimensions, stagePadding);

    // Pixels per graph unit at the default framing (isotropic), via the same
    // framed-graph -> viewport projection sigma uses to render:
    const o = framedGraphToViewport(matrix, normalize({ x: 0, y: 0 }), width, height);
    const u = framedGraphToViewport(matrix, normalize({ x: 1, y: 0 }), width, height);
    const pixelsPerUnit = Math.hypot(u.x - o.x, u.y - o.y) || 1;

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let i = 0, l = keys.length; i < l; i++) {
      const node = keys[i];
      const data = nodeData[node];

      // Node radius in viewport pixels at the default framing. Derived from this
      // iteration's matrix (not the frame-lagged graphToViewportRatio), so the
      // fit is correct on the very first render:
      const radius = (data.size / zoomAtDefault) * (sizeInPositions ? pixelsPerUnit : 1);

      // Content box around the node center, in viewport pixels (y points down):
      let minX = -radius;
      let maxX = radius;
      let minY = -radius;
      let maxY = radius;
      if (fitLabels) {
        const box = nodeLabelBox(data, radius);
        if (box) {
          if (box.minX < minX) minX = box.minX;
          if (box.maxX > maxX) maxX = box.maxX;
          if (box.minY < minY) minY = box.minY;
          if (box.maxY > maxY) maxY = box.maxY;
        }
      }

      // Back to graph units (viewport y is flipped relative to graph y):
      const { x, y } = coords[node];
      xMin = Math.min(xMin, x + minX / pixelsPerUnit);
      xMax = Math.max(xMax, x + maxX / pixelsPerUnit);
      yMin = Math.min(yMin, y - maxY / pixelsPerUnit);
      yMax = Math.max(yMax, y - minY / pixelsPerUnit);
    }

    const next = { x: [xMin, xMax] as Extent, y: [yMin, yMax] as Extent };
    const span = Math.max(next.x[1] - next.x[0], next.y[1] - next.y[0]) || 1;
    const delta = Math.max(
      Math.abs(next.x[0] - extent.x[0]),
      Math.abs(next.x[1] - extent.x[1]),
      Math.abs(next.y[0] - extent.y[0]),
      Math.abs(next.y[1] - extent.y[1]),
    );
    extent = next;
    if (delta / span < CONVERGENCE_RATIO) break;
  }

  return extent;
}

/** framed-graph (normalized) -> viewport pixels; mirrors Sigma#framedGraphToViewport. */
function framedGraphToViewport(matrix: Float32Array, coords: Coordinates, width: number, height: number): Coordinates {
  const v = multiplyVec2(matrix, coords);
  return { x: ((1 + v.x) * width) / 2, y: ((1 - v.y) * height) / 2 };
}
