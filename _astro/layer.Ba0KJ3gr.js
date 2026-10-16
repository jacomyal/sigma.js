import{h as M,s as N}from"./graphology.C_tzyWmQ.js";import{n as L}from"./schema.DPqDLh61.js";const A={size:{mode:"max",value:512},objectFit:"cover",correctCentering:!1,maxTextureSize:4096,debounceTimeout:500,crossOrigin:"anonymous"},D=1;function S(a,{crossOrigin:o}={}){return new Promise((t,r)=>{const s=new Image;s.addEventListener("load",()=>{t(s)},{once:!0}),s.addEventListener("error",e=>{r(e.error)},{once:!0}),o&&s.setAttribute("crossOrigin",o),s.src=a})}async function C(a,{size:o,crossOrigin:t}={}){let r;t==="use-credentials"?r=await fetch(a,{credentials:"include"}):r=await fetch(a);const s=await r.text(),e=new DOMParser().parseFromString(s,"image/svg+xml"),i=e.documentElement,c=i.getAttribute("width"),l=i.getAttribute("height");if(!c||!l)throw new Error("loadSVGImage: cannot use `size` if target SVG has no definite dimensions.");typeof o=="number"&&(i.setAttribute("width",""+o),i.setAttribute("height",""+o));const u=new XMLSerializer().serializeToString(e),n=new Blob([u],{type:"image/svg+xml"}),x=URL.createObjectURL(n),E=S(x);return E.finally(()=>URL.revokeObjectURL(x)),E}async function X(a,{size:o,crossOrigin:t}={}){const r=a.split(/[#?]/)[0].split(".").pop()?.trim().toLowerCase()==="svg";let s;if(r&&o)try{s=await C(a,{size:o,crossOrigin:t})}catch{s=await S(a,{crossOrigin:t})}else s=await S(a,{crossOrigin:t});return s}function G(a,o,{objectFit:t,size:r,correctCentering:s}){const e=t==="contain"?Math.max(a.width,a.height):Math.min(a.width,a.height),i=r.mode==="auto"?e:r.mode==="force"?r.value:Math.min(r.value,e);let c=(a.width-e)/2,l=(a.height-e)/2;if(s){const u=o.getCorrectionOffset(a,e);c=u.x,l=u.y}return{sourceX:c,sourceY:l,sourceSize:e,destinationSize:i}}function V(a,o,t){const{width:r,height:s}=o.canvas,e=[];let{x:i,y:c,rowHeight:l,maxRowWidth:u}=t;const n={};for(let m=0,f=a.length;m<f;m++){const{key:T,image:_,sourceSize:v,sourceX:w,sourceY:h,destinationSize:g}=a[m],d=g+D;c+d>s||i+d>r&&c+d+l>s||(i+d>r&&(u=Math.max(u,i),i=0,c+=l,l=d),e.push({key:T,image:_,sourceX:w,sourceY:h,sourceSize:v,destinationX:i,destinationY:c,destinationSize:g}),n[T]={x:i,y:c,size:g},i+=d,l=Math.max(l,d))}u=Math.max(u,i);const x=u,E=c+l;for(let m=0,f=e.length;m<f;m++){const{image:T,sourceSize:_,sourceX:v,sourceY:w,destinationSize:h,destinationX:g,destinationY:d}=e[m],p=h/_,y=Math.max(v,0),I=Math.max(w,0),b=Math.min(v+_,T.width)-y,U=Math.min(w+_,T.height)-I;o.drawImage(T,y,I,b,U,g+(y-v)*p,d+(I-w)*p,b*p,U*p)}return{atlas:n,texture:o.getImageData(0,0,x,E),cursor:{x:i,y:c,rowHeight:l,maxRowWidth:u}}}function O({atlas:a,textures:o,cursor:t},r,s){const e={atlas:{...a},textures:[...o.slice(0,-1)],cursor:{...t}};let i=[];for(const c in r){const l=r[c];l.status!=="ready"||typeof a[c]?.textureIndex=="number"||i.push({key:c,...l})}for(;i.length;){const{atlas:c,texture:l,cursor:u}=V(i,s,e.cursor);e.cursor=u;const n=[];i.forEach(x=>{c[x.key]?e.atlas[x.key]={...c[x.key],textureIndex:e.textures.length}:n.push(x)}),e.textures.push(l),i=n,i.length&&(e.cursor={x:0,y:0,rowHeight:0,maxRowWidth:0},s.clearRect(0,0,s.canvas.width,s.canvas.height))}return e}class P{canvas;context;constructor(){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d",{willReadFrequently:!0})}getCorrectionOffset(o,t){this.canvas.width=t,this.canvas.height=t,this.context.clearRect(0,0,t,t),this.context.drawImage(o,0,0,t,t);const r=this.context.getImageData(0,0,t,t).data,s=new Uint8ClampedArray(r.length/4);for(let n=0;n<r.length;n++)s[n]=r[n*4+3];let e=0,i=0,c=0;for(let n=0;n<t;n++)for(let x=0;x<t;x++){const E=s[n*t+x];c+=E,e+=E*x,i+=E*n}const l=e/c,u=i/c;return{x:l-t/2,y:u-t/2}}}class R extends M.EventEmitter{static NEW_TEXTURE_EVENT="newTexture";options;canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d",{willReadFrequently:!0});frameId;corrector=new P;imageStates={};textures=[this.ctx.getImageData(0,0,1,1)];lastTextureCursor={x:0,y:0,rowHeight:0,maxRowWidth:0};atlas={};constructor(o={}){super(),this.options={...A,...o},this.canvas.width=this.options.maxTextureSize,this.canvas.height=this.options.maxTextureSize}scheduleGenerateTexture(){typeof this.frameId!="number"&&(typeof this.options.debounceTimeout=="number"?this.frameId=window.setTimeout(()=>{this.generateTextures(),this.frameId=void 0},this.options.debounceTimeout):this.generateTextures())}generateTextures(){const{atlas:o,textures:t,cursor:r}=O({atlas:this.atlas,textures:this.textures,cursor:this.lastTextureCursor},this.imageStates,this.ctx);this.atlas=o,this.textures=t,this.lastTextureCursor=r,this.emit(R.NEW_TEXTURE_EVENT,{atlas:o,textures:t})}async registerImage(o){if(!this.imageStates[o]){this.imageStates[o]={status:"loading"};try{const{size:t}=this.options,r=await X(o,{size:t.mode==="force"?t.value:void 0,crossOrigin:this.options.crossOrigin||void 0});this.imageStates[o]={status:"ready",image:r,...G(r,this.corrector,this.options)},this.scheduleGenerateTexture()}catch{this.imageStates[o]={status:"error"}}}}getAtlas(){return this.atlas}getTextures(){return this.textures}}L(0);const Y={name:"image",drawingMode:"image",padding:0,colorAttribute:"color",imageAttribute:"image"};function F(a){if(a==="image")return 6;let r=0;for(let e=0;e<a.length;e++)r=(r<<5)-r+a.charCodeAt(e);return 6+(1+Math.abs(r)%3)*6}function W(a,o){const{name:t,drawingMode:r,padding:s}=a,e=N(1+2*s),i=Math.max(1,o),c=`u_atlas_${t}`,l=`layer_${t}`,u=`v_texture_${t}`,n=`v_textureIndex_${t}`,x=`v_color_${t}`,E=[...new Array(i)].map((_,v)=>`if (index == ${v}) texel = texture(${c}[${v}], (${u}.xy + coordinateInTexture * ${u}.zw), -1.0);`).join(`
    else `),m=`else {
      texel = texture(${c}[0], (${u}.xy + coordinateInTexture * ${u}.zw), -1.0);
      noTextureFound = true;
    }`,f=r==="color"?`vec4 ${u}, float ${n}, vec4 ${x}`:`vec4 ${u}, float ${n}`;return`
// Texture atlas uniform - declared here because generator doesn't support sampler2D arrays
uniform sampler2D ${c}[${i}];

vec4 ${l}(${f}) {
  const float bias = 255.0 / 254.0;
  const float paddingRatio = ${e};

  vec4 color = vec4(0.0);

  // Calculate coordinate within the texture
  // The UV is in [-1, 1] range, convert to [0, 1] for texture sampling
  // Note: Camera rotation is handled at the program level (vertex shader)
  vec2 coordinateInTexture = context.uv * vec2(paddingRatio, -paddingRatio) * 0.5 + vec2(0.5, 0.5);
  int index = int(${n} + 0.5); // +0.5 to avoid rounding errors

  bool noTextureFound = false;
  vec4 texel = vec4(0.0);

  // No image to display - return transparent
  if (${u}.w <= 0.0) {
    // Return transparent when no image
  }
  // Image loaded into the texture
  else {
    ${E}
    ${m}

    if (!noTextureFound) {
      ${r==="color"?`// Colorize all visible image pixels with the specified color attribute
      color = mix(vec4(0.0), ${x}, texel.a);`:`// Image mode: render image pixels as-is
      color = texel;`}

      // Erase pixels "in the padding"
      // context.uv is in [-1, 1], so we check against 1.0 / paddingRatio
      float maxUV = 1.0 / paddingRatio;
      if (abs(context.uv.x) > maxUV || abs(context.uv.y) > maxUV) {
        color = vec4(0.0);
      }
    }
  }

  color.a *= bias;
  return color;
}
`}function $(a,o){const{name:t,drawingMode:r,colorAttribute:s}=a,{FLOAT:e,UNSIGNED_BYTE:i}=WebGL2RenderingContext,c=Math.max(1,o),l=[],u=[{name:`texture_${t}`,size:4,type:e,source:"__texture__"},{name:`textureIndex_${t}`,size:1,type:e,source:"__textureIndex__"}];return r==="color"&&u.push({name:`color_${t}`,size:4,type:i,normalized:!0,source:s}),{name:t,uniforms:l,attributes:u,glsl:W(a,c)}}function B(a){const o={...Y,...a||{}},{textureManager:t,textureManagerOptions:r,...s}=o,e=s;let i=1;const c=$(e,i),l=t??new R({...A,...r});return{...c,lifecycle:u=>{const{gl:n,requestShaderRegeneration:x,requestRefresh:E}=u;let m=[],f=[],T={};const _=F(e.name),v=()=>{for(;m.length<f.length;){const h=n.createTexture();h&&m.push(h)}for(let h=0;h<f.length;h++)n.activeTexture(n.TEXTURE0+_+h),n.bindTexture(n.TEXTURE_2D,m[h]),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,f[h]),n.generateMipmap(n.TEXTURE_2D)},w=({atlas:h,textures:g})=>{const d=g.length!==f.length;T=h,f=g,d&&(i=g.length||1,x()),v(),E()};return{init:()=>{l.on(R.NEW_TEXTURE_EVENT,w),T=l.getAtlas(),f=l.getTextures(),f.length>0&&(m=f.map(()=>n.createTexture()),v())},beforeRender:()=>{for(let g=0;g<f.length;g++)n.activeTexture(n.TEXTURE0+_+g),n.bindTexture(n.TEXTURE_2D,m[g]);const h=u.getUniformLocation(`u_atlas_${e.name}`);h&&n.uniform1iv(h,[...new Array(f.length||1)].map((g,d)=>_+d))},regenerate:()=>$(e,i),getAttributeData:(h,g)=>{const d=h[e.imageAttribute];if(g==="__texture__"){const p=d?T[d]:void 0;if(p&&typeof p.textureIndex=="number"){const{width:y,height:I}=f[p.textureIndex];return[p.x/y,p.y/I,p.size/y,p.size/I]}return[0,0,0,0]}return g==="__textureIndex__"?(typeof d=="string"&&!T[d]&&l.registerImage(d),(d?T[d]:void 0)?.textureIndex??0):null},kill:()=>{l.off(R.NEW_TEXTURE_EVENT,w);for(const h of m)n.deleteTexture(h);m=[]}}}}}export{B as l};
