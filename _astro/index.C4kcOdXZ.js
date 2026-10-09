import{c as p}from"./index.DCnU7tBL.js";import{s as a,e as C}from"./graphology.BwGEgIxD.js";function b({feather:s,border:l,levels:i}){const r=i.map(e=>e.threshold).sort((e,o)=>o-e),c=r.slice(0).reverse(),t=c.map((e,o,n)=>o<n.length-1?(e+n[o+1])/2:e+1),d=t.slice().reverse();return`#version 300 es
#define LEVELS_COUNT ${c.length}
#define PI 3.141592653589793238

precision highp float;

const vec4 u_levelColor_0 = vec4(0.0, 0.0, 0.0, 0.0);
const vec4 u_levelColor_${r.length+1} = vec4(0.0, 0.0, 0.0, 0.0);
const float incLevels[LEVELS_COUNT] = float[](${c.map(e=>a(e)).join(",")});
const float incLimits[LEVELS_COUNT] = float[](${t.map(e=>a(e)).join(",")});

// Density texture from splat pass:
uniform sampler2D u_densityTexture;

// Levels uniforms:
${r.map((e,o)=>`uniform vec4 u_levelColor_${o+1};`).join(`
`)}

// Border color:
${l?"uniform vec4 u_borderColor;":""}

// Output
out vec4 fragColor;

// Library:
float linearstep(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float hypot(vec2 v) {
  float x = abs(v.x);
  float y = abs(v.y);
  float t = min(x, y);
  x = max(x, y);
  t = t / x;
  return x * sqrt(1.0 + t * t);
}

// Fixed width contour lines via screen-space derivatives.
// See: https://observablehq.com/@rreusser/locally-scaled-domain-coloring-part-1-contour-plots
float contour(float score, float thickness, float feather) {
  float level = incLevels[0];
  for (int i = 0; i < LEVELS_COUNT - 1; i++) {
    if (score >= incLimits[i]) {
      level = incLevels[i + 1];
    } else {
      break;
    }
  }
  float gradient = (atan(score)) * 2.0 / PI;
  float normalizedGradient = (atan(score) - atan(level)) * 2.0 / PI;

  float screenSpaceGradient = hypot(vec2(dFdx(gradient), dFdy(gradient)));
  return linearstep(
    0.5 * (thickness + feather),
    0.5 * (thickness - feather),
    (0.5 - abs(fract(normalizedGradient) - 0.5)) / screenSpaceGradient
  );
}

void main() {
  float score = texelFetch(u_densityTexture, ivec2(gl_FragCoord.xy), 0).r;

  // Level colors are 1-indexed (u_levelColor_1 .. u_levelColor_N), with sentinel
  // transparent constants at indices 0 and N+1 for boundary transitions.
  // levelsDesc is sorted descending, so u_levelColor_1 = highest threshold's color.
  // nextColor picks the adjacent level color for feathered blending at boundaries:
  //   above the midpoint limit → blend toward higher level (i), below → toward lower level (i+2).
  vec4 levelColor = u_levelColor_${r.length+1};
  vec4 nextColor = u_levelColor_${r.length+1};
  ${r.map((e,o)=>`if (score > ${a(e)}) {
    levelColor = u_levelColor_${o+1};
    ${l?"":`nextColor = score > ${a(d[o])} ? u_levelColor_${o} : u_levelColor_${o+2};`}
  }`).join(" else ")}

  // When thickness=0 (no border), the inverted linearstep in contour() produces a soft 50% blend
  // at level boundaries, creating a feathered transition between adjacent level colors.
  float t = contour(score, ${a(l?l.thickness:0)}, ${a(s)});

  // Premultiply before mixing to avoid dark fringe when blending toward transparent
  vec4 baseColor = vec4(levelColor.rgb * levelColor.a, levelColor.a);
  vec4 blendColor = ${l?"u_borderColor":"nextColor"};
  blendColor = vec4(blendColor.rgb * blendColor.a, blendColor.a);
  fragColor = mix(baseColor, blendColor, t);
}
`}const x={radius:100,feather:1.5,zoomToRadiusRatioFunction:s=>Math.sqrt(s),levels:[{color:"#cccccc",threshold:.5}]};function S(s,l){const{levels:i,radius:r,zoomToRadiusRatioFunction:c,border:t,feather:d,getWeight:_}={...x,...l||{}};return p(s,{radius:r,zoomToRadiusRatioFunction:c,getWeight:_},{definition:{FRAGMENT_SHADER_SOURCE:b({levels:i,border:t,feather:d}),DATA_UNIFORMS:["u_densityTexture",...i.map((e,o)=>`u_levelColor_${o+1}`),...t?["u_borderColor"]:[]],CAMERA_UNIFORMS:[]},cacheUniforms:({gl:e,uniformLocations:o})=>{if(e.uniform1i(o.u_densityTexture,0),i.forEach(({color:n},v)=>{const u=o[`u_levelColor_${v+1}`],[f,h,m,g]=C(n||"#0000");e.uniform4f(u,f/255,h/255,m/255,g/255)}),t){const[n,v,u,f]=C(t.color);e.uniform4f(o.u_borderColor,n/255,v/255,u/255,f/255)}}})}export{S as c};
