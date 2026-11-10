import{t as e}from"./bind-webgl-layer.QOUnA2OU.js";import{T as t,_ as n,n as r,o as i,t as a}from"./graphology.DvPOi-Ni.js";import{t as o}from"./density-splat-program.BTtsMmJ8.js";import{t as s}from"./browser.6R2ZgP8N.js";import{t as c}from"./_controls.DxjZImZY.js";function l({colorStops:e,shading:n}){return`#version 300 es
precision highp float;

uniform sampler2D u_densityTexture;

// Color stop uniforms
${e.map((e,t)=>`uniform vec4 u_stopColor_${t};`).join(`
`)}

${n?`// Shading uniforms
uniform vec3 u_lightDir;
uniform float u_shadingIntensity;
uniform float u_specular;
uniform float u_shininess;
uniform float u_smoothing;`:``}

out vec4 fragColor;

const int N_STOPS = ${e.length};
const float stops[N_STOPS] = float[](${e.map(e=>t(e.value)).join(`, `)});

void main() {
  float density = texelFetch(u_densityTexture, ivec2(gl_FragCoord.xy), 0).r;

  // Color ramp: each segment overwrites the previous, clamp handles boundaries
  vec4 color = u_stopColor_0;
  ${e.slice(0,-1).map((e,t)=>`if (density >= stops[${t}]) {
    color = mix(u_stopColor_${t}, u_stopColor_${t+1}, clamp((density - stops[${t}]) / (stops[${t+1}] - stops[${t}]), 0.0, 1.0));
  }`).join(`
  `)}

  ${n?`// Central differences on density² for smooth normals.
  // Using density² as the height field makes the gradient vanish at the boundary
  // (d/dx(d²) = 2d·d/dx(d) → 0 as d → 0), avoiding dark contours at heatmap edges.
  // Manual sampling at u_smoothing pixel offset replaces dFdx/dFdy for smoother results.
  int s = int(u_smoothing);
  ivec2 coord = ivec2(gl_FragCoord.xy);
  float dR = texelFetch(u_densityTexture, coord + ivec2(s, 0), 0).r;
  float dL = texelFetch(u_densityTexture, coord - ivec2(s, 0), 0).r;
  float dU = texelFetch(u_densityTexture, coord + ivec2(0, s), 0).r;
  float dD = texelFetch(u_densityTexture, coord - ivec2(0, s), 0).r;
  float dx = (dR * dR - dL * dL) / (2.0 * u_smoothing);
  float dy = (dU * dU - dD * dD) / (2.0 * u_smoothing);
  // Empirical scale factor: density gradients are small, so amplify to get visible relief
  float bumpScale = 25.0 * u_shadingIntensity;
  vec3 normal = normalize(vec3(-dx * bumpScale, -dy * bumpScale, 1.0));

  // Blinn-Phong lighting
  float diffuse = max(dot(normal, u_lightDir), 0.0);
  vec3 halfDir = normalize(u_lightDir + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess) * u_specular;

  float ambient = 0.5;
  float lighting = ambient + (1.0 - ambient) * diffuse;
  color.rgb = color.rgb * lighting + vec3(spec);`:``}

  // Output premultiplied alpha
  fragColor = vec4(color.rgb * color.a, color.a);
}
`}var u={radius:100,zoomToRadiusRatioFunction:e=>Math.sqrt(e),colorStops:[{value:0,color:`#00000000`},{value:.5,color:`#4cc9f080`},{value:1,color:`#457b9dff`}]};function d(e,t){let{colorStops:r,radius:i,zoomToRadiusRatioFunction:a,shading:s,getWeight:c}={...u,...t||{}},d=[...r].sort((e,t)=>e.value-t.value),f=s?(s.lightAngle??315)*Math.PI/180:0;function p(e){let t=Math.sin(e),n=Math.cos(e),r=Math.sqrt(t*t+n*n+1);return[t/r,n/r,1/r]}return o(e,{radius:i,zoomToRadiusRatioFunction:a,getWeight:c},{definition:{FRAGMENT_SHADER_SOURCE:l({colorStops:d,shading:s}),DATA_UNIFORMS:[`u_densityTexture`,...d.map((e,t)=>`u_stopColor_${t}`),...s?[`u_shadingIntensity`,`u_specular`,`u_shininess`,`u_smoothing`]:[]],CAMERA_UNIFORMS:s?[`u_lightDir`]:[]},cacheUniforms:({gl:e,uniformLocations:t})=>{e.uniform1i(t.u_densityTexture,0),d.forEach(({color:r},i)=>{let[a,o,s,c]=n(r);e.uniform4f(t[`u_stopColor_${i}`],a/255,o/255,s/255,c/255)}),s&&(e.uniform1f(t.u_shadingIntensity,s.intensity??.5),e.uniform1f(t.u_specular,s.specular??.2),e.uniform1f(t.u_shininess,s.shininess??16),e.uniform1f(t.u_smoothing,s.smoothing??3))},setCameraUniforms:s?(e,{gl:t,uniformLocations:n})=>{let r=p(s.rotateWithCamera??!0?f:f+e.cameraAngle);t.uniform3f(n.u_lightDir,r[0],r[1],r[2])}:void 0})}var f=s(),p=document.getElementById(`sigma-container`),m=await(await fetch(`/data/arctic.gexf`)).text(),h=(0,f.parse)(a,m);h.forEachNode(e=>{h.setNodeAttribute(e,`color`,`#ffffff`)});var g=!1,_=new r(h,p,{primitives:{depthLayers:[`heatmap`,...i]},edgeReducer:(e,t)=>g?t:{...t,visibility:`hidden`}}),v=[{value:.1,color:`#ffffff`},{value:1,color:`#fdcc8a`},{value:10,color:`#e34a33`},{value:100,color:`#b30000`},{value:1e3,color:`#500000`}],y={intensity:1e-4,specular:.15,shininess:24,lightAngle:315,rotateWithCamera:!0},b=null,x=!0,S=!0;function C(){b&&=(b(),null),x?(p.style.backgroundColor=`#ffffff`,b=e(`heatmap`,_,d(h.nodes(),{radius:50,colorStops:v,getWeight:e=>h.degree(e),shading:S?y:void 0}))):p.style.backgroundColor=`#333333`}var{setDisabled:w}=c({heatmap:{type:`toggle`,label:`Show heatmap`,default:x,action:e=>{x=e,C(),w(`shading`,!x)}},shading:{type:`toggle`,label:`Show shading`,default:S,action:e=>{S=e,C()}},edges:{type:`toggle`,label:`Show edges`,default:g,action:e=>{g=e,_.refresh()}}});C();