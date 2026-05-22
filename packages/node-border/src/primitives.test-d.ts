import { borderSchema, layerBorder } from "@sigma/node-border";
import { layerFill, sdfCircle } from "sigma/rendering";
import { defineSigmaOptions } from "sigma/types";
import { describe, expectTypeOf, test } from "vitest";

describe("@sigma/node-border types", () => {
  test("layerBorder() is accepted in a node layers array", () => {
    const options = defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          layers: [layerFill(), layerBorder({ borders: [{ size: 0.1, color: "#000" }] })],
        },
      },
      styles: {
        nodes: { color: "#666", size: 10 },
      },
    });

    expectTypeOf(options).toHaveProperty("primitives");
  });

  test("borderSchema exposes its expected fields", () => {
    expectTypeOf(borderSchema).toHaveProperty("borders");
  });
});
