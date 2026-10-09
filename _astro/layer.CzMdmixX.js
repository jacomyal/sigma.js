import{h as $,s as A}from"./graphology.BwGEgIxD.js";import{n as N}from"./schema.DPqDLh61.js";const U={size:{mode:"max",value:512},objectFit:"cover",correctCentering:!1,maxTextureSize:4096,debounceTimeout:500,crossOrigin:"anonymous"},M=1;function I(a,{crossOrigin:o}={}){return new Promise((e,n)=>{const s=new Image;s.addEventListener("load",()=>{e(s)},{once:!0}),s.addEventListener("error",t=>{n(t.error)},{once:!0}),o&&s.setAttribute("crossOrigin",o),s.src=a})}async function L(a,{size:o,crossOrigin:e}={}){let n;e==="use-credentials"?n=await fetch(a,{credentials:"include"}):n=await fetch(a);const s=await n.text(),t=new DOMParser().parseFromString(s,"image/svg+xml"),i=t.documentElement,c=i.getAttribute("width"),l=i.getAttribute("height");if(!c||!l)throw new Error("loadSVGImage: cannot use `size` if target SVG has no definite dimensions.");typeof o=="number"&&(i.setAttribute("width",""+o),i.setAttribute("height",""+o));const u=new XMLSerializer().serializeToString(t),r=new Blob([u],{type:"image/svg+xml"}),g=URL.createObjectURL(r),T=I(g);return T.finally(()=>URL.revokeObjectURL(g)),T}async function D(a,{size:o,crossOrigin:e}={}){const n=a.split(/[#?]/)[0].split(".").pop()?.trim().toLowerCase()==="svg";let s;if(n&&o)try{s=await L(a,{size:o,crossOrigin:e})}catch{s=await I(a,{crossOrigin:e})}else s=await I(a,{crossOrigin:e});return s}function C(a,o,{objectFit:e,size:n,correctCentering:s}){const t=e==="contain"?Math.max(a.width,a.height):Math.min(a.width,a.height),i=n.mode==="auto"?t:n.mode==="force"?n.value:Math.min(n.value,t);let c=(a.width-t)/2,l=(a.height-t)/2;if(s){const u=o.getCorrectionOffset(a,t);c=u.x,l=u.y}return{sourceX:c,sourceY:l,sourceSize:t,destinationSize:i}}function X(a,o,e){const{width:n,height:s}=o.canvas,t=[];let{x:i,y:c,rowHeight:l,maxRowWidth:u}=e;const r={};for(let m=0,f=a.length;m<f;m++){const{key:p,image:E,sourceSize:v,sourceX:w,sourceY:d,destinationSize:x}=a[m],h=x+M;c+h>s||i+h>n&&c+h+l>s||(i+h>n&&(u=Math.max(u,i),i=0,c+=l,l=h),t.push({key:p,image:E,sourceX:w,sourceY:d,sourceSize:v,destinationX:i,destinationY:c,destinationSize:x}),r[p]={x:i,y:c,size:x},i+=h,l=Math.max(l,h))}u=Math.max(u,i);const g=u,T=c+l;for(let m=0,f=t.length;m<f;m++){const{image:p,sourceSize:E,sourceX:v,sourceY:w,destinationSize:d,destinationX:x,destinationY:h}=t[m];o.drawImage(p,v,w,E,E,x,h,d,d)}return{atlas:r,texture:o.getImageData(0,0,g,T),cursor:{x:i,y:c,rowHeight:l,maxRowWidth:u}}}function G({atlas:a,textures:o,cursor:e},n,s){const t={atlas:{...a},textures:[...o.slice(0,-1)],cursor:{...e}};let i=[];for(const c in n){const l=n[c];l.status!=="ready"||typeof a[c]?.textureIndex=="number"||i.push({key:c,...l})}for(;i.length;){const{atlas:c,texture:l,cursor:u}=X(i,s,t.cursor);t.cursor=u;const r=[];i.forEach(g=>{c[g.key]?t.atlas[g.key]={...c[g.key],textureIndex:t.textures.length}:r.push(g)}),t.textures.push(l),i=r,i.length&&(t.cursor={x:0,y:0,rowHeight:0,maxRowWidth:0},s.clearRect(0,0,s.canvas.width,s.canvas.height))}return t}class V{canvas;context;constructor(){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d",{willReadFrequently:!0})}getCorrectionOffset(o,e){this.canvas.width=e,this.canvas.height=e,this.context.clearRect(0,0,e,e),this.context.drawImage(o,0,0,e,e);const n=this.context.getImageData(0,0,e,e).data,s=new Uint8ClampedArray(n.length/4);for(let r=0;r<n.length;r++)s[r]=n[r*4+3];let t=0,i=0,c=0;for(let r=0;r<e;r++)for(let g=0;g<e;g++){const T=s[r*e+g];c+=T,t+=T*g,i+=T*r}const l=t/c,u=i/c;return{x:l-e/2,y:u-e/2}}}class y extends $.EventEmitter{static NEW_TEXTURE_EVENT="newTexture";options;canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d",{willReadFrequently:!0});frameId;corrector=new V;imageStates={};textures=[this.ctx.getImageData(0,0,1,1)];lastTextureCursor={x:0,y:0,rowHeight:0,maxRowWidth:0};atlas={};constructor(o={}){super(),this.options={...U,...o},this.canvas.width=this.options.maxTextureSize,this.canvas.height=this.options.maxTextureSize}scheduleGenerateTexture(){typeof this.frameId!="number"&&(typeof this.options.debounceTimeout=="number"?this.frameId=window.setTimeout(()=>{this.generateTextures(),this.frameId=void 0},this.options.debounceTimeout):this.generateTextures())}generateTextures(){const{atlas:o,textures:e,cursor:n}=G({atlas:this.atlas,textures:this.textures,cursor:this.lastTextureCursor},this.imageStates,this.ctx);this.atlas=o,this.textures=e,this.lastTextureCursor=n,this.emit(y.NEW_TEXTURE_EVENT,{atlas:o,textures:e})}async registerImage(o){if(!this.imageStates[o]){this.imageStates[o]={status:"loading"};try{const{size:e}=this.options,n=await D(o,{size:e.mode==="force"?e.value:void 0,crossOrigin:this.options.crossOrigin||void 0});this.imageStates[o]={status:"ready",image:n,...C(n,this.corrector,this.options)},this.scheduleGenerateTexture()}catch{this.imageStates[o]={status:"error"}}}}getAtlas(){return this.atlas}getTextures(){return this.textures}}N(0);const O={name:"image",drawingMode:"image",padding:0,colorAttribute:"color",imageAttribute:"image"};function P(a){if(a==="image")return 6;let n=0;for(let t=0;t<a.length;t++)n=(n<<5)-n+a.charCodeAt(t);return 6+(1+Math.abs(n)%3)*6}function Y(a,o){const{name:e,drawingMode:n,padding:s}=a,t=A(1+2*s),i=Math.max(1,o),c=`u_atlas_${e}`,l=`layer_${e}`,u=`v_texture_${e}`,r=`v_textureIndex_${e}`,g=`v_color_${e}`,T=[...new Array(i)].map((E,v)=>`if (index == ${v}) texel = texture(${c}[${v}], (${u}.xy + coordinateInTexture * ${u}.zw), -1.0);`).join(`
    else `),m=`else {
      texel = texture(${c}[0], (${u}.xy + coordinateInTexture * ${u}.zw), -1.0);
      noTextureFound = true;
    }`,f=n==="color"?`vec4 ${u}, float ${r}, vec4 ${g}`:`vec4 ${u}, float ${r}`;return`
// Texture atlas uniform - declared here because generator doesn't support sampler2D arrays
uniform sampler2D ${c}[${i}];

vec4 ${l}(${f}) {
  const float bias = 255.0 / 254.0;
  const float paddingRatio = ${t};

  vec4 color = vec4(0.0);

  // Calculate coordinate within the texture
  // The UV is in [-1, 1] range, convert to [0, 1] for texture sampling
  // Note: Camera rotation is handled at the program level (vertex shader)
  vec2 coordinateInTexture = context.uv * vec2(paddingRatio, -paddingRatio) * 0.5 + vec2(0.5, 0.5);
  int index = int(${r} + 0.5); // +0.5 to avoid rounding errors

  bool noTextureFound = false;
  vec4 texel = vec4(0.0);

  // No image to display - return transparent
  if (${u}.w <= 0.0) {
    // Return transparent when no image
  }
  // Image loaded into the texture
  else {
    ${T}
    ${m}

    if (!noTextureFound) {
      ${n==="color"?`// Colorize all visible image pixels with the specified color attribute
      color = mix(vec4(0.0), ${g}, texel.a);`:`// Image mode: render image pixels as-is
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
`}function b(a,o){const{name:e,drawingMode:n,colorAttribute:s}=a,{FLOAT:t,UNSIGNED_BYTE:i}=WebGL2RenderingContext,c=Math.max(1,o),l=[],u=[{name:`texture_${e}`,size:4,type:t,source:"__texture__"},{name:`textureIndex_${e}`,size:1,type:t,source:"__textureIndex__"}];return n==="color"&&u.push({name:`color_${e}`,size:4,type:i,normalized:!0,source:s}),{name:e,uniforms:l,attributes:u,glsl:Y(a,c)}}function k(a){const o={...O,...a||{}},{textureManager:e,textureManagerOptions:n,...s}=o,t=s;let i=1;const c=b(t,i),l=e??new y({...U,...n});return{...c,lifecycle:u=>{const{gl:r,requestShaderRegeneration:g,requestRefresh:T}=u;let m=[],f=[],p={};const E=P(t.name),v=()=>{for(;m.length<f.length;){const d=r.createTexture();d&&m.push(d)}for(let d=0;d<f.length;d++)r.activeTexture(r.TEXTURE0+E+d),r.bindTexture(r.TEXTURE_2D,m[d]),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,f[d]),r.generateMipmap(r.TEXTURE_2D)},w=({atlas:d,textures:x})=>{const h=x.length!==f.length;p=d,f=x,h&&(i=x.length||1,g()),v(),T()};return{init:()=>{l.on(y.NEW_TEXTURE_EVENT,w),p=l.getAtlas(),f=l.getTextures(),f.length>0&&(m=f.map(()=>r.createTexture()),v())},beforeRender:()=>{for(let x=0;x<f.length;x++)r.activeTexture(r.TEXTURE0+E+x),r.bindTexture(r.TEXTURE_2D,m[x]);const d=u.getUniformLocation(`u_atlas_${t.name}`);d&&r.uniform1iv(d,[...new Array(f.length||1)].map((x,h)=>E+h))},regenerate:()=>b(t,i),getAttributeData:(d,x)=>{const h=d[t.imageAttribute];if(x==="__texture__"){const _=h?p[h]:void 0;if(_&&typeof _.textureIndex=="number"){const{width:R,height:S}=f[_.textureIndex];return[_.x/R,_.y/S,_.size/R,_.size/S]}return[0,0,0,0]}return x==="__textureIndex__"?(typeof h=="string"&&!p[h]&&l.registerImage(h),(h?p[h]:void 0)?.textureIndex??0):null},kill:()=>{l.off(y.NEW_TEXTURE_EVENT,w);for(const d of m)r.deleteTexture(d);m=[]}}}}}export{k as l};
