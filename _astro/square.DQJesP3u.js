import{x as e}from"./graphology.DvPOi-Ni.js";function t(e,t){return typeof e==`number`?e:(typeof e==`object`&&e&&`attribute`in e,t)}function n(n){let{cornerRadius:r,rotation:i}=n??{},a=t(r,0),o=t(i,0);return{name:`square`,glsl:`
${e}
float sdf_square(vec2 uv, float size, float cornerRadius, float rotation) {
  // Apply rotation if needed
  vec2 p = uv;
  if (rotation != 0.0) {
    p = rotate2D(rotation) * p;
  }

  // Distance to box with given corner radius
  // Based on Inigo Quilez's box SDF: https://iquilezles.org/articles/distfunctions2d/
  vec2 d = abs(p) - vec2(size - cornerRadius);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - cornerRadius;
}
`,uniforms:[{name:`u_cornerRadius`,type:`float`,value:a},{name:`u_rotation`,type:`float`,value:o}],inradiusFactor:Math.SQRT1_2}}export{n as t};