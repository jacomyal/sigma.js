var bt=Object.defineProperty;var Et=(t,e,o)=>e in t?bt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var Z=(t,e,o)=>(Et(t,typeof e!="symbol"?e+"":e,o),o);import{P as Ct,n as U,c as tt,i as nt,k as ot,G as B,S as q,o as X}from"./utils-Ph0PoCvK.js";import{g as wt}from"./_commonjsHelpers-BosuxZz1.js";import{d as rt,g as At}from"./defaults-9mJNxk8k.js";import{i as xt}from"./index-BT1YDs3_.js";import{d as it}from"./data-ro0eVT-D.js";import{p as Tt}from"./index-CvkDsaGQ.js";import"./is-graph-constructor-C6mKuIz0.js";import"./add-edge-CCsz5v3R.js";function Wt(){return`#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
  `}const et=[-1,1,1,1,-1,-1,1,-1];class _t extends Ct{constructor(e,o,n){super(e,o,n),this.verticesCount=et.length/2}getDefinition(){const{FRAGMENT_SHADER_SOURCE:e,CAMERA_UNIFORMS:o,DATA_UNIFORMS:n}=this.getCustomLayerDefinition();return{UNIFORMS:[...o,...n],FRAGMENT_SHADER_SOURCE:e,VERTEX_SHADER_SOURCE:Wt(),VERTICES:6,METHOD:WebGLRenderingContext.TRIANGLE_STRIP,ATTRIBUTES:[{name:"a_position",size:2,type:WebGLRenderingContext.FLOAT}]}}hasNothingToRender(){return!1}setUniforms(e,o){this.setCameraUniforms(e,o)}bindProgram(e){const{gl:o,buffer:n}=e;o.bindBuffer(o.ARRAY_BUFFER,n);let i=0;this.ATTRIBUTES.forEach(s=>i+=this.bindAttribute(s,e,i)),o.bufferData(o.ARRAY_BUFFER,new Float32Array(et),o.STATIC_DRAW)}}function H(t,e,o){let n=!1;const i=e.createCanvas(t,{beforeLayer:"edges"}),s=e.createWebGLContext(t,{canvas:i}),d=new o(s,null,e),c=()=>{n||(s.useProgram(d.normalProgram.program),d.cacheDataUniforms(d.normalProgram))},l=()=>{n||d.render(e.getRenderParams())},r=()=>{n||s.clear(s.COLOR_BUFFER_BIT)};e.addListener("afterProcess",c),e.addListener("afterRender",l),e.addListener("afterClear",r);const a=()=>{n||(e.removeListener("afterProcess",c),e.removeListener("afterRender",l),e.removeListener("afterClear",r),e.removeListener("kill",a),d.kill(),e.killLayer(t),n=!0)};return e.addListener("kill",a),e.resize(!0),e.refresh(),a}function Lt({nodesCount:t,feather:e,border:o,levels:n}){const i=n.map(l=>l.threshold).sort((l,r)=>r-l),s=i.slice(0).reverse(),d=s.map((l,r,a)=>r<a.length-1?(l+a[r+1])/2:l+1);return`#version 300 es
#define NODES_COUNT ${t}
#define LEVELS_COUNT ${s.length}
#define PI 3.141592653589793238

precision highp float;

const vec4 u_levelColor_${i.length+1} = vec4(0.0, 0.0, 0.0, 0.0);
const float incLevels[LEVELS_COUNT] = float[](${s.map(l=>U(l)).join(",")});
const float incLimits[LEVELS_COUNT] = float[](${d.map(l=>U(l)).join(",")});

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
${i.map((l,r)=>`uniform vec4 u_levelColor_${r+1};`).join(`
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

  vec4 levelColor = u_levelColor_${i.length+1};
  vec4 nextColor = u_levelColor_${i.length+1};
  ${i.map((l,r)=>`if (score > ${U(l)}) {
    levelColor = u_levelColor_${r+1};
    ${o?"":`nextColor = score > ${U(d[r])} ? u_levelColor_${r+1} : u_levelColor_${r+2};`}
  }`).join(" else ")}

  float t = contour(score, ${U(o?o.thickness:0)}, ${U(e)});
  fragColor = mix(levelColor, ${o?"u_borderColor":"nextColor"}, t);
}
`}const St={radius:100,feather:1.5,zoomToRadiusRatioFunction:t=>Math.sqrt(t),levels:[{color:"#cccccc",threshold:.5}]};function V(t,e){const{levels:o,radius:n,zoomToRadiusRatioFunction:i,border:s,feather:d}={...St,...e||{}};return class extends _t{constructor(r,a,u){if(!(r instanceof WebGL2RenderingContext))throw new Error("createContoursProgram only works with WebGL2");super(r,a,u);Z(this,"nodesTexture");this.nodesTexture=r.createTexture(),r.bindTexture(r.TEXTURE_2D,this.nodesTexture),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST)}getNodesPositionArray(){const r=new Float32Array(t.length*2);return t.forEach((a,u)=>{const h=this.renderer.getNodeDisplayData(a);if(!h)throw new Error(`createContoursProgram: Node ${a} not found`);r[2*u]=h.x,r[2*u+1]=h.y}),r}renderProgram(r,a){const u=a.gl;u.activeTexture(u.TEXTURE0),u.bindTexture(u.TEXTURE_2D,this.nodesTexture),super.renderProgram(r,a)}getCustomLayerDefinition(){return{FRAGMENT_SHADER_SOURCE:Lt({levels:o,border:s,feather:d,nodesCount:t.length}),DATA_UNIFORMS:["u_nodesPosition","u_radius",...o.map((r,a)=>`u_levelColor_${a+1}`),...s?["u_borderColor"]:[]],CAMERA_UNIFORMS:["u_invMatrix","u_width","u_height","u_correctionRatio","u_zoomModifier"]}}setCameraUniforms({invMatrix:r,correctionRatio:a,zoomRatio:u},{gl:h,uniformLocations:{u_invMatrix:m,u_width:y,u_height:f,u_correctionRatio:g,u_zoomModifier:p}}){h.uniform1f(y,h.canvas.width),h.uniform1f(f,h.canvas.height),h.uniform1f(g,a),h.uniform1f(p,1/i(u)),h.uniformMatrix3fv(m,!1,r)}cacheDataUniforms({gl:r,uniformLocations:a}){const{u_radius:u}=a;if(r.uniform1f(u,n),r.bindTexture(r.TEXTURE_2D,this.nodesTexture),r.texImage2D(r.TEXTURE_2D,0,WebGL2RenderingContext.RG32F,t.length,1,0,WebGL2RenderingContext.RG,r.FLOAT,this.getNodesPositionArray()),o.forEach(({color:h},m)=>{const y=a[`u_levelColor_${m+1}`],[f,g,p,C]=tt(h||"#0000");r.uniform4f(y,f/255,g/255,p/255,C/255)}),s){const[h,m,y,f]=tt(s.color);r.uniform4f(a.u_borderColor,h/255,m/255,y/255,f/255)}}}}var It=nt,Mt=function(e){if(!It(e))throw new Error("graphology-utils/infer-type: expecting a valid graphology instance.");var o=e.type;return o!=="mixed"?o:e.directedSize===0&&e.undirectedSize===0||e.directedSize>0&&e.undirectedSize>0?"mixed":e.directedSize>0?"directed":"undirected"},$={};(function(t){var e=Math.pow(2,8)-1,o=Math.pow(2,16)-1,n=Math.pow(2,32)-1,i=Math.pow(2,7)-1,s=Math.pow(2,15)-1,d=Math.pow(2,31)-1;t.getPointerArray=function(l){var r=l-1;if(r<=e)return Uint8Array;if(r<=o)return Uint16Array;if(r<=n)return Uint32Array;throw new Error("mnemonist: Pointer Array of size > 4294967295 is not supported.")},t.getSignedPointerArray=function(l){var r=l-1;return r<=i?Int8Array:r<=s?Int16Array:r<=d?Int32Array:Float64Array},t.getNumberType=function(l){return l===(l|0)?Math.sign(l)===-1?l<=127&&l>=-128?Int8Array:l<=32767&&l>=-32768?Int16Array:Int32Array:l<=255?Uint8Array:l<=65535?Uint16Array:Uint32Array:Float64Array};var c={Uint8Array:1,Int8Array:2,Uint16Array:3,Int16Array:4,Uint32Array:5,Int32Array:6,Float32Array:7,Float64Array:8};t.getMinimalRepresentation=function(l,r){var a=null,u=0,h,m,y,f,g;for(f=0,g=l.length;f<g;f++)y=r?r(l[f]):l[f],m=t.getNumberType(y),h=c[m.name],h>u&&(u=h,a=m);return a},t.isTypedArray=function(l){return typeof ArrayBuffer<"u"&&ArrayBuffer.isView(l)},t.concat=function(){var l=0,r,a,u;for(r=0,u=arguments.length;r<u;r++)l+=arguments[r].length;var h=new arguments[0].constructor(l);for(r=0,a=0;r<u;r++)h.set(arguments[r],a),a+=arguments[r].length;return h},t.indices=function(l){for(var r=t.getPointerArray(l),a=new r(l),u=0;u<l;u++)a[u]=u;return a}})($);var Q=ot,Rt=$.getPointerArray;function _(t,e){arguments.length<2&&(e=t,t=Array);var o=Rt(e);this.size=0,this.length=e,this.dense=new o(e),this.sparse=new o(e),this.vals=new t(e)}_.prototype.clear=function(){this.size=0};_.prototype.has=function(t){var e=this.sparse[t];return e<this.size&&this.dense[e]===t};_.prototype.get=function(t){var e=this.sparse[t];if(e<this.size&&this.dense[e]===t)return this.vals[e]};_.prototype.set=function(t,e){var o=this.sparse[t];return o<this.size&&this.dense[o]===t?(this.vals[o]=e,this):(this.dense[this.size]=t,this.sparse[t]=this.size,this.vals[this.size]=e,this.size++,this)};_.prototype.delete=function(t){var e=this.sparse[t];return e>=this.size||this.dense[e]!==t?!1:(e=this.dense[this.size-1],this.dense[this.sparse[t]]=e,this.sparse[e]=this.sparse[t],this.size--,!0)};_.prototype.forEach=function(t,e){e=arguments.length>1?e:this;for(var o=0;o<this.size;o++)t.call(e,this.vals[o],this.dense[o])};_.prototype.keys=function(){var t=this.size,e=this.dense,o=0;return new Q(function(){if(o<t){var n=e[o];return o++,{value:n}}return{done:!0}})};_.prototype.values=function(){var t=this.size,e=this.vals,o=0;return new Q(function(){if(o<t){var n=e[o];return o++,{value:n}}return{done:!0}})};_.prototype.entries=function(){var t=this.size,e=this.dense,o=this.vals,n=0;return new Q(function(){if(n<t){var i=[e[n],o[n]];return n++,{value:i}}return{done:!0}})};typeof Symbol<"u"&&(_.prototype[Symbol.iterator]=_.prototype.entries);_.prototype.inspect=function(){for(var t=new Map,e=0;e<this.size;e++)t.set(this.dense[e],this.vals[e]);return Object.defineProperty(t,"constructor",{value:_,enumerable:!1}),t.length=this.length,this.vals.constructor!==Array&&(t.type=this.vals.constructor.name),t};typeof Symbol<"u"&&(_.prototype[Symbol.for("nodejs.util.inspect.custom")]=_.prototype.inspect);var Dt=_,Pt=ot,Nt=$.getPointerArray;function L(t){var e=Nt(t);this.start=0,this.size=0,this.capacity=t,this.dense=new e(t),this.sparse=new e(t)}L.prototype.clear=function(){this.start=0,this.size=0};L.prototype.has=function(t){if(this.size===0)return!1;var e=this.sparse[t],o=e<this.capacity&&e>=this.start&&e<this.start+this.size||e<(this.start+this.size)%this.capacity;return o&&this.dense[e]===t};L.prototype.enqueue=function(t){var e=this.sparse[t];if(this.size!==0){var o=e<this.capacity&&e>=this.start&&e<this.start+this.size||e<(this.start+this.size)%this.capacity;if(o&&this.dense[e]===t)return this}return e=(this.start+this.size)%this.capacity,this.dense[e]=t,this.sparse[t]=e,this.size++,this};L.prototype.dequeue=function(){if(this.size!==0){var t=this.start;this.size--,this.start++,this.start===this.capacity&&(this.start=0);var e=this.dense[t];return this.sparse[e]=this.capacity,e}};L.prototype.forEach=function(t,e){e=arguments.length>1?e:this;for(var o=this.capacity,n=this.size,i=this.start,s=0;s<n;)t.call(e,this.dense[i],s,this),i++,s++,i===o&&(i=0)};L.prototype.values=function(){var t=this.dense,e=this.capacity,o=this.size,n=this.start,i=0;return new Pt(function(){if(i>=o)return{done:!0};var s=t[n];return n++,i++,n===e&&(n=0),{value:s,done:!1}})};typeof Symbol<"u"&&(L.prototype[Symbol.iterator]=L.prototype.values);L.prototype.inspect=function(){var t=[];return this.forEach(function(e){t.push(e)}),Object.defineProperty(t,"constructor",{value:L,enumerable:!1}),t.capacity=this.capacity,t};typeof Symbol<"u"&&(L.prototype[Symbol.for("nodejs.util.inspect.custom")]=L.prototype.inspect);var Ot=L;function st(t){return function(e){return typeof e!="number"&&(e=e.length),Math.floor(t()*e)}}var at=st(Math.random);at.createRandomIndex=st;var Ut=at,Y={},P=$,lt=rt,ht=At.createEdgeWeightGetter,ut=Symbol.for("nodejs.util.inspect.custom"),ct={getEdgeWeight:"weight",keepDendrogram:!1,resolution:1};function A(t,e){e=lt(e,ct);var o=e.resolution,n=ht(e.getEdgeWeight).fromEntry,i=(t.size-t.selfLoopCount)*2,s=P.getPointerArray(i),d=P.getPointerArray(t.order+1),c=e.getEdgeWeight?Float64Array:P.getPointerArray(t.size*2);this.C=t.order,this.M=0,this.E=i,this.U=0,this.resolution=o,this.level=0,this.graph=t,this.nodes=new Array(t.order),this.keepDendrogram=e.keepDendrogram,this.neighborhood=new d(i),this.weights=new c(i),this.loops=new c(t.order),this.starts=new s(t.order+1),this.belongings=new d(t.order),this.dendrogram=[],this.mapping=null,this.counts=new d(t.order),this.unused=new d(t.order),this.totalWeights=new c(t.order);var l={},r,a=0,u=0,h=this;t.forEachNode(function(m){h.nodes[a]=m,l[m]=a,u+=t.undirectedDegreeWithoutSelfLoops(m),h.starts[a]=u,h.belongings[a]=a,h.counts[a]=1,a++}),t.forEachEdge(function(m,y,f,g,p,C,v){if(r=n(m,y,f,g,p,C,v),f=l[f],g=l[g],h.M+=r,f===g)h.totalWeights[f]+=r*2,h.loops[f]=r*2;else{h.totalWeights[f]+=r,h.totalWeights[g]+=r;var E=--h.starts[f],W=--h.starts[g];h.neighborhood[E]=g,h.neighborhood[W]=f,h.weights[E]=r,h.weights[W]=r}}),this.starts[a]=this.E,this.keepDendrogram?this.dendrogram.push(this.belongings.slice()):this.mapping=this.belongings.slice()}A.prototype.isolate=function(t,e){var o=this.belongings[t];if(this.counts[o]===1)return o;var n=this.unused[--this.U],i=this.loops[t];return this.totalWeights[o]-=e+i,this.totalWeights[n]+=e+i,this.belongings[t]=n,this.counts[o]--,this.counts[n]++,n};A.prototype.move=function(t,e,o){var n=this.belongings[t],i=this.loops[t];this.totalWeights[n]-=e+i,this.totalWeights[o]+=e+i,this.belongings[t]=o;var s=this.counts[n]--===1;this.counts[o]++,s&&(this.unused[this.U++]=n)};A.prototype.computeNodeDegree=function(t){var e,o,n,i=0;for(e=this.starts[t],o=this.starts[t+1];e<o;e++)n=this.weights[e],i+=n;return i};A.prototype.expensiveIsolate=function(t){var e=this.computeNodeDegree(t);return this.isolate(t,e)};A.prototype.expensiveMove=function(t,e){var o=this.computeNodeDegree(t);this.move(t,o,e)};A.prototype.zoomOut=function(){var t=new Array(this.C-this.U),e={},o=this.nodes.length,n=0,i=0,s,d,c,l,r,a,u,h,m;for(s=0,c=this.C;s<c;s++)a=this.belongings[s],a in e||(e[a]=n,t[n]={adj:{},totalWeights:this.totalWeights[a],internalWeights:0},n++),this.belongings[s]=e[a];var y,f;if(this.keepDendrogram){for(y=this.dendrogram[this.level],f=new(P.getPointerArray(n))(o),s=0;s<o;s++)f[s]=this.belongings[y[s]];this.dendrogram.push(f)}else for(s=0;s<o;s++)this.mapping[s]=this.belongings[this.mapping[s]];for(s=0,c=this.C;s<c;s++)for(a=this.belongings[s],h=t[a],m=h.adj,h.internalWeights+=this.loops[s],d=this.starts[s],l=this.starts[s+1];d<l;d++){if(r=this.neighborhood[d],u=this.belongings[r],a===u){h.internalWeights+=this.weights[d];continue}u in m||(m[u]=0),m[u]+=this.weights[d]}for(this.C=n,r=0,a=0;a<n;a++){h=t[a],m=h.adj,a=+a,this.totalWeights[a]=h.totalWeights,this.loops[a]=h.internalWeights,this.counts[a]=1,this.starts[a]=r,this.belongings[a]=a;for(u in m)this.neighborhood[r]=+u,this.weights[r]=m[u],i++,r++}return this.starts[n]=i,this.E=i,this.U=0,this.level++,e};A.prototype.modularity=function(){var t,e,o,n,i,s=0,d=this.M*2,c=new Float64Array(this.C);for(o=0;o<this.C;o++)for(t=this.belongings[o],c[t]+=this.loops[o],n=this.starts[o],i=this.starts[o+1];n<i;n++)e=this.belongings[this.neighborhood[n]],t===e&&(c[t]+=this.weights[n]);for(o=0;o<this.C;o++)s+=c[o]/d-Math.pow(this.totalWeights[o]/d,2)*this.resolution;return s};A.prototype.delta=function(t,e,o,n){var i=this.M,s=this.totalWeights[n];return e+=this.loops[t],o/i-s*e*this.resolution/(2*i*i)};A.prototype.deltaWithOwnCommunity=function(t,e,o,n){var i=this.M,s=this.totalWeights[n];return e+=this.loops[t],o/i-(s-e)*e*this.resolution/(2*i*i)};A.prototype.fastDelta=function(t,e,o,n){var i=this.M,s=this.totalWeights[n];return e+=this.loops[t],o-e*s*this.resolution/(2*i)};A.prototype.fastDeltaWithOwnCommunity=function(t,e,o,n){var i=this.M,s=this.totalWeights[n];return e+=this.loops[t],o-e*(s-e)*this.resolution/(2*i)};A.prototype.bounds=function(t){return[this.starts[t],this.starts[t+1]]};A.prototype.project=function(){var t=this,e={};return t.nodes.slice(0,this.C).forEach(function(o,n){e[o]=Array.from(t.neighborhood.slice(t.starts[n],t.starts[n+1])).map(function(i){return t.nodes[i]})}),e};A.prototype.collect=function(t){arguments.length<1&&(t=this.level);var e={},o=this.keepDendrogram?this.dendrogram[t]:this.mapping,n,i;for(n=0,i=o.length;n<i;n++)e[this.nodes[n]]=o[n];return e};A.prototype.assign=function(t,e){arguments.length<2&&(e=this.level);var o=this.keepDendrogram?this.dendrogram[e]:this.mapping,n,i;for(n=0,i=o.length;n<i;n++)this.graph.setNodeAttribute(this.nodes[n],t,o[n])};A.prototype[ut]=function(){var t={};Object.defineProperty(t,"constructor",{value:A,enumerable:!1}),t.C=this.C,t.M=this.M,t.E=this.E,t.U=this.U,t.resolution=this.resolution,t.level=this.level,t.nodes=this.nodes,t.starts=this.starts.slice(0,t.C+1);var e=["neighborhood","weights"],o=["counts","loops","belongings","totalWeights"],n=this;return e.forEach(function(i){t[i]=n[i].slice(0,t.E)}),o.forEach(function(i){t[i]=n[i].slice(0,t.C)}),t.unused=this.unused.slice(0,this.U),this.keepDendrogram?t.dendrogram=this.dendrogram:t.mapping=this.mapping,t};function T(t,e){e=lt(e,ct);var o=e.resolution,n=ht(e.getEdgeWeight).fromEntry,i=(t.size-t.selfLoopCount)*2,s=P.getPointerArray(i),d=P.getPointerArray(t.order+1),c=e.getEdgeWeight?Float64Array:P.getPointerArray(t.size*2);this.C=t.order,this.M=0,this.E=i,this.U=0,this.resolution=o,this.level=0,this.graph=t,this.nodes=new Array(t.order),this.keepDendrogram=e.keepDendrogram,this.neighborhood=new d(i),this.weights=new c(i),this.loops=new c(t.order),this.starts=new s(t.order+1),this.offsets=new s(t.order),this.belongings=new d(t.order),this.dendrogram=[],this.counts=new d(t.order),this.unused=new d(t.order),this.totalInWeights=new c(t.order),this.totalOutWeights=new c(t.order);var l={},r,a=0,u=0,h=this;t.forEachNode(function(m){h.nodes[a]=m,l[m]=a,u+=t.outDegreeWithoutSelfLoops(m),h.starts[a]=u,u+=t.inDegreeWithoutSelfLoops(m),h.offsets[a]=u,h.belongings[a]=a,h.counts[a]=1,a++}),t.forEachEdge(function(m,y,f,g,p,C,v){if(r=n(m,y,f,g,p,C,v),f=l[f],g=l[g],h.M+=r,f===g)h.loops[f]+=r,h.totalInWeights[f]+=r,h.totalOutWeights[f]+=r;else{h.totalOutWeights[f]+=r,h.totalInWeights[g]+=r;var E=--h.starts[f],W=--h.offsets[g];h.neighborhood[E]=g,h.neighborhood[W]=f,h.weights[E]=r,h.weights[W]=r}}),this.starts[a]=this.E,this.keepDendrogram?this.dendrogram.push(this.belongings.slice()):this.mapping=this.belongings.slice()}T.prototype.bounds=A.prototype.bounds;T.prototype.inBounds=function(t){return[this.offsets[t],this.starts[t+1]]};T.prototype.outBounds=function(t){return[this.starts[t],this.offsets[t]]};T.prototype.project=A.prototype.project;T.prototype.projectIn=function(){var t=this,e={};return t.nodes.slice(0,this.C).forEach(function(o,n){e[o]=Array.from(t.neighborhood.slice(t.offsets[n],t.starts[n+1])).map(function(i){return t.nodes[i]})}),e};T.prototype.projectOut=function(){var t=this,e={};return t.nodes.slice(0,this.C).forEach(function(o,n){e[o]=Array.from(t.neighborhood.slice(t.starts[n],t.offsets[n])).map(function(i){return t.nodes[i]})}),e};T.prototype.isolate=function(t,e,o){var n=this.belongings[t];if(this.counts[n]===1)return n;var i=this.unused[--this.U],s=this.loops[t];return this.totalInWeights[n]-=e+s,this.totalInWeights[i]+=e+s,this.totalOutWeights[n]-=o+s,this.totalOutWeights[i]+=o+s,this.belongings[t]=i,this.counts[n]--,this.counts[i]++,i};T.prototype.move=function(t,e,o,n){var i=this.belongings[t],s=this.loops[t];this.totalInWeights[i]-=e+s,this.totalInWeights[n]+=e+s,this.totalOutWeights[i]-=o+s,this.totalOutWeights[n]+=o+s,this.belongings[t]=n;var d=this.counts[i]--===1;this.counts[n]++,d&&(this.unused[this.U++]=i)};T.prototype.computeNodeInDegree=function(t){var e,o,n,i=0;for(e=this.offsets[t],o=this.starts[t+1];e<o;e++)n=this.weights[e],i+=n;return i};T.prototype.computeNodeOutDegree=function(t){var e,o,n,i=0;for(e=this.starts[t],o=this.offsets[t];e<o;e++)n=this.weights[e],i+=n;return i};T.prototype.expensiveMove=function(t,e){var o=this.computeNodeInDegree(t),n=this.computeNodeOutDegree(t);this.move(t,o,n,e)};T.prototype.zoomOut=function(){var t=new Array(this.C-this.U),e={},o=this.nodes.length,n=0,i=0,s,d,c,l,r,a,u,h,m,y,f,g,p;for(s=0,c=this.C;s<c;s++)a=this.belongings[s],a in e||(e[a]=n,t[n]={inAdj:{},outAdj:{},totalInWeights:this.totalInWeights[a],totalOutWeights:this.totalOutWeights[a],internalWeights:0},n++),this.belongings[s]=e[a];var C,v;if(this.keepDendrogram){for(C=this.dendrogram[this.level],v=new(P.getPointerArray(n))(o),s=0;s<o;s++)v[s]=this.belongings[C[s]];this.dendrogram.push(v)}else for(s=0;s<o;s++)this.mapping[s]=this.belongings[this.mapping[s]];for(s=0,c=this.C;s<c;s++)for(a=this.belongings[s],m=this.offsets[s],h=t[a],g=h.inAdj,p=h.outAdj,h.internalWeights+=this.loops[s],d=this.starts[s],l=this.starts[s+1];d<l;d++){if(r=this.neighborhood[d],u=this.belongings[r],y=d<m,f=y?p:g,a===u){y&&(h.internalWeights+=this.weights[d]);continue}u in f||(f[u]=0),f[u]+=this.weights[d]}for(this.C=n,r=0,a=0;a<n;a++){h=t[a],g=h.inAdj,p=h.outAdj,a=+a,this.totalInWeights[a]=h.totalInWeights,this.totalOutWeights[a]=h.totalOutWeights,this.loops[a]=h.internalWeights,this.counts[a]=1,this.starts[a]=r,this.belongings[a]=a;for(u in p)this.neighborhood[r]=+u,this.weights[r]=p[u],i++,r++;this.offsets[a]=r;for(u in g)this.neighborhood[r]=+u,this.weights[r]=g[u],i++,r++}return this.starts[n]=i,this.E=i,this.U=0,this.level++,e};T.prototype.modularity=function(){var t,e,o,n,i,s=0,d=this.M,c=new Float64Array(this.C);for(o=0;o<this.C;o++)for(t=this.belongings[o],c[t]+=this.loops[o],n=this.starts[o],i=this.offsets[o];n<i;n++)e=this.belongings[this.neighborhood[n]],t===e&&(c[t]+=this.weights[n]);for(o=0;o<this.C;o++)s+=c[o]/d-this.totalInWeights[o]*this.totalOutWeights[o]/Math.pow(d,2)*this.resolution;return s};T.prototype.delta=function(t,e,o,n,i){var s=this.M,d=this.totalInWeights[i],c=this.totalOutWeights[i],l=this.loops[t];return e+=l,o+=l,n/s-(o*d+e*c)*this.resolution/(s*s)};T.prototype.deltaWithOwnCommunity=function(t,e,o,n,i){var s=this.M,d=this.totalInWeights[i],c=this.totalOutWeights[i],l=this.loops[t];return e+=l,o+=l,n/s-(o*(d-e)+e*(c-o))*this.resolution/(s*s)};T.prototype.collect=A.prototype.collect;T.prototype.assign=A.prototype.assign;T.prototype[ut]=function(){var t={};Object.defineProperty(t,"constructor",{value:T,enumerable:!1}),t.C=this.C,t.M=this.M,t.E=this.E,t.U=this.U,t.resolution=this.resolution,t.level=this.level,t.nodes=this.nodes,t.starts=this.starts.slice(0,t.C+1);var e=["neighborhood","weights"],o=["counts","offsets","loops","belongings","totalInWeights","totalOutWeights"],n=this;return e.forEach(function(i){t[i]=n[i].slice(0,t.E)}),o.forEach(function(i){t[i]=n[i].slice(0,t.C)}),t.unused=this.unused.slice(0,this.U),this.keepDendrogram?t.dendrogram=this.dendrogram:t.mapping=this.mapping,t};Y.UndirectedLouvainIndex=A;Y.DirectedLouvainIndex=T;var zt=rt,kt=nt,Gt=Mt,dt=Dt,ft=Ot,mt=Ut.createRandomIndex,gt=Y,$t=gt.UndirectedLouvainIndex,jt=gt.DirectedLouvainIndex,pt={nodeCommunityAttribute:"community",getEdgeWeight:"weight",fastLocalMoves:!0,randomWalk:!0,resolution:1,rng:Math.random};function k(t,e,o){var n=t.get(e);typeof n>"u"&&(n=0),n+=o,t.set(e,n)}var Ft=1e-10;function G(t,e,o,n,i){return Math.abs(n-i)<Ft?t===e?!1:o>t:n>i}function Bt(t,e,o){var n=new $t(e,{getEdgeWeight:o.getEdgeWeight,keepDendrogram:t,resolution:o.resolution}),i=mt(o.rng),s=!0,d=!0,c,l,r=new dt(Float64Array,n.C),a,u,h,m,y,f,g,p,C,v,E,W,b,x,R,w,S=0,D=0,I=[],N,M;for(o.fastLocalMoves&&(a=new ft(n.C));s;){if(v=n.C,s=!1,d=!0,o.fastLocalMoves){for(M=0,f=o.randomWalk?i(v):0,g=0;g<v;g++,f++)p=f%v,a.enqueue(p);for(;a.size!==0;){for(p=a.dequeue(),D++,E=0,r.clear(),c=n.belongings[p],u=n.starts[p],h=n.starts[p+1];u<h;u++)C=n.neighborhood[u],m=n.weights[u],l=n.belongings[C],E+=m,k(r,l,m);for(x=n.fastDeltaWithOwnCommunity(p,E,r.get(c)||0,c),b=c,y=0;y<r.size;y++)l=r.dense[y],l!==c&&(W=r.vals[y],S++,w=n.fastDelta(p,E,W,l),R=G(b,c,l,w,x),R&&(x=w,b=l));if(x<0){if(b=n.isolate(p,E),b===c)continue}else{if(b===c)continue;n.move(p,E,b)}for(s=!0,M++,u=n.starts[p],h=n.starts[p+1];u<h;u++)C=n.neighborhood[u],l=n.belongings[C],l!==b&&a.enqueue(C)}I.push(M)}else for(N=[],I.push(N);d;){for(d=!1,M=0,f=o.randomWalk?i(v):0,g=0;g<v;g++,f++){for(p=f%v,D++,E=0,r.clear(),c=n.belongings[p],u=n.starts[p],h=n.starts[p+1];u<h;u++)C=n.neighborhood[u],m=n.weights[u],l=n.belongings[C],E+=m,k(r,l,m);for(x=n.fastDeltaWithOwnCommunity(p,E,r.get(c)||0,c),b=c,y=0;y<r.size;y++)l=r.dense[y],l!==c&&(W=r.vals[y],S++,w=n.fastDelta(p,E,W,l),R=G(b,c,l,w,x),R&&(x=w,b=l));if(x<0){if(b=n.isolate(p,E),b===c)continue}else{if(b===c)continue;n.move(p,E,b)}d=!0,M++}N.push(M),s=d||s}s&&n.zoomOut()}var z={index:n,deltaComputations:S,nodesVisited:D,moves:I};return z}function qt(t,e,o){var n=new jt(e,{getEdgeWeight:o.getEdgeWeight,keepDendrogram:t,resolution:o.resolution}),i=mt(o.rng),s=!0,d=!0,c,l,r=new dt(Float64Array,n.C),a,u,h,m,y,f,g,p,C,v,E,W,b,x,R,w,S,D,I,N=0,M=0,z=[],F,O;for(o.fastLocalMoves&&(a=new ft(n.C));s;){if(W=n.C,s=!1,d=!0,o.fastLocalMoves){for(O=0,p=o.randomWalk?i(W):0,C=0;C<W;C++,p++)v=p%W,a.enqueue(v);for(;a.size!==0;){for(v=a.dequeue(),M++,b=0,x=0,r.clear(),c=n.belongings[v],u=n.starts[v],h=n.starts[v+1],m=n.offsets[v];u<h;u++)y=u<m,E=n.neighborhood[u],f=n.weights[u],l=n.belongings[E],y?x+=f:b+=f,k(r,l,f);for(S=n.deltaWithOwnCommunity(v,b,x,r.get(c)||0,c),w=c,g=0;g<r.size;g++)l=r.dense[g],l!==c&&(R=r.vals[g],N++,I=n.delta(v,b,x,R,l),D=G(w,c,l,I,S),D&&(S=I,w=l));if(S<0){if(w=n.isolate(v,b,x),w===c)continue}else{if(w===c)continue;n.move(v,b,x,w)}for(s=!0,O++,u=n.starts[v],h=n.starts[v+1];u<h;u++)E=n.neighborhood[u],l=n.belongings[E],l!==w&&a.enqueue(E)}z.push(O)}else for(F=[],z.push(F);d;){for(d=!1,O=0,p=o.randomWalk?i(W):0,C=0;C<W;C++,p++){for(v=p%W,M++,b=0,x=0,r.clear(),c=n.belongings[v],u=n.starts[v],h=n.starts[v+1],m=n.offsets[v];u<h;u++)y=u<m,E=n.neighborhood[u],f=n.weights[u],l=n.belongings[E],y?x+=f:b+=f,k(r,l,f);for(S=n.deltaWithOwnCommunity(v,b,x,r.get(c)||0,c),w=c,g=0;g<r.size;g++)l=r.dense[g],l!==c&&(R=r.vals[g],N++,I=n.delta(v,b,x,R,l),D=G(w,c,l,I,S),D&&(S=I,w=l));if(S<0){if(w=n.isolate(v,b,x),w===c)continue}else{if(w===c)continue;n.move(v,b,x,w)}d=!0,O++}F.push(O),s=d||s}s&&n.zoomOut()}var yt={index:n,deltaComputations:N,nodesVisited:M,moves:z};return yt}function J(t,e,o,n){if(!kt(o))throw new Error("graphology-communities-louvain: the given graph is not a valid graphology instance.");var i=Gt(o);if(i==="mixed")throw new Error("graphology-communities-louvain: cannot run the algorithm on a true mixed graph.");n=zt(n,pt);var s=0;if(o.size===0){if(t){o.forEachNode(function(u){o.setNodeAttribute(u,n.nodeCommunityAttribute,s++)});return}var d={};return o.forEachNode(function(u){d[u]=s++}),e?{communities:d,count:o.order,deltaComputations:0,dendrogram:null,level:0,modularity:NaN,moves:null,nodesVisited:0,resolution:n.resolution}:d}var c=i==="undirected"?Bt:qt,l=c(e,o,n),r=l.index;if(!e){if(t){r.assign(n.nodeCommunityAttribute);return}return r.collect()}var a={count:r.C,deltaComputations:l.deltaComputations,dendrogram:r.dendrogram,level:r.level,modularity:r.modularity(),moves:l.moves,nodesVisited:l.nodesVisited,resolution:n.resolution};return t?(r.assign(n.nodeCommunityAttribute),a):(a.communities=r.collect(),a)}var j=J.bind(null,!1,!1);j.assign=J.bind(null,!0,!1);j.detailed=J.bind(null,!1,!0);j.defaults=pt;var Xt=j;const vt=wt(Xt),Ht=()=>{const t=new B;t.import(it),vt.assign(t,{nodeCommunityAttribute:"community"});const e=new Set;t.forEachNode((c,l)=>e.add(l.community));const o=Array.from(e),n=xt(e.size).reduce((c,l,r)=>({...c,[o[r]]:l}),{});t.forEachNode((c,l)=>t.setNodeAttribute(c,"color",n[l.community]));const i=document.getElementById("sigma-container"),s=new q(t,i),d=document.createElement("div");d.style.position="absolute",d.style.right="10px",d.style.bottom="10px",document.body.append(d),o.forEach((c,l)=>{const r=`cb-${c}`,a=document.createElement("div");a.innerHTML+=`
      <input type="checkbox" id="${r}" name="">
      <label for="${r}" style="color:${n[c]}">Community n°${c+1}</label>    
    `,d.append(a);const u=d.querySelector(`#${r}`);let h=null;const m=()=>{h?(h(),h=null):h=H(`community-${c}`,s,V(t.filterNodes((y,f)=>f.community===c),{radius:150,border:{color:n[c],thickness:8},levels:[{color:"#00000000",threshold:.5}]}))};u.addEventListener("change",m),l||(u.checked=!0,m())}),X(()=>{s==null||s.kill()})},Vt=`import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import iwanthue from "iwanthue";
