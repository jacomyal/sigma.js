import{G as a}from"./graphology.BwGEgIxD.js";function r(o,t){return typeof o=="number"?o:(typeof o=="object"&&o!==null&&"attribute"in o,t)}function u(o){const{cornerRadius:t,rotation:i}={},n=r(t,0),e=r(i,0);return{name:"diamond",glsl:`
${a}
float sdf_diamond(vec2 uv, float size, float cornerRadius, float rotation) {
  // Apply rotation if needed
  vec2 p = uv;
  if (rotation != 0.0) {
    p = rotate2D(rotation) * p;
  }

  // Diamond SDF - using rhombus formula from Inigo Quilez
  // https://iquilezles.org/articles/distfunctions2d/
  // For a diamond (square rotated 45°), b = (size, size)
  vec2 b = vec2(size, -size);
  p = abs(p);
  float h = clamp((dot(b, p) + b.y * b.y) / dot(b, b), 0.0, 1.0);
  p -= b * vec2(h, h - 1.0);
  float d = length(p) * sign(p.x);

  // Apply corner radius if specified
  if (cornerRadius > 0.0) {
    d = d + cornerRadius;
  }

  return d;
}
`,uniforms:[{name:"u_cornerRadius",type:"float",value:n},{name:"u_rotation",type:"float",value:e}],inradiusFactor:Math.SQRT1_2}}export{u as s};
