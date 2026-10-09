import{s as C,e as E,c as F,S as R,D as $}from"./graphology.BwGEgIxD.js";import{b as M}from"./index.0OejVKio.js";import{r as O}from"./_controls.BjInEjVR.js";import{b as P}from"./bind-webgl-layer.SELYzwHf.js";import{c as H}from"./index.DCnU7tBL.js";import"./is-graph-constructor.BVugt_gr.js";import"./add-edge.DJG1E9TZ.js";import"./infer-type.9cV3mHfr.js";function U({colorStops:e,shading:s}){return`#version 300 es
precision highp float;

uniform sampler2D u_densityTexture;

// Color stop uniforms
${e.map((u,a)=>`uniform vec4 u_stopColor_${a};`).join(`
`)}

${s?`// Shading uniforms
uniform vec3 u_lightDir;
uniform float u_shadingIntensity;
uniform float u_specular;
uniform float u_shininess;
uniform float u_smoothing;`:""}

out vec4 fragColor;

const int N_STOPS = ${e.length};
const float stops[N_STOPS] = float[](${e.map(u=>C(u.value)).join(", ")});

void main() {
  float density = texelFetch(u_densityTexture, ivec2(gl_FragCoord.xy), 0).r;

  // Color ramp: each segment overwrites the previous, clamp handles boundaries
  vec4 color = u_stopColor_0;
  ${e.slice(0,-1).map((u,a)=>`if (density >= stops[${a}]) {
    color = mix(u_stopColor_${a}, u_stopColor_${a+1}, clamp((density - stops[${a}]) / (stops[${a+1}] - stops[${a}]), 0.0, 1.0));
  }`).join(`
  `)}

  ${s?`// Central differences on density² for smooth normals.
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
  color.rgb = color.rgb * lighting + vec3(spec);`:""}

  // Output premultiplied alpha
  fragColor = vec4(color.rgb * color.a, color.a);
}
`}const w={radius:100,zoomToRadiusRatioFunction:e=>Math.sqrt(e),colorStops:[{value:0,color:"#00000000"},{value:.5,color:"#4cc9f080"},{value:1,color:"#457b9dff"}]};function I(e,s){const{colorStops:y,radius:u,zoomToRadiusRatioFunction:a,shading:r,getWeight:x}={...w,...s||{}},m=[...y].sort((o,t)=>o.value-t.value),v=r?(r.lightAngle??315)*Math.PI/180:0;function S(o){const t=Math.sin(o),n=Math.cos(o),l=1,i=Math.sqrt(t*t+n*n+l*l);return[t/i,n/i,l/i]}return H(e,{radius:u,zoomToRadiusRatioFunction:a,getWeight:x},{definition:{FRAGMENT_SHADER_SOURCE:U({colorStops:m,shading:r}),DATA_UNIFORMS:["u_densityTexture",...m.map((o,t)=>`u_stopColor_${t}`),...r?["u_shadingIntensity","u_specular","u_shininess","u_smoothing"]:[]],CAMERA_UNIFORMS:r?["u_lightDir"]:[]},cacheUniforms:({gl:o,uniformLocations:t})=>{o.uniform1i(t.u_densityTexture,0),m.forEach(({color:n},l)=>{const[i,A,T,D]=E(n);o.uniform4f(t[`u_stopColor_${l}`],i/255,A/255,T/255,D/255)}),r&&(o.uniform1f(t.u_shadingIntensity,r.intensity??.5),o.uniform1f(t.u_specular,r.specular??.2),o.uniform1f(t.u_shininess,r.shininess??16),o.uniform1f(t.u_smoothing,r.smoothing??3))},setCameraUniforms:r?(o,{gl:t,uniformLocations:n})=>{const l=r.rotateWithCamera??!0?v:v+o.cameraAngle,i=S(l);t.uniform3f(n.u_lightDir,i[0],i[1],i[2])}:void 0})}const h=document.getElementById("sigma-container"),N=await fetch("/data/arctic.gexf"),L=await N.text(),c=M.parse(F,L);c.forEachNode(e=>{c.setNodeAttribute(e,"color","#ffffff")});let g=!1;const b=new R(c,h,{primitives:{depthLayers:["heatmap",...$]},edgeReducer:(e,s)=>g?s:{...s,visibility:"hidden"}}),k=[{value:.1,color:"#ffffff"},{value:1,color:"#fdcc8a"},{value:10,color:"#e34a33"},{value:100,color:"#b30000"},{value:1e3,color:"#500000"}],z={intensity:1e-4,specular:.15,shininess:24,lightAngle:315,rotateWithCamera:!0};let d=null,f=!0,p=!0;function _(){if(d&&(d(),d=null),!f){h.style.backgroundColor="#333333";return}h.style.backgroundColor="#ffffff",d=P("heatmap",b,I(c.nodes(),{radius:50,colorStops:k,getWeight:e=>c.degree(e),shading:p?z:void 0}))}const{setDisabled:G}=O({heatmap:{type:"toggle",label:"Show heatmap",default:f,action:e=>{f=e,_(),G("shading",!f)}},shading:{type:"toggle",label:"Show shading",default:p,action:e=>{p=e,_()}},edges:{type:"toggle",label:"Show edges",default:g,action:e=>{g=e,b.refresh()}}});_();
