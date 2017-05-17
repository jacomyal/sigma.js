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
      x: 0,
      y: 0,
      angle: 0,
      ratio: 1
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
