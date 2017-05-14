/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes as discs, shaped by triangles using the
 * `gl.TRIANGLES` display mode. So, to draw one node, it will need to store
 * three times the center of the node, with the color, the size and an angle
 * indicating which "corner" of the triangle to draw.
 */
import Program from './program';
import vertexShaderSource from '../shaders/node.vert';
import fragmentShaderSource from '../shaders/node.frag';

export default class NodeProgram extends Program {
  constructor() {
    super();

    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
  }
}

NodeProgram.POINTS = 3;
NodeProgram.ATTRIBUTES = 5;
