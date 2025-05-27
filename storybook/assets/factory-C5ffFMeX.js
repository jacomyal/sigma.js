var D=Object.defineProperty;var U=(i,o,t)=>o in i?D(i,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[o]=t;var g=(i,o,t)=>U(i,typeof o!="symbol"?o+"":o,t);import{e as k,N as G,f as V}from"./sigma-BsJT_GRv.js";function F({texturesCount:i}){return`
precision highp float;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;
varying vec4 v_texture;
varying float v_textureIndex;

uniform sampler2D u_atlas[${i}];
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
    int index = int(v_textureIndex + 0.5); // +0.5 avoid rounding errors

    bool noTextureFound = false;
    vec4 texel;

    ${[...new Array(i)].map((t,a)=>`if (index == ${a}) texel = texture2D(u_atlas[${a}], (v_texture.xy + coordinateInTexture * v_texture.zw), -1.0);`).join(`
    else `)+`else {
      texel = texture2D(u_atlas[0], (v_texture.xy + coordinateInTexture * v_texture.zw), -1.0);
      noTextureFound = true;
    }`}

    if (noTextureFound) {
      color = v_color;
    } else {
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
`}const X=`
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;
attribute vec4 a_texture;
attribute float a_textureIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;
varying vec4 v_texture;
varying float v_textureIndex;

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
  v_textureIndex = a_textureIndex;
  v_texture = a_texture;
  #endif

  v_color.a *= bias;
}
`,C={size:{mode:"max",value:512},objectFit:"cover",correctCentering:!1,maxTextureSize:4096,debounceTimeout:500,crossOrigin:"anonymous"},L=1;function A(i,{crossOrigin:o}={}){return new Promise((t,a)=>{const s=new Image;s.addEventListener("load",()=>{t(s)},{once:!0}),s.addEventListener("error",n=>{a(n.error)},{once:!0}),o&&s.setAttribute("crossOrigin",o),s.src=i})}async function O(i,{size:o,crossOrigin:t}={}){let a;t==="use-credentials"?a=await fetch(i,{credentials:"include"}):a=await fetch(i);const s=await a.text(),n=new DOMParser().parseFromString(s,"image/svg+xml"),c=n.documentElement,f=c.getAttribute("width"),h=c.getAttribute("height");if(!f||!h)throw new Error("loadSVGImage: cannot use `size` if target SVG has no definite dimensions.");typeof o=="number"&&(c.setAttribute("width",""+o),c.setAttribute("height",""+o));const x=new XMLSerializer().serializeToString(n),T=new Blob([x],{type:"image/svg+xml"}),_=URL.createObjectURL(T),d=A(_);return d.finally(()=>URL.revokeObjectURL(_)),d}async function W(i,{size:o,crossOrigin:t}={}){var n;const a=((n=i.split(/[#?]/)[0].split(".").pop())==null?void 0:n.trim().toLowerCase())==="svg";let s;if(a&&o)try{s=await O(i,{size:o,crossOrigin:t})}catch{s=await A(i,{crossOrigin:t})}else s=await A(i,{crossOrigin:t});return s}function H(i,o,{objectFit:t,size:a,correctCentering:s}){const n=t==="contain"?Math.max(i.width,i.height):Math.min(i.width,i.height),c=a.mode==="auto"?n:a.mode==="force"?a.value:Math.min(a.value,n);let f=(i.width-n)/2,h=(i.height-n)/2;if(s){const x=o.getCorrectionOffset(i,n);f=x.x,h=x.y}return{sourceX:f,sourceY:h,sourceSize:n,destinationSize:c}}function Y(i,o,t){const{width:a,height:s}=o.canvas,n=[];let{x:c,y:f,rowHeight:h,maxRowWidth:x}=t;const T={};for(let p=0,S=i.length;p<S;p++){const{key:r,image:e,sourceSize:l,sourceX:u,sourceY:E,destinationSize:v}=i[p],m=v+L;f+m>s||c+m>a&&f+m+h>s||(c+m>a&&(x=Math.max(x,c),c=0,f+=h,h=m),n.push({key:r,image:e,sourceX:u,sourceY:E,sourceSize:l,destinationX:c,destinationY:f,destinationSize:v}),T[r]={x:c,y:f,size:v},c+=m,h=Math.max(h,m))}x=Math.max(x,c);const _=x,d=f+h;for(let p=0,S=n.length;p<S;p++){const{image:r,sourceSize:e,sourceX:l,sourceY:u,destinationSize:E,destinationX:v,destinationY:m}=n[p];o.drawImage(r,l,u,e,e,v,m,E,E)}return{atlas:T,texture:o.getImageData(0,0,_,d),cursor:{x:c,y:f,rowHeight:h,maxRowWidth:x}}}function B({atlas:i,textures:o,cursor:t},a,s){var f;const n={atlas:{...i},textures:[...o.slice(0,-1)],cursor:{...t}};let c=[];for(const h in a){const x=a[h];x.status!=="ready"||typeof((f=i[h])==null?void 0:f.textureIndex)=="number"||c.push({key:h,...x})}for(;c.length;){const{atlas:h,texture:x,cursor:T}=Y(c,s,n.cursor);n.cursor=T;const _=[];c.forEach(d=>{h[d.key]?n.atlas[d.key]={...h[d.key],textureIndex:n.textures.length}:_.push(d)}),n.textures.push(x),c=_,c.length&&(n.cursor={x:0,y:0,rowHeight:0,maxRowWidth:0},s.clearRect(0,0,s.canvas.width,s.canvas.height))}return n}class q{constructor(){g(this,"canvas");g(this,"context");this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d",{willReadFrequently:!0})}getCorrectionOffset(o,t){this.canvas.width=t,this.canvas.height=t,this.context.clearRect(0,0,t,t),this.context.drawImage(o,0,0,t,t);const a=this.context.getImageData(0,0,t,t).data,s=new Uint8ClampedArray(a.length/4);for(let T=0;T<a.length;T++)s[T]=a[T*4+3];let n=0,c=0,f=0;for(let T=0;T<t;T++)for(let _=0;_<t;_++){const d=s[T*t+_];f+=d,n+=d*_,c+=d*T}const h=n/f,x=c/f;return{x:h-t/2,y:x-t/2}}}const I=class I extends k.EventEmitter{constructor(t={}){super();g(this,"options");g(this,"canvas",document.createElement("canvas"));g(this,"ctx",this.canvas.getContext("2d",{willReadFrequently:!0}));g(this,"frameId");g(this,"corrector",new q);g(this,"imageStates",{});g(this,"textures",[this.ctx.getImageData(0,0,1,1)]);g(this,"lastTextureCursor",{x:0,y:0,rowHeight:0,maxRowWidth:0});g(this,"atlas",{});this.options={...C,...t},this.canvas.width=this.options.maxTextureSize,this.canvas.height=this.options.maxTextureSize}scheduleGenerateTexture(){typeof this.frameId!="number"&&(typeof this.options.debounceTimeout=="number"?this.frameId=window.setTimeout(()=>{this.generateTextures(),this.frameId=void 0},this.options.debounceTimeout):this.generateTextures())}generateTextures(){const{atlas:t,textures:a,cursor:s}=B({atlas:this.atlas,textures:this.textures,cursor:this.lastTextureCursor},this.imageStates,this.ctx);this.atlas=t,this.textures=a,this.lastTextureCursor=s,this.emit(I.NEW_TEXTURE_EVENT,{atlas:t,textures:a})}async registerImage(t){if(!this.imageStates[t]){this.imageStates[t]={status:"loading"};try{const{size:a}=this.options,s=await W(t,{size:a.mode==="force"?a.value:void 0,crossOrigin:this.options.crossOrigin||void 0});this.imageStates[t]={status:"ready",image:s,...H(s,this.corrector,this.options)},this.scheduleGenerateTexture()}catch{this.imageStates[t]={status:"error"}}}}getAtlas(){return this.atlas}getTextures(){return this.textures}};g(I,"NEW_TEXTURE_EVENT","newTexture");let b=I;const{UNSIGNED_BYTE:N,FLOAT:R}=WebGLRenderingContext,$={...C,drawingMode:"background",keepWithinCircle:!0,drawLabel:void 0,drawHover:void 0,padding:0,colorAttribute:"color",imageAttribute:"image"},j=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_percentagePadding","u_matrix","u_colorizeImages","u_keepWithinCircle","u_atlas"];function J(i){var d;const o=document.createElement("canvas").getContext("webgl"),t=Math.min(o.getParameter(o.MAX_TEXTURE_SIZE),C.maxTextureSize);o.canvas.remove();const{drawHover:a,drawLabel:s,drawingMode:n,keepWithinCircle:c,padding:f,colorAttribute:h,imageAttribute:x,...T}={...$,maxTextureSize:t,...i||{}},_=new b(T);return d=class extends G{constructor(r,e,l){super(r,e,l);g(this,"drawLabel",s);g(this,"drawHover",a);g(this,"atlas");g(this,"textures");g(this,"textureImages");g(this,"latestRenderParams");g(this,"textureManagerCallback",null);this.textureManagerCallback=({atlas:u,textures:E})=>{const v=E.length!==this.textures.length;this.atlas=u,this.textureImages=E,v&&this.upgradeShaders(),this.bindTextures(),this.latestRenderParams&&this.render(this.latestRenderParams),this.renderer&&this.renderer.refresh&&this.renderer.refresh()},_.on(b.NEW_TEXTURE_EVENT,this.textureManagerCallback),this.atlas=_.getAtlas(),this.textureImages=_.getTextures(),this.textures=this.textureImages.map(()=>r.createTexture()),this.bindTextures()}getDefinition(){return{VERTICES:3,VERTEX_SHADER_SOURCE:X,FRAGMENT_SHADER_SOURCE:F({texturesCount:_.getTextures().length}),METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:j,ATTRIBUTES:[{name:"a_position",size:2,type:R},{name:"a_size",size:1,type:R},{name:"a_color",size:4,type:N,normalized:!0},{name:"a_id",size:4,type:N,normalized:!0},{name:"a_texture",size:4,type:R},{name:"a_textureIndex",size:1,type:R}],CONSTANT_ATTRIBUTES:[{name:"a_angle",size:1,type:R}],CONSTANT_DATA:[[d.ANGLE_1],[d.ANGLE_2],[d.ANGLE_3]]}}upgradeShaders(){const r=this.getDefinition(),{program:e,buffer:l,vertexShader:u,fragmentShader:E,gl:v}=this.normalProgram;v.deleteProgram(e),v.deleteBuffer(l),v.deleteShader(u),v.deleteShader(E),this.normalProgram=this.getProgramInfo("normal",v,r.VERTEX_SHADER_SOURCE,r.FRAGMENT_SHADER_SOURCE,null)}kill(){var e;const r=(e=this.normalProgram)==null?void 0:e.gl;if(r)for(let l=0;l<this.textures.length;l++)r.deleteTexture(this.textures[l]);this.textureManagerCallback&&(_.off(b.NEW_TEXTURE_EVENT,this.textureManagerCallback),this.textureManagerCallback=null),super.kill()}bindTextures(){const r=this.normalProgram.gl;for(let e=0;e<this.textureImages.length;e++){if(e>=this.textures.length){const l=r.createTexture();l&&this.textures.push(l)}r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,this.textures[e]),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,this.textureImages[e]),r.generateMipmap(r.TEXTURE_2D)}}renderProgram(r,e){if(!e.isPicking){const l=e.gl;for(let u=0;u<this.textureImages.length;u++)l.activeTexture(l.TEXTURE0+u),l.bindTexture(l.TEXTURE_2D,this.textures[u])}super.renderProgram(r,e)}processVisibleItem(r,e,l){const u=this.array,E=V(l[h]),v=l[x],m=v?this.atlas[v]:void 0;if(typeof v=="string"&&!m&&_.registerImage(v),u[e++]=l.x,u[e++]=l.y,u[e++]=l.size,u[e++]=E,u[e++]=r,m&&typeof m.textureIndex=="number"){const{width:y,height:w}=this.textureImages[m.textureIndex];u[e++]=m.x/y,u[e++]=m.y/w,u[e++]=m.size/y,u[e++]=m.size/w,u[e++]=m.textureIndex}else u[e++]=0,u[e++]=0,u[e++]=0,u[e++]=0,u[e++]=0}setUniforms(r,{gl:e,uniformLocations:l}){const{u_sizeRatio:u,u_correctionRatio:E,u_matrix:v,u_atlas:m,u_colorizeImages:y,u_keepWithinCircle:w,u_cameraAngle:z,u_percentagePadding:M}=l;this.latestRenderParams=r,e.uniform1f(E,r.correctionRatio),e.uniform1f(u,c?r.sizeRatio:r.sizeRatio/Math.SQRT2),e.uniform1f(z,r.cameraAngle),e.uniform1f(M,f),e.uniformMatrix3fv(v,!1,r.matrix),e.uniform1iv(m,[...new Array(this.textureImages.length)].map((Q,P)=>P)),e.uniform1i(y,n==="color"?1:0),e.uniform1i(w,c?1:0)}},g(d,"ANGLE_1",0),g(d,"ANGLE_2",2*Math.PI/3),g(d,"ANGLE_3",4*Math.PI/3),g(d,"textureManager",_),d}export{J as c};
