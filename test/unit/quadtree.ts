/**
 * Sigma.js QuadTree Unit Tests
 * =============================
 *
 * Testing the quadtree class.
 */
import assert from "assert";
import QuadTree, { getCircumscribedAlignedRectangle, isRectangleAligned, Rectangle } from "../../src/core/quadtree";

describe("QuadTree geometry utils", () => {
  describe("QuadTree#getCircumscribedAlignedRectangle", () => {
    it("should return the given rectangle for 'straight' rectangles", () => {
      const rect: Rectangle = {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0,
        height: 1,
      };

      assert.deepStrictEqual(rect, getCircumscribedAlignedRectangle(rect));
    });

    it("should return the good circumscribed rectangle for 'tilted' rectangles", () => {
      const rect: Rectangle = {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: -1,
        height: Math.SQRT2,
      };

      assert.deepStrictEqual(getCircumscribedAlignedRectangle(rect), {
        x1: 0,
        y1: -1,
        x2: 2,
        y2: -1,
        height: 2,
      });
    });
  });

  describe("QuadTree#isRectangleAligned", () => {
    it("should work with aligned rectangles", () => {
      assert.ok(
        isRectangleAligned({
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 0,
          height: 1,
        }),
      );
      assert.ok(
        isRectangleAligned({
          x1: 0,
          y1: 0,
          x2: 0,
          y2: -2,
          height: 1,
        }),
      );
    });

    it("should work with misaligned rectangles", () => {
      assert.ok(
        !isRectangleAligned({
          x1: 0,
          y1: 0,
          x2: 1,
          y2: -1,
          height: Math.SQRT2,
        }),
      );
      assert.ok(
        !isRectangleAligned({
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 1,
          height: Math.SQRT2,
        }),
      );
    });
  });
});

describe("QuadTree", function () {
  const nodes = [
    {
      key: "a",
      x: 394,
      y: 10,
      size: 1,
    },
    {
      key: "b",
      x: 12,
      y: 10,
      size: 3,
    },
  ];

  const tree = new QuadTree({ boundaries: { x: 0, y: 0, width: 500, height: 500 } });

  nodes.forEach((node) => tree.add(node.key, node.x, node.y, node.size));

  // console.log(tree.point(10, 14));
});
