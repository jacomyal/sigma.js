/**
 * Unit tests for computeFittedExtent.
 *
 * The helper grows a positions-only extent so node sizes (and labels) stay
 * within the default framing. It's a fixed-point iteration over the px↔unit
 * factor, so the tests pin both the invariants (no-op cases, expansion,
 * label direction) and the actual contract: re-projecting the fitted extent
 * with the same matrix sigma uses must keep every node's content on screen.
 */
import { describe, expect, test } from "vitest";

import { Coordinates, Dimensions, Extent } from "../types";
import { createNormalizationFunction, matrixFromCamera, multiplyVec2 } from "../utils";
import { NodeContentBox, computeFittedExtent } from "./fit-extent";

// Same reference framing the helper fits against (centered, unrotated, ratio 1).
const NULL_CAMERA_STATE = { x: 0.5, y: 0.5, angle: 0, ratio: 1 };

/** Re-projects a graph coord to viewport pixels under a given extent. */
function project(extent: { x: Extent; y: Extent }, coord: Coordinates, dims: Dimensions, padding: number): Coordinates {
  const normalize = createNormalizationFunction(extent);
  const graphDimensions = {
    width: extent.x[1] - extent.x[0] || 1,
    height: extent.y[1] - extent.y[0] || 1,
  };
  const matrix = matrixFromCamera(NULL_CAMERA_STATE, dims, graphDimensions, padding);
  const v = multiplyVec2(matrix, normalize(coord));
  return { x: ((1 + v.x) * dims.width) / 2, y: ((1 - v.y) * dims.height) / 2 };
}

const DIMS: Dimensions = { width: 200, height: 200 };

/** bbox of node positions — what the caller passes as the starting extent. */
function positionsExtent(coords: Record<string, Coordinates>): { x: Extent; y: Extent } {
  const xs = Object.values(coords).map((c) => c.x);
  const ys = Object.values(coords).map((c) => c.y);
  return { x: [Math.min(...xs), Math.max(...xs)], y: [Math.min(...ys), Math.max(...ys)] };
}

/** Builds the helper input with sensible defaults; nodes get a fixed size. */
function makeInput(
  coords: Record<string, Coordinates>,
  opts: {
    size?: number;
    itemSizesReference?: "screen" | "positions";
    fitLabels?: boolean;
    nodeLabelBox?: (data: { size: number }, radius: number) => NodeContentBox | null;
    extent?: { x: Extent; y: Extent };
  } = {},
) {
  const size = opts.size ?? 0;
  const nodeData: Record<string, { size: number }> = {};
  for (const k of Object.keys(coords)) nodeData[k] = { size };
  return {
    extent: opts.extent ?? positionsExtent(coords),
    coords,
    nodeData,
    dimensions: DIMS,
    stagePadding: 0,
    // Identity zoom so a "screen" radius equals `size` px exactly:
    zoomToSizeRatioFunction: (_: number) => 1,
    itemSizesReference: opts.itemSizesReference ?? "screen",
    fitLabels: opts.fitLabels ?? false,
    nodeLabelBox: opts.nodeLabelBox ?? (() => null),
  };
}

