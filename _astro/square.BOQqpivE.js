import{G as a}from"./graphology.BwGEgIxD.js";function r(t,o){return typeof t=="number"?t:(typeof t=="object"&&t!==null&&"attribute"in t,o)}function c(t){const{cornerRadius:o,rotation:e}={},n=r(o,0),i=r(e,0);return{name:"square",glsl:`
${a}
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
`,uniforms:[{name:"u_cornerRadius",type:"float",value:n},{name:"u_rotation",type:"float",value:i}],inradiusFactor:Math.SQRT1_2}}export{c as s};
