import { imageSchema, layerImage } from "@sigma/node-image";
import { layerFill, sdfCircle } from "sigma/rendering";
import { defineSigmaOptions } from "sigma/types";
import { describe, expectTypeOf, test } from "vitest";

describe("@sigma/node-image types", () => {
  test("layerImage() is accepted in a node layers array", () => {
    const options = defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          layers: [layerFill(), layerImage({ name: "myImage" })],
        },
      },
      styles: {
        nodes: { color: "#666", size: 10 },
      },
    });

    expectTypeOf(options).toHaveProperty("primitives");
  });

  test("imageSchema exposes its expected fields", () => {
    expectTypeOf(imageSchema).toHaveProperty("name");
    expectTypeOf(imageSchema).toHaveProperty("drawingMode");
    expectTypeOf(imageSchema).toHaveProperty("padding");
  });
});
