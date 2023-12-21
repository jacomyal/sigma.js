// language=GLSL
const FRAGMENT_SHADER_SOURCE = /*glsl*/ `
precision mediump float;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;
varying float v_border;
varying vec4 v_texture;

uniform sampler2D u_atlas;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_diffVector);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_radius)
    gl_FragColor = transparent;
  else
    gl_FragColor = v_color;

  #else
  vec4 color;
  vec2 coordinateInTexture = v_diffVector * vec2(1.0, -1.0) / v_radius / 2.0 + vec2(0.5, 0.5);

  if (v_texture.w > 0.0) {
    vec4 texel = texture2D(u_atlas, v_texture.xy + coordinateInTexture * v_texture.zw, -1.0);
    color = vec4(mix(v_color, texel, texel.a).rgb, max(texel.a, v_color.a));
  } else {
    color = v_color;
  }

  if (dist < v_radius - v_border) {
    gl_FragColor = color;
  } else if (dist < v_radius) {
    gl_FragColor = mix(transparent, color, (v_radius - dist) / v_border);
  } else {
    gl_FragColor = transparent;
  }
  #endif
}
`;

export default FRAGMENT_SHADER_SOURCE;
