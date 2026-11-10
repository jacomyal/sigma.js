import{f as e,i as t,n,p as r}from"./graphology.DvPOi-Ni.js";import{t as i}from"./small-graph.DE4MUY7S.js";var a=document.getElementById(`sigma-container`);function o(){return{name:`heart`,glsl:`
float dot2_heart(vec2 v) { return dot(v, v); }

float sdf_heart(vec2 uv, float size) {
  float scale = ${.7.toFixed(4)};
  // Normalize to unit space, then shift so the heart's center is at the origin
  vec2 p = uv / (size * scale);
  p.y += ${.5.toFixed(4)};

  p.x = abs(p.x);

  float d;
  if (p.y + p.x > 1.0) {
    d = sqrt(dot2_heart(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
  } else {
    d = sqrt(min(dot2_heart(p - vec2(0.0, 1.0)), dot2_heart(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
  }

  return d * size * scale;
}
`,uniforms:[],inradiusFactor:.5}}var s=i();s.forEachNode(e=>{s.setNodeAttribute(e,`shape`,e===`a`?`circle`:`heart`)}),new n(s,a,{primitives:{nodes:{shapes:[r(),o()],layers:[e()]}},styles:{nodes:[t.nodes,{shape:{attribute:`shape`}}]}});