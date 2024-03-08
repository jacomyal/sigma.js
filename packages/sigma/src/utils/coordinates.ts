import { CameraState, Dimensions } from "../types";
import { identity, multiply, multiplyVec2, rotate, scale, translate } from "./matrices";

/**
 * In sigma, the graph is normalized into a [0, 1], [0, 1] square, before being given to the various renderers. This
 * helps to deal with quadtree in particular.
 * But at some point, we need to rescale it so that it takes the best place in the screen, i.e. we always want to see two
 * nodes "touching" opposite sides of the graph, with the camera being at its default state.
 *
 * This function determines this ratio.
 */
export function getCorrectionRatio(
  viewportDimensions: { width: number; height: number },
  graphDimensions: { width: number; height: number },
): number {
  const viewportRatio = viewportDimensions.height / viewportDimensions.width;
  const graphRatio = graphDimensions.height / graphDimensions.width;

  // If the stage and the graphs are in different directions (such as the graph being wider that tall while the stage
  // is taller than wide), we can stop here to have indeed nodes touching opposite sides:
  if ((viewportRatio < 1 && graphRatio > 1) || (viewportRatio > 1 && graphRatio < 1)) {
    return 1;
  }

  // Else, we need to fit the graph inside the stage:
  // 1. If the graph is "squarer" (i.e. with a ratio closer to 1), we need to make the largest sides touch;
  // 2. If the stage is "squarer", we need to make the smallest sides touch.
  return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}

/**
 * Function returning a matrix from the current state of the camera.
 */
export function matrixFromCamera(
  state: CameraState,
  viewportDimensions: { width: number; height: number },
  graphDimensions: { width: number; height: number },
  padding: number,
  inverse?: boolean,
): Float32Array {
  // TODO: it's possible to optimize this drastically!
  const { angle, ratio, x, y } = state;

  const { width, height } = viewportDimensions;

  const matrix = identity();

  const smallestDimension = Math.min(width, height) - 2 * padding;

  const correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);

  if (!inverse) {
    multiply(
      matrix,
      scale(
        identity(),
        2 * (smallestDimension / width) * correctionRatio,
        2 * (smallestDimension / height) * correctionRatio,
      ),
    );
    multiply(matrix, rotate(identity(), -angle));
    multiply(matrix, scale(identity(), 1 / ratio));
    multiply(matrix, translate(identity(), -x, -y));
  } else {
    multiply(matrix, translate(identity(), x, y));
    multiply(matrix, scale(identity(), ratio));
    multiply(matrix, rotate(identity(), angle));
    multiply(
      matrix,
      scale(
        identity(),
        width / smallestDimension / 2 / correctionRatio,
        height / smallestDimension / 2 / correctionRatio,
      ),
    );
  }

  return matrix;
}

/**
 * All these transformations we apply on the matrix to get it rescale the graph
 * as we want make it very hard to get pixel-perfect distances in WebGL. This
 * function returns a factor that properly cancels the matrix effect on lengths.
 *
 * [jacomyal]
 * To be fully honest, I can't really explain happens here... I notice that the
 * following ratio works (i.e. it correctly compensates the matrix impact on all
 * camera states I could try):
 * > `R = size(V) / size(M * V) / W`
 * as long as `M * V` is in the direction of W (ie. parallel to (Ox)). It works
 * as well with H and a vector that transforms into something parallel to (Oy).
 *
 * Also, note that we use `angle` and not `-angle` (that would seem logical,
 * since we want to anticipate the rotation), because the image is vertically
 * swapped in WebGL.
 */
export function getMatrixImpact(
  matrix: Float32Array,
  cameraState: CameraState,
  viewportDimensions: Dimensions,
): number {
  const { x, y } = multiplyVec2(matrix, { x: Math.cos(cameraState.angle), y: Math.sin(cameraState.angle) }, 0);
  return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
}
