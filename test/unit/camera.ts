/**
 * Sigma.js Camera Unit Tests
 * ===========================
 *
 * Testing the camera class.
 */
import { assert } from "chai";
import Camera from "../../src/core/camera";

describe("Camera", function () {
  it("should be possible to read the camera's state.", function () {
    const camera = new Camera();

    assert.deepStrictEqual(camera.getState(), {
      x: 0.5,
      y: 0.5,
      angle: 0,
      ratio: 1,
    });
  });

  it("should be possible to copy a camera instance.", function () {
    const camera1 = new Camera();
    camera1.setState({
      ratio: 0.5,
      angle: Math.PI / 3,
      x: 12,
      y: 5,
    });

    const camera2 = camera1.copy();

    assert.deepStrictEqual(camera1.getState(), camera2.getState());
    assert.notStrictEqual(camera1, camera2);
  });

  it("should be possible to create a camera from a given state.", function () {
    const cameraState = {
      ratio: 0.5,
      angle: Math.PI / 3,
      x: 12,
      y: 5,
    };

    const camera = Camera.from(cameraState);

    assert.deepStrictEqual(camera.getState(), cameraState);
  });

  it("should be possible to read the camera's previous state.", function () {
    const camera = new Camera();

    camera.setState({ x: 34, y: 56, ratio: 4, angle: 10 });
    camera.setState({ x: 5, y: -3, ratio: 5, angle: 0 });

    assert.deepStrictEqual(camera.getPreviousState(), {
      x: 34,
      y: 56,
      ratio: 4,
      angle: 10,
    });
  });

  it("should be possible to set the camera's state.", function () {
    const camera = new Camera();

    camera.setState({
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    });

    assert.deepStrictEqual(camera.getState(), {
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    });
  });

  it("should be possible to update a camera's state.", function () {
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

    assert.deepStrictEqual(camera.getState(), {
      x: 20,
      y: -3,
      angle: 15,
      ratio: 4,
    });

    camera.updateState((state) => {
      return { angle: state.angle + 1 };
    });

    assert.deepStrictEqual(camera.getState(), { x: 20, y: -3, angle: 16, ratio: 4 });
  });

  it("should be possible to reset the camera's state using setState (issue #1136).", function () {
    const camera = new Camera();

    camera.setState({
      x: 10,
      y: -45,
      angle: Math.PI / 2,
      ratio: 3,
    });

    camera.setState({ x: 0 });
    assert.deepStrictEqual(camera.getState(), {
      x: 0,
      y: -45,
      angle: Math.PI / 2,
      ratio: 3,
    });

    camera.setState({ y: 0 });
    assert.deepStrictEqual(camera.getState(), {
      x: 0,
      y: 0,
      angle: Math.PI / 2,
      ratio: 3,
    });

    camera.setState({ angle: 0 });
    assert.deepStrictEqual(camera.getState(), {
      x: 0,
      y: 0,
      angle: 0,
      ratio: 3,
    });
  });

  it("should not be possible to set the camera's state when it's disabled.", function () {
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

    assert.notDeepEqual(state1, state2);
    assert.deepStrictEqual(camera.getState(), state1);
  });

  it("should trigger the animation callback when starting a new animation (regression #1107).", function () {
    let flag = false;

    const camera = new Camera();
    camera.animate({}, { duration: 500 }, () => {
      flag = true;
    });
    camera.animate({});

    assert.deepStrictEqual(flag, true);
  });

  it("should check for ratio extrema (feature #1161).", function () {
    const camera = new Camera();

    camera.minRatio = null;
    camera.maxRatio = 10;
    camera.setState({ ratio: 20 });
    assert.equal(camera.ratio, 10);

    camera.minRatio = 0.1;
    camera.maxRatio = null;
    camera.setState({ ratio: 0.05 });
    assert.equal(camera.ratio, 0.1);

    // Also check weird values (expect maxRatio to "win" that):
    camera.minRatio = 10;
    camera.maxRatio = 0.1;
    camera.setState({ ratio: 0.05 });
    assert.equal(camera.ratio, 0.1);
    camera.setState({ ratio: 20 });
    assert.equal(camera.ratio, 0.1);
  });
});