import Sigma from "sigma";

import data from "../_data/data.json";
import { onStoryDown } from "../utils";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Detect communities
  louvain.assign(graph, { nodeCommunityAttribute: "community" });
  const communities = new Set<string>();
  graph.forEachNode((_, attrs) => communities.add(attrs.community));
  const communitiesArray = Array.from(communities);

  // Determine colors, and color each node accordingly
  const palette: Record<string, string> = iwanthue(communities.size).reduce(
    (iter, color, i) => ({
      ...iter,
      [communitiesArray[i]]: color,
    }),
    {},
  );
  graph.forEachNode((node, attr) => graph.setNodeAttribute(node, "color", palette[attr.community]));

  // Retrieve some useful DOM elements
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma
  const renderer = new Sigma(graph, container);

  // Add checkboxes
  const checkboxesContainer = document.createElement("div");
  checkboxesContainer.style.position = "absolute";
  checkboxesContainer.style.right = "10px";
  checkboxesContainer.style.bottom = "10px";
  document.body.append(checkboxesContainer);

  communitiesArray.forEach((community, i) => {
    const id = \`cb-\${community}\`;
    const checkboxContainer = document.createElement("div");
    checkboxContainer.innerHTML += \`
      <input type="checkbox" id="\${id}" name="">
      <label for="\${id}" style="color:\${palette[community]}">Community n°\${community + 1}</label>    
    \`;
    checkboxesContainer.append(checkboxContainer);
    const checkbox = checkboxesContainer.querySelector(\`#\${id}\`) as HTMLInputElement;

    let clean: null | (() => void) = null;
    const toggle = () => {
      if (clean) {
        clean();
        clean = null;
      } else {
        clean = bindWebGLLayer(
          \`community-\${community}\`,
          renderer,
          createContoursProgram(
            graph.filterNodes((_, attr) => attr.community === community),
            {
              radius: 150,
              border: {
                color: palette[community],
                thickness: 8,
              },
              levels: [
                {
                  color: "#00000000",
                  threshold: 0.5,
                },
              ],
            },
          ),
        );
      }
    };

    checkbox.addEventListener("change", toggle);

    if (!i) {
      checkbox.checked = true;
      toggle();
    }
  });

  onStoryDown(() => {
    renderer?.kill();
  });
};
`,Qt=()=>{let t=null;fetch("./arctic.gexf").then(e=>e.text()).then(e=>{const o=Tt(B,e);vt.assign(o,{nodeCommunityAttribute:"community"});const n=new Set;o.forEachNode((a,u)=>n.add(u.community));const i=Array.from(n),s=document.getElementById("sigma-container"),d=new q(o,s);t=d;const c=document.createElement("select");c.innerHTML='<option value="">No community</option>'+i.map(a=>`<option value="${a}">Community ${a}</option>`).join(""),c.style.position="absolute",c.style.right="10px",c.style.bottom="10px",document.body.append(c);let l=null;const r=()=>{l&&l();const a=c.value;a?l=H("metaball",d,V(o.filterNodes((u,h)=>h.community===+a))):l=null};c.addEventListener("change",r),c.value=i[0],r()}),X(()=>{t==null||t.kill()})},Yt=`import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

export default () => {
  let globalRenderer: Sigma | null = null;

  // Load external GEXF file:
  fetch("./arctic.gexf")
    .then((res) => res.text())
    .then((gexf) => {
      // Parse GEXF string:
      const graph = parse(Graph, gexf);
      louvain.assign(graph, { nodeCommunityAttribute: "community" });
      const communities = new Set<string>();
      graph.forEachNode((_, attrs) => communities.add(attrs.community));
      const communitiesArray = Array.from(communities);

      // Retrieve some useful DOM elements:
      const container = document.getElementById("sigma-container") as HTMLElement;

      // Instantiate sigma:
      const renderer = new Sigma(graph, container);
      globalRenderer = renderer;

      // Add Select
      const select = document.createElement("select");
      select.innerHTML =
        \`<option value="">No community</option>\` +
        communitiesArray.map((str) => \`<option value="\${str}">Community \${str}</option>\`).join("");
      select.style.position = "absolute";
      select.style.right = "10px";
      select.style.bottom = "10px";
      document.body.append(select);

      // Handle metaballs layer:
      let cleanWebGLLayer: null | (() => void) = null;
      const checkSelectedOption = () => {
        if (cleanWebGLLayer) cleanWebGLLayer();

        const community = select.value;
        if (community) {
          cleanWebGLLayer = bindWebGLLayer(
            "metaball",
            renderer,
            createContoursProgram(graph.filterNodes((_node, attributes) => attributes.community === +community)),
          );
        } else {
          cleanWebGLLayer = null;
        }
      };
      select.addEventListener("change", checkSelectedOption);

      // Select first community:
      select.value = communitiesArray[0];
      checkSelectedOption();
    });

  onStoryDown(() => {
    globalRenderer?.kill();
  });
};
`,Jt=()=>{const t=new B;t.import(it);const e=document.getElementById("sigma-container"),o=new q(t,e);H("metaball",o,V(t.nodes(),{radius:150,feather:1,border:{color:"#000000",thickness:4},levels:[{color:"#fff7f3",threshold:.9},{color:"#fde0dd",threshold:.8},{color:"#fcc5c0",threshold:.7},{color:"#fa9fb5",threshold:.6},{color:"#f768a1",threshold:.5},{color:"#dd3497",threshold:.4},{color:"#ae017e",threshold:.3},{color:"#7a0177",threshold:.2},{color:"#49006a",threshold:-.1}]})),X(()=>{o==null||o.kill()})},Kt=`import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../_data/data.json";
import { onStoryDown } from "../utils";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Retrieve some useful DOM elements:
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma:
  const renderer = new Sigma(graph, container);

  bindWebGLLayer(
    "metaball",
    renderer,
    createContoursProgram(graph.nodes(), {
      radius: 150,
      feather: 1,
      border: {
        color: "#000000",
        thickness: 4,
      },
      levels: [
        {
          color: "#fff7f3",
          threshold: 0.9,
        },
        {
          color: "#fde0dd",
          threshold: 0.8,
        },
        {
          color: "#fcc5c0",
          threshold: 0.7,
        },
        {
          color: "#fa9fb5",
          threshold: 0.6,
        },
        {
          color: "#f768a1",
          threshold: 0.5,
        },
        {
          color: "#dd3497",
          threshold: 0.4,
        },
        {
          color: "#ae017e",
          threshold: 0.3,
        },
        {
          color: "#7a0177",
          threshold: 0.2,
        },
        {
          color: "#49006a",
          threshold: -0.1,
        },
      ],
    }),
  );

  onStoryDown(() => {
    renderer?.kill();
  });
};
`,K=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: sans-serif;
  }
</style>
<div id="sigma-container"></div>
`,he={id:"layer-webgl",title:"layer-webgl"},ue={name:"Metaballs",render:()=>K,play:Qt,args:{},parameters:{storySource:{source:Yt}}},ce={name:"Highlight groups of nodes",render:()=>K,play:Ht,args:{},parameters:{storySource:{source:Vt}}},de={name:"Multiple levels",render:()=>K,play:Jt,args:{},parameters:{storySource:{source:Kt}}};export{ce as ContourLine,he as default,ue as metaballs,de as plainContourLine};
