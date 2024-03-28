var z=Object.defineProperty;var D=(a,r,e)=>r in a?z(a,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[r]=e;var c=(a,r,e)=>(D(a,typeof r!="symbol"?r+"":r,e),e);import{e as P,N as U,f as G}from"./utils-C5QP6GGe.js";const V=`
precision highp float;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;
varying vec4 v_texture;

uniform sampler2D u_atlas;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_percentagePadding;
uniform bool u_colorizeImages;
uniform bool u_keepWithinCircle;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

const float radius = 0.5;

void main(void) {
  float border = 2.0 * u_correctionRatio;
  float dist = length(v_diffVector);
  vec4 color = gl_FragColor;

  float c = cos(-u_cameraAngle);
  float s = sin(-u_cameraAngle);
  vec2 diffVector = mat2(c, s, -s, c) * (v_diffVector);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  border = 0.0;
  color = v_color;

  #else
  // First case: No image to display
  if (v_texture.w <= 0.0) {
    if (!u_colorizeImages) {
      color = v_color;
    }
  }

  // Second case: Image loaded into the texture
  else {
    float paddingRatio = 1.0 + 2.0 * u_percentagePadding;
    float coef = u_keepWithinCircle ? 1.0 : ${Math.SQRT2};
    vec2 coordinateInTexture = diffVector * vec2(paddingRatio, -paddingRatio) / v_radius / 2.0 * coef + vec2(0.5, 0.5);
    vec4 texel = texture2D(u_atlas, (v_texture.xy + coordinateInTexture * v_texture.zw), -1.0);

    // Colorize all visible image pixels:
    if (u_colorizeImages) {
      color = mix(gl_FragColor, v_color, texel.a);
    }

    // Colorize background pixels, keep image pixel colors:
    else {
      color = vec4(mix(v_color, texel, texel.a).rgb, max(texel.a, v_color.a));
    }

    // Erase pixels "in the padding":
    if (abs(diffVector.x) > v_radius / paddingRatio || abs(diffVector.y) > v_radius / paddingRatio) {
      color = u_colorizeImages ? gl_FragColor : v_color;
    }
  }
  #endif

  // Crop in a circle when u_keepWithinCircle is truthy:
  if (u_keepWithinCircle) {
    if (dist < v_radius - border) {
      gl_FragColor = color;
    } else if (dist < v_radius) {
      gl_FragColor = mix(transparent, color, (v_radius - dist) / border);
    }
  }

  // Crop in a square else:
  else {
    float squareHalfSize = v_radius * ${Math.SQRT1_2*Math.cos(Math.PI/12)};
    if (abs(diffVector.x) > squareHalfSize || abs(diffVector.y) > squareHalfSize) {
      gl_FragColor = transparent;
    } else {
      gl_FragColor = color;
    }
  }
}
`,L=V,O=`
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;
attribute vec4 a_texture;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;
varying vec4 v_texture;

const float bias = 255.0 / 254.0;
const float marginRatio = 1.05;

void main() {
  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector * marginRatio;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  v_diffVector = diffVector;
  v_radius = size / 2.0 / marginRatio;

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;

  // Pass the texture coordinates:
  v_texture = a_texture;
  #endif

  v_color.a *= bias;
}
`,X=O,M={size:{mode:"max",value:512},objectFit:"cover",correctCentering:!1},k=100,F=1;function I(a){return new Promise((r,e)=>{const o=new Image;o.addEventListener("load",()=>{r(o)},{once:!0}),o.addEventListener("error",n=>{e(n.error)},{once:!0}),o.setAttribute("crossOrigin",""),o.src=a})}async function W(a,{size:r}={}){const o=await(await fetch(a)).text(),n=new DOMParser().parseFromString(o,"image/svg+xml"),l=n.documentElement,E=l.getAttribute("width"),x=l.getAttribute("height");if(!E||!x)throw new Error("loadSVGImage: cannot use `size` if target SVG has no definite dimensions.");typeof r=="number"&&(l.setAttribute("width",""+r),l.setAttribute("height",""+r));const _=new XMLSerializer().serializeToString(n),s=new Blob([_],{type:"image/svg+xml"}),u=URL.createObjectURL(s),m=I(u);return m.finally(()=>URL.revokeObjectURL(u)),m}async function H(a,{size:r}={}){var n;const e=((n=a.split(/[#?]/)[0].split(".").pop())==null?void 0:n.trim().toLowerCase())==="svg";let o;if(e&&r)try{o=await W(a,{size:r})}catch{o=await I(a)}else o=await I(a);return o}function Y(a,r,{objectFit:e,size:o,correctCentering:n}){const l=e==="contain"?Math.max(a.width,a.height):Math.min(a.width,a.height),E=o.mode==="auto"?l:o.mode==="force"?o.value:Math.min(o.value,l);let x=(a.width-l)/2,_=(a.height-l)/2;if(n){const s=r.getCorrectionOffset(a,l);x=s.x,_=s.y}return{sourceX:x,sourceY:_,sourceSize:l,destinationSize:E}}function B(a,r){const n=[];let l=0,E=0;for(const h in r){const f=r[h];f.status==="ready"&&(E=Math.max(E,f.destinationSize),l+=f.destinationSize**2,n.push({key:h,...f}))}n.sort((h,f)=>h.destinationSize>f.destinationSize?-1:1);const x=l/.6,_=Math.min(Math.max(Math.sqrt(x),E),3072),s=[];let u=0,m=0,i=0,t=0;const d={};for(let h=0,f=n.length;h<f;h++){const{key:v,image:T,sourceSize:R,sourceX:b,sourceY:p,destinationSize:S}=n[h],A=S+F;u+A>_&&(t=Math.max(t,u),u=0,m+=i,i=A),s.push({key:v,image:T,sourceX:b,sourceY:p,sourceSize:R,destinationX:u,destinationY:m,destinationSize:S}),d[v]={x:u,y:m,size:S},u+=A,i=Math.max(i,A)}t=Math.max(t,u);const g=a.canvas;g.width=t,g.height=m+i;for(let h=0,f=s.length;h<f;h++){const{image:v,sourceSize:T,sourceX:R,sourceY:b,destinationSize:p,destinationX:S,destinationY:A}=s[h];a.drawImage(v,R,b,T,T,S,A,p,p)}return d}class q{constructor(){c(this,"canvas");c(this,"context");this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d",{willReadFrequently:!0})}getCorrectionOffset(r,e){this.canvas.width=e,this.canvas.height=e,this.context.clearRect(0,0,e,e),this.context.drawImage(r,0,0,e,e);const o=this.context.getImageData(0,0,e,e).data,n=new Uint8ClampedArray(o.length/4);for(let u=0;u<o.length;u++)n[u]=o[u*4+3];let l=0,E=0,x=0;for(let u=0;u<e;u++)for(let m=0;m<e;m++){const i=n[u*e+m];x+=i,l+=i*m,E+=i*u}const _=l/x,s=E/x;return{x:_-e/2,y:s-e/2}}}const y=class y extends P.EventEmitter{constructor(e={}){super();c(this,"options");c(this,"canvas",document.createElement("canvas"));c(this,"ctx",this.canvas.getContext("2d",{willReadFrequently:!0}));c(this,"frameId");c(this,"corrector",new q);c(this,"imageStates",{});c(this,"texture",this.ctx.getImageData(0,0,1,1));c(this,"atlas",{});this.options={...M,...e}}scheduleGenerateTexture(){typeof this.frameId!="number"&&(this.frameId=window.setTimeout(()=>{this.generateTexture(),this.frameId=void 0},k))}generateTexture(){this.atlas=B(this.ctx,this.imageStates),this.texture=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height),this.emit(y.NEW_TEXTURE_EVENT,{atlas:this.atlas,texture:this.texture})}async registerImage(e){if(!this.imageStates[e]){this.imageStates[e]={status:"loading"};try{const{size:o}=this.options,n=await H(e,{size:o.mode==="force"?o.value:void 0});this.imageStates[e]={status:"ready",image:n,...Y(n,this.corrector,this.options)},this.scheduleGenerateTexture()}catch{this.imageStates[e]={status:"error"}}}}getAtlas(){return this.atlas}getTexture(){return this.texture}};c(y,"NEW_TEXTURE_EVENT","newTexture");let w=y;const{UNSIGNED_BYTE:N,FLOAT:C}=WebGLRenderingContext,j={...M,drawingMode:"background",keepWithinCircle:!0,drawLabel:void 0,drawHover:void 0,padding:0,colorAttribute:"color"},Q=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_percentagePadding","u_matrix","u_colorizeImages","u_keepWithinCircle","u_atlas"];function J(a){var s;const{drawHover:r,drawLabel:e,drawingMode:o,keepWithinCircle:n,padding:l,colorAttribute:E,...x}={...j,...a||{},drawLabel:void 0,drawHover:void 0},_=new w(x);return s=class extends U{constructor(i,t,d){super(i,t,d);c(this,"atlas");c(this,"texture");c(this,"textureImage");c(this,"latestRenderParams");c(this,"textureManagerCallback");this.textureManagerCallback=()=>{this&&(this.bindTexture&&(this.atlas=_.getAtlas(),this.textureImage=_.getTexture(),this.bindTexture(),this.latestRenderParams&&this.render(this.latestRenderParams)),d&&d.refresh&&d.refresh())},_.on(w.NEW_TEXTURE_EVENT,this.textureManagerCallback),this.atlas=_.getAtlas(),this.textureImage=_.getTexture(),this.texture=i.createTexture(),this.bindTexture()}getDefinition(){return{VERTICES:3,VERTEX_SHADER_SOURCE:X,FRAGMENT_SHADER_SOURCE:L,METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:Q,ATTRIBUTES:[{name:"a_position",size:2,type:C},{name:"a_size",size:1,type:C},{name:"a_color",size:4,type:N,normalized:!0},{name:"a_id",size:4,type:N,normalized:!0},{name:"a_texture",size:4,type:C}],CONSTANT_ATTRIBUTES:[{name:"a_angle",size:1,type:C}],CONSTANT_DATA:[[s.ANGLE_1],[s.ANGLE_2],[s.ANGLE_3]]}}kill(){_.off(w.NEW_TEXTURE_EVENT,this.textureManagerCallback)}bindTexture(){const i=this.normalProgram.gl;i.bindTexture(i.TEXTURE_2D,this.texture),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,this.textureImage),i.generateMipmap(i.TEXTURE_2D)}renderProgram(i,t){if(!t.isPicking){const d=t.gl;d.bindTexture(d.TEXTURE_2D,this.texture)}super.renderProgram(i,t)}processVisibleItem(i,t,d){const g=this.array,h=G(d[E]),f=d.image,v=f?this.atlas[f]:void 0;if(typeof f=="string"&&!v&&_.registerImage(f),g[t++]=d.x,g[t++]=d.y,g[t++]=d.size,g[t++]=h,g[t++]=i,v){const{width:T,height:R}=this.textureImage;g[t++]=v.x/T,g[t++]=v.y/R,g[t++]=v.size/T,g[t++]=v.size/R}else g[t++]=0,g[t++]=0,g[t++]=0,g[t++]=0}setUniforms(i,{gl:t,uniformLocations:d}){const{u_sizeRatio:g,u_correctionRatio:h,u_matrix:f,u_atlas:v,u_colorizeImages:T,u_keepWithinCircle:R,u_cameraAngle:b,u_percentagePadding:p}=d;this.latestRenderParams=i,t.uniform1f(h,i.correctionRatio),t.uniform1f(g,n?i.sizeRatio:i.sizeRatio/Math.SQRT2),t.uniform1f(b,i.cameraAngle),t.uniform1f(p,l),t.uniformMatrix3fv(f,!1,i.matrix),t.uniform1i(v,0),t.uniform1i(T,o==="color"?1:0),t.uniform1i(R,n?1:0)}},c(s,"ANGLE_1",0),c(s,"ANGLE_2",2*Math.PI/3),c(s,"ANGLE_3",4*Math.PI/3),c(s,"drawLabel",e),c(s,"drawHover",r),s}export{J as g};
