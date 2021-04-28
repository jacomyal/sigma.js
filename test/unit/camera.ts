/**
 * Sigma.js Camera Unit Tests
 * ===========================
 *
 * Testing the camera class.
 */
import assert from "assert";
import Camera from "../../src/core/camera";
import { Coordinates, Dimensions } from "../../src/types";

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

    assert.notDeepStrictEqual(state1, state2);
    assert.deepStrictEqual(camera.getState(), state1);
  });

  it("should properly translate coordinates from/to viewport.", function () {
    const camera = new Camera();
    const graphCenter: Coordinates = { x: 0.5, y: 0.5 };
    const graphTopRight: Coordinates = { x: 0.75, y: 0.75 };
    const dimensions: Dimensions = { width: 200, height: 100 };

    assert.deepStrictEqual(camera.framedGraphToViewport(dimensions, graphCenter), { x: 100, y: 50 });
    assert.deepStrictEqual(camera.framedGraphToViewport(dimensions, graphTopRight), { x: 125, y: 25 });
    assert.deepStrictEqual(
      camera.viewportToFramedGraph(dimensions, camera.framedGraphToViewport(dimensions, graphCenter)),
      graphCenter,
    );
    assert.deepStrictEqual(
      camera.viewportToFramedGraph(dimensions, camera.framedGraphToViewport(dimensions, graphTopRight)),
      graphTopRight,
    );

    // Move camera to right and zoom:
    camera.setState({ x: 1, y: 0.5, ratio: 0.5 });
    assert.deepStrictEqual(camera.framedGraphToViewport(dimensions, graphCenter), { x: 0, y: 50 });
    assert.deepStrictEqual(camera.framedGraphToViewport(dimensions, graphTopRight), { x: 50, y: 0 });
    assert.deepStrictEqual(
      camera.viewportToFramedGraph(dimensions, camera.framedGraphToViewport(dimensions, graphCenter)),
      graphCenter,
    );
    assert.deepStrictEqual(
      camera.viewportToFramedGraph(dimensions, camera.framedGraphToViewport(dimensions, graphTopRight)),
      graphTopRight,
    );

    // Move camera to right, zoom and rotate:
    camera.setState({ x: 1, y: 0.5, ratio: 0.5, angle: Math.PI / 2 });
    assert.deepStrictEqual(camera.framedGraphToViewport(dimensions, graphCenter), { x: 100, y: -50 });
    assert.deepStrictEqual(camera.framedGraphToViewport(dimensions, graphTopRight), { x: 150, y: 0 });
    assert.deepStrictEqual(
      camera.viewportToFramedGraph(dimensions, camera.framedGraphToViewport(dimensions, graphCenter)),
      graphCenter,
    );
    assert.deepStrictEqual(
      camera.viewportToFramedGraph(dimensions, camera.framedGraphToViewport(dimensions, graphTopRight)),
      graphTopRight,
    );
  });

  it("should be possible to zoom to a point on the screen while preserving its screen position.", function () {
    const camera = new Camera();
    camera.setState({ x: -5, y: -2, ratio: 1.2, angle: Math.PI / 3 });

    const dimensions: Dimensions = { width: 1800, height: 1000 };
    const viewportTarget: Coordinates = { x: 200, y: 400 };
    const graphTarget = camera.viewportToFramedGraph(dimensions, viewportTarget);
    const targetRatio = 0.4;

    const zoomedState = camera.getViewportZoomedState(viewportTarget, dimensions, targetRatio);
    const zoomedCamera = Camera.from(zoomedState);

    assert.strictEqual(zoomedCamera.ratio, targetRatio);
    assert.notDeepStrictEqual(camera.getState(), zoomedCamera.getState());

    const finalViewport = zoomedCamera.framedGraphToViewport(dimensions, graphTarget);
    // Check that the error is way smaller than a pixel
    assert.ok(Math.abs(viewportTarget.x - finalViewport.x) < 0.00001);
    assert.ok(Math.abs(viewportTarget.y - finalViewport.y) < 0.00001);
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
});
