precision mediump float;

varying vec4 v_color;
varying float v_border;
varying vec4 v_texture;
varying vec2 v_diffVector;
varying float v_radius;

uniform sampler2D u_atlas;

const float radius = 0.5;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(void) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 color;

  if (v_texture.w > 0.0) {
    vec4 texel = texture2D(u_atlas, v_texture.xy, -1.0);
    color = vec4(mix(v_color, texel, texel.a).rgb, max(texel.a, v_color.a));
  } else {
    color = v_color;
  }

  float dist = length(v_diffVector) - v_radius;
  float t = 0.0;
  if (dist > v_border)
    t = 1.0;
  else if (dist > 0.0)
    t = dist / v_border;

  gl_FragColor = mix(color, transparent, t);
}