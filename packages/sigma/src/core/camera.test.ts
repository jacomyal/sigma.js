import { Camera, DEFAULT_CAMERA_STATE } from "sigma";
import { CameraState } from "sigma/types";
import { describe, expect, test } from "vitest";

import { wait } from "../_test-helpers";

describe("Camera", function () {
  test("it should be possible to read the camera's state.", function () {
    const camera = new Camera();

    expect(camera.getState()).toEqual({
      x: 0.5,
      y: 0.5,
      angle: 0,
      ratio: 1,
    });
  });

  test("it should be possible to create a camera from a given state.", function () {
    const cameraState = {
      ratio: 0.5,
      angle: Math.PI / 3,
      x: 12,
      y: 5,
    };

    const camera = Camera.from(cameraState);

    expect(camera.getState()).toEqual(cameraState);
  });

  test("it should be possible to read the camera's previous state.", function () {
    const camera = new Camera();

    // A brand new camera has never moved, so both states are the default one:
    expect(camera.getPreviousState()).toEqual(DEFAULT_CAMERA_STATE);

    camera.setState({ x: 34, y: 56, ratio: 4, angle: 10 });
    camera.setState({ x: 5, y: -3, ratio: 5, angle: 0 });

    expect(camera.getPreviousState()).toEqual({
      x: 34,
      y: 56,
      ratio: 4,
      angle: 10,
    });
  });

  test("it should not be possible to write the state properties directly.", function () {
    const camera = new Camera();

    expect(() => {
      (camera as unknown as CameraState).x = 5;
    }).toThrow();
    expect(camera.x).toEqual(DEFAULT_CAMERA_STATE.x);
  });

  test("it should always validate states into complete states.", function () {
    const camera = new Camera();
    const state = { x: 1, y: 2, ratio: 3, angle: 4 };

    camera.setState(state);
    expect(camera.validateState({ x: 10 })).toEqual({ ...state, x: 10 });

    // Forbidden dimensions keep their current value:
    camera.enabledPanning = false;
    expect(camera.validateState({ x: 20 })).toEqual(state);

    // constrainState has the last word:
    camera.enabledPanning = true;
    camera.constrainState = (s) => ({ ...s, y: 0 });
    expect(camera.validateState({ x: 30 })).toEqual({ ...state, x: 30, y: 0 });
  });

  test("it should be possible to set the camera's state.", function () {
    const camera = new Camera();

    camera.setState({
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    });

    expect(camera.getState()).toEqual({
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    });
  });

  test("it should be possible to update a camera's state.", function () {
    const camera = new Camera();

    camera.setState({ x: 10, y: -10, angle: 5, ratio: 3 });
    camera.updateState((state) => {
      return {
        x: state.x * 2,
        y: state.y + 7,
        angle: state.angle * 3,
        ratio: state.ratio + 1,
      };
    });

    expect(camera.getState()).toEqual({
      x: 20,
      y: -3,
      angle: 15,
      ratio: 4,
    });

    camera.updateState((state) => {
      return { angle: state.angle + 1 };
    });

    expect(camera.getState()).toEqual({ x: 20, y: -3, angle: 16, ratio: 4 });
  });

  test("it should be possible to reset the camera's state using setState (issue #1136).", function () {
    const camera = new Camera();

    camera.setState({
      x: 10,
      y: -45,
      angle: Math.PI / 2,
      ratio: 3,
    });

    camera.setState({ x: 0 });
    expect(camera.getState()).toEqual({
      x: 0,
      y: -45,
      angle: Math.PI / 2,
      ratio: 3,
    });

    camera.setState({ y: 0 });
    expect(camera.getState()).toEqual({
      x: 0,
      y: 0,
      angle: Math.PI / 2,
      ratio: 3,
    });

    camera.setState({ angle: 0 });
    expect(camera.getState()).toEqual({
      x: 0,
      y: 0,
      angle: 0,
      ratio: 3,
    });
  });

  test("it should not be possible to set the camera's state when it's disabled.", function () {
    const camera = new Camera();
    const state1 = {
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    };
    const state2 = {
      x: 123,
      y: 456,
      angle: 0,
      ratio: 1,
    };

    camera.setState(state1);
    camera.enabled = false;
    camera.setState(state2);

    expect(state1).not.toEqual(state2);
    expect(camera.getState()).toEqual(state1);
  });

  test("it should check for ratio extrema (feature #1161).", function () {
    const camera = new Camera();

    camera.minRatio = null;
    camera.maxRatio = 10;
    camera.setState({ ratio: 20 });
    expect(camera.ratio).toEqual(10);

    camera.minRatio = 0.1;
    camera.maxRatio = null;
    camera.setState({ ratio: 0.05 });
    expect(camera.ratio).toEqual(0.1);

    // Also check weird values (expect maxRatio to "win" that):
    camera.minRatio = 10;
    camera.maxRatio = 0.1;
    camera.setState({ ratio: 0.05 });
    expect(camera.ratio).toEqual(0.1);
    camera.setState({ ratio: 20 });
    expect(camera.ratio).toEqual(0.1);
  });

  describe("Animations", () => {
    test("it should settle the pending animation promise as soon as a new animation starts (regression #1107).", async function () {
      let firstAnimationPromiseResolved = false;

      const camera = new Camera();
      camera.animate({}, { duration: 500 }).then(() => {
        firstAnimationPromiseResolved = true;
      });
      camera.animate({});

      // To get the first promise actually resolve, we have to wait for one microtask tick:
      expect(firstAnimationPromiseResolved).toEqual(false);
      await wait(0);
      expect(firstAnimationPromiseResolved).toEqual(true);
    });

    test("it should resolve promises when animation is interrupted by a new animation (using #animate).", async function () {
      const camera = new Camera();
      const targetState1 = { ...camera.getState(), x: 1 };
      const targetState2 = { ...camera.getState(), x: 2 };
      const duration = 500;
      const delay = 50;

      const t0 = Date.now();
      await Promise.all([
        camera.animate(targetState1, { duration }),
        (async (): Promise<void> => {
          await wait(delay);
          await camera.animate(targetState2, { duration: 0 });
        })(),
      ]);
      const t1 = Date.now();

      expect(camera.getState()).toEqual(targetState2);
      // Time measures are very rough at this scale, we just want to check that t1 - t0 (the actual spent time)
      // is basically closer to delay than to duration:
      const spentTime = t1 - t0;
      expect(Math.abs(spentTime - delay)).toBeLessThan(Math.abs(spentTime - duration));
    });

    test("it should resolve promises when animation is interrupted by a new animation (using the shortcut methods).", async function () {
      const camera = new Camera();
      const duration = 500;
      const delay = 50;

      const t0 = Date.now();
      await Promise.all([
        camera.zoomIn({ duration }),
        (async (): Promise<void> => {
          await wait(delay);
          await camera.reset({ duration: 0 });
        })(),
      ]);
      const t1 = Date.now();

      expect(camera.ratio).toEqual(1);
      // Time measures are very rough at this scale, we just want to check that t1 - t0 (the actual spent time)
      // is basically closer to delay than to duration:
      const spentTime = t1 - t0;
      expect(Math.abs(spentTime - delay)).toBeLessThan(Math.abs(spentTime - duration));
    });

    test("it should report whether an animation is running.", async function () {
      const camera = new Camera();

      expect(camera.isAnimating()).toBe(false);

      const promise = camera.animate({ x: 1 }, { duration: 100 });
      expect(camera.isAnimating()).toBe(true);

      await promise;
      expect(camera.isAnimating()).toBe(false);
    });

    test("it should stop the camera where it is when the animation is cancelled.", async function () {
      const camera = new Camera();
      const ends: boolean[] = [];

      camera.on("animationEnd", ({ completed }) => {
        ends.push(completed);
      });

      const pending = camera.animate({ x: 10 }, { duration: 500 });
      await wait(50);
      camera.cancelAnimation();

      await pending;
      const stoppedAt = camera.x;

      expect(camera.isAnimating()).toBe(false);
      expect(ends).toEqual([false]);
      expect(stoppedAt).toBeGreaterThan(0.5);
      expect(stoppedAt).toBeLessThan(10);

      await wait(50);
      expect(camera.x).toEqual(stoppedAt);
    });

    test("it should do nothing when cancelling with no animation running.", async function () {
      const camera = new Camera();
      const ends: boolean[] = [];
      const initialState = camera.getState();

      camera.on("animationEnd", ({ completed }) => {
        ends.push(completed);
      });

      // Never animated:
      camera.cancelAnimation();
      expect(ends).toEqual([]);
      expect(camera.getState()).toEqual(initialState);

      await camera.animate({ x: 1 }, { duration: 50 });
      expect(ends).toEqual([true]);

      camera.cancelAnimation();
      expect(ends).toEqual([true]);
      expect(camera.x).toEqual(1);
    });

    test("it should not settle the promise of an animation chained from an animationEnd listener.", async function () {
      const camera = new Camera();
      const chained: Promise<void>[] = [];
      let chainedSettled = false;

      camera.on("animationEnd", ({ completed }) => {
        // Chain a new animation, once, when the first one gets canceled:
        if (completed || chained.length) return;
        chained.push(
          camera.animate({ x: 10 }, { duration: 500 }).then(() => {
            chainedSettled = true;
          }),
        );
      });

      camera.animate({ x: 5 }, { duration: 500 });
      await wait(50);
      camera.cancelAnimation();

      // The chained animation is still running, so its promise must not be settled:
      await wait(0);
      expect(chainedSettled).toBe(false);

      await chained[0];
      expect(camera.x).toEqual(10);
      expect(camera.isAnimating()).toBe(false);
    });

    test("it should jump straight to the target when the duration is 0.", async function () {
      const camera = new Camera();
      const targetState = { x: 10, y: 20, angle: 1, ratio: 2 };
      const states: CameraState[] = [];

      camera.on("updated", (state) => states.push(state));
      await camera.animate(targetState, { duration: 0 });

      expect(camera.getState()).toEqual(targetState);
      expect(states).toEqual([targetState]);
    });

    test("it should interrupt a running animation instantly when the duration is 0.", async function () {
      const camera = new Camera();

      camera.animate({ x: 10 }, { duration: 500 });
      const pending = camera.animate({ x: 2 }, { duration: 0 });

      // No need to wait for a frame:
      expect(camera.x).toEqual(2);
      expect(camera.isAnimating()).toBe(false);

      await pending;
    });

    test("it should stop the running animation when the camera gets disabled.", async function () {
      const camera = new Camera();
      const duration = 500;
      const delay = 50;
      const ends: boolean[] = [];

      camera.on("animationEnd", ({ completed }) => {
        ends.push(completed);
      });

      const pending = camera.animate({ x: 10 }, { duration });
      await wait(delay);
      camera.enabled = false;

      await pending;
      const stoppedAt = camera.x;

      expect(camera.isAnimating()).toBe(false);
      expect(ends).toEqual([false]);
      expect(stoppedAt).toBeGreaterThan(0.5);
      expect(stoppedAt).toBeLessThan(10);

      await wait(delay);
      expect(camera.x).toEqual(stoppedAt);
    });

    test("it should divide the ratio when zooming in, and multiply it when zooming out.", async function () {
      const camera = new Camera();

      await camera.zoomIn({ factor: 2, duration: 0 });
      expect(camera.ratio).toEqual(0.5);

      await camera.zoomOut({ factor: 2, duration: 0 });
      expect(camera.ratio).toEqual(1);

      // The factor defaults to 1.5:
      await camera.zoomIn({ duration: 0 });
      expect(camera.ratio).toEqual(1 / 1.5);

      await camera.zoomOut({ duration: 0 });
      expect(camera.ratio).toBeCloseTo(1);
    });

    test("it should resolve immediately when animating a disabled camera.", async function () {
      const camera = new Camera();
      const state = camera.getState();
      const duration = 500;

      camera.enabled = false;
      const t0 = Date.now();
      await camera.animate({ x: 10 }, { duration });
      const spentTime = Date.now() - t0;

      expect(spentTime).toBeLessThan(duration / 2);

      expect(camera.getState()).toEqual(state);
      expect(camera.isAnimating()).toBe(false);
    });
  });
});
