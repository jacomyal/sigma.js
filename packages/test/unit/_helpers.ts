import { Coordinates } from "sigma/types";
import { expect } from "vitest";

export function wait(timeout: number): Promise<void> {
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

export type MouseEventType = "mousedown" | "mouseup" | "mousemove";
export async function simulateMouseEvent(element: HTMLElement, type: MouseEventType, position: Coordinates) {
  element.dispatchEvent(
    new MouseEvent(type, {
      clientX: position.x,
      clientY: position.y,
    }),
  );

  await wait(10);
}
