import floatColor from "../../utils/misc/floatColor";
import loadProgram from "../../utils/webgl/loadProgram";
import loadShader from "../../utils/webgl/loadShader";
import rotation from "../../utils/matrices/rotation";

/**
 * This edge renderer will display edges as arrows going from the source node
 * to the target node. To deal with edge thicknesses, the lines are made of
 * three triangles: two forming rectangles, with the gl.TRIANGLES drawing
 * mode.
 *
 * It is expensive, since drawing a single edge requires 9 points, each
 * having a lot of attributes.
 */
export default {
  POINTS: 9,
  ATTRIBUTES: 11,
  addEdge(edge, source, target, data, i, prefix, settings) {
    const w = (edge[`${prefix}size`] || 1) / 2;

    const x1 = source[`${prefix}x`];

    const y1 = source[`${prefix}y`];

    const x2 = target[`${prefix}x`];

    const y2 = target[`${prefix}y`];

    const targetSize = target[`${prefix}size`];

    let { color } = edge;

    if (!color)
      switch (settings("edgeColor")) {
        case "source":
          color = source.color || settings("defaultNodeColor");
          break;
        case "target":
          color = target.color || settings("defaultNodeColor");
          break;
        default:
          color = settings("defaultEdgeColor");
          break;
      }

    // Normalize color:
    color = floatColor(color);
    data[i++] = x1;
    data[i++] = y1;
    data[i++] = x2;
    data[i++] = y2;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = color;

    data[i++] = x2;
    data[i++] = y2;
    data[i++] = x1;
    data[i++] = y1;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 1.0;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = color;

    data[i++] = x2;
    data[i++] = y2;
    data[i++] = x1;
    data[i++] = y1;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = color;

    data[i++] = x2;
    data[i++] = y2;
    data[i++] = x1;
    data[i++] = y1;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = color;

    data[i++] = x1;
    data[i++] = y1;
    data[i++] = x2;
    data[i++] = y2;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 0.0;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = color;

    data[i++] = x1;
    data[i++] = y1;
    data[i++] = x2;
    data[i++] = y2;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = 0.0;
    data[i++] = color;

    // Arrow head:
    data[i++] = x2;
    data[i++] = y2;
    data[i++] = x1;
    data[i++] = y1;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = 1.0;
    data[i++] = -1.0;
    data[i++] = color;

    data[i++] = x2;
    data[i++] = y2;
    data[i++] = x1;
    data[i++] = y1;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = color;

    data[i++] = x2;
    data[i++] = y2;
    data[i++] = x1;
    data[i++] = y1;
    data[i++] = w;
    data[i++] = targetSize;
    data[i++] = 1.0;
    data[i++] = 0.0;
    data[i++] = 1.0;
    data[i++] = 1.0;
    data[i++] = color;
  },
  render(gl, program, data, params) {
    let buffer;

    // Define attributes:
    const positionLocation1 = gl.getAttribLocation(program, "a_pos1");

    const positionLocation2 = gl.getAttribLocation(program, "a_pos2");

    const thicknessLocation = gl.getAttribLocation(program, "a_thickness");

    const targetSizeLocation = gl.getAttribLocation(program, "a_tSize");

    const delayLocation = gl.getAttribLocation(program, "a_delay");

    const minusLocation = gl.getAttribLocation(program, "a_minus");

    const headLocation = gl.getAttribLocation(program, "a_head");

    const headPositionLocation = gl.getAttribLocation(
      program,
      "a_headPosition"
    );

    const colorLocation = gl.getAttribLocation(program, "a_color");

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    const matrixHalfPiLocation = gl.getUniformLocation(
      program,
      "u_matrixHalfPi"
    );

    const matrixHalfPiMinusLocation = gl.getUniformLocation(
      program,
      "u_matrixHalfPiMinus"
    );

    const ratioLocation = gl.getUniformLocation(program, "u_ratio");

    const nodeRatioLocation = gl.getUniformLocation(program, "u_nodeRatio");

    const arrowHeadLocation = gl.getUniformLocation(program, "u_arrowHead");

    const scaleLocation = gl.getUniformLocation(program, "u_scale");

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    gl.uniform2f(resolutionLocation, params.width, params.height);
    gl.uniform1f(
      ratioLocation,
      params.ratio / params.ratio ** params.settings("edgesPowRatio")
    );
    gl.uniform1f(
      nodeRatioLocation,
      params.ratio ** params.settings("nodesPowRatio") / params.ratio
    );
    gl.uniform1f(arrowHeadLocation, 5.0);
    gl.uniform1f(scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(matrixLocation, false, params.matrix);
    gl.uniformMatrix2fv(
      matrixHalfPiLocation,
      false,
      rotation(Math.PI / 2, true)
    );
    gl.uniformMatrix2fv(
      matrixHalfPiMinusLocation,
      false,
      rotation(-Math.PI / 2, true)
    );

    gl.enableVertexAttribArray(positionLocation1);
    gl.enableVertexAttribArray(positionLocation2);
    gl.enableVertexAttribArray(thicknessLocation);
    gl.enableVertexAttribArray(targetSizeLocation);
    gl.enableVertexAttribArray(delayLocation);
    gl.enableVertexAttribArray(minusLocation);
    gl.enableVertexAttribArray(headLocation);
    gl.enableVertexAttribArray(headPositionLocation);
    gl.enableVertexAttribArray(colorLocation);

    gl.vertexAttribPointer(
      positionLocation1,
      2,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(
      positionLocation2,
      2,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );
    gl.vertexAttribPointer(
      thicknessLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      16
    );
    gl.vertexAttribPointer(
      targetSizeLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      20
    );
    gl.vertexAttribPointer(
      delayLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      24
    );
    gl.vertexAttribPointer(
      minusLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      28
    );
    gl.vertexAttribPointer(
      headLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      32
    );
    gl.vertexAttribPointer(
      headPositionLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      36
    );
    gl.vertexAttribPointer(
      colorLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      40
    );

    gl.drawArrays(
      gl.TRIANGLES,
      params.start || 0,
      params.count || data.length / this.ATTRIBUTES
    );
  },
  initProgram(gl) {
    const vertexShader = loadShader(
      gl,
      [
        "attribute vec2 a_pos1;",
        "attribute vec2 a_pos2;",
        "attribute float a_thickness;",
        "attribute float a_tSize;",
        "attribute float a_delay;",
        "attribute float a_minus;",
        "attribute float a_head;",
        "attribute float a_headPosition;",
        "attribute float a_color;",

        "uniform vec2 u_resolution;",
        "uniform float u_ratio;",
        "uniform float u_nodeRatio;",
        "uniform float u_arrowHead;",
        "uniform float u_scale;",
        "uniform mat3 u_matrix;",
        "uniform mat2 u_matrixHalfPi;",
        "uniform mat2 u_matrixHalfPiMinus;",

        "varying vec4 color;",

        "void main() {",
        // Find the good point:
        "vec2 pos = normalize(a_pos2 - a_pos1);",

        "mat2 matrix = (1.0 - a_head) *",
        "(",
        "a_minus * u_matrixHalfPiMinus +",
        "(1.0 - a_minus) * u_matrixHalfPi",
        ") + a_head * (",
        "a_headPosition * u_matrixHalfPiMinus * 0.6 +",
        "(a_headPosition * a_headPosition - 1.0) * mat2(1.0)",
        ");",

        "pos = a_pos1 + (",
        // Deal with body:
        "(1.0 - a_head) * a_thickness * u_ratio * matrix * pos +",
        // Deal with head:
        "a_head * u_arrowHead * a_thickness * u_ratio * matrix * pos +",
        // Deal with delay:
        "a_delay * pos * (",
        "a_tSize / u_nodeRatio +",
        "u_arrowHead * a_thickness * u_ratio",
        ")",
        ");",

        // Scale from [[-1 1] [-1 1]] to the container:
        "gl_Position = vec4(",
        "((u_matrix * vec3(pos, 1)).xy /",
        "u_resolution * 2.0 - 1.0) * vec2(1, -1),",
        "0,",
        "1",
        ");",

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
        "gl_FragColor = color;",
        "}"
      ].join("\n"),
      gl.FRAGMENT_SHADER
    );

    const program = loadProgram(gl, [vertexShader, fragmentShader]);

    return program;
  }
};
