precision mediump float;

varying vec4 v_color;
varying float v_border;

const float radius = 0.5;
const float halfRadius = 0.25;

void main(void) {
  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 color1 = vec4(1.0, 1.0, 1.0, 1.0);
  vec2 m = gl_PointCoord - vec2(0.5, 0.5);
  float dist = length(m);


  if (dist < halfRadius - v_border)
    gl_FragColor = color1;
  else if (dist < halfRadius)
    gl_FragColor = mix(v_color, color1, (halfRadius - dist) / v_border);
  else if (dist < radius - v_border)
    gl_FragColor = v_color;
  else if (dist < radius)
    gl_FragColor = mix(color0, v_color, (radius - dist) / v_border);
  else
    gl_FragColor = color0;
}
