import { Coordinates } from "sigma/types";
import { expect } from "vitest";

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
