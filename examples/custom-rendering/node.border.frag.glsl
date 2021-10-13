precision mediump float;

varying vec4 v_color;
varying float v_border;

const float radius = 0.5;
const float halfRadius = 0.35;

void main(void) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
  float distToCenter = length(gl_PointCoord - vec2(0.5, 0.5));

  float t = 0.0;
  if (distToCenter < halfRadius - v_border)
    gl_FragColor = white;
  else if (distToCenter < halfRadius)
    gl_FragColor = mix(v_color, white, (halfRadius - distToCenter) / v_border);
  else if (distToCenter < radius - v_border)
    gl_FragColor = v_color;
  else if (distToCenter < radius)
    gl_FragColor = mix(transparent, v_color, (radius - distToCenter) / v_border);
  else
    gl_FragColor = transparent;
}
