/**
 * This fragment shader is executed once per splatted node. With additive
 * blending enabled (requires EXT_float_blend), each grid cell accumulates:
 * - r: sum(x * mass)
 * - g: sum(y * mass)
 * - b: sum(mass)
 * - a: nodes count
 *
 * The center of mass of a cell is then (r / b, g / b).
 */
export function getQuadTreeSplatFragmentShader() {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
precision highp float;

in vec3 v_positionAndMass;

layout(location = 0) out vec4 cellOutput;

void main() {
  float mass = v_positionAndMass.z;
  cellOutput = vec4(v_positionAndMass.xy * mass, mass, 1.0);
}`;

  return SHADER;
}
