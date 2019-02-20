import floatColor from "../../utils/misc/floatColor";
import loadShader from "../../utils/webgl/loadShader";
import loadProgram from "../../utils/webgl/loadProgram";

/**
 * This node renderer will display nodes in the fastest way: Nodes are basic
 * squares, drawn through the gl.POINTS drawing method. The size of the nodes
 * are represented with the "gl_PointSize" value in the vertex shader.
 *
 * It is the fastest node renderer here since the buffer just takes one line
 * to draw each node (with attributes "x", "y", "size" and "color").
 *
 * Nevertheless, this method has some problems, especially due to some issues
 * with the gl.POINTS:
 *  - First, if the center of a node is outside the scene, the point will not
 *    be drawn, even if it should be partly on screen.
 *  - I tried applying a fragment shader similar to the one in the default
 *    node renderer to display them as discs, but it did not work fine on
 *    some computers settings, filling the discs with weird gradients not
 *    depending on the actual color.
 */
export default {
  POINTS: 1,
  ATTRIBUTES: 4,
  addNode(node, data, i, prefix, settings) {
    data[i++] = node[`${prefix}x`];
    data[i++] = node[`${prefix}y`];
    data[i++] = node[`${prefix}size`];
    data[i++] = floatColor(node.color || settings("defaultNodeColor"));
  },
  render(gl, program, data, params) {
    // Define attributes:
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const sizeLocation = gl.getAttribLocation(program, "a_size");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    const ratioLocation = gl.getUniformLocation(program, "u_ratio");
    const scaleLocation = gl.getUniformLocation(program, "u_scale");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    gl.uniform2f(resolutionLocation, params.width, params.height);
    gl.uniform1f(
      ratioLocation,
      1 / params.ratio ** params.settings("nodesPowRatio")
    );
    gl.uniform1f(scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(matrixLocation, false, params.matrix);

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(sizeLocation);
    gl.enableVertexAttribArray(colorLocation);

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(
      sizeLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );
    gl.vertexAttribPointer(
      colorLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      12
    );

    gl.drawArrays(
      gl.POINTS,
      params.start || 0,
      params.count || data.length / this.ATTRIBUTES
    );
  },
  initProgram(gl) {
    const vertexShader = loadShader(
      gl,
      [
        "attribute vec2 a_position;",
        "attribute float a_size;",
        "attribute float a_color;",

        "uniform vec2 u_resolution;",
        "uniform float u_ratio;",
        "uniform float u_scale;",
        "uniform mat3 u_matrix;",

        "varying vec4 color;",

        "void main() {",
        // Scale from [[-1 1] [-1 1]] to the container:
        "gl_Position = vec4(",
        "((u_matrix * vec3(a_position, 1)).xy /",
        "u_resolution * 2.0 - 1.0) * vec2(1, -1),",
        "0,",
        "1",
        ");",

        // Multiply the point size twice:
        //  - x SCALING_RATIO to correct the canvas scaling
        //  - x 2 to correct the formulae
        "gl_PointSize = a_size * u_ratio * u_scale * 2.0;",

        // Extract the color:
        "float c = a_color;",
        "color.b = mod(c, 256.0); c = floor(c / 256.0);",
        "color.g = mod(c, 256.0); c = floor(c / 256.0);",
        "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;",
        "color.a = 1.0;",
        "}"
      ].join("\n"),
      gl.VERTEX_SHADER
    );

    const fragmentShader = loadShader(
      gl,
      [
        "precision mediump float;",

        "varying vec4 color;",

        "void main(void) {",
        "float border = 0.01;",
        "float radius = 0.5;",

        "vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);",
        "vec2 m = gl_PointCoord - vec2(0.5, 0.5);",
        "float dist = radius - sqrt(m.x * m.x + m.y * m.y);",

        "float t = 0.0;",
        "if (dist > border)",
        "t = 1.0;",
        "else if (dist > 0.0)",
        "t = dist / border;",

        "gl_FragColor = mix(color0, color, t);",
        "}"
      ].join("\n"),
      gl.FRAGMENT_SHADER
    );

    const program = loadProgram(gl, [vertexShader, fragmentShader]);

    return program;
  }
};
