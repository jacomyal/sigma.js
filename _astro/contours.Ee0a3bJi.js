import{T as e,_ as t}from"./graphology.DvPOi-Ni.js";import{t as n}from"./density-splat-program.BTtsMmJ8.js";function r({feather:t,border:n,levels:r}){let i=r.map(e=>e.threshold).sort((e,t)=>t-e),a=i.slice(0).reverse(),o=a.map((e,t,n)=>t<n.length-1?(e+n[t+1])/2:e+1),s=o.slice().reverse();return`#version 300 es
#define LEVELS_COUNT ${a.length}
#define PI 3.141592653589793238

precision highp float;

const vec4 u_levelColor_0 = vec4(0.0, 0.0, 0.0, 0.0);
const vec4 u_levelColor_${i.length+1} = vec4(0.0, 0.0, 0.0, 0.0);
const float incLevels[LEVELS_COUNT] = float[](${a.map(t=>e(t)).join(`,`)});
const float incLimits[LEVELS_COUNT] = float[](${o.map(t=>e(t)).join(`,`)});

// Density texture from splat pass:
uniform sampler2D u_densityTexture;

// Levels uniforms:
${i.map((e,t)=>`uniform vec4 u_levelColor_${t+1};`).join(`
`)}

// Border color:
${n?`uniform vec4 u_borderColor;`:``}

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
  vec4 levelColor = u_levelColor_${i.length+1};
  vec4 nextColor = u_levelColor_${i.length+1};
  ${i.map((t,r)=>`if (score > ${e(t)}) {
    levelColor = u_levelColor_${r+1};
    ${n?``:`nextColor = score > ${e(s[r])} ? u_levelColor_${r} : u_levelColor_${r+2};`}
  }`).join(` else `)}

  // When thickness=0 (no border), the inverted linearstep in contour() produces a soft 50% blend
  // at level boundaries, creating a feathered transition between adjacent level colors.
  float t = contour(score, ${e(n?n.thickness:0)}, ${e(t)});

  // Premultiply before mixing to avoid dark fringe when blending toward transparent
  vec4 baseColor = vec4(levelColor.rgb * levelColor.a, levelColor.a);
  vec4 blendColor = ${n?`u_borderColor`:`nextColor`};
  blendColor = vec4(blendColor.rgb * blendColor.a, blendColor.a);
  fragColor = mix(baseColor, blendColor, t);
}
`}var i={radius:100,feather:1.5,zoomToRadiusRatioFunction:e=>Math.sqrt(e),levels:[{color:`#cccccc`,threshold:.5}]};function a(e,a){let{levels:o,radius:s,zoomToRadiusRatioFunction:c,border:l,feather:u,getWeight:d}={...i,...a||{}};return n(e,{radius:s,zoomToRadiusRatioFunction:c,getWeight:d},{definition:{FRAGMENT_SHADER_SOURCE:r({levels:o,border:l,feather:u}),DATA_UNIFORMS:[`u_densityTexture`,...o.map((e,t)=>`u_levelColor_${t+1}`),...l?[`u_borderColor`]:[]],CAMERA_UNIFORMS:[]},cacheUniforms:({gl:e,uniformLocations:n})=>{if(e.uniform1i(n.u_densityTexture,0),o.forEach(({color:r},i)=>{let a=n[`u_levelColor_${i+1}`],[o,s,c,l]=t(r||`#0000`);e.uniform4f(a,o/255,s/255,c/255,l/255)}),l){let[r,i,a,o]=t(l.color);e.uniform4f(n.u_borderColor,r/255,i/255,a/255,o/255)}}})}export{a as t};