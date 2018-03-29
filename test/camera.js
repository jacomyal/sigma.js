/**
 * Sigma.js Camera Unit Tests
 * ===========================
 *
 * Testing the camera class.
 */
import assert from 'assert';
import Camera from '../src/camera';

describe('Camera', function() {

  it('should be possible to read the camera\'s state.', function() {
    const camera = new Camera();

    assert.deepEqual(camera.getState(), {
      x: 0.5,
      y: 0.5,
      angle: 0,
      ratio: 1
    });
  });

  it('should be possible to read the camera\'s previous state.', function() {
    const camera = new Camera();

    camera.setState({x: 34, y: 56, ratio: 4, angle: 10});
    camera.setState({x: 5, y: -3, ratio: 5, angle: 0});

    assert.deepEqual(camera.getPreviousState(), {
      x: 34,
      y: 56,
      ratio: 4,
      angle: 10
    });
  });

  it('should be possibile to set the camera\'s state.', function() {
    const camera = new Camera();

    camera.setState({
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3
    });

    assert.deepEqual(camera.getState(), {
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3
    });
  });
});
