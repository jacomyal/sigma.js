/**
 * Sigma.js Node Data Texture
 * ==========================
 *
 * Manages a GPU texture containing node position, size, and shape data.
 * This texture is shared between node and edge programs, enabling:
 * - Reduced edge buffer size (node indices instead of full node data)
 * - Faster node updates (only texture needs updating, not edge buffers)
 * - Unified data source for both node and edge rendering
 *
 * @module
 */
import { colorToArray } from "../utils";
import { DataTexture } from "./data-texture";

/**
 * Manages a GPU texture storing node data, two RGBA32F texels per node.
 *
 * Texel 0 - geometry, read by every node-data consumer:
 * - R: x position (graph coordinates)
 * - G: y position (graph coordinates)
 * - B: size
 * - A: shapeId (integer ID for shape registry lookup)
 *
 * Texel 1 - rotation flags (0 = viewport/screen-upright, 1 = graph) and color:
 * - R: nodeRotation   (shape orientation follows the camera)
 * - G: labelRotation  (label orbits/turns with the camera)
 * - B: color RGB packed as r*65536 + g*256 + b (< 2^24, exact in float32)
 * - A: color alpha in [0, 1]
 *
 * Node index N maps to a base texel `N * 2`; consumers fetch texel 0 there and
 * texel 1 at `N * 2 + 1` (see GLSL_READ_NODE_DATA / GLSL_READ_NODE_FLAGS /
 * GLSL_READ_NODE_COLOR).
 */
export class NodeDataTexture extends DataTexture {
  constructor(gl: WebGL2RenderingContext, initialCapacity?: number) {
    super(gl, 2, initialCapacity);
  }

  /**
   * Updates all data for a node. `nodeRotation` and `labelRotation` are the
   * per-node rotation-alignment flags (0 = viewport, 1 = graph).
   */
  updateNode(
    nodeKey: string,
    x: number,
    y: number,
    size: number,
    shapeId: number,
    nodeRotation: number,
    labelRotation: number,
    color: string,
  ): void {
    const index = this.indexMap.get(nodeKey);
    if (index === undefined) {
      throw new Error(`Node "${nodeKey}" not allocated in NodeDataTexture`);
    }

    const [r, g, b, a] = colorToArray(color);

    const offset = index * 2 * 4;
    // Texel 0:
    this.data[offset] = x;
    this.data[offset + 1] = y;
    this.data[offset + 2] = size;
    this.data[offset + 3] = shapeId;
    // Texel 1:
    this.data[offset + 4] = nodeRotation;
    this.data[offset + 5] = labelRotation;
    this.data[offset + 6] = r * 65536 + g * 256 + b;
    this.data[offset + 7] = a / 255;

    this.markDirty(index);
  }
}
