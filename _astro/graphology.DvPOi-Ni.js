import{n as e,t}from"./rolldown-runtime.WkwZ5CU-.js";var n=t(((e,t)=>{var n=typeof Reflect==`object`?Reflect:null,r=n&&typeof n.apply==`function`?n.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)},i=n&&typeof n.ownKeys==`function`?n.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};function a(e){console&&console.warn&&console.warn(e)}var o=Number.isNaN||function(e){return e!==e};function s(){s.init.call(this)}t.exports=s,t.exports.once=y,s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var c=10;function l(e){if(typeof e!=`function`)throw TypeError(`The "listener" argument must be of type Function. Received type `+typeof e)}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if(typeof e!=`number`||e<0||o(e))throw RangeError(`The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received `+e+`.`);c=e}}),s.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(e){if(typeof e!=`number`||e<0||o(e))throw RangeError(`The value of "n" is out of range. It must be a non-negative number. Received `+e+`.`);return this._maxListeners=e,this};function u(e){return e._maxListeners===void 0?s.defaultMaxListeners:e._maxListeners}s.prototype.getMaxListeners=function(){return u(this)},s.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var i=e===`error`,a=this._events;if(a!==void 0)i&&=a.error===void 0;else if(!i)return!1;if(i){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var s=Error(`Unhandled error.`+(o?` (`+o.message+`)`:``));throw s.context=o,s}var c=a[e];if(c===void 0)return!1;if(typeof c==`function`)r(c,this,t);else for(var l=c.length,u=g(c,l),n=0;n<l;++n)r(u[n],this,t);return!0};function d(e,t,n,r){var i,o,s;if(l(n),o=e._events,o===void 0?(o=e._events=Object.create(null),e._eventsCount=0):(o.newListener!==void 0&&(e.emit(`newListener`,t,n.listener?n.listener:n),o=e._events),s=o[t]),s===void 0)s=o[t]=n,++e._eventsCount;else if(typeof s==`function`?s=o[t]=r?[n,s]:[s,n]:r?s.unshift(n):s.push(n),i=u(e),i>0&&s.length>i&&!s.warned){s.warned=!0;var c=Error(`Possible EventEmitter memory leak detected. `+s.length+` `+String(t)+` listeners added. Use emitter.setMaxListeners() to increase limit`);c.name=`MaxListenersExceededWarning`,c.emitter=e,c.type=t,c.count=s.length,a(c)}return e}s.prototype.addListener=function(e,t){return d(this,e,t,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(e,t){return d(this,e,t,!0)};function f(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function p(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=f.bind(r);return i.listener=n,r.wrapFn=i,i}s.prototype.once=function(e,t){return l(t),this.on(e,p(this,e,t)),this},s.prototype.prependOnceListener=function(e,t){return l(t),this.prependListener(e,p(this,e,t)),this},s.prototype.removeListener=function(e,t){var n,r,i,a,o;if(l(t),r=this._events,r===void 0||(n=r[e],n===void 0))return this;if(n===t||n.listener===t)--this._eventsCount===0?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit(`removeListener`,e,n.listener||t));else if(typeof n!=`function`){for(i=-1,a=n.length-1;a>=0;a--)if(n[a]===t||n[a].listener===t){o=n[a].listener,i=a;break}if(i<0)return this;i===0?n.shift():_(n,i),n.length===1&&(r[e]=n[0]),r.removeListener!==void 0&&this.emit(`removeListener`,e,o||t)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(e){var t,n=this._events,r;if(n===void 0)return this;if(n.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):n[e]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete n[e]),this;if(arguments.length===0){var i=Object.keys(n),a;for(r=0;r<i.length;++r)a=i[r],a!==`removeListener`&&this.removeAllListeners(a);return this.removeAllListeners(`removeListener`),this._events=Object.create(null),this._eventsCount=0,this}if(t=n[e],typeof t==`function`)this.removeListener(e,t);else if(t!==void 0)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this};function m(e,t,n){var r=e._events;if(r===void 0)return[];var i=r[t];return i===void 0?[]:typeof i==`function`?n?[i.listener||i]:[i]:n?v(i):g(i,i.length)}s.prototype.listeners=function(e){return m(this,e,!0)},s.prototype.rawListeners=function(e){return m(this,e,!1)},s.listenerCount=function(e,t){return typeof e.listenerCount==`function`?e.listenerCount(t):h.call(e,t)},s.prototype.listenerCount=h;function h(e){var t=this._events;if(t!==void 0){var n=t[e];if(typeof n==`function`)return 1;if(n!==void 0)return n.length}return 0}s.prototype.eventNames=function(){return this._eventsCount>0?i(this._events):[]};function g(e,t){for(var n=Array(t),r=0;r<t;++r)n[r]=e[r];return n}function _(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function v(e){for(var t=Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}function y(e,t){return new Promise(function(n,r){function i(n){e.removeListener(t,a),r(n)}function a(){typeof e.removeListener==`function`&&e.removeListener(`error`,i),n([].slice.call(arguments))}x(e,t,a,{once:!0}),t!==`error`&&b(e,i,{once:!0})})}function b(e,t,n){typeof e.on==`function`&&x(e,`error`,t,n)}function x(e,t,n,r){if(typeof e.on==`function`)r.once?e.once(t,n):e.on(t,n);else if(typeof e.addEventListener==`function`)e.addEventListener(t,function i(a){r.once&&e.removeEventListener(t,i),n(a)});else throw TypeError(`The "emitter" argument must be of type EventEmitter. Received type `+typeof e)}}));function r(e){let t=e.type===WebGL2RenderingContext.FLOAT&&!e.normalized,n=e.type===WebGL2RenderingContext.UNSIGNED_BYTE&&e.size===4&&e.normalized;if(!t&&!n)throw Error(`Attribute "${e.name}" is invalid: only non-normalized FLOAT and normalized UNSIGNED_BYTE with size 4 are supported.`);return e.normalized?1:e.size}function i(e){let t=0;return e.forEach(e=>t+=r(e)),t}function a(e,t,n){let r=e===`VERTEX`?t.VERTEX_SHADER:t.FRAGMENT_SHADER,i=t.createShader(r);if(i===null)throw Error(`loadShader: error while creating the shader`);if(t.shaderSource(i,n),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS)){let e=t.getShaderInfoLog(i);throw t.deleteShader(i),Error(`loadShader: error while compiling the shader:\n${e}\n${n}`)}return i}function o(e,t){return a(`VERTEX`,e,t)}function s(e,t){return a(`FRAGMENT`,e,t)}function c(e,t){let n=e.createProgram();if(n===null)throw Error(`loadProgram: error while creating the program.`);let r,i;for(r=0,i=t.length;r<i;r++)e.attachShader(n,t[r]);if(e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS)){let t=e.getProgramInfoLog(n);throw e.deleteProgram(n),Error(`loadProgram: error while linking the program: ${t}`)}return n}function l({gl:e,buffer:t,program:n,vertexShader:r,fragmentShader:i}){e.deleteShader(r),e.deleteShader(i),e.deleteProgram(n),e.deleteBuffer(t)}function u(e){return e%1==0?e.toFixed(1):e.toString()}var d=new Map,f=new Map,p=0;function m(e,t){let n=e.variables?.[t.source||t.name.replace(/^a_/,``)]?.default;return u(typeof n==`number`?n:typeof t.defaultValue==`number`?t.defaultValue:0)}function h(e,t,n,r=e=>`v_${e.name.replace(/^a_/,``)}`){let i=[t,n,...e.uniforms.filter(e=>e.type===`float`).map(e=>u(e.value??0)),...(e.attributes??[]).map(r)];return`sdf_${e.name}(${i.join(`, `)})`}function g(e){let t=e.name,n=e.uniforms.filter(e=>e.type===`float`&&e.value!==void 0&&e.value!==0).map(e=>`${e.name.replace(`u_`,``)}=${e.value}`).sort(),r=(e.attributes??[]).map(t=>`${t.name}@${t.source??``}=${m(e,t)}`),i=[...n,...r];return i.length>0&&(t+=`#`+i.join(`#`)),t}function _(e){let t=g(e);if(!d.has(t)){let n={};for(let t of e.uniforms)t.type===`float`&&t.value!==void 0&&(n[t.name]=t.value);d.set(t,{shape:e,uniformValues:n,slug:t}),f.set(t,p++)}return t}function v(e){return f.get(e)??-1}function y(e){let t=[],n=new Set,r=new Set,i=/mat2 rotate2D\(float angle\)\s*\{[^}]+\}/;for(let a of e){if(r.has(a.name))continue;r.add(a.name);let e=a.glsl;i.test(e)&&(n.has(`rotate2D`)?e=e.replace(i,``):n.add(`rotate2D`)),t.push(e)}return t.join(`
`)}function b(){return y(Array.from(d.values()).map(e=>e.shape))}function x(e){let t=Array.from(d.entries());return t.length===0?`
float querySDF(int shapeId, vec2 uv, float size) {
  return length(uv) - size;
}
`:`
float querySDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
${t.map(([t,{shape:n}],r)=>`    case ${r}: return ${h(n,`uv`,`size`,t=>{let r=t.name.replace(/^a_/,``);return e?.has(r)?`g_${r}`:m(n,t)})}; // ${t}`).join(`
`)}
    default: return length(uv) - size;
  }
}
`}function S(e){return y(e)}function C(e){return[...new Map(e.flatMap(e=>e.uniforms).map(e=>[e.name,e])).values()]}function ee(e,t){if(e.length===0)return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = length(uv) - size;
  context.inradiusFactor = 1.0;
}
`;let n=e=>h(e,`uv`,`size`),r=e=>e.inradiusFactorGLSL??u(e.inradiusFactor??1);if(e.length===1){let t=e[0];return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = ${n(t)};
  context.inradiusFactor = ${r(t)};
}
`}let i=e.map((e,t)=>`    case ${t}: // ${e.name}
      context.sdf = ${n(e)};
      context.inradiusFactor = ${r(e)};
      break;`).join(`
`),a=e[0],o=``,s=`shapeId`;return t&&t.length>1&&(o=`
int globalToLocalShapeId(int globalId) {
  switch (globalId) {
${t.map((t,n)=>`    case ${t}: return ${n}; // ${e[n].name}`).join(`
`)}
    default: return 0;
  }
}
`,s=`globalToLocalShapeId(shapeId)`),`${o}
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  switch (${s}) {
${i}
    default:
      context.sdf = ${n(a)};
      context.inradiusFactor = ${r(a)};
  }
}
`}var w={right:0,left:1,above:2,below:3,over:4},te=`
float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;
`,ne=`
mat2 rotate2D(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
`,re=`
vec2 getLabelDirection(float positionMode) {
  if (positionMode < 0.5) return vec2(1.0, 0.0);   // Right
  if (positionMode < 1.5) return vec2(-1.0, 0.0);  // Left
  if (positionMode < 2.5) return vec2(0.0, -1.0);  // Above
  if (positionMode < 3.5) return vec2(0.0, 1.0);   // Below
  return vec2(0.0);                                 // Over (centered)
}
`,ie=`
float sdfBox(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,ae=`
float sdfRotatedBox(vec2 p, vec2 halfSize, float angle) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfBox(rotatedP, halfSize);
}
`,oe=`
float sdfRoundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 d = abs(p) - halfSize + radius;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`,se=`
float sdfRoundedRotatedBox(vec2 p, vec2 halfSize, float angle, float radius) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfRoundedBox(rotatedP, halfSize, radius);
}
`,ce=`
vec2 labelBoxCenter(float positionMode, float labelStart, vec2 halfSize, float textHalfY) {
  if (positionMode < 0.5) return vec2(labelStart + halfSize.x, 0.0);    // right
  if (positionMode < 1.5) return vec2(-(labelStart + halfSize.x), 0.0); // left
  if (positionMode < 2.5) return vec2(0.0, -(labelStart + textHalfY));  // above
  if (positionMode < 3.5) return vec2(0.0, labelStart + textHalfY);     // below
  return vec2(0.0);                                                     // over
}
`,T=`
vec4 readNodeData(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * 2;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`,E=`
vec4 readNodeFlags(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * 2 + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`,le=`
vec4 readNodeColor(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * 2 + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  vec4 texel = texelFetch(nodeDataTexture, coord, 0);
  float r = floor(texel.b / 65536.0);
  float g = floor(mod(texel.b, 65536.0) / 256.0);
  float b = mod(texel.b, 256.0);
  return vec4(r / 255.0, g / 255.0, b / 255.0, texel.a);
}
`,ue=`
vec4 readFrameTexel(sampler2D frameTexture, int frameTextureWidth, int index) {
  ivec2 coord = ivec2(index % frameTextureWidth, index / frameTextureWidth);
  return texelFetch(frameTexture, coord, 0);
}
`;function de(e,t){let n=e=>h(e,`uv`,`size`);return e.length===1?{code:fe(n(e[0])),multiShape:!1}:{code:`
float queryShapeSDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
${e.map((e,r)=>`    case ${t?t[r]:r}: return ${n(e)};`).join(`
`)}
    default: return ${n(e[0])};
  }
}
int g_shapeId;
${fe(`queryShapeSDF(g_shapeId, uv, size)`)}
`,multiShape:!0}}function fe(e){return`
float findEdgeDistance(vec2 direction, float size) {
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = direction * mid;
    if (${e} < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}
`}var pe={linear:e=>e,quadraticIn:e=>e*e,quadraticOut:e=>e*(2-e),quadraticInOut:e=>(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1),cubicIn:e=>e*e*e,cubicOut:e=>--e*e*e+1,cubicInOut:e=>(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2),exponentialIn:e=>e===0?0:2**(10*(e-1)),exponentialOut:e=>e===1?1:1-2**(-10*e),exponentialInOut:e=>e===0?0:e===1?1:e<.5?2**(10*(2*e-1))/2:(2-2**(-10*(2*e-1)))/2};function me(e){return e?typeof e==`function`?e:pe[e]:pe.linear}var he={easing:`quadraticInOut`,duration:150};function ge(e,t,n,r){let i=Object.assign({},he,n),a=me(i.easing),o=Date.now(),s={};for(let n in t){let r=t[n];s[n]={};for(let t in r)s[n][t]=e.getNodeAttribute(n,t)}let c=null,l=()=>{c=null;let n=(Date.now()-o)/i.duration;if(n>=1){for(let n in t){let r=t[n];for(let t in r)e.setNodeAttribute(n,t,r[t])}typeof r==`function`&&r()}else{n=a(n);for(let r in t){let i=t[r],a=s[r];for(let t in i)e.setNodeAttribute(r,t,i[t]*n+a[t]*(1-n))}c=requestAnimationFrame(l)}};return l(),()=>{c&&cancelAnimationFrame(c)}}function D(){return Float32Array.of(1,0,0,0,1,0,0,0,1)}function _e(e,t,n){return e[0]=t,e[4]=typeof n==`number`?n:t,e}function ve(e,t){let n=Math.sin(t),r=Math.cos(t);return e[0]=r,e[1]=n,e[3]=-n,e[4]=r,e}function ye(e,t,n){return e[6]=t,e[7]=n,e}function O(e,t){let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4],s=e[5],c=e[6],l=e[7],u=e[8],d=t[0],f=t[1],p=t[2],m=t[3],h=t[4],g=t[5],_=t[6],v=t[7],y=t[8];return e[0]=d*n+f*a+p*c,e[1]=d*r+f*o+p*l,e[2]=d*i+f*s+p*u,e[3]=m*n+h*a+g*c,e[4]=m*r+h*o+g*l,e[5]=m*i+h*s+g*u,e[6]=_*n+v*a+y*c,e[7]=_*r+v*o+y*l,e[8]=_*i+v*s+y*u,e}function be(e,t){let n=Math.cos(t),r=Math.sin(t);return{x:n*e.x+r*e.y,y:-r*e.x+n*e.y}}function xe(e,t,n=1){let r=e[0],i=e[1],a=e[3],o=e[4],s=e[6],c=e[7],l=t.x,u=t.y;return{x:l*r+u*a+s*n,y:l*i+u*o+c*n}}function Se(e,t){let n=e.height/e.width,r=t.height/t.width;return n<1&&r>1||n>1&&r<1?1:Math.min(Math.max(r,1/r),Math.max(1/n,n))}function Ce(e,t,n,r,i){let{angle:a,ratio:o,x:s,y:c}=e,{width:l,height:u}=t,d=D(),f=Math.min(l,u)-2*r,p=Se(t,n);return i?(O(d,ye(D(),s,c)),O(d,_e(D(),o)),O(d,ve(D(),a)),O(d,_e(D(),l/f/2/p,u/f/2/p))):(O(d,_e(D(),f/l*2*p,f/u*2*p)),O(d,ve(D(),-a)),O(d,_e(D(),1/o)),O(d,ye(D(),-s,-c))),d}function we(e,t,n){let{x:r,y:i}=xe(e,{x:Math.cos(t.angle),y:Math.sin(t.angle)},0);return 1/Math.sqrt(r**2+i**2)/n.width}function Te(e,t,n,r,i){return[Math.floor(t/i*r),Math.floor(e.drawingBufferHeight/i-n/i*r)]}var Ee={black:`#000000`,silver:`#C0C0C0`,gray:`#808080`,grey:`#808080`,white:`#FFFFFF`,maroon:`#800000`,red:`#FF0000`,purple:`#800080`,fuchsia:`#FF00FF`,green:`#008000`,lime:`#00FF00`,olive:`#808000`,yellow:`#FFFF00`,navy:`#000080`,blue:`#0000FF`,teal:`#008080`,aqua:`#00FFFF`,darkblue:`#00008B`,mediumblue:`#0000CD`,darkgreen:`#006400`,darkcyan:`#008B8B`,deepskyblue:`#00BFFF`,darkturquoise:`#00CED1`,mediumspringgreen:`#00FA9A`,springgreen:`#00FF7F`,cyan:`#00FFFF`,midnightblue:`#191970`,dodgerblue:`#1E90FF`,lightseagreen:`#20B2AA`,forestgreen:`#228B22`,seagreen:`#2E8B57`,darkslategray:`#2F4F4F`,darkslategrey:`#2F4F4F`,limegreen:`#32CD32`,mediumseagreen:`#3CB371`,turquoise:`#40E0D0`,royalblue:`#4169E1`,steelblue:`#4682B4`,darkslateblue:`#483D8B`,mediumturquoise:`#48D1CC`,indigo:`#4B0082`,darkolivegreen:`#556B2F`,cadetblue:`#5F9EA0`,cornflowerblue:`#6495ED`,rebeccapurple:`#663399`,mediumaquamarine:`#66CDAA`,dimgray:`#696969`,dimgrey:`#696969`,slateblue:`#6A5ACD`,olivedrab:`#6B8E23`,slategray:`#708090`,slategrey:`#708090`,lightslategray:`#778899`,lightslategrey:`#778899`,mediumslateblue:`#7B68EE`,lawngreen:`#7CFC00`,chartreuse:`#7FFF00`,aquamarine:`#7FFFD4`,skyblue:`#87CEEB`,lightskyblue:`#87CEFA`,blueviolet:`#8A2BE2`,darkred:`#8B0000`,darkmagenta:`#8B008B`,saddlebrown:`#8B4513`,darkseagreen:`#8FBC8F`,lightgreen:`#90EE90`,mediumpurple:`#9370DB`,darkviolet:`#9400D3`,palegreen:`#98FB98`,darkorchid:`#9932CC`,yellowgreen:`#9ACD32`,sienna:`#A0522D`,brown:`#A52A2A`,darkgray:`#A9A9A9`,darkgrey:`#A9A9A9`,lightblue:`#ADD8E6`,greenyellow:`#ADFF2F`,paleturquoise:`#AFEEEE`,lightsteelblue:`#B0C4DE`,powderblue:`#B0E0E6`,firebrick:`#B22222`,darkgoldenrod:`#B8860B`,mediumorchid:`#BA55D3`,rosybrown:`#BC8F8F`,darkkhaki:`#BDB76B`,mediumvioletred:`#C71585`,indianred:`#CD5C5C`,peru:`#CD853F`,chocolate:`#D2691E`,tan:`#D2B48C`,lightgray:`#D3D3D3`,lightgrey:`#D3D3D3`,thistle:`#D8BFD8`,orchid:`#DA70D6`,goldenrod:`#DAA520`,palevioletred:`#DB7093`,crimson:`#DC143C`,gainsboro:`#DCDCDC`,plum:`#DDA0DD`,burlywood:`#DEB887`,lightcyan:`#E0FFFF`,lavender:`#E6E6FA`,darksalmon:`#E9967A`,violet:`#EE82EE`,palegoldenrod:`#EEE8AA`,lightcoral:`#F08080`,khaki:`#F0E68C`,aliceblue:`#F0F8FF`,honeydew:`#F0FFF0`,azure:`#F0FFFF`,sandybrown:`#F4A460`,wheat:`#F5DEB3`,beige:`#F5F5DC`,whitesmoke:`#F5F5F5`,mintcream:`#F5FFFA`,ghostwhite:`#F8F8FF`,salmon:`#FA8072`,antiquewhite:`#FAEBD7`,linen:`#FAF0E6`,lightgoldenrodyellow:`#FAFAD2`,oldlace:`#FDF5E6`,magenta:`#FF00FF`,deeppink:`#FF1493`,orangered:`#FF4500`,tomato:`#FF6347`,hotpink:`#FF69B4`,coral:`#FF7F50`,darkorange:`#FF8C00`,lightsalmon:`#FFA07A`,orange:`#FFA500`,lightpink:`#FFB6C1`,pink:`#FFC0CB`,gold:`#FFD700`,peachpuff:`#FFDAB9`,navajowhite:`#FFDEAD`,moccasin:`#FFE4B5`,bisque:`#FFE4C4`,mistyrose:`#FFE4E1`,blanchedalmond:`#FFEBCD`,papayawhip:`#FFEFD5`,lavenderblush:`#FFF0F5`,seashell:`#FFF5EE`,cornsilk:`#FFF8DC`,lemonchiffon:`#FFFACD`,floralwhite:`#FFFAF0`,snow:`#FFFAFA`,lightyellow:`#FFFFE0`,ivory:`#FFFFF0`},De=new Int8Array(4),Oe=new Int32Array(De.buffer,0,1),ke=new Float32Array(De.buffer,0,1),Ae=/^\s*rgba?\s*\(/,je=/^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;function Me(e){let t=0,n=0,r=0,i=1,a=e.toLowerCase();if(a===`transparent`)return{r:0,g:0,b:0,a:0};if(a in Ee)return Me(Ee[a]);if(e[0]===`#`)e.length===4?(t=parseInt(e.charAt(1)+e.charAt(1),16),n=parseInt(e.charAt(2)+e.charAt(2),16),r=parseInt(e.charAt(3)+e.charAt(3),16)):(t=parseInt(e.charAt(1)+e.charAt(2),16),n=parseInt(e.charAt(3)+e.charAt(4),16),r=parseInt(e.charAt(5)+e.charAt(6),16)),e.length===9&&(i=parseInt(e.charAt(7)+e.charAt(8),16)/255);else if(Ae.test(e)){let a=e.match(je);a&&(t=+a[1],n=+a[2],r=+a[3],a[4]&&(i=+a[4]))}return{r:t,g:n,b:r,a:i}}function Ne(e,t=!1){let{r:n,g:r,b:i,a}=Me(e);return t?[n/255*a,r/255*a,i/255*a,a]:[n/255,r/255,i/255,a]}var Pe={};for(let e in Ee)Pe[e]=k(Ee[e]),Pe[Ee[e]]=Pe[e];function Fe(e,t,n,r,i){return Oe[0]=r<<24|n<<16|t<<8|e,i&&(Oe[0]&=4278190079),ke[0]}function k(e){if(e=e.toLowerCase(),Pe[e]!==void 0)return Pe[e];let t=Me(e),{r:n,g:r,b:i}=t,{a}=t;a=a*255|0;let o=Fe(n,r,i,a,!0);return Pe[e]=o,o}function Ie(e,t){ke[0]=k(e);let n=Oe[0];return t&&(n|=16777216),[n&255,n>>8&255,n>>16&255,n>>24&255]}function Le(e){let t=e>>>8&255,n=e>>>16&255,r=e>>>24&255;return((e&255)<<24|r<<16|n<<8|t)>>>0}function Re(e,t,n,r){return(n<<24|t<<16|e<<8|r)>>>0}function ze(e,t,n,r,i,a){let[o,s]=Te(e,n,r,i,a),c=new Uint8Array(4);e.bindFramebuffer(e.FRAMEBUFFER,t),e.readPixels(o,s,1,1,e.RGBA,e.UNSIGNED_BYTE,c);let[l,u,d,f]=c;return[l,u,d,f]}function Be(e){let{r:t,g:n,b:r,a:i}=Me(e);return`vec4(${(t/255).toFixed(6)}, ${(n/255).toFixed(6)}, ${(r/255).toFixed(6)}, ${i.toFixed(6)})`}function Ve(e,t){let n=t.size;if(n===0)return;let r=e.length;e.length+=n;let i=0;t.forEach(t=>{e[r+i]=t,i++})}function He(e,...t){e||={};for(let n=0,r=t.length;n<r;n++){let r=t[n];r&&Object.assign(e,r)}return e}function Ue(e,t){for(let n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&t[n]!==e[n])return!0;return!1}function We(e,t){let n=e,r=t;for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e)&&n[e]!==r[e])return!1;for(let e in r)if(Object.prototype.hasOwnProperty.call(r,e)&&r[e]!==n[e])return!1;return!0}function Ge(e,t,n){n?e.add(t):e.delete(t)}function A(e){return e.labelVisibility===`visible`&&e.visibility!==`hidden`}function Ke(e){return e.backdropVisibility===`visible`&&e.visibility!==`hidden`}function qe(e){return[+(e.rotationAlignment===`graph`),+(e.labelRotationAlignment===`graph`)]}function Je(e,t,n){let r=e[t];if(r)for(let e=0;e<r.length;e++){let t=r[e];if(!(n<t.offset||n>=t.offset+t.count)){if(t.count===1)r.splice(e,1);else if(n===t.offset)t.offset++,t.count--;else if(n===t.offset+t.count-1)t.count--;else{let i=n+1,a=t.offset+t.count-i;t.count=n-t.offset,r.splice(e+1,0,{offset:i,count:a})}return}}}function Ye(e,t,n){if(!e[t]){e[t]=[{offset:n,count:1}];return}let r=e[t],i=r.length;for(let e=0;e<r.length;e++)if(n<r[e].offset){i=e;break}let a=i>0?r[i-1]:null,o=i<r.length?r[i]:null,s=a&&a.offset+a.count===n,c=o&&n+1===o.offset;s&&c?(a.count+=1+o.count,r.splice(i,1)):s?a.count++:c?(o.offset--,o.count++):r.splice(i,0,{offset:n,count:1})}var Xe=t(((e,t)=>{t.exports=function(e){return typeof e==`object`&&!!e&&typeof e.addUndirectedEdgeWithKey==`function`&&typeof e.dropNode==`function`&&typeof e.multi==`boolean`}})),Ze=e(Xe());function Qe(e){if(!(0,Ze.default)(e))throw Error(`Sigma: invalid graph instance.`)}var $e=new Set([`italic`,`oblique`]),et=new Set([`bold`,`bolder`,`lighter`]);function tt(e){let t=`normal`,n=`normal`,r=e.trim(),i=r.split(/\s+/),a=0;for(let e=0;e<i.length;e++){let r=i[e].toLowerCase();if($e.has(r))n=r,a=e+1;else if(et.has(r)||/^\d{3}$/.test(r))t=r,a=e+1;else if(r===`normal`)a=e+1;else break}return{family:i.slice(a).join(` `)||r,weight:t,style:n}}function nt(e,t,n){let r=document.createElement(e);if(t)for(let e in t)r.style[e]=t[e];if(n)for(let e in n)r.setAttribute(e,n[e]);return r}function rt(){return window.devicePixelRatio===void 0?1:window.devicePixelRatio}function it(e){let{x:[t,n],y:[r,i]}=e,a=Math.max(n-t,i-r),o=(n+t)/2,s=(i+r)/2;(a===0||Math.abs(a)===1/0||isNaN(a))&&(a=1),isNaN(o)&&(o=0),isNaN(s)&&(s=0);let c=e=>({x:.5+(e.x-o)/a,y:.5+(e.y-s)/a});return c.applyTo=e=>{e.x=.5+(e.x-o)/a,e.y=.5+(e.y-s)/a},c.inverse=e=>({x:o+a*(e.x-.5),y:s+a*(e.y-.5)}),c.ratio=a,c}var at=2;function ot(e,t,n,r=at){let{width:i,height:a}=t.canvas,{x:o,y:s,rowHeight:c,maxRowWidth:l}=n,u={},d=[];for(let n of e){let e=n.width+r,f=n.height+r;e>i||f>a||o+e>i&&s+c+f>a?d.push(n):(o+e>i&&(l=Math.max(l,o),o=0,s+=c,c=f),n.draw(t,o,s),u[n.key]={x:o,y:s,width:n.width,height:n.height},o+=e,c=Math.max(c,f))}return l=Math.max(l,o),{atlas:u,cursor:{x:o,y:s,rowHeight:c,maxRowWidth:l},remaining:d}}var st=1024,ct=1.5,lt=class{constructor(e,t,n=st){this.texture=null,this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1,this.indexMap=new Map,this.freeIndices=[],this.nextIndex=0,this.gl=e,this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.TEXELS_PER_ITEM=t,this.capacity=this.roundUpToPowerOfTwo(n);let r=this.computeTextureDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.data=new Float32Array(this.textureWidth*this.textureHeight*4),this.createTexture()}computeTextureDimensions(e){let t=e*this.TEXELS_PER_ITEM,n=Math.min(t,this.maxTextureSize);return{width:n,height:Math.ceil(t/n)}}roundUpToPowerOfTwo(e){return 2**Math.ceil(Math.log2(Math.max(1,e)))}createTexture(){let{gl:e}=this;this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,this.textureWidth,this.textureHeight,0,e.RGBA,e.FLOAT,this.data),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null)}resize(e){if(e<=this.capacity)return;let t=this.roundUpToPowerOfTwo(Math.ceil(e*ct)),{gl:n}=this,r=this.computeTextureDimensions(t),i=new Float32Array(r.width*r.height*4);i.set(this.data),this.texture&&n.deleteTexture(this.texture),this.data=i,this.capacity=t,this.textureWidth=r.width,this.textureHeight=r.height,this.createTexture(),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.nextIndex}allocate(e){let t=this.indexMap.get(e);if(t!==void 0)return t;let n;return this.freeIndices.length>0?n=this.freeIndices.pop():(n=this.nextIndex++,n>=this.capacity&&this.resize(n+1)),this.indexMap.set(e,n),n}free(e){let t=this.indexMap.get(e);if(t===void 0)return;this.indexMap.delete(e),this.freeIndices.push(t);let n=t*this.TEXELS_PER_ITEM*4;for(let e=0;e<this.TEXELS_PER_ITEM*4;e++)this.data[n+e]=0;this.markDirty(t)}getIndex(e){return this.indexMap.get(e)??-1}has(e){return this.indexMap.has(e)}markDirty(e){this.dirty=!0,this.dirtyRangeStart=Math.min(this.dirtyRangeStart,e),this.dirtyRangeEnd=Math.max(this.dirtyRangeEnd,e+1)}upload(){if(!this.dirty||!this.texture)return;let{gl:e,textureWidth:t}=this;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture);let n=this.dirtyRangeStart*this.TEXELS_PER_ITEM,r=Math.min(this.dirtyRangeEnd*this.TEXELS_PER_ITEM,this.capacity*this.TEXELS_PER_ITEM);if(n<r){let i=Math.floor(n/t),a=Math.floor((r-1)/t);for(let o=i;o<=a;o++){let i=o*t,a=Math.min(i+t,this.capacity*this.TEXELS_PER_ITEM),s=Math.max(n,i),c=Math.min(r,a);if(s<c){let t=s-i,n=c-s,r=this.data.subarray(s*4,c*4);e.texSubImage2D(e.TEXTURE_2D,0,t,o,n,1,e.RGBA,e.FLOAT,r)}}}e.bindTexture(e.TEXTURE_2D,null),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}bind(e){let{gl:t}=this;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture)}getTexture(){return this.texture}getCapacity(){return this.capacity}getTextureWidth(){return this.textureWidth}getTextureHeight(){return this.textureHeight}getTexelsPerItem(){return this.TEXELS_PER_ITEM}getCount(){return this.indexMap.size}getHighWaterMark(){return this.nextIndex}isDirty(){return this.dirty}clear(){this.indexMap.clear(),this.freeIndices=[],this.nextIndex=0,this.data.fill(0),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.capacity}restore(){this.createTexture(),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}kill(){this.texture&&=(this.gl.deleteTexture(this.texture),null),this.indexMap.clear(),this.freeIndices=[]}};function j(e){let t={},n={},r=0;for(let i of e)for(let e of i.attributes){let i=e.name.replace(/^a_/,``);i in t||(t[i]=r,n[i]=e,r+=e.size)}return{floatsPerItem:r,texelsPerItem:Math.max(1,Math.ceil(r/4)),offsets:t,specs:n}}var ut=class extends lt{constructor(e,t,n){super(e,t.texelsPerItem,n),this.floatsPerItem=t.floatsPerItem}updateAllAttributes(e,t){let n=this.indexMap.get(e);n===void 0&&(n=this.allocate(e));let r=n*this.TEXELS_PER_ITEM*4,i=Math.min(t.length,this.floatsPerItem);for(let e=0;e<i;e++)this.data[r+e]=t[e];this.markDirty(n)}updateAllAttributesAtRow(e,t){e>=this.capacity&&this.resize(e+1);let n=e*this.TEXELS_PER_ITEM*4,r=Math.min(t.length,this.floatsPerItem);for(let e=0;e<r;e++)this.data[n+e]=t[e];this.markDirty(e)}};function dt(e,t,n){let r=[],i=new Set;for(let a=0;a<e.length;a++){let o=e[a];for(let e of o.attributes){let o=e.name.replace(/^a_/,``);if(i.has(o))continue;i.add(o);let s=t.offsets[o];if(s===void 0)continue;let c=n?.get(a);r.push({sourceKey:e.source||o,packedOffset:s,size:e.size,isColor:e.size===4&&!!e.normalized,defaultNum:typeof e.defaultValue==`number`?e.defaultValue:+(e.defaultValue===!0),defaultColor:typeof e.defaultValue==`string`?e.defaultValue:``,sourceIndex:a,hasLifecycleHook:!!c?.getAttributeData})}}return r}function ft(e,t,n,r,i,a){n.fill(0);for(let o=0,s=e.length;o<s;o++){let s=e[o],c=s.packedOffset,l;if(s.hasLifecycleHook?(l=i.get(s.sourceIndex-a).getAttributeData(t,s.sourceKey),l===null&&(l=t[s.sourceKey])):l=t[s.sourceKey],s.isColor){let[e,t,i,a]=Ie(typeof l==`string`?l:s.defaultColor||r);n[c]=e/255,n[c+1]=t/255,n[c+2]=i/255,n[c+3]=a/255}else if(s.size===1)n[c]=typeof l==`number`?l:typeof l==`boolean`?+!!l:s.defaultNum;else{let e=Array.isArray(l)?l:null;if(e)for(let t=0;t<s.size;t++)n[c+t]=e[t]??0}}}var pt=[`r`,`g`,`b`,`a`];function mt(e,t){let{offsets:n,specs:r,texelsPerItem:i,floatsPerItem:a}=e,o=Object.keys(n);if(o.length===0||a===0)return{fetchCode:``,varyingAssignments:``};let{varPrefix:s,baseTexelExpr:c,textureWidthUniform:l,textureSamplerUniform:u,outputPrefix:d=`v_`}=t,f=[];f.push(`  int ${s}BaseTexel = ${c};`),f.push(``);for(let e=0;e<i;e++)f.push(`  ivec2 ${s}Coord${e} = ivec2((${s}BaseTexel + ${e}) % ${l}, (${s}BaseTexel + ${e}) / ${l});`),f.push(`  vec4 ${s}Texel${e} = texelFetch(${u}, ${s}Coord${e}, 0);`);f.push(``);let p=[];for(let e of o){let t=r[e],i=n[e],a=Math.floor(i/4),o=i%4,c=`${s}Texel${a}`,l=`${s}Texel${a+1}`,u=`${s}Fetched_${e}`;if(t.size===1)f.push(`  float ${u} = ${c}.${pt[o]};`);else if(t.size===4&&o===0)f.push(`  vec4 ${u} = ${c};`);else{let e=o+t.size;if(e<=4){let n=`vec${t.size}`,r=pt.slice(o,e).join(``);f.push(`  ${n} ${u} = ${c}.${r};`)}else{let n=t.size===4?`vec4`:`vec${t.size}`,r=pt.slice(o).map(e=>`${c}.${e}`),i=pt.slice(0,e-4).map(e=>`${l}.${e}`),a=[...r,...i].join(`, `);f.push(`  ${n} ${u} = ${n}(${a});`)}}p.push(`  ${d}${e} = ${u};`)}return{fetchCode:f.join(`
`),varyingAssignments:p.join(`
`)}}function ht(e,t,n){if(t&&n.type!==`sampler2D`)switch(n.type){case`float`:e.uniform1f(t,n.value);break;case`int`:case`bool`:e.uniform1i(t,n.value);break;case`vec2`:e.uniform2fv(t,n.value);break;case`vec3`:e.uniform3fv(t,n.value);break;case`vec4`:e.uniform4fv(t,n.value);break;case`mat3`:e.uniformMatrix3fv(t,!1,n.value);break;case`mat4`:e.uniformMatrix4fv(t,!1,n.value)}}var gt={[WebGL2RenderingContext.BOOL]:1,[WebGL2RenderingContext.BYTE]:1,[WebGL2RenderingContext.UNSIGNED_BYTE]:1,[WebGL2RenderingContext.SHORT]:2,[WebGL2RenderingContext.UNSIGNED_SHORT]:2,[WebGL2RenderingContext.INT]:4,[WebGL2RenderingContext.UNSIGNED_INT]:4,[WebGL2RenderingContext.FLOAT]:4};function _t(e){let t=e.match(/^(#version[^\n]*\n)/);return t?t[1]+`#define PICKING_MODE
`+e.slice(t[1].length):`#define PICKING_MODE
`+e}var M=class{constructor(e,t,n){this.floats=new Float32Array,this.ints=new Uint32Array,this.constantArray=new Float32Array,this.capacity=0,this.verticesCount=0,this.bufferGeneration=0,this.uploadedGeneration=new Map,this.constantBufferGeneration=0,this.uploadedConstantGeneration=new Map,this.renderOffset=0,this.renderCount=-1,this.debugStats={drawCalls:0,verticesDrawn:0,bufferUploadBytes:0},this.shadersLogged=!1,this.pickProgram=null;let r=this.getDefinition();if(this.VERTICES=r.VERTICES,this.VERTEX_SHADER_SOURCE=r.VERTEX_SHADER_SOURCE,this.FRAGMENT_SHADER_SOURCE=r.FRAGMENT_SHADER_SOURCE,this.UNIFORMS=r.UNIFORMS,this.ATTRIBUTES=r.ATTRIBUTES,this.METHOD=r.METHOD,this.CONSTANT_ATTRIBUTES=`CONSTANT_ATTRIBUTES`in r?r.CONSTANT_ATTRIBUTES:[],this.CONSTANT_DATA=`CONSTANT_DATA`in r?r.CONSTANT_DATA:[],this.isInstanced=`CONSTANT_ATTRIBUTES`in r,this.ATTRIBUTES_ITEMS_COUNT=i(this.ATTRIBUTES),this.STRIDE=this.VERTICES*this.ATTRIBUTES_ITEMS_COUNT,this.renderer=n,this.normalProgram=this.getProgramInfo(`normal`,e,r.VERTEX_SHADER_SOURCE,r.FRAGMENT_SHADER_SOURCE,null),this.pickProgram=this.getProgramInfo(`pick`,e,_t(r.VERTEX_SHADER_SOURCE),_t(r.FRAGMENT_SHADER_SOURCE),null),this.isInstanced){let e=i(this.CONSTANT_ATTRIBUTES);if(this.CONSTANT_DATA.length!==this.VERTICES)throw Error(`Program: error while getting constant data (expected ${this.VERTICES} items, received ${this.CONSTANT_DATA.length} instead)`);this.constantArray=new Float32Array(this.CONSTANT_DATA.length*e);for(let t=0;t<this.CONSTANT_DATA.length;t++){let n=this.CONSTANT_DATA[t];if(n.length!==e)throw Error(`Program: error while getting constant data (one vector has ${n.length} items instead of ${e})`);for(let r=0;r<n.length;r++)this.constantArray[t*e+r]=n[r]}this.STRIDE=this.ATTRIBUTES_ITEMS_COUNT}}kill(){l(this.normalProgram),this.pickProgram&&l(this.pickProgram)}resetDebugStats(){this.debugStats.drawCalls=0,this.debugStats.verticesDrawn=0,this.debugStats.bufferUploadBytes=0}getProgramInfo(e,t,n,r,i){let a=t.createBuffer();if(a===null)throw Error(`Program: error while creating the WebGL buffer.`);let l=o(t,n),u=s(t,r),d=c(t,[l,u]),f={};this.UNIFORMS.forEach(e=>{let n=t.getUniformLocation(d,e);n&&(f[e]=n)});let p={};this.ATTRIBUTES.forEach(e=>{p[e.name]=t.getAttribLocation(d,e.name)});let m;if(this.isInstanced&&(this.CONSTANT_ATTRIBUTES.forEach(e=>{p[e.name]=t.getAttribLocation(d,e.name)}),m=t.createBuffer(),m===null))throw Error(`Program: error while creating the WebGL constant buffer.`);return{name:e,program:d,gl:t,frameBuffer:i,buffer:a,constantBuffer:m||{},uniformLocations:f,attributeLocations:p,isPicking:e===`pick`,vertexShader:l,fragmentShader:u}}bindProgram(e){let t=0,{gl:n,buffer:r}=e;this.isInstanced?(n.bindBuffer(n.ARRAY_BUFFER,e.constantBuffer),t=0,this.CONSTANT_ATTRIBUTES.forEach(n=>t+=this.bindAttribute(n,e,t,!1)),this.uploadedConstantGeneration.get(e.constantBuffer)!==this.constantBufferGeneration&&(n.bufferData(n.ARRAY_BUFFER,this.constantArray,n.STATIC_DRAW),this.uploadedConstantGeneration.set(e.constantBuffer,this.constantBufferGeneration),this.renderer?.getSetting(`DEBUG_logRenderStats`)&&(this.debugStats.bufferUploadBytes+=this.constantArray.byteLength)),n.bindBuffer(n.ARRAY_BUFFER,e.buffer),t=this.renderOffset*this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT,this.ATTRIBUTES.forEach(n=>t+=this.bindAttribute(n,e,t,!0)),this.uploadedGeneration.get(r)!==this.bufferGeneration&&(n.bufferData(n.ARRAY_BUFFER,this.floats,n.DYNAMIC_DRAW),this.uploadedGeneration.set(r,this.bufferGeneration),this.renderer?.getSetting(`DEBUG_logRenderStats`)&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength))):(n.bindBuffer(n.ARRAY_BUFFER,r),t=0,this.ATTRIBUTES.forEach(n=>t+=this.bindAttribute(n,e,t)),this.uploadedGeneration.get(r)!==this.bufferGeneration&&(n.bufferData(n.ARRAY_BUFFER,this.floats,n.DYNAMIC_DRAW),this.uploadedGeneration.set(r,this.bufferGeneration),this.renderer?.getSetting(`DEBUG_logRenderStats`)&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength))),n.bindBuffer(n.ARRAY_BUFFER,null)}unbindProgram(e){this.isInstanced?(this.CONSTANT_ATTRIBUTES.forEach(t=>this.unbindAttribute(t,e,!1)),this.ATTRIBUTES.forEach(t=>this.unbindAttribute(t,e,!0))):this.ATTRIBUTES.forEach(t=>this.unbindAttribute(t,e))}bindAttribute(e,t,n,r){let a=gt[e.type];if(typeof a!=`number`)throw Error(`Program.bind: yet unsupported attribute type "${e.type}"`);let o=t.attributeLocations[e.name],s=t.gl;if(o!==-1){s.enableVertexAttribArray(o);let t=this.isInstanced?(r?this.ATTRIBUTES_ITEMS_COUNT:i(this.CONSTANT_ATTRIBUTES))*Float32Array.BYTES_PER_ELEMENT:this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT;s.vertexAttribPointer(o,e.size,e.type,e.normalized||!1,t,n),this.isInstanced&&r&&s.vertexAttribDivisor(o,1)}return e.size*a}unbindAttribute(e,t,n){let r=t.attributeLocations[e.name],i=t.gl;r!==-1&&(i.disableVertexAttribArray(r),this.isInstanced&&n&&i.vertexAttribDivisor(r,0))}reallocate(e){e!==this.capacity&&(this.capacity=e,this.verticesCount=this.VERTICES*e,this.floats=new Float32Array(this.isInstanced?this.capacity*this.ATTRIBUTES_ITEMS_COUNT:this.verticesCount*this.ATTRIBUTES_ITEMS_COUNT),this.ints=new Uint32Array(this.floats.buffer),this.invalidateBuffers())}invalidateBuffers(){this.bufferGeneration++,this.constantBufferGeneration++}hasNothingToRender(){return this.verticesCount===0}setTypedUniform(e,t){ht(t.gl,t.uniformLocations[e.name]??null,e)}renderProgram(e,t){let{gl:n,program:r,isPicking:i}=t;i?n.disable(n.BLEND):n.enable(n.BLEND),n.useProgram(r),this.setUniforms(e,t),this.drawWebGL(this.METHOD,t)}render(e,t,n){if(!this.shadersLogged&&this.renderer?.getSetting(`DEBUG_logShaders`)&&(this.shadersLogged=!0,console.log(`[sigma] DEBUG_logShaders: ${this.constructor.name}`,{normal:{vertexShaderSource:this.VERTEX_SHADER_SOURCE,fragmentShaderSource:this.FRAGMENT_SHADER_SOURCE},pick:{vertexShaderSource:_t(this.VERTEX_SHADER_SOURCE),fragmentShaderSource:_t(this.FRAGMENT_SHADER_SOURCE)}})),this.hasNothingToRender())return;this.renderOffset=t??0,this.renderCount=n??-1;let r=this.normalProgram.gl;if(r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,e.width*e.pixelRatio,e.height*e.pixelRatio),this.bindProgram(this.normalProgram),this.renderProgram(e,this.normalProgram),this.unbindProgram(this.normalProgram),this.pickProgram&&e.pickingFrameBuffer){let t=Math.ceil(e.width*e.pixelRatio/e.downSizingRatio),n=Math.ceil(e.height*e.pixelRatio/e.downSizingRatio);r.bindFramebuffer(r.FRAMEBUFFER,e.pickingFrameBuffer),r.viewport(0,0,t,n),this.bindProgram(this.pickProgram),this.renderProgram(e,this.pickProgram),this.unbindProgram(this.pickProgram),r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,e.width*e.pixelRatio,e.height*e.pixelRatio)}}drawWebGL(e,{gl:t}){let n=this.renderCount>=0?this.renderCount:this.capacity;this.renderer?.getSetting(`DEBUG_logRenderStats`)&&(this.debugStats.drawCalls++,this.debugStats.verticesDrawn+=n*this.VERTICES),this.isInstanced?t.drawArraysInstanced(e,0,this.VERTICES,n):t.drawArrays(e,this.renderOffset*this.VERTICES,n*this.VERTICES)}},vt=new Map,yt=!1;function bt(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=n,r.readAsDataURL(e)})}function xt(e){if(!vt.has(e)){let t=fetch(e).then(e=>e.blob()).then(bt).catch(()=>(vt.delete(e),null));vt.set(e,t)}return vt.get(e)}async function St(e){let t=document.createElement(`div`);t.innerHTML=e;let n=Array.from(t.querySelectorAll(`img[src]`)).filter(e=>!e.getAttribute(`src`).startsWith(`data:`));return await Promise.all(n.map(async e=>{let t=await xt(e.getAttribute(`src`));t&&e.setAttribute(`src`,t)})),t.innerHTML}async function Ct(e,t=1){let n=e instanceof SVGElement?new XMLSerializer().serializeToString(e):e,r=new DOMParser().parseFromString(n,`image/svg+xml`).querySelector(`svg`);if(!r)return null;let i=parseFloat(r.getAttribute(`width`)||``),a=parseFloat(r.getAttribute(`height`)||``);if(!(i>0)||!(a>0)){let e=r.getAttribute(`viewBox`);if(e){let t=e.trim().split(/[\s,]+/);i=parseFloat(t[2]),a=parseFloat(t[3])}}if(!(i>0)||!(a>0))return console.warn(`Sigma: SVG label attachment has no parseable dimensions — skipped.`),null;let o=Math.ceil(i*t),s=Math.ceil(a*t),c=new Blob([n],{type:`image/svg+xml`}),l=URL.createObjectURL(c);return new Promise(e=>{let t=new Image;t.onload=()=>{let n=document.createElement(`canvas`);n.width=o,n.height=s,n.getContext(`2d`).drawImage(t,0,0,o,s),URL.revokeObjectURL(l);try{n.getContext(`2d`).getImageData(0,0,1,1)}catch(t){if(t instanceof DOMException&&t.name===`SecurityError`){yt||(yt=!0,console.warn(`Sigma: A label attachment was skipped because the rendered canvas is tainted. SVG with <foreignObject> (used by the "html" attachment type) is blocked in Chromium and Safari. Use type: "canvas" with Canvas 2D rendering instead.`)),e(null);return}throw t}e(n)},t.onerror=()=>{URL.revokeObjectURL(l),e(null)},t.src=l})}function wt(e,t){let n=document.createElement(`div`);n.style.cssText=`position:fixed;left:-99999px;top:0;visibility:hidden;width:max-content;height:max-content`,n.innerHTML=(t?`<style>${t}</style>`:``)+e,document.body.appendChild(n);let{width:r,height:i}=n.getBoundingClientRect();return document.body.removeChild(n),{width:Math.ceil(r),height:Math.ceil(i)}}async function Tt(e,t,n,r,i=1){let a=await St(e instanceof HTMLElement?e.outerHTML:e);if(n==null||r==null){let e=wt(a,t);n??=e.width,r??=e.height}let o=Math.ceil(n*i),s=Math.ceil(r*i),c=t?`<style>${t}</style>`:``;return Ct(`<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${s}" viewBox="0 0 ${n} ${r}"><foreignObject width="${n}" height="${r}"><body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">${c}${a}</body></foreignObject></svg>`,1)}async function Et(e,t=1){switch(e.type){case`canvas`:return e.canvas;case`svg`:return Ct(e.svg,t);case`html`:return Tt(e.html,e.css,e.width,e.height,t)}}var Dt={below:0,above:1,left:2,right:3};function Ot(){return`#version 300 es
precision highp float;

uniform mat3 u_matrix;
uniform vec2 u_resolution;
uniform float u_labelPixelSnapping;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;

uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

// Atlas size is fixed at 2048×2048 — matches AttachmentManager.ATLAS_SIZE.
uniform sampler2D u_atlasTexture;
const vec2 u_atlasSize = vec2(2048.0);

// Per-instance
in float a_nodeIndex;           // node-data texture index
in vec4 a_atlasRect;            // x, y, width, height in atlas pixels
in vec2 a_attachmentSize;       // attachment dimensions (CSS px)
in float a_positionMode;        // label position: 0=right 1=left 2=above 3=below 4=over
in float a_attachmentPlacement; // 0=below 1=above 2=left 3=right (relative to label)
in float a_labelWidth;          // label width (CSS px)
in float a_labelHeight;         // label height: font line box (CSS px)
in float a_textHeight;          // actual glyph height (CSS px)
in float a_labelAngle;          // label rotation angle (radians)

// Per-vertex (constant)
in vec2 a_quadCorner;           // [-1,-1], [1,-1], [-1,1], [1,1]

out vec2 v_texCoord;

${T}
${E}
${ue}
${ce}
${ne}

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePos = nodeData.xy;
  float nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; we just read the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  vec3 nodeClip = u_matrix * vec3(nodePos, 1.0);

  // Node radius in physical pixels (matches label/background).
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusPixels = nodeRadiusGraphSpace * matrixScaleX * u_resolution.x / 2.0;

  // CSS-px inputs -> physical px, scaled by the zoom-dependent label ratio, so
  // the attachment stays glued to the label box exactly as the label scales.
  float zoomScale = u_zoomLabelSizeRatio;
  vec2 labelHalf = vec2(a_labelWidth, a_labelHeight) * 0.5 * zoomScale * u_pixelRatio;
  vec2 attachHalf = a_attachmentSize * 0.5 * zoomScale * u_pixelRatio;
  float gap = ${2 .toFixed(1)} * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Graph-aligned labels add the camera angle so the attachment orbits with the box.
  mat2 labelRotMat = rotate2D(a_labelAngle - labelRotation * u_cameraAngle);

  // Label box center relative to the node center (pre-rotation). The shape-aware
  // edge distance comes from the frame texture, so placement matches the label.
  vec2 boxCenter = vec2(0.0);
  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * 0.5 * zoomScale * u_pixelRatio;
    boxCenter = labelBoxCenter(a_positionMode, labelStart, labelHalf, textHalf);
  }

  // Horizontal anchor of below/above attachments tracks the label position, so
  // the attachment hangs from the label edge nearest the node (or is centered
  // when the label itself is node-centered): right->left, left->right, else center.
  float anchorX = 0.0;
  if (a_positionMode < 0.5) anchorX = -labelHalf.x + attachHalf.x;       // right label
  else if (a_positionMode < 1.5) anchorX = labelHalf.x - attachHalf.x;   // left label

  // Attachment center relative to the box (pre-rotation, Y-down). This offset
  // depends only on the box, the gap and the attachment size — never the shape.
  vec2 attachCenter;
  if (a_attachmentPlacement < 0.5) {
    // below
    attachCenter = boxCenter + vec2(anchorX, labelHalf.y + gap + attachHalf.y);
  } else if (a_attachmentPlacement < 1.5) {
    // above
    attachCenter = boxCenter + vec2(anchorX, -(labelHalf.y + gap + attachHalf.y));
  } else if (a_attachmentPlacement < 2.5) {
    // left, top-aligned
    attachCenter = boxCenter + vec2(-(labelHalf.x + gap + attachHalf.x), -labelHalf.y + attachHalf.y);
  } else {
    // right, top-aligned
    attachCenter = boxCenter + vec2(labelHalf.x + gap + attachHalf.x, -labelHalf.y + attachHalf.y);
  }

  // Rotate the whole assembly by the label angle, around the node center.
  vec2 rotatedCenter = labelRotMat * attachCenter;
  vec2 cornerOffset = labelRotMat * (a_quadCorner * attachHalf);

  // Node center in screen px (Y-down).
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;

  // Snap node center to the pixel grid so label/backdrop/attachment move as one.
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Snap the quad's top-left to integer pixels so atlas texels map 1:1.
  vec2 centerScreen = nodeScreen + rotatedCenter + snapDelta;
  vec2 topLeft = centerScreen - attachHalf;
  topLeft = mix(topLeft, round(topLeft), u_labelPixelSnapping);
  centerScreen = topLeft + attachHalf;

  vec2 vertexScreen = centerScreen + cornerOffset;
  gl_Position = vec4(
    vertexScreen.x * 2.0 / u_resolution.x - 1.0,
    1.0 - vertexScreen.y * 2.0 / u_resolution.y,
    0.0, 1.0
  );

  vec2 texOrigin = a_atlasRect.xy / u_atlasSize;
  vec2 texSize = a_atlasRect.zw / u_atlasSize;
  vec2 uv = (a_quadCorner + 1.0) / 2.0;
  v_texCoord = texOrigin + uv * texSize;
}
`}var kt=`#version 300 es
precision highp float;

uniform sampler2D u_atlasTexture;

in vec2 v_texCoord;

layout(location = 0) out vec4 fragColor;
#ifdef PICKING_MODE
layout(location = 1) out vec4 pickColor;
#endif

void main() {
  // Canvas textures are premultiplied; output directly for (ONE, 1-SRC_ALPHA) blending
  vec4 color = texture(u_atlasTexture, v_texCoord);
  if (color.a < 0.01) discard;
  fragColor = color;
#ifdef PICKING_MODE
  pickColor = vec4(0.0); // Attachments are not pickable
#endif
}
`;function At(e,t,n,r){let{label:i={}}=r,a=i.margin??5,o=i.zoomToLabelSizeRatioFunction??(()=>1),s=Ot(),c=kt;class l extends M{constructor(...e){super(...e),this.totalCount=0,this.bufferCapacity=0}static{this.labelMargin=a}getDefinition(){let{FLOAT:e,TRIANGLE_STRIP:t}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:s,FRAGMENT_SHADER_SOURCE:c,METHOD:t,UNIFORMS:[`u_matrix`,`u_resolution`,`u_labelPixelSnapping`,`u_sizeRatio`,`u_correctionRatio`,`u_cameraAngle`,`u_pixelRatio`,`u_labelMargin`,`u_zoomLabelSizeRatio`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_nodeFrameTexture`,`u_nodeFrameTextureWidth`,`u_atlasTexture`],ATTRIBUTES:[{name:`a_nodeIndex`,size:1,type:e},{name:`a_atlasRect`,size:4,type:e},{name:`a_attachmentSize`,size:2,type:e},{name:`a_positionMode`,size:1,type:e},{name:`a_attachmentPlacement`,size:1,type:e},{name:`a_labelWidth`,size:1,type:e},{name:`a_labelHeight`,size:1,type:e},{name:`a_textHeight`,size:1,type:e},{name:`a_labelAngle`,size:1,type:e}],CONSTANT_ATTRIBUTES:[{name:`a_quadCorner`,size:2,type:e}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}processAttachment(e,t){let{floats:n}=this,r=e*this.STRIDE;n[r++]=t.nodeIndex,n[r++]=t.atlasX,n[r++]=t.atlasY,n[r++]=t.atlasW,n[r++]=t.atlasH,n[r++]=t.attachWidth,n[r++]=t.attachHeight,n[r++]=t.positionMode,n[r++]=t.attachmentPlacement,n[r++]=t.labelWidth,n[r++]=t.labelHeight,n[r++]=t.textHeight,n[r++]=t.labelAngle}setUniforms(e,{gl:t,uniformLocations:n}){t.uniformMatrix3fv(n.u_matrix,!1,e.matrix),t.uniform2f(n.u_resolution,e.width*e.pixelRatio,e.height*e.pixelRatio),t.uniform1f(n.u_labelPixelSnapping,e.labelPixelSnapping),t.uniform1f(n.u_sizeRatio,e.sizeRatio),t.uniform1f(n.u_correctionRatio,e.correctionRatio),t.uniform1f(n.u_cameraAngle,e.cameraAngle),t.uniform1f(n.u_pixelRatio,e.pixelRatio),t.uniform1f(n.u_labelMargin,l.labelMargin),t.uniform1f(n.u_zoomLabelSizeRatio,1/o(e.zoomRatio)),t.uniform1i(n.u_nodeDataTexture,e.nodeDataTextureUnit),t.uniform1i(n.u_nodeDataTextureWidth,e.nodeDataTextureWidth),t.uniform1i(n.u_nodeFrameTexture,e.nodeFrameTextureUnit),t.uniform1i(n.u_nodeFrameTextureWidth,e.nodeFrameTextureWidth),t.uniform1i(n.u_atlasTexture,7)}reallocateAttachments(e){this.totalCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}hasNothingToRender(){return this.totalCount===0}drawWebGL(e,{gl:t}){this.totalCount!==0&&t.drawArraysInstanced(e,0,this.VERTICES,this.totalCount)}}return new l(e,t,n)}var jt=2048,Mt=class{constructor(e,t,n){this.cache=new Map,this.pending=new Set,this.atlas={},this.glTexture=null,this.dirty=!0,this.gl=e,this.renderers=t,this.scheduleRender=n,this.packCanvas=document.createElement(`canvas`),this.packCanvas.width=jt,this.packCanvas.height=jt,this.packCtx=this.packCanvas.getContext(`2d`)}renderAttachment(e,t,n){let r=`${e}:${t}`;if(this.cache.has(r)||this.pending.has(r))return;let i=this.renderers[t];if(!i)return;let a=i(n);if(!a)return;this.pending.add(r);let{pixelRatio:o}=n;Promise.resolve(a).then(async e=>{if(!this.pending.has(r)||(this.pending.delete(r),!e))return;let t=await Et(e,o);t&&t.width!==0&&t.height!==0&&(this.cache.set(r,{image:t,width:t.width,height:t.height}),this.dirty=!0,this.scheduleRender())})}regenerateAtlas(){if(!this.dirty)return;this.dirty=!1;let e=[];if(this.cache.forEach((t,n)=>{e.push({key:n,width:t.width,height:t.height,draw:(e,n,r)=>{e.drawImage(t.image,n,r)}})}),e.length===0){this.atlas={},this.deleteGLTexture();return}let t={x:0,y:0,rowHeight:0,maxRowWidth:0};this.packCtx.clearRect(0,0,jt,jt);let{atlas:n,remaining:r}=ot(e,this.packCtx,t);this.atlas=n,r.length>0&&console.warn(`Sigma: ${r.length} label attachment(s) could not fit in the ${jt}x${jt} atlas and will not be rendered.`),this.deleteGLTexture();let i=this.gl,a=i.createTexture();i.activeTexture(i.TEXTURE0+7),i.bindTexture(i.TEXTURE_2D,a),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,this.packCanvas),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),this.glTexture=a}bindTexture(e){if(!this.glTexture)return;let t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.glTexture)}getEntry(e,t){let n=`${e}:${t}`;return this.atlas[n]||null}invalidateNode(e){let t=`${e}:`;for(let e of this.cache.keys())e.startsWith(t)&&(this.cache.delete(e),this.dirty=!0);for(let e of this.pending)e.startsWith(t)&&this.pending.delete(e)}restore(){this.glTexture=null,this.dirty=!0}clear(){this.cache.clear(),this.pending.clear(),this.atlas={},this.dirty=!0,this.deleteGLTexture()}kill(){this.clear(),this.packCanvas=null,this.packCtx=null,this.gl=null}deleteGLTexture(){this.glTexture&&=(this.gl.deleteTexture(this.glTexture),null)}};function Nt(e,t){return[...t,...e.map(e=>({attributes:e.attributes??[]}))]}function Pt(e,t){let n=j(Nt(e,t)),r=new Set(e.flatMap(e=>e.attributes??[]).map(e=>e.name.replace(/^a_/,``))),i={},a={};for(let e of r)i[e]=n.offsets[e],a[e]=n.specs[e];return{...n,offsets:i,specs:a}}function Ft(e,t){let n=new Set([`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_cameraAngle`,`u_pickingPadding`,`u_nodeDataTexture`,`u_layerAttributeTexture`]),r=new Set,i=e.flatMap(e=>e.uniforms).filter(e=>n.has(e.name)||r.has(e.name)?!1:(r.add(e.name),!0)).map(e=>`uniform ${e.type} ${e.name};`).join(`
`),a=t.flatMap(e=>e.uniforms).filter(e=>n.has(e.name)||r.has(e.name)?!1:(r.add(e.name),!0)).map(e=>`uniform ${e.type} ${e.name};`).join(`
`),o=Nt(e,t),s=new Set,c=o.flatMap(e=>e.attributes).filter(e=>{let t=e.name.replace(/^a_/,``);return!s.has(t)&&(s.add(t),!0)}).map(e=>{let t=e.name.replace(/^a_/,``);return`out ${e.size===1?`float`:`vec${e.size}`} v_${t};`}).join(`
`),{fetchCode:l,varyingAssignments:u}=mt(j(o),{varPrefix:`layer`,baseTexelExpr:`nodeIdx * u_layerAttributeTexelsPerNode`,textureWidthUniform:`u_layerAttributeTextureWidth`,textureSamplerUniform:`u_layerAttributeTexture`});return`#version 300 es

// Standard node attributes (per instance) - minimal buffer usage
in float a_nodeIndex;  // Index into node data texture AND layer attribute texture
in vec4 a_id;          // Node ID for picking
in float a_opacity;    // Node opacity, applied once to the final fragment

// Constant attributes (per vertex, same for all instances)
in vec2 a_quadCorner;  // (-1,-1), (1,-1), (1,1), (-1,1) for quad corners

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;

// Layer attribute texture uniforms
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

${i}
${a}

// Standard varyings
out vec2 v_uv;                    // Normalized coordinates [-1, 1]
out vec4 v_id;
out float v_opacity;
out float v_antialiasingWidth;    // Width for antialiasing in UV space
out float v_pixelSize;            // Node size in pixels (for pixel-mode borders)
out float v_pixelToUV;            // Conversion factor: multiply by this to convert screen pixels to UV units
out float v_shapeId;              // Shape ID for multi-shape programs

// Layer varyings
${c}

// Node-data fetch helpers (geometry texel + rotation-flags texel)
${T}
${E}

void main() {
  // Fetch node geometry: vec4(x, y, size, shapeId).
  int nodeIdx = int(a_nodeIndex);

  // Hidden nodes are flagged with a negative row by NodeProgram.process(). Push
  // the whole quad outside the clip volume: every vertex lands at the same
  // out-of-range position, so the primitive is fully clipped and rasterizes
  // nothing — neither to the frame buffer nor to the picking buffer.
  if (nodeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    return;
  }

  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_position = nodeData.xy;
  float a_size = nodeData.z;
  v_shapeId = nodeData.w;  // Pass shape ID to fragment shader

  // Per-node rotation alignment: 0 = viewport (screen-upright), 1 = graph.
  float nodeRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).r;

${l}

  // Calculate the actual size in pixels
  float size = a_size * u_correctionRatio / u_sizeRatio * 2.0;

  // In PICKING_MODE, inflate the quad by nodePickingPadding pixels on each side
  #ifdef PICKING_MODE
    float paddedSize = size + u_pickingPadding * u_correctionRatio;
    vec2 offset = a_quadCorner * paddedSize;
  #else
    vec2 offset = a_quadCorner * size;
  #endif
  // Counter-rotate the quad offset so viewport-aligned nodes stay upright as the
  // camera turns. Graph-aligned nodes (nodeRotation=1) skip it and turn with the
  // camera. The angle scales by (1 - nodeRotation) so both fall out of one path.
  {
    float ca = u_cameraAngle * (1.0 - nodeRotation);
    float c = cos(ca);
    float s = sin(ca);
    offset = mat2(c, s, -s, c) * offset;
  }
  vec2 position = a_position + offset;

  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  // In PICKING_MODE, UV is scaled beyond [-1, 1] to match the inflated quad
  #ifdef PICKING_MODE
    v_uv = a_quadCorner * (paddedSize / size);
  #else
    v_uv = a_quadCorner;
  #endif

  // Pass ID to fragment shader
  v_id = a_id;
  v_opacity = a_opacity;

  // Pass pixel size for layers that need pixel-mode calculations
  // Multiply by 2 because 'size' is half-width (offset from center), not full diameter
  v_pixelSize = size * 2.0;

  // Conversion factor from screen pixels to UV units
  // Same derivation as v_antialiasingWidth which represents ~1 pixel in UV space
  // P pixels in UV space = P * u_correctionRatio / size
  v_pixelToUV = u_correctionRatio / size;

  // We use an antialiasing width of 1px (so v_pixelToUV)
  v_antialiasingWidth = v_pixelToUV;

  // Pass layer attributes to fragment shader (fetched from texture)
${u}
}
`}function It(e,t,n,r=!0){let i=t.map((e,t)=>{let n=`layer_${e.name}`,r=[...e.attributes.map(e=>`v_${e.name.replace(/^a_/,``)}`),...e.uniforms.map(e=>e.name)].join(`, `);return`  // Layer ${t+1}: ${e.name}
  color = blendOver(color, ${n}(${r}));`}).join(`

`),a=new Set([`u_correctionRatio`]),o=new Set,s=e.flatMap(e=>e.uniforms).filter(e=>a.has(e.name)||o.has(e.name)?!1:(o.add(e.name),!0)).map(e=>`uniform ${e.type} ${e.name};`).join(`
`),c=t.flatMap(e=>e.uniforms).filter(e=>a.has(e.name)||o.has(e.name)?!1:(o.add(e.name),!0)).map(e=>`uniform ${e.type} ${e.name};`).join(`
`),l=new Set;return`#version 300 es
precision highp float;

// Standard varyings
in vec2 v_uv;
in vec4 v_id;
in float v_opacity;
in float v_antialiasingWidth;
in float v_pixelSize;
in float v_pixelToUV;
in float v_shapeId;  // Shape ID for multi-shape programs

// Standard uniforms (needed for some layer calculations like pixel-mode borders)
uniform float u_correctionRatio;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Shape uniforms
${s}

// Layer uniforms
${c}

// Layer varyings
${Nt(e,t).flatMap(e=>e.attributes).filter(e=>{let t=e.name.replace(/^a_/,``);return!l.has(t)&&(l.add(t),!0)}).map(e=>{let t=e.name.replace(/^a_/,``);return`in ${e.size===1?`float`:`vec${e.size}`} v_${t};`}).join(`
`)}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

// LayerContext struct - provides rendering context to all layers
struct LayerContext {
  float sdf;             // Signed distance from shape boundary (negative inside)
  vec2 uv;               // UV coordinates [-1, 1], center at (0,0)
  float shapeSize;       // Effective shape size (~diameter) in UV space (1.0 - aaWidth)
  float shapeHalfSize;   // Effective shape half size (~radius) in UV space
  float pixelSize;       // Node full size (~diameter) in screen pixels
  float aaWidth;         // Anti-aliasing width for smooth transitions
  float correctionRatio; // Scaling factor for consistent rendering across zoom levels
  float pixelToUV;       // Conversion factor: multiply screen pixels by this to get UV units
  float inradiusFactor;  // Ratio of inradius to circumradius (shape depth factor)
};

LayerContext context;  // Global instance, populated before layer calls

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// SDF shape functions
${S(e)}

// Shape selector function (sets context.sdf and context.inradiusFactor)
${ee(e,n)}

// Layer functions
${t.map(e=>e.glsl).join(`

`)}

void main() {
  // 1. Setup LayerContext (available to all layer functions)
  context.shapeSize = 1.0 - v_antialiasingWidth;
  context.shapeHalfSize = context.shapeSize * 0.5;
  context.pixelSize = v_pixelSize;
  context.uv = v_uv;
  context.aaWidth = v_antialiasingWidth;
  context.correctionRatio = u_correctionRatio;
  context.pixelToUV = v_pixelToUV;

  // Query shape SDF based on shapeId (sets context.sdf and context.inradiusFactor)
  queryNodeSDF(int(v_shapeId), v_uv, context.shapeSize);

  // 2. Early discard for pixels fully outside the shape (with AA margin)
  // In PICKING_MODE, allow extra fragments up to the picking padding distance
  #ifdef PICKING_MODE
    if (context.sdf > u_pickingPadding * v_pixelToUV + context.aaWidth) discard;
  #else
    if (context.sdf > context.aaWidth) discard;
  #endif

  // 3. Apply layers sequentially with "over" compositing
  vec4 color = vec4(0.0);

${i}

  #ifdef PICKING_MODE
    // Picking pass: output node ID for pixels within the picking area.
    if (context.sdf > u_pickingPadding * v_pixelToUV) discard;
    fragColor = v_id;
  #else
${r?`    // Visual pass: apply antialiasing at shape boundary, node opacity once
    // smoothstep provides smooth transition from opaque to transparent
    float alpha = smoothstep(context.aaWidth, -context.aaWidth, context.sdf) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) shape boundary, node opacity applied once
    float alpha = (context.sdf < 0.0 ? 1.0 : 0.0) * v_opacity;`}
    // Mix with transparent to fade both color AND alpha together (avoids bright halo)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`}function Lt(e,t){let n=new Set;return n.add(`u_matrix`),n.add(`u_sizeRatio`),n.add(`u_correctionRatio`),n.add(`u_cameraAngle`),n.add(`u_pickingPadding`),n.add(`u_nodeDataTexture`),n.add(`u_nodeDataTextureWidth`),n.add(`u_layerAttributeTexture`),n.add(`u_layerAttributeTextureWidth`),n.add(`u_layerAttributeTexelsPerNode`),e.forEach(e=>{e.uniforms.forEach(e=>n.add(e.name))}),t.forEach(e=>{e.uniforms.forEach(e=>n.add(e.name))}),Array.from(n)}function Rt(e){let{UNSIGNED_BYTE:t,FLOAT:n}=WebGL2RenderingContext;return[{name:`a_nodeIndex`,size:1,type:n},{name:`a_id`,size:4,type:t,normalized:!0},{name:`a_opacity`,size:1,type:n}]}function zt(e){let{shapes:t,layers:n,shapeGlobalIds:r,antialias:i=!0}=e;return{vertexShader:Ft(t,n),fragmentShader:It(t,n,r,i),uniforms:Lt(t,n),attributes:Rt(n)}}function Bt(e,t,n){let{specs:r}=Pt(e,t);return Object.keys(r).map(e=>`flat ${n} ${r[e].size===1?`float`:`vec${r[e].size}`} v_${e};`).join(`
`)}function Vt(e){let{shapes:t,layers:n,shapeGlobalIds:r}=e,i=mt(Pt(t,n),{varPrefix:`nodeAttr`,baseTexelExpr:`nodeIdx * u_layerAttributeTexelsPerNode`,textureWidthUniform:`u_layerAttributeTextureWidth`,textureSamplerUniform:`u_layerAttributeTexture`}),a=t.length===1?`float inradiusFactor = ${u(t[0].inradiusFactor??1)};`:`float inradiusFactor = ${u(t[0].inradiusFactor??1)};
  switch (int(shapeId)) {
${t.map((e,t)=>`    case ${r?r[t]:t}: inradiusFactor = ${u(e.inradiusFactor??1)}; break;`).join(`
`)}
    default: break;
  }`;return`#version 300 es

in float a_nodeIndex;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in vec4 a_backdropColor;
in vec4 a_backdropShadowColor;
in float a_backdropShadowBlur;
in float a_backdropPadding;
in vec4 a_backdropBorderColor;
in vec4 a_backdropExtra; // [borderWidth, cornerRadius, labelPadding, area]
in vec2 a_labelBoxOffset;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

out vec2 v_uv;
out vec2 v_nodeCenter;
out float v_nodeRadius;
out vec2 v_labelCenter;
out vec2 v_labelHalfSize;
out float v_aaWidth;
out float v_shapeId;
out float v_nodeRotation;
out float v_labelAngle;
out vec4 v_backdropColor;
out vec4 v_backdropShadowColor;
out float v_backdropShadowBlur;
out float v_backdropPadding;
out vec4 v_backdropBorderColor;
out float v_backdropBorderWidth;
out float v_backdropCornerRadius;
out float v_backdropArea;
${Bt(t,n,`out`)}

${T}
${E}
${ue}

void main() {
  int nodeIdx = int(a_nodeIndex);
${i.fetchCode}
${i.varyingAssignments}

  // Node data: (x, y, size, shapeId). shapeId (global) is forwarded to the
  // fragment shader, which keeps the shape SDF for the outline.
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;
  float shapeId = nodeData.w;

  // Per-node rotation alignment (0 = viewport, 1 = graph). nodeRotation drives
  // the fragment's shape outline; labelRotation turns the label box with camera.
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;
  v_nodeRotation = nodeRotation;

  ${te}
  // CSS pixel attributes are multiplied by u_pixelRatio to match nodeRadiusPixels,
  // which is already in physical pixels (nodeRadiusNDC * u_resolution.x / 2.0).
  float padding = a_backdropPadding * u_pixelRatio;
  float shadowBlur = a_backdropShadowBlur * u_pixelRatio;
  // Unpack a_backdropExtra: [borderWidth, cornerRadius, labelPadding, area]
  float borderWidth = a_backdropExtra.x * u_pixelRatio;
  float cornerRadius = a_backdropExtra.y * u_pixelRatio;
  float labelPad = a_backdropExtra.z * u_pixelRatio;
  float backdropArea = a_backdropExtra.w;
  // Use 2x shadowBlur so the Gaussian fully decays before the quad edge
  float totalExpansion = shadowBlur * 2.0 + borderWidth;
  float enlargedRadius = nodeRadiusPixels + padding;

  // Circumscribed radius for the quad bounds. Non-circular shapes reach past
  // their inradius out to their circumradius (= enlargedRadius / inradiusFactor),
  // in any direction once rotated. The axis-aligned quad must contain that, or
  // the fill/shadow gets clipped (square corners, triangle tip, etc.).
  ${a}
  float boundRadius = enlargedRadius / inradiusFactor;

  // Apply zoom-dependent label size scaling
  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Only apply labelPad when a label is actually present
  float effectiveLabelPad = labelW > 0.0 ? labelPad : 0.0;
  vec2 labelHalfSize = vec2(labelW * 0.5 + effectiveLabelPad, labelH * 0.5 + effectiveLabelPad);
  vec2 labelOffset = vec2(0.0);

  // Effective label angle: intrinsic angle plus the camera angle when the label
  // is graph-aligned, so the box orbits the node in lockstep with the frame-pass.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 snapDelta = vec2(0.0);

  if (labelW > 0.0) {
    // labelW > 0.0 means this node's label is displayed, so the frame-pass wrote
    // its edge distance this frame.
    float edgeDistPixels = nodeRadiusPixels * readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;
    // labelMargin matches the label shader's margin (gap from node edge to text)
    float labelStart = edgeDistPixels + labelMargin;
    // Above/below center on the actual glyph height, not the font line box, so
    // the box stays aligned with the rendered text (matches labelBoxCenter()).
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;

    // Snap node center to pixel grid so label/backdrop/attachment move as a unit
    vec2 nodeScreen = vec2(
      (nodeClip.x + 1.0) * u_resolution.x,
      (1.0 - nodeClip.y) * u_resolution.y
    ) * 0.5;
    snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

    if (a_positionMode < 0.5) {
      // Right: box spans from node center to text end + padding
      float boxRightEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(boxRightEdge * 0.5, 0.0);
      labelHalfSize.x = boxRightEdge * 0.5;
    } else if (a_positionMode < 1.5) {
      // Left: mirror of right
      float boxLeftEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(-boxLeftEdge * 0.5, 0.0);
      labelHalfSize.x = boxLeftEdge * 0.5;
    } else if (a_positionMode < 2.5) {
      // Above: text bottom at labelStart, centered horizontally
      labelOffset = vec2(0.0, -(labelStart + textHalf));
    } else if (a_positionMode < 3.5) {
      // Below: text top at labelStart, centered horizontally
      labelOffset = vec2(0.0, labelStart + textHalf);
    }
    // over (>=4): labelOffset stays (0,0) — text centered on the node.

    // The attachment-cover shift is in label space (like the attachment itself),
    // so rotate it together with the position offset — otherwise the box drifts
    // off the attachment as the label angle grows.
    labelOffset = labelRotMat * (labelOffset + a_labelBoxOffset * zoomScale * u_pixelRatio);
  }

  // For node-only mode, zero out label dimensions
  if (backdropArea > 0.5 && backdropArea < 1.5) {
    labelHalfSize = vec2(0.0);
    labelOffset = vec2(0.0);
  }

  vec2 minBound, maxBound;

  bool hasLabelBounds = labelW > 0.0 && (backdropArea > 1.5 || backdropArea < 0.5);

  if (hasLabelBounds) {
    // Union with label bounds (area=both) or label-only bounds (area=label)
    vec2 labelMin, labelMax;

    if (a_labelAngle != 0.0) {
      vec2 corner1 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, -labelHalfSize.y);
      vec2 corner2 = labelOffset + labelRotMat * vec2(labelHalfSize.x, -labelHalfSize.y);
      vec2 corner3 = labelOffset + labelRotMat * vec2(labelHalfSize.x, labelHalfSize.y);
      vec2 corner4 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, labelHalfSize.y);
      labelMin = min(min(corner1, corner2), min(corner3, corner4));
      labelMax = max(max(corner1, corner2), max(corner3, corner4));
    } else {
      labelMin = labelOffset - labelHalfSize;
      labelMax = labelOffset + labelHalfSize;
    }

    if (backdropArea > 1.5) {
      // Label-only: bounds from label rect only
      minBound = labelMin - totalExpansion;
      maxBound = labelMax + totalExpansion;
    } else {
      // Both: union of node + label
      minBound = min(-vec2(boundRadius), labelMin) - totalExpansion;
      maxBound = max(vec2(boundRadius), labelMax) + totalExpansion;
    }
  } else {
    // Node-only or no visible label
    float totalRadius = boundRadius + totalExpansion;
    minBound = -vec2(totalRadius);
    maxBound = vec2(totalRadius);
  }

  vec2 quadSize = maxBound - minBound;
  vec2 quadCenter = (minBound + maxBound) * 0.5;

  vec2 localPos = quadCenter + a_quadCorner * quadSize * 0.5 + snapDelta;
  vec2 ndcOffset = localPos * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);

  v_uv = localPos;
  v_nodeCenter = vec2(0.0);
  v_nodeRadius = nodeRadiusPixels;
  v_labelCenter = labelOffset;
  v_labelHalfSize = labelHalfSize;
  v_aaWidth = 1.0;
  v_shapeId = shapeId;
  v_labelAngle = labelAngle;
  v_backdropColor = a_backdropColor;
  v_backdropShadowColor = a_backdropShadowColor;
  v_backdropShadowBlur = a_backdropShadowBlur;
  v_backdropPadding = a_backdropPadding;
  v_backdropBorderColor = a_backdropBorderColor;
  v_backdropBorderWidth = borderWidth;
  v_backdropCornerRadius = cornerRadius;
  v_backdropArea = backdropArea;
}
`}function Ht(e){let{shapes:t,layers:n,shapeGlobalIds:r}=e,i=S(t),a=C(t).map(e=>`uniform ${e.type} ${e.name};`).join(`
`),o=e=>h(e,`nodeUV`,`1.0`),s;return s=t.length===1?`float nodeSdfNormalized = ${o(t[0])};`:`float nodeSdfNormalized;
  int shapeId = int(v_shapeId);
  switch (shapeId) {
${t.map((e,t)=>`    case ${r?r[t]:t}: nodeSdfNormalized = ${o(e)}; break;`).join(`
`)}
    default: nodeSdfNormalized = ${o(t[0])};
  }`,`#version 300 es
precision highp float;

in vec2 v_uv;
in vec2 v_nodeCenter;
in float v_nodeRadius;
in vec2 v_labelCenter;
in vec2 v_labelHalfSize;
in float v_aaWidth;
in float v_shapeId;
in float v_nodeRotation;
in float v_labelAngle;
in vec4 v_backdropColor;
in vec4 v_backdropShadowColor;
in float v_backdropShadowBlur;
in float v_backdropPadding;
in vec4 v_backdropBorderColor;
in float v_backdropBorderWidth;
in float v_backdropCornerRadius;
in float v_backdropArea;
${Bt(t,n,`in`)}

uniform float u_cameraAngle;
${a}

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragPicking;

${i}
${ie}
${ae}
${oe}
${se}

void main() {
  vec4 backdropColor = v_backdropColor;
  vec4 shadowColor = v_backdropShadowColor;
  float shadowBlur = v_backdropShadowBlur;
  float padding = v_backdropPadding;
  vec4 borderColor = v_backdropBorderColor;
  float borderWidth = v_backdropBorderWidth;
  float cornerRadius = v_backdropCornerRadius;

  float enlargedRadius = v_nodeRadius + padding;
  vec2 screenUV = v_uv - v_nodeCenter;
  float effectiveRadius = max(enlargedRadius - cornerRadius, 0.01);
  float ca = u_cameraAngle * v_nodeRotation;
  float ca_c = cos(ca);
  float ca_s = sin(ca);
  vec2 rotatedScreenUV = mat2(ca_c, -ca_s, ca_s, ca_c) * screenUV;
  vec2 nodeUV = vec2(rotatedScreenUV.x, -rotatedScreenUV.y) / effectiveRadius;

  // Query the correct shape SDF based on shapeId
  ${s}
  float nodeSdfPixels = nodeSdfNormalized * effectiveRadius - cornerRadius;

  // Label SDF with optional corner radius and rotation
  float labelSdfPixels;
  if (v_labelHalfSize.x > 0.0) {
    vec2 labelP = v_uv - v_labelCenter;
    labelSdfPixels = sdfRoundedRotatedBox(labelP, v_labelHalfSize, v_labelAngle, cornerRadius);
  } else {
    labelSdfPixels = 10000.0;
  }

  // Select area: 0=both, 1=node, 2=label
  float combinedSdf;
  if (v_backdropArea > 1.5) {
    combinedSdf = labelSdfPixels;
  } else if (v_backdropArea > 0.5) {
    combinedSdf = nodeSdfPixels;
  } else {
    combinedSdf = min(nodeSdfPixels, labelSdfPixels);
  }

  // Fill + border composite
  float outerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf);
  vec4 background;
  if (borderWidth > 0.5) {
    float innerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf + borderWidth);
    float fillAlpha = innerEdge * backdropColor.a;
    vec4 fill = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
    float borderAlpha = (outerEdge - innerEdge) * borderColor.a;
    vec4 border = vec4(borderColor.rgb * borderAlpha, borderAlpha);
    background = fill + border * (1.0 - fill.a);
  } else {
    float fillAlpha = outerEdge * backdropColor.a;
    background = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
  }

  // Gaussian-like shadow falloff (mimics canvas shadowBlur)
  vec4 shadow = vec4(0.0);
  float sigma = shadowBlur / 2.5;
  if (sigma > 0.001) {
    float shadowDist = max(0.0, combinedSdf);
    float shadowAlpha = exp(-(shadowDist * shadowDist) / (2.0 * sigma * sigma)) * shadowColor.a;
    shadow = vec4(shadowColor.rgb * shadowAlpha, shadowAlpha);
  }

  fragColor = background + shadow * (1.0 - background.a);
  fragPicking = vec4(0.0);
}
`}function Ut(e){let t=[`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_cameraAngle`,`u_resolution`,`u_pixelRatio`,`u_labelMargin`,`u_zoomLabelSizeRatio`,`u_labelPixelSnapping`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_nodeFrameTexture`,`u_nodeFrameTextureWidth`,`u_layerAttributeTexture`,`u_layerAttributeTextureWidth`,`u_layerAttributeTexelsPerNode`];for(let n of C(e))t.includes(n.name)||t.push(n.name);return t}function Wt(e){return{vertexShader:Vt(e),fragmentShader:Ht(e),uniforms:Ut(e.shapes)}}function Gt(e,t,n,r){let{label:i={},shapes:a,layers:o,getAttributeTexture:s,shapeGlobalIds:c}=r;if(a.length===0)throw Error(`createBackdropProgram: at least one shape must be provided in 'shapes'`);let l=i.margin??5,u=i.zoomToLabelSizeRatioFunction??(()=>1),d=Wt({shapes:a,layers:o,shapeGlobalIds:c});class f extends M{constructor(...e){super(...e),this.totalBackdropCount=0,this.bufferCapacity=0}static{this.labelMargin=l}getDefinition(){let{FLOAT:e,TRIANGLE_STRIP:t}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:d.vertexShader,FRAGMENT_SHADER_SOURCE:d.fragmentShader,METHOD:t,UNIFORMS:d.uniforms,ATTRIBUTES:[{name:`a_nodeIndex`,size:1,type:e},{name:`a_labelWidth`,size:1,type:e},{name:`a_labelHeight`,size:1,type:e},{name:`a_textHeight`,size:1,type:e},{name:`a_positionMode`,size:1,type:e},{name:`a_labelAngle`,size:1,type:e},{name:`a_backdropColor`,size:4,type:e},{name:`a_backdropShadowColor`,size:4,type:e},{name:`a_backdropShadowBlur`,size:1,type:e},{name:`a_backdropPadding`,size:1,type:e},{name:`a_backdropBorderColor`,size:4,type:e},{name:`a_backdropExtra`,size:4,type:e},{name:`a_labelBoxOffset`,size:2,type:e}],CONSTANT_ATTRIBUTES:[{name:`a_quadCorner`,size:2,type:e}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}processBackdrop(e,t){let{floats:n,STRIDE:r}=this,i=e*r;n[i++]=t.nodeIndex,n[i++]=t.labelWidth,n[i++]=t.labelHeight,n[i++]=t.textHeight,n[i++]=w[t.position],n[i++]=t.labelAngle,n[i++]=t.backdropColor[0],n[i++]=t.backdropColor[1],n[i++]=t.backdropColor[2],n[i++]=t.backdropColor[3],n[i++]=t.backdropShadowColor[0],n[i++]=t.backdropShadowColor[1],n[i++]=t.backdropShadowColor[2],n[i++]=t.backdropShadowColor[3],n[i++]=t.backdropShadowBlur,n[i++]=t.backdropPadding,n[i++]=t.backdropBorderColor[0],n[i++]=t.backdropBorderColor[1],n[i++]=t.backdropBorderColor[2],n[i++]=t.backdropBorderColor[3],n[i++]=t.backdropBorderWidth,n[i++]=t.backdropCornerRadius,n[i++]=t.backdropLabelPadding,n[i++]=t.backdropArea,n[i++]=t.labelBoxOffset[0],n[i++]=t.labelBoxOffset[1]}setUniforms(e,t){let{gl:n,uniformLocations:r}=t;n.uniformMatrix3fv(r.u_matrix,!1,e.matrix),n.uniform1f(r.u_sizeRatio,e.sizeRatio),n.uniform1f(r.u_correctionRatio,e.correctionRatio),n.uniform1f(r.u_cameraAngle,e.cameraAngle),n.uniform2f(r.u_resolution,e.width*e.pixelRatio,e.height*e.pixelRatio),n.uniform1f(r.u_pixelRatio,e.pixelRatio),n.uniform1f(r.u_labelMargin,f.labelMargin),n.uniform1f(r.u_zoomLabelSizeRatio,1/u(e.zoomRatio)),n.uniform1f(r.u_labelPixelSnapping,e.labelPixelSnapping),n.uniform1i(r.u_nodeDataTexture,e.nodeDataTextureUnit),n.uniform1i(r.u_nodeDataTextureWidth,e.nodeDataTextureWidth),n.uniform1i(r.u_nodeFrameTexture,e.nodeFrameTextureUnit),n.uniform1i(r.u_nodeFrameTextureWidth,e.nodeFrameTextureWidth);let i=s();r.u_layerAttributeTexture&&i&&(i.bind(5),n.uniform1i(r.u_layerAttributeTexture,5),n.uniform1i(r.u_layerAttributeTextureWidth,i.getTextureWidth()),n.uniform1i(r.u_layerAttributeTexelsPerNode,i.getTexelsPerItem()));for(let e of C(a))this.setTypedUniform(e,t)}hasNothingToRender(){return this.totalBackdropCount===0}drawWebGL(e,{gl:t}){this.totalBackdropCount!==0&&(this.isInstanced?t.drawArraysInstanced(e,0,this.VERTICES,this.totalBackdropCount):t.drawArrays(e,0,this.totalBackdropCount*this.VERTICES))}reallocate(e){this.totalBackdropCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}}return new f(e,t,n)}var Kt=n(),qt=class extends M{constructor(...e){super(...e),this.totalCharacterCount=0,this.bufferCapacity=0}processLabel(e,t,n){if(n.hidden||!n.text)return 0;let r=n.text,i=r.length;for(let e=0;e<i;e++){let i=r[e];this.processCharacter(t+e,n,i,e)}return i}hasNothingToRender(){return this.totalCharacterCount===0}drawWebGL(e,{gl:t}){this.totalCharacterCount!==0&&(this.isInstanced?t.drawArraysInstanced(e,0,this.VERTICES,this.totalCharacterCount):t.drawArrays(e,0,this.totalCharacterCount*this.VERTICES))}reallocate(e){this.totalCharacterCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||1e3),super.reallocate(this.bufferCapacity))}};function Jt(){return`#version 300 es

in float a_nodeIndex;
in vec4 a_id;
in vec4 a_color;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in float a_padding;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pickingPadding;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

out vec4 v_id;
out vec4 v_color;

${T}
${E}
${ue}
${ce}

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;

  // Shape-aware edge distance, read once from the shared frame texture.
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  ${te}

  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;
#ifdef PICKING_MODE
  float padding = u_pickingPadding * u_pixelRatio;
#else
  float padding = a_padding * u_pixelRatio;
#endif

  if (labelW <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    v_color = vec4(0.0);
    return;
  }

  vec2 labelHalfSize = vec2(labelW * 0.5 + padding, labelH * 0.5 + padding);
  vec2 labelOffset = vec2(0.0);

  // Graph-aligned labels add the camera angle so the rect orbits with the text.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;
    // Box center uses the text half-size; the padding expands the quad below.
    labelOffset = labelRotMat * labelBoxCenter(a_positionMode, labelStart, vec2(labelW * 0.5, labelH * 0.5), textHalf);
  }

  // Rotate the rect with the label so it stays aligned with the (rotated) text.
  vec2 localPos = labelOffset + labelRotMat * (a_quadCorner * labelHalfSize);
  vec2 ndcOffset = (localPos + snapDelta) * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);
  v_id = a_id;
  v_color = a_color;
}
`}var Yt=`#version 300 es
precision highp float;

in vec4 v_id;
in vec4 v_color;

out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    fragColor = v_id;
  #else
    if (v_color.a <= 0.0) discard;
    // v_color is non-premultiplied RGBA (0-1); convert to premultiplied for blending
    fragColor = vec4(v_color.rgb * v_color.a, v_color.a);
  #endif
}
`;function Xt(e,t,n,r){let{label:i={}}=r,a=i.margin??5,o=i.zoomToLabelSizeRatioFunction??(()=>1),s=Jt();class c extends M{constructor(...e){super(...e),this.totalCount=0,this.bufferCapacity=0}static{this.labelMargin=a}getDefinition(){let{FLOAT:e,UNSIGNED_BYTE:t,TRIANGLE_STRIP:n}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:s,FRAGMENT_SHADER_SOURCE:Yt,METHOD:n,UNIFORMS:[`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_cameraAngle`,`u_resolution`,`u_pixelRatio`,`u_labelMargin`,`u_zoomLabelSizeRatio`,`u_labelPixelSnapping`,`u_pickingPadding`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_nodeFrameTexture`,`u_nodeFrameTextureWidth`],ATTRIBUTES:[{name:`a_nodeIndex`,size:1,type:e},{name:`a_id`,size:4,type:t,normalized:!0},{name:`a_color`,size:4,type:t,normalized:!0},{name:`a_labelWidth`,size:1,type:e},{name:`a_labelHeight`,size:1,type:e},{name:`a_textHeight`,size:1,type:e},{name:`a_positionMode`,size:1,type:e},{name:`a_labelAngle`,size:1,type:e},{name:`a_padding`,size:1,type:e}],CONSTANT_ATTRIBUTES:[{name:`a_quadCorner`,size:2,type:e}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}processLabelBackground(e,t){let{floats:n,ints:r}=this,i=e*this.STRIDE;n[i++]=t.nodeIndex,r[i++]=t.id,n[i++]=t.color,n[i++]=t.labelWidth,n[i++]=t.labelHeight,n[i++]=t.textHeight,n[i++]=t.positionMode,n[i++]=t.labelAngle,n[i++]=t.padding}setUniforms(e,{gl:t,uniformLocations:n}){t.uniformMatrix3fv(n.u_matrix,!1,e.matrix),t.uniform1f(n.u_sizeRatio,e.sizeRatio),t.uniform1f(n.u_correctionRatio,e.correctionRatio),t.uniform1f(n.u_cameraAngle,e.cameraAngle),t.uniform2f(n.u_resolution,e.width*e.pixelRatio,e.height*e.pixelRatio),t.uniform1f(n.u_pixelRatio,e.pixelRatio),t.uniform1f(n.u_labelMargin,c.labelMargin),t.uniform1f(n.u_zoomLabelSizeRatio,1/o(e.zoomRatio)),t.uniform1f(n.u_labelPixelSnapping,e.labelPixelSnapping),t.uniform1f(n.u_pickingPadding,e.labelPickingPadding),t.uniform1i(n.u_nodeDataTexture,e.nodeDataTextureUnit),t.uniform1i(n.u_nodeDataTextureWidth,e.nodeDataTextureWidth),t.uniform1i(n.u_nodeFrameTexture,e.nodeFrameTextureUnit),t.uniform1i(n.u_nodeFrameTextureWidth,e.nodeFrameTextureWidth)}hasNothingToRender(){return this.totalCount===0}drawWebGL(e,{gl:t}){this.totalCount!==0&&t.drawArraysInstanced(t.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}reallocate(e){this.totalCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}}return new c(e,t,n)}var N={fontSize:64,buffer:8,radius:24,cutoff:.25,maxTextureSize:2048,debounceTimeout:100},Zt=2,Qt=0x56bc75e2d63100000;function $t(e,t,n,r,i){let a=e+i*4,o=document.createElement(`canvas`);o.width=a,o.height=a;let s=o.getContext(`2d`,{willReadFrequently:!0});return s.font=`${r} ${n} ${e}px ${t}`,s.textBaseline=`alphabetic`,s.textAlign=`left`,s.fillStyle=`black`,{ctx:s,canvasSize:a,gridOuter:new Float64Array(a*a),gridInner:new Float64Array(a*a),f:new Float64Array(a),z:new Float64Array(a+1),v:new Uint16Array(a)}}function en(e,t,n,r,i){let{ctx:a,canvasSize:o}=e,s=a.measureText(t),c=s.width,{actualBoundingBoxAscent:l,actualBoundingBoxDescent:u,actualBoundingBoxLeft:d,actualBoundingBoxRight:f}=s,p=Math.ceil(l),m=Math.ceil(d),h=Math.max(0,Math.min(o-n,Math.ceil(d)+Math.ceil(f))),g=Math.min(o-n,p+Math.ceil(u)),_=h+2*n,v=g+2*n,y=Math.max(_*v,0),b=new Uint8ClampedArray(y),x={data:b,width:_,height:v,glyphWidth:h,glyphHeight:g,glyphTop:p,glyphLeft:m,glyphAdvance:c};if(h===0||g===0)return x;let{gridInner:S,gridOuter:C}=e;a.clearRect(n,n,h,g),a.fillText(t,n+m,n+p);let ee=a.getImageData(n,n,h,g);C.fill(Qt,0,y),S.fill(0,0,y);for(let e=0;e<g;e++)for(let t=0;t<h;t++){let r=ee.data[4*(e*h+t)+3]/255;if(r===0)continue;let i=(e+n)*_+t+n;if(r===1)C[i]=0,S[i]=Qt;else{let e=.5-r;C[i]=e>0?e*e:0,S[i]=e<0?e*e:0}}tn(C,0,0,_,v,_,e.f,e.v,e.z),tn(S,n,n,h,g,_,e.f,e.v,e.z);for(let e=0;e<y;e++){let t=Math.sqrt(C[e])-Math.sqrt(S[e]);b[e]=Math.round(255-255*(t/r+i))}return x}function tn(e,t,n,r,i,a,o,s,c){for(let l=t;l<t+r;l++)nn(e,n*a+l,a,i,o,s,c);for(let l=n;l<n+i;l++)nn(e,l*a+t,1,r,o,s,c)}function nn(e,t,n,r,i,a,o){a[0]=0,o[0]=-0x56bc75e2d63100000,o[1]=Qt,i[0]=e[t];for(let s=1,c=0,l=0;s<r;s++){i[s]=e[t+s*n];let r=s*s;do{let e=a[c];l=(i[s]-i[e]+r-e*e)/(s-e)/2}while(l<=o[c]&&--c>-1);c++,a[c]=s,o[c]=l,o[c+1]=Qt}for(let s=0,c=0;s<r;s++){for(;o[c+1]<s;)c++;let r=a[c],l=s-r;e[t+s*n]=i[r]+l*l}}var rn=class e extends Kt.EventEmitter{static{this.ATLAS_UPDATED_EVENT=`atlasUpdated`}constructor(e={}){super(),this.fonts=new Map,this.textures=[],this.cursor={x:0,y:0,rowHeight:0,atlasIndex:0},this.pendingGlyphs=[],this.debounceTimer=null,this.options={...N,...e},this.canvas=document.createElement(`canvas`),this.canvas.width=this.options.maxTextureSize,this.canvas.height=this.options.maxTextureSize,this.ctx=this.canvas.getContext(`2d`,{willReadFrequently:!0}),this.measureCanvas=document.createElement(`canvas`),this.measureCtx=this.measureCanvas.getContext(`2d`),this.textures.push(this.ctx.getImageData(0,0,1,1))}getFontKey(e){return`${e.family}-${e.weight}-${e.style}`}registerFont(e){let t=this.getFontKey(e);if(this.fonts.has(t))return t;let n=$t(this.options.fontSize,e.family,e.weight,e.style,this.options.buffer);return this.fonts.set(t,{descriptor:e,generator:n,glyphs:new Map}),t}ensureGlyphs(e,t){let n=this.fonts.get(t);if(!n)throw Error(`Font "${t}" is not registered. Call registerFont() first.`);let r=!1;for(let i of e){let e=i.codePointAt(0);e!==void 0&&(n.glyphs.has(e)||(this.pendingGlyphs.push({fontKey:t,charCode:e}),r=!0))}r&&this.scheduleTextureGeneration()}measureText(e,t){let n=this.fonts.get(t);if(!n)throw Error(`Font "${t}" is not registered.`);let{family:r,weight:i,style:a}=n.descriptor;return this.measureCtx.font=`${a} ${i} ${this.options.fontSize}px ${r}`,this.measureCtx.measureText(e).width}getGlyph(e,t){let n=this.fonts.get(t);if(n)return n.glyphs.get(e)}getTextures(){return this.textures}getFontCount(){return this.fonts.size}getGlyphCount(){let e=0;for(let t of this.fonts.values())e+=t.glyphs.size;return e}hasPendingGlyphs(){return this.pendingGlyphs.length>0}flush(){this.debounceTimer&&=(clearTimeout(this.debounceTimer),null),this.generateTextures()}destroy(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.fonts.clear(),this.textures=[],this.pendingGlyphs=[],this.removeAllListeners()}scheduleTextureGeneration(){this.debounceTimer===null&&(this.options.debounceTimeout===null?this.generateTextures():this.debounceTimer=setTimeout(()=>{this.debounceTimer=null,this.generateTextures()},this.options.debounceTimeout))}generateTextures(){if(this.pendingGlyphs.length===0)return;let{maxTextureSize:t,buffer:n,radius:r,cutoff:i}=this.options;for(let{fontKey:e,charCode:a}of this.pendingGlyphs){let o=this.fonts.get(e);if(!o||o.glyphs.has(a))continue;let s=String.fromCodePoint(a),c=en(o.generator,s,n,r,i),l=c.width,u=c.height;this.cursor.x+l+Zt>t&&(this.cursor.x=0,this.cursor.y+=this.cursor.rowHeight+Zt,this.cursor.rowHeight=0),this.cursor.y+u+Zt>t&&(this.finalizeCurrentTexture(),this.cursor={x:0,y:0,rowHeight:0,atlasIndex:this.cursor.atlasIndex+1},this.ctx.clearRect(0,0,t,t));let d=c.data,f=new Uint8ClampedArray(l*u*4);for(let e=0;e<d.length;e++){let t=e*4;f[t]=255,f[t+1]=255,f[t+2]=255,f[t+3]=d[e]}let p=new ImageData(f,l,u);this.ctx.putImageData(p,this.cursor.x,this.cursor.y);let m={charCode:a,width:c.glyphWidth,height:c.glyphHeight,bearingX:-c.glyphLeft-n,bearingY:c.glyphTop+n,advance:c.glyphAdvance,atlasX:this.cursor.x,atlasY:this.cursor.y,atlasWidth:l,atlasHeight:u,atlasIndex:this.cursor.atlasIndex};o.glyphs.set(a,m),this.cursor.x+=l+Zt,this.cursor.rowHeight=Math.max(this.cursor.rowHeight,u)}this.finalizeCurrentTexture(),this.pendingGlyphs=[],this.emit(e.ATLAS_UPDATED_EVENT,{textures:this.textures,glyphCount:this.getGlyphCount()})}finalizeCurrentTexture(){let{maxTextureSize:e}=this.options,t=this.cursor.y>0||this.cursor.rowHeight>0,n=Math.min(e,Math.max(this.cursor.x,t?e:1)),r=Math.min(e,this.cursor.y+this.cursor.rowHeight+Zt),i=this.ctx.getImageData(0,0,n,r);this.cursor.atlasIndex>=this.textures.length?this.textures.push(i):this.textures[this.cursor.atlasIndex]=i}},an=N.fontSize;function on(){return`#version 300 es

// ============================================================================
// Attributes
// ============================================================================

// Per-character (instanced)
in float a_nodeIndex;        // Index into node data texture
in vec2 a_charOffset;        // Character offset from label origin (pixels)
in vec2 a_charSize;          // Character dimensions (pixels)
in vec4 a_texCoords;         // Atlas coords: (x, y, width, height) in pixels
in vec4 a_color;             // Text color (RGBA)
in float a_margin;           // Gap between node edge and label (pixels)
in float a_positionMode;     // Position: 0=right, 1=left, 2=above, 3=below, 4=over
in float a_labelWidth;       // Total label width (pixels)
in float a_labelHeight;      // Label height (pixels)
in float a_verticalCenter;   // Vertical center offset from baseline (pixels)
in float a_textHeight;       // Actual text height: maxAscent + maxDescent (pixels)
in float a_labelAngle;       // Label rotation angle (radians)

// Per-vertex (constant quad corners)
in vec2 a_quadCorner;        // Quad corner: [-1,-1], [1,-1], [-1,1], [1,1]

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pixelRatio;

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
out float v_fontScale;

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float ATLAS_FONT_SIZE = ${u(an)};

// ============================================================================
// Helper Functions
// ============================================================================

${T}
${E}
${ue}
${re}

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Step 0: Fetch node data + shared edge distance from textures
  // -------------------------------------------------------------------------
  // Node-data texture format: vec4(x, y, size, shapeId)
  // 2D texture layout: texCoord = (index % width, index / width)
  int nodeIdx = int(a_nodeIndex);
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_anchorPosition = nodeData.xy;
  float a_nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; the label just reads the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  // Apply zoom-dependent label size scaling
  // Positional values are in CSS pixels; multiply by u_pixelRatio to convert to
  // physical pixels, which is what the NDC conversion (/ u_resolution) expects.
  float zoomScale = u_zoomLabelSizeRatio;
  float margin = a_margin * zoomScale * u_pixelRatio;
  vec2 charOffset = a_charOffset * zoomScale * u_pixelRatio;
  vec2 charSize = a_charSize * zoomScale * u_pixelRatio;
  float labelWidth = a_labelWidth * zoomScale * u_pixelRatio;
  float labelHeight = a_labelHeight * zoomScale;

  // Font scale: ratio of CSS label size to the base atlas font size.
  // Divided by u_pixelRatio because the atlas is generated at ATLAS_FONT_SIZE * pixelRatio,
  // which cancels out the u_pixelRatio in the fragment shader's gamma formula and keeps
  // the anti-aliasing band width consistent across pixel densities.
  v_fontScale = a_labelHeight * zoomScale / (ATLAS_FONT_SIZE * u_pixelRatio);

  // -------------------------------------------------------------------------
  // Step 1: Transform node position to clip space
  // -------------------------------------------------------------------------
  vec3 anchorClip = u_matrix * vec3(a_anchorPosition, 1.0);

  // -------------------------------------------------------------------------
  // Step 2: Convert node size to screen pixels
  // -------------------------------------------------------------------------
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = a_nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
  float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;

  // -------------------------------------------------------------------------
  // Step 3: Calculate position offset from the shared edge distance
  // -------------------------------------------------------------------------
  vec2 positionOffset = vec2(0.0);

  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    float boundaryDistPixels = nodeRadiusPixels * edgeDist;
    positionOffset = screenDir * (boundaryDistPixels + margin);
  }

  // -------------------------------------------------------------------------
  // Step 4: Calculate final vertex position
  // -------------------------------------------------------------------------
  vec2 cornerOffset = (a_quadCorner + 1.0) * 0.5;
  vec2 charPixelPos = positionOffset + charOffset + cornerOffset * charSize;

  // Apply text alignment based on position mode
  float verticalCenter = a_verticalCenter * zoomScale * u_pixelRatio;
  float textHeight = a_textHeight * zoomScale * u_pixelRatio;
  float baselineToDescent = textHeight / 2.0 - verticalCenter;
  float baselineToAscent = textHeight / 2.0 + verticalCenter;

  if (a_positionMode < 0.5) {
    // Right: vertically center
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 1.5) {
    // Left: right-align and vertically center
    charPixelPos.x -= labelWidth;
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 2.5) {
    // Above: center horizontally, bottom of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y -= baselineToDescent;
  } else if (a_positionMode < 3.5) {
    // Below: center horizontally, top of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += baselineToAscent;
  } else {
    // Over: center both
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += verticalCenter;
  }

  // Apply label angle rotation. Graph-aligned labels add the camera angle so the
  // whole label orbits the node in lockstep with the frame-pass edge distance.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);
  charPixelPos = labelRotMat * charPixelPos;

  // Snap node center to pixel grid so label/backdrop/attachment move as a unit
  vec2 nodeScreen = vec2(
    (anchorClip.x + 1.0) * u_resolution.x,
    (1.0 - anchorClip.y) * u_resolution.y
  ) * 0.5;
  charPixelPos += (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Convert to NDC (flip Y: screen Y-down -> clip Y-up)
  vec2 ndcOffset = vec2(charPixelPos.x, -charPixelPos.y) * 2.0 / u_resolution;
  gl_Position = vec4(anchorClip.xy + ndcOffset, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 5: Texture coordinates
  // -------------------------------------------------------------------------
  v_texCoord = (a_texCoords.xy + cornerOffset * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 6: Pass color
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
}
`}function sn(){return`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
in float v_fontScale;

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Labels are not pickable - discard all fragments in picking mode
    fragColor = vec4(0.0);
    discard;
  #else
    // Sample SDF value from atlas (high = inside glyph, low = outside)
    float sdfValue = texture(u_atlas, v_texCoord).a;

    // Edge threshold: 1.0 - cutoff = 0.75 for default cutoff=0.25
    // This is where the glyph edge is located in the SDF
    float edgeThreshold = 1.0 - u_sdfBuffer;

    // Gamma controls the anti-aliasing band width.
    // Scale inversely with font scale so small labels get a wider AA band
    // (smoother) and large labels get a tighter band (sharper).
    float gamma = u_gamma / (u_pixelRatio * v_fontScale);

    // Pure gamma-based anti-aliasing using smoothstep
    // The AA band extends from (threshold - gamma) to (threshold + gamma)
    float alpha = smoothstep(edgeThreshold - gamma, edgeThreshold + gamma, sdfValue);

    // Premultiplied alpha output for correct blending
    float finalAlpha = v_color.a * alpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  #endif
}
`}function cn(){return[`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_cameraAngle`,`u_resolution`,`u_atlasSize`,`u_atlas`,`u_gamma`,`u_sdfBuffer`,`u_pixelRatio`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_nodeFrameTexture`,`u_nodeFrameTextureWidth`,`u_zoomLabelSizeRatio`,`u_labelPixelSnapping`]}function ln(){return{vertexShader:on(),fragmentShader:sn(),uniforms:cn()}}function un(e,t,n,r){let{label:i={}}=r,a=i.margin??5,o=i.zoomToLabelSizeRatioFunction??(()=>1),s=ln();class c extends qt{static{this.labelMargin=a}static{this.zoomToLabelSizeRatioFunction=o}constructor(e,t,n){if(super(e,t,n),this.atlasTexture=null,this.atlasNeedsUpdate=!1,this.labelGlyphCache=new Map,this.atlasFontSize=N.fontSize*rt(),this.atlasManager=new rn({fontSize:this.atlasFontSize}),this.gamma=.025,this.sdfBuffer=N.cutoff,this.atlasTexture=e.createTexture(),!this.atlasTexture)throw Error(`NodeLabelProgram: failed to create atlas texture`);e.bindTexture(e.TEXTURE_2D,this.atlasTexture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.bindTexture(e.TEXTURE_2D,null),this.atlasManager.on(rn.ATLAS_UPDATED_EVENT,()=>{this.atlasNeedsUpdate=!0});let r={family:i.font?.family||`sans-serif`,weight:i.font?.weight||`normal`,style:i.font?.style||`normal`};this.defaultFontKey=this.atlasManager.registerFont(r)}getDefinition(){let{FLOAT:e,UNSIGNED_BYTE:t,TRIANGLE_STRIP:n}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:s.vertexShader,FRAGMENT_SHADER_SOURCE:s.fragmentShader,METHOD:n,UNIFORMS:s.uniforms,ATTRIBUTES:[{name:`a_nodeIndex`,size:1,type:e},{name:`a_charOffset`,size:2,type:e},{name:`a_charSize`,size:2,type:e},{name:`a_texCoords`,size:4,type:e},{name:`a_color`,size:4,type:t,normalized:!0},{name:`a_margin`,size:1,type:e},{name:`a_positionMode`,size:1,type:e},{name:`a_labelWidth`,size:1,type:e},{name:`a_labelHeight`,size:1,type:e},{name:`a_verticalCenter`,size:1,type:e},{name:`a_textHeight`,size:1,type:e},{name:`a_labelAngle`,size:1,type:e}],CONSTANT_ATTRIBUTES:[{name:`a_quadCorner`,size:2,type:e}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}prepareLabelGlyphs(e,t){if(t.hidden||!t.text){this.labelGlyphCache.delete(e);return}let n=t.text,r=t.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(n,r);let i=[],a=[],o=0,s=0,c=0;for(let e of n){let t=e.codePointAt(0);if(t===void 0){i.push(void 0),a.push(o);continue}let n=this.atlasManager.getGlyph(t,r);i.push(n),a.push(o),n&&(o+=n.advance,s=Math.max(s,n.bearingY),c=Math.max(c,n.atlasHeight-n.bearingY))}this.labelGlyphCache.set(e,{glyphs:i,xOffsets:a,totalWidth:o,totalHeight:s+c,verticalCenterOffset:(s-c)/2})}processCharacter(e,t,n,r){let{floats:i,STRIDE:a}=this,o=e*a,s=this.labelGlyphCache.get(t.parentKey);if(!s||!s.glyphs[r]){for(let e=0;e<a;e++)i[o+e]=0;return}let c=s.glyphs[r],l=s.xOffsets[r],u=t.size/this.atlasFontSize,d=k(t.color),f=o;i[f++]=t.nodeIndex,i[f++]=(l+c.bearingX)*u,i[f++]=-c.bearingY*u,i[f++]=c.atlasWidth*u,i[f++]=c.atlasHeight*u,i[f++]=c.atlasX,i[f++]=c.atlasY,i[f++]=c.atlasWidth,i[f++]=c.atlasHeight,i[f++]=d,i[f++]=t.margin,i[f++]=w[t.position],i[f++]=s.totalWidth*u,i[f++]=t.size,i[f++]=s.verticalCenterOffset*u,i[f++]=s.totalHeight*u,i[f++]=t.labelAngle}processLabel(e,t,n){return this.prepareLabelGlyphs(e,n),super.processLabel(e,t,n)}updateAtlasTexture(){if(!this.atlasNeedsUpdate)return;let e=this.normalProgram.gl,t=this.atlasManager.getTextures();if(t.length===0)return;let n=t[0];e.bindTexture(e.TEXTURE_2D,this.atlasTexture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,n.width,n.height,0,e.RGBA,e.UNSIGNED_BYTE,n.data),e.bindTexture(e.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}setUniforms(e,t){let{gl:n,uniformLocations:r}=t;n.uniformMatrix3fv(r.u_matrix,!1,e.matrix),n.uniform1f(r.u_sizeRatio,e.sizeRatio),n.uniform1f(r.u_correctionRatio,e.correctionRatio),n.uniform1f(r.u_cameraAngle,e.cameraAngle),n.uniform2f(r.u_resolution,e.width*e.pixelRatio,e.height*e.pixelRatio);let i=this.atlasManager.getTextures();i.length>0?n.uniform2f(r.u_atlasSize,i[0].width,i[0].height):n.uniform2f(r.u_atlasSize,1,1),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.atlasTexture),n.uniform1i(r.u_atlas,0),r.u_nodeDataTexture!==void 0&&n.uniform1i(r.u_nodeDataTexture,e.nodeDataTextureUnit),r.u_nodeDataTextureWidth!==void 0&&n.uniform1i(r.u_nodeDataTextureWidth,e.nodeDataTextureWidth),n.uniform1i(r.u_nodeFrameTexture,e.nodeFrameTextureUnit),n.uniform1i(r.u_nodeFrameTextureWidth,e.nodeFrameTextureWidth),n.uniform1f(r.u_gamma,this.gamma),n.uniform1f(r.u_sdfBuffer,this.sdfBuffer),n.uniform1f(r.u_pixelRatio,e.pixelRatio),n.uniform1f(r.u_zoomLabelSizeRatio,1/c.zoomToLabelSizeRatioFunction(e.zoomRatio)),n.uniform1f(r.u_labelPixelSnapping,e.labelPixelSnapping)}renderProgram(e,t){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),super.renderProgram(e,t)}registerFont(e,t=`normal`,n=`normal`){return this.atlasManager.registerFont({family:e,weight:t,style:n})}getAtlasManager(){return this.atlasManager}measureLabel(e,t,n){let r=n||this.defaultFontKey;this.atlasManager.ensureGlyphs(e,r),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();let i=0,a=0,o=0;for(let t of e){let e=t.codePointAt(0);if(e===void 0)continue;let n=this.atlasManager.getGlyph(e,r);n&&(i+=n.advance,a=Math.max(a,n.bearingY),o=Math.max(o,n.atlasHeight-n.bearingY))}let s=t/this.atlasFontSize;return{width:i*s,height:t,textHeight:(a+o)*s}}ensureGlyphsReady(e,t){let n=t||this.defaultFontKey;for(let t of e)this.atlasManager.ensureGlyphs(t,n);this.atlasManager.flush()}kill(){let e=this.normalProgram.gl;this.atlasTexture&&=(e.deleteTexture(this.atlasTexture),null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),super.kill()}}return new c(e,t,n)}var dn=`#version 300 es
precision highp float;

in float v_edgeDist;

// R32F target: only the .r channel is stored.
out vec4 fragColor;

void main() {
  fragColor = vec4(v_edgeDist, 0.0, 0.0, 0.0);
}
`;function fn(e,t,n){let r=S(e),i=C(e).map(e=>`uniform ${e.type} ${e.name};`).join(`
`),{code:a,multiShape:o}=de(e,n),s=Pt(e,t),c=Object.keys(s.specs).map(e=>`float v_${e};`).join(`
`),{fetchCode:l,varyingAssignments:u}=mt(s,{varPrefix:`nodeAttr`,baseTexelExpr:`nodeIdx * u_layerAttributeTexelsPerNode`,textureWidthUniform:`u_layerAttributeTextureWidth`,textureSamplerUniform:`u_layerAttributeTexture`});return`#version 300 es
precision highp float;

uniform float u_cameraAngle;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;
${i}

in float a_nodeIndex;     // node-data texture index (also the target frame texel)
in float a_positionMode;  // 0=right 1=left 2=above 3=below 4=over
in float a_labelAngle;    // intrinsic label angle (radians)

out float v_edgeDist;

// Shape attributes (plain globals: this pass is vertex-only)
${c}

${T}
${E}
${r}
${a}
${re}

void main() {
  int nodeIdx = int(a_nodeIndex);
${l}
${u}
  ${o?`// Multi-shape: the shape id lives in the node-data texture's .w channel:
  g_shapeId = int(readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).w);`:`// Single-shape mode, shape id not needed`}

  // Per-node rotation alignment (0 = viewport, 1 = graph).
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;

  // Effective angle: intrinsic (style-given) plus the camera angle when the label
  // is graph-aligned. The companions place the box at this same angle.
  float effectiveAngle = a_labelAngle - labelRotation * u_cameraAngle;

  // The "over" mode (4) sits on the node center, so it has no edge distance.
  float edgeDist = 0.0;
  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    // Rotate by the effective label angle. Inlined rather than via rotate2D()
    // because the shape SDFs (getShapeGLSLForShapes) already define that helper
    // for multi-shape programs, and redefining it would be a GLSL error.
    float ea_c = cos(effectiveAngle);
    float ea_s = sin(effectiveAngle);
    vec2 rotatedScreenDir = mat2(ea_c, -ea_s, ea_s, ea_c) * screenDir;
    // Screen (Y-down) -> SDF (Y-up).
    vec2 sdfDir = vec2(rotatedScreenDir.x, -rotatedScreenDir.y);
    // Counter-rotate into the shape's local frame for graph-aligned nodes, so the
    // boundary is queried against the shape's actual on-screen orientation.
    float nodeCa = -u_cameraAngle * nodeRotation;
    float nc = cos(nodeCa), ns = sin(nodeCa);
    sdfDir = mat2(nc, -ns, ns, nc) * sdfDir;
    edgeDist = findEdgeDistance(sdfDir, 1.0);
  }
  v_edgeDist = edgeDist;

  // Scatter to this node's texel center in the frame texture.
  float x = mod(a_nodeIndex, u_frameTextureWidth);
  float y = floor(a_nodeIndex / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`}var pn=class e{static{this.FLOATS_PER_POINT=3}constructor(t,n){this.uniformLocations={};let{shapes:r,layers:i,shapeGlobalIds:a}=n;if(r.length===0)throw Error(`NodeLabelFramePass: at least one shape must be provided`);this.gl=t,this.shapeUniforms=C(r),this.hasAttributeData=Object.keys(Pt(r,i).offsets).length>0,this.vertexShader=o(t,fn(r,i,a)),this.fragmentShader=s(t,dn),this.program=c(t,[this.vertexShader,this.fragmentShader]);let l=[`u_cameraAngle`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_frameTextureWidth`,`u_frameTextureHeight`,`u_layerAttributeTexture`,`u_layerAttributeTextureWidth`,`u_layerAttributeTexelsPerNode`,...this.shapeUniforms.map(e=>e.name)];for(let e of l)this.uniformLocations[e]=t.getUniformLocation(this.program,e);let u=e.FLOATS_PER_POINT*4;this.vao=t.createVertexArray(),this.buffer=t.createBuffer(),t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.buffer);for(let[e,n]of[[`a_nodeIndex`,0],[`a_positionMode`,4],[`a_labelAngle`,8]]){let r=t.getAttribLocation(this.program,e);r>=0&&(t.enableVertexAttribArray(r),t.vertexAttribPointer(r,1,t.FLOAT,!1,u,n))}t.bindVertexArray(null)}run(t,n,r,i,a){if(n===0)return;let{gl:o}=this;o.useProgram(this.program),o.bindVertexArray(this.vao),o.bindBuffer(o.ARRAY_BUFFER,this.buffer),o.bufferData(o.ARRAY_BUFFER,t.subarray(0,n*e.FLOATS_PER_POINT),o.DYNAMIC_DRAW);let s=this.uniformLocations;o.uniform1f(s.u_cameraAngle,i.cameraAngle),o.uniform1i(s.u_nodeDataTexture,i.nodeDataTextureUnit),o.uniform1i(s.u_nodeDataTextureWidth,i.nodeDataTextureWidth),o.uniform1f(s.u_frameTextureWidth,r.getTextureWidth()),o.uniform1f(s.u_frameTextureHeight,r.getTextureHeight()),this.hasAttributeData&&a&&(a.bind(5),s.u_layerAttributeTexture&&o.uniform1i(s.u_layerAttributeTexture,5),s.u_layerAttributeTextureWidth&&o.uniform1i(s.u_layerAttributeTextureWidth,a.getTextureWidth()),s.u_layerAttributeTexelsPerNode&&o.uniform1i(s.u_layerAttributeTexelsPerNode,a.getTexelsPerItem()));for(let e of this.shapeUniforms)ht(o,this.uniformLocations[e.name],e);r.bindAsRenderTarget(),o.disable(o.BLEND),o.disable(o.DEPTH_TEST),o.drawArrays(o.POINTS,0,n),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindVertexArray(null)}kill(){let{gl:e}=this;e.deleteProgram(this.program),e.deleteShader(this.vertexShader),e.deleteShader(this.fragmentShader),e.deleteBuffer(this.buffer),e.deleteVertexArray(this.vao)}};function mn(e,t,n,r,i){let{label:a={},shapes:o}=r;if(o.length===0)throw Error(`createNodeProgram: at least one shape must be provided in 'shapes'`);let s={},c=[],l;o.forEach((e,t)=>{let n=_(e);t===0&&(l=n),s[e.name]=t,c[t]=v(n)});let u=[...r.layers],d=zt({shapes:o,layers:u,shapeGlobalIds:o.length>1?c:void 0,antialias:i}),f=un(e,null,n,{label:a}),p=Gt(e,null,n,{shapes:o,layers:u,getAttributeTexture:()=>S.getAttributeTexture(),label:a,shapeGlobalIds:o.length>1?c:void 0}),m=Xt(e,t,n,{label:a}),h=r.labelAttachments&&Object.keys(r.labelAttachments).length>0?At(e,null,n,{label:a}):null,g=new pn(e,{shapes:o,layers:u,shapeGlobalIds:o.length>1?c:void 0}),y=Nt(o,u),b=j(y),x=class extends M{static{this.layerTextures=new WeakMap}static{this.textureRefCounts=new WeakMap}constructor(e,t,n){super(e,t,n),this.layerLifecycles=new Map,this.layersNeedingRegeneration=new Set,this.attrDescriptors=[],this._pickingBuffer=t;let r=x.layerTextures.get(e);r||(r=new ut(e,b),x.layerTextures.set(e,r)),this.layerAttributeTexture=r;let i=x.textureRefCounts.get(e)||0;x.textureRefCounts.set(e,i+1),this.packedAttributeData=new Float32Array(b.floatsPerItem),u.forEach((t,r)=>{if(t.lifecycle){let i={gl:e,renderer:{refresh:()=>n.refresh()},getUniformLocation:t=>e.getUniformLocation(this.normalProgram.program,t),requestShaderRegeneration:()=>{this.layersNeedingRegeneration.add(r)},requestRefresh:()=>{n.refresh()}},a=t.lifecycle(i);this.layerLifecycles.set(r,a)}}),this.layerLifecycles.forEach(e=>{e.init?.()});let a=new Map;this.layerLifecycles.forEach((e,t)=>{e.getAttributeData&&a.set(t,e)}),this.attrDescriptors=dt(y,b,a)}getDefinition(){let{FLOAT:e,TRIANGLE_STRIP:t}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:d.vertexShader,FRAGMENT_SHADER_SOURCE:d.fragmentShader,METHOD:t,UNIFORMS:d.uniforms,ATTRIBUTES:d.attributes,CONSTANT_ATTRIBUTES:[{name:`a_quadCorner`,size:2,type:e}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}maybeRegenerateShaders(){if(this.layersNeedingRegeneration.size===0)return;u=u.map((e,t)=>{if(this.layersNeedingRegeneration.has(t)){let n=this.layerLifecycles.get(t);if(n?.regenerate)return{...n.regenerate(),lifecycle:e.lifecycle}}return e}),this.layersNeedingRegeneration.clear(),d=zt({shapes:o,layers:u,shapeGlobalIds:o.length>1?c:void 0,antialias:this.renderer.getSetting(`antialiasNodes`)});let e=this.normalProgram.gl,{program:t,buffer:n,vertexShader:r,fragmentShader:i}=this.normalProgram;e.deleteProgram(t),e.deleteBuffer(n),e.deleteShader(r),e.deleteShader(i),this.normalProgram=this.getProgramInfo(`normal`,e,d.vertexShader,d.fragmentShader,this._pickingBuffer)}getAttributeTexture(){return this.layerAttributeTexture}uploadLayerTexture(){this.layerAttributeTexture.upload()}process(e,t,n,r){let i=t*this.STRIDE;if(n.visibility===`hidden`){for(let e=i+this.STRIDE;i<e;i++)this.floats[i]=0;this.floats[t*this.STRIDE]=-1}else this.processVisibleItem(Le(e),i,n,r)}processVisibleItem(e,t,n,r){let{floats:i,ints:a}=this;if(i[t++]=r,a[t++]=e,i[t++]=n.opacity??1,b.floatsPerItem===0)return;let o=this.packedAttributeData;ft(this.attrDescriptors,n,o,n.color,this.layerLifecycles,0),this.layerAttributeTexture.updateAllAttributesAtRow(r,o)}setUniforms(e,t){let{gl:n,uniformLocations:r}=t;r.u_matrix&&n.uniformMatrix3fv(r.u_matrix,!1,e.matrix),r.u_sizeRatio&&n.uniform1f(r.u_sizeRatio,e.sizeRatio),r.u_correctionRatio&&n.uniform1f(r.u_correctionRatio,e.correctionRatio),r.u_pickingPadding&&n.uniform1f(r.u_pickingPadding,e.nodePickingPadding),r.u_cameraAngle&&n.uniform1f(r.u_cameraAngle,e.cameraAngle),r.u_nodeDataTexture&&n.uniform1i(r.u_nodeDataTexture,e.nodeDataTextureUnit),r.u_nodeDataTextureWidth&&n.uniform1i(r.u_nodeDataTextureWidth,e.nodeDataTextureWidth),r.u_layerAttributeTexture&&(this.layerAttributeTexture.bind(5),n.uniform1i(r.u_layerAttributeTexture,5)),r.u_layerAttributeTextureWidth&&n.uniform1i(r.u_layerAttributeTextureWidth,this.layerAttributeTexture.getTextureWidth()),r.u_layerAttributeTexelsPerNode&&n.uniform1i(r.u_layerAttributeTexelsPerNode,this.layerAttributeTexture.getTexelsPerItem()),o.forEach(e=>{e.uniforms.forEach(e=>{this.setTypedUniform(e,t)})}),u.forEach(e=>{e.uniforms.forEach(e=>{this.setTypedUniform(e,t)})})}render(e,t,n){this.maybeRegenerateShaders(),super.render(e,t,n)}renderProgram(e,t){let{gl:n,program:r}=t;n.useProgram(r),t===this.normalProgram&&this.layerLifecycles.forEach(e=>{e.beforeRender?.()}),super.renderProgram(e,t)}kill(){this.layerLifecycles.forEach(e=>{e.kill?.()}),this.layerLifecycles.clear();let e=this.normalProgram.gl,t=(x.textureRefCounts.get(e)||1)-1;t<=0?(this.layerAttributeTexture.kill(),x.layerTextures.delete(e),x.textureRefCounts.delete(e)):x.textureRefCounts.set(e,t),super.kill()}},S=new x(e,null,n);return{nodeProgram:S,labelProgram:f,backdropProgram:p,labelBackgroundProgram:m,attachmentProgram:h,framePass:g,shapeSlug:l,shapeNameToIndex:o.length>1?s:void 0,shapeGlobalIds:o.length>1?c:void 0}}function P(e){return typeof e==`object`&&!!e&&`attribute`in e}function hn(){return{name:`circle`,glsl:`
float sdf_circle(vec2 uv, float size) {
  return length(uv) - size;
}
`,uniforms:[]}}function gn(e){let{UNSIGNED_BYTE:t}=WebGL2RenderingContext,n=e?.color??{attribute:`color`};return P(n)?{name:`fill`,uniforms:[],attributes:[{name:`fillColor`,size:4,type:t,normalized:!0,source:n.attribute}],glsl:`
vec4 layer_fill(vec4 v_fillColor) {
  return v_fillColor;
}
`}:{name:`fill`,uniforms:[],attributes:[],glsl:`
vec4 layer_fill() {
  return ${Be(n)};
}
`}}function _n(e){let{offsets:t,specs:n,floatsPerItem:r}=e,i=Object.keys(t);if(i.length===0||r===0)return{uniformDeclarations:``,uniformNames:[],vertexVaryingDeclarations:``,fragmentVaryingDeclarations:``,fetchCode:``,varyingAssignments:``};let a=[`u_edgeAttributeTexture`,`u_edgeAttributeTextureWidth`,`u_edgeAttributeTexelsPerEdge`],o=i.map(e=>`${n[e].size===1?`float`:`vec${n[e].size}`} v_${e};`),s=o.map(e=>`out ${e}`).join(`
`),c=o.map(e=>`in ${e}`).join(`
`),{fetchCode:l,varyingAssignments:u}=mt(e,{varPrefix:`attr`,baseTexelExpr:`edgeIdx * u_edgeAttributeTexelsPerEdge`,textureWidthUniform:`u_edgeAttributeTextureWidth`,textureSamplerUniform:`u_edgeAttributeTexture`});return{uniformDeclarations:`
uniform sampler2D u_edgeAttributeTexture;
uniform int u_edgeAttributeTextureWidth;
uniform int u_edgeAttributeTexelsPerEdge;`,uniformNames:a,vertexVaryingDeclarations:s,fragmentVaryingDeclarations:c,fetchCode:l,varyingAssignments:u}}function vn(e){return`
float findSourceClampT_${e}(vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  float lo = 0.0, hi = 0.5;
  float nodeExtent = sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // Counter-rotate the query point so viewport-aligned nodes (rotateAlign=0) are
  // clamped against their on-screen orientation; graph-aligned nodes skip it.
  float ca = u_cameraAngle * (1.0 - sourceRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_${e}_position(mid, source, target);
    vec2 localPos = rot * ((pos - source) / nodeExtent);
    float sdf = querySDF(sourceShapeId, localPos, effectiveSize);
    if (sdf < 0.0) lo = mid;
    else hi = mid;
  }

  float pathLen = path_${e}_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 + marginT;
}
`}function yn(e){return`
float findTargetClampT_${e}(vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  float lo = 0.5, hi = 1.0;
  float nodeExtent = targetSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // See findSourceClampT_ for the rotation rationale.
  float ca = u_cameraAngle * (1.0 - targetRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_${e}_position(mid, source, target);
    vec2 localPos = rot * ((pos - target) / nodeExtent);
    float sdf = querySDF(targetShapeId, localPos, effectiveSize);
    if (sdf < 0.0) hi = mid;
    else lo = mid;
  }

  float pathLen = path_${e}_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 - marginT;
}
`}function bn(e){return`
// Auto-generated numerical tangent (from position via finite differences)
vec2 path_${e}_tangent(float t, vec2 source, vec2 target) {
  float epsilon = 0.001;
  float t1 = max(0.0, t - epsilon);
  float t2 = min(1.0, t + epsilon);
  vec2 p1 = path_${e}_position(t1, source, target);
  vec2 p2 = path_${e}_position(t2, source, target);
  return normalize(p2 - p1);
}

// Auto-generated normal (perpendicular to tangent)
vec2 path_${e}_normal(float t, vec2 source, vec2 target) {
  vec2 tangent = path_${e}_tangent(t, source, target);
  return vec2(-tangent.y, tangent.x);
}
`}function xn(e){return`
// Rotate a 2D vector by angle (counter-clockwise)
vec2 ${e}_rotate(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}
`}function Sn(e){return`
// Auto-generated path length (samples position 16 times)
float path_${e}_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_${e}_position(0.0, source, target);
  for (int i = 1; i <= 16; i++) {
    float t = float(i) / 16.0;
    vec2 curr = path_${e}_position(t, source, target);
    len += length(curr - prev);
    prev = curr;
  }
  return len;
}
`}function Cn(e){return`
// Auto-generated closest_t (coarse sample + ternary search)
float path_${e}_closest_t(vec2 p, vec2 source, vec2 target) {
  // Coarse search: find best among 10 samples
  float bestT = 0.0;
  float bestDist = 1e10;
  for (int i = 0; i <= 10; i++) {
    float t = float(i) / 10.0;
    vec2 pos = path_${e}_position(t, source, target);
    float d = length(p - pos);
    if (d < bestDist) {
      bestDist = d;
      bestT = t;
    }
  }

  // Refine with ternary search
  float lo = max(0.0, bestT - 0.1);
  float hi = min(1.0, bestT + 0.1);
  for (int i = 0; i < 10; i++) {
    float mid1 = lo + (hi - lo) / 3.0;
    float mid2 = hi - (hi - lo) / 3.0;
    float d1 = length(p - path_${e}_position(mid1, source, target));
    float d2 = length(p - path_${e}_position(mid2, source, target));
    if (d1 < d2) {
      hi = mid2;
    } else {
      lo = mid1;
    }
  }
  return (lo + hi) * 0.5;
}
`}function wn(e){return`
// Auto-generated signed distance (via closest_t + normal)
float path_${e}_distance(vec2 p, vec2 source, vec2 target) {
  float closestT = path_${e}_closest_t(p, source, target);
  vec2 closest = path_${e}_position(closestT, source, target);
  vec2 diff = p - closest;
  float dist = length(diff);
  if (dist < 0.0001) return 0.0;

  // Get normal at closest point
  vec2 normal = path_${e}_normal(closestT, source, target);
  return dist * sign(dot(diff, normal));
}
`}function Tn(e){return`
// Auto-generated t_at_distance (binary search)
float path_${e}_t_at_distance(float targetDist, vec2 source, vec2 target) {
  if (targetDist <= 0.0) return 0.0;

  float totalLen = path_${e}_length(source, target);
  if (targetDist >= totalLen) return 1.0;

  // Binary search for t
  float lo = 0.0, hi = 1.0;
  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;

    // Compute arc length from 0 to mid
    float arcLen = 0.0;
    vec2 prev = path_${e}_position(0.0, source, target);
    for (int j = 1; j <= 8; j++) {
      float t = mid * float(j) / 8.0;
      vec2 curr = path_${e}_position(t, source, target);
      arcLen += length(curr - prev);
      prev = curr;
    }

    if (arcLen < targetDist) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}
`}function En(e,t){return RegExp(`\\b(float|vec[234]|void|int|bool)\\s+${t}\\s*\\(`).test(e)}function Dn(e,t){let n=[];return En(t,`path_${e}_length`)||n.push(Sn(e)),En(t,`path_${e}_closest_t`)||n.push(Cn(e)),En(t,`path_${e}_distance`)||n.push(wn(e)),En(t,`path_${e}_t_at_distance`)||n.push(Tn(e)),n.length>0?`
// ============================================================================
// Auto-generated fallback functions (path only provided position)
// ============================================================================
${n.join(`
`)}`:``}function On(e){let{paths:t,layers:n}=e,r=e.extremities??[];if(t.length===0)throw Error(`At least one path is required in 'paths'`);if(n.length===0)throw Error(`At least one layer is required in 'layers'`);let i=e.defaultHead??`none`,a=e.defaultTail??`none`;return{paths:t,extremities:r,layers:n,path:t[0],layer:n[0],defaultHead:i,defaultTail:a}}var{FLOAT:kn,UNSIGNED_BYTE:An}=WebGL2RenderingContext;function jn(e,t,n){let r=new Set(new Set([`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_zoomRatio`,`u_pixelRatio`,`u_cameraAngle`,`u_minEdgeThickness`,`u_pickingPadding`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_edgeDataTexture`,`u_edgeDataTextureWidth`,`u_edgeFrameTexture`,`u_edgeFrameTextureWidth`,`u_edgeAttributeTexture`,`u_edgeAttributeTextureWidth`,`u_edgeAttributeTexelsPerEdge`]));return e.forEach(e=>e.uniforms.forEach(e=>r.add(e.name))),t.forEach(e=>e.uniforms.forEach(e=>r.add(e.name))),n.forEach(e=>e.uniforms.forEach(e=>r.add(e.name))),Array.from(r)}function Mn(e){let t=new Set,n=[];for(let r of e)t.has(r.name)||(t.add(r.name),n.push(`// Path: ${r.name}`),n.push(r.glsl),n.push(bn(r.name)),n.push(Dn(r.name,r.glsl)));return n.join(`

`)}function Nn(e){let t=[];for(let n of e)t.push(`// Extremity: ${n.name}`),t.push(n.glsl);return t.join(`

`)}var Pn=[{queryName:`queryPathPosition`,pathFunc:`position`,returnType:`vec2`,params:`float t, vec2 source, vec2 target`,args:`t, source, target`},{queryName:`queryPathTangent`,pathFunc:`tangent`,returnType:`vec2`,params:`float t, vec2 source, vec2 target`,args:`t, source, target`},{queryName:`queryPathNormal`,pathFunc:`normal`,returnType:`vec2`,params:`float t, vec2 source, vec2 target`,args:`t, source, target`},{queryName:`queryPathLength`,pathFunc:`length`,returnType:`float`,params:`vec2 source, vec2 target`,args:`source, target`},{queryName:`queryPathClosestT`,pathFunc:`closest_t`,returnType:`float`,params:`vec2 p, vec2 source, vec2 target`,args:`p, source, target`}];function Fn(e,t){let{queryName:n,pathFunc:r,returnType:i,params:a,args:o}=t;return e.length===1?`${i} ${n}(int pathId, ${a}) {
  return path_${e[0].name}_${r}(${o});
}`:`${i} ${n}(int pathId, ${a}) {
  switch (pathId) {
${e.map((e,t)=>`    case ${t}: return path_${e.name}_${r}(${o});`).join(`
`)}
    default: return path_${e[0].name}_${r}(${o});
  }
}`}function In(e){return Pn.map(t=>Fn(e,t)).join(`

`)}function Ln(e){return e.length===1?`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  return extremity_${e[0].name}(uv, lengthRatio, widthRatio);
}`:`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  switch (extremityId) {
${e.map((e,t)=>`    case ${t}: return extremity_${e.name}(uv, lengthRatio, widthRatio);`).join(`
`)}
    default: return extremity_${e[0].name}(uv, lengthRatio, widthRatio);
  }
}`}function Rn(e){let t=[];for(let n of e)t.push(vn(n.name)),t.push(yn(n.name));if(e.length===1)t.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  return findSourceClampT_${e[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  return findTargetClampT_${e[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
}`);else{let n=e.map((e,t)=>`    case ${t}: return findSourceClampT_${e.name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);`).join(`
`),r=e.map((e,t)=>`    case ${t}: return findTargetClampT_${e.name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);`).join(`
`);t.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  switch (pathId) {
${n}
    default: return findSourceClampT_${e[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
  }
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  switch (pathId) {
${r}
    default: return findTargetClampT_${e[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
  }
}`)}return t.join(`

`)}function zn(e,t,n,r,i){let a=_n(j([...e,...n])),o=Pt(r,i),s=Object.keys(o.offsets),c=e=>{let{size:t}=o.specs[e];return t===1?`float`:`vec${t}`},l=s.map(e=>`${c(e)} v_source_${e};\n${c(e)} v_target_${e};`).join(`
`),d=mt(o,{varPrefix:`srcNodeAttr`,baseTexelExpr:`srcIdx * u_layerAttributeTexelsPerNode`,textureWidthUniform:`u_layerAttributeTextureWidth`,textureSamplerUniform:`u_layerAttributeTexture`,outputPrefix:`v_source_`}),f=mt(o,{varPrefix:`tgtNodeAttr`,baseTexelExpr:`tgtIdx * u_layerAttributeTexelsPerNode`,textureWidthUniform:`u_layerAttributeTextureWidth`,textureSamplerUniform:`u_layerAttributeTexture`,outputPrefix:`v_target_`}),p=s.map(e=>`${c(e)} g_${e};`).join(`
`),m=s.map(e=>`  g_${e} = v_source_${e};`).join(`
`),h=s.map(e=>`  g_${e} = v_target_${e};`).join(`
`),g=new Set,_=[],v=e=>{g.has(e.name)||(g.add(e.name),_.push(`uniform ${e.type} ${e.name};`))};e.forEach(e=>e.uniforms.forEach(v)),t.forEach(e=>e.uniforms.forEach(v));let y=t.map(e=>u(e.widthFactor)).join(`, `),S=Math.max(...e.map(e=>e.minBodyLengthRatio||0));return`#version 300 es

// Node and edge data textures
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;

// Edge attribute texture (for path-specific attributes like curvature)
${a.uniformDeclarations}

// Node attribute texture (for node shape attributes)
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

// Render params needed for clamping
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;

// Edge-frame texture dimensions, for scattering each point to its texel
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;

// Custom path/extremity uniforms
${_.join(`
`)}

// Path attribute varyings — assigned so path functions can read them as globals
${a.vertexVaryingDeclarations}

// Node size varyings — read by path functions like loop
out float v_sourceNodeSize;
out float v_targetNodeSize;

// Node shape attributes per endpoint, and the ones querySDF reads
${l}
${p}

// Scattered output written to the edge-frame texel: [tStart, tEnd, straightenFactor, pathLength]
out vec4 v_clamp;

// Extremity width factor array (needed for extremityScale computation)
const float EXTREMITY_WIDTH_FACTORS[${t.length}] = float[](${y});

// Node-data fetch helpers (geometry texel + rotation-flags texel)
${T}
${E}

// Shape SDFs for node boundary clamping
${b()}
${x(new Set(s))}

// Path functions
${Mn(e)}
${In(e)}
${Rn(e)}

void main() {
  // One point per edge-data row; the row index is the edge-frame texel target.
  int edgeIdx = gl_VertexID;
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes and assign to path-function globals
${a.fetchCode}
${a.varyingAssignments}

  // Fetch node shape attributes for both endpoints
${d.fetchCode}
${d.varyingAssignments}
${f.fetchCode}
${f.varyingAssignments}

  // Fetch node geometry (texel 0) and rotation flags (texel 1).
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
  float a_sourceSize = srcNodeData.z;
  float a_targetSize = tgtNodeData.z;
  float a_sourceShapeId = srcNodeData.w;
  float a_targetShapeId = tgtNodeData.w;
  // Per-node rotation alignment (0 = viewport, 1 = graph), for boundary clamping.
  float a_sourceRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx).r;
  float a_targetRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx).r;

  v_sourceNodeSize = a_sourceSize;
  v_targetNodeSize = a_targetSize;

  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = ${u(S)};

  // Thickness in WebGL units (needed to compute clamping margin and extremity lengths)
  float pixelsThickness = max(a_thickness, u_minEdgeThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // SDF clamping: find where the edge body meets the node boundaries. Always
  // searched (ungated) so labels get a true boundary clamp; the body re-applies
  // its extremity gating in-shader.
${m}
  float tStart = queryFindSourceClampT(pathId, a_source, a_sourceSize, int(a_sourceShapeId), a_sourceRotateAlign, a_target, 0.0);
${h}
  float tEnd = queryFindTargetClampT(pathId, a_source, a_target, a_targetSize, int(a_targetShapeId), a_targetRotateAlign, 0.0);

  // straightenFactor (frame .z) is consumed only by the body, which runs to the
  // node center when an extremity is absent. Derive the straightening math from
  // these gated clamps — not the ungated boundary ones above — so it matches the
  // geometry it drives. The ungated tStart/tEnd remain what labels read.
  float bodyTStart = tailLengthRatio > 0.0 ? tStart : 0.0;
  float bodyTEnd = headLengthRatio > 0.0 ? tEnd : 1.0;

  // Path length and zone boundaries (needed for straightening check)
  float pathLength = queryPathLength(pathId, a_source, a_target);
  float visibleLength = pathLength * (bodyTEnd - bodyTStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  float tTailEnd = bodyTStart + tailLengthT;
  float tHeadStart = bodyTEnd - headLengthT;
  if (tTailEnd > tHeadStart) {
    float mid = (bodyTStart + bodyTEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Straighten factor: blend toward straight line when path twists in extremity zones
  float straightenFactor = 0.0;
  {
    float maxDeviation = 0.0;
    if (tailLengthT > 0.0001) {
      vec2 tailTang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
      vec2 tailChord = queryPathPosition(pathId, bodyTStart, a_source, a_target)
                     - queryPathPosition(pathId, tTailEnd, a_source, a_target);
      float tailChordLen = length(tailChord);
      if (tailChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(-tailTang, tailChord / tailChordLen));
      }
    }
    if (headLengthT > 0.0001) {
      vec2 headTang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
      vec2 headChord = queryPathPosition(pathId, bodyTEnd, a_source, a_target)
                     - queryPathPosition(pathId, tHeadStart, a_source, a_target);
      float headChordLen = length(headChord);
      if (headChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(headTang, headChord / headChordLen));
      }
    }
    straightenFactor = smoothstep(0.035, 0.5, maxDeviation);
  }

  // When straightening, blend the ungated tStart/tEnd (the label-facing clamps)
  // toward straight-line clamp positions.
  if (straightenFactor > 0.001) {
    if (tailLengthRatio > 0.0) {
${m}
      float srcExtent = a_sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
      float srcEffective = 1.0 - u_correctionRatio / srcExtent;
      float srcCa = u_cameraAngle * (1.0 - a_sourceRotateAlign);
      mat2 srcRot = mat2(cos(srcCa), -sin(srcCa), sin(srcCa), cos(srcCa));
      float lo = 0.0, hi = 0.5;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = srcRot * ((pos - a_source) / srcExtent);
        float sdf = querySDF(int(a_sourceShapeId), localPos, srcEffective);
        if (sdf < 0.0) lo = mid; else hi = mid;
      }
      tStart = mix(tStart, (lo + hi) * 0.5, straightenFactor);
    }
    if (headLengthRatio > 0.0) {
${h}
      float tgtExtent = a_targetSize * u_correctionRatio / u_sizeRatio * 2.0;
      float tgtEffective = 1.0 - u_correctionRatio / tgtExtent;
      float tgtCa = u_cameraAngle * (1.0 - a_targetRotateAlign);
      mat2 tgtRot = mat2(cos(tgtCa), -sin(tgtCa), sin(tgtCa), cos(tgtCa));
      float lo = 0.5, hi = 1.0;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = tgtRot * ((pos - a_target) / tgtExtent);
        float sdf = querySDF(int(a_targetShapeId), localPos, tgtEffective);
        if (sdf < 0.0) hi = mid; else lo = mid;
      }
      tEnd = mix(tEnd, (lo + hi) * 0.5, straightenFactor);
    }
  }

  v_clamp = vec4(tStart, tEnd, straightenFactor, pathLength);

  // Scatter this point to its edge's texel center in the frame texture.
  float x = mod(float(edgeIdx), u_frameTextureWidth);
  float y = floor(float(edgeIdx) / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`}var Bn=0,Vn=1,Hn=2;function Un(e,t,n){let r=[];n&&(r.push([Bn,0,-1],[Bn,0,1]),r.push([Bn,1,-1],[Bn,1,1]));for(let t=0;t<=e;t++){let n=t/e;r.push([Vn,n,-1],[Vn,n,1])}return t&&(r.push([Hn,0,-1],[Hn,0,1]),r.push([Hn,1,-1],[Hn,1,1])),{data:r,attributes:[{name:`a_zone`,size:1,type:kn},{name:`a_zoneT`,size:1,type:kn},{name:`a_side`,size:1,type:kn}],verticesPerEdge:r.length}}function Wn(e,t,n,r){let i=_n(j([...e,...n])),a=new Set([`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_zoomRatio`,`u_pixelRatio`,`u_cameraAngle`,`u_minEdgeThickness`,`u_pickingPadding`,`u_nodeDataTexture`]),o=new Set,s=[],c=e=>{!a.has(e.name)&&!o.has(e.name)&&(o.add(e.name),s.push(`uniform ${e.type} ${e.name};`))};e.forEach(e=>e.uniforms.forEach(c)),t.forEach(e=>e.uniforms.forEach(c)),n.forEach(e=>e.uniforms.forEach(c));let l=r.map(e=>`in ${e.size===1?`float`:`vec${e.size}`} ${e.name};`).join(`
`),d=t.map(e=>u(e.widthFactor)).join(`, `),f=Math.max(...e.map(e=>e.minBodyLengthRatio||0)),p=n.some(e=>e.needsNodeColors),m=e.some(e=>e.needsNodeSize);return`#version 300 es

// Constant attributes (per vertex)
${l}

// Per-edge attributes
// Edge data (source/target indices, thickness, extremity ratios, path/extremity IDs)
// is fetched from edge data texture via edge index
in float a_edgeIndex;   // Index into edge data texture
in vec4 a_color;        // Edge color
in vec4 a_id;           // Edge ID for picking
in float a_opacity;     // Edge opacity

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture;
uniform int u_edgeFrameTextureWidth;

// Edge path attribute texture uniforms
${i.uniformDeclarations}

// Custom uniforms
${s.join(`
`)}

// Standard varyings
out vec4 v_color;
out float v_opacity;
out vec4 v_id;
out float v_thickness;       // Edge body thickness (in consistent units)
out float v_t;
out float v_tStart;
out float v_tEnd;
out float v_side;
out float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
out vec2 v_source;
out vec2 v_target;
out float v_edgeLength;
${m?`
out float v_sourceNodeSize;  // Source node size (mirrored in labels/generator.ts as plain float)
out float v_targetNodeSize;  // Target node size (mirrored in labels/generator.ts as plain float)`:``}
${p?`
out vec4 v_sourceColor;
out vec4 v_targetColor;`:``}
// Zone varyings
out float v_zone;            // 0=tail, 1=body, 2=head
out float v_zoneT;           // Position within zone [0,1]
out float v_headLengthRatio; // Head length as ratio of thickness
out float v_tailLengthRatio; // Tail length as ratio of thickness
out float v_headWidthRatio;  // Head width factor
out float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat out int v_pathId;
flat out int v_headId;
flat out int v_tailId;

// Path/layer attribute varyings (fetched from edge attribute texture)
${i.vertexVaryingDeclarations}

const float bias = 255.0 / 254.0;

// Width factor array for extremities (shared pool for head/tail)
const float EXTREMITY_WIDTH_FACTORS[${t.length}] = float[](${d});

// All path functions
${Mn(e)}

// Path selector functions
${In(e)}

// Node-data fetch helper (geometry texel of the two-texel node stride)
${T}
${p?le:``}
// Per-edge clamp from the frame-pass (tStart, tEnd, straightenFactor, pathLength)
${ue}

void main() {
  // Fetch edge data from edge texture (2 texels per edge)
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, (headId << 4) | tailId
  int edgeIdx = int(a_edgeIndex);

  // Hidden edges are flagged with a negative row by EdgeProgram.process(). Push
  // the whole primitive outside the clip volume: every vertex lands at the same
  // out-of-range position, so it is fully clipped and rasterizes nothing —
  // neither to the frame buffer nor to the picking buffer.
  if (edgeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    return;
  }

  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  // edgeData0.w is now reserved (curvature moved to path attribute texture)
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes from edge attribute texture
${i.fetchCode}

  // Assign path/layer attribute varyings
${i.varyingAssignments}

  // Fetch source and target node geometry (texel 0 of the two-texel node stride)
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
${m?`
  // Assign node size varyings early (path functions like loops need them during clamping)
  v_sourceNodeSize = srcNodeData.z;
  v_targetNodeSize = tgtNodeData.z;`:``}
${p?`
  v_sourceColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  v_targetColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);`:``}

  // Convert thickness to WebGL units
  float minThickness = u_minEdgeThickness;
  float pixelsThickness = max(a_thickness, minThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Extremity parameters from ID lookups (shared pool)
  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = ${u(f)};

  // Per-edge values from the frame-pass texture (read by edge index).
  // tStart/tEnd are the ungated boundary clamps: re-apply the body's extremity
  // gating here (no extremity → body runs to the node center, 0/1).
  vec4 frameClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  float tStart           = a_tailLengthRatio > 0.0 ? frameClamp.x : 0.0;
  float tEnd             = a_headLengthRatio > 0.0 ? frameClamp.y : 1.0;
  float straightenFactor = frameClamp.z;
  float pathLength       = frameClamp.w;

  // Anti-aliasing width (~1 pixel, normalized by thickness)
  float antialiasingWidth = u_correctionRatio / webGLThickness;

  float visibleLength = pathLength * (tEnd - tStart);

  // Compute extremity lengths in world units
  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  // Handle short edges: scale down extremities if needed
  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  // Convert lengths to t-values
  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  // Zone boundaries in t-space
  float tTailEnd = tStart + tailLengthT;
  float tHeadStart = tEnd - headLengthT;

  // Ensure body has non-negative length
  if (tTailEnd > tHeadStart) {
    float mid = (tStart + tEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Convert to webGL units for geometry expansion
  float aaWidthWebGL = antialiasingWidth * webGLThickness;

  // Extra geometry width for picking padding (0 in visual mode)
  #ifdef PICKING_MODE
    float pickingPaddingWebGL = u_pickingPadding * u_correctionRatio;
  #else
    float pickingPaddingWebGL = 0.0;
  #endif

  // Straight-line direction and normal (for blending when straightenFactor > 0)
  vec2 straightDir = length(a_target - a_source) > 0.0001
    ? normalize(a_target - a_source) : vec2(1.0, 0.0);
  vec2 straightNormal = vec2(-straightDir.y, straightDir.x);

  // Zone-based vertex processing using path selectors
  vec2 position;
  vec2 normal;
  float t;
  float zone = a_zone;
  float zoneT = a_zoneT;
  float side = a_side;

  // Scaled extremity width factors (geometry must be at least as wide as body)
  float scaledTailWidth = max(tailWidthFactor * extremityScale, 1.0);
  float scaledHeadWidth = max(headWidthFactor * extremityScale, 1.0);

  if (zone < 0.5) {
    // TAIL ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tStart, a_source, a_target),
                         queryPathPosition(pathId, tTailEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tStart, tTailEnd, zoneT);

  } else if (zone < 1.5) {
    // BODY ZONE: follows path curvature with width = 1.0
    t = mix(tTailEnd, tHeadStart, zoneT);
    normal = queryPathNormal(pathId, t, a_source, a_target);
    float halfWidth = webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = queryPathPosition(pathId, t, a_source, a_target) + normal * side * halfWidth;

  } else {
    // HEAD ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tHeadStart, a_source, a_target),
                         queryPathPosition(pathId, tEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tHeadStart, tEnd, zoneT);
  }

  // Blend toward straight line based on path twist in extremity zones
  if (straightenFactor > 0.001) {
    float zoneWidth = zone < 0.5 ? webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      zone < 1.5 ? webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    vec2 straightPos = mix(a_source, a_target, t) + straightNormal * side * zoneWidth;
    position = mix(position, straightPos, straightenFactor);
  }

  gl_Position = vec4((u_matrix * vec3(position, 1.0)).xy, 0.0, 1.0);

  // Pass varyings to fragment shader
  v_color = a_color;
  v_color.a *= bias;
  v_opacity = a_opacity;
  v_id = a_id;
  v_thickness = webGLThickness;
  v_t = t;
  v_tStart = tStart;
  v_tEnd = tEnd;
  v_side = side;
  v_antialiasingWidth = antialiasingWidth;
  v_source = a_source;
  v_target = a_target;
  v_edgeLength = pathLength;

  // Zone varyings
  v_zone = zone;
  v_zoneT = zoneT;
  v_headLengthRatio = headLengthRatio * extremityScale;
  v_tailLengthRatio = tailLengthRatio * extremityScale;
  // Scale extremity width proportionally with length when crushed
  v_headWidthRatio = headWidthFactor * extremityScale;
  v_tailWidthRatio = tailWidthFactor * extremityScale;

  // Multi-path varyings
  v_pathId = pathId;
  v_headId = headId;
  v_tailId = tailId;
}
`}function Gn(e,t,n,r){let i=_n(j([...e,...n])),a=new Set([`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_zoomRatio`,`u_pixelRatio`,`u_cameraAngle`,`u_minEdgeThickness`,`u_pickingPadding`]),o=new Set,s=[],c=e=>{!a.has(e.name)&&!o.has(e.name)&&(o.add(e.name),s.push(`uniform ${e.type} ${e.name};`))};e.forEach(e=>e.uniforms.forEach(c)),t.forEach(e=>e.uniforms.forEach(c)),n.forEach(e=>e.uniforms.forEach(c));let l=t.map(e=>u(e.baseRatio??.5)).join(`, `),d=e=>t.length>1?`EXTREMITY_BASE_RATIOS[${e}]`:u(t[0]?.baseRatio??.5),f=t.some(e=>P(e.length)?!0:e.length>0),p=n.some(e=>e.needsNodeColors),m=e.some(e=>e.needsNodeSize),h=n.map((e,t)=>`  // Layer ${t+1}: ${e.name}
  color = blendOver(color, layer_${e.name}(context));`).join(`

`);return`#version 300 es
precision highp float;

// Standard varyings
in vec4 v_color;
in float v_opacity;
in vec4 v_id;
in float v_thickness;       // Edge body thickness
in float v_t;
in float v_tStart;
in float v_tEnd;
in float v_side;
in float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
in vec2 v_source;
in vec2 v_target;
in float v_edgeLength;
${m?`
in float v_sourceNodeSize;   // Source node size (mirrored in labels/generator.ts as plain float)
in float v_targetNodeSize;   // Target node size (mirrored in labels/generator.ts as plain float)`:``}
${p?`
in vec4 v_sourceColor;
in vec4 v_targetColor;`:``}
// Zone varyings
in float v_zone;            // 0=tail, 1=body, 2=head
in float v_zoneT;           // Position within zone [0,1]
in float v_headLengthRatio; // Head length as ratio of thickness (scaled for short edges)
in float v_tailLengthRatio; // Tail length as ratio of thickness (scaled for short edges)
in float v_headWidthRatio;  // Head width factor
in float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat in int v_pathId;
flat in int v_headId;
flat in int v_tailId;

// Path/layer attribute varyings (from vertex shader texture fetch)
${i.fragmentVaryingDeclarations}

// Standard uniforms (needed by some path types)
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Custom uniforms
${s.join(`
`)}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

${t.length>1?`// Base ratio array for extremities (shared pool for head/tail)
const float EXTREMITY_BASE_RATIOS[${t.length}] = float[](${l});`:``}

// EdgeContext struct
struct EdgeContext {
  float t;                   // Position along path [0, 1]
  float sdf;                 // Signed distance from centerline
  vec2 position;             // World position
  vec2 tangent;              // Path tangent
  vec2 normal;               // Path normal
  float thickness;           // Edge thickness
  float aaWidth;             // Anti-aliasing width
  float edgeLength;          // Total path length
  float tStart;              // Clamped start t
  float tEnd;                // Clamped end t
  float distanceFromSource;  // Arc distance from source
  float distanceToTarget;    // Arc distance to target
};

EdgeContext context;

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// All path functions
${Mn(e)}

// Path selector functions
${In(e)}

// All extremity functions
${Nn(t)}

// Extremity SDF selector (shared pool for head/tail)
${Ln(t)}

// Layer functions
${n.map(e=>e.glsl).join(`

`)}

// Helper: Compute arc length using path selector
float computeArcLengthMulti(int pathId, float t0, float t1, vec2 source, vec2 target, int samples) {
  float arcLen = 0.0;
  vec2 prev = queryPathPosition(pathId, t0, source, target);
  for (int i = 1; i <= samples; i++) {
    float t = t0 + (t1 - t0) * float(i) / float(samples);
    vec2 curr = queryPathPosition(pathId, t, source, target);
    arcLen += length(curr - prev);
    prev = curr;
  }
  return arcLen;
}

void main() {
  // Compute normalized t within visible edge (0 = start, 1 = end)
  float tNorm = (v_t - v_tStart) / max(v_tEnd - v_tStart, 0.0001);

  // Edge body half-thickness
  float halfThickness = v_thickness * 0.5;

  // Convert normalized AA width to webGL units (~1 pixel)
  float aaWidthWebGL = v_antialiasingWidth * v_thickness;

  // Distance from centerline based on v_side interpolation
  float zoneWidthFactor = v_zone < 0.5 ? v_tailWidthRatio :
                          v_zone < 1.5 ? 1.0 :
                          v_headWidthRatio;
  // In PICKING_MODE, inflate halfGeometryWidth to match the inflated vertex geometry
  #ifdef PICKING_MODE
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL + u_pickingPadding * aaWidthWebGL;
  #else
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL;
  #endif
  float distFromCenter = abs(v_side) * halfGeometryWidth;

  // Populate EdgeContext (for layer functions)
  context.t = tNorm;
  context.sdf = distFromCenter - halfThickness;
  context.position = queryPathPosition(v_pathId, v_t, v_source, v_target);
  context.tangent = queryPathTangent(v_pathId, v_t, v_source, v_target);
  context.normal = vec2(-context.tangent.y, context.tangent.x);
  context.thickness = v_thickness;
  context.aaWidth = aaWidthWebGL;
  context.edgeLength = v_edgeLength;
  context.tStart = v_tStart;
  context.tEnd = v_tEnd;

  // Compute arc distances
  float visibleLength = v_edgeLength * (v_tEnd - v_tStart);
  float pathT = v_t;
  float pathTNorm = tNorm;
${e.every(e=>e.linearParameterization)?`  // All paths have linear parameterization: t maps directly to arc distance
  context.distanceFromSource = pathTNorm * visibleLength;
  context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;`:e.every(e=>!e.linearParameterization)?`  // No paths have linear parameterization: use numerical integration
  context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
  context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);`:`  // Mixed parameterization: use analytical for linear paths, numerical for others
  if (${e.filter(e=>e.linearParameterization).map(t=>`v_pathId == ${e.indexOf(t)}`).join(` || `)}) {
    context.distanceFromSource = pathTNorm * visibleLength;
    context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;
  } else {
    context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
    context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);
  }`}

  // Compute SDF based on zone using extremity selector (shared pool)
  float bodySDF = distFromCenter - halfThickness;
  float finalSDF;

${f?`  // Base ratios, from baseRatioLookup
  float headBaseRatio = ${d(`v_headId`)};
  float tailBaseRatio = ${d(`v_tailId`)};

  if (v_zone < 0.5) {
    // TAIL ZONE: v_zoneT goes 0 (tip) to 1 (base)
    vec2 uv = vec2((1.0 - v_zoneT) * v_tailLengthRatio, v_side * v_tailWidthRatio * 0.5);
    float tailSDF = queryExtremitySDF(v_tailId, uv, v_tailLengthRatio, v_tailWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT > 1 - baseRatio)
    if (v_zoneT > 1.0 - tailBaseRatio) {
      finalSDF = min(tailSDF, bodySDF);
    } else {
      finalSDF = tailSDF;
    }
  } else if (v_zone < 1.5) {
    // BODY ZONE: distance from centerline
    finalSDF = bodySDF;
  } else {
    // HEAD ZONE: v_zoneT goes 0 (base) to 1 (tip)
    vec2 uv = vec2(v_zoneT * v_headLengthRatio, v_side * v_headWidthRatio * 0.5);
    float headSDF = queryExtremitySDF(v_headId, uv, v_headLengthRatio, v_headWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT < baseRatio)
    if (v_zoneT < headBaseRatio) {
      finalSDF = min(headSDF, bodySDF);
    } else {
      finalSDF = headSDF;
    }
  }`:`  // No extremity draws tail/head geometry, so every vertex is body zone.
  finalSDF = bodySDF;`}

  #ifdef PICKING_MODE
    // Picking pass: output edge ID for pixels within the picking area
    if (finalSDF > u_pickingPadding * aaWidthWebGL) discard;
    fragColor = v_id;
  #else
${r?`    // Visual pass: anti-aliased edge with layers, edge opacity applied once
    float alpha = smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) edge with layers, edge opacity applied once
    float alpha = (finalSDF < 0.0 ? 1.0 : 0.0) * v_opacity;`}
    if (alpha < 0.01) discard;

    // Apply layers sequentially with "over" compositing
    vec4 color = vec4(0.0);

${h}

    // Mix with transparent to fade both color AND alpha (pre-multiplied alpha for correct blending)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`}function Kn(e,t,n){let r=P(t.length)?!0:t.length>0,i=P(n.length)?!0:n.length>0;if(e.generateConstantData){let t=e.generateConstantData();return{data:t.data,attributes:t.attributes,verticesPerEdge:t.verticesPerEdge}}return Un(e.segments,r,i)}function qn(e){let{paths:t,extremities:n,layers:r}=On(e),i=e.antialias??!0,a=new Map,o=new Map,s=new Map;for(let e of t)for(let t of n)for(let r of n){let n=`${e.name}:${t.name}:${r.name}`,i=Kn(e,t,r);a.set(n,i.verticesPerEdge),o.set(n,i.data);for(let e of i.attributes)s.has(e.name)||s.set(e.name,e)}let c=Array.from(s.values()),l={};c.forEach((e,t)=>{l[e.name]=t});let u=0,d=``;for(let[e,t]of a)t>u&&(u=t,d=e);let f=o.get(d)||[],[p]=d.split(`:`),m=t.find(e=>e.name===p),h=[];h=m?.generateConstantData?m.generateConstantData().attributes:[{name:`a_zone`},{name:`a_zoneT`},{name:`a_side`}];let g=f.map(e=>{let t=Array(c.length).fill(0);return h.forEach((n,r)=>{let i=l[n.name];i!==void 0&&r<e.length&&(t[i]=e[r])}),t});return{vertexShader:Wn(t,n,r,c),fragmentShader:Gn(t,n,r,i),uniforms:jn(t,n,r),attributes:Jn(t,n,r),verticesPerEdge:u,constantData:g,constantAttributes:c,vertexCountsPerCombination:a,constantDataPerCombination:o}}function Jn(e,t,n){return[{name:`a_edgeIndex`,size:1,type:kn},{name:`a_color`,size:4,type:An,normalized:!0},{name:`a_id`,size:4,type:An,normalized:!0},{name:`a_opacity`,size:1,type:kn}]}var Yn=`#version 300 es
precision highp float;

in vec4 v_clamp;

// RGBA32F target: stores (tStart, tEnd, straightenFactor, pathLength).
out vec4 fragColor;

void main() {
  fragColor = v_clamp;
}
`,Xn=class{constructor(e,t){this.uniformLocations={};let{paths:n,extremities:r,layers:i,nodeShapes:a,nodeLayers:l}=t;this.gl=e,this.hasAttributeData=j([...n,...i]).floatsPerItem>0,this.hasNodeAttributeData=Object.keys(Pt(a,l).offsets).length>0,this.vertexShader=o(e,zn(n,r,i,a,l)),this.fragmentShader=s(e,Yn),this.program=c(e,[this.vertexShader,this.fragmentShader]);let u=new Set;this.customUniforms=[];for(let e of[...n,...r])for(let t of e.uniforms)u.has(t.name)||(u.add(t.name),this.customUniforms.push(t));let d=[`u_sizeRatio`,`u_correctionRatio`,`u_cameraAngle`,`u_minEdgeThickness`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_edgeDataTexture`,`u_edgeDataTextureWidth`,`u_edgeAttributeTexture`,`u_edgeAttributeTextureWidth`,`u_edgeAttributeTexelsPerEdge`,`u_layerAttributeTexture`,`u_layerAttributeTextureWidth`,`u_layerAttributeTexelsPerNode`,`u_frameTextureWidth`,`u_frameTextureHeight`,...this.customUniforms.map(e=>e.name)];for(let t of d)this.uniformLocations[t]=e.getUniformLocation(this.program,t);this.vao=e.createVertexArray()}run(e,t,n,r,i){if(n===0)return;let{gl:a}=this,o=this.uniformLocations;a.useProgram(this.program),a.bindVertexArray(this.vao),o.u_sizeRatio&&a.uniform1f(o.u_sizeRatio,e.sizeRatio),o.u_correctionRatio&&a.uniform1f(o.u_correctionRatio,e.correctionRatio),o.u_cameraAngle&&a.uniform1f(o.u_cameraAngle,e.cameraAngle),o.u_minEdgeThickness&&a.uniform1f(o.u_minEdgeThickness,e.minEdgeThickness),o.u_nodeDataTexture&&a.uniform1i(o.u_nodeDataTexture,e.nodeDataTextureUnit),o.u_nodeDataTextureWidth&&a.uniform1i(o.u_nodeDataTextureWidth,e.nodeDataTextureWidth),o.u_edgeDataTexture&&a.uniform1i(o.u_edgeDataTexture,e.edgeDataTextureUnit),o.u_edgeDataTextureWidth&&a.uniform1i(o.u_edgeDataTextureWidth,e.edgeDataTextureWidth),o.u_frameTextureWidth&&a.uniform1f(o.u_frameTextureWidth,t.getTextureWidth()),o.u_frameTextureHeight&&a.uniform1f(o.u_frameTextureHeight,t.getTextureHeight()),this.hasAttributeData&&r&&(r.bind(6),o.u_edgeAttributeTexture&&a.uniform1i(o.u_edgeAttributeTexture,6),o.u_edgeAttributeTextureWidth&&a.uniform1i(o.u_edgeAttributeTextureWidth,r.getTextureWidth()),o.u_edgeAttributeTexelsPerEdge&&a.uniform1i(o.u_edgeAttributeTexelsPerEdge,r.getTexelsPerItem())),this.hasNodeAttributeData&&i&&(i.bind(5),o.u_layerAttributeTexture&&a.uniform1i(o.u_layerAttributeTexture,5),o.u_layerAttributeTextureWidth&&a.uniform1i(o.u_layerAttributeTextureWidth,i.getTextureWidth()),o.u_layerAttributeTexelsPerNode&&a.uniform1i(o.u_layerAttributeTexelsPerNode,i.getTexelsPerItem()));for(let e of this.customUniforms)ht(a,this.uniformLocations[e.name],e);t.bindAsRenderTarget(),a.disable(a.BLEND),a.disable(a.DEPTH_TEST),a.drawArrays(a.POINTS,0,n),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindVertexArray(null)}kill(){let{gl:e}=this;e.deleteProgram(this.program),e.deleteShader(this.vertexShader),e.deleteShader(this.fragmentShader),e.deleteVertexArray(this.vao)}};function Zn(e,t){if(typeof e==`string`){let[t,n,r,i]=Ne(e).map(e=>e.toFixed(6));return{glsl:`vec4(${t}, ${n}, ${r}, ${i})`,attributes:[],needsNodeColors:!1}}if(`node`in e&&e.node)return{glsl:e.node===`source`?`v_sourceColor`:`v_targetColor`,attributes:[],needsNodeColors:!0};let n=e;return{glsl:`v_${t}`,attributes:[{name:`a_${t}`,size:4,type:WebGL2RenderingContext.UNSIGNED_BYTE,normalized:!0,source:n.attribute,defaultValue:n.default}],needsNodeColors:!1}}function Qn(e){let t=e?.color;if(t===void 0)return{name:`plain`,glsl:`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return v_color;
}
`,uniforms:[],attributes:[]};let n=Zn(t,`plainColor`);return{name:`plain`,glsl:`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return ${n.glsl};
}
`,uniforms:[],attributes:n.attributes,needsNodeColors:n.needsNodeColors}}function $n(e,t,n,r,i,a){return e.length===1?`${r} ${t}(int pathId, ${i}) {
  return path_${e[0].name}_${n}(${a});
}`:`${r} ${t}(int pathId, ${i}) {
  switch (pathId) {
${e.map((e,t)=>`    case ${t}: return path_${e.name}_${n}(${a});`).join(`
`)}
    default: return path_${e[0].name}_${n}(${a});
  }
}`}var er=`
vec3 computeEdgeLabelBodyBounds(
  float tStart, float tEnd, float pathLength,
  float webGLThickness, float headLengthRatio, float tailLengthRatio
) {
  float visibleLength = pathLength * (tEnd - tStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float totalNeededLength = headLength + tailLength;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    float extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float bodyStartDist = tStart * pathLength + tailLength;
  float bodyEndDist = tEnd * pathLength - headLength;
  return vec3(bodyStartDist, bodyEndDist, max(bodyEndDist - bodyStartDist, 0.0));
}
`;function tr(e,t){let n=u(e),r=u(t);return`
float computeEdgeLabelAlpha(float bodyLength, float textWidthWebGL) {
  float ratio = textWidthWebGL > 0.0001 ? min(bodyLength / textWidthWebGL, 1.0) : 1.0;
  if (ratio < ${n}) return 0.0;
  if (ratio < ${r}) return (ratio - ${n}) / (${r} - ${n});
  return 1.0;
}
`}var nr=`
float computeEdgeLabelScreenDir(int pathId, float t, vec2 source, vec2 target, mat3 matrix) {
  vec2 tangent = queryPathTangent(pathId, t, source, target);
  return (matrix * vec3(tangent, 0.0)).x < 0.0 ? -1.0 : 1.0;
}
`,rr=`
float computeEdgeLabelPerpOffset(
  float positionMode,
  float halfThickness, float marginWebGL, float halfTextHeight,
  float readingSign, float screenDir
) {
  float magnitude = halfThickness + marginWebGL + halfTextHeight;
  if (positionMode == 1.0) return magnitude * readingSign;
  if (positionMode == 2.0) return -magnitude * readingSign;
  if (positionMode == 3.0) return magnitude * screenDir;
  return 0.0;
}
`;function ir(e){let{paths:t,minVisibilityThreshold:n,fullVisibilityThreshold:r}=e,i=t.some(e=>e.hasSharpCorners),a=t.map(e=>`// --- Path: ${e.name} ---
${e.glsl}

// Tangent/normal functions: analytical if provided, otherwise numerical
${e.analyticalTangentGlsl||bn(e.name)}

// Auto-generated fallbacks for any missing path functions
${Dn(e.name,e.glsl)}

// Corner skip helpers (for paths with sharp corners like step/taxi)
${e.cornerSkipGlsl||``}
`).join(`
`),o=i?`// Corner function selectors (only some paths have sharp corners)
vec2 queryGetCornerTs(int pathId, vec2 source, vec2 target) {
  switch (pathId) {
${t.map((e,t)=>e.hasSharpCorners?`    case ${t}: return path_${e.name}_getCornerTs(source, target);`:`    case ${t}: return vec2(-1.0, -1.0); // No corners for ${e.name}`).join(`
`)}
    default: return vec2(-1.0, -1.0);
  }
}

vec2 queryGetCornerConcavity(int pathId, vec2 source, vec2 target, float perpOffset) {
  switch (pathId) {
${t.map((e,t)=>e.hasSharpCorners?`    case ${t}: return path_${e.name}_getCornerConcavity(source, target, perpOffset);`:`    case ${t}: return vec2(0.0, 0.0); // No corners for ${e.name}`).join(`
`)}
    default: return vec2(0.0, 0.0);
  }
}`:``;return`
// ============================================================================
// Node data fetch (geometry texel) and per-edge clamp fetch (edge-frame texture)
// ============================================================================

${T}
${ue}

// ============================================================================
// Path Functions (one block per path)
// ============================================================================

${a}

// ============================================================================
// Path Query Selectors (dispatch by pathId)
// ============================================================================

${$n(t,`queryPathPosition`,`position`,`vec2`,`float t, vec2 source, vec2 target`,`t, source, target`)}

${$n(t,`queryPathTangent`,`tangent`,`vec2`,`float t, vec2 source, vec2 target`,`t, source, target`)}

${$n(t,`queryPathNormal`,`normal`,`vec2`,`float t, vec2 source, vec2 target`,`t, source, target`)}

${$n(t,`queryPathLength`,`length`,`float`,`vec2 source, vec2 target`,`source, target`)}

${$n(t,`queryPathTAtDistance`,`t_at_distance`,`float`,`float dist, vec2 source, vec2 target`,`dist, source, target`)}

${o}

// ============================================================================
// Shared helpers (body bounds, alpha ramp, screen direction, perpendicular offset)
// ============================================================================

${er}
${tr(n,r)}
${nr}
${rr}
`}var ar=N.fontSize,or=new Map,sr=24,cr=50;function lr(e){let{paths:t,fontSizeMode:n,headLengthRatio:r,tailLengthRatio:i,minVisibilityThreshold:a,fullVisibilityThreshold:o,keepUpright:s}=e,c=n===`scaled`,l=Qn(),d=_n(j([...t,l]));return`#version 300 es

// Per-instance attributes
in float a_edgeIndex;
in float a_edgeAttrIndex;
in float a_baseFontSize;
in float a_totalTextWidth;
in float a_positionMode;
in float a_margin;
in float a_padding;
in vec4 a_color;
in vec4 a_id;

// Per-vertex (constant) attribute: strip vertex index
in float a_vertexIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
${c?`uniform float u_zoomSizeRatio;`:``}

${d.uniformDeclarations}

out vec4 v_color;
out vec4 v_id;
out float v_alphaModifier;

const float ATLAS_FONT_SIZE = ${u(ar)};
const float HEAD_RATIO = ${u(r)};
const float TAIL_RATIO = ${u(i)};
const int RIBBON_SEGMENTS = ${sr};

// Path attribute varyings (declared as plain locals since this shader has no FS inputs for them)
${d.vertexVaryingDeclarations.replace(/out /g,``)}

// Node size variables used by some path functions (self-loops, etc.)
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
${ir({paths:t,minVisibilityThreshold:a,fullVisibilityThreshold:o})}

void main() {
  int vIdx = int(a_vertexIndex);
  int pairIdx = vIdx / 2;
  int side = vIdx - pairIdx * 2; // 0 = left/bottom, 1 = right/top

  // --- Fetch edge data (2 texels per edge) ---
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 e0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 e1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, e0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, e1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  int pathId = int(edgeData1.z);

  // --- Fetch path attributes (curvature, etc.) ---
  {
    int edgeIdx = int(a_edgeAttrIndex);
${d.fetchCode}
${d.varyingAssignments}
  }

  // --- Fetch node data: geometry (texel 0) + rotation flags (texel 1) ---
  vec4 srcN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcN.xy;
  vec2 target = tgtN.xy;
  float sourceSize = srcN.z;
  float targetSize = tgtN.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;

  // --- Pixel-to-graph conversion (fixed font mode) ---
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // --- Body bounds (shared with edge label shader) ---
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, HEAD_RATIO, TAIL_RATIO
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // --- Text dimensions ---
  float baseFontSize = a_baseFontSize;
  ${c?`float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  float textWidthWebGL = a_totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float marginWebGL = a_margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  float textWidthWebGL = a_totalTextWidth * fontScale * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;
  float marginWebGL = a_margin * pixelToGraph;`}
  float paddingWebGL = a_padding * pixelToGraph;

  // --- Alpha modifier (shared with edge label shader) ---
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);
  if (alphaModifier <= 0.0 || textWidthWebGL <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    v_alphaModifier = 0.0;
    return;
  }

  // --- Perpendicular offset (shared with edge label shader) ---
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;
  float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);
  float screenDir = computeEdgeLabelScreenDir(pathId, centerT, source, target, u_matrix);
  float readingSign = ${s?`screenDir`:`1.0`};
  float halfThickness = webGLThickness * 0.5;
  float perpOffset = computeEdgeLabelPerpOffset(
    a_positionMode, halfThickness, marginWebGL, halfTextHeight, readingSign, screenDir
  );

  // --- Ribbon span (clipped to body) ---
  float halfTextWebGL = textWidthWebGL * 0.5;
  float labelStartDist = max(bodyCenterDist - halfTextWebGL, bodyStartDist);
  float labelEndDist = min(bodyCenterDist + halfTextWebGL, bodyEndDist);

  // Sample centerline at this pair, then apply perpendicular offset.
  // The ribbon follows the centerline path (simple & robust); for curved edges
  // this closely matches the offset path the characters sit on.
  float u = float(pairIdx) / float(RIBBON_SEGMENTS);
  float arcDist = mix(labelStartDist, labelEndDist, u);
  float t = queryPathTAtDistance(pathId, arcDist, source, target);
  vec2 pos = queryPathPosition(pathId, t, source, target);
  vec2 tan = queryPathTangent(pathId, t, source, target);
  vec2 perp = vec2(-tan.y, tan.x);

  vec2 centerPos = pos + perp * perpOffset;

  float halfRibbon = halfTextHeight + paddingWebGL;
  float sideSign = side == 0 ? -1.0 : 1.0;
  vec2 ribbonPos = centerPos + perp * (sideSign * halfRibbon);

  vec3 clipPos = u_matrix * vec3(ribbonPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  v_color = a_color;
  v_id = a_id;
  v_alphaModifier = alphaModifier;
}
`}var ur=`#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_id;
in float v_alphaModifier;

out vec4 fragColor;

void main() {
#ifdef PICKING_MODE
  if (v_alphaModifier <= 0.0) discard;
  fragColor = v_id;
#else
  float alpha = v_color.a * v_alphaModifier;
  if (alpha <= 0.0) discard;
  fragColor = vec4(v_color.rgb * alpha, alpha);
#endif
}
`;function dr(e,t,n,r){let{shaderConfig:i}=r,{paths:a,fontSizeMode:o}=i;if(a.length===0)throw Error(`createEdgeLabelBackgroundProgram: shaderConfig must declare at least one path`);let s=Qn(),c=j([...a,s]),l=dt([...a,s],c),u=lr(i);class d extends M{constructor(e,t,n){super(e,t,n),this.totalCount=0,this.bufferCapacity=0,this.edgeAttributeTexture=null,this.edgeAttributeTexture=new ut(e,c),this.packedAttributeData=new Float32Array(c.floatsPerItem)}getDefinition(){let{FLOAT:e,UNSIGNED_BYTE:t,TRIANGLE_STRIP:n}=WebGL2RenderingContext,r=[];for(let e=0;e<cr;e++)r.push([e]);let i=[`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_pixelRatio`,`u_cameraAngle`,`u_resolution`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_edgeDataTexture`,`u_edgeDataTextureWidth`,`u_edgeFrameTexture`,`u_edgeFrameTextureWidth`];return o===`scaled`&&i.push(`u_zoomSizeRatio`),c.floatsPerItem>0&&i.push(`u_edgeAttributeTexture`,`u_edgeAttributeTextureWidth`,`u_edgeAttributeTexelsPerEdge`),{VERTICES:cr,VERTEX_SHADER_SOURCE:u,FRAGMENT_SHADER_SOURCE:ur,METHOD:n,UNIFORMS:i,ATTRIBUTES:[{name:`a_edgeIndex`,size:1,type:e},{name:`a_edgeAttrIndex`,size:1,type:e},{name:`a_baseFontSize`,size:1,type:e},{name:`a_totalTextWidth`,size:1,type:e},{name:`a_positionMode`,size:1,type:e},{name:`a_margin`,size:1,type:e},{name:`a_padding`,size:1,type:e},{name:`a_color`,size:4,type:t,normalized:!0},{name:`a_id`,size:4,type:t,normalized:!0}],CONSTANT_ATTRIBUTES:[{name:`a_vertexIndex`,size:1,type:e}],CONSTANT_DATA:r}}processEdgeLabelBackground(e,t,n){let r=0;if(this.edgeAttributeTexture&&c.floatsPerItem>0){r=this.edgeAttributeTexture.allocate(t);let e=this.packedAttributeData;ft(l,n.edgeAttributes,e,``,or,0),this.edgeAttributeTexture.updateAllAttributes(t,e)}let{floats:i,ints:a}=this,o=e*this.STRIDE;i[o++]=n.edgeIndex,i[o++]=r,i[o++]=n.baseFontSize,i[o++]=n.totalTextWidth,i[o++]=n.positionMode,i[o++]=n.margin,i[o++]=n.padding,i[o++]=n.color,a[o++]=n.id}setUniforms(e,{gl:t,uniformLocations:n}){if(t.uniformMatrix3fv(n.u_matrix,!1,e.matrix),t.uniform1f(n.u_sizeRatio,e.sizeRatio),t.uniform1f(n.u_correctionRatio,e.correctionRatio),t.uniform1f(n.u_pixelRatio,e.pixelRatio),t.uniform1f(n.u_cameraAngle,e.cameraAngle),t.uniform2f(n.u_resolution,e.width,e.height),n.u_nodeDataTexture!==void 0&&t.uniform1i(n.u_nodeDataTexture,e.nodeDataTextureUnit),n.u_nodeDataTextureWidth!==void 0&&t.uniform1i(n.u_nodeDataTextureWidth,e.nodeDataTextureWidth),n.u_edgeDataTexture!==void 0&&t.uniform1i(n.u_edgeDataTexture,e.edgeDataTextureUnit),n.u_edgeDataTextureWidth!==void 0&&t.uniform1i(n.u_edgeDataTextureWidth,e.edgeDataTextureWidth),n.u_edgeFrameTexture!==void 0&&t.uniform1i(n.u_edgeFrameTexture,e.edgeFrameTextureUnit),n.u_edgeFrameTextureWidth!==void 0&&t.uniform1i(n.u_edgeFrameTextureWidth,e.edgeFrameTextureWidth),o===`scaled`&&n.u_zoomSizeRatio!==void 0){let r=this.renderer.getSetting(`zoomToSizeRatioFunction`);t.uniform1f(n.u_zoomSizeRatio,1/r(e.zoomRatio))}this.edgeAttributeTexture&&c.floatsPerItem>0&&n.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(6),t.uniform1i(n.u_edgeAttributeTexture,6),t.uniform1i(n.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),t.uniform1i(n.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()))}renderProgram(e,t){this.edgeAttributeTexture&&c.floatsPerItem>0&&this.edgeAttributeTexture.upload(),super.renderProgram(e,t)}kill(){this.edgeAttributeTexture&&=(this.edgeAttributeTexture.kill(),null),super.kill()}drawWebGL(e,{gl:t}){this.totalCount!==0&&t.drawArraysInstanced(t.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}reallocate(e){this.totalCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}}return new d(e,t,n)}function fr(e){return{paths:e.paths,headLengthRatio:e.headLengthRatio??0,tailLengthRatio:e.tailLengthRatio??0,fontSizeMode:e.fontSizeMode??`fixed`,minVisibilityThreshold:e.minVisibilityThreshold??.7,fullVisibilityThreshold:e.fullVisibilityThreshold??.8,keepUpright:e.keepUpright??!0}}var pr=N.fontSize,mr=17/64;function hr(e){let{paths:t,hasBorder:n=!1,fontSizeMode:r=`fixed`,minVisibilityThreshold:i=.5,fullVisibilityThreshold:a=.6,keepUpright:o=!0}=e,s=r===`scaled`,c=t.some(e=>e.hasSharpCorners),l=Qn(),d=_n(j([...t,l]));return`#version 300 es

// ============================================================================
// Attributes - Per Character (Instanced)
// ============================================================================

// Edge geometry: indices for texture lookup
// Edge data (source/target node indices, thickness, head/tail ratios) is fetched from edge data texture
// Edge path attributes (curvature, etc.) are fetched from edge attribute texture
in float a_edgeIndex;       // Index into edge data texture
in float a_edgeAttrIndex;   // Index into edge attribute texture (for curvature, etc.)
in float a_baseFontSize;    // Base font size in pixels (per-label)

// Character metrics (in glyph units = atlas font size pixels)
in vec4 a_charMetrics;      // (charTextOffset, charAdvance, totalTextWidth, positionMode)
in vec4 a_charDims;         // (charSize.x, charSize.y, charOffset.x, charOffset.y)

// Atlas texture coordinates
in vec4 a_texCoords;        // (x, y, width, height) in atlas pixels

// Label parameters
in vec2 a_labelParams;      // (margin, unused)

// Appearance
in vec4 a_color;            // Character color (RGBA, normalized)
${n?`in vec4 a_borderColor;      // Border color (RGBA, normalized)`:``}

// ============================================================================
// Attributes - Per Vertex (Constant)
// ============================================================================

in vec2 a_quadCorner;       // Quad corner: (0,0), (1,0), (0,1), (1,1)

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;    // Required by node shape SDFs
// u_sdfBufferPixels kept for ABI compatibility but unused in shader
uniform float u_sdfBufferPixels;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture; // Shared texture with node position/size/shape data
uniform int u_nodeDataTextureWidth;  // Width of 2D node data texture for coordinate calculation
uniform sampler2D u_edgeDataTexture; // Shared texture with edge data
uniform int u_edgeDataTextureWidth;  // Width of 2D edge data texture for coordinate calculation
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
${s?`uniform float u_zoomSizeRatio;  // Zoom-based size ratio from zoomToSizeRatioFunction`:``}

// Edge path attribute texture uniforms (for curvature and other path attributes)
${d.uniformDeclarations}

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
${n?`out vec4 v_borderColor;`:``}
out float v_edgeFade;  // 0 = fully visible, 1 = fully faded (outside body)
out float v_alphaModifier;  // 0-1 based on label visibility ratio
out float v_fontScale;  // Ratio of rendered font size to atlas font size
${n?`out float v_positionMode;  // Position mode for conditional border (0=over needs border)`:``}

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float FADE_WIDTH_PIXELS = 15.0;  // Width of fade gradient in pixels
const float ATLAS_FONT_SIZE = ${u(pr)};  // Base font size used in SDF atlas
const float VERTICAL_CENTER_RATIO = ${u(mr)};  // Baseline to visual center ratio

// ============================================================================
// Path Attribute Variables (set in main, used by path functions)
// ============================================================================
// Path attributes are fetched from the edge attribute texture and stored in
// variables with v_ prefix (e.g., v_curvature) for path functions to access.
${d.vertexVaryingDeclarations.replace(/out /g,``)}

// Node size variables (set in main, used by some path functions like loops).
// These mirror the v_sourceNodeSize / v_targetNodeSize varyings in generator.ts,
// but are plain floats here since the label shader is vertex-only.
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
${ir({paths:t,minVisibilityThreshold:i,fullVisibilityThreshold:a})}

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Fetch edge data from edge texture (2 texels per edge)
  // -------------------------------------------------------------------------
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, extremityIds
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  // edgeData0.w is reserved
  float headLengthRatio = edgeData1.x;
  float tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);  // Path type for multi-path support
  float baseFontSize = a_baseFontSize;

  // -------------------------------------------------------------------------
  // Fetch path attributes from edge attribute texture
  // -------------------------------------------------------------------------
  // Note: The fetch code uses 'edgeIdx' variable, so we set it to the attribute texture index
  {
    int edgeIdx = int(a_edgeAttrIndex);  // Use attribute texture index for path attributes
${d.fetchCode}
${d.varyingAssignments}
  }

  // -------------------------------------------------------------------------
  // Fetch node data from node texture (geometry texel + rotation-flags texel)
  // -------------------------------------------------------------------------
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcNodeData.xy;
  vec2 target = tgtNodeData.xy;
  float sourceSize = srcNodeData.z;
  float targetSize = tgtNodeData.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;
  float charTextOffset = a_charMetrics.x;
  float charAdvance = a_charMetrics.y;
  float totalTextWidth = a_charMetrics.z;
  float positionMode = a_charMetrics.w;
  vec2 charSize = a_charDims.xy;
  vec2 charOffset = a_charDims.zw;
  float margin = a_labelParams.x;

  // -------------------------------------------------------------------------
  // Compute pixel-to-graph conversion (for fixed font size mode)
  // -------------------------------------------------------------------------
  // This converts screen pixels to graph units such that N pixels on screen
  // becomes N pixels regardless of zoom level.
  // matrixScaleX is how much the matrix scales graph units to clip space
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  // -------------------------------------------------------------------------
  // Step 1: Convert thickness to WebGL units
  // -------------------------------------------------------------------------
  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // -------------------------------------------------------------------------
  // Step 2: Compute body bounds (truncated at node boundaries + extremities)
  // -------------------------------------------------------------------------
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, headLengthRatio, tailLengthRatio
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // -------------------------------------------------------------------------
  // Step 3: Compute font scale and text dimensions
  // -------------------------------------------------------------------------
  // Font size modes:
  // - "fixed": Constant pixel size regardless of zoom, using pixelToGraph conversion
  // - "scaled": Scales with zoom using zoomToSizeRatioFunction
  ${s?`// Scaled mode: font scales with zoom
  float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  // Convert glyph-unit metrics to WebGL units (scales with zoom)
  float textWidthWebGL = totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float charOffsetWebGL = charTextOffset * fontScale * u_correctionRatio / u_sizeRatio;
  float charAdvanceWebGL = charAdvance * fontScale * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: font stays constant in screen pixels
  float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  // Convert glyph-unit metrics to graph units using pixelToGraph (zoom-independent)
  float textWidthWebGL = totalTextWidth * fontScale * pixelToGraph;
  float charOffsetWebGL = charTextOffset * fontScale * pixelToGraph;
  float charAdvanceWebGL = charAdvance * fontScale * pixelToGraph;`}

  // Font scale varying for fragment shader gamma scaling.
  // Ratio of rendered font size to atlas font size — used to tighten the
  // anti-aliasing band for large labels so they stay sharp.
  v_fontScale = fontScale;

  // -------------------------------------------------------------------------
  // Step 4: Alpha modifier from how much of the label fits in the body
  // -------------------------------------------------------------------------
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);

  // -------------------------------------------------------------------------
  // Step 5: Compute character center offset (truncation check moved to after curvature adjustment)
  // -------------------------------------------------------------------------
  // Body center in arc distance
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;

  float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);
  float screenDir = computeEdgeLabelScreenDir(pathId, centerT, source, target, u_matrix);

  // Reversed labels lay their characters out from target to source
  float readingSign = ${o?`screenDir`:`1.0`};

  // Character center position relative to label center (on centerline, before curvature adjustment)
  float charCenterOffset = readingSign * (charOffsetWebGL + charAdvanceWebGL * 0.5 - textWidthWebGL * 0.5);

  // -------------------------------------------------------------------------
  // Step 6: Compute perpendicular offset based on position mode
  // -------------------------------------------------------------------------
  // Position modes: 0=over, 1=above, 2=below, 3=auto
  // Needed early for curvature-adaptive character spacing in Step 7
  float halfThickness = webGLThickness * 0.5;
  ${s?`// Scaled mode: margin and text height scale with zoom (same factor as font)
  float marginWebGL = margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: margin and text height stay constant in screen pixels
  float marginWebGL = margin * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;`}
  float perpOffset = computeEdgeLabelPerpOffset(
    positionMode, halfThickness, marginWebGL, halfTextHeight, readingSign, screenDir
  );

  // -------------------------------------------------------------------------
  // Step 7: Position character on path using offset path traversal
  // -------------------------------------------------------------------------
  // For "over" mode (perpOffset = 0), use simple centerline placement
  // For above/below modes, walk along the offset path to find correct position
  float charT;

  if (perpOffset == 0.0) {
    // Simple case: place on centerline
    float charArcDist = bodyCenterDist + charCenterOffset;
    charT = queryPathTAtDistance(pathId, charArcDist, source, target);
  } else {
    // Offset path traversal: walk along the offset curve to find character position
    // This ensures even character spacing regardless of curvature

    ${c?`// -----------------------------------------------------------------------
    // Corner skip setup for step/taxi edges with above/below labels
    // -----------------------------------------------------------------------
    // At concave corners (inner side of the bend), characters would bunch up
    // because the offset path has near-zero arc length. We detect corner
    // crossings during the offset path traversal and add skip distance.

    // Get corner t values and concavity
    vec2 cornerTs = queryGetCornerTs(pathId, source, target);
    vec2 concavity = queryGetCornerConcavity(pathId, source, target, perpOffset);

    // Skip distance in graph units, proportional to on-screen font size
    // For fixed mode: use pixelToGraph so gap stays constant regardless of zoom
    // For scaled mode: use the same conversion as text width
    ${s?`float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * pixelToGraph;`}

    // Corner t values for detecting crossings during traversal
    float corner1T = cornerTs.x;
    float corner2T = cornerTs.y;
    bool corner1IsConcave = concavity.x > 0.5;
    bool corner2IsConcave = concavity.y > 0.5;`:``}

    // Target distance along offset path from center
    float targetOffsetDist = abs(charCenterOffset);

    // Handle center character (charCenterOffset ≈ 0) - no search needed
    if (targetOffsetDist < 0.0001) {
      charT = centerT;
    } else {
      vec2 centerPos = queryPathPosition(pathId, centerT, source, target);
      vec2 centerNormal = queryPathNormal(pathId, centerT, source, target);
      vec2 offsetCenter = centerPos + centerNormal * perpOffset;

      float searchDir = charCenterOffset > 0.0 ? 1.0 : -1.0;

      // Search bounds (t values for body start and end)
      float tBodyStart = queryPathTAtDistance(pathId, bodyStartDist, source, target);
      float tBodyEnd = queryPathTAtDistance(pathId, bodyEndDist, source, target);

      // Walk along offset path to find character position
      float accumDist = 0.0;
      vec2 prevOffsetPos = offsetCenter;
      float prevT = centerT;
      float foundT = centerT;

      // Search range depends on direction
      float tSearchEnd = searchDir > 0.0 ? tBodyEnd : tBodyStart;

      ${c?`// Track which concave corners we've crossed to add skip distance
      bool crossedCorner1 = false;
      bool crossedCorner2 = false;
      float effectiveTargetDist = targetOffsetDist;`:``}

      const int STEPS = 32;
      for (int i = 1; i <= STEPS; i++) {
        // Step along centerline t, from center toward target
        float stepT = centerT + searchDir * float(i) * abs(tSearchEnd - centerT) / float(STEPS);

        ${c?`// Check for concave corner crossings and add skip distance
        // Corner 1 crossing check
        if (corner1IsConcave && !crossedCorner1) {
          bool crossingCorner1 = (searchDir > 0.0)
            ? (prevT < corner1T && stepT >= corner1T)
            : (prevT > corner1T && stepT <= corner1T);
          if (crossingCorner1) {
            crossedCorner1 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }

        // Corner 2 crossing check
        if (corner2IsConcave && !crossedCorner2) {
          bool crossingCorner2 = (searchDir > 0.0)
            ? (prevT < corner2T && stepT >= corner2T)
            : (prevT > corner2T && stepT <= corner2T);
          if (crossingCorner2) {
            crossedCorner2 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }`:``}

        // Compute offset position at this t
        vec2 stepPos = queryPathPosition(pathId, stepT, source, target);
        vec2 stepNormal = queryPathNormal(pathId, stepT, source, target);
        vec2 offsetPos = stepPos + stepNormal * perpOffset;

        // Distance along offset path
        float segDist = length(offsetPos - prevOffsetPos);

        ${c?`if (accumDist + segDist >= effectiveTargetDist) {
          // Interpolate within segment to find exact t
          float remaining = effectiveTargetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`:`if (accumDist + segDist >= targetOffsetDist) {
          // Interpolate within segment to find exact t
          float remaining = targetOffsetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`}

        accumDist += segDist;
        prevOffsetPos = offsetPos;
        prevT = stepT;
        // Update foundT to last valid position in case loop exhausts without finding target
        foundT = stepT;
      }

      charT = foundT;
    }
  }

  // Get position and tangent at final character position
  vec2 pathPos = queryPathPosition(pathId, charT, source, target);
  vec2 tangent = queryPathTangent(pathId, charT, source, target);

  // Compute perpendicular direction (90 degrees from tangent)
  vec2 perpDir = vec2(-tangent.y, tangent.x);

  // Apply perpendicular offset to path position
  vec2 offsetPathPos = pathPos + perpDir * perpOffset;

  // -------------------------------------------------------------------------
  // Step 8: Build character quad
  // -------------------------------------------------------------------------
  // Character size in screen pixels
  vec2 charSizePixels = charSize * fontScale;

  // Character offset from origin to the atlas region's top-left corner.
  // bearingX/bearingY already include the SDF buffer.
  vec2 charOffsetPixels = charOffset * fontScale;

  // The character's local X offset from pathPos (which is at character center)
  float charLocalX = -charAdvance * 0.5 * fontScale;

  // Build quad position:
  // - Start at character origin (charLocalX on X axis, 0 on Y axis = baseline)
  // - Add bearing offset to get to atlas region corner
  // - Add quad corner * size to get vertex position
  vec2 quadPos;
  quadPos.x = charLocalX + charOffsetPixels.x + a_quadCorner.x * charSizePixels.x;
  // charOffset.y = -bearingY (negated), so -charOffsetPixels.y = bearingY * fontScale
  // (distance from baseline to atlas region top, positive = upward)
  // Quad corner (0,0) = bottom-left, (1,1) = top-right
  quadPos.y = -charOffsetPixels.y - charSizePixels.y * (1.0 - a_quadCorner.y);

  // Center vertically on the path by offsetting by half the visual text height
  // VERTICAL_CENTER_RATIO is the distance from baseline to visual center as a ratio of atlas font size
  float verticalCenterOffset = VERTICAL_CENTER_RATIO * ATLAS_FONT_SIZE * fontScale;
  quadPos.y -= verticalCenterOffset;

  // -------------------------------------------------------------------------
  // Step 9: Rotate quad to align with tangent
  // -------------------------------------------------------------------------
  // Rotation matrix from the reading direction
  // readingDir = (cos(angle), sin(angle)), so we can build rotation directly
  vec2 readingDir = tangent * readingSign;
  mat2 rotation = mat2(readingDir.x, readingDir.y, -readingDir.y, readingDir.x);

  // Convert pixel offset to WebGL units for rotation
  ${s?`vec2 quadPosWebGL = quadPos * u_correctionRatio / u_sizeRatio; // Scaled mode`:`vec2 quadPosWebGL = quadPos * pixelToGraph; // Fixed mode: use pixelToGraph for zoom-independent size`}

  // Rotate around character center on path
  vec2 rotatedOffset = rotation * quadPosWebGL;

  // Final position in graph space (using offset path position for above/below modes)
  vec2 worldPos = offsetPathPos + rotatedOffset;

  // -------------------------------------------------------------------------
  // Step 10: Transform to clip space
  // -------------------------------------------------------------------------
  vec3 clipPos = u_matrix * vec3(worldPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 11: Texture coordinates
  // -------------------------------------------------------------------------
  // Flip Y for texture coordinates (texture Y goes down, quad Y goes up)
  vec2 texCorner = vec2(a_quadCorner.x, 1.0 - a_quadCorner.y);
  v_texCoord = (a_texCoords.xy + texCorner * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 12: Pass color, border color, and alpha modifier
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
${n?`  v_borderColor = a_borderColor;
  v_borderColor.a *= bias;
  v_positionMode = positionMode;`:``}
  v_alphaModifier = alphaModifier;

  // -------------------------------------------------------------------------
  // Step 13: Compute edge fade for soft truncation
  // -------------------------------------------------------------------------
  // Convert fade width from pixels to WebGL units
  ${s?`float fadeWidthWebGL = FADE_WIDTH_PIXELS * u_correctionRatio / u_sizeRatio;`:`float fadeWidthWebGL = FADE_WIDTH_PIXELS * pixelToGraph;`}

  // Compute the arc position of THIS VERTEX (not just character center)
  // The quad extends from charCenter - advance/2 to charCenter + advance/2
  // a_quadCorner.x is 0 for left edge, 1 for right edge
  float vertexLocalOffset = readingSign * (a_quadCorner.x - 0.5) * charAdvanceWebGL;
  float vertexArcOffset = charCenterOffset + vertexLocalOffset;

  // Compute distance from body edges (positive = inside body, negative = outside)
  float halfBody = bodyLength * 0.5;
  float distFromStart = vertexArcOffset + halfBody;  // Distance from body start edge
  float distFromEnd = halfBody - vertexArcOffset;    // Distance from body end edge
  float distFromEdge = min(distFromStart, distFromEnd);

  // Compute fade: 0 = fully visible (deep inside body), 1 = fully faded (at body edge)
  // Fade goes from 0 (at 2*fadeWidth inside) to 1 (at body edge)
  // This ensures text is fully transparent before reaching extremities
  v_edgeFade = 1.0 - smoothstep(0.0, fadeWidthWebGL * 2.0, distFromEdge);
}
`}function gr(e={}){let{hasBorder:t=!1}=e;return`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
${t?`in vec4 v_borderColor;`:``}
in float v_edgeFade;  // 0 = fully visible, 1 = fully faded
in float v_alphaModifier;  // 0-1 based on label visibility ratio
in float v_fontScale;  // Ratio of rendered font size to atlas font size
${t?`in float v_positionMode;  // Position mode (0=over, 1=above, 2=below, 3=auto)`:``}

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;
${t?`uniform float u_borderWidth;  // Border width in SDF units (normalized)`:``}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Edge labels are not pickable - discard all fragments in picking mode
    fragColor = vec4(0.0);
    discard;
  #else
  // SDF stores normalized distance: 0.5 = on edge, >0.5 = inside glyph
  float sdfValue = texture(u_atlas, v_texCoord).a;

  // Edge threshold accounting for SDF buffer padding
  float edge = 1.0 - u_sdfBuffer;

  // Scale gamma inversely with font scale so small labels get a wider AA band
  // (smoother) and large labels get a tighter band (sharper).
  float aaWidth = u_gamma / (u_pixelRatio * v_fontScale);

  // Apply edge fade for soft truncation at body boundaries
  // Also apply visibility-based alpha modifier for short edge labels
  float edgeAlpha = (1.0 - v_edgeFade) * v_alphaModifier;

${t?`  // Fill alpha: fully opaque inside the glyph
  float fillAlpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Only apply border for "over" position mode (v_positionMode == 0.0)
  // Labels positioned above/below/auto don't overlap the edge line and don't need borders
  if (v_positionMode < 0.5) {
    // Border rendering: compute alpha for both fill and border regions
    // Border extends from (edge - borderWidth) to edge
    float borderEdge = edge - u_borderWidth;

    // Border alpha: opaque in the border region (between borderEdge and edge)
    float borderAlpha = smoothstep(borderEdge - aaWidth, borderEdge + aaWidth, sdfValue);

    // Composite: fill on top of border
    // Border is visible where borderAlpha > 0 but fillAlpha < 1
    vec3 borderColorPremult = v_borderColor.rgb * v_borderColor.a * borderAlpha * edgeAlpha;
    vec3 fillColorPremult = v_color.rgb * v_color.a * fillAlpha * edgeAlpha;

    // Blend fill over border (fill replaces border where fill is opaque)
    float finalBorderAlpha = borderAlpha * (1.0 - fillAlpha);
    vec3 finalColor = fillColorPremult + v_borderColor.rgb * v_borderColor.a * finalBorderAlpha * edgeAlpha;
    float finalAlpha = (v_color.a * fillAlpha + v_borderColor.a * finalBorderAlpha) * edgeAlpha;

    fragColor = vec4(finalColor, finalAlpha);
  } else {
    // No border for above/below/auto positions - simple text rendering
    float finalAlpha = v_color.a * fillAlpha * edgeAlpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  }`:`  // Smooth transition from transparent to opaque at glyph edge
  float alpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Premultiplied alpha output
  float finalAlpha = v_color.a * alpha * edgeAlpha;
  fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);`}
  #endif
}
`}function _r(e,t=!1,n=`fixed`){let r=[`u_matrix`,`u_sizeRatio`,`u_correctionRatio`,`u_pixelRatio`,`u_cameraAngle`,`u_sdfBufferPixels`,`u_resolution`,`u_atlasSize`,`u_atlas`,`u_gamma`,`u_sdfBuffer`,`u_nodeDataTexture`,`u_nodeDataTextureWidth`,`u_edgeDataTexture`,`u_edgeDataTextureWidth`,`u_edgeFrameTexture`,`u_edgeFrameTextureWidth`,`u_edgeAttributeTexture`,`u_edgeAttributeTextureWidth`,`u_edgeAttributeTexelsPerEdge`];n===`scaled`&&r.push(`u_zoomSizeRatio`),t&&r.push(`u_borderWidth`);for(let t of e)for(let e of t.uniforms)r.includes(e.name)||r.push(e.name);return r}function vr(e){let{hasBorder:t=!1,fontSizeMode:n=`fixed`}=e;return{vertexShader:hr(e),fragmentShader:gr({hasBorder:t}),uniforms:_r(e.paths,t,n)}}var yr=new Map;function br(e){switch(e){case`over`:return 0;case`above`:return 1;case`below`:return 2;case`auto`:return 3;default:return 0}}function xr(e,t,n,r){let{color:i,margin:a,textBorder:o}=r,{paths:s,fontSizeMode:c,minVisibilityThreshold:l,fullVisibilityThreshold:u,keepUpright:d}=fr(r),f=!!o,p=vr({paths:s,hasBorder:f,fontSizeMode:c,minVisibilityThreshold:l,fullVisibilityThreshold:u,keepUpright:d});class m extends qt{static{this.labelColor=i}static{this.labelMargin=a}constructor(e,t,n){super(e,t,n),this.atlasTexture=null,this.atlasNeedsUpdate=!1,this.refreshTimeout=null,this.labelGlyphCache=new Map,this.edgeAttributeTexture=null;let r=Qn();if(this.attributeLayout=j([...s,r]),this.attrDescriptors=dt([...s,r],this.attributeLayout),this.edgeAttributeTexture=new ut(e,this.attributeLayout),this.packedAttributeData=new Float32Array(this.attributeLayout.floatsPerItem),this.atlasManager=new rn,this.gamma=.025,this.sdfBuffer=N.cutoff,this.atlasTexture=e.createTexture(),!this.atlasTexture)throw Error(`EdgeLabelProgram: failed to create atlas texture`);e.bindTexture(e.TEXTURE_2D,this.atlasTexture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.bindTexture(e.TEXTURE_2D,null),this.atlasManager.on(rn.ATLAS_UPDATED_EVENT,()=>{this.atlasNeedsUpdate=!0,this.refreshTimeout!==null&&clearTimeout(this.refreshTimeout),this.refreshTimeout=setTimeout(()=>{this.refreshTimeout=null,this.renderer.refresh()},0)});let i={family:`sans-serif`,weight:`normal`,style:`normal`};this.defaultFontKey=this.atlasManager.registerFont(i)}getDefinition(){let{FLOAT:e,UNSIGNED_BYTE:t,TRIANGLE_STRIP:n}=WebGL2RenderingContext,r=new Set,i=[];for(let e of s)for(let t of e.attributes){let e=t.name.startsWith(`a_`)?t.name:`a_${t.name}`;r.has(e)||(r.add(e),i.push({name:e,size:t.size,type:t.type}))}return{VERTICES:4,VERTEX_SHADER_SOURCE:p.vertexShader,FRAGMENT_SHADER_SOURCE:p.fragmentShader,METHOD:n,UNIFORMS:p.uniforms,ATTRIBUTES:[{name:`a_edgeIndex`,size:1,type:e},{name:`a_edgeAttrIndex`,size:1,type:e},{name:`a_baseFontSize`,size:1,type:e},{name:`a_charMetrics`,size:4,type:e},{name:`a_charDims`,size:4,type:e},{name:`a_texCoords`,size:4,type:e},{name:`a_labelParams`,size:2,type:e},{name:`a_color`,size:4,type:t,normalized:!0},...f?[{name:`a_borderColor`,size:4,type:t,normalized:!0}]:[],...i.filter(e=>![`a_curvature`,`curvature`].includes(e.name))],CONSTANT_ATTRIBUTES:[{name:`a_quadCorner`,size:2,type:e}],CONSTANT_DATA:[[0,0],[1,0],[0,1],[1,1]]}}prepareLabelGlyphs(e,t){if(t.hidden||!t.text){this.labelGlyphCache.delete(e);return}let n=t.text,r=t.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(n,r);let i=[],a=[],o=0;for(let e of n){let t=e.codePointAt(0);if(t===void 0){i.push(void 0),a.push(o);continue}let n=this.atlasManager.getGlyph(t,r);i.push(n),a.push(o),n&&(o+=n.advance)}this.labelGlyphCache.set(e,{glyphs:i,xOffsets:a,totalWidth:o})}processCharacter(e,t,n,r){let{floats:i}=this,a=this.STRIDE,c=e*a,l=this.labelGlyphCache.get(t.parentKey);if(!l||!l.glyphs[r]){for(let e=0;e<a;e++)i[c+e]=0;return}let u=l.glyphs[r],d=l.xOffsets[r],p=m.labelColor,h=k(p&&typeof p==`object`&&`color`in p&&p.color?p.color:t.color),g=c;i[g++]=t.edgeIndex,i[g++]=this.edgeAttributeTexture?.getIndex(t.parentKey)??0,i[g++]=t.size,i[g++]=d,i[g++]=u.advance,i[g++]=l.totalWidth,i[g++]=br(t.position),i[g++]=u.atlasWidth,i[g++]=u.atlasHeight,i[g++]=u.bearingX,i[g++]=-u.bearingY,i[g++]=u.atlasX,i[g++]=u.atlasY,i[g++]=u.atlasWidth,i[g++]=u.atlasHeight;let _=m.labelMargin??t.margin;if(i[g++]=_,i[g++]=0,i[g++]=h,f&&o){let e;e=typeof o.color==`string`?o.color:o.color.color||`#ffffff`,i[g++]=k(e)}let v=new Set;for(let e of s)for(let t of e.attributes){let e=t.name.startsWith(`a_`)?t.name.slice(2):t.name;if(e!==`curvature`&&!v.has(e)){v.add(e);for(let e=0;e<t.size;e++)i[g++]=0}}}processEdgeLabel(e,t,n){if(this.prepareLabelGlyphs(e,n),this.edgeAttributeTexture&&!n.hidden&&n.text){this.edgeAttributeTexture.allocate(e);let t=this.packedAttributeData;ft(this.attrDescriptors,n.edgeAttributes,t,``,yr,0),this.edgeAttributeTexture.updateAllAttributes(e,t)}return super.processLabel(e,t,n)}updateAtlasTexture(){if(!this.atlasNeedsUpdate)return;let e=this.normalProgram.gl,t=this.atlasManager.getTextures();if(t.length===0)return;let n=t[0];e.bindTexture(e.TEXTURE_2D,this.atlasTexture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,n.width,n.height,0,e.RGBA,e.UNSIGNED_BYTE,n.data),e.bindTexture(e.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}setUniforms(e,t){let{gl:n,uniformLocations:r}=t,i=this.atlasManager.getTextures(),a=i.length>0?[i[0].width,i[0].height]:[1,1];if(n.uniformMatrix3fv(r.u_matrix,!1,e.matrix),n.uniform1f(r.u_sizeRatio,e.sizeRatio),n.uniform1f(r.u_correctionRatio,e.correctionRatio),n.uniform1f(r.u_pixelRatio,e.pixelRatio),n.uniform1f(r.u_cameraAngle,e.cameraAngle),n.uniform1f(r.u_sdfBufferPixels,N.buffer),n.uniform2f(r.u_resolution,e.width,e.height),n.uniform2f(r.u_atlasSize,a[0],a[1]),n.uniform1f(r.u_gamma,this.gamma),n.uniform1f(r.u_sdfBuffer,this.sdfBuffer),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.atlasTexture),n.uniform1i(r.u_atlas,0),r.u_nodeDataTexture!==void 0&&n.uniform1i(r.u_nodeDataTexture,e.nodeDataTextureUnit),r.u_nodeDataTextureWidth!==void 0&&n.uniform1i(r.u_nodeDataTextureWidth,e.nodeDataTextureWidth),r.u_edgeDataTexture!==void 0&&n.uniform1i(r.u_edgeDataTexture,e.edgeDataTextureUnit),r.u_edgeDataTextureWidth!==void 0&&n.uniform1i(r.u_edgeDataTextureWidth,e.edgeDataTextureWidth),r.u_edgeFrameTexture!==void 0&&n.uniform1i(r.u_edgeFrameTexture,e.edgeFrameTextureUnit),r.u_edgeFrameTextureWidth!==void 0&&n.uniform1i(r.u_edgeFrameTextureWidth,e.edgeFrameTextureWidth),f&&o&&r.u_borderWidth!==void 0){let e=o.width/N.buffer*this.sdfBuffer;n.uniform1f(r.u_borderWidth,e)}if(this.edgeAttributeTexture&&r.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(6),n.uniform1i(r.u_edgeAttributeTexture,6),n.uniform1i(r.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),n.uniform1i(r.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem())),c===`scaled`&&r.u_zoomSizeRatio!==void 0){let t=1/this.renderer.getSetting(`zoomToSizeRatioFunction`)(e.zoomRatio);n.uniform1f(r.u_zoomSizeRatio,t)}}renderProgram(e,t){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),this.edgeAttributeTexture&&this.edgeAttributeTexture.upload(),super.renderProgram(e,t)}registerFont(e,t=`normal`,n=`normal`){return this.atlasManager.registerFont({family:e,weight:t,style:n})}getAtlasManager(){return this.atlasManager}ensureGlyphsReady(e,t){let n=t||this.defaultFontKey;for(let t of e)this.atlasManager.ensureGlyphs(t,n);this.atlasManager.flush()}measureLabelAtlasWidth(e,t){let n=t||this.defaultFontKey;this.atlasManager.ensureGlyphs(e,n),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();let r=0;for(let t of e){let e=t.codePointAt(0);if(e===void 0)continue;let i=this.atlasManager.getGlyph(e,n);i&&(r+=i.advance)}return r}measureLabel(e,t,n){return{width:this.measureLabelAtlasWidth(e,n)*(t/N.fontSize),height:t,textHeight:t}}kill(){let e=this.normalProgram.gl;this.refreshTimeout!==null&&(clearTimeout(this.refreshTimeout),this.refreshTimeout=null),this.atlasTexture&&=(e.deleteTexture(this.atlasTexture),null),this.edgeAttributeTexture&&=(this.edgeAttributeTexture.kill(),null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),super.kill()}}return new m(e,t,n)}function Sr(){return{name:`none`,glsl:`
// No extremity - always returns positive (outside)
float extremity_none(vec2 uv, float lengthRatio, float widthRatio) {
  return 1.0;
}
`,length:0,widthFactor:1,margin:0,uniforms:[],attributes:[]}}function Cr(e,t,n,r,i,a,o){let s=On(r),{paths:c,layers:l,defaultHead:u,defaultTail:d}=s,f=[Sr(),...s.extremities],p={},m={};c.forEach((e,t)=>p[e.name]=t),f.forEach((e,t)=>m[e.name]=t);let h=m[u]??0,g=m[d]??0,_=null,v=j([...c,...l]),y=class extends M{constructor(e,t,n){_||=qn({paths:c,extremities:f,layers:l,antialias:i}),super(e,t,n),this.layerLifecycles=new Map,this.needsShaderRegeneration=!1,this.edgeAttributeTexture=null,this.layout=v,this.attrDescriptors=[],this.lifecycleIndexOffset=c.length,this._pickingBuffer=t,this.edgeAttributeTexture=new ut(e,this.layout),this.packedAttributeData=new Float32Array(this.layout.floatsPerItem),l.forEach((t,r)=>{if(t.lifecycle){let i={gl:e,renderer:{refresh:()=>n.refresh()},getUniformLocation:t=>e.getUniformLocation(this.normalProgram.program,t),requestShaderRegeneration:()=>{this.needsShaderRegeneration=!0},requestRefresh:()=>{n.refresh()}};this.layerLifecycles.set(r,t.lifecycle(i))}}),this.layerLifecycles.forEach(e=>e.init?.());let r=new Map;this.layerLifecycles.forEach((e,t)=>{e.getAttributeData&&r.set(c.length+t,e)}),this.attrDescriptors=dt([...c,...l],this.layout,r)}getAttributeTexture(){return this.edgeAttributeTexture}resolveEdgeIds(e,t,n){let r=e,i=0,a=h,o=g,s=t?r.selfLoopPath:n&&r.parallelPath?r.parallelPath:r.path;s&&p[s]!==void 0&&(i=p[s]),r.head&&r.head!==`none`&&m[r.head]!==void 0&&(a=m[r.head]),r.tail&&r.tail!==`none`&&m[r.tail]!==void 0&&(o=m[r.tail]);let c=f[a],l=f[o];return{pathId:i,headId:a,tailId:o,headLengthRatio:P(c.length)?0:c.length,tailLengthRatio:P(l.length)?0:l.length}}getDefinition(){let{TRIANGLE_STRIP:e}=WebGL2RenderingContext,t=e,n=_;return{VERTICES:n.verticesPerEdge,VERTEX_SHADER_SOURCE:n.vertexShader,FRAGMENT_SHADER_SOURCE:n.fragmentShader,METHOD:t,UNIFORMS:n.uniforms,ATTRIBUTES:n.attributes,CONSTANT_ATTRIBUTES:n.constantAttributes,CONSTANT_DATA:n.constantData}}maybeRegenerateShaders(){if(!this.needsShaderRegeneration)return;this.needsShaderRegeneration=!1;let e=l.map((e,t)=>{let n=this.layerLifecycles.get(t);return n?.regenerate?n.regenerate():e});_=qn({paths:c,extremities:f,layers:e,antialias:this.renderer.getSetting(`antialiasEdges`)});let t=this.normalProgram.gl,{program:n,buffer:r,vertexShader:i,fragmentShader:a}=this.normalProgram;t.deleteProgram(n),t.deleteBuffer(r),t.deleteShader(i),t.deleteShader(a),this.normalProgram=this.getProgramInfo(`normal`,t,_.vertexShader,_.fragmentShader,this._pickingBuffer)}process(e,t,n,r,i,a){let o=t*this.STRIDE;if(i.visibility===`hidden`||n.visibility===`hidden`||r.visibility===`hidden`){for(let e=o+this.STRIDE;o<e;o++)this.floats[o]=0;this.floats[t*this.STRIDE]=-1}else this.processVisibleItem(Le(e),o,n,r,i,a)}processVisibleItem(e,t,n,r,i,a){let{floats:o,ints:s}=this;o[t++]=a,o[t++]=k(i.color),s[t++]=e,o[t++]=i.opacity??1;let c=this.packedAttributeData;ft(this.attrDescriptors,i,c,i.color,this.layerLifecycles,this.lifecycleIndexOffset),this.edgeAttributeTexture.updateAllAttributesAtRow(a,c)}setUniforms(e,t){let{gl:n,uniformLocations:r}=t;r.u_matrix&&n.uniformMatrix3fv(r.u_matrix,!1,e.matrix),r.u_sizeRatio&&n.uniform1f(r.u_sizeRatio,e.sizeRatio),r.u_correctionRatio&&n.uniform1f(r.u_correctionRatio,e.correctionRatio),r.u_zoomRatio&&n.uniform1f(r.u_zoomRatio,e.zoomRatio),r.u_pixelRatio&&n.uniform1f(r.u_pixelRatio,e.pixelRatio),r.u_cameraAngle&&n.uniform1f(r.u_cameraAngle,e.cameraAngle),r.u_feather&&n.uniform1f(r.u_feather,e.antiAliasingFeather),r.u_minEdgeThickness&&n.uniform1f(r.u_minEdgeThickness,e.minEdgeThickness),r.u_pickingPadding&&n.uniform1f(r.u_pickingPadding,e.edgePickingPadding),r.u_nodeDataTexture&&n.uniform1i(r.u_nodeDataTexture,e.nodeDataTextureUnit),r.u_nodeDataTextureWidth&&n.uniform1i(r.u_nodeDataTextureWidth,e.nodeDataTextureWidth),r.u_edgeDataTexture&&n.uniform1i(r.u_edgeDataTexture,e.edgeDataTextureUnit),r.u_edgeDataTextureWidth&&n.uniform1i(r.u_edgeDataTextureWidth,e.edgeDataTextureWidth),r.u_edgeFrameTexture&&n.uniform1i(r.u_edgeFrameTexture,e.edgeFrameTextureUnit),r.u_edgeFrameTextureWidth&&n.uniform1i(r.u_edgeFrameTextureWidth,e.edgeFrameTextureWidth),this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&(this.edgeAttributeTexture.bind(6),r.u_edgeAttributeTexture&&n.uniform1i(r.u_edgeAttributeTexture,6),r.u_edgeAttributeTextureWidth&&n.uniform1i(r.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),r.u_edgeAttributeTexelsPerEdge&&n.uniform1i(r.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()));let i=new Set;c.forEach(e=>{e.uniforms.forEach(e=>{i.has(e.name)||(i.add(e.name),this.setTypedUniform(e,t))})}),f.forEach(e=>{e.uniforms.forEach(e=>{i.has(e.name)||(i.add(e.name),this.setTypedUniform(e,t))})}),l.forEach(e=>{e.uniforms.forEach(e=>{i.has(e.name)||(i.add(e.name),this.setTypedUniform(e,t))})})}render(e,t,n){this.maybeRegenerateShaders(),super.render(e,t,n)}renderProgram(e,t){this.layerLifecycles.forEach(e=>e.beforeRender?.()),super.renderProgram(e,t)}uploadAttributeTexture(){this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&this.edgeAttributeTexture.upload()}kill(){this.layerLifecycles.forEach(e=>e.kill?.()),this.edgeAttributeTexture&&=(this.edgeAttributeTexture.kill(),null),super.kill()}},b=f[h],x=f[g],S={paths:c,headLengthRatio:P(b.length)?0:b.length,tailLengthRatio:P(x.length)?0:x.length,...r.label},C=fr(S),ee=()=>({labelProgram:xr(e,null,n,S),labelBackgroundProgram:dr(e,t,n,{shaderConfig:C})}),w=new Xn(e,{paths:c,extremities:f,layers:l,nodeShapes:a,nodeLayers:o});return{edgeProgram:new y(e,null,n),createLabelPrograms:ee,framePass:w}}function wr(){return{name:`straight`,segments:1,minBodyLengthRatio:0,linearParameterization:!0,glsl:`
// Position at parameter t ∈ [0, 1]
vec2 path_straight_position(float t, vec2 source, vec2 target) {
  return mix(source, target, t);
}

// Total length of the path (analytical - more efficient than sampling)
float path_straight_length(vec2 source, vec2 target) {
  return length(target - source);
}
`,uniforms:[],attributes:[]}}function Tr(e){let{segments:t=32}=e??{};return{name:`loop`,segments:t,glsl:`
const float LOOP_PI = 3.141592653589793;

float loopWorldRadius() {
  float nodeWorldRadius = v_sourceNodeSize * u_correctionRatio / u_sizeRatio;
  return max(v_loopRadius * nodeWorldRadius, 0.001);
}

// Cubic Bézier with P0 = P3 = source.
// Control points extend outward orthogonal to the node surface at exit/entry angles.
vec2 path_loop_position(float t, vec2 source, vec2 target) {
  float R = loopWorldRadius();
  float angle = v_loopAngle + (v_loopFixedOrientation > 0.5 ? u_cameraAngle : 0.0);
  float halfSpread = v_loopSpread * 0.5;

  float exitAngle = angle - halfSpread;
  float entryAngle = angle + halfSpread;

  // Control point distance: at t=0.5 the Bézier reaches 0.75 * cpDist * cos(halfSpread)
  // from source. Solve for cpDist so the loop tip reaches exactly R.
  float cpDist = R / (0.75 * cos(halfSpread));

  vec2 cp1 = source + cpDist * vec2(cos(exitAngle), sin(exitAngle));
  vec2 cp2 = source + cpDist * vec2(cos(entryAngle), sin(entryAngle));

  float u = 1.0 - t;
  vec2 d1 = cp1 - source;
  vec2 d2 = cp2 - source;
  return source + 3.0 * t * u * (u * d1 + t * d2);
}

// Approximate arc length via chord sampling
float path_loop_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_loop_position(0.0, source, target);
  const int STEPS = 16;
  for (int i = 1; i <= STEPS; i++) {
    float t = float(i) / float(STEPS);
    vec2 cur = path_loop_position(t, source, target);
    len += length(cur - prev);
    prev = cur;
  }
  return len;
}
`,needsNodeSize:!0,uniforms:[],attributes:[{name:`loopRadius`,size:1,type:WebGL2RenderingContext.FLOAT},{name:`loopAngle`,size:1,type:WebGL2RenderingContext.FLOAT},{name:`loopSpread`,size:1,type:WebGL2RenderingContext.FLOAT},{name:`loopFixedOrientation`,size:1,type:WebGL2RenderingContext.FLOAT}],variables:{loopRadius:{type:`number`,default:4},loopAngle:{type:`number`,default:Math.PI/4},loopSpread:{type:`number`,default:80*Math.PI/180},loopFixedOrientation:{type:`number`,default:0}},spread:{variable:`loopRadius`,compute:e=>e+4}}}var Er=class{constructor(e){this.buckets=new Map,this.keyDepth=new Map;for(let t of e)this.buckets.set(t,new Set)}has(e){return this.keyDepth.has(e)}getBucket(e){return this.buckets.get(e)}set(e,t){let n=this.keyDepth.get(e);if(n===t)return;let r=this.buckets.get(t);if(!r)throw Error(`Sigma: "${t}" is not a declared depth layer`);n!==void 0&&this.buckets.get(n)?.delete(e),r.add(e),this.keyDepth.set(e,t)}remove(e){let t=this.keyDepth.get(e);t!==void 0&&(this.buckets.get(t).delete(e),this.keyDepth.delete(e))}clearAll(){for(let e of this.buckets.values())e.clear();this.keyDepth.clear()}getSorted(e,t){let n=this.buckets.get(e);return!n||n.size===0?[]:[...n].sort((e,n)=>t(e)-t(n))}},Dr=class extends lt{constructor(e,t){super(e,2,t)}updateNode(e,t,n,r,i,a,o,s){let c=this.indexMap.get(e);if(c===void 0)throw Error(`Node "${e}" not allocated in NodeDataTexture`);let[l,u,d,f]=Ie(s),p=c*2*4;this.data[p]=t,this.data[p+1]=n,this.data[p+2]=r,this.data[p+3]=i,this.data[p+4]=a,this.data[p+5]=o,this.data[p+6]=l*65536+u*256+d,this.data[p+7]=f/255,this.markDirty(c)}},Or=1024,kr=1.5,Ar=class{constructor(e,t){if(this.texture=null,this.framebuffer=null,!e.getExtension(`EXT_color_buffer_float`))throw Error(`sigma: EXT_color_buffer_float is required for label/edge placement but is unavailable in this WebGL2 context.`);this.gl=e,this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.channels=t.channels,this.capacity=this.roundUpToPowerOfTwo(t.initialCapacity??Or);let n=this.computeDimensions(this.capacity);this.textureWidth=n.width,this.textureHeight=n.height,this.create()}roundUpToPowerOfTwo(e){return 2**Math.ceil(Math.log2(Math.max(1,e)))}computeDimensions(e){let t=Math.min(e,this.maxTextureSize);return{width:t,height:Math.ceil(e/t)}}create(){let{gl:e}=this,t=this.channels===1?e.R32F:e.RGBA32F,n=this.channels===1?e.RED:e.RGBA;if(this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,t,this.textureWidth,this.textureHeight,0,n,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.framebuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw Error(`sigma: float framebuffer for frame-pass placement is incomplete.`);e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null)}ensureCapacity(e){if(e<=this.capacity)return;let{gl:t}=this;this.capacity=this.roundUpToPowerOfTwo(Math.ceil(e*kr));let n=this.computeDimensions(this.capacity);this.textureWidth=n.width,this.textureHeight=n.height,this.texture&&t.deleteTexture(this.texture),this.framebuffer&&t.deleteFramebuffer(this.framebuffer),this.create()}bindAsRenderTarget(){let{gl:e}=this;e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.viewport(0,0,this.textureWidth,this.textureHeight)}bind(e){let{gl:t}=this;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture)}getTexture(){return this.texture}getTextureWidth(){return this.textureWidth}getTextureHeight(){return this.textureHeight}restore(){this.gl.getExtension(`EXT_color_buffer_float`),this.create()}kill(){let{gl:e}=this;this.texture&&=(e.deleteTexture(this.texture),null),this.framebuffer&&=(e.deleteFramebuffer(this.framebuffer),null)}},jr=class extends lt{constructor(e,t){super(e,2,t)}updateEdge(e,t,n,r,i,a,o=0,s=0,c=0){let l=this.indexMap.get(e);if(l===void 0)throw Error(`Edge "${e}" not allocated in EdgeDataTexture`);let u=l*this.TEXELS_PER_ITEM*4;this.data[u+0]=t,this.data[u+1]=n,this.data[u+2]=r,this.data[u+3]=0,this.data[u+4]=i,this.data[u+5]=a,this.data[u+6]=o,this.data[u+7]=(s&15)<<4|c&15,this.markDirty(l)}};function Mr(e){return typeof e==`object`&&`glsl`in e&&!(`attributes`in e)}function Nr(e){return typeof e==`object`&&`glsl`in e&&!(`attributes`in e)}var Pr={shapes:[hn()],variables:{},layers:[gn()],label:{},backdrop:{},labelAttachments:{}},Fr={paths:[wr(),Tr()],extremities:[],variables:{},layers:[Qn()],defaultHead:`none`,defaultTail:`none`,label:{}},Ir=[`nodes`,`topNodes`],Lr=[`edges`,`topEdges`],Rr=[...Lr,...Ir],zr={nodes:Pr,edges:Fr,depthLayers:[...Rr]};function Br(e){return typeof e==`object`&&!!e&&`attribute`in e}function Vr(e){return typeof e==`function`}function Hr(e){return typeof e==`object`&&!!e&&`when`in e&&typeof e.when==`function`&&`then`in e}function Ur(e){return typeof e==`object`&&!!e&&`whenState`in e&&`then`in e}function Wr(e){return typeof e==`object`&&!!e&&`whenData`in e&&`then`in e}var Gr={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,isDragged:!1},Kr={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,parallelIndex:0,parallelCount:1},qr={isIdle:!0,isPanning:!1,isZooming:!1,isDragging:!1,hasHovered:!1,hasHighlighted:!1};function Jr(e){return{...Gr,...e}}function Yr(e){return{...Kr,...e}}function Xr(e){return{...qr,...e}}var Zr={x:{attribute:`x`},y:{attribute:`y`},size:{whenState:`isHovered`,then:{attribute:`size`,defaultValue:12},else:{attribute:`size`,defaultValue:10}},color:{attribute:`color`,defaultValue:`#666`},label:{attribute:`label`},visibility:{whenState:`isHidden`,then:`hidden`,else:`visible`},labelVisibility:{whenState:`isHovered`,then:`visible`,else:`auto`},backdropVisibility:{whenState:`isHovered`,then:`visible`,else:`hidden`},backdropColor:`#ffffff`,backdropShadowColor:`rgba(0, 0, 0, 0.5)`,backdropShadowBlur:12,backdropPadding:6},Qr={size:{attribute:`size`,defaultValue:1},color:{attribute:`color`,defaultValue:`#ccc`},label:{attribute:`label`},visibility:{whenState:`isHidden`,then:`hidden`,else:`visible`}},$r={nodes:Zr,edges:Qr},ei={nodes:{...Zr,depth:{whenState:`isHovered`,then:`topNodes`,else:`nodes`}},edges:{...Qr,depth:{whenState:[`isHighlighted`,`isHovered`],then:`topEdges`,else:`edges`}}};function ti(e){return`min`in e||`max`in e||`minValue`in e||`maxValue`in e||`easing`in e}function ni(e){return`dict`in e}function ri(e,t){return typeof e==`string`?t[e]===!0:Array.isArray(e)?e.every(e=>t[e]===!0):typeof e==`object`&&e?Object.entries(e).every(([e,n])=>t[e]===n):!1}function ii(e,t){let n=t[e.attribute];return n===void 0?e.defaultValue:n}function ai(e,t,n){let r=t[e.attribute];if(r===void 0)return e.defaultValue;let i=Number(r);if(isNaN(i))return e.defaultValue;if(e.min===void 0&&e.max===void 0)return i;let a=e.minValue??i,o=e.maxValue??i;if(o===a)return e.min??i;let s=(i-a)/(o-a);s=Math.max(0,Math.min(1,s)),s=me(e.easing)(s);let c=e.min??0,l=e.max??1;return c+s*(l-c)}function oi(e,t){let n=t[e.attribute];if(n===void 0)return e.defaultValue;let r=String(n);return r in e.dict?e.dict[r]:e.defaultValue}function si(e,t,n){return ni(e)?oi(e,t):ti(e)?ai(e,t,n):ii(e,t)}function ci(e,t){return typeof e==`string`?!!t[e]:Array.isArray(e)?e.every(e=>!!t[e]):typeof e==`object`&&e?Object.entries(e).every(([e,n])=>t[e]===n):!1}function li(e,t,n,r,i,a){if(e==null)return a;if(typeof e!=`object`&&typeof e!=`function`)return e;if(Hr(e)){let o=e.when(t,n,r,i)?e.then:e.else;return o===void 0?a:li(o,t,n,r,i,a)}if(Ur(e)){let o=ri(e.whenState,n)?e.then:e.else;return o===void 0?a:li(o,t,n,r,i,a)}if(Wr(e)){let o=ci(e.whenData,t)?e.then:e.else;return o===void 0?a:li(o,t,n,r,i,a)}return Vr(e)?e(t,n,r,i)??a:Br(e)?si(e,t,i)??a:e}function F(e){return e==null?`static`:Hr(e)?`graph-state`:Ur(e)?I(`item-state`,I(F(e.then),e.else===void 0?`static`:F(e.else))):Wr(e)?I(F(e.then),e.else===void 0?`static`:F(e.else)):Vr(e)?`graph-state`:(Br(e),`static`)}function I(e,t){return e===`graph-state`||t===`graph-state`?`graph-state`:e===`item-state`||t===`item-state`?`item-state`:`static`}function ui(e){if(!e)return{dependency:`static`,xAttribute:null,yAttribute:null};let t=Array.isArray(e)?e:[e],n=`static`,r=null,i=null;for(let e of t)if(`matchData`in e&&`cases`in e){let t=e.cases;for(let e of Object.values(t))for(let t of Object.values(e))n=I(n,F(t))}else if(`matchState`in e&&`cases`in e){n=I(n,`item-state`);let t=e.cases;for(let e of Object.values(t))for(let t of Object.values(e))n=I(n,F(t))}else if(`when`in e&&`then`in e)n=`graph-state`;else if(`whenState`in e){n=I(n,`item-state`);let t=e.then;if(t&&typeof t==`object`)for(let e of Object.values(t))n=I(n,F(e));let r=e.else;if(r&&typeof r==`object`)for(let e of Object.values(r))n=I(n,F(e))}else if(`whenData`in e){let t=e.then;if(t&&typeof t==`object`)for(let e of Object.values(t))n=I(n,F(e));let r=e.else;if(r&&typeof r==`object`)for(let e of Object.values(r))n=I(n,F(e))}else for(let[t,a]of Object.entries(e))if(!fi.has(t)&&(n=I(n,F(a)),(t===`x`||t===`y`)&&Br(a))){let e=a.attribute;t===`x`&&!r&&(r=e),t===`y`&&!i&&(i=e)}return{dependency:n,xAttribute:r,yAttribute:i}}var L={size:10,color:`#666`,opacity:1,shape:`circle`,rotationAlignment:`viewport`,labelRotationAlignment:`viewport`,visibility:`visible`,depth:`nodes`,zIndex:0,label:``,labelColor:`#000`,labelSize:12,labelFont:`sans-serif`,labelVisibility:`auto`,labelPosition:`right`,labelAngle:0,labelDepth:`nodes`,backdropVisibility:`hidden`,backdropColor:`transparent`,backdropShadowColor:`transparent`,backdropShadowBlur:0,backdropPadding:0,backdropBorderColor:`transparent`,backdropBorderWidth:0,backdropCornerRadius:0,backdropLabelPadding:-1,backdropArea:`both`,labelAttachment:null,labelAttachmentPlacement:`below`},di={size:1,color:`#ccc`,opacity:1,path:`straight`,selfLoopPath:`loop`,parallelSpread:.25,tail:`none`,head:`none`,visibility:`visible`,depth:`edges`,zIndex:0,label:``,labelColor:`#666`,labelVisibility:`auto`,labelDepth:`edges`},fi=new Set([`when`,`whenState`,`whenData`,`then`,`else`]),pi=Object.keys(L),mi=Object.values(L),hi=Object.keys(di),gi=Object.values(di);function _i(e,t,n,r,i,a,o){for(let s in t){if(fi.has(s))continue;let c=e[s]??o[s];e[s]=li(t[s],n,r,i,a,c)}`depth`in t&&!(`labelDepth`in t)&&(e.labelDepth=e.depth)}function vi(e,t,n,r,i,a,o){for(let s of t)if(`matchData`in s&&`cases`in s){let t=String(n[s.matchData]??``),c=s.cases;t in c&&_i(e,c[t],n,r,i,a,o)}else if(`matchState`in s&&`cases`in s){let t=String(r[s.matchState]??``),c=s.cases;t in c&&_i(e,c[t],n,r,i,a,o)}else if(`when`in s&&`then`in s){let t=s.when;if(!t(n,r,i,a))continue;_i(e,s.then,n,r,i,a,o)}else if(`whenState`in s&&`then`in s){if(!ri(s.whenState,r))continue;_i(e,s.then,n,r,i,a,o)}else if(`whenData`in s&&`then`in s){if(!ci(s.whenData,n))continue;_i(e,s.then,n,r,i,a,o)}else _i(e,s,n,r,i,a,o)}function yi(e,t,n,r,i,a){let o=a||{},s=o;for(let e=0,t=pi.length;e<t;e++)s[pi[e]]=mi[e];return s.x=void 0,s.y=void 0,s.labelBackgroundColor=void 0,s.labelBackgroundPadding=void 0,s.labelCursor=void 0,e?(vi(s,Array.isArray(e)?e:[e],t,n,r,i,L),o):(s.x=t.x??0,s.y=t.y??0,o.size=t.size??10,o.color=t.color??`#666`,o.label=t.label??``,o)}function bi(e,t,n,r,i,a){let o=a||{},s=o;for(let e=0,t=hi.length;e<t;e++)s[hi[e]]=gi[e];return e?(vi(s,Array.isArray(e)?e:[e],t,n,r,i,di),typeof s.labelPosition==`number`&&(s.labelPosition=void 0),o):(o.size=t.size??1,o.color=t.color??`#ccc`,o.label=t.label??``,o)}function xi(e,t,n){if(e==null)return n;if(typeof e==`function`)return e(t)??n;if(typeof e==`object`&&`when`in e){let r=e,i=r.when(t)?r.then:r.else;return i===void 0?n:typeof i==`function`?i(t)??n:i??n}if(typeof e==`object`&&`whenState`in e){let r=e,i=ri(r.whenState,t)?r.then:r.else;return i===void 0?n:typeof i==`function`?i(t)??n:i??n}return e??n}function Si(e,t){let n={};if(!e)return n;let r=Array.isArray(e)?e:[e];for(let e of r)if(`when`in e&&`then`in e){let r=e.when(t)?e.then:e.else;r&&typeof r==`object`&&Ci(n,r,t)}else if(`whenState`in e&&`then`in e){let r=ri(e.whenState,t)?e.then:e.else;r&&typeof r==`object`&&Ci(n,r,t)}else Ci(n,e,t);return n}function Ci(e,t,n){for(let[r,i]of Object.entries(t))fi.has(r)||(e[r]=xi(i,n))}var wi=class extends Kt.EventEmitter{constructor(){super(),this.rawEmitter=this}},Ti=zr,Ei=1.5,Di={x:.5,y:.5,angle:0,ratio:1},Oi=class e extends wi{constructor(...e){super(...e),this.minRatio=null,this.maxRatio=null,this.enabled=!0,this.enabledZooming=!0,this.enabledPanning=!0,this.enabledRotation=!0,this.constrainState=null,this.state={...Di},this.previousState={...Di},this.nextFrame=null,this.currentAnimationFrom=null,this.currentAnimationTo=null,this.animationCallback=null}get x(){return this.state.x}get y(){return this.state.y}get angle(){return this.state.angle}get ratio(){return this.state.ratio}static from(t){return new e().setState(t)}getState(){return{...this.state}}getPreviousState(){return{...this.previousState}}getBoundedRatio(e){let t=e;return typeof this.minRatio==`number`&&(t=Math.max(t,this.minRatio)),typeof this.maxRatio==`number`&&(t=Math.min(t,this.maxRatio)),t}validateState(e){let t=this.getState();return this.enabledPanning&&typeof e.x==`number`&&(t.x=e.x),this.enabledPanning&&typeof e.y==`number`&&(t.y=e.y),this.enabledZooming&&typeof e.ratio==`number`&&(t.ratio=this.getBoundedRatio(e.ratio)),this.enabledRotation&&typeof e.angle==`number`&&(t.angle=e.angle),this.constrainState?this.constrainState(t):t}isAnimating(){return this.nextFrame!==null}setState(e){if(!this.enabled)return this;let t=this.validateState(e);return We(this.state,t)||(this.previousState=this.state,this.state=t,this.emit(`updated`,this.getState())),this}updateState(e){return this.setState(e(this.getState())),this}animate(e,t){return this.enabled?new Promise(n=>this.runAnimation(e,{...he,...t},n)):Promise.resolve()}cancelAnimation(){return this.nextFrame!==null&&(cancelAnimationFrame(this.nextFrame),this.nextFrame=null),this.resolveAnimation(),this.emitAnimationEnd(!1),this}zoomIn({factor:e=Ei,...t}={}){return this.animate({ratio:this.ratio/e},t)}zoomOut({factor:e=Ei,...t}={}){return this.animate({ratio:this.ratio*e},t)}reset(e){return this.animate(Di,e)}runAnimation(e,t,n){let r=me(t.easing),i=Date.now(),a=this.getState(),o=this.validateState(e),s=()=>{if(!this.enabled){this.cancelAnimation();return}let e=t.duration>0?(Date.now()-i)/t.duration:1;if(e>=1){this.nextFrame=null,this.setState(o),this.resolveAnimation(),this.emitAnimationEnd(!0);return}let n=r(e);this.setState({x:a.x+(o.x-a.x)*n,y:a.y+(o.y-a.y)*n,angle:a.angle+(o.angle-a.angle)*n,ratio:a.ratio+(o.ratio-a.ratio)*n}),this.nextFrame=requestAnimationFrame(s)};this.cancelAnimation(),this.currentAnimationFrom=a,this.currentAnimationTo=o,this.animationCallback=n,this.emit(`animationStart`,{from:a,to:o}),s()}resolveAnimation(){let e=this.animationCallback;this.animationCallback=null,e&&e()}emitAnimationEnd(e){let t=this.currentAnimationFrom,n=this.currentAnimationTo;t&&n&&(this.currentAnimationFrom=null,this.currentAnimationTo=null,this.emit(`animationEnd`,{from:t,to:n,completed:e}))}},ki={hideEdgesOnMove:!1,hideLabelsOnMove:!1,renderLabels:!0,renderEdgeLabels:!1,edgeLabelAnchors:`nodeLabels`,enableEdgeEvents:!1,nodeLabelEvents:!1,edgeLabelEvents:!1,pickingDownSizingRatio:2,nodePickingPadding:0,edgePickingPadding:4,labelPickingPadding:10,stagePadding:30,minEdgeThickness:1.7,antiAliasingFeather:1,antialiasEdges:!0,antialiasNodes:!0,dragTimeout:100,draggedEventsTolerance:3,inertiaDuration:200,inertiaRatio:3,zoomDuration:250,zoomingRatio:1.7,doubleClickTimeout:300,doubleClickZoomingRatio:2.2,doubleClickZoomingDuration:200,tapMoveTolerance:10,zoomToSizeRatioFunction:Math.sqrt,itemSizesReference:`positions`,autoRescale:!0,autoRescaleContent:`positions`,enableNodeDrag:!1,getDraggedNodes:e=>[e],dragPositionToAttributes:null,labelDensity:1,labelGridCellSize:100,labelRenderedSizeThreshold:6,labelPixelSnapping:!0,minCameraRatio:null,maxCameraRatio:null,enableCameraZooming:!0,enableCameraPanning:!0,enableCameraRotation:!0,enableCameraMouseRotation:!0,cameraPanBoundaries:null,gestureTarget:`graph`,sharedGestureWheelMessage:`Use Ctrl + scroll to zoom the graph`,sharedGestureAppleWheelMessage:`Use ⌘ + scroll to zoom the graph`,sharedGestureTouchMessage:`Use two fingers to move the graph`,allowInvalidContainer:!1,DEBUG_displayPickingLayer:!1,DEBUG_logShaders:!1,DEBUG_logRenderStats:!1,DEBUG_gpuTimerQueries:!1};function Ai(e){if(typeof e.labelDensity!=`number`||e.labelDensity<0)throw Error("Settings: invalid `labelDensity`. Expecting a positive number.");let{minCameraRatio:t,maxCameraRatio:n}=e;if(typeof t==`number`&&typeof n==`number`&&n<t)throw Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.")}function ji(e){return He({},ki,e)}function R(e,t){let n=t.getBoundingClientRect();return{x:e.clientX-n.left,y:e.clientY-n.top}}function z(e,t){let n={...R(e,t),sigmaDefaultPrevented:!1,preventSigmaDefault(){n.sigmaDefaultPrevented=!0},original:e};return n}function B(e){let t=`x`in e?e:{...e.touches[0]||e.previousTouches[0],original:e.original,sigmaDefaultPrevented:e.sigmaDefaultPrevented,preventSigmaDefault:()=>{e.sigmaDefaultPrevented=!0,t.sigmaDefaultPrevented=!0}};return t}function Mi(e,t){let n=z(e,t);return n.delta=Ii(e),n}var Ni=2;function Pi(e){let t=[];for(let n=0,r=Math.min(e.length,Ni);n<r;n++)t.push(e[n]);return t}function Fi(e,t,n){let r={touches:Pi(e.touches).map(e=>R(e,n)),previousTouches:t.map(e=>R(e,n)),sigmaDefaultPrevented:!1,preventSigmaDefault(){r.sigmaDefaultPrevented=!0},original:e};return r}function Ii(e){if(e.deltaY!==void 0)return e.deltaY*-3/360;if(e.detail!==void 0)return e.detail/-9;throw Error(`Captor: could not extract delta from event.`)}var Li=class extends wi{constructor(e,t){super(),this.container=e,this.renderer=t}},Ri=[`doubleClickTimeout`,`doubleClickZoomingDuration`,`doubleClickZoomingRatio`,`dragTimeout`,`draggedEventsTolerance`,`enableCameraMouseRotation`,`gestureTarget`,`inertiaDuration`,`inertiaRatio`,`zoomDuration`,`zoomingRatio`].reduce((e,t)=>({...e,[t]:ki[t]}),{});function zi(e){return e instanceof PointerEvent&&e.pointerType===`touch`}var Bi=class extends Li{constructor(e,t){super(e,t),this.enabled=!0,this.draggedEvents=0,this.downStartTime=null,this.lastMouseX=null,this.lastMouseY=null,this.isMouseDown=!1,this.isMoving=!1,this.isPanningStage=!1,this.movingTimeout=null,this.startCameraState=null,this.clicks=0,this.doubleClickTimeout=null,this.isRightMouseDown=!1,this.startRotationAngle=null,this.startCameraAngle=null,this.currentWheelDirection=0,this.lastWheelAnimationId=0,this.settings=Ri,this.handleRightClick=this.handleRightClick.bind(this),this.handleDown=this.handleDown.bind(this),this.handleUp=this.handleUp.bind(this),this.handleMove=this.handleMove.bind(this),this.handleWheel=this.handleWheel.bind(this),this.handleLeave=this.handleLeave.bind(this),this.handleEnter=this.handleEnter.bind(this),e.addEventListener(`contextmenu`,this.handleRightClick,{capture:!1}),e.addEventListener(`pointerdown`,this.handleDown,{capture:!1}),e.addEventListener(`wheel`,this.handleWheel,{capture:!1,passive:!1}),e.addEventListener(`pointerleave`,this.handleLeave,{capture:!1}),e.addEventListener(`pointerenter`,this.handleEnter,{capture:!1}),document.addEventListener(`pointermove`,this.handleMove,{capture:!1}),document.addEventListener(`pointerup`,this.handleUp,{capture:!1})}kill(){let e=this.container;e.removeEventListener(`contextmenu`,this.handleRightClick),e.removeEventListener(`pointerdown`,this.handleDown),e.removeEventListener(`wheel`,this.handleWheel),e.removeEventListener(`pointerleave`,this.handleLeave),e.removeEventListener(`pointerenter`,this.handleEnter),document.removeEventListener(`pointermove`,this.handleMove),document.removeEventListener(`pointerup`,this.handleUp)}handleClick(e){if(this.enabled){if(this.clicks++,this.clicks===2)return this.clicks=0,typeof this.doubleClickTimeout==`number`&&(clearTimeout(this.doubleClickTimeout),this.doubleClickTimeout=null),this.handleDoubleClick(e);setTimeout(()=>{this.clicks=0,this.doubleClickTimeout=null},this.settings.doubleClickTimeout),this.draggedEvents<this.settings.draggedEventsTolerance&&this.emit(`click`,z(e,this.container))}}handleRightClick(e){this.enabled&&(this.settings.enableCameraMouseRotation&&e.preventDefault(),this.emit(`rightClick`,z(e,this.container)))}handleDoubleClick(e){if(!this.enabled)return;e.preventDefault(),e.stopPropagation();let t=z(e,this.container);if(this.emit(`doubleClick`,t),t.sigmaDefaultPrevented)return;let n=this.renderer.getCamera(),r=n.getBoundedRatio(n.getState().ratio/this.settings.doubleClickZoomingRatio);n.animate(this.renderer.getViewportZoomedState(R(e,this.container),r),{easing:`quadraticInOut`,duration:this.settings.doubleClickZoomingDuration})}handleDown(e){if(this.enabled&&!zi(e)){if(e.button===0){this.startCameraState=this.renderer.getCamera().getState();let{x:t,y:n}=R(e,this.container);this.lastMouseX=t,this.lastMouseY=n,this.draggedEvents=0,this.downStartTime=Date.now(),this.isMouseDown=!0}if(e.button===2&&this.settings.enableCameraMouseRotation){let{x:t,y:n}=R(e,this.container),r=this.container.offsetWidth/2,i=this.container.offsetHeight/2;this.startRotationAngle=Math.atan2(n-i,t-r),this.startCameraAngle=this.renderer.getCamera().getState().angle,this.isRightMouseDown=!0}this.emit(`mousedown`,z(e,this.container))}}handleUp(e){if(!this.enabled||zi(e)||!this.isMouseDown&&!this.isRightMouseDown)return;if(this.isRightMouseDown){this.isRightMouseDown=!1,this.startRotationAngle=null,this.startCameraAngle=null,this.emit(`mouseup`,z(e,this.container));return}let t=this.renderer.getCamera();this.isMouseDown=!1,this.isPanningStage&&(this.isPanningStage=!1,this.renderer._setPanning(!1)),typeof this.movingTimeout==`number`&&(clearTimeout(this.movingTimeout),this.movingTimeout=null);let{x:n,y:r}=R(e,this.container),i=t.getState(),a=t.getPreviousState();this.isMoving?t.animate({x:i.x+this.settings.inertiaRatio*(i.x-a.x),y:i.y+this.settings.inertiaRatio*(i.y-a.y)},{duration:this.settings.inertiaDuration,easing:`quadraticOut`}):(this.lastMouseX!==n||this.lastMouseY!==r)&&t.setState({x:i.x,y:i.y}),this.isMoving=!1,setTimeout(()=>{let e=this.draggedEvents>0;this.draggedEvents=0;let t=this.renderer.getSetting(`hideEdgesOnMove`)||this.renderer.getSetting(`hideLabelsOnMove`);e&&t&&this.renderer.refresh()},0),this.emit(`mouseup`,z(e,this.container)),(e.target===this.container||e.composedPath()[0]===this.container)&&this.handleClick(e)}handleMove(e){if(!this.enabled||zi(e))return;let t=z(e,this.container);if(this.emit(`mousemovebody`,t),(e.target===this.container||e.composedPath()[0]===this.container)&&this.emit(`mousemove`,t),this.isMouseDown&&this.draggedEvents++,!t.sigmaDefaultPrevented){if(this.isMouseDown){this.isMoving=!0,typeof this.movingTimeout==`number`&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(()=>{this.movingTimeout=null,this.isMoving=!1},this.settings.dragTimeout);let t=this.renderer.getCamera(),{x:n,y:r}=R(e,this.container),i=this.renderer.viewportToFramedGraph({x:this.lastMouseX,y:this.lastMouseY}),a=this.renderer.viewportToFramedGraph({x:n,y:r}),o=i.x-a.x,s=i.y-a.y,c=t.getState(),l=c.x+o,u=c.y+s;this.isPanningStage||(this.isPanningStage=!0,this.renderer._setPanning(!0)),t.setState({x:l,y:u}),this.lastMouseX=n,this.lastMouseY=r,e.preventDefault(),e.stopPropagation()}if(this.isRightMouseDown){let{x:t,y:n}=R(e,this.container),r=this.container.offsetWidth/2,i=this.container.offsetHeight/2,a=Math.atan2(n-i,t-r)-this.startRotationAngle;this.renderer.getCamera().setState({angle:this.startCameraAngle+a}),e.preventDefault(),e.stopPropagation()}}}handleLeave(e){zi(e)||this.emit(`mouseleave`,z(e,this.container))}handleEnter(e){zi(e)||this.emit(`mouseenter`,z(e,this.container))}handleWheel(e){let t=this.renderer.getCamera();if(!this.enabled||!t.enabledZooming)return;let n=Mi(e,this.container);if(this.emit(`wheel`,n),n.sigmaDefaultPrevented)return;let{gestureTarget:r}=this.settings;if(r===`page`)return;if(r===`shared`&&!e.ctrlKey&&!e.metaKey){this.renderer._showGestureHint(`wheel`);return}let i=Ii(e);if(!i)return;e.preventDefault(),e.stopPropagation();let a=t.getState().ratio,o=i>0?1/this.settings.zoomingRatio:this.settings.zoomingRatio,s=t.getBoundedRatio(a*o),c=i>0?1:-1,l=Date.now();if(a===s||this.currentWheelDirection===c&&this.lastWheelTriggerTime&&l-this.lastWheelTriggerTime<this.settings.zoomDuration/5)return;let u=++this.lastWheelAnimationId;t.animate(this.renderer.getViewportZoomedState(R(e,this.container),s),{easing:`quadraticOut`,duration:this.settings.zoomDuration}).then(()=>{this.lastWheelAnimationId===u&&(this.currentWheelDirection=0)}),this.currentWheelDirection=c,this.lastWheelTriggerTime=l}setSettings(e){this.settings=e}},Vi=[`dragTimeout`,`gestureTarget`,`inertiaDuration`,`inertiaRatio`,`doubleClickTimeout`,`doubleClickZoomingRatio`,`doubleClickZoomingDuration`,`tapMoveTolerance`].reduce((e,t)=>({...e,[t]:ki[t]}),{}),Hi=class extends Li{constructor(e,t){super(e,t),this.enabled=!0,this.isMoving=!1,this.hasMoved=!1,this.isPanningStage=!1,this.isZoomingStage=!1,this.touchMode=0,this.startTouchesPositions=[],this.lastTouches=[],this.lastTap=null,this.settings=Vi,this.handleStart=this.handleStart.bind(this),this.handleLeave=this.handleLeave.bind(this),this.handleMove=this.handleMove.bind(this),e.addEventListener(`touchstart`,this.handleStart,{capture:!1}),e.addEventListener(`touchcancel`,this.handleLeave,{capture:!1}),document.addEventListener(`touchend`,this.handleLeave,{capture:!1,passive:!1}),document.addEventListener(`touchmove`,this.handleMove,{capture:!1,passive:!1})}kill(){let e=this.container;e.removeEventListener(`touchstart`,this.handleStart),e.removeEventListener(`touchcancel`,this.handleLeave),document.removeEventListener(`touchend`,this.handleLeave),document.removeEventListener(`touchmove`,this.handleMove)}getDimensions(){return{width:this.container.offsetWidth,height:this.container.offsetHeight}}doesCapture(e){let{gestureTarget:t}=this.settings;return t===`graph`||t!==`page`&&e>=2}syncStageFlags(){let e=this.touchMode===1&&this.hasMoved,t=this.touchMode===2;e!==this.isPanningStage&&(this.isPanningStage=e,this.renderer._setPanning(e)),t!==this.isZoomingStage&&(this.isZoomingStage=t,this.renderer._setZooming(t))}handleStart(e){if(!this.enabled)return;let t=Pi(e.touches);if(this.touchMode=t.length,this.startCameraState=this.renderer.getCamera().getState(),this.startTouchesPositions=t.map(e=>R(e,this.container)),this.touchMode===2){let[{x:e,y:t},{x:n,y:r}]=this.startTouchesPositions;this.startTouchesAngle=Math.atan2(r-t,n-e),this.startTouchesDistance=Math.sqrt((n-e)**2+(r-t)**2)}this.syncStageFlags(),this.emit(`touchdown`,Fi(e,this.lastTouches,this.container)),this.lastTouches=t,this.lastTouchesPositions=this.startTouchesPositions,e.cancelable&&(this.doesCapture(e.touches.length)||this.renderer._hasNodeDrag())&&e.preventDefault()}handleLeave(e){if(this.enabled&&this.startTouchesPositions.length){switch(e.cancelable&&this.doesCapture(this.touchMode)&&e.preventDefault(),this.movingTimeout&&(this.isMoving=!1,clearTimeout(this.movingTimeout)),this.touchMode){case 2:if(e.touches.length===1){this.handleStart(e);break}case 1:if(this.isMoving){let e=this.renderer.getCamera(),t=e.getState(),n=e.getPreviousState();e.animate({x:t.x+this.settings.inertiaRatio*(t.x-n.x),y:t.y+this.settings.inertiaRatio*(t.y-n.y)},{duration:this.settings.inertiaDuration,easing:`quadraticOut`})}this.hasMoved=!1,this.isMoving=!1,this.touchMode=0}if(this.syncStageFlags(),this.emit(`touchup`,Fi(e,this.lastTouches,this.container)),!e.touches.length){let t=R(this.lastTouches[0],this.container),n=this.startTouchesPositions[0],r=(t.x-n.x)**2+(t.y-n.y)**2;if(!e.touches.length&&r<this.settings.tapMoveTolerance**2){if(this.lastTap&&Date.now()-this.lastTap.time<this.settings.doubleClickTimeout){let n=Fi(e,this.lastTouches,this.container);if(this.emit(`doubletap`,n),this.lastTap=null,!n.sigmaDefaultPrevented&&this.settings.gestureTarget!==`page`){let e=this.renderer.getCamera(),n=e.getBoundedRatio(e.getState().ratio/this.settings.doubleClickZoomingRatio);e.animate(this.renderer.getViewportZoomedState(t,n),{easing:`quadraticInOut`,duration:this.settings.doubleClickZoomingDuration})}}else{let t=Fi(e,this.lastTouches,this.container);this.emit(`tap`,t),this.lastTap={time:Date.now(),position:t.touches[0]||t.previousTouches[0]}}}}this.lastTouches=Pi(e.touches),this.startTouchesPositions=[]}}handleMove(e){if(!this.enabled||!this.startTouchesPositions.length)return;let t=this.doesCapture(e.touches.length);t&&e.preventDefault();let n=Pi(e.touches),r=n.map(e=>R(e,this.container)),i=this.lastTouches;this.lastTouches=n,this.lastTouchesPositions=r;let a=Fi(e,i,this.container);if(this.emit(`touchmove`,a),a.sigmaDefaultPrevented||(this.hasMoved||=r.some((e,t)=>{let n=this.startTouchesPositions[t];return n&&(e.x!==n.x||e.y!==n.y)}),!this.hasMoved))return;if(!t){this.settings.gestureTarget===`shared`&&this.renderer._showGestureHint(`touch`);return}this.isMoving=!0,this.syncStageFlags(),this.movingTimeout&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(()=>{this.isMoving=!1},this.settings.dragTimeout);let o=this.renderer.getCamera(),s=this.startCameraState,c=this.renderer.getSetting(`stagePadding`);switch(this.touchMode){case 1:{let{x:e,y:t}=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0]),{x:n,y:i}=this.renderer.viewportToFramedGraph(r[0]);o.setState({x:s.x+e-n,y:s.y+t-i});break}case 2:{let e={x:.5,y:.5,angle:0,ratio:1},{x:t,y:n}=r[0],{x:i,y:a}=r[1],l=Math.atan2(a-n,i-t)-this.startTouchesAngle,u=Math.hypot(a-n,i-t)/this.startTouchesDistance,d=o.getBoundedRatio(s.ratio/u);e.ratio=d,e.angle=s.angle+l;let f=this.getDimensions(),p=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0],{cameraState:s}),m=Math.min(f.width,f.height)-2*c,h=m/f.width,g=m/f.height,_=d/m,v=t-m/2/h,y=n-m/2/g;({x:v,y}=be({x:v,y},e.angle)),e.x=p.x-v*_,e.y=p.y+y*_,o.setState(e);break}}}setSettings(e){this.settings=e}},Ui=class{constructor(e,t,n,r){this.graph=e,this.viewportToGraph=t,this.setNodesState=n,this.emit=r,this.pendingNode=null,this.session=null}start(e,t,n,r,i){let a=n(e),o=!1;if(this.emit(`nodeDragStart`,{node:e,allDraggedNodes:a,event:t,preventSigmaDefault(){o=!0}}),o)return!1;let s=new Map;for(let e of a)s.set(e,{x:this.graph.getNodeAttribute(e,r),y:this.graph.getNodeAttribute(e,i)});return this.session={node:e,allNodes:a,startPosition:this.viewportToGraph(t),startNodePositions:s,xAttr:r,yAttr:i},this.setNodesState(a,{isDragged:!0}),!0}applyMove(e,t){let{allNodes:n,startNodePositions:r,startPosition:i,xAttr:a,yAttr:o}=this.session,s=this.viewportToGraph(e),c={x:s.x-i.x,y:s.y-i.y};for(let e of n){let n=r.get(e);if(!n||!this.graph.hasNode(e))continue;let i={x:n.x+c.x,y:n.y+c.y};t?this.graph.mergeNodeAttributes(e,t(i,e)):(this.graph.setNodeAttribute(e,a,i.x),this.graph.setNodeAttribute(e,o,i.y))}}end(){if(this.pendingNode=null,!this.session)return null;let{node:e,allNodes:t}=this.session;return this.setNodesState(t,{isDragged:!1}),this.session=null,{node:e,allNodes:t}}removeNode(e){e===this.pendingNode&&(this.pendingNode=null),this.session&&(this.session.node===e?(this.setNodesState(this.session.allNodes,{isDragged:!1}),this.session=null):this.session.allNodes.includes(e)&&(this.session.allNodes=this.session.allNodes.filter(t=>t!==e),this.session.startNodePositions.delete(e)))}clear(){this.pendingNode=null,this.session=null}};function Wi(e,t){return e<t?`${e}\0${t}`:`${t}\0${e}`}var Gi=class{constructor(e,t){this.graph=e,this.onGroupChanged=t,this.groups=new Map,this.edgeToGroupKey=new Map}getGroupKey(e){return Wi(this.graph.source(e),this.graph.target(e))}sortGroup(e,t){let n=t.split(`\0`)[0];e.sort((e,t)=>(this.graph.source(e)===n||!this.graph.isDirected(e)?0:1)-(this.graph.source(t)===n||!this.graph.isDirected(t)?0:1))}register(e){let t=this.getGroupKey(e),n=this.groups.get(t);n||(n=[],this.groups.set(t,n)),n.includes(e)||n.push(e),this.edgeToGroupKey.set(e,t),n.length>1&&this.sortGroup(n,t),this.onGroupChanged(n,n.length)}unregister(e){let t=this.edgeToGroupKey.get(e);if(!t)return;this.edgeToGroupKey.delete(e);let n=this.groups.get(t);if(!n)return;let r=n.indexOf(e);r!==-1&&n.splice(r,1),n.length===0?this.groups.delete(t):this.onGroupChanged(n,n.length)}getGroup(e){let t=this.edgeToGroupKey.get(e);return t?this.groups.get(t)??[]:[]}getSiblings(e){return this.getGroup(e).filter(t=>t!==e)}rebuild(){this.groups.clear(),this.edgeToGroupKey.clear(),this.graph.forEachEdge((e,t,n,r)=>{let i=Wi(n,r),a=this.groups.get(i);a||(a=[],this.groups.set(i,a)),a.push(e),this.edgeToGroupKey.set(e,i)});for(let[e,t]of this.groups)t.length>1&&this.sortGroup(t,e),this.onGroupChanged(t,t.length)}clear(){this.groups.clear(),this.edgeToGroupKey.clear()}};function Ki(e,t){if(e===!1||e===`extend`||e===`separate`)return e;let n=e[t];return n===void 0?e.default??!1:n}function qi(e){return e===!1?!1:e===`extend`||e===`separate`||Object.values(e).some(e=>e===`extend`||e===`separate`)}function Ji(e){return e===`separate`?!0:e===!1||e===`extend`?!1:e.default===`separate`||Object.values(e).includes(`separate`)}var V={node:{parent:null,eventSuffix:`Node`,payloadKey:`node`,isEnabled:()=>!0,writesPickingThisFrame:()=>!0,setHover:(e,t,n)=>e.setNodeState(t,{isHovered:n}),getCursor:(e,t)=>e.nodeDataCache[t]?.cursor,isHitValid:(e,t)=>e.nodeDataCache[t]?.visibility!==`hidden`},edge:{parent:null,eventSuffix:`Edge`,payloadKey:`edge`,isEnabled:e=>!!e.settings.enableEdgeEvents,writesPickingThisFrame:e=>!!e.settings.enableEdgeEvents,setHover:(e,t,n)=>e.setEdgeState(t,{isHovered:n}),getCursor:(e,t)=>e.edgeDataCache[t]?.cursor},nodeLabel:{parent:`node`,eventSuffix:`NodeLabel`,payloadKey:`node`,isEnabled:e=>Ji(e.settings.nodeLabelEvents),writesPickingThisFrame:e=>qi(e.settings.nodeLabelEvents),setHover:(e,t,n)=>e.setNodeState(t,{isLabelHovered:n}),getCursor:(e,t)=>e.nodeDataCache[t]?.labelCursor,resolveForVerb:(e,t,n)=>{let r=Ki(n.settings.nodeLabelEvents,t);return r===!1?null:r===`extend`?{kind:`node`,key:e.key}:e}},edgeLabel:{parent:`edge`,eventSuffix:`EdgeLabel`,payloadKey:`edge`,isEnabled:e=>Ji(e.settings.edgeLabelEvents),writesPickingThisFrame:e=>qi(e.settings.edgeLabelEvents),setHover:(e,t,n)=>e.setEdgeState(t,{isLabelHovered:n}),getCursor:(e,t)=>e.edgeDataCache[t]?.labelCursor,resolveForVerb:(e,t,n)=>{let r=Ki(n.settings.edgeLabelEvents,t);return r===!1?null:r===`extend`?{kind:`edge`,key:e.key}:e}}},H=[`node`,`edge`,`nodeLabel`,`edgeLabel`];function Yi(){return{lookup:[null],idsByKind:{node:new Map,edge:new Map,nodeLabel:new Map,edgeLabel:new Map},nextId:1}}function Xi(e,t,n){return e.idsByKind[t].get(n)??0}function Zi(e,t){for(let n of H)if(n===t||V[n].parent===t){for(let t of e.idsByKind[n].values())e.lookup[t]=null;e.idsByKind[n]=new Map}let n=1;for(let r of H){if(r===t)break;n+=e.idsByKind[r].size}e.nextId=n}function Qi(e,t,n){let r=e.nextId++;return e.idsByKind[t].set(n,r),e.lookup[r]={kind:t,key:n},r}function $i(e,t,n){for(let r of ca(t)){let t=e.idsByKind[r].get(n);t!==void 0&&(e.lookup[t]=null,e.idsByKind[r].delete(n))}}function ea(e,t){for(let t of H)if(V[t].parent!==null){for(let n of e.idsByKind[t].values())e.lookup[n]=null;e.idsByKind[t]=new Map}e.nextId=1;for(let t of H)if(V[t].parent===null)for(let n of e.idsByKind[t].values())n>=e.nextId&&(e.nextId=n+1);for(let n of H){let r=V[n];if(r.parent!==null&&r.isEnabled(t))for(let t of e.idsByKind[r.parent].keys())e.idsByKind[n].set(t,e.nextId),e.lookup[e.nextId]={kind:n,key:t},e.nextId++}}function ta(e,t){for(let n of H){let r=e[n],i=t[n];if(r!==i){if(r.size!==i.size)return!1;for(let[e,t]of r)if(i.get(e)!==t)return!1}}return!0}function na(e,t,n){V[t.kind].setHover(e,t.key,n)}function ra(e,t){return V[t.kind].getCursor(e,t.key)}function ia(e,t){return`${t}${V[e].eventSuffix}`}function aa(e,t){return{...t,[V[e.kind].payloadKey]:e.key}}function oa(e,t,n){let r=V[t.kind].resolveForVerb;return r?r(t,n,e):t}function sa(e,t){let n=V[t.kind].isHitValid;return!n||n(e,t.key)}function ca(e){return H.filter(t=>t===e||V[t].parent===e)}function la(e,t,n){return t&&=oa(e,t,n),t&&!sa(e,t)&&(t=null),t}function ua(e,t,n){return la(e,n===`wheel`?e.stateManager.hovered:e.getHitAtPosition(t),n)}function da(e,t){return!e||!t?e===t:e.kind===t.kind&&e.key===t.key}function fa(e,t,n){let r={event:n,preventSigmaDefault:()=>n.preventSigmaDefault()},i=e.dragManager.session,a=i?{kind:`node`,key:i.node}:la(e,t,`enter`),{stateManager:o}=e,s=o.hovered;da(s,a)||(s&&(na(e,s,!1),e.emit(ia(s.kind,`leave`),aa(s,r))),o.setHovered(a),a&&(na(e,a,!0),e.emit(ia(a.kind,`enter`),aa(a,r))),e.updateContainerCursor())}function pa(e,t,n,r){r.handleResize=()=>e.scheduleRefresh(),window.addEventListener(`resize`,r.handleResize),r.handleMove=t=>{e.hoverResolver.pointerMoved(B(t))},r.handleMoveBody=t=>{let n=B(t),{dragManager:r}=e;if(r.pendingNode&&!r.session){let{xAttribute:t,yAttribute:i}=e.nodeStyleAnalysis,{settings:a}=e;r.start(r.pendingNode,n,a.getDraggedNodes,t||`x`,i||`y`),r.pendingNode=null}r.session&&(r.applyMove(n,e.settings.dragPositionToAttributes),e.emit(`nodeDrag`,{node:r.session.node,allDraggedNodes:r.session.allNodes,event:n}),n.preventSigmaDefault()),e.emit(`moveBody`,{event:n,preventSigmaDefault:()=>n.preventSigmaDefault()})},r.handleLeave=t=>{let n=B(t),r={event:n,preventSigmaDefault:()=>n.preventSigmaDefault()};e.hoverResolver.pointerLeft(),fa(e,null,n),e.emit(`leaveStage`,r)},r.handleEnter=t=>{let n=B(t);e.emit(`enterStage`,{event:n,preventSigmaDefault:()=>n.preventSigmaDefault()})};let i=t=>n=>{let r=B(n),i={event:r,preventSigmaDefault:()=>r.preventSigmaDefault()},a=ua(e,r,t);a?e.emit(ia(a.kind,t),aa(a,i)):e.emit(`${t}Stage`,i)};r.handleClick=i(`click`),r.handleRightClick=i(`rightClick`),r.handleDoubleClick=i(`doubleClick`),r.handleWheel=i(`wheel`),r.handleDown=t=>{let n=B(t),r={event:n,preventSigmaDefault:()=>n.preventSigmaDefault()},i=ua(e,n,`down`);i?(i.kind===`node`&&e.settings.enableNodeDrag&&(e.dragManager.pendingNode=i.key),e.emit(ia(i.kind,`down`),aa(i,r))):e.emit(`downStage`,r)},r.handleUp=t=>{let n=B(t),r={event:n,preventSigmaDefault:()=>n.preventSigmaDefault()},i=e.dragManager.end();i&&e.emit(`nodeDragEnd`,{node:i.node,allDraggedNodes:i.allNodes,...r});let a=ua(e,n,`up`);a?e.emit(ia(a.kind,`up`),aa(a,r)):e.emit(`upStage`,r)},t.on(`mousemove`,r.handleMove),t.on(`mousemovebody`,r.handleMoveBody),t.on(`click`,r.handleClick),t.on(`rightClick`,r.handleRightClick),t.on(`doubleClick`,r.handleDoubleClick),t.on(`wheel`,r.handleWheel),t.on(`mousedown`,r.handleDown),t.on(`mouseup`,r.handleUp),t.on(`mouseleave`,r.handleLeave),t.on(`mouseenter`,r.handleEnter),n.on(`touchdown`,r.handleDown),n.on(`touchdown`,r.handleMove),n.on(`touchup`,r.handleUp),n.on(`touchmove`,r.handleMove),n.on(`tap`,r.handleClick),n.on(`doubletap`,r.handleDoubleClick),n.on(`touchmove`,r.handleMoveBody)}function ma(e,t){let{graph:n}=e,r=new Set([`x`,`y`,`zIndex`,`type`]);t.eachNodeAttributesUpdatedGraphUpdate=t=>{let i=t.hints?.attributes,a=!i||i.some(e=>r.has(e));e.refresh({partialGraph:{nodes:n.nodes()},skipIndexation:!a,schedule:!0})},t.eachEdgeAttributesUpdatedGraphUpdate=t=>{let r=t.hints?.attributes,i=r&&[`zIndex`,`type`].some(e=>r?.includes(e));e.refresh({partialGraph:{edges:n.edges()},skipIndexation:!i,schedule:!0})},t.addNodeGraphUpdate=t=>{e.refresh({partialGraph:{nodes:[t.key]},skipIndexation:!1,schedule:!0})},t.updateNodeGraphUpdate=t=>{e.refresh({partialGraph:{nodes:[t.key]},skipIndexation:!1,schedule:!0})},t.dropNodeGraphUpdate=t=>{e.removeNode(t.key),e.scheduleProcess()},t.addEdgeGraphUpdate=t=>{let n=t.key;e.markNodesDirty([t.source,t.target]),e.edgeGroups.register(n);let r=e.edgeGroups.getSiblings(n);e.refresh({partialGraph:{edges:[n,...r]},schedule:!0})},t.updateEdgeGraphUpdate=t=>{e.refresh({partialGraph:{edges:[t.key]},skipIndexation:!1,schedule:!0})},t.dropEdgeGraphUpdate=t=>{let n=t.key;e.markNodesDirty([t.source,t.target]);let r=e.edgeGroups.getSiblings(n);e.edgeGroups.unregister(n),e.removeEdge(n);for(let t of r)e.addEdge(t);e.scheduleProcess()},t.clearEdgesGraphUpdate=()=>{e.clearEdgeState(),e.clearEdgeIndices(),e.refresh({schedule:!0})},t.clearGraphUpdate=()=>{e.clearEdgeState(),e.clearNodeState(),e.clearEdgeIndices(),e.clearNodeIndices(),e.refresh({schedule:!0})},n.on(`nodeAdded`,t.addNodeGraphUpdate),n.on(`nodeDropped`,t.dropNodeGraphUpdate),n.on(`nodeAttributesUpdated`,t.updateNodeGraphUpdate),n.on(`eachNodeAttributesUpdated`,t.eachNodeAttributesUpdatedGraphUpdate),n.on(`edgeAdded`,t.addEdgeGraphUpdate),n.on(`edgeDropped`,t.dropEdgeGraphUpdate),n.on(`edgeAttributesUpdated`,t.updateEdgeGraphUpdate),n.on(`eachEdgeAttributesUpdated`,t.eachEdgeAttributesUpdatedGraphUpdate),n.on(`edgesCleared`,t.clearEdgesGraphUpdate),n.on(`cleared`,t.clearGraphUpdate)}function ha(e,t){e.removeListener(`nodeAdded`,t.addNodeGraphUpdate),e.removeListener(`nodeDropped`,t.dropNodeGraphUpdate),e.removeListener(`nodeAttributesUpdated`,t.updateNodeGraphUpdate),e.removeListener(`eachNodeAttributesUpdated`,t.eachNodeAttributesUpdatedGraphUpdate),e.removeListener(`edgeAdded`,t.addEdgeGraphUpdate),e.removeListener(`edgeDropped`,t.dropEdgeGraphUpdate),e.removeListener(`edgeAttributesUpdated`,t.updateEdgeGraphUpdate),e.removeListener(`eachEdgeAttributesUpdated`,t.eachEdgeAttributesUpdatedGraphUpdate),e.removeListener(`edgesCleared`,t.clearEdgesGraphUpdate),e.removeListener(`cleared`,t.clearGraphUpdate)}var ga={x:.5,y:.5,angle:0,ratio:1},_a=8,va=.001;function ya(e){let{coords:t,nodeData:n,dimensions:r,stagePadding:i,zoomToSizeRatioFunction:a,itemSizesReference:o,fitLabels:s,nodeLabelBox:c}=e,l=Object.keys(t);if(!l.length)return e.extent;let u=a(1)||1,d=o===`positions`,{width:f,height:p}=r,m=e.extent;for(let e=0;e<_a;e++){let e=it(m),a=Ce(ga,r,{width:m.x[1]-m.x[0]||1,height:m.y[1]-m.y[0]||1},i),o=ba(a,e({x:0,y:0}),f,p),h=ba(a,e({x:1,y:0}),f,p),g=Math.hypot(h.x-o.x,h.y-o.y)||1,_=1/0,v=-1/0,y=1/0,b=-1/0;for(let e=0,r=l.length;e<r;e++){let r=l[e],i=n[r],a=i.size/u*(d?g:1),o=-a,f=a,p=-a,m=a;if(s){let e=c(i,a);e&&(e.minX<o&&(o=e.minX),e.maxX>f&&(f=e.maxX),e.minY<p&&(p=e.minY),e.maxY>m&&(m=e.maxY))}let{x:h,y:x}=t[r];_=Math.min(_,h+o/g),v=Math.max(v,h+f/g),y=Math.min(y,x-m/g),b=Math.max(b,x-p/g)}let x={x:[_,v],y:[y,b]},S=Math.max(x.x[1]-x.x[0],x.y[1]-x.y[0])||1,C=Math.max(Math.abs(x.x[0]-m.x[0]),Math.abs(x.x[1]-m.x[1]),Math.abs(x.y[0]-m.y[0]),Math.abs(x.y[1]-m.y[1]));if(m=x,C/S<va)break}return m}function ba(e,t,n,r){let i=xe(e,t);return{x:(1+i.x)*n/2,y:(1-i.y)*r/2}}var xa=typeof navigator<`u`&&/Mac|iP(hone|ad|od)/.test(navigator.platform),Sa=1500,Ca=`.sigma-gesture-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1em;
  background: #00000066;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: opacity 0.1s;
}`;function wa(e){let t=nt(`style`);t.textContent=e,document.head.appendChild(t);let n=(t.sheet?.cssRules.length??0)>0;return t.remove(),n}var Ta=null;function Ea(){return Ta===null&&(Ta=Ca,wa(`@scope {}`)&&(Ta=`@scope {\n${Ta}\n}`),wa(`@layer sigma-gesture-hint {}`)&&(Ta=`@layer sigma-gesture-hint {\n${Ta}\n}`)),Ta}var Da=class{constructor(e){this.hideTimeout=null,this.styleElement=nt(`style`),this.styleElement.textContent=Ea(),e.appendChild(this.styleElement),this.element=nt(`div`,{opacity:`0`},{class:`sigma-gesture-hint`}),e.appendChild(this.element)}show(e,t){let n=e===`touch`?t.sharedGestureTouchMessage:xa?t.sharedGestureAppleWheelMessage:t.sharedGestureWheelMessage;n&&(this.element.textContent=n,this.element.style.opacity=`1`,typeof this.hideTimeout==`number`&&clearTimeout(this.hideTimeout),this.hideTimeout=window.setTimeout(()=>{this.hideTimeout=null,this.element.style.opacity=`0`},Sa))}kill(){typeof this.hideTimeout==`number`&&clearTimeout(this.hideTimeout),this.styleElement.remove(),this.element.remove()}},Oa=class{constructor(e){this.readBuffer=null,this.fence=null,this.result=new Uint8Array(4),this.generation=0,this.readGeneration=0,this.lastEvent=null,this.active=!1,this.dirty=!1,this.rafId=null,this.killed=!1,this.options=e}pointerMoved(e){this.lastEvent=e,this.active=!0,this.options.isRenderPending()||this.request()}pointerLeft(){this.active=!1,this.dirty=!1}frameRendered(){this.request()}invalidate(){this.generation++}request(){!this.killed&&this.active&&this.lastEvent&&(this.fence?this.dirty=!0:this.startRead())}startRead(){let{gl:e,getFrameBuffer:t,getPixelRatio:n,getDownSizingRatio:r}=this.options;this.readGeneration=this.generation;let i=this.lastEvent,[a,o]=Te(e,i.x,i.y,n(),r());this.readBuffer||=e.createBuffer(),e.bindFramebuffer(e.FRAMEBUFFER,t()),e.bindBuffer(e.PIXEL_PACK_BUFFER,this.readBuffer),e.bufferData(e.PIXEL_PACK_BUFFER,4,e.STREAM_READ),e.readPixels(a,o,1,1,e.RGBA,e.UNSIGNED_BYTE,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),this.fence=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0),e.flush(),this.schedulePoll(i)}schedulePoll(e){this.rafId=requestAnimationFrame(()=>{this.rafId=null,this.poll(e)})}poll(e){let{gl:t,onIndex:n}=this.options;if(this.killed||!this.fence)return;let r=t.clientWaitSync(this.fence,0,0);if(r===t.TIMEOUT_EXPIRED)this.schedulePoll(e);else{if(t.deleteSync(this.fence),this.fence=null,r!==t.WAIT_FAILED&&this.readGeneration===this.generation){t.bindBuffer(t.PIXEL_PACK_BUFFER,this.readBuffer),t.getBufferSubData(t.PIXEL_PACK_BUFFER,0,this.result),t.bindBuffer(t.PIXEL_PACK_BUFFER,null);let[r,i,a,o]=this.result;this.active&&n(Re(r,i,a,o),e)}this.dirty&&(this.dirty=!1,this.active&&this.lastEvent&&!this.options.isRenderPending()&&this.startRead())}}reset(){this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null,this.fence=null,this.readBuffer=null,this.dirty=!1}kill(){this.killed=!0,this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null;let{gl:e}=this.options;this.fence&&e.deleteSync(this.fence),this.fence=null,this.readBuffer&&e.deleteBuffer(this.readBuffer),this.readBuffer=null}},ka=class{constructor(e,t){this.key=e,this.size=t}static compare(e,t){return e.size>t.size?-1:e.size<t.size||e.key>t.key?1:-1}},Aa=class{constructor(){this.width=0,this.height=0,this.cellSize=0,this.columns=0,this.rows=0,this.cells={}}resizeAndClear(e,t){this.width=e.width,this.height=e.height,this.cellSize=t,this.columns=Math.ceil(e.width/t),this.rows=Math.ceil(e.height/t),this.cells={}}getIndex(e){let t=Math.floor(e.x/this.cellSize);return Math.floor(e.y/this.cellSize)*this.columns+t}add(e,t,n){let r=new ka(e,t),i=this.getIndex(n),a=this.cells[i];a||(a=[],this.cells[i]=a),a.push(r)}organize(){for(let e in this.cells)this.cells[e].sort(ka.compare)}getLabelsToDisplay(e,t,n){let r=this.cellSize*this.cellSize,i=r/e/e*t/r,a=Math.ceil(i),o=[];if(n){let e=Math.max(0,Math.floor(n.x1/this.cellSize)),t=Math.min(this.columns-1,Math.floor(n.x2/this.cellSize)),r=Math.max(0,Math.floor(n.y1/this.cellSize)),i=Math.min(this.rows-1,Math.floor(n.y2/this.cellSize));for(let n=r;n<=i;n++)for(let r=e;r<=t;r++){let e=n*this.columns+r,t=this.cells[e];if(t)for(let e=0;e<Math.min(a,t.length);e++)o.push(t[e].key)}}else for(let e in this.cells){let t=this.cells[e];for(let e=0;e<Math.min(a,t.length);e++)o.push(t[e].key)}return o}};function ja(e){let{graph:t,hoveredNode:n,highlightedNodes:r,displayedNodeLabels:i}=e,a=new Set,o=new Set(r);n&&o.add(n);for(let e of o)t.hasNode(e)&&t.forEachEdge(e,e=>{a.add(e)});for(let e of i)o.has(e)||t.forEachEdge(e,(t,n,r,o)=>{let s=r===e?o:r;i.has(s)&&a.add(t)});return Array.from(a)}var Ma=150,Na=50,Pa={both:0,node:1,label:2},Fa={over:0,above:1,below:2,auto:3},Ia=12,La=3,Ra=class{constructor(e){this.internals=e,this.labelGrid=new Aa,this.edgeAnchorGrid=new Aa,this.displayedNodeLabels=new Set,this.displayedEdgeLabels=new Set,this.edgeLabelCandidates=[],this.renderedNodeLabels=new Set,this.labelSizeCache=new Map,this.framePassPoints=new Float32Array,this.labelsDirty=!0}resetFrame(){this.displayedNodeLabels=new Set,this.renderedNodeLabels=new Set,this.labelSizeCache.clear()}clearEdgeLabels(){this.displayedEdgeLabels=new Set}resetLabelGrid(){this.labelGrid=new Aa,this.edgeAnchorGrid=new Aa}processWebGLLabels(e){let{labelProgram:t,primitives:n,nodeDataCache:r}=this.internals,i=n?.nodes?.label?.font?.family||`sans-serif`,a=new Map;for(let t=0,n=e.length;t<n;t++){let n=r[e[t]];if(n.visibility===`hidden`||!n.label)continue;let o=n.labelFont||i,s=a.get(o);s?s.push(n.label):a.set(o,[n.label])}for(let[e,n]of a){let{family:r,weight:i,style:a}=tt(e),o=t.registerFont(r,i,a);t.ensureGlyphsReady(n,o)}}measureNodeLabel(e){if(!e.label)return{width:0,height:0,textHeight:0};let{labelProgram:t,primitives:n}=this.internals,r=e.labelSize??14,i=e.labelFont||n?.nodes?.label?.font?.family||`sans-serif`,a=`${e.label}|${r}|${i}`;if(this.labelSizeCache.has(a))return this.labelSizeCache.get(a);let{family:o,weight:s,style:c}=tt(i),l=t.registerFont(o,s,c),u=t.measureLabel(e.label,r,l);return this.labelSizeCache.set(a,u),u}nodeLabelBox(e,t){if(e.visibility===`hidden`||e.labelVisibility===`hidden`)return null;let{width:n,height:r,textHeight:i}=this.measureNodeLabel(e);if(!n)return null;let a=t+(this.internals.primitives?.nodes?.label?.margin??5),o=e.labelBackgroundColor?e.labelBackgroundPadding??3:0,s=n/2,c=r/2,l=s+o,u=c+o,d=i/2,f=0,p=0;switch(e.labelPosition??`right`){case`left`:f=-(a+s);break;case`above`:p=-(a+d);break;case`below`:p=a+d;break;case`over`:break;default:f=a+s}let m=e.labelAngle??0,{x:h,y:g}=be({x:f,y:p},m),_=Math.abs(Math.cos(m)),v=Math.abs(Math.sin(m)),y=_*l+v*u,b=v*l+_*u;return{minX:h-y,maxX:h+y,minY:g-b,maxY:g+b}}computeDisplayedNodeLabels(){let e=this.internals.getCameraState(),{width:t,height:n}=this.internals.getDimensions(),r=this.internals.viewportToFramedGraph({x:-150,y:-50}),i=this.internals.viewportToFramedGraph({x:t+Ma,y:-50}),a=this.internals.viewportToFramedGraph({x:-150,y:n+Na}),o=this.internals.viewportToFramedGraph({x:t+Ma,y:n+Na}),s=Math.min(r.x,i.x,a.x,o.x),c=Math.max(r.x,i.x,a.x,o.x),l=Math.min(r.y,i.y,a.y,o.y),u=Math.max(r.y,i.y,a.y,o.y),d=Ce({x:.5,y:.5,ratio:1,angle:0},{width:t,height:n},this.internals.getGraphDimensions(),this.internals.getStagePadding()),f=e=>{let r=xe(d,e);return{x:(1+r.x)*t/2,y:(1-r.y)*n/2}},p=f({x:s,y:l}),m=f({x:c,y:l}),h=f({x:s,y:u}),g=f({x:c,y:u}),_={x1:Math.min(p.x,m.x,h.x,g.x),y1:Math.min(p.y,m.y,h.y,g.y),x2:Math.max(p.x,m.x,h.x,g.x),y2:Math.max(p.y,m.y,h.y,g.y)},{settings:v,nodeDataCache:y,nodesWithForcedLabels:b}=this.internals,x=this.labelGrid.getLabelsToDisplay(e.ratio,v.labelDensity,_);Ve(x,b);for(let e=0,r=x.length;e<r;e++){let r=x[e],i=y[r];if(this.displayedNodeLabels.has(r)||i.visibility===`hidden`||i.labelVisibility===`hidden`||!i.label||i.x<s||i.x>c||i.y<l||i.y>u)continue;let{x:a,y:o}=this.internals.framedGraphToViewport(i),d=this.internals.scaleSize(i.size);!A(i)&&d<v.labelRenderedSizeThreshold||a<-150-d||a>t+Ma+d||o<-50-d||o>n+Na+d||this.displayedNodeLabels.add(r)}}buildFramePassPoints(){let{nodeDataCache:e,nodeDataTexture:t}=this.internals;if(!t)return{data:this.framePassPoints,count:0};let n=this.displayedNodeLabels.size*3;this.framePassPoints.length<n&&(this.framePassPoints=new Float32Array(n));let r=this.framePassPoints,i=0;for(let n of this.displayedNodeLabels){let a=e[n];if(!a)continue;let o=t.getIndex(n);o<0||(r[i*3]=o,r[i*3+1]=w[a.labelPosition||L.labelPosition]??0,r[i*3+2]=a.labelAngle??0,i++)}return{data:r,count:i}}renderWebGLLabels(e,t){let{nodeDataCache:n,labelProgram:r,primitives:i,nodeDataTexture:a}=this.internals,o=[];for(let e of this.displayedNodeLabels){if(this.renderedNodeLabels.has(e))continue;let r=n[e];t&&r.labelDepth!==t||(this.renderedNodeLabels.add(e),o.push(e))}if(o.length!==0){if(this.labelsDirty){let e=0;for(let t=0,r=o.length;t<r;t++){let r=n[o[t]];e+=r.label.length}r.reallocate(e);let t=i?.nodes?.label?.margin??5,s=L.labelPosition,c=i?.nodes?.label?.font?.family||`sans-serif`,l=new Map,u=0;for(let e=0,i=o.length;e<i;e++){let i=o[e],d=n[i],f=d.labelFont||c,p=l.get(f);if(p===void 0){let{family:e,weight:t,style:n}=tt(f);p=r.registerFont(e,t,n),l.set(f,p)}let m={text:d.label,x:d.x,y:d.y,size:d.labelSize??14,color:d.labelColor,nodeSize:d.size,margin:t,position:d.labelPosition??s,hidden:!1,forceLabel:A(d),type:`default`,zIndex:d.zIndex??0,parentType:`node`,parentKey:i,fontKey:p,labelAngle:d.labelAngle??0,nodeIndex:a.getIndex(i)},h=r.processLabel(i,u,m);u+=h}r.invalidateBuffers()}r.render(e)}}renderBackdrops(e,t){let{backdropProgram:n,nodeDataCache:r,nodesWithBackdrop:i,attachmentManager:a,pixelRatio:o,nodeDataTexture:s}=this.internals,c=[];for(let e of i){let n=r[e];if(!n||n.visibility===`hidden`||t&&n.depth!==t)continue;let i=s?.getIndex(e)??-1;i<0||c.push({key:e,nodeIndex:i})}if(c.length!==0){n.reallocate(c.length);for(let e=0;e<c.length;e++){let{key:t,nodeIndex:i}=c[e],s=r[t],l=this.displayedNodeLabels.has(t),u=l?this.measureNodeLabel(s):{width:0,height:0,textHeight:0},d=u.textHeight,f=u.width,p=u.height,m=0,h=0;if(l&&s.labelAttachment&&a){let e=a.getEntry(t,s.labelAttachment);if(e){let t=s.labelAttachmentPlacement||`below`;if(t===`below`||t===`above`){let n=e.height/o;p+=n+2,f=Math.max(f,e.width/o),h=t===`below`?(n+2)/2:-(n+2)/2}else{let n=e.width/o;f+=n+2,p=Math.max(p,e.height/o),m=t===`right`?(n+2)/2:-(n+2)/2}}}let g=s.backdropColor?Ie(s.backdropColor):[255,255,255,255],_=s.backdropShadowColor?Ie(s.backdropShadowColor):[0,0,0,128],v=g.map(e=>e/255),y=_.map(e=>e/255),b=s.backdropShadowBlur??12,x=s.backdropPadding??6,S=(s.backdropBorderColor?Ie(s.backdropBorderColor):[0,0,0,0]).map(e=>e/255),C=s.backdropBorderWidth??0,ee=s.backdropCornerRadius??0,w=s.backdropLabelPadding??-1,te=w<0?x:w,ne=Pa[s.backdropArea??`both`]??0,re={key:t,nodeIndex:i,label:s.label,labelWidth:f,labelHeight:p,textHeight:d,type:`default`,position:s.labelPosition||L.labelPosition,labelAngle:s.labelAngle??0,backdropColor:v,backdropShadowColor:y,backdropShadowBlur:b,backdropPadding:x,backdropBorderColor:S,backdropBorderWidth:C,backdropCornerRadius:ee,backdropLabelPadding:te,backdropArea:ne,labelBoxOffset:[m,h]};n.processBackdrop(e,re)}n.invalidateBuffers(),n.render(e)}}renderLabelBackgrounds(e,t){let{labelBackgroundProgram:n,nodeDataCache:r,nodeDataTexture:i}=this.internals,a=V.nodeLabel.writesPickingThisFrame(this.internals),o=[];for(let e of this.displayedNodeLabels){let n=r[e];n&&n.visibility!==`hidden`&&(t&&n.labelDepth!==t||(a||n.labelBackgroundColor)&&o.push(e))}if(o.length!==0){n.reallocate(o.length);for(let e=0;e<o.length;e++){let t=o[e],a=r[t],s=i?.getIndex(t)??-1;if(s<0)continue;let{width:c,height:l,textHeight:u}=this.measureNodeLabel(a),d=Xi(this.internals.pickingState,`nodeLabel`,t)||Xi(this.internals.pickingState,`node`,t),f=a.labelBackgroundColor?k(a.labelBackgroundColor):k(`transparent`),p={nodeIndex:s,id:Le(d),color:f,labelWidth:c,labelHeight:l,textHeight:u,positionMode:w[a.labelPosition||L.labelPosition]??0,labelAngle:a.labelAngle??0,padding:a.labelBackgroundPadding??3};n.processLabelBackground(e,p)}n.invalidateBuffers(),n.render(e)}}cacheAttachments(e){let{attachmentManager:t,pixelRatio:n,nodeDataCache:r,nodesWithBackdrop:i,graph:a}=this.internals;if(t){for(let o of i){if(!this.displayedNodeLabels.has(o))continue;let i=r[o];if(!i||i.visibility===`hidden`||e&&i.depth!==e||!i.labelAttachment)continue;let s=a.getNodeAttributes(o),{width:c,height:l}=this.measureNodeLabel(i),u={node:o,attributes:s,pixelRatio:n,labelWidth:c,labelHeight:l};t.renderAttachment(o,i.labelAttachment,u)}t.regenerateAtlas()}}renderAttachments(e,t){let{attachmentManager:n,attachmentProgram:r,nodeDataCache:i,nodesWithBackdrop:a,pixelRatio:o,nodeDataTexture:s}=this.internals;if(!n||!r)return;let c=0;r.reallocateAttachments(a.size);for(let e of a){if(!this.displayedNodeLabels.has(e))continue;let a=i[e];if(!a||a.visibility===`hidden`||t&&a.labelDepth!==t||!a.labelAttachment)continue;let l=n.getEntry(e,a.labelAttachment);if(!l)continue;let u=s?.getIndex(e)??-1;if(u<0)continue;let{width:d,height:f,textHeight:p}=this.measureNodeLabel(a),m=Dt[a.labelAttachmentPlacement||`below`]??0;r.processAttachment(c,{nodeIndex:u,atlasX:l.x,atlasY:l.y,atlasW:l.width,atlasH:l.height,attachWidth:l.width/o,attachHeight:l.height/o,positionMode:w[a.labelPosition||L.labelPosition]??0,attachmentPlacement:m,labelWidth:d,labelHeight:f,textHeight:p,labelAngle:a.labelAngle??0}),c++}c!==0&&(r.reallocateAttachments(c),n.bindTexture(7),r.invalidateBuffers(),r.render(e))}computeDisplayedEdgeLabels(){let{graph:e,stateManager:t,settings:n,edgesWithForcedLabels:r}=this.internals,i=t.getHighlightedNodes(),a=n.edgeLabelAnchors===`allNodes`?new Set(this.edgeAnchorGrid.getLabelsToDisplay(this.internals.getCameraState().ratio,n.labelDensity)):this.displayedNodeLabels,o=t.hovered,s=ja({graph:e,hoveredNode:o?.kind===`node`?o.key:null,displayedNodeLabels:a,highlightedNodes:i});Ve(s,r),this.edgeLabelCandidates=s,this.displayedEdgeLabels=new Set}filterEdgeLabelsForDepth(e){let{graph:t,nodeDataCache:n,edgeDataCache:r}=this.internals,i=[],a=new Set;for(let o=0,s=this.edgeLabelCandidates.length;o<s;o++){let s=this.edgeLabelCandidates[o];if(a.has(s))continue;a.add(s);let c=t.extremities(s),l=n[c[0]],u=n[c[1]],d=r[s];d&&l&&u&&d.visibility!==`hidden`&&d.labelVisibility!==`hidden`&&l.visibility!==`hidden`&&u.visibility!==`hidden`&&(e&&d.labelDepth!==e||d.label&&i.push(s))}return i}renderEdgeLabels(e,t){let{graph:n,nodeDataCache:r,edgeDataCache:i,primitives:a,edgeLabelProgram:o,nodeDataTexture:s,edgeDataTexture:c}=this.internals;if(!o)return;let l=this.filterEdgeLabelsForDepth(t);for(let e of l)this.displayedEdgeLabels.add(e);if(l.length!==0){if(this.labelsDirty){let e=0;for(let t of l)e+=i[t].label.length;o.reallocate(e);let t=a?.edges?.label?.margin??5,u=0;for(let e of l){let a=n.extremities(e),l=a[0],d=a[1],f=r[l],p=r[d],m=i[e],h=s.getIndex(l),g=s.getIndex(d),_=c.getIndex(e),v={text:m.label,x:(f.x+p.x)/2,y:(f.y+p.y)/2,size:Ia,color:m.labelColor,nodeSize:0,nodeIndex:-1,margin:t,position:m.labelPosition??`over`,hidden:!1,forceLabel:A(m),type:`default`,zIndex:m.zIndex??0,parentType:`edge`,parentKey:e,fontKey:``,labelAngle:0,sourceX:f.x,sourceY:f.y,targetX:p.x,targetY:p.y,sourceSize:f.size,targetSize:p.size,sourceShape:f.shape||`circle`,targetShape:p.shape||`circle`,edgeSize:m.size,offset:0,edgeAttributes:m,sourceNodeIndex:h,targetNodeIndex:g,edgeIndex:_},y=o.processEdgeLabel(e,u,v);u+=y}o.invalidateBuffers()}o.render(e)}}renderEdgeLabelBackgrounds(e,t){let{edgeLabelBackgroundProgram:n,edgeLabelProgram:r,edgeDataCache:i,primitives:a,edgeDataTexture:o}=this.internals;if(!o||!r||!n)return;let s=V.edgeLabel.writesPickingThisFrame(this.internals),c=a?.edges?.label?.margin??5,l=this.filterEdgeLabelsForDepth(t),u=[];for(let e of l)(s||i[e].labelBackgroundColor)&&u.push(e);if(u.length!==0){n.reallocate(u.length);for(let e=0;e<u.length;e++){let t=u[e],a=i[t],s=a.label,l=r.measureLabelAtlasWidth(s),d=a.labelPosition??`over`,f=typeof d==`string`?Fa[d]??0:0,p=Xi(this.internals.pickingState,`edgeLabel`,t)||Xi(this.internals.pickingState,`edge`,t),m=a.labelBackgroundColor?k(a.labelBackgroundColor):k(`transparent`),h={edgeIndex:o.getIndex(t),baseFontSize:Ia,totalTextWidth:l,positionMode:f,margin:c,padding:a.labelBackgroundPadding??La,color:m,id:Le(p),edgeAttributes:a};n.processEdgeLabelBackground(e,t,h)}n.invalidateBuffers(),n.render(e)}}},za=class{constructor(e,t,n,r){this.scheduleRefresh=e,this.customNodeStateDefaults=t,this.customEdgeStateDefaults=n,this.customGraphStateDefaults=r,this.nodeStates=new Map,this.edgeStates=new Map,this.hovered=null,this.dirtyNodes=new Set,this.dirtyEdges=new Set,this.graphStateChanged=!1,this.graphStateFlagsDirty=!1,this.graphState=Xr(r)}getNodeState(e){e=``+e;let t=this.nodeStates.get(e);return t||(t=Jr(this.customNodeStateDefaults),this.nodeStates.set(e,t)),t}getEdgeState(e){e=``+e;let t=this.edgeStates.get(e);return t||(t=Yr(this.customEdgeStateDefaults),this.edgeStates.set(e,t)),t}getGraphState(){return this.flushGraphStateFlags(),this.graphState}getHighlightedNodes(){let e=new Set;for(let[t,n]of this.nodeStates)n.isHighlighted&&e.add(t);return e}setNodeState(e,t){e=``+e;let n=this.getNodeState(e);if(!Ue(n,t))return;let r={...n,...t};this.nodeStates.set(e,r),this.dirtyNodes.add(e),this.updateHoveredNodeTracking(e,n,r),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}setEdgeState(e,t){e=``+e;let n=this.getEdgeState(e);if(!Ue(n,t))return;let r={...n,...t};this.edgeStates.set(e,r),this.dirtyEdges.add(e),this.updateHoveredEdgeTracking(e,n,r),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}setGraphState(e){if(!Ue(this.graphState,e))return;let t={...this.graphState,...e};t.isIdle=!t.isPanning&&!t.isZooming&&!t.isDragging,this.graphState=t,this.graphStateChanged=!0,this.scheduleRefresh()}setNodesState(e,t){let n=!1;for(let r of e){r=``+r;let e=this.getNodeState(r);if(!Ue(e,t))continue;let i={...e,...t};this.nodeStates.set(r,i),this.dirtyNodes.add(r),this.updateHoveredNodeTracking(r,e,i),n=!0}n&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}setEdgesState(e,t){let n=!1;for(let r of e){r=``+r;let e=this.getEdgeState(r);if(!Ue(e,t))continue;let i={...e,...t};this.edgeStates.set(r,i),this.dirtyEdges.add(r),this.updateHoveredEdgeTracking(r,e,i),n=!0}n&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}markNodesDirty(e){for(let t of e)this.dirtyNodes.add(t);this.scheduleRefresh()}removeNode(e){this.nodeStates.delete(e),this.dirtyNodes.delete(e),this.clearHoveredFor(`node`,e),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}removeEdge(e){this.edgeStates.delete(e),this.dirtyEdges.delete(e),this.clearHoveredFor(`edge`,e),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}pruneNodes(e){for(let t of this.nodeStates.keys())e(t)||this.removeNode(t)}pruneEdges(e){for(let t of this.edgeStates.keys())e(t)||this.removeEdge(t)}clearNodes(){this.nodeStates.clear(),this.dirtyNodes.clear(),this.clearHoveredForKinds(ca(`node`)),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}clearEdges(){this.edgeStates.clear(),this.dirtyEdges.clear(),this.clearHoveredForKinds(ca(`edge`)),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}resetGraphState(){this.graphState=Xr(this.customGraphStateDefaults),this.graphStateChanged=!1,this.graphStateFlagsDirty=!1}clearDirtyTracking(){this.dirtyNodes.clear(),this.dirtyEdges.clear(),this.graphStateChanged=!1}setHovered(e){this.hovered=e}clearHoveredFor(e,t){this.hovered&&this.hovered.key===t&&ca(e).includes(this.hovered.kind)&&(this.hovered=null)}clearHoveredForKinds(e){this.hovered&&e.includes(this.hovered.kind)&&(this.hovered=null)}updateGraphStateFromNodes(){let e=!1,t=!1,n=!1;for(let[,r]of this.nodeStates)if(r.isHovered&&(e=!0),r.isHighlighted&&(t=!0),r.isDragged&&(n=!0),e&&t&&n)break;!e&&this.hovered?.kind===`edge`&&(e=!0);let r=!this.graphState.isPanning&&!this.graphState.isZooming&&!n;(this.graphState.hasHovered!==e||this.graphState.hasHighlighted!==t||this.graphState.isDragging!==n||this.graphState.isIdle!==r)&&(this.graphStateChanged=!0),this.graphState={...this.graphState,hasHovered:e,hasHighlighted:t,isDragging:n,isIdle:r}}updateGraphStateFromEdges(){let e=this.hovered?.kind===`node`;if(!e){for(let[,t]of this.edgeStates)if(t.isHovered){e=!0;break}}this.graphState.hasHovered!==e&&(this.graphStateChanged=!0),this.graphState={...this.graphState,hasHovered:e}}flushGraphStateFlags(){this.graphStateFlagsDirty&&=(this.updateGraphStateFromNodes(),this.updateGraphStateFromEdges(),!1)}updateHoveredNodeTracking(e,t,n){if(t.isHovered!==n.isHovered){if(n.isHovered){if(this.hovered?.kind===`node`&&this.hovered.key!==e){let e=this.hovered.key,t=this.getNodeState(e);this.nodeStates.set(e,{...t,isHovered:!1}),this.dirtyNodes.add(e)}this.hovered={kind:`node`,key:e}}else this.hovered?.kind===`node`&&this.hovered.key===e&&(this.hovered=null)}}updateHoveredEdgeTracking(e,t,n){if(t.isHovered!==n.isHovered){if(n.isHovered){if(this.hovered?.kind===`edge`&&this.hovered.key!==e){let e=this.hovered.key,t=this.getEdgeState(e);this.edgeStates.set(e,{...t,isHovered:!1}),this.dirtyEdges.add(e)}this.hovered={kind:`edge`,key:e}}else this.hovered?.kind===`edge`&&this.hovered.key===e&&(this.hovered=null)}}};function Ba(e){return typeof e==`object`&&`uniforms`in e&&Array.isArray(e.uniforms)}function Va(e){return typeof e==`object`&&`uniforms`in e&&`attributes`in e&&`glsl`in e}function Ha(e){return typeof e==`object`&&`uniforms`in e&&`attributes`in e&&`segments`in e}function Ua(e){return typeof e==`object`&&`uniforms`in e&&`attributes`in e&&`length`in e}function Wa(e){return typeof e==`object`&&`uniforms`in e&&`attributes`in e&&`glsl`in e}function Ga(e){return typeof e==`object`&&`glsl`in e&&`name`in e&&!(`uniforms`in e)}function Ka(e){return typeof e==`object`&&`glsl`in e&&`name`in e&&!(`uniforms`in e)}function qa(e){return typeof e==`object`&&`glsl`in e&&`name`in e&&!(`uniforms`in e)}function Ja(e){if(Ba(e))return e;if(Ga(e))return{name:e.name,glsl:e.glsl,inradiusFactor:e.inradiusFactor,uniforms:[]};throw Error(`Invalid node shape specification: ${JSON.stringify(e)}`)}function Ya(e){if(Va(e))return e;if(Mr(e))return{name:e.name,glsl:e.glsl,uniforms:[],attributes:[]};throw Error(`Invalid node layer specification: ${JSON.stringify(e)}`)}function Xa(e){if(Ha(e))return e;if(Ka(e))return{name:e.name,glsl:e.glsl,segments:e.segments,uniforms:[],attributes:[]};throw Error(`Invalid edge path specification: ${JSON.stringify(e)}`)}function Za(e){if(Wa(e))return e;if(Nr(e))return{name:e.name,glsl:e.glsl,uniforms:[],attributes:[]};throw Error(`Invalid edge layer specification: ${JSON.stringify(e)}`)}function Qa(e){if(Ua(e))return e;if(qa(e))return{name:e.name,glsl:e.glsl,length:e.length,widthFactor:e.widthFactor,margin:0,uniforms:[],attributes:[]};throw Error(`Invalid edge extremity specification: ${JSON.stringify(e)}`)}function $a(e){let t=e?.shapes??Pr.shapes,n=e?.layers??Pr.layers,r=t.map(Ja),i=n.map(Ya);if(r.length===0)throw Error(`At least one node shape must be specified.`);if(i.length===0)throw Error(`At least one node layer must be specified.`);return{shapes:r,layers:i}}function eo(e){let t=e?.paths??Fr.paths,n=e?.extremities??Fr.extremities,r=e?.layers??Fr.layers,i=t.map(Xa),a=n.map(Qa).filter(e=>e!==null),o=r.map(Za);if(i.length===0)throw Error(`At least one edge path must be specified.`);if(o.length===0)throw Error(`At least one edge layer must be specified.`);return{paths:i,extremities:a,layers:o}}function to(e,t){let n={};for(let t of e)t.variables&&Object.assign(n,t.variables);return Object.assign(n,t||{}),n}function no(e,t,n,r,i){let{shapes:a,layers:o}=$a(r),s=to(a,r?.variables);return{...mn(e,t,n,{shapes:a,layers:o,label:r?.label,backdrop:r?.backdrop,labelAttachments:r?.labelAttachments},i),variables:s}}function ro(e,t,n,r,i,a){let{paths:o,extremities:s,layers:c}=eo(r),{shapes:l,layers:u}=$a(a),d=to(o,r?.variables);return{...Cr(e,t,n,{paths:o,extremities:s,layers:c,defaultHead:r?.defaultHead,defaultTail:r?.defaultTail,label:r?.label},i,l,u),variables:d,paths:o}}var io=1,ao=2,oo=3,so=4,co=class extends wi{constructor(e,t,n={}){super(),this.nodeReducer=null,this.edgeReducer=null,this.stageCanvas=null,this.mouseLayer=null,this.gestureHint=null,this.extraElements={},this.webGLContext=null,this.pickingFrameBuffer=null,this.pickingTexture=null,this.pickingDepthBuffer=null,this.activeListeners={},this.nodeVariableEntries=[],this.edgeVariableEntries=[],this.edgePathsByName=new Map,this.nodeProgramIndex={},this.edgeProgramIndex={},this.edgeTextureIndexCache={},this.nodeGraphCoords={},this.nodeExtent={x:[0,1],y:[0,1]},this.matrix=D(),this.invMatrix=D(),this.correctionRatio=1,this.frameId=0,this.customBBox=null,this.gpuTimerExt=void 0,this.activeGpuTimerQuery=null,this.pendingGpuTimerQueries=[],this.normalizationFunction=it({x:[0,1],y:[0,1]}),this.graphToViewportRatio=1,this.pickingState=Yi(),this.prevNodeVisibilities={},this.width=0,this.height=0,this.autoRescaleFrozen=!1,this.stylesDeclaration=null,this.resolvedStageStyle={},this.renderFrame=null,this.contextLost=!1,this.pendingProcess=`full`,this.needToRefreshState=!1,this.checkEdgesEventsFrame=null,this.edgeStyleAnalysis={dependency:`static`,xAttribute:null,yAttribute:null},this.depthLayers=[...Rr],this.customLayerPrograms=new Map,this.nodeShapeSlug=null,this.sdfAtlas=null,this.depthRanges={nodes:{},edges:{}},this.nodeBaseDepth={},this.edgeBaseDepth={};let{primitives:r,styles:i,settings:a={},nodeReducer:o,edgeReducer:s,customNodeState:c,customEdgeState:l,customGraphState:u}=n;this.stateManager=new za(()=>this.scheduleStateRefresh(),c,l,u);let d=r??Ti;this.stylesDeclaration=i?{nodes:i.nodes??ei.nodes,edges:i.edges??ei.edges,stage:i.stage}:ei,this.nodeReducer=o??null,this.edgeReducer=s??null;let f=ui(this.stylesDeclaration.nodes);this.nodeReducer&&(f.dependency=`graph-state`),this.edgeStyleAnalysis=ui(this.stylesDeclaration.edges),this.edgeReducer&&(this.edgeStyleAnalysis.dependency=`graph-state`),this.stylesDeclaration.stage&&(this.resolvedStageStyle=Si(this.stylesDeclaration.stage,this.stateManager.graphState));let p=ji(a);if(Ai(p),p.enableNodeDrag){let{xAttribute:e,yAttribute:t}=f;if((!e||!t)&&!p.dragPositionToAttributes)throw Error('Sigma: `enableNodeDrag` is true but position attribute names could not be inferred from styles. Either use attribute bindings for x/y in your node styles (e.g. `x: { attribute: "x" }`), or provide a `dragPositionToAttributes` setting.')}if(Qe(e),!(t instanceof HTMLElement))throw Error(`Sigma: container should be an html element.`);this.container=t,this.edgeGroups=new Gi(e,(e,t)=>{for(let n=0;n<e.length;n++){let r=this.stateManager.getEdgeState(e[n]);r.parallelIndex=n,r.parallelCount=t}});let m=new Ui(e,this.viewportToGraph.bind(this),this.setNodesState.bind(this),(e,t)=>this.emit(e,t));if(this.depthLayers=d.depthLayers??[...Rr],!i?.nodes&&!Ir.every(e=>this.depthLayers.includes(e)))throw Error(`Sigma: depthLayers must include ${Ir.join(`, `)} for the built-in node styles.`);if(!i?.edges&&!Lr.every(e=>this.depthLayers.includes(e)))throw Error(`Sigma: depthLayers must include ${Lr.join(`, `)} for the built-in edge styles.`);this.itemBuckets={nodes:new Er(this.depthLayers),edges:new Er(this.depthLayers)},this.initWebGLContext(),this.mouseLayer=nt(`div`,{position:`absolute`,touchAction:`none`,userSelect:`none`},{class:`sigma-mouse`}),this.container.appendChild(this.mouseLayer),this.resolvedStageStyle.background&&(this.container.style.backgroundColor=this.resolvedStageStyle.background),this.resolvedStageStyle.cursor&&(this.container.style.cursor=this.resolvedStageStyle.cursor);let h=new Dr(this.webGLContext),g=new Ar(this.webGLContext,{channels:1}),_=new jr(this.webGLContext),v=new Ar(this.webGLContext,{channels:4}),y=this.webGLContext,b=new Oa({gl:y,getFrameBuffer:()=>this.pickingFrameBuffer,getPixelRatio:()=>this.internals.pixelRatio,getDownSizingRatio:()=>this.internals.settings.pickingDownSizingRatio,isRenderPending:()=>this.renderFrame!==null,onIndex:(e,t)=>fa(this.internals,this.pickingState.lookup[e]??null,t)}),x=this.initPrograms(d,p),S=d?.nodes?.labelAttachments,C=null;S&&Object.keys(S).length>0&&(C=new Mt(y,S,()=>this.scheduleRender())),this.internals={nodeDataCache:{},edgeDataCache:{},nodesWithForcedLabels:new Set,nodesWithBackdrop:new Set,edgesWithForcedLabels:new Set,settings:p,primitives:d,pixelRatio:rt(),graph:e,stateManager:this.stateManager,dragManager:m,hoverResolver:b,nodeStyleAnalysis:f,pickingState:this.pickingState,...x,attachmentManager:C,nodeDataTexture:h,nodeFrameTexture:g,edgeDataTexture:_,edgeFrameTexture:v,getDimensions:()=>this.getDimensions(),getGraphDimensions:()=>this.getGraphDimensions(),getStagePadding:()=>this.getStagePadding(),getCameraState:()=>this.camera.getState(),getHitAtPosition:e=>this.getHitAtPosition(e),setNodeState:(e,t)=>this.setNodeState(e,t),setEdgeState:(e,t)=>this.setEdgeState(e,t),updateContainerCursor:()=>this.updateContainerCursor(),scheduleRefresh:()=>this.scheduleRefresh(),viewportToFramedGraph:e=>this.viewportToFramedGraph(e),viewportToGraph:e=>this.viewportToGraph(e),framedGraphToViewport:e=>this.framedGraphToViewport(e),scaleSize:e=>this.scaleSize(e),emit:(e,t)=>this.emit(e,t)},this.labelRenderer=new Ra(this.internals),this.resize(),this.initializeWebGLLabels(),this.camera=new Oi,this.bindCameraHandlers(),this.mouseCaptor=new Bi(this.mouseLayer,this),this.mouseCaptor.setSettings(this.internals.settings),this.touchCaptor=new Hi(this.mouseLayer,this),this.touchCaptor.setSettings(this.internals.settings),this.bindEventHandlers(),this.bindGraphHandlers(),this.handleSettingsUpdate(),this.refresh()}initializeWebGLLabels(){this.sdfAtlas=new rn,this.sdfAtlas.registerFont({family:`sans-serif`,weight:`normal`,style:`normal`})}resetWebGLTexture(){let e=this.webGLContext;if(!this.pickingFrameBuffer)return this;let t=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),n=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);e.bindFramebuffer(e.FRAMEBUFFER,this.pickingFrameBuffer),this.pickingTexture&&e.deleteTexture(this.pickingTexture);let r=e.createTexture();r&&(e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0),this.pickingTexture=r),this.pickingDepthBuffer&&e.deleteRenderbuffer(this.pickingDepthBuffer);let i=e.createRenderbuffer();return i&&(e.bindRenderbuffer(e.RENDERBUFFER,i),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,n),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,i),this.pickingDepthBuffer=i),e.bindFramebuffer(e.FRAMEBUFFER,null),this}bindCameraHandlers(){return this.activeListeners.camera=()=>{this.refreshMatrices(),this.labelRenderer.labelsDirty=!0,this.scheduleRender()},this.activeListeners.cameraAnimationStart=({from:e,to:t})=>{e.ratio!==t.ratio&&this.stateManager.setGraphState({isZooming:!0})},this.activeListeners.cameraAnimationEnd=()=>{this.stateManager.setGraphState({isZooming:!1})},this.camera.on(`updated`,this.activeListeners.camera),this.camera.on(`animationStart`,this.activeListeners.cameraAnimationStart),this.camera.on(`animationEnd`,this.activeListeners.cameraAnimationEnd),this}unbindCameraHandlers(){return this.camera.removeListener(`updated`,this.activeListeners.camera),this.camera.removeListener(`animationStart`,this.activeListeners.cameraAnimationStart),this.camera.removeListener(`animationEnd`,this.activeListeners.cameraAnimationEnd),this}getHitAtPosition(e){if(this.contextLost)return null;let t=this.webGLContext;t.bindFramebuffer(t.FRAMEBUFFER,this.pickingFrameBuffer);let n=Re(...ze(t,this.pickingFrameBuffer,e.x,e.y,this.internals.pixelRatio,this.internals.settings.pickingDownSizingRatio));return this.pickingState.lookup[n]??null}bindEventHandlers(){return pa(this.internals,this.mouseCaptor,this.touchCaptor,this.activeListeners),this}bindGraphHandlers(){return ma({graph:this.internals.graph,edgeGroups:this.edgeGroups,updateNode:this.updateNode.bind(this),removeNode:this.removeNode.bind(this),addEdge:this.addEdge.bind(this),updateEdge:this.updateEdge.bind(this),removeEdge:this.removeEdge.bind(this),clearEdgeState:this.clearEdgeState.bind(this),clearNodeState:this.clearNodeState.bind(this),clearEdgeIndices:this.clearEdgeIndices.bind(this),clearNodeIndices:this.clearNodeIndices.bind(this),refresh:this.refresh.bind(this),scheduleProcess:()=>{this.pendingProcess=`full`,this.scheduleRender()},markNodesDirty:e=>{this.internals.nodeStyleAnalysis.dependency===`graph-state`&&this.stateManager.markNodesDirty(e)}},this.activeListeners),this}unbindGraphHandlers(){ha(this.internals.graph,this.activeListeners)}getNodeShapeId(e){return this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&e.shape&&e.shape in this.internals.nodeShapeMap?this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[e.shape]]:v(e.shape||`circle`)}processNodes(){let e=this.internals.graph,t=this.internals.settings,n=this.getDimensions(),{autoRescale:r,autoRescaleContent:i}=t,a=this.nodeExtent;if(r===!1){let{width:e,height:t}=n;a={x:[-e/2,e/2],y:[-t/2,t/2]}}else r===`once`&&this.autoRescaleFrozen||(a=this.computeNodeExtent(),i!==`positions`&&!this.customBBox&&(a=ya({extent:a,coords:this.nodeGraphCoords,nodeData:this.internals.nodeDataCache,dimensions:n,stagePadding:this.getStagePadding(),zoomToSizeRatioFunction:t.zoomToSizeRatioFunction,itemSizesReference:t.itemSizesReference,fitLabels:i===`labels`,nodeLabelBox:(e,t)=>this.labelRenderer.nodeLabelBox(e,t)})),r===`once`&&(this.autoRescaleFrozen=!0));this.nodeExtent=a,this.normalizationFunction=it(this.customBBox||this.nodeExtent);let o=Ce(new Oi().getState(),n,this.getGraphDimensions(),this.getStagePadding());this.labelRenderer.labelGrid.resizeAndClear(n,t.labelGridCellSize),this.labelRenderer.edgeAnchorGrid.resizeAndClear(n,t.labelGridCellSize);let s=t.renderEdgeLabels&&t.edgeLabelAnchors===`allNodes`,c=!1;Zi(this.pickingState,`node`);let l=e.nodes();for(let e=0,t=l.length;e<t;e++){let t=l[e],n=this.internals.nodeDataCache[t],r=this.nodeGraphCoords[t];n.x=r.x,n.y=r.y,this.normalizationFunction.applyTo(n),n.visibility!==this.prevNodeVisibilities[t]&&(c=!0),typeof n.label==`string`&&n.visibility!==`hidden`&&n.labelVisibility!==`hidden`&&this.labelRenderer.labelGrid.add(t,n.size,this.framedGraphToViewport(n,{matrix:o})),s&&n.visibility!==`hidden`&&this.labelRenderer.edgeAnchorGrid.add(t,n.size,this.framedGraphToViewport(n,{matrix:o}))}this.labelRenderer.labelGrid.organize(),this.labelRenderer.edgeAnchorGrid.organize(),this.nodeProgram.reallocate(l.length);let u=0;this.depthRanges.nodes={},this.nodeBaseDepth={};let d=this.internals.nodeDataCache;for(let e of this.depthLayers){let t=this.itemBuckets.nodes.getSorted(e,e=>d[e].zIndex);if(t.length!==0){this.depthRanges.nodes[e]=[{offset:u,count:t.length}];for(let n of t)this.nodeBaseDepth[n]=e,Qi(this.pickingState,`node`,n),this.addNodeToProgram(n,u++)}}this.nodeProgram.invalidateBuffers();for(let e=0,t=l.length;e<t;e++)this.prevNodeVisibilities[l[e]]=this.internals.nodeDataCache[l[e]].visibility;this.labelRenderer.processWebGLLabels(l);for(let{program:e}of this.customLayerPrograms.values())e.cacheData&&e.cacheData();return c}processEdges(){let e=this.internals.graph.edges();this.edgeProgram.reallocate(e.length);let t=0;Zi(this.pickingState,`edge`),this.depthRanges.edges={},this.edgeBaseDepth={};let n=this.internals.edgeDataCache;for(let e of this.depthLayers){let r=this.itemBuckets.edges.getSorted(e,e=>n[e].zIndex);if(r.length!==0){this.depthRanges.edges[e]=[{offset:t,count:r.length}];for(let n of r)this.edgeBaseDepth[n]=e,Qi(this.pickingState,`edge`,n),this.addEdgeToProgram(n,t++)}}this.edgeProgram.invalidateBuffers()}updateNodeDepthRanges(e,t,n){let r=this.nodeProgramIndex[e];r!==void 0&&(Je(this.depthRanges.nodes,t,r),Ye(this.depthRanges.nodes,n,r))}updateEdgeDepthRanges(e,t,n){let r=this.edgeProgramIndex[e];r!==void 0&&(Je(this.depthRanges.edges,t,r),Ye(this.depthRanges.edges,n,r))}handleSettingsUpdate(){let e=this.internals.settings;return this.camera.minRatio=e.minCameraRatio,this.camera.maxRatio=e.maxCameraRatio,this.camera.enabledZooming=e.enableCameraZooming,this.camera.enabledPanning=e.enableCameraPanning,this.camera.enabledRotation=e.enableCameraRotation,e.cameraPanBoundaries?this.camera.constrainState=t=>this.cleanCameraState(t,e.cameraPanBoundaries&&typeof e.cameraPanBoundaries==`object`?e.cameraPanBoundaries:{}):this.camera.constrainState=null,this.camera.setState(this.camera.getState()),this.mouseLayer.style.touchAction=e.gestureTarget===`graph`?`none`:e.gestureTarget===`shared`?`pan-x pan-y`:`auto`,e.gestureTarget!==`shared`&&this.gestureHint&&(this.gestureHint.kill(),this.gestureHint=null),this.mouseCaptor.setSettings(this.internals.settings),this.touchCaptor.setSettings(this.internals.settings),this}cleanCameraState(e,{tolerance:t=0,boundaries:n}={}){let r={...e},{x:[i,a],y:[o,s]}=n||this.nodeExtent,c=[this.graphToViewport({x:i,y:o},{cameraState:e}),this.graphToViewport({x:a,y:o},{cameraState:e}),this.graphToViewport({x:i,y:s},{cameraState:e}),this.graphToViewport({x:a,y:s},{cameraState:e})],l=1/0,u=-1/0,d=1/0,f=-1/0;c.forEach(({x:e,y:t})=>{l=Math.min(l,e),u=Math.max(u,e),d=Math.min(d,t),f=Math.max(f,t)});let p=u-l,m=f-d,{width:h,height:g}=this.getDimensions(),_=0,v=0;if(p>=h?u<h-t?_=u-(h-t):l>t&&(_=l-t):u>h+t?_=u-(h+t):l<-t&&(_=l+t),m>=g?f<g-t?v=f-(g-t):d>t&&(v=d-t):f>g+t?v=f-(g+t):d<-t&&(v=d+t),_||v){let t=this.viewportToFramedGraph({x:0,y:0},{cameraState:e}),n=this.viewportToFramedGraph({x:_,y:v},{cameraState:e});_=n.x-t.x,v=n.y-t.y,r.x+=_,r.y+=v}return r}refreshMatrices(){let e=this.camera.getState(),t=this.getDimensions(),n=this.getGraphDimensions(),r=this.getStagePadding();this.matrix=Ce(e,t,n,r),this.invMatrix=Ce(e,t,n,r,!0),this.correctionRatio=we(this.matrix,e,t),this.graphToViewportRatio=this.getGraphToViewportRatio()}processData(){this.emit(`beforeProcess`),this.internals.attachmentManager?.clear();let e={...this.pickingState.idsByKind},t=this.processNodes();(this.pendingProcess===`full`||t)&&this.processEdges(),ea(this.pickingState,this.internals),ta(e,this.pickingState.idsByKind)||this.internals.hoverResolver.invalidate(),this.pendingProcess=`none`,this.emit(`afterProcess`)}render(){if(this.contextLost)return this;this.emit(`beforeRender`);let e=()=>(this.internals.hoverResolver.frameRendered(),this.emit(`afterRender`),this);if(this.renderFrame&&=(cancelAnimationFrame(this.renderFrame),null),this.resize(),(this.pendingProcess!==`none`||this.needToRefreshState)&&(this.labelRenderer.labelsDirty=!0),this.pendingProcess!==`none`&&this.processData(),this.needToRefreshState&&this.refreshState(),this.needToRefreshState=!1,this.stateManager.clearDirtyTracking(),this.pendingProcess!==`none`&&this.processData(),this.clear(),this.resetWebGLTexture(),!this.internals.graph.order)return e();let t=this.mouseCaptor,n=this.camera.isAnimating()||t.isMoving||t.draggedEvents||t.currentWheelDirection;if(this.refreshMatrices(),this.frameId++,this.internals.settings.renderEdgeLabels&&!this.internals.edgeLabelProgram){let{labelProgram:e,labelBackgroundProgram:t}=this.createEdgeLabelPrograms();this.internals.edgeLabelProgram=e,this.internals.edgeLabelBackgroundProgram=t}let r=this.internals.settings.DEBUG_logRenderStats?this.getDebugPrograms():null;r&&r.forEach(e=>e.resetDebugStats()),this.internals.settings.DEBUG_gpuTimerQueries&&this.beginGpuTimerQuery(),this.internals.nodeFrameTexture.ensureCapacity(this.internals.nodeDataTexture.getCapacity()),this.internals.edgeFrameTexture.ensureCapacity(this.internals.edgeDataTexture.getCapacity());let i=this.getRenderParams(),a=V.edge.writesPickingThisFrame(this.internals)?i:{...i,pickingFrameBuffer:null};this.labelRenderer.resetFrame();let o=this.webGLContext,s=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),c=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);if(o.bindFramebuffer(o.FRAMEBUFFER,this.pickingFrameBuffer),o.viewport(0,0,s,c),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this.internals.nodeDataTexture.upload(),this.internals.edgeDataTexture.upload(),this.nodeProgram.uploadLayerTexture(),this.edgeProgram.uploadAttributeTexture(),this.emit(`afterTexturesUpload`),this.internals.nodeDataTexture.bind(oo),this.internals.edgeDataTexture.bind(so),this.edgeFramePass.run(i,this.internals.edgeFrameTexture,this.internals.edgeDataTexture.getHighWaterMark(),this.edgeProgram.getAttributeTexture(),this.nodeProgram.getAttributeTexture()),this.internals.edgeFrameTexture.bind(io),this.internals.settings.renderLabels){this.labelRenderer.computeDisplayedNodeLabels();let{data:e,count:t}=this.labelRenderer.buildFramePassPoints();this.nodeFramePass.run(e,t,this.internals.nodeFrameTexture,i,this.nodeProgram.getAttributeTexture()),this.internals.nodeFrameTexture.bind(ao)}this.internals.settings.renderEdgeLabels&&this.labelRenderer.computeDisplayedEdgeLabels();for(let{program:e}of this.customLayerPrograms.values())e.preRender&&e.preRender(i);o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA);let l=!this.internals.settings.hideLabelsOnMove||!n;for(let e of this.depthLayers){for(let t of this.customLayerPrograms.values())t.depth===e&&t.program.render(i);let t=this.depthRanges.edges[e];if(t&&(!this.internals.settings.hideEdgesOnMove||!n))for(let{offset:e,count:n}of t)n>0&&this.edgeProgram.render(a,e,n);this.internals.settings.renderEdgeLabels&&l&&(this.labelRenderer.renderEdgeLabelBackgrounds(V.edgeLabel.writesPickingThisFrame(this.internals)?i:{...i,pickingFrameBuffer:null},e),this.labelRenderer.renderEdgeLabels(i,e)),this.labelRenderer.cacheAttachments(e),this.labelRenderer.renderBackdrops({...i,pickingFrameBuffer:null},e);let r=this.depthRanges.nodes[e];if(r)for(let{offset:e,count:t}of r)t>0&&this.nodeProgram.render(i,e,t);l&&(this.labelRenderer.renderAttachments({...i,pickingFrameBuffer:null},e),this.labelRenderer.renderLabelBackgrounds(V.nodeLabel.writesPickingThisFrame(this.internals)?i:{...i,pickingFrameBuffer:null},e),this.internals.settings.renderLabels&&this.labelRenderer.renderWebGLLabels(i,e))}return this.labelRenderer.labelsDirty=!1,this.internals.settings.DEBUG_displayPickingLayer&&(o.bindFramebuffer(o.READ_FRAMEBUFFER,this.pickingFrameBuffer),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.blitFramebuffer(0,0,s,c,0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio,o.COLOR_BUFFER_BIT,o.NEAREST)),this.internals.settings.DEBUG_gpuTimerQueries&&this.endGpuTimerQuery(),this.pollGpuTimerQueries(),r&&this.logRenderStats(r),e()}getDebugPrograms(){return[this.nodeProgram,this.edgeProgram,this.internals.labelProgram,this.internals.edgeLabelProgram,this.internals.edgeLabelBackgroundProgram,this.internals.backdropProgram,this.internals.labelBackgroundProgram,this.internals.attachmentProgram].filter(e=>e!==null)}logRenderStats(e){let t={};for(let n of e)t[n.constructor.name]={...n.debugStats};console.log(`[sigma] DEBUG_logRenderStats: frame #${this.frameId}`),console.table(t)}getGpuTimerExtension(){return this.gpuTimerExt===void 0&&(this.gpuTimerExt=this.webGLContext.getExtension(`EXT_disjoint_timer_query_webgl2`),this.gpuTimerExt||console.warn(`Sigma: DEBUG_gpuTimerQueries is enabled, but this browser/driver doesn't support EXT_disjoint_timer_query_webgl2.`)),this.gpuTimerExt}beginGpuTimerQuery(){let e=this.getGpuTimerExtension();if(!e)return;let t=this.webGLContext,n=t.createQuery();n&&(t.beginQuery(e.TIME_ELAPSED_EXT,n),this.activeGpuTimerQuery=n)}endGpuTimerQuery(){this.gpuTimerExt&&this.activeGpuTimerQuery&&(this.webGLContext.endQuery(this.gpuTimerExt.TIME_ELAPSED_EXT),this.pendingGpuTimerQueries.push({query:this.activeGpuTimerQuery,frameId:this.frameId}),this.activeGpuTimerQuery=null)}pollGpuTimerQueries(){if(this.pendingGpuTimerQueries.length===0)return;let e=this.webGLContext,t=this.gpuTimerExt;if(!t){this.pendingGpuTimerQueries.forEach(({query:t})=>e.deleteQuery(t)),this.pendingGpuTimerQueries=[];return}let n=e.getParameter(t.GPU_DISJOINT_EXT),r=[];for(let t of this.pendingGpuTimerQueries)if(!e.getQueryParameter(t.query,e.QUERY_RESULT_AVAILABLE))r.push(t);else{if(!n){let n=e.getQueryParameter(t.query,e.QUERY_RESULT);console.log(`[sigma] DEBUG_gpuTimerQueries: frame #${t.frameId} GPU time = ${(n/1e6).toFixed(2)}ms`)}e.deleteQuery(t.query)}this.pendingGpuTimerQueries=r}postEvaluateNode(e,t,n){let r=e;r.x===void 0&&(r.x=t.x),r.y===void 0&&(r.y=t.y),e.highlighted=n.isHighlighted;for(let e=0,n=this.nodeVariableEntries.length;e<n;e++){let[n,i]=this.nodeVariableEntries[e];r[n]=r[n]??t[n]??i.default}}addNode(e){let t=this.internals.graph.getNodeAttributes(e),n=this.stateManager.getNodeState(e),r=this.internals.nodeDataCache[e]||{};if(yi(this.stylesDeclaration.nodes,t,n,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateNode(r,t,n),this.nodeReducer){let i=this.nodeReducer(e,r,t,n,this.stateManager.graphState,this.internals.graph);r={...r,...i}}if(typeof r.x!=`number`||typeof r.y!=`number`)throw Error(`Sigma: could not find a valid position (x, y) for node "${e}". Provide coordinates via node attributes, styles, or a nodeReducer.`);this.internals.nodeShapeMap?r.shape&&r.shape in this.internals.nodeShapeMap||(r.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(r.shape=this.nodeShapeSlug),this.internals.nodeDataCache[e]=r,this.nodeGraphCoords[e]={x:r.x,y:r.y},Ge(this.internals.nodesWithForcedLabels,e,A(r)),Ge(this.internals.nodesWithBackdrop,e,Ke(r)),this.itemBuckets.nodes.set(e,r.depth)}updateNode(e){this.addNode(e);let t=this.internals.nodeDataCache[e];this.normalizationFunction.applyTo(t)}removeNode(e){$i(this.pickingState,`node`,e),this.itemBuckets.nodes.remove(e),delete this.internals.nodeDataCache[e],delete this.nodeGraphCoords[e],delete this.nodeProgramIndex[e],this.internals.nodeDataTexture.free(e),this.internals.dragManager.removeNode(e),this.stateManager.removeNode(e),this.internals.nodesWithForcedLabels.delete(e),this.internals.nodesWithBackdrop.delete(e)}postEvaluateEdge(e,t){let n=e;for(let e=0,r=this.edgeVariableEntries.length;e<r;e++){let[r,i]=this.edgeVariableEntries[e];n[r]=n[r]??t[r]??i.default}}applyEdgeSpread(e,t,n){if(n.parallelCount<=1)return;let r=this.internals.graph.source(e),i=this.internals.graph.target(e),a=r===i,o=a?t.selfLoopPath||t.path:t.parallelPath||t.path,s=o?this.edgePathsByName.get(o):void 0;if(!s?.spread)return;let c=t.parallelSpread??.25,l=s.spread.compute(n.parallelIndex,n.parallelCount,c);!a&&this.internals.graph.isDirected(e)&&r>i&&(l=-l),t[s.spread.variable]=l}addEdge(e){let t=this.internals.graph.getEdgeAttributes(e),n=this.stateManager.getEdgeState(e),r={};if(bi(this.stylesDeclaration.edges,t,n,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateEdge(r,t),this.edgeReducer){let i=this.edgeReducer(e,r,t,n,this.stateManager.graphState,this.internals.graph);r={...r,...i}}this.applyEdgeSpread(e,r,n),this.internals.edgeDataCache[e]=r,Ge(this.internals.edgesWithForcedLabels,e,A(r)),this.itemBuckets.edges.set(e,r.depth)}updateEdge(e){this.addEdge(e)}removeEdge(e){this.itemBuckets.edges.remove(e),delete this.internals.edgeDataCache[e],delete this.edgeProgramIndex[e],delete this.edgeTextureIndexCache[e],this.internals.edgeDataTexture.free(e),$i(this.pickingState,`edge`,e),this.stateManager.removeEdge(e),this.internals.edgesWithForcedLabels.delete(e)}clearNodeIndices(){this.labelRenderer.resetLabelGrid(),this.autoRescaleFrozen||(this.nodeExtent={x:[0,1],y:[0,1]}),this.internals.nodeDataCache={},this.nodeGraphCoords={},this.nodeProgramIndex={},this.internals.nodeDataTexture?.clear(),this.internals.nodesWithForcedLabels.clear(),this.internals.nodesWithBackdrop.clear(),this.prevNodeVisibilities={},this.itemBuckets.nodes.clearAll(),this.depthRanges.nodes={},this.nodeBaseDepth={}}clearEdgeIndices(){this.internals.edgeDataCache={},this.edgeProgramIndex={},this.edgeTextureIndexCache={},this.internals.edgeDataTexture?.clear(),this.internals.edgesWithForcedLabels.clear(),this.itemBuckets.edges.clearAll(),this.depthRanges.edges={},this.edgeBaseDepth={},this.edgeGroups.clear()}clearIndices(){this.clearEdgeIndices(),this.clearNodeIndices()}clearNodeState(){this.labelRenderer.resetFrame(),this.internals.nodesWithBackdrop.clear(),this.internals.dragManager.clear(),this.autoRescaleFrozen=!1,this.stateManager.clearNodes(),Zi(this.pickingState,`node`)}clearEdgeState(){this.labelRenderer.clearEdgeLabels(),this.stateManager.clearEdges(),Zi(this.pickingState,`edge`)}clearState(){this.clearEdgeState(),this.clearNodeState(),this.stateManager.resetGraphState()}addNodeToProgram(e,t){let n=this.internals.nodeDataCache[e];this.internals.nodeDataTexture.allocate(e),this.internals.nodeDataTexture.updateNode(e,n.x,n.y,n.size,this.getNodeShapeId(n),...qe(n),n.color);let r=this.internals.nodeDataTexture.getIndex(e);this.nodeProgram.process(Xi(this.pickingState,`node`,e),t,n,r),this.nodeProgramIndex[e]=t}addEdgeToProgram(e,t){let n=this.internals.edgeDataCache[e],r=this.internals.graph.source(e),i=this.internals.graph.target(e),a=this.internals.edgeDataTexture.allocate(e);this.edgeTextureIndexCache[e]=a;let o=r===i,s=!o&&(this.stateManager.getEdgeState(e)?.parallelCount??1)>1,{pathId:c,headId:l,tailId:u,headLengthRatio:d,tailLengthRatio:f}=this.edgeProgram.resolveEdgeIds(n,o,s);this.internals.edgeDataTexture.updateEdge(e,this.internals.nodeDataTexture.getIndex(r),this.internals.nodeDataTexture.getIndex(i),n.size,d,f,c,l,u),this.edgeProgram.process(Xi(this.pickingState,`edge`,e),t,this.internals.nodeDataCache[r],this.internals.nodeDataCache[i],n,a),this.edgeProgramIndex[e]=t}getRenderParams(){return{frameId:this.frameId,matrix:this.matrix,invMatrix:this.invMatrix,width:this.width,height:this.height,pixelRatio:this.internals.pixelRatio,zoomRatio:this.camera.ratio,cameraAngle:this.camera.angle,sizeRatio:1/this.scaleSize(),correctionRatio:this.correctionRatio,downSizingRatio:this.internals.settings.pickingDownSizingRatio,minEdgeThickness:this.internals.settings.minEdgeThickness,antiAliasingFeather:this.internals.settings.antiAliasingFeather,nodePickingPadding:this.internals.settings.nodePickingPadding,edgePickingPadding:this.internals.settings.edgePickingPadding,labelPickingPadding:this.internals.settings.labelPickingPadding,nodeDataTextureUnit:oo,nodeDataTextureWidth:this.internals.nodeDataTexture.getTextureWidth(),nodeFrameTextureUnit:ao,nodeFrameTextureWidth:this.internals.nodeFrameTexture.getTextureWidth(),edgeDataTextureUnit:so,edgeDataTextureWidth:this.internals.edgeDataTexture.getTextureWidth(),edgeFrameTextureUnit:io,edgeFrameTextureWidth:this.internals.edgeFrameTexture.getTextureWidth(),pickingFrameBuffer:this.pickingFrameBuffer,labelPixelSnapping:+!!this.internals.settings.labelPixelSnapping}}getStagePadding(){let{stagePadding:e,autoRescale:t}=this.internals.settings;return t&&e||0}getLayerElement(e){if(e===`mouse`)return this.mouseLayer;let t=this.extraElements[e];if(!t)throw Error(`Sigma: layer "${e}" does not exist`);return t}initWebGLContext(){let e=this.createWebGLContext(`stage`);this.stageCanvas=this.extraElements.stage,this.webGLContext=e,this.stageCanvas.addEventListener(`webglcontextlost`,e=>{this.webGLContext&&(e.preventDefault(),this.contextLost=!0,this.renderFrame&&=(cancelAnimationFrame(this.renderFrame),null),this.gpuTimerExt=void 0,this.activeGpuTimerQuery=null,this.pendingGpuTimerQueries=[],this.emit(`webglContextLost`))}),this.stageCanvas.addEventListener(`webglcontextrestored`,()=>{requestAnimationFrame(()=>{this.webGLContext&&!this.webGLContext.isContextLost()&&this.restoreWebGLContext()})}),this.initPickingFramebuffer()}initPickingFramebuffer(){let e=this.webGLContext,t=e.createFramebuffer();if(!t)throw Error(`Sigma: cannot create picking frame buffer`);e.bindFramebuffer(e.FRAMEBUFFER,t);let n=e.createTexture();if(!n)throw Error(`Sigma: cannot create picking texture`);e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0);let r=e.createRenderbuffer();if(!r)throw Error(`Sigma: cannot create picking depth buffer`);if(e.bindRenderbuffer(e.RENDERBUFFER,r),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,1,1),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,r),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw Error(`Sigma: picking framebuffer is not complete`);e.bindFramebuffer(e.FRAMEBUFFER,null),this.pickingFrameBuffer=t,this.pickingTexture=n,this.pickingDepthBuffer=r}initPrograms(e,t){let n=this,r=this.webGLContext,{nodeProgram:i,labelProgram:a,backdropProgram:o,labelBackgroundProgram:s,attachmentProgram:c,framePass:l,shapeSlug:u,shapeNameToIndex:d,shapeGlobalIds:f,variables:p}=no(r,this.pickingFrameBuffer,n,e?.nodes,t.antialiasNodes);this.nodeProgram=i,this.nodeFramePass=l,this.nodeVariableEntries=Object.entries(p),u&&(this.nodeShapeSlug=u);let{edgeProgram:m,createLabelPrograms:h,framePass:g,variables:_,paths:v}=ro(r,this.pickingFrameBuffer,n,e?.edges,t.antialiasEdges,e?.nodes);return this.createEdgeLabelPrograms=h,this.edgeProgram=m,this.edgeFramePass=g,this.edgeVariableEntries=Object.entries(_),this.edgePathsByName=new Map(v.map(e=>[e.name,e])),{labelProgram:a,edgeLabelProgram:null,edgeLabelBackgroundProgram:null,backdropProgram:o,labelBackgroundProgram:s,attachmentProgram:c,nodeShapeMap:d??null,nodeGlobalShapeIds:f??null}}restoreWebGLContext(){let e=this.internals;this.initPickingFramebuffer(),e.nodeDataTexture?.restore(),e.nodeFrameTexture?.restore(),e.edgeDataTexture?.restore(),e.edgeFrameTexture?.restore(),e.attachmentManager?.restore(),e.hoverResolver.reset(),Object.assign(e,this.initPrograms(e.primitives,e.settings));for(let e of this.customLayerPrograms.values())e.program.kill(),e.program=e.factory(this.webGLContext);this.contextLost=!1,this.emit(`webglContextRestored`),this.refresh()}createLayer(e,t,n={}){if(this.extraElements[e])throw Error(`Sigma: a layer named "${e}" already exists`);let r=nt(t,{position:`absolute`},{class:`sigma-${e}`});return n.style&&Object.assign(r.style,n.style),this.extraElements[e]=r,`beforeLayer`in n&&n.beforeLayer?this.getLayerElement(n.beforeLayer).before(r):`afterLayer`in n&&n.afterLayer?this.getLayerElement(n.afterLayer).after(r):this.container.appendChild(r),r}createCanvas(e,t={}){return this.createLayer(e,`canvas`,t)}createWebGLContext(e,t={}){let n=this.createCanvas(e,t);t.hidden&&n.remove();let r=n.getContext(`webgl2`,{preserveDrawingBuffer:!1,antialias:!1,depth:!0,...t});if(!r)throw Error(`Sigma: WebGL 2 is not supported by your browser. Please use a modern browser (Chrome 56+, Firefox 51+, Safari 15+, Edge 79+).`);return r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA),r}killLayer(e){if(e===`stage`||e===`mouse`)throw Error(`Sigma: cannot kill built-in layer "${e}"`);let t=this.extraElements[e];if(!t)throw Error(`Sigma: cannot kill layer ${e}, which does not exist`);return t.remove(),delete this.extraElements[e],this}getWebGLContext(){if(!this.webGLContext)throw Error(`Sigma: WebGL context is not available`);return this.webGLContext}getNodeDataTexture(){if(!this.internals.nodeDataTexture)throw Error(`Sigma: node data texture is not available`);return this.internals.nodeDataTexture}getNormalizationFunction(){return this.normalizationFunction}addCustomLayerProgram(e,t,n){if(!this.depthLayers.includes(t))throw Error(`Sigma: cannot add custom layer program at depth "${t}", it must be declared in primitives.depthLayers. Current layers: ${this.depthLayers.join(`, `)}`);this.customLayerPrograms.get(e)?.program.kill();let r=n(this.webGLContext);return this.customLayerPrograms.set(e,{depth:t,factory:n,program:r}),r.cacheData&&r.cacheData(),this.scheduleRender(),this}removeCustomLayerProgram(e){let t=this.customLayerPrograms.get(e);return t&&(t.program.kill(),this.customLayerPrograms.delete(e),this.scheduleRender()),this}getCamera(){return this.camera}setCamera(e){return this.camera.cancelAnimation(),this.unbindCameraHandlers(),this.camera=e,this.bindCameraHandlers(),this.scheduleRender(),this}getContainer(){return this.container}getGraph(){return this.internals.graph}setGraph(e){return e===this.internals.graph||(this.stateManager.pruneNodes(t=>e.hasNode(t)),this.stateManager.pruneEdges(t=>e.hasEdge(t)),this.unbindGraphHandlers(),this.checkEdgesEventsFrame!==null&&(cancelAnimationFrame(this.checkEdgesEventsFrame),this.checkEdgesEventsFrame=null),this.internals.graph=e,this.autoRescaleFrozen=!1,this.bindGraphHandlers(),this.refresh()),this}getMouseCaptor(){return this.mouseCaptor}getTouchCaptor(){return this.touchCaptor}getDimensions(){return{width:this.width,height:this.height}}getGraphDimensions(){let e=this.customBBox||this.nodeExtent;return{width:e.x[1]-e.x[0]||1,height:e.y[1]-e.y[0]||1}}getNodeDisplayData(e){let t=this.internals.nodeDataCache[e];return t?Object.assign({},t):void 0}getEdgeDisplayData(e){let t=this.internals.edgeDataCache[e];return t?Object.assign({},t):void 0}getNodeState(e){return this.stateManager.getNodeState(e)}getEdgeState(e){return this.stateManager.getEdgeState(e)}getGraphState(){return this.stateManager.getGraphState()}setNodeState(e,t){return this.stateManager.setNodeState(e,t),this}setEdgeState(e,t){return this.stateManager.setEdgeState(e,t),this}setGraphState(e){return this.stateManager.setGraphState(e),this}_setPanning(e){this.stateManager.setGraphState({isPanning:e})}_setZooming(e){this.stateManager.setGraphState({isZooming:e})}_hasNodeDrag(){let{dragManager:e}=this.internals;return!!(e.pendingNode||e.session)}_showGestureHint(e){let t=this.internals.settings;t.gestureTarget===`shared`&&(this.gestureHint=this.gestureHint||new Da(this.container),this.gestureHint.show(e,t))}setNodesState(e,t){return this.stateManager.setNodesState(e,t),this}setEdgesState(e,t){return this.stateManager.setEdgesState(e,t),this}updateContainerCursor(){let e=this.stateManager.hovered,t=this.resolvedStageStyle.cursor||``;this.container.style.cursor=e&&ra(this.internals,e)||t}refreshStageStyle(){this.resolvedStageStyle=Si(this.stylesDeclaration.stage,this.stateManager.graphState),this.resolvedStageStyle.background!==void 0&&(this.container.style.backgroundColor=this.resolvedStageStyle.background),this.updateContainerCursor()}getNodeDisplayedLabels(){return new Set(this.labelRenderer.displayedNodeLabels)}getEdgeDisplayedLabels(){return new Set(this.labelRenderer.displayedEdgeLabels)}getSettings(){return{...this.internals.settings}}getSetting(e){return this.internals.settings[e]}getStyles(){return{...this.stylesDeclaration}}getPrimitives(){return{...this.internals.primitives}}setSetting(e,t){return this.internals.settings[e]=t,Ai(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}updateSetting(e,t){return this.setSetting(e,t(this.internals.settings[e])),this}setSettings(e){return this.internals.settings={...this.internals.settings,...e},Ai(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}resize(e){let t=this.width,n=this.height;if(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.internals.pixelRatio=rt(),this.width===0){if(this.internals.settings.allowInvalidContainer)this.width=1;else throw Error(`Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.`)}if(this.height===0){if(this.internals.settings.allowInvalidContainer)this.height=1;else throw Error(`Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.`)}if(!e&&t===this.width&&n===this.height)return this;this.labelRenderer.labelsDirty=!0;for(let e of[this.mouseLayer,...Object.values(this.extraElements)])e.style.width=this.width+`px`,e.style.height=this.height+`px`;return this.webGLContext&&(this.stageCanvas.setAttribute(`width`,this.width*this.internals.pixelRatio+`px`),this.stageCanvas.setAttribute(`height`,this.height*this.internals.pixelRatio+`px`),this.webGLContext.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio)),this.emit(`resize`),this}clear(){return this.emit(`beforeClear`),this.webGLContext.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER,null),this.webGLContext.clear(WebGLRenderingContext.COLOR_BUFFER_BIT),this.emit(`afterClear`),this}scheduleStateRefresh(){this.needToRefreshState=!0,this.scheduleRender()}refreshState(){this.stateManager.flushGraphStateFlags();let e=this.stateManager.graphStateChanged&&this.internals.nodeStyleAnalysis.dependency===`graph-state`,t=this.stateManager.graphStateChanged&&this.edgeStyleAnalysis.dependency===`graph-state`,n=!1;if(e)this.internals.graph.forEachNode(e=>{this.refreshNodeState(e)&&(n=!0)});else if(this.internals.nodeStyleAnalysis.dependency!==`static`)for(let e of this.stateManager.dirtyNodes)this.refreshNodeState(e)&&(n=!0);if(t)this.internals.graph.forEachEdge(e=>{this.refreshEdgeState(e)&&(n=!0)});else if(this.edgeStyleAnalysis.dependency!==`static`)for(let e of this.stateManager.dirtyEdges)this.refreshEdgeState(e)&&(n=!0);this.stateManager.graphStateChanged&&this.stylesDeclaration?.stage&&this.refreshStageStyle(),this.stateManager.clearDirtyTracking(),n&&(this.pendingProcess=`full`)}refreshNodeState(e){let t=this.internals.nodeDataCache[e];if(!t||this.nodeReducer){let t=this.internals.nodeDataCache[e]?.depth,n=this.internals.nodeDataCache[e]?.zIndex,r=this.internals.nodeDataCache[e]?.labelAttachment;this.updateNode(e);let i=this.internals.nodeDataCache[e];this.internals.attachmentManager&&i.labelAttachment!==r&&this.internals.attachmentManager.invalidateNode(e);let a;a=this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&i.shape&&i.shape in this.internals.nodeShapeMap?this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[i.shape]]:v(i.shape||`circle`),this.internals.nodeDataTexture.updateNode(e,i.x,i.y,i.size,a,...qe(i),i.color),t&&i.depth!==t&&this.updateNodeDepthRanges(e,t,i.depth);let o=this.nodeProgramIndex[e];return o!==void 0&&(this.addNodeToProgram(e,o),this.nodeProgram.invalidateBuffers()),n!==void 0&&i.zIndex!==n}let n=this.internals.graph.getNodeAttributes(e),r=this.stateManager.getNodeState(e),i=t.size,a=t.shape,o=t.depth,s=t.zIndex,c=t.labelAttachment,l=t.rotationAlignment,u=t.labelRotationAlignment,d=t.color;yi(this.stylesDeclaration.nodes,n,r,this.stateManager.graphState,this.internals.graph,t),this.postEvaluateNode(t,n,r);let f=this.nodeGraphCoords[e],p=t.x!==f.x||t.y!==f.y;if(p&&(f.x=t.x,f.y=t.y),this.normalizationFunction.applyTo(t),this.internals.nodeShapeMap?t.shape&&t.shape in this.internals.nodeShapeMap||(t.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(t.shape=this.nodeShapeSlug),this.internals.attachmentManager&&t.labelAttachment!==c&&this.internals.attachmentManager.invalidateNode(e),Ge(this.internals.nodesWithForcedLabels,e,A(t)),Ge(this.internals.nodesWithBackdrop,e,Ke(t)),p||t.size!==i||t.shape!==a||t.rotationAlignment!==l||t.labelRotationAlignment!==u||t.color!==d){let n;n=this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&t.shape&&t.shape in this.internals.nodeShapeMap?this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[t.shape]]:v(t.shape||`circle`),this.internals.nodeDataTexture.updateNode(e,t.x,t.y,t.size,n,...qe(t),t.color)}this.itemBuckets.nodes.set(e,t.depth),t.depth!==o&&this.updateNodeDepthRanges(e,o,t.depth);let m=this.nodeProgramIndex[e];return m!==void 0&&(this.addNodeToProgram(e,m),this.nodeProgram.invalidateBuffers()),t.zIndex!==s}refreshEdgeState(e){let t=this.internals.edgeDataCache[e];if(!t||this.edgeReducer){let n=t?.depth,r=t?.zIndex;this.updateEdge(e);let i=this.internals.edgeDataCache[e];n&&i.depth!==n&&this.updateEdgeDepthRanges(e,n,i.depth);let a=this.edgeProgramIndex[e];return a!==void 0&&(this.addEdgeToProgram(e,a),this.edgeProgram.invalidateBuffers()),r!==void 0&&i.zIndex!==r}let n=this.internals.graph.getEdgeAttributes(e),r=this.stateManager.getEdgeState(e),i=t.depth,a=t.zIndex,o=t.size,s=t.path,c=t.selfLoopPath,l=t.parallelPath,u=t.head,d=t.tail;bi(this.stylesDeclaration.edges,n,r,this.stateManager.graphState,this.internals.graph,t),this.postEvaluateEdge(t,n),this.applyEdgeSpread(e,t,r),Ge(this.internals.edgesWithForcedLabels,e,A(t)),this.itemBuckets.edges.set(e,t.depth),t.depth!==i&&this.updateEdgeDepthRanges(e,i,t.depth);let f=this.edgeProgramIndex[e];if(f!==void 0){if(t.size!==o||t.path!==s||t.selfLoopPath!==c||t.parallelPath!==l||t.head!==u||t.tail!==d)this.addEdgeToProgram(e,f),this.edgeProgram.invalidateBuffers();else{let n=this.internals.graph.source(e),r=this.internals.graph.target(e),i=this.internals.nodeDataCache[n],a=this.internals.nodeDataCache[r],o=this.edgeTextureIndexCache[e];this.edgeProgram.process(Xi(this.pickingState,`edge`,e),f,i,a,t,o),this.edgeProgram.invalidateBuffers()}}return t.zIndex!==a}refresh(e){let t=e?.skipIndexation!==void 0&&e?.skipIndexation,n=e?.schedule!==void 0&&e.schedule;if(!e||!e.partialGraph)this.clearEdgeIndices(),this.clearNodeIndices(),this.internals.graph.forEachNode(e=>this.addNode(e)),this.edgeGroups.rebuild(),this.internals.graph.forEachEdge(e=>this.addEdge(e)),this.pendingProcess=`full`;else{let n=e.partialGraph?.nodes||[];for(let e=0,r=n?.length||0;e<r;e++){let r=``+n[e],i=this.internals.nodeDataCache[r]?.labelAttachment;if(this.updateNode(r),this.internals.attachmentManager&&(this.internals.nodeDataCache[r]?.labelAttachment||i)&&this.internals.attachmentManager.invalidateNode(r),t){let e=this.nodeProgramIndex[r];if(e===void 0)throw Error(`Sigma: node "${r}" can't be repaint`);this.addNodeToProgram(r,e)}}t&&n.length>0&&(this.nodeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0);let r=e?.partialGraph?.edges||[];for(let e=0,n=r.length;e<n;e++){let n=``+r[e];if(this.updateEdge(n),t){let e=this.edgeProgramIndex[n];if(e===void 0)throw Error(`Sigma: edge "${n}" can't be repaint`);this.addEdgeToProgram(n,e)}}t&&r.length>0&&(this.edgeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0),!t&&this.pendingProcess!==`full`&&(this.pendingProcess=r.length>0?`full`:`nodes`)}return n?this.scheduleRender():this.render(),this}scheduleRender(){return this.renderFrame||=requestAnimationFrame(()=>{this.render()}),this}scheduleRefresh(e){return this.refresh({...e,schedule:!0})}getViewportZoomedState(e,t){let{ratio:n,angle:r,x:i,y:a}=this.camera.getState(),{minCameraRatio:o,maxCameraRatio:s}=this.internals.settings;typeof s==`number`&&(t=Math.min(t,s)),typeof o==`number`&&(t=Math.max(t,o));let c=t/n,l={x:this.width/2,y:this.height/2},u=this.viewportToFramedGraph(e),d=this.viewportToFramedGraph(l);return{angle:r,x:(u.x-d.x)*(1-c)+i,y:(u.y-d.y)*(1-c)+a,ratio:t}}viewRectangle(){let e=this.viewportToFramedGraph({x:0,y:0}),t=this.viewportToFramedGraph({x:this.width,y:0}),n=this.viewportToFramedGraph({x:0,y:this.height});return{x1:e.x,y1:e.y,x2:t.x,y2:t.y,height:t.y-n.y}}framedGraphToViewport(e,t={}){let n=!!t.cameraState||!!t.viewportDimensions||!!t.graphDimensions||!!t.padding,r=xe(t.matrix||(n?Ce(t.cameraState||this.camera.getState(),t.viewportDimensions||this.getDimensions(),t.graphDimensions||this.getGraphDimensions(),t.padding||this.getStagePadding()):this.matrix),e);return{x:(1+r.x)*this.width/2,y:(1-r.y)*this.height/2}}viewportToFramedGraph(e,t={}){let n=!!t.cameraState||!!t.viewportDimensions||!!t.graphDimensions||!!t.padding,r=xe(t.matrix||(n?Ce(t.cameraState||this.camera.getState(),t.viewportDimensions||this.getDimensions(),t.graphDimensions||this.getGraphDimensions(),t.padding||this.getStagePadding(),!0):this.invMatrix),{x:e.x/this.width*2-1,y:1-e.y/this.height*2});return isNaN(r.x)&&(r.x=0),isNaN(r.y)&&(r.y=0),r}viewportToGraph(e,t={}){return this.normalizationFunction.inverse(this.viewportToFramedGraph(e,t))}graphToViewport(e,t={}){return this.framedGraphToViewport(this.normalizationFunction(e),t)}graphToFramedGraph(e){return this.normalizationFunction(e)}framedGraphToGraph(e){return this.normalizationFunction.inverse(e)}getGraphToViewportRatio(){let e={x:0,y:0},t={x:1,y:1},n=Math.sqrt((e.x-t.x)**2+(e.y-t.y)**2),r=this.graphToViewport(e),i=this.graphToViewport(t);return Math.sqrt((r.x-i.x)**2+(r.y-i.y)**2)/n}computeNodeExtent(){let e=this.nodeGraphCoords,t=Object.keys(e);if(!t.length)return{x:[0,1],y:[0,1]};let n=1/0,r=-1/0,i=1/0,a=-1/0;for(let o=0,s=t.length;o<s;o++){let{x:s,y:c}=e[t[o]];s<n&&(n=s),s>r&&(r=s),c<i&&(i=c),c>a&&(a=c)}return{x:[n,r],y:[i,a]}}getBBox(){return this.nodeExtent}getCustomBBox(){return this.customBBox}setCustomBBox(e){return this.customBBox=e,this.scheduleRender(),this}kill(){this.emit(`kill`),this.removeAllListeners(),this.camera.cancelAnimation(),this.unbindCameraHandlers(),window.removeEventListener(`resize`,this.activeListeners.handleResize),this.mouseCaptor.kill(),this.touchCaptor.kill(),this.internals.hoverResolver.kill(),this.unbindGraphHandlers(),this.clearIndices(),this.clearState(),this.internals.nodeDataCache={},this.internals.edgeDataCache={},this.renderFrame&&=(cancelAnimationFrame(this.renderFrame),null);let e=this.container;for(;e.firstChild;)e.removeChild(e.firstChild);this.nodeProgram.kill(),this.nodeFramePass.kill(),this.edgeProgram.kill(),this.edgeFramePass.kill(),this.internals.labelProgram.kill(),this.internals.edgeLabelProgram?.kill(),this.internals.edgeLabelBackgroundProgram?.kill(),this.internals.backdropProgram.kill(),this.internals.labelBackgroundProgram.kill(),this.internals.attachmentProgram?.kill(),this.internals.attachmentManager?.kill(),this.internals.attachmentProgram=null,this.internals.attachmentManager=null;for(let{program:e}of this.customLayerPrograms.values())e.kill();this.customLayerPrograms.clear(),this.sdfAtlas&&=null,this.internals.nodeDataTexture&&(this.internals.nodeDataTexture.kill(),this.internals.nodeDataTexture=null),this.internals.nodeFrameTexture&&(this.internals.nodeFrameTexture.kill(),this.internals.nodeFrameTexture=null),this.internals.edgeDataTexture&&(this.internals.edgeDataTexture.kill(),this.internals.edgeDataTexture=null),this.internals.edgeFrameTexture&&(this.internals.edgeFrameTexture.kill(),this.internals.edgeFrameTexture=null),this.webGLContext&&=(this.webGLContext.getExtension(`WEBGL_lose_context`)?.loseContext(),null),this.gestureHint?.kill(),this.gestureHint=null,this.mouseLayer.remove();for(let e in this.extraElements)this.extraElements[e].remove();this.extraElements={}}scaleSize(e=1,t=this.camera.ratio){return e/this.internals.settings.zoomToSizeRatioFunction(t)*(this.getSetting(`itemSizesReference`)===`positions`?t*this.graphToViewportRatio:1)}getStageCanvas(){return this.stageCanvas}getMouseLayer(){return this.mouseLayer}};typeof window<`u`&&window.self!==window.top&&(ki.gestureTarget=`shared`);var lo=[`x`,`y`,`ratio`,`angle`];function uo(){if(typeof window>`u`)return null;let e=new URLSearchParams(location.search).get(`camera`);if(!e)return null;let t={};return e.split(`,`).forEach((e,n)=>{let r=e===``?NaN:Number(e);n<lo.length&&Number.isFinite(r)&&(t[lo[n]]=r)}),t}var fo=class extends co{constructor(...e){super(...e);let t=uo();t&&queueMicrotask(()=>this.getCamera().setState(t))}};function po(){let e=arguments[0];for(let t=1,n=arguments.length;t<n;t++)if(arguments[t])for(let n in arguments[t])e[n]=arguments[t][n];return e}var U=po;typeof Object.assign==`function`&&(U=Object.assign);function W(e,t,n,r){let i=e._nodes.get(t),a=null;return i&&(a=r===`mixed`?i.out&&i.out[n]||i.undirected&&i.undirected[n]:r===`directed`?i.out&&i.out[n]:i.undirected&&i.undirected[n]),a}function G(e){return typeof e==`object`&&!!e}function mo(e){let t;for(t in e)return!1;return!0}function K(e,t,n){Object.defineProperty(e,t,{enumerable:!1,configurable:!1,writable:!0,value:n})}function q(e,t,n){let r={enumerable:!0,configurable:!0};typeof n==`function`?r.get=n:(r.value=n,r.writable=!1),Object.defineProperty(e,t,r)}function ho(e){return!(!G(e)||e.attributes&&!Array.isArray(e.attributes))}function go(){let e=Math.floor(Math.random()*256)&255;return()=>e++}function J(){let e=arguments,t=null,n=-1;return{[Symbol.iterator](){return this},next(){let r=null;do{if(t===null){if(n++,n>=e.length)return{done:!0};t=e[n][Symbol.iterator]()}if(r=t.next(),r.done)t=null;else break}while(1);return r}}}function _o(){return{[Symbol.iterator](){return this},next(){return{done:!0}}}}var vo=class extends Error{constructor(e){super(),this.name=`GraphError`,this.message=e}},Y=class e extends vo{constructor(t){super(t),this.name=`InvalidArgumentsGraphError`,typeof Error.captureStackTrace==`function`&&Error.captureStackTrace(this,e.prototype.constructor)}},X=class e extends vo{constructor(t){super(t),this.name=`NotFoundGraphError`,typeof Error.captureStackTrace==`function`&&Error.captureStackTrace(this,e.prototype.constructor)}},Z=class e extends vo{constructor(t){super(t),this.name=`UsageGraphError`,typeof Error.captureStackTrace==`function`&&Error.captureStackTrace(this,e.prototype.constructor)}};function yo(e,t){this.key=e,this.attributes=t,this.clear()}yo.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.undirectedLoops=0,this.directedLoops=0,this.in={},this.out={},this.undirected={}};function bo(e,t){this.key=e,this.attributes=t,this.clear()}bo.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.directedLoops=0,this.in={},this.out={}};function xo(e,t){this.key=e,this.attributes=t,this.clear()}xo.prototype.clear=function(){this.undirectedDegree=0,this.undirectedLoops=0,this.undirected={}};function So(e,t,n,r,i){this.key=t,this.attributes=i,this.undirected=e,this.source=n,this.target=r}So.prototype.attach=function(){let e=`out`,t=`in`;this.undirected&&(e=t=`undirected`);let n=this.source.key,r=this.target.key;this.source[e][r]=this,this.undirected&&n===r||(this.target[t][n]=this)},So.prototype.attachMulti=function(){let e=`out`,t=`in`,n=this.source.key,r=this.target.key;this.undirected&&(e=t=`undirected`);let i=this.source[e],a=i[r];a===void 0?(i[r]=this,this.undirected&&n===r||(this.target[t][n]=this)):(a.previous=this,this.next=a,i[r]=this,this.target[t][n]=this)},So.prototype.detach=function(){let e=this.source.key,t=this.target.key,n=`out`,r=`in`;this.undirected&&(n=r=`undirected`),delete this.source[n][t],delete this.target[r][e]},So.prototype.detachMulti=function(){let e=this.source.key,t=this.target.key,n=`out`,r=`in`;this.undirected&&(n=r=`undirected`),this.previous===void 0?this.next===void 0?(delete this.source[n][t],delete this.target[r][e]):(this.next.previous=void 0,this.source[n][t]=this.next,this.target[r][e]=this.next):(this.previous.next=this.next,this.next!==void 0&&(this.next.previous=this.previous))};var Co=0,wo=1,To=2,Eo=3;function Q(e,t,n,r,i,a,o){let s,c,l,u;if(r=``+r,n===Co){if(s=e._nodes.get(r),!s)throw new X(`Graph.${t}: could not find the "${r}" node in the graph.`);l=i,u=a}else if(n===Eo){if(i=``+i,c=e._edges.get(i),!c)throw new X(`Graph.${t}: could not find the "${i}" edge in the graph.`);let n=c.source.key,d=c.target.key;if(r===n)s=c.target;else if(r===d)s=c.source;else throw new X(`Graph.${t}: the "${r}" node is not attached to the "${i}" edge (${n}, ${d}).`);l=a,u=o}else{if(c=e._edges.get(r),!c)throw new X(`Graph.${t}: could not find the "${r}" edge in the graph.`);s=n===wo?c.source:c.target,l=i,u=a}return[s,l,u]}function Do(e,t,n){e.prototype[t]=function(e,r,i){let[a,o]=Q(this,t,n,e,r,i);return a.attributes[o]}}function Oo(e,t,n){e.prototype[t]=function(e,r){let[i]=Q(this,t,n,e,r);return i.attributes}}function ko(e,t,n){e.prototype[t]=function(e,r,i){let[a,o]=Q(this,t,n,e,r,i);return a.attributes.hasOwnProperty(o)}}function Ao(e,t,n){e.prototype[t]=function(e,r,i,a){let[o,s,c]=Q(this,t,n,e,r,i,a);return o.attributes[s]=c,this.emit(`nodeAttributesUpdated`,{key:o.key,type:`set`,attributes:o.attributes,name:s}),this}}function jo(e,t,n){e.prototype[t]=function(e,r,i,a){let[o,s,c]=Q(this,t,n,e,r,i,a);if(typeof c!=`function`)throw new Y(`Graph.${t}: updater should be a function.`);let l=o.attributes;return l[s]=c(l[s]),this.emit(`nodeAttributesUpdated`,{key:o.key,type:`set`,attributes:o.attributes,name:s}),this}}function Mo(e,t,n){e.prototype[t]=function(e,r,i){let[a,o]=Q(this,t,n,e,r,i);return delete a.attributes[o],this.emit(`nodeAttributesUpdated`,{key:a.key,type:`remove`,attributes:a.attributes,name:o}),this}}function No(e,t,n){e.prototype[t]=function(e,r,i){let[a,o]=Q(this,t,n,e,r,i);if(!G(o))throw new Y(`Graph.${t}: provided attributes are not a plain object.`);return a.attributes=o,this.emit(`nodeAttributesUpdated`,{key:a.key,type:`replace`,attributes:a.attributes}),this}}function Po(e,t,n){e.prototype[t]=function(e,r,i){let[a,o]=Q(this,t,n,e,r,i);if(!G(o))throw new Y(`Graph.${t}: provided attributes are not a plain object.`);return U(a.attributes,o),this.emit(`nodeAttributesUpdated`,{key:a.key,type:`merge`,attributes:a.attributes,data:o}),this}}function Fo(e,t,n){e.prototype[t]=function(e,r,i){let[a,o]=Q(this,t,n,e,r,i);if(typeof o!=`function`)throw new Y(`Graph.${t}: provided updater is not a function.`);return a.attributes=o(a.attributes),this.emit(`nodeAttributesUpdated`,{key:a.key,type:`update`,attributes:a.attributes}),this}}var Io=[{name:e=>`get${e}Attribute`,attacher:Do},{name:e=>`get${e}Attributes`,attacher:Oo},{name:e=>`has${e}Attribute`,attacher:ko},{name:e=>`set${e}Attribute`,attacher:Ao},{name:e=>`update${e}Attribute`,attacher:jo},{name:e=>`remove${e}Attribute`,attacher:Mo},{name:e=>`replace${e}Attributes`,attacher:No},{name:e=>`merge${e}Attributes`,attacher:Po},{name:e=>`update${e}Attributes`,attacher:Fo}];function Lo(e){Io.forEach(function({name:t,attacher:n}){n(e,t(`Node`),Co),n(e,t(`Source`),wo),n(e,t(`Target`),To),n(e,t(`Opposite`),Eo)})}function Ro(e,t,n){e.prototype[t]=function(e,r){let i;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let a=``+e,o=``+r;if(r=arguments[2],i=W(this,a,o,n),!i)throw new X(`Graph.${t}: could not find an edge for the given path ("${a}" - "${o}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,i=this._edges.get(e),!i)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}return i.attributes[r]}}function zo(e,t,n){e.prototype[t]=function(e){let r;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>1){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let i=``+e,a=``+arguments[1];if(r=W(this,i,a,n),!r)throw new X(`Graph.${t}: could not find an edge for the given path ("${i}" - "${a}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,r=this._edges.get(e),!r)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}return r.attributes}}function Bo(e,t,n){e.prototype[t]=function(e,r){let i;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let a=``+e,o=``+r;if(r=arguments[2],i=W(this,a,o,n),!i)throw new X(`Graph.${t}: could not find an edge for the given path ("${a}" - "${o}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,i=this._edges.get(e),!i)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}return i.attributes.hasOwnProperty(r)}}function Vo(e,t,n){e.prototype[t]=function(e,r,i){let a;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=``+e,s=``+r;if(r=arguments[2],i=arguments[3],a=W(this,o,s,n),!a)throw new X(`Graph.${t}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,a=this._edges.get(e),!a)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}return a.attributes[r]=i,this.emit(`edgeAttributesUpdated`,{key:a.key,type:`set`,attributes:a.attributes,name:r}),this}}function Ho(e,t,n){e.prototype[t]=function(e,r,i){let a;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=``+e,s=``+r;if(r=arguments[2],i=arguments[3],a=W(this,o,s,n),!a)throw new X(`Graph.${t}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,a=this._edges.get(e),!a)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}if(typeof i!=`function`)throw new Y(`Graph.${t}: updater should be a function.`);return a.attributes[r]=i(a.attributes[r]),this.emit(`edgeAttributesUpdated`,{key:a.key,type:`set`,attributes:a.attributes,name:r}),this}}function Uo(e,t,n){e.prototype[t]=function(e,r){let i;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let a=``+e,o=``+r;if(r=arguments[2],i=W(this,a,o,n),!i)throw new X(`Graph.${t}: could not find an edge for the given path ("${a}" - "${o}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,i=this._edges.get(e),!i)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}return delete i.attributes[r],this.emit(`edgeAttributesUpdated`,{key:i.key,type:`remove`,attributes:i.attributes,name:r}),this}}function Wo(e,t,n){e.prototype[t]=function(e,r){let i;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let a=``+e,o=``+r;if(r=arguments[2],i=W(this,a,o,n),!i)throw new X(`Graph.${t}: could not find an edge for the given path ("${a}" - "${o}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,i=this._edges.get(e),!i)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}if(!G(r))throw new Y(`Graph.${t}: provided attributes are not a plain object.`);return i.attributes=r,this.emit(`edgeAttributesUpdated`,{key:i.key,type:`replace`,attributes:i.attributes}),this}}function Go(e,t,n){e.prototype[t]=function(e,r){let i;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let a=``+e,o=``+r;if(r=arguments[2],i=W(this,a,o,n),!i)throw new X(`Graph.${t}: could not find an edge for the given path ("${a}" - "${o}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,i=this._edges.get(e),!i)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}if(!G(r))throw new Y(`Graph.${t}: provided attributes are not a plain object.`);return U(i.attributes,r),this.emit(`edgeAttributesUpdated`,{key:i.key,type:`merge`,attributes:i.attributes,data:r}),this}}function Ko(e,t,n){e.prototype[t]=function(e,r){let i;if(this.type!==`mixed`&&n!==`mixed`&&n!==this.type)throw new Z(`Graph.${t}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${t}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let a=``+e,o=``+r;if(r=arguments[2],i=W(this,a,o,n),!i)throw new X(`Graph.${t}: could not find an edge for the given path ("${a}" - "${o}").`)}else{if(n!==`mixed`)throw new Z(`Graph.${t}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=``+e,i=this._edges.get(e),!i)throw new X(`Graph.${t}: could not find the "${e}" edge in the graph.`)}if(typeof r!=`function`)throw new Y(`Graph.${t}: provided updater is not a function.`);return i.attributes=r(i.attributes),this.emit(`edgeAttributesUpdated`,{key:i.key,type:`update`,attributes:i.attributes}),this}}var qo=[{name:e=>`get${e}Attribute`,attacher:Ro},{name:e=>`get${e}Attributes`,attacher:zo},{name:e=>`has${e}Attribute`,attacher:Bo},{name:e=>`set${e}Attribute`,attacher:Vo},{name:e=>`update${e}Attribute`,attacher:Ho},{name:e=>`remove${e}Attribute`,attacher:Uo},{name:e=>`replace${e}Attributes`,attacher:Wo},{name:e=>`merge${e}Attributes`,attacher:Go},{name:e=>`update${e}Attributes`,attacher:Ko}];function Jo(e){qo.forEach(function({name:t,attacher:n}){n(e,t(`Edge`),`mixed`),n(e,t(`DirectedEdge`),`directed`),n(e,t(`UndirectedEdge`),`undirected`)})}var Yo=[{name:`edges`,type:`mixed`},{name:`inEdges`,type:`directed`,direction:`in`},{name:`outEdges`,type:`directed`,direction:`out`},{name:`inboundEdges`,type:`mixed`,direction:`in`},{name:`outboundEdges`,type:`mixed`,direction:`out`},{name:`directedEdges`,type:`directed`},{name:`undirectedEdges`,type:`undirected`}];function Xo(e,t,n,r){let i=!1;for(let a in t){if(a===r)continue;let o=t[a];if(i=n(o.key,o.attributes,o.source.key,o.target.key,o.source.attributes,o.target.attributes,o.undirected),e&&i)return o.key}}function Zo(e,t,n,r){let i,a,o,s=!1;for(let c in t)if(c!==r){i=t[c];do{if(a=i.source,o=i.target,s=n(i.key,i.attributes,a.key,o.key,a.attributes,o.attributes,i.undirected),e&&s)return i.key;i=i.next}while(i!==void 0)}}function Qo(e,t){let n=Object.keys(e),r=n.length,i,a=0;return{[Symbol.iterator](){return this},next(){do if(i)i=i.next;else{if(a>=r)return{done:!0};let o=n[a++];if(o===t){i=void 0;continue}i=e[o]}while(!i);return{done:!1,value:{edge:i.key,attributes:i.attributes,source:i.source.key,target:i.target.key,sourceAttributes:i.source.attributes,targetAttributes:i.target.attributes,undirected:i.undirected}}}}}function $o(e,t,n,r){let i=t[n];if(!i)return;let a=i.source,o=i.target;if(r(i.key,i.attributes,a.key,o.key,a.attributes,o.attributes,i.undirected)&&e)return i.key}function es(e,t,n,r){let i=t[n];if(!i)return;let a=!1;do{if(a=r(i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes,i.undirected),e&&a)return i.key;i=i.next}while(i!==void 0)}function ts(e,t){let n=e[t];if(n.next!==void 0)return{[Symbol.iterator](){return this},next(){if(!n)return{done:!0};let e={edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected};return n=n.next,{done:!1,value:e}}};let r=!1;return{[Symbol.iterator](){return this},next(){return r===!0?{done:!0}:(r=!0,{done:!1,value:{edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected}})}}}function ns(e,t){if(e.size===0)return[];if(t===`mixed`||t===e.type)return Array.from(e._edges.keys());let n=t===`undirected`?e.undirectedSize:e.directedSize,r=Array(n),i=t===`undirected`,a=e._edges.values(),o=0,s,c;for(;s=a.next(),s.done!==!0;)c=s.value,c.undirected===i&&(r[o++]=c.key);return r}function rs(e,t,n,r){if(t.size===0)return;let i=n!==`mixed`&&n!==t.type,a=n===`undirected`,o,s,c=!1,l=t._edges.values();for(;o=l.next(),o.done!==!0;){if(s=o.value,i&&s.undirected!==a)continue;let{key:t,attributes:n,source:l,target:u}=s;if(c=r(t,n,l.key,u.key,l.attributes,u.attributes,s.undirected),e&&c)return t}}function is(e,t){if(e.size===0)return _o();let n=t!==`mixed`&&t!==e.type,r=t===`undirected`,i=e._edges.values();return{[Symbol.iterator](){return this},next(){let e,t;for(;;){if(e=i.next(),e.done)return e;if(t=e.value,!(n&&t.undirected!==r))break}return{value:{edge:t.key,attributes:t.attributes,source:t.source.key,target:t.target.key,sourceAttributes:t.source.attributes,targetAttributes:t.target.attributes,undirected:t.undirected},done:!1}}}}function as(e,t,n,r,i,a){let o=t?Zo:Xo,s;if(n!==`undirected`&&(r!==`out`&&(s=o(e,i.in,a),e&&s)||r!==`in`&&(s=o(e,i.out,a,r?void 0:i.key),e&&s))||n!==`directed`&&(s=o(e,i.undirected,a),e&&s))return s}function os(e,t,n,r){let i=[];return as(!1,e,t,n,r,function(e){i.push(e)}),i}function ss(e,t,n){let r=_o();return e!==`undirected`&&(t!==`out`&&n.in!==void 0&&(r=J(r,Qo(n.in))),t!==`in`&&n.out!==void 0&&(r=J(r,Qo(n.out,t?void 0:n.key)))),e!==`directed`&&n.undirected!==void 0&&(r=J(r,Qo(n.undirected))),r}function cs(e,t,n,r,i,a,o){let s=n?es:$o,c;if(t!==`undirected`&&(i.in!==void 0&&r!==`out`&&(c=s(e,i.in,a,o),e&&c)||i.out!==void 0&&r!==`in`&&(r||i.key!==a)&&(c=s(e,i.out,a,o),e&&c))||t!==`directed`&&i.undirected!==void 0&&(c=s(e,i.undirected,a,o),e&&c))return c}function ls(e,t,n,r,i){let a=[];return cs(!1,e,t,n,r,i,function(e){a.push(e)}),a}function us(e,t,n,r){let i=_o();return e!==`undirected`&&(n.in!==void 0&&t!==`out`&&r in n.in&&(i=J(i,ts(n.in,r))),n.out!==void 0&&t!==`in`&&r in n.out&&(t||n.key!==r)&&(i=J(i,ts(n.out,r)))),e!==`directed`&&n.undirected!==void 0&&r in n.undirected&&(i=J(i,ts(n.undirected,r))),i}function ds(e,t){let{name:n,type:r,direction:i}=t;e.prototype[n]=function(e,t){if(r!==`mixed`&&this.type!==`mixed`&&r!==this.type)return[];if(!arguments.length)return ns(this,r);if(arguments.length===1){e=``+e;let t=this._nodes.get(e);if(t===void 0)throw new X(`Graph.${n}: could not find the "${e}" node in the graph.`);return os(this.multi,r===`mixed`?this.type:r,i,t)}if(arguments.length===2){e=``+e,t=``+t;let a=this._nodes.get(e);if(!a)throw new X(`Graph.${n}:  could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new X(`Graph.${n}:  could not find the "${t}" target node in the graph.`);return ls(r,this.multi,i,a,t)}throw new Y(`Graph.${n}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function fs(e,t){let{name:n,type:r,direction:i}=t,a=`forEach`+n[0].toUpperCase()+n.slice(1,-1);e.prototype[a]=function(e,t,n){if(r===`mixed`||this.type===`mixed`||r===this.type){if(arguments.length===1)return n=e,rs(!1,this,r,n);if(arguments.length===2){e=``+e,n=t;let o=this._nodes.get(e);if(o===void 0)throw new X(`Graph.${a}: could not find the "${e}" node in the graph.`);return as(!1,this.multi,r===`mixed`?this.type:r,i,o,n)}if(arguments.length===3){e=``+e,t=``+t;let o=this._nodes.get(e);if(!o)throw new X(`Graph.${a}:  could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new X(`Graph.${a}:  could not find the "${t}" target node in the graph.`);return cs(!1,r,this.multi,i,o,t,n)}throw new Y(`Graph.${a}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)}};let o=`map`+n[0].toUpperCase()+n.slice(1);e.prototype[o]=function(){let e=Array.prototype.slice.call(arguments),t=e.pop(),n;if(e.length===0){let i=0;r!==`directed`&&(i+=this.undirectedSize),r!==`undirected`&&(i+=this.directedSize),n=Array(i);let a=0;e.push((e,r,i,o,s,c,l)=>{n[a++]=t(e,r,i,o,s,c,l)})}else n=[],e.push((e,r,i,a,o,s,c)=>{n.push(t(e,r,i,a,o,s,c))});return this[a].apply(this,e),n};let s=`filter`+n[0].toUpperCase()+n.slice(1);e.prototype[s]=function(){let e=Array.prototype.slice.call(arguments),t=e.pop(),n=[];return e.push((e,r,i,a,o,s,c)=>{t(e,r,i,a,o,s,c)&&n.push(e)}),this[a].apply(this,e),n};let c=`reduce`+n[0].toUpperCase()+n.slice(1);e.prototype[c]=function(){let e=Array.prototype.slice.call(arguments);if(e.length<2||e.length>4)throw new Y(`Graph.${c}: invalid number of arguments (expecting 2, 3 or 4 and got ${e.length}).`);if(typeof e[e.length-1]==`function`&&typeof e[e.length-2]!=`function`)throw new Y(`Graph.${c}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let t,n;e.length===2?(t=e[0],n=e[1],e=[]):e.length===3?(t=e[1],n=e[2],e=[e[0]]):e.length===4&&(t=e[2],n=e[3],e=[e[0],e[1]]);let r=n;return e.push((e,n,i,a,o,s,c)=>{r=t(r,e,n,i,a,o,s,c)}),this[a].apply(this,e),r}}function ps(e,t){let{name:n,type:r,direction:i}=t,a=`find`+n[0].toUpperCase()+n.slice(1,-1);e.prototype[a]=function(e,t,n){if(r!==`mixed`&&this.type!==`mixed`&&r!==this.type)return!1;if(arguments.length===1)return n=e,rs(!0,this,r,n);if(arguments.length===2){e=``+e,n=t;let o=this._nodes.get(e);if(o===void 0)throw new X(`Graph.${a}: could not find the "${e}" node in the graph.`);return as(!0,this.multi,r===`mixed`?this.type:r,i,o,n)}if(arguments.length===3){e=``+e,t=``+t;let o=this._nodes.get(e);if(!o)throw new X(`Graph.${a}:  could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new X(`Graph.${a}:  could not find the "${t}" target node in the graph.`);return cs(!0,r,this.multi,i,o,t,n)}throw new Y(`Graph.${a}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)};let o=`some`+n[0].toUpperCase()+n.slice(1,-1);e.prototype[o]=function(){let e=Array.prototype.slice.call(arguments),t=e.pop();return e.push((e,n,r,i,a,o,s)=>t(e,n,r,i,a,o,s)),!!this[a].apply(this,e)};let s=`every`+n[0].toUpperCase()+n.slice(1,-1);e.prototype[s]=function(){let e=Array.prototype.slice.call(arguments),t=e.pop();return e.push((e,n,r,i,a,o,s)=>!t(e,n,r,i,a,o,s)),!this[a].apply(this,e)}}function ms(e,t){let{name:n,type:r,direction:i}=t,a=n.slice(0,-1)+`Entries`;e.prototype[a]=function(e,t){if(r!==`mixed`&&this.type!==`mixed`&&r!==this.type)return _o();if(!arguments.length)return is(this,r);if(arguments.length===1){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.${a}: could not find the "${e}" node in the graph.`);return ss(r,i,t)}if(arguments.length===2){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.${a}:  could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new X(`Graph.${a}:  could not find the "${t}" target node in the graph.`);return us(r,i,n,t)}throw new Y(`Graph.${a}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function hs(e){Yo.forEach(t=>{ds(e,t),fs(e,t),ps(e,t),ms(e,t)})}var gs=[{name:`neighbors`,type:`mixed`},{name:`inNeighbors`,type:`directed`,direction:`in`},{name:`outNeighbors`,type:`directed`,direction:`out`},{name:`inboundNeighbors`,type:`mixed`,direction:`in`},{name:`outboundNeighbors`,type:`mixed`,direction:`out`},{name:`directedNeighbors`,type:`directed`},{name:`undirectedNeighbors`,type:`undirected`}];function _s(){this.A=null,this.B=null}_s.prototype.wrap=function(e){this.A===null?this.A=e:this.B===null&&(this.B=e)},_s.prototype.has=function(e){return this.A!==null&&e in this.A||this.B!==null&&e in this.B};function vs(e,t,n,r,i){for(let a in r){let o=r[a],s=o.source,c=o.target,l=s===n?c:s;if(t&&t.has(l.key))continue;let u=i(l.key,l.attributes);if(e&&u)return l.key}}function ys(e,t,n,r,i){if(t!==`mixed`){if(t===`undirected`)return vs(e,null,r,r.undirected,i);if(typeof n==`string`)return vs(e,null,r,r[n],i)}let a=new _s,o;if(t!==`undirected`){if(n!==`out`){if(o=vs(e,null,r,r.in,i),e&&o)return o;a.wrap(r.in)}if(n!==`in`){if(o=vs(e,a,r,r.out,i),e&&o)return o;a.wrap(r.out)}}if(t!==`directed`&&(o=vs(e,a,r,r.undirected,i),e&&o))return o}function bs(e,t,n){if(e!==`mixed`){if(e===`undirected`)return Object.keys(n.undirected);if(typeof t==`string`)return Object.keys(n[t])}let r=[];return ys(!1,e,t,n,function(e){r.push(e)}),r}function xs(e,t,n){let r=Object.keys(n),i=r.length,a=0;return{[Symbol.iterator](){return this},next(){let o=null;do{if(a>=i)return e&&e.wrap(n),{done:!0};let s=n[r[a++]],c=s.source,l=s.target;o=c===t?l:c,e&&e.has(o.key)&&(o=null)}while(o===null);return{done:!1,value:{neighbor:o.key,attributes:o.attributes}}}}}function Ss(e,t,n){if(e!==`mixed`){if(e===`undirected`)return xs(null,n,n.undirected);if(typeof t==`string`)return xs(null,n,n[t])}let r=_o(),i=new _s;return e!==`undirected`&&(t!==`out`&&(r=J(r,xs(i,n,n.in))),t!==`in`&&(r=J(r,xs(i,n,n.out)))),e!==`directed`&&(r=J(r,xs(i,n,n.undirected))),r}function Cs(e,t){let{name:n,type:r,direction:i}=t;e.prototype[n]=function(e){if(r!==`mixed`&&this.type!==`mixed`&&r!==this.type)return[];e=``+e;let t=this._nodes.get(e);if(t===void 0)throw new X(`Graph.${n}: could not find the "${e}" node in the graph.`);return bs(r===`mixed`?this.type:r,i,t)}}function ws(e,t){let{name:n,type:r,direction:i}=t,a=`forEach`+n[0].toUpperCase()+n.slice(1,-1);e.prototype[a]=function(e,t){if(r!==`mixed`&&this.type!==`mixed`&&r!==this.type)return;e=``+e;let n=this._nodes.get(e);if(n===void 0)throw new X(`Graph.${a}: could not find the "${e}" node in the graph.`);ys(!1,r===`mixed`?this.type:r,i,n,t)};let o=`map`+n[0].toUpperCase()+n.slice(1);e.prototype[o]=function(e,t){let n=[];return this[a](e,(e,r)=>{n.push(t(e,r))}),n};let s=`filter`+n[0].toUpperCase()+n.slice(1);e.prototype[s]=function(e,t){let n=[];return this[a](e,(e,r)=>{t(e,r)&&n.push(e)}),n};let c=`reduce`+n[0].toUpperCase()+n.slice(1);e.prototype[c]=function(e,t,n){if(arguments.length<3)throw new Y(`Graph.${c}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let r=n;return this[a](e,(e,n)=>{r=t(r,e,n)}),r}}function Ts(e,t){let{name:n,type:r,direction:i}=t,a=n[0].toUpperCase()+n.slice(1,-1),o=`find`+a;e.prototype[o]=function(e,t){if(r!==`mixed`&&this.type!==`mixed`&&r!==this.type)return;e=``+e;let n=this._nodes.get(e);if(n===void 0)throw new X(`Graph.${o}: could not find the "${e}" node in the graph.`);return ys(!0,r===`mixed`?this.type:r,i,n,t)};let s=`some`+a;e.prototype[s]=function(e,t){return!!this[o](e,t)};let c=`every`+a;e.prototype[c]=function(e,t){return!this[o](e,(e,n)=>!t(e,n))}}function Es(e,t){let{name:n,type:r,direction:i}=t,a=n.slice(0,-1)+`Entries`;e.prototype[a]=function(e){if(r!==`mixed`&&this.type!==`mixed`&&r!==this.type)return _o();e=``+e;let t=this._nodes.get(e);if(t===void 0)throw new X(`Graph.${a}: could not find the "${e}" node in the graph.`);return Ss(r===`mixed`?this.type:r,i,t)}}function Ds(e){gs.forEach(t=>{Cs(e,t),ws(e,t),Ts(e,t),Es(e,t)})}function Os(e,t,n,r,i){let a=r._nodes.values(),o=r.type,s,c,l,u,d,f,p;for(;s=a.next(),s.done!==!0;){let r=!1;if(c=s.value,o!==`undirected`)for(l in u=c.out,u){d=u[l];do{if(f=d.target,r=!0,p=i(c.key,f.key,c.attributes,f.attributes,d.key,d.attributes,d.undirected),e&&p)return d;d=d.next}while(d)}if(o!==`directed`){for(l in u=c.undirected,u)if(!(t&&c.key>l)){d=u[l];do{if(f=d.target,f.key!==l&&(f=d.source),r=!0,p=i(c.key,f.key,c.attributes,f.attributes,d.key,d.attributes,d.undirected),e&&p)return d;d=d.next}while(d)}}if(n&&!r&&(p=i(c.key,null,c.attributes,null,null,null,null),e&&p))return null}}function ks(e,t){let n={key:e};return mo(t.attributes)||(n.attributes=U({},t.attributes)),n}function As(e,t,n){let r={key:t,source:n.source.key,target:n.target.key};return mo(n.attributes)||(r.attributes=U({},n.attributes)),e===`mixed`&&n.undirected&&(r.undirected=!0),r}function js(e){if(!G(e))throw new Y(`Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.`);if(!(`key`in e))throw new Y(`Graph.import: serialized node is missing its key.`);if(`attributes`in e&&(!G(e.attributes)||e.attributes===null))throw new Y(`Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.`)}function Ms(e){if(!G(e))throw new Y(`Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.`);if(!(`source`in e))throw new Y(`Graph.import: serialized edge is missing its source.`);if(!(`target`in e))throw new Y(`Graph.import: serialized edge is missing its target.`);if(`attributes`in e&&(!G(e.attributes)||e.attributes===null))throw new Y(`Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.`);if(`undirected`in e&&typeof e.undirected!=`boolean`)throw new Y(`Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.`)}var Ns=go(),Ps=new Set([`directed`,`undirected`,`mixed`]),Fs=new Set([`domain`,`_events`,`_eventsCount`,`_maxListeners`]),Is=[{name:e=>`${e}Edge`,generateKey:!0},{name:e=>`${e}DirectedEdge`,generateKey:!0,type:`directed`},{name:e=>`${e}UndirectedEdge`,generateKey:!0,type:`undirected`},{name:e=>`${e}EdgeWithKey`},{name:e=>`${e}DirectedEdgeWithKey`,type:`directed`},{name:e=>`${e}UndirectedEdgeWithKey`,type:`undirected`}],Ls={allowSelfLoops:!0,multi:!1,type:`mixed`};function Rs(e,t,n){if(n&&!G(n))throw new Y(`Graph.addNode: invalid attributes. Expecting an object but got "${n}"`);if(t=``+t,n||={},e._nodes.has(t))throw new Z(`Graph.addNode: the "${t}" node already exist in the graph.`);let r=new e.NodeDataClass(t,n);return e._nodes.set(t,r),e.emit(`nodeAdded`,{key:t,attributes:n}),r}function zs(e,t,n){let r=new e.NodeDataClass(t,n);return e._nodes.set(t,r),e.emit(`nodeAdded`,{key:t,attributes:n}),r}function Bs(e,t,n,r,i,a,o,s){if(!r&&e.type===`undirected`)throw new Z(`Graph.${t}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);if(r&&e.type===`directed`)throw new Z(`Graph.${t}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);if(s&&!G(s))throw new Y(`Graph.${t}: invalid attributes. Expecting an object but got "${s}"`);if(a=``+a,o=``+o,s||={},!e.allowSelfLoops&&a===o)throw new Z(`Graph.${t}: source & target are the same ("${a}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let c=e._nodes.get(a),l=e._nodes.get(o);if(!c)throw new X(`Graph.${t}: source node "${a}" not found.`);if(!l)throw new X(`Graph.${t}: target node "${o}" not found.`);let u={key:null,undirected:r,source:a,target:o,attributes:s};if(n)i=e._edgeKeyGenerator();else if(i=``+i,e._edges.has(i))throw new Z(`Graph.${t}: the "${i}" edge already exists in the graph.`);if(!e.multi&&(r?c.undirected[o]!==void 0:c.out[o]!==void 0))throw new Z(`Graph.${t}: an edge linking "${a}" to "${o}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`);let d=new So(r,i,c,l,s);e._edges.set(i,d);let f=a===o;return r?(c.undirectedDegree++,l.undirectedDegree++,f&&(c.undirectedLoops++,e._undirectedSelfLoopCount++)):(c.outDegree++,l.inDegree++,f&&(c.directedLoops++,e._directedSelfLoopCount++)),e.multi?d.attachMulti():d.attach(),r?e._undirectedSize++:e._directedSize++,u.key=i,e.emit(`edgeAdded`,u),i}function Vs(e,t,n,r,i,a,o,s,c){if(!r&&e.type===`undirected`)throw new Z(`Graph.${t}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`);if(r&&e.type===`directed`)throw new Z(`Graph.${t}: you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead.`);if(s){if(c){if(typeof s!=`function`)throw new Y(`Graph.${t}: invalid updater function. Expecting a function but got "${s}"`)}else if(!G(s))throw new Y(`Graph.${t}: invalid attributes. Expecting an object but got "${s}"`)}a=``+a,o=``+o;let l;if(c&&(l=s,s=void 0),!e.allowSelfLoops&&a===o)throw new Z(`Graph.${t}: source & target are the same ("${a}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let u=e._nodes.get(a),d=e._nodes.get(o),f,p;if(!n&&(f=e._edges.get(i),f)){if((f.source.key!==a||f.target.key!==o)&&(!r||f.source.key!==o||f.target.key!==a))throw new Z(`Graph.${t}: inconsistency detected when attempting to merge the "${i}" edge with "${a}" source & "${o}" target vs. ("${f.source.key}", "${f.target.key}").`);p=f}if(!p&&!e.multi&&u&&(p=r?u.undirected[o]:u.out[o]),p){let t=[p.key,!1,!1,!1];if(c?!l:!s)return t;if(c){let t=p.attributes;p.attributes=l(t),e.emit(`edgeAttributesUpdated`,{type:`replace`,key:p.key,attributes:p.attributes})}else U(p.attributes,s),e.emit(`edgeAttributesUpdated`,{type:`merge`,key:p.key,attributes:p.attributes,data:s});return t}s||={},c&&l&&(s=l(s));let m={key:null,undirected:r,source:a,target:o,attributes:s};if(n)i=e._edgeKeyGenerator();else if(i=``+i,e._edges.has(i))throw new Z(`Graph.${t}: the "${i}" edge already exists in the graph.`);let h=!1,g=!1;u||(u=zs(e,a,{}),h=!0,a===o&&(d=u,g=!0)),d||(d=zs(e,o,{}),g=!0),f=new So(r,i,u,d,s),e._edges.set(i,f);let _=a===o;return r?(u.undirectedDegree++,d.undirectedDegree++,_&&(u.undirectedLoops++,e._undirectedSelfLoopCount++)):(u.outDegree++,d.inDegree++,_&&(u.directedLoops++,e._directedSelfLoopCount++)),e.multi?f.attachMulti():f.attach(),r?e._undirectedSize++:e._directedSize++,m.key=i,e.emit(`edgeAdded`,m),[i,!0,h,g]}function Hs(e,t){e._edges.delete(t.key);let{source:n,target:r,attributes:i}=t,a=t.undirected,o=n===r;a?(n.undirectedDegree--,r.undirectedDegree--,o&&(n.undirectedLoops--,e._undirectedSelfLoopCount--)):(n.outDegree--,r.inDegree--,o&&(n.directedLoops--,e._directedSelfLoopCount--)),e.multi?t.detachMulti():t.detach(),a?e._undirectedSize--:e._directedSize--,e.emit(`edgeDropped`,{key:t.key,attributes:i,source:n.key,target:r.key,undirected:a})}var $=class e extends Kt.EventEmitter{constructor(e){if(super(),e=U({},Ls,e),typeof e.multi!=`boolean`)throw new Y(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${e.multi}".`);if(!Ps.has(e.type))throw new Y(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${e.type}".`);if(typeof e.allowSelfLoops!=`boolean`)throw new Y(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${e.allowSelfLoops}".`);let t=e.type===`mixed`?yo:e.type===`directed`?bo:xo;K(this,`NodeDataClass`,t);let n=`geid_`+Ns()+`_`,r=0;K(this,`_attributes`,{}),K(this,`_nodes`,new Map),K(this,`_edges`,new Map),K(this,`_directedSize`,0),K(this,`_undirectedSize`,0),K(this,`_directedSelfLoopCount`,0),K(this,`_undirectedSelfLoopCount`,0),K(this,`_edgeKeyGenerator`,()=>{let e;do e=n+r++;while(this._edges.has(e));return e}),K(this,`_options`,e),Fs.forEach(e=>K(this,e,this[e])),q(this,`order`,()=>this._nodes.size),q(this,`size`,()=>this._edges.size),q(this,`directedSize`,()=>this._directedSize),q(this,`undirectedSize`,()=>this._undirectedSize),q(this,`selfLoopCount`,()=>this._directedSelfLoopCount+this._undirectedSelfLoopCount),q(this,`directedSelfLoopCount`,()=>this._directedSelfLoopCount),q(this,`undirectedSelfLoopCount`,()=>this._undirectedSelfLoopCount),q(this,`multi`,this._options.multi),q(this,`type`,this._options.type),q(this,`allowSelfLoops`,this._options.allowSelfLoops),q(this,`implementation`,()=>`graphology`)}_resetInstanceCounters(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0}hasNode(e){return this._nodes.has(``+e)}hasDirectedEdge(e,t){if(this.type===`undirected`)return!1;if(arguments.length===1){let t=``+e,n=this._edges.get(t);return!!n&&!n.undirected}if(arguments.length===2){e=``+e,t=``+t;let n=this._nodes.get(e);return n?n.out.hasOwnProperty(t):!1}throw new Y(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasUndirectedEdge(e,t){if(this.type===`directed`)return!1;if(arguments.length===1){let t=``+e,n=this._edges.get(t);return!!n&&n.undirected}if(arguments.length===2){e=``+e,t=``+t;let n=this._nodes.get(e);return n?n.undirected.hasOwnProperty(t):!1}throw new Y(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasEdge(e,t){if(arguments.length===1){let t=``+e;return this._edges.has(t)}if(arguments.length===2){e=``+e,t=``+t;let n=this._nodes.get(e);return n?n.out!==void 0&&n.out.hasOwnProperty(t)||n.undirected!==void 0&&n.undirected.hasOwnProperty(t):!1}throw new Y(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}directedEdge(e,t){if(this.type===`undirected`)return;if(e=``+e,t=``+t,this.multi)throw new Z(`Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.`);let n=this._nodes.get(e);if(!n)throw new X(`Graph.directedEdge: could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new X(`Graph.directedEdge: could not find the "${t}" target node in the graph.`);let r=n.out&&n.out[t]||void 0;if(r)return r.key}undirectedEdge(e,t){if(this.type===`directed`)return;if(e=``+e,t=``+t,this.multi)throw new Z(`Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.`);let n=this._nodes.get(e);if(!n)throw new X(`Graph.undirectedEdge: could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new X(`Graph.undirectedEdge: could not find the "${t}" target node in the graph.`);let r=n.undirected&&n.undirected[t]||void 0;if(r)return r.key}edge(e,t){if(this.multi)throw new Z(`Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.`);e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.edge: could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new X(`Graph.edge: could not find the "${t}" target node in the graph.`);let r=n.out&&n.out[t]||n.undirected&&n.undirected[t]||void 0;if(r)return r.key}areDirectedNeighbors(e,t){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.areDirectedNeighbors: could not find the "${e}" node in the graph.`);return this.type===`undirected`?!1:t in n.in||t in n.out}areOutNeighbors(e,t){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.areOutNeighbors: could not find the "${e}" node in the graph.`);return this.type!==`undirected`&&t in n.out}areInNeighbors(e,t){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.areInNeighbors: could not find the "${e}" node in the graph.`);return this.type!==`undirected`&&t in n.in}areUndirectedNeighbors(e,t){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.areUndirectedNeighbors: could not find the "${e}" node in the graph.`);return this.type!==`directed`&&t in n.undirected}areNeighbors(e,t){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.areNeighbors: could not find the "${e}" node in the graph.`);return this.type!==`undirected`&&(t in n.in||t in n.out)||this.type!==`directed`&&t in n.undirected}areInboundNeighbors(e,t){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.areInboundNeighbors: could not find the "${e}" node in the graph.`);return this.type!==`undirected`&&t in n.in||this.type!==`directed`&&t in n.undirected}areOutboundNeighbors(e,t){e=``+e,t=``+t;let n=this._nodes.get(e);if(!n)throw new X(`Graph.areOutboundNeighbors: could not find the "${e}" node in the graph.`);return this.type!==`undirected`&&t in n.out||this.type!==`directed`&&t in n.undirected}inDegree(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.inDegree: could not find the "${e}" node in the graph.`);return this.type===`undirected`?0:t.inDegree}outDegree(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.outDegree: could not find the "${e}" node in the graph.`);return this.type===`undirected`?0:t.outDegree}directedDegree(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.directedDegree: could not find the "${e}" node in the graph.`);return this.type===`undirected`?0:t.inDegree+t.outDegree}undirectedDegree(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.undirectedDegree: could not find the "${e}" node in the graph.`);return this.type===`directed`?0:t.undirectedDegree}inboundDegree(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.inboundDegree: could not find the "${e}" node in the graph.`);let n=0;return this.type!==`directed`&&(n+=t.undirectedDegree),this.type!==`undirected`&&(n+=t.inDegree),n}outboundDegree(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.outboundDegree: could not find the "${e}" node in the graph.`);let n=0;return this.type!==`directed`&&(n+=t.undirectedDegree),this.type!==`undirected`&&(n+=t.outDegree),n}degree(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.degree: could not find the "${e}" node in the graph.`);let n=0;return this.type!==`directed`&&(n+=t.undirectedDegree),this.type!==`undirected`&&(n+=t.inDegree+t.outDegree),n}inDegreeWithoutSelfLoops(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.inDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type===`undirected`?0:t.inDegree-t.directedLoops}outDegreeWithoutSelfLoops(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.outDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type===`undirected`?0:t.outDegree-t.directedLoops}directedDegreeWithoutSelfLoops(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.directedDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type===`undirected`?0:t.inDegree+t.outDegree-t.directedLoops*2}undirectedDegreeWithoutSelfLoops(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.undirectedDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type===`directed`?0:t.undirectedDegree-t.undirectedLoops*2}inboundDegreeWithoutSelfLoops(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.inboundDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);let n=0,r=0;return this.type!==`directed`&&(n+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!==`undirected`&&(n+=t.inDegree,r+=t.directedLoops),n-r}outboundDegreeWithoutSelfLoops(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.outboundDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);let n=0,r=0;return this.type!==`directed`&&(n+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!==`undirected`&&(n+=t.outDegree,r+=t.directedLoops),n-r}degreeWithoutSelfLoops(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.degreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);let n=0,r=0;return this.type!==`directed`&&(n+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!==`undirected`&&(n+=t.inDegree+t.outDegree,r+=t.directedLoops*2),n-r}source(e){e=``+e;let t=this._edges.get(e);if(!t)throw new X(`Graph.source: could not find the "${e}" edge in the graph.`);return t.source.key}target(e){e=``+e;let t=this._edges.get(e);if(!t)throw new X(`Graph.target: could not find the "${e}" edge in the graph.`);return t.target.key}extremities(e){e=``+e;let t=this._edges.get(e);if(!t)throw new X(`Graph.extremities: could not find the "${e}" edge in the graph.`);return[t.source.key,t.target.key]}opposite(e,t){e=``+e,t=``+t;let n=this._edges.get(t);if(!n)throw new X(`Graph.opposite: could not find the "${t}" edge in the graph.`);let r=n.source.key,i=n.target.key;if(e===r)return i;if(e===i)return r;throw new X(`Graph.opposite: the "${e}" node is not attached to the "${t}" edge (${r}, ${i}).`)}hasExtremity(e,t){e=``+e,t=``+t;let n=this._edges.get(e);if(!n)throw new X(`Graph.hasExtremity: could not find the "${e}" edge in the graph.`);return n.source.key===t||n.target.key===t}isUndirected(e){e=``+e;let t=this._edges.get(e);if(!t)throw new X(`Graph.isUndirected: could not find the "${e}" edge in the graph.`);return t.undirected}isDirected(e){e=``+e;let t=this._edges.get(e);if(!t)throw new X(`Graph.isDirected: could not find the "${e}" edge in the graph.`);return!t.undirected}isSelfLoop(e){e=``+e;let t=this._edges.get(e);if(!t)throw new X(`Graph.isSelfLoop: could not find the "${e}" edge in the graph.`);return t.source===t.target}addNode(e,t){return Rs(this,e,t).key}mergeNode(e,t){if(t&&!G(t))throw new Y(`Graph.mergeNode: invalid attributes. Expecting an object but got "${t}"`);e=``+e,t||={};let n=this._nodes.get(e);return n?(t&&(U(n.attributes,t),this.emit(`nodeAttributesUpdated`,{type:`merge`,key:e,attributes:n.attributes,data:t})),[e,!1]):(n=new this.NodeDataClass(e,t),this._nodes.set(e,n),this.emit(`nodeAdded`,{key:e,attributes:t}),[e,!0])}updateNode(e,t){if(t&&typeof t!=`function`)throw new Y(`Graph.updateNode: invalid updater function. Expecting a function but got "${t}"`);e=``+e;let n=this._nodes.get(e);if(n){if(t){let r=n.attributes;n.attributes=t(r),this.emit(`nodeAttributesUpdated`,{type:`replace`,key:e,attributes:n.attributes})}return[e,!1]}let r=t?t({}):{};return n=new this.NodeDataClass(e,r),this._nodes.set(e,n),this.emit(`nodeAdded`,{key:e,attributes:r}),[e,!0]}dropNode(e){e=``+e;let t=this._nodes.get(e);if(!t)throw new X(`Graph.dropNode: could not find the "${e}" node in the graph.`);let n;if(this.type!==`undirected`){for(let e in t.out){n=t.out[e];do Hs(this,n),n=n.next;while(n)}for(let e in t.in){n=t.in[e];do Hs(this,n),n=n.next;while(n)}}if(this.type!==`directed`)for(let e in t.undirected){n=t.undirected[e];do Hs(this,n),n=n.next;while(n)}this._nodes.delete(e),this.emit(`nodeDropped`,{key:e,attributes:t.attributes})}dropEdge(e){let t;if(arguments.length>1){let e=``+arguments[0],n=``+arguments[1];if(t=W(this,e,n,this.type),!t)throw new X(`Graph.dropEdge: could not find the "${e}" -> "${n}" edge in the graph.`)}else if(e=``+e,t=this._edges.get(e),!t)throw new X(`Graph.dropEdge: could not find the "${e}" edge in the graph.`);return Hs(this,t),this}dropDirectedEdge(e,t){if(arguments.length<2)throw new Z(`Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.`);if(this.multi)throw new Z(`Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.`);e=``+e,t=``+t;let n=W(this,e,t,`directed`);if(!n)throw new X(`Graph.dropDirectedEdge: could not find a "${e}" -> "${t}" edge in the graph.`);return Hs(this,n),this}dropUndirectedEdge(e,t){if(arguments.length<2)throw new Z(`Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.`);if(this.multi)throw new Z(`Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.`);let n=W(this,e,t,`undirected`);if(!n)throw new X(`Graph.dropUndirectedEdge: could not find a "${e}" -> "${t}" edge in the graph.`);return Hs(this,n),this}clear(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit(`cleared`)}clearEdges(){let e=this._nodes.values(),t;for(;t=e.next(),t.done!==!0;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit(`edgesCleared`)}getAttribute(e){return this._attributes[e]}getAttributes(){return this._attributes}hasAttribute(e){return this._attributes.hasOwnProperty(e)}setAttribute(e,t){return this._attributes[e]=t,this.emit(`attributesUpdated`,{type:`set`,attributes:this._attributes,name:e}),this}updateAttribute(e,t){if(typeof t!=`function`)throw new Y(`Graph.updateAttribute: updater should be a function.`);let n=this._attributes[e];return this._attributes[e]=t(n),this.emit(`attributesUpdated`,{type:`set`,attributes:this._attributes,name:e}),this}removeAttribute(e){return delete this._attributes[e],this.emit(`attributesUpdated`,{type:`remove`,attributes:this._attributes,name:e}),this}replaceAttributes(e){if(!G(e))throw new Y(`Graph.replaceAttributes: provided attributes are not a plain object.`);return this._attributes=e,this.emit(`attributesUpdated`,{type:`replace`,attributes:this._attributes}),this}mergeAttributes(e){if(!G(e))throw new Y(`Graph.mergeAttributes: provided attributes are not a plain object.`);return U(this._attributes,e),this.emit(`attributesUpdated`,{type:`merge`,attributes:this._attributes,data:e}),this}updateAttributes(e){if(typeof e!=`function`)throw new Y(`Graph.updateAttributes: provided updater is not a function.`);return this._attributes=e(this._attributes),this.emit(`attributesUpdated`,{type:`update`,attributes:this._attributes}),this}updateEachNodeAttributes(e,t){if(typeof e!=`function`)throw new Y(`Graph.updateEachNodeAttributes: expecting an updater function.`);if(t&&!ho(t))throw new Y(`Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}`);let n=this._nodes.values(),r,i;for(;r=n.next(),r.done!==!0;)i=r.value,i.attributes=e(i.key,i.attributes);this.emit(`eachNodeAttributesUpdated`,{hints:t||null})}updateEachEdgeAttributes(e,t){if(typeof e!=`function`)throw new Y(`Graph.updateEachEdgeAttributes: expecting an updater function.`);if(t&&!ho(t))throw new Y(`Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}`);let n=this._edges.values(),r,i,a,o;for(;r=n.next(),r.done!==!0;)i=r.value,a=i.source,o=i.target,i.attributes=e(i.key,i.attributes,a.key,o.key,a.attributes,o.attributes,i.undirected);this.emit(`eachEdgeAttributesUpdated`,{hints:t||null})}forEachAdjacencyEntry(e){if(typeof e!=`function`)throw new Y(`Graph.forEachAdjacencyEntry: expecting a callback.`);Os(!1,!1,!1,this,e)}forEachAdjacencyEntryWithOrphans(e){if(typeof e!=`function`)throw new Y(`Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.`);Os(!1,!1,!0,this,e)}forEachAssymetricAdjacencyEntry(e){if(typeof e!=`function`)throw new Y(`Graph.forEachAssymetricAdjacencyEntry: expecting a callback.`);Os(!1,!0,!1,this,e)}forEachAssymetricAdjacencyEntryWithOrphans(e){if(typeof e!=`function`)throw new Y(`Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.`);Os(!1,!0,!0,this,e)}nodes(){return Array.from(this._nodes.keys())}forEachNode(e){if(typeof e!=`function`)throw new Y(`Graph.forEachNode: expecting a callback.`);let t=this._nodes.values(),n,r;for(;n=t.next(),n.done!==!0;)r=n.value,e(r.key,r.attributes)}findNode(e){if(typeof e!=`function`)throw new Y(`Graph.findNode: expecting a callback.`);let t=this._nodes.values(),n,r;for(;n=t.next(),n.done!==!0;)if(r=n.value,e(r.key,r.attributes))return r.key}mapNodes(e){if(typeof e!=`function`)throw new Y(`Graph.mapNode: expecting a callback.`);let t=this._nodes.values(),n,r,i=Array(this.order),a=0;for(;n=t.next(),n.done!==!0;)r=n.value,i[a++]=e(r.key,r.attributes);return i}someNode(e){if(typeof e!=`function`)throw new Y(`Graph.someNode: expecting a callback.`);let t=this._nodes.values(),n,r;for(;n=t.next(),n.done!==!0;)if(r=n.value,e(r.key,r.attributes))return!0;return!1}everyNode(e){if(typeof e!=`function`)throw new Y(`Graph.everyNode: expecting a callback.`);let t=this._nodes.values(),n,r;for(;n=t.next(),n.done!==!0;)if(r=n.value,!e(r.key,r.attributes))return!1;return!0}filterNodes(e){if(typeof e!=`function`)throw new Y(`Graph.filterNodes: expecting a callback.`);let t=this._nodes.values(),n,r,i=[];for(;n=t.next(),n.done!==!0;)r=n.value,e(r.key,r.attributes)&&i.push(r.key);return i}reduceNodes(e,t){if(typeof e!=`function`)throw new Y(`Graph.reduceNodes: expecting a callback.`);if(arguments.length<2)throw new Y(`Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let n=t,r=this._nodes.values(),i,a;for(;i=r.next(),i.done!==!0;)a=i.value,n=e(n,a.key,a.attributes);return n}nodeEntries(){let e=this._nodes.values();return{[Symbol.iterator](){return this},next(){let t=e.next();if(t.done)return t;let n=t.value;return{value:{node:n.key,attributes:n.attributes},done:!1}}}}export(){let e=Array(this._nodes.size),t=0;this._nodes.forEach((n,r)=>{e[t++]=ks(r,n)});let n=Array(this._edges.size);return t=0,this._edges.forEach((e,r)=>{n[t++]=As(this.type,r,e)}),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:e,edges:n}}import(t,n=!1){if(t instanceof e)return t.forEachNode((e,t)=>{n?this.mergeNode(e,t):this.addNode(e,t)}),t.forEachEdge((e,t,r,i,a,o,s)=>{n?s?this.mergeUndirectedEdgeWithKey(e,r,i,t):this.mergeDirectedEdgeWithKey(e,r,i,t):s?this.addUndirectedEdgeWithKey(e,r,i,t):this.addDirectedEdgeWithKey(e,r,i,t)}),this;if(!G(t))throw new Y(`Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.`);if(t.attributes){if(!G(t.attributes))throw new Y(`Graph.import: invalid attributes. Expecting a plain object.`);n?this.mergeAttributes(t.attributes):this.replaceAttributes(t.attributes)}let r,i,a,o,s;if(t.nodes){if(a=t.nodes,!Array.isArray(a))throw new Y(`Graph.import: invalid nodes. Expecting an array.`);for(r=0,i=a.length;r<i;r++){o=a[r],js(o);let{key:e,attributes:t}=o;n?this.mergeNode(e,t):this.addNode(e,t)}}if(t.edges){let e=!1;if(this.type===`undirected`&&(e=!0),a=t.edges,!Array.isArray(a))throw new Y(`Graph.import: invalid edges. Expecting an array.`);for(r=0,i=a.length;r<i;r++){s=a[r],Ms(s);let{source:t,target:i,attributes:o,undirected:c=e}=s,l;`key`in s?(l=n?c?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:c?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey,l.call(this,s.key,t,i,o)):(l=n?c?this.mergeUndirectedEdge:this.mergeDirectedEdge:c?this.addUndirectedEdge:this.addDirectedEdge,l.call(this,t,i,o))}}return this}nullCopy(t){let n=new e(U({},this._options,t));return n.replaceAttributes(U({},this.getAttributes())),n}emptyCopy(e){let t=this.nullCopy(e);return this._nodes.forEach((e,n)=>{let r=U({},e.attributes);e=new t.NodeDataClass(n,r),t._nodes.set(n,e)}),t}copy(e){if(e||={},typeof e.type==`string`&&e.type!==this.type&&e.type!==`mixed`)throw new Z(`Graph.copy: cannot create an incompatible copy from "${this.type}" type to "${e.type}" because this would mean losing information about the current graph.`);if(typeof e.multi==`boolean`&&e.multi!==this.multi&&e.multi!==!0)throw new Z(`Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.`);if(typeof e.allowSelfLoops==`boolean`&&e.allowSelfLoops!==this.allowSelfLoops&&e.allowSelfLoops!==!0)throw new Z(`Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.`);let t=this.emptyCopy(e),n=this._edges.values(),r,i;for(;r=n.next(),r.done!==!0;)i=r.value,Bs(t,`copy`,!1,i.undirected,i.key,i.source.key,i.target.key,U({},i.attributes));return t}toJSON(){return this.export()}toString(){return`[object Graph]`}inspect(){let e={};this._nodes.forEach((t,n)=>{e[n]=t.attributes});let t={},n={};this._edges.forEach((e,r)=>{let i=e.undirected?`--`:`->`,a=``,o=e.source.key,s=e.target.key,c;e.undirected&&o>s&&(c=o,o=s,s=c);let l=`(${o})${i}(${s})`;r.startsWith(`geid_`)?this.multi&&(n[l]===void 0?n[l]=0:n[l]++,a+=`${n[l]}. `):a+=`[${r}]: `,a+=l,t[a]=e.attributes});let r={};for(let e in this)this.hasOwnProperty(e)&&!Fs.has(e)&&typeof this[e]!=`function`&&typeof e!=`symbol`&&(r[e]=this[e]);return r.attributes=this._attributes,r.nodes=e,r.edges=t,K(r,`constructor`,this.constructor),r}};typeof Symbol<`u`&&($.prototype[Symbol.for(`nodejs.util.inspect.custom`)]=$.prototype.inspect),Is.forEach(e=>{[`add`,`merge`,`update`].forEach(t=>{let n=e.name(t),r=t===`add`?Bs:Vs;e.generateKey?$.prototype[n]=function(i,a,o){return r(this,n,!0,(e.type||this.type)===`undirected`,null,i,a,o,t===`update`)}:$.prototype[n]=function(i,a,o,s){return r(this,n,!1,(e.type||this.type)===`undirected`,i,a,o,s,t===`update`)}})}),Lo($),Jo($),hs($),Ds($);var Us=class extends ${constructor(e){let t=U({type:`directed`},e);if(`multi`in t&&t.multi!==!1)throw new Y(`DirectedGraph.from: inconsistent indication that the graph should be multi in given options!`);if(t.type!==`directed`)throw new Y(`DirectedGraph.from: inconsistent "`+t.type+`" type in given options!`);super(t)}},Ws=class extends ${constructor(e){let t=U({type:`undirected`},e);if(`multi`in t&&t.multi!==!1)throw new Y(`UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!`);if(t.type!==`undirected`)throw new Y(`UndirectedGraph.from: inconsistent "`+t.type+`" type in given options!`);super(t)}},Gs=class extends ${constructor(e){let t=U({multi:!0},e);if(`multi`in t&&t.multi!==!0)throw new Y(`MultiGraph.from: inconsistent indication that the graph should be simple in given options!`);super(t)}},Ks=class extends ${constructor(e){let t=U({type:`directed`,multi:!0},e);if(`multi`in t&&t.multi!==!0)throw new Y(`MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!`);if(t.type!==`directed`)throw new Y(`MultiDirectedGraph.from: inconsistent "`+t.type+`" type in given options!`);super(t)}},qs=class extends ${constructor(e){let t=U({type:`undirected`,multi:!0},e);if(`multi`in t&&t.multi!==!0)throw new Y(`MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!`);if(t.type!==`undirected`)throw new Y(`MultiUndirectedGraph.from: inconsistent "`+t.type+`" type in given options!`);super(t)}};function Js(e){e.from=function(t,n){let r=new e(U({},t.options,n));return r.import(t),r}}Js($),Js(Us),Js(Ws),Js(Gs),Js(Ks),Js(qs),$.Graph=$,$.DirectedGraph=Us,$.UndirectedGraph=Ws,$.MultiGraph=Gs,$.MultiDirectedGraph=Ks,$.MultiUndirectedGraph=qs,$.InvalidArgumentsGraphError=Y,$.NotFoundGraphError=X,$.UsageGraphError=Z;export{c as C,n as E,s as S,u as T,Ie as _,$r as a,ge as b,wr as c,xn as d,gn as f,Xe as g,M as h,ei as i,Qn as l,P as m,fo as n,Rr as o,hn as p,wi as r,Tr as s,$ as t,Zn as u,Ne as v,o as w,ne as x,Se as y};