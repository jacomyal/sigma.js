/**
 * Unit tests for LabelRenderer.nodeLabelBox.
 *
 * nodeLabelBox is the CPU mirror of the GLSL label placement (glsl.ts
 * labelBoxCenter + the label/background vertex shaders). It drives
 * `autoRescaleContent: "labels"`, so it must stay in lockstep with the
 * shaders. These tests pin the placement math (position, margin, padding,
 * angle, textHeight) so any drift from the GPU side is caught here, not only
 * in the browser PNG regressions.
 */
import { describe, expect, test } from "vitest";

import { LabelRenderer } from "./label-renderer";
import type { SigmaInternals } from "./sigma-internals";

type Measure = { width: number; height: number; textHeight: number };

/**
 * Builds a LabelRenderer over a fake internals where `measureLabel` returns a
 * fixed size, so the box geometry is fully determined by the inputs we assert.
 */
function makeRenderer(measure: Measure, margin?: number): LabelRenderer {
  const labelProgram = {
    registerFont: () => "font-key",
    measureLabel: () => measure,
  };
  const primitives = margin === undefined ? null : { nodes: { label: { margin } } };
  const internals = { labelProgram, primitives } as unknown as SigmaInternals;
  return new LabelRenderer(internals);
}

// width/height = label line box;
// textHeight = actual glyph height (smaller than the line box, like the GPU's
// a_textHeight) so above/below tests distinguish the two.
const MEASURE: Measure = { width: 40, height: 20, textHeight: 16 };
const RADIUS = 10;
// Default label margin is 5, so start = RADIUS + 5 = 15.
const START = 15;

describe("LabelRenderer.nodeLabelBox", () => {
  test("places a right label past the node, half-width offset, height-tall", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox({ label: "x", labelPosition: "right" }, RADIUS);
    // cx = start + width/2 = 15 + 20 = 35; box half-extents 20 x 10.
    expect(box).toEqual({ minX: START, maxX: START + 40, minY: -10, maxY: 10 });
  });

  test("defaults to the right position", () => {
    const right = makeRenderer(MEASURE).nodeLabelBox({ label: "x", labelPosition: "right" }, RADIUS);
    const dflt = makeRenderer(MEASURE).nodeLabelBox({ label: "x" }, RADIUS);
    expect(dflt).toEqual(right);
  });

  test("mirrors the right box to the left", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox({ label: "x", labelPosition: "left" }, RADIUS);
    expect(box).toEqual({ minX: -(START + 40), maxX: -START, minY: -10, maxY: 10 });
  });

  test("centers above on the glyph height (textHeight), not the line box", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox({ label: "x", labelPosition: "above" }, RADIUS);
    // cy = -(start + textHeight/2) = -(15 + 8) = -23; box half-height 10.
    // Using height/2 (=10) instead of textHeight/2 would give maxY -15, not -13.
    expect(box).toEqual({ minX: -20, maxX: 20, minY: -33, maxY: -13 });
  });

  test("centers below on the glyph height (textHeight), not the line box", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox({ label: "x", labelPosition: "below" }, RADIUS);
    expect(box).toEqual({ minX: -20, maxX: 20, minY: 13, maxY: 33 });
  });

  test("centers an 'over' label on the node", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox({ label: "x", labelPosition: "over" }, RADIUS);
    expect(box).toEqual({ minX: -20, maxX: 20, minY: -10, maxY: 10 });
  });

  test("expands the box symmetrically by the background padding, keeping the center fixed", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox(
      { label: "x", labelPosition: "right", labelBackgroundColor: "#fff" },
      RADIUS,
    );
    // Default padding 3 grows half-extents to 23 x 13; center still at cx = 35.
    expect(box).toEqual({ minX: START - 3, maxX: START + 40 + 3, minY: -13, maxY: 13 });
  });

  test("ignores background padding when no background color is set", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox(
      { label: "x", labelPosition: "right", labelBackgroundPadding: 100 },
      RADIUS,
    );
    expect(box).toEqual({ minX: START, maxX: START + 40, minY: -10, maxY: 10 });
  });

  test("honors the primitives label margin", () => {
    const box = makeRenderer(MEASURE, 20).nodeLabelBox({ label: "x", labelPosition: "right" }, RADIUS);
    // start = radius(10) + margin(20) = 30; cx = 30 + 20 = 50.
    expect(box).toEqual({ minX: 30, maxX: 70, minY: -10, maxY: 10 });
  });

  test("returns the axis-aligned bounds of the rotated rectangle", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox(
      { label: "x", labelPosition: "right", labelAngle: Math.PI / 2 },
      RADIUS,
    )!;
    // The unrotated box spans x in [15, 55], y in [-10, 10]. Rotating by +90°
    // (rx = px*c + py*s, ry = -px*s + py*c with c=0, s=1) maps it to
    // x in [-10, 10], y in [-55, -15].
    expect(box.minX).toBeCloseTo(-10);
    expect(box.maxX).toBeCloseTo(10);
    expect(box.minY).toBeCloseTo(-55);
    expect(box.maxY).toBeCloseTo(-15);
  });

  test("a half-turn negates the box", () => {
    const box = makeRenderer(MEASURE).nodeLabelBox(
      { label: "x", labelPosition: "right", labelAngle: Math.PI },
      RADIUS,
    )!;
    expect(box.minX).toBeCloseTo(-(START + 40));
    expect(box.maxX).toBeCloseTo(-START);
    expect(box.minY).toBeCloseTo(-10);
    expect(box.maxY).toBeCloseTo(10);
  });

  test("returns null when the node is hidden", () => {
    const r = makeRenderer(MEASURE);
    expect(r.nodeLabelBox({ label: "x", visibility: "hidden" }, RADIUS)).toBeNull();
    expect(r.nodeLabelBox({ label: "x", labelVisibility: "hidden" }, RADIUS)).toBeNull();
  });

  test("returns null when there is no label to measure", () => {
    expect(makeRenderer({ width: 0, height: 0, textHeight: 0 }).nodeLabelBox({ label: "" }, RADIUS)).toBeNull();
  });
});
