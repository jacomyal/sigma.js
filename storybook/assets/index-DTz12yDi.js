var A=Object.defineProperty;var S=(a,t,o)=>t in a?A(a,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[t]=o;var v=(a,t,o)=>S(a,typeof t!="symbol"?t+"":t,o);import{P as U,n as d,c as C}from"./sigma-BsJT_GRv.js";function D(){return`#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
  `}const x=[-1,1,1,1,-1,-1,1,-1];class P extends U{constructor(t,o,n){super(t,o,n),this.verticesCount=x.length/2}getDefinition(){const{FRAGMENT_SHADER_SOURCE:t,CAMERA_UNIFORMS:o,DATA_UNIFORMS:n}=this.getCustomLayerDefinition();return{UNIFORMS:[...o,...n],FRAGMENT_SHADER_SOURCE:t,VERTEX_SHADER_SOURCE:D(),VERTICES:6,METHOD:WebGLRenderingContext.TRIANGLE_STRIP,ATTRIBUTES:[{name:"a_position",size:2,type:WebGLRenderingContext.FLOAT}]}}hasNothingToRender(){return!1}setUniforms(t,o){this.setCameraUniforms(t,o)}bindProgram(t){const{gl:o,buffer:n}=t;o.bindBuffer(o.ARRAY_BUFFER,n);let l=0;this.ATTRIBUTES.forEach(s=>l+=this.bindAttribute(s,t,l)),o.bufferData(o.ARRAY_BUFFER,new Float32Array(x),o.STATIC_DRAW)}}function F(a,t,o){let n=!1;const l=t.createCanvas(a,{beforeLayer:"edges"}),s=t.createWebGLContext(a,{canvas:l}),f=new o(s,null,t),T=()=>{n||(s.useProgram(f.normalProgram.program),f.cacheDataUniforms(f.normalProgram))},i=()=>{n||f.render(t.getRenderParams())},e=()=>{n||s.clear(s.COLOR_BUFFER_BIT)};t.addListener("afterProcess",T),t.addListener("afterRender",i),t.addListener("afterClear",e);const r=()=>{n||(t.removeListener("afterProcess",T),t.removeListener("afterRender",i),t.removeListener("afterClear",e),t.removeListener("kill",r),f.kill(),t.killLayer(a),n=!0)};return t.addListener("kill",r),t.resize(!0),t.refresh(),r}function g({nodesCount:a,feather:t,border:o,levels:n}){const l=n.map(i=>i.threshold).sort((i,e)=>e-i),s=l.slice(0).reverse(),f=s.map((i,e,r)=>e<r.length-1?(i+r[e+1])/2:i+1);return`#version 300 es
#define NODES_COUNT ${a}
#define LEVELS_COUNT ${s.length}
#define PI 3.141592653589793238

precision highp float;

const vec4 u_levelColor_${l.length+1} = vec4(0.0, 0.0, 0.0, 0.0);
const float incLevels[LEVELS_COUNT] = float[](${s.map(i=>d(i)).join(",")});
const float incLimits[LEVELS_COUNT] = float[](${f.map(i=>d(i)).join(",")});

// Data:
uniform sampler2D u_nodesTexture;
uniform float u_radius;

// Camera:
uniform mat3 u_invMatrix;
uniform float u_width;
uniform float u_height;
uniform float u_correctionRatio;
uniform float u_zoomModifier;

// Levels uniforms:
${l.map((i,e)=>`uniform vec4 u_levelColor_${e+1};`).join(`
`)}

// Border color:
${o?"uniform vec4 u_borderColor;":""}

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

// The explanations on how to get fixed width contour lines in a GLSL fragment shader come
// from @rreuser:
// https://observablehq.com/@rreusser/locally-scaled-domain-coloring-part-1-contour-plots
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
  // This function is basically the same function as gradient, but drops to negative when it
  // reaches the middle of two consecutive levels, such that it is 0 for each level. This
  // allows having nice anti-aliased fixed width contour lines:
  float normalizedGradient = (atan(score) - atan(level)) * 2.0 / PI;
    
  float screenSpaceGradient = hypot(vec2(dFdx(gradient), dFdy(gradient)));
  return linearstep(
    0.5 * (thickness + feather),
    0.5 * (thickness - feather),
    (0.5 - abs(fract(normalizedGradient) - 0.5)) / screenSpaceGradient
  );
}

// Actual shader code:
void main() {
  vec2 position = (u_invMatrix * vec3(gl_FragCoord.xy * 2.0 / vec2(u_width, u_height) - vec2(1.0, 1.0), 1)).xy;
  float score = 0.0;

  float factor = 0.5 / u_correctionRatio;
  float radius = u_radius * u_zoomModifier;
  float correctedRadius = radius / factor;
  float correctedRadiusSquare = correctedRadius * correctedRadius; 

  for (int i = 0; i < NODES_COUNT; i++) {
    vec2 nodePos = texelFetch(u_nodesTexture, ivec2(i, 0), 0).xy;
    vec2 diff = position - nodePos;
    // Early exit check with Manhattan distance:
    if (diff.x >= correctedRadius || diff.y >= correctedRadius) continue;
    float dSquare = dot(diff, diff);
    // Early exit check with squared distance:
    if (dSquare >= correctedRadiusSquare) continue;
    float d = sqrt(dSquare) * factor;
    score += smoothstep(radius, 0.0, d);
  }

  vec4 levelColor = u_levelColor_${l.length+1};
  vec4 nextColor = u_levelColor_${l.length+1};
  ${l.map((i,e)=>`if (score > ${d(i)}) {
    levelColor = u_levelColor_${e+1};
    ${o?"":`nextColor = score > ${d(f[e])} ? u_levelColor_${e+1} : u_levelColor_${e+2};`}
  }`).join(" else ")}

  float t = contour(score, ${d(o?o.thickness:0)}, ${d(t)});
  fragColor = mix(levelColor, ${o?"u_borderColor":"nextColor"}, t);
}
`}const p={radius:100,feather:1.5,zoomToRadiusRatioFunction:a=>Math.sqrt(a),levels:[{color:"#cccccc",threshold:.5}]};function N(a,t){const{levels:o,radius:n,zoomToRadiusRatioFunction:l,border:s,feather:f}={...p,...t||{}};return class extends P{constructor(e,r,u){if(!(e instanceof WebGL2RenderingContext))throw new Error("createContoursProgram only works with WebGL2");super(e,r,u);v(this,"nodesTexture");this.nodesTexture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.nodesTexture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST)}getNodesPositionArray(){const e=new Float32Array(a.length*2);return a.forEach((r,u)=>{const c=this.renderer.getNodeDisplayData(r);if(!c)throw new Error(`createContoursProgram: Node ${r} not found`);e[2*u]=c.x,e[2*u+1]=c.y}),e}renderProgram(e,r){const u=r.gl;u.activeTexture(u.TEXTURE0),u.bindTexture(u.TEXTURE_2D,this.nodesTexture),super.renderProgram(e,r)}getCustomLayerDefinition(){return{FRAGMENT_SHADER_SOURCE:g({levels:o,border:s,feather:f,nodesCount:a.length}),DATA_UNIFORMS:["u_nodesPosition","u_radius",...o.map((e,r)=>`u_levelColor_${r+1}`),...s?["u_borderColor"]:[]],CAMERA_UNIFORMS:["u_invMatrix","u_width","u_height","u_correctionRatio","u_zoomModifier"]}}setCameraUniforms({invMatrix:e,correctionRatio:r,zoomRatio:u},{gl:c,uniformLocations:{u_invMatrix:_,u_width:m,u_height:h,u_correctionRatio:E,u_zoomModifier:R}}){c.uniform1f(m,c.canvas.width),c.uniform1f(h,c.canvas.height),c.uniform1f(E,r),c.uniform1f(R,1/l(u)),c.uniformMatrix3fv(_,!1,e)}cacheDataUniforms({gl:e,uniformLocations:r}){const{u_radius:u}=r;if(e.uniform1f(u,n),e.bindTexture(e.TEXTURE_2D,this.nodesTexture),e.texImage2D(e.TEXTURE_2D,0,WebGL2RenderingContext.RG32F,a.length,1,0,WebGL2RenderingContext.RG,e.FLOAT,this.getNodesPositionArray()),o.forEach(({color:c},_)=>{const m=r[`u_levelColor_${_+1}`],[h,E,R,L]=C(c||"#0000");e.uniform4f(m,h/255,E/255,R/255,L/255)}),s){const[c,_,m,h]=C(s.color);e.uniform4f(r.u_borderColor,c/255,_/255,m/255,h/255)}}}}export{F as b,N as c};