describe("computeFittedExtent", () => {
  test("returns the input extent unchanged when there are no nodes", () => {
    const extent = { x: [2, 8] as Extent, y: [-1, 5] as Extent };
    expect(computeFittedExtent(makeInput({}, { extent }))).toBe(extent);
  });

  test("is a no-op for zero-size nodes without labels", () => {
    const coords = { a: { x: 0, y: 0 }, b: { x: 10, y: 10 } };
    const out = computeFittedExtent(makeInput(coords, { size: 0 }));
    // With no radius and no labels the fit collapses back to the node bbox:
    expect(out.x[0]).toBeCloseTo(0);
    expect(out.x[1]).toBeCloseTo(10);
    expect(out.y[0]).toBeCloseTo(0);
    expect(out.y[1]).toBeCloseTo(10);
  });

  test("expands symmetrically around the graph center for uniform sizes", () => {
    const coords = { a: { x: 0, y: 0 }, b: { x: 10, y: 0 }, c: { x: 0, y: 10 }, d: { x: 10, y: 10 } };
    const out = computeFittedExtent(makeInput(coords, { size: 20 }));
    // Strictly larger than the [0,10]² positions extent...
    expect(out.x[0]).toBeLessThan(0);
    expect(out.x[1]).toBeGreaterThan(10);
    expect(out.y[0]).toBeLessThan(0);
    expect(out.y[1]).toBeGreaterThan(10);
    // ...and still centered on (5, 5):
    expect((out.x[0] + out.x[1]) / 2).toBeCloseTo(5);
    expect((out.y[0] + out.y[1]) / 2).toBeCloseTo(5);
    // Same growth on x and y (square graph, square viewport):
    expect(out.x[1] - out.x[0]).toBeCloseTo(out.y[1] - out.y[0]);
  });

  test("the fitted framing keeps every node's pixel radius on screen, tightly", () => {
    const coords = { a: { x: 0, y: 0 }, b: { x: 10, y: 0 }, c: { x: 0, y: 10 }, d: { x: 10, y: 10 } };
    const radius = 20; // screen px, since zoom is identity and size = 20
    const out = computeFittedExtent(makeInput(coords, { size: radius }));

    let minGap = Infinity;
    for (const coord of Object.values(coords)) {
      const p = project(out, coord, DIMS, 0);
      // Inside the viewport on all four sides (small slack for convergence):
      expect(p.x - radius).toBeGreaterThan(-0.5);
      expect(p.x + radius).toBeLessThan(DIMS.width + 0.5);
      expect(p.y - radius).toBeGreaterThan(-0.5);
      expect(p.y + radius).toBeLessThan(DIMS.height + 0.5);
      minGap = Math.min(minGap, p.x - radius, DIMS.width - (p.x + radius), p.y - radius, DIMS.height - (p.y + radius));
    }
    // Tight: the extremal nodes sit right against the edge (within the
    // convergence slack), rather than the framing leaving a wide empty margin.
    expect(minGap).toBeGreaterThan(-0.5);
    expect(minGap).toBeLessThan(0.5);
  });

  test("converges regardless of the starting extent (idempotent on its own output)", () => {
    const coords = { a: { x: 0, y: 0 }, b: { x: 10, y: 0 }, c: { x: 0, y: 10 }, d: { x: 10, y: 10 } };
    const once = computeFittedExtent(makeInput(coords, { size: 20 }));
    // Feeding the fitted extent back in must leave it (essentially) unchanged:
    const twice = computeFittedExtent(makeInput(coords, { size: 20, extent: once }));
    expect(twice.x[0]).toBeCloseTo(once.x[0]);
    expect(twice.x[1]).toBeCloseTo(once.x[1]);
    expect(twice.y[0]).toBeCloseTo(once.y[0]);
    expect(twice.y[1]).toBeCloseTo(once.y[1]);
  });

  test("grows the extent further on the label's side when fitting labels", () => {
    const coords = { a: { x: 0, y: 0 }, b: { x: 10, y: 0 } };
    // A right-pointing label box (px, relative to the node center):
    const rightLabel = () => ({ minX: 0, maxX: 120, minY: -10, maxY: 10 });
    const withLabels = computeFittedExtent(makeInput(coords, { size: 10, fitLabels: true, nodeLabelBox: rightLabel }));
    const withoutLabels = computeFittedExtent(makeInput(coords, { size: 10, fitLabels: false }));

    // Labels widen the whole extent (more graph units → fewer px/unit → larger
    // radii in graph units), so both sides move out. But the right-pointing
    // label must push the right side out much more than the left:
    const rightGrowth = withLabels.x[1] - withoutLabels.x[1];
    const leftGrowth = withoutLabels.x[0] - withLabels.x[0];
    expect(rightGrowth).toBeGreaterThan(0);
    expect(rightGrowth).toBeGreaterThan(leftGrowth);
  });

  test("ignores labels when fitLabels is false even if nodeLabelBox returns a box", () => {
    const coords = { a: { x: 0, y: 0 }, b: { x: 10, y: 0 } };
    const bigBox = () => ({ minX: -500, maxX: 500, minY: -500, maxY: 500 });
    const out = computeFittedExtent(makeInput(coords, { size: 10, fitLabels: false, nodeLabelBox: bigBox }));
    const sizeOnly = computeFittedExtent(makeInput(coords, { size: 10, fitLabels: false }));
    expect(out).toEqual(sizeOnly);
  });

  test("expands by exactly size/zoom graph units per side in positions mode", () => {
    const coords = { a: { x: 0, y: 0 }, b: { x: 10, y: 10 } };
    // In "positions" mode the radius is `size / zoom` graph units, independent
    // of the framing (radius_px = that × pixelsPerUnit, then ÷ pixelsPerUnit
    // back to units). With size 2 and identity zoom that's a flat 2-unit margin:
    const out = computeFittedExtent(makeInput(coords, { size: 2, itemSizesReference: "positions" }));
    expect(out.x[0]).toBeCloseTo(-2);
    expect(out.x[1]).toBeCloseTo(12);
    expect(out.y[0]).toBeCloseTo(-2);
    expect(out.y[1]).toBeCloseTo(12);
  });
});
