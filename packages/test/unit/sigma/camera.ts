import { Camera } from "sigma";
import { describe, expect, test } from "vitest";

import { wait } from "../_helpers";

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

  test("it should be possible to copy a camera instance.", function () {
    const camera1 = new Camera();
    camera1.setState({
      ratio: 0.5,
      angle: Math.PI / 3,
      x: 12,
      y: 5,
    });

    const camera2 = camera1.copy();

    expect(camera1.getState()).toEqual(camera2.getState());
    expect(camera1).not.toBe(camera2);
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

    camera.setState({ x: 34, y: 56, ratio: 4, angle: 10 });
    camera.setState({ x: 5, y: -3, ratio: 5, angle: 0 });

    expect(camera.getPreviousState()).toEqual({
      x: 34,
      y: 56,
      ratio: 4,
      angle: 10,
    });
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
    camera.disable();
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
    test("it should trigger the animation callback when starting a new animation (regression #1107).", function () {
      let flag = false;

      const camera = new Camera();
      camera.animate({}, { duration: 500 }, () => {
        flag = true;
      });
      camera.animate({});

      expect(flag).toEqual(true);
    });

    test("it should return promises that resolve when animation ends, when called without callback.", async function () {
      const camera = new Camera();
      const targetState = {
        x: 1,
        y: 0,
        ratio: 0.1,
        angle: Math.PI,
      };
      const duration = 50;
      const t0 = Date.now();
      await camera.animate(targetState, { duration });
      const t1 = Date.now();

      expect(Math.abs(t1 - t0 - duration)).toBeLessThan(duration / 2);
      expect(camera.getState()).toEqual(targetState);
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
        camera.animatedZoom({ duration }),
        (async (): Promise<void> => {
          await wait(delay);
          await camera.animatedReset({ duration: 0 });
        })(),
      ]);
      const t1 = Date.now();

      expect(camera.ratio).toEqual(1);
      // Time measures are very rough at this scale, we just want to check that t1 - t0 (the actual spent time)
      // is basically closer to delay than to duration:
      const spentTime = t1 - t0;
      expect(Math.abs(spentTime - delay)).toBeLessThan(Math.abs(spentTime - duration));
    });
  });
});
