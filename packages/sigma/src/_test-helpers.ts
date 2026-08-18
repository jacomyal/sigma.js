import Sigma from "sigma";
import { Coordinates } from "sigma/types";
import { indexToColor } from "sigma/utils";
import { expect, vi } from "vitest";

import { KindName } from "./core/interactive-kinds";

/**
 * Moves the pointer over `node` and waits for its async hover resolution.
 */
export async function hoverNode(sigma: Sigma, node: string): Promise<void> {
  const position = sigma.graphToViewport(sigma.getGraph().getNodeAttributes(node) as Coordinates);
  await simulateMouseEvent(sigma.getMouseLayer(), "pointermove", position);
  await vi.waitFor(() => expect(sigma.getNodeState(node).isHovered).toBe(true), { timeout: 5000 });
}

/**
 * Returns the viewport position where an item can be picked, or null when it
 * has no pixel in the picking framebuffer. The item is a graph node or edge
 * (`key`), seen as one of the pickable kinds ("node", "nodeLabel", etc.): for
 * instance `("nodeLabel", "n1")` targets the label rect of node "n1".
 */
export function findPickingPosition(sigma: Sigma, kind: KindName, key: string): Coordinates | null {
  const internals = sigma["internals"];
  const id = internals.pickingState.idsByKind[kind].get(key);
  if (!id) return null;

  const gl = sigma["webGLContext"]!;
  const downSizingRatio = internals.settings.pickingDownSizingRatio;
  const width = Math.ceil(gl.drawingBufferWidth / downSizingRatio);
  const height = Math.ceil(gl.drawingBufferHeight / downSizingRatio);

  const pixels = new Uint8Array(width * height * 4);
  gl.bindFramebuffer(gl.FRAMEBUFFER, sigma["pickingFrameBuffer"]);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // Barycenter of the pixels holding the item's picking ID
  const target = indexToColor(id);
  const words = new Uint32Array(pixels.buffer);
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i] !== target) continue;
    sumX += i % width;
    sumY += Math.floor(i / width);
    count++;
  }
  if (!count) return null;

  // Inverse of pickingPixelCoords, aimed at the matched pixels' barycenter
  const { pixelRatio } = internals;
  return {
    x: ((sumX / count + 0.5) * downSizingRatio) / pixelRatio,
    y: ((gl.drawingBufferHeight / downSizingRatio - (sumY / count + 0.5)) * downSizingRatio) / pixelRatio,
  };
}

/**
 * Creates a WebGL2 context for testing shader compilation.
 */
export function createTestGL(): WebGL2RenderingContext {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    throw new Error("WebGL2 not supported");
  }
  return gl;
}

/**
 * Attempts to compile a shader and returns any errors.
 */
export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): string | null {
  const shader = gl.createShader(type);
  if (!shader) return "Failed to create shader";

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    return error;
  }

  gl.deleteShader(shader);
  return null;
}

/**
 * Tests that vertex and fragment shaders compile successfully.
 */
export function expectShadersToCompile(vertexShader: string, fragmentShader: string) {
  const gl = createTestGL();

  const vertexError = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
  if (vertexError) {
    throw new Error(`Vertex shader compilation failed:
${vertexError}

Shader source:
${vertexShader}`);
  }

  const fragmentError = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  if (fragmentError) {
    throw new Error(`Fragment shader compilation failed:
${fragmentError}

Shader source:
${fragmentShader}`);
  }
}

export function wait(timeout: number): Promise<void> {
  if (!timeout) return Promise.resolve();
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

export function add<T extends Coordinates>(p: T, vec: Coordinates): T {
  return {
    ...p,
    x: p.x + vec.x,
    y: p.y + vec.y,
  };
}

export function remove<T extends Coordinates>(p: T, vec: Coordinates): T {
  return {
    ...p,
    x: p.x - vec.x,
    y: p.y - vec.y,
  };
}

export function rotate<T extends Coordinates>(p: T, { x: cx, y: cy }: Coordinates, angle: number): T {
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  return {
    ...p,
    x: cosAngle * (p.x - cx) - sinAngle * (p.y - cy) + cx,
    y: sinAngle * (p.x - cx) + cosAngle * (p.y - cy) + cy,
  };
}

export function expectObjectsToBeClose<T extends Record<string, number>>(o1: T, o2: T, numDigits?: number) {
  expect(Object.keys(o1).sort()).toEqual(Object.keys(o2).sort());
  for (const key in o1) {
    expect.soft(o1[key], `expected["${key}"] = actual["${key}"]`).toBeCloseTo(o2[key], numDigits);
  }
}

// Helpers to simulate touch events:
export type TouchSpec = Coordinates & { id: number };
export type TouchEventType = "touchstart" | "touchend" | "touchmove";
export async function simulateTouchEvent(element: HTMLElement, type: TouchEventType, touchInputs: TouchSpec[]) {
  const touches: Touch[] = [];

  touchInputs.forEach((touch) => {
    touches.push(
      new Touch({
        clientX: touch.x,
        clientY: touch.y,
        identifier: touch.id,
        target: element,
      }),
    );
  });

  element.dispatchEvent(
    new TouchEvent(type, {
      touches,
      view: window,
      cancelable: true,
      bubbles: true,
    }),
  );

  await wait(10);
}

export type PointerEventType = "pointerdown" | "pointerup" | "pointermove";
export async function simulateMouseEvent(
  element: HTMLElement,
  type: PointerEventType,
  position: Coordinates,
  options?: { button?: number },
) {
  element.dispatchEvent(
    new PointerEvent(type, {
      pointerType: "mouse",
      clientX: position.x,
      clientY: position.y,
      button: options?.button ?? 0,
      bubbles: true,
      cancelable: true,
    }),
  );

  await wait(10);
}

export async function simulateDoubleClick(element: HTMLElement, position: Coordinates) {
  const init = {
    pointerType: "mouse",
    clientX: position.x,
    clientY: position.y,
    bubbles: true,
    cancelable: true,
  };

  element.dispatchEvent(new PointerEvent("pointerdown", init));
  element.dispatchEvent(new PointerEvent("pointerup", init));
  element.dispatchEvent(new PointerEvent("pointerdown", init));
  element.dispatchEvent(new PointerEvent("pointerup", init));

  await wait(10);
}
