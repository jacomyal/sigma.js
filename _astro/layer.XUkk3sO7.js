import{E as e,T as t}from"./graphology.DvPOi-Ni.js";import{a as n,i as r,r as i}from"./schema.DHbLvR1R.js";var a=e(),o={size:{mode:`max`,value:512},objectFit:`cover`,correctCentering:!1,maxTextureSize:4096,debounceTimeout:500,crossOrigin:`anonymous`};function s(e,{crossOrigin:t}={}){return new Promise((n,r)=>{let i=new Image;i.addEventListener(`load`,()=>{n(i)},{once:!0}),i.addEventListener(`error`,e=>{r(e.error)},{once:!0}),t&&i.setAttribute(`crossOrigin`,t),i.src=e})}async function c(e,{size:t,crossOrigin:n}={}){let r;r=n===`use-credentials`?await fetch(e,{credentials:`include`}):await fetch(e);let i=await r.text(),a=new DOMParser().parseFromString(i,`image/svg+xml`),o=a.documentElement,c=o.getAttribute(`width`),l=o.getAttribute(`height`);if(!c||!l)throw Error("loadSVGImage: cannot use `size` if target SVG has no definite dimensions.");typeof t==`number`&&(o.setAttribute(`width`,``+t),o.setAttribute(`height`,``+t));let u=new XMLSerializer().serializeToString(a),d=new Blob([u],{type:`image/svg+xml`}),f=URL.createObjectURL(d),p=s(f);return p.finally(()=>URL.revokeObjectURL(f)),p}async function l(e,{size:t,crossOrigin:n}={}){let r=e.split(/[#?]/)[0].split(`.`).pop()?.trim().toLowerCase()===`svg`,i;if(r&&t)try{i=await c(e,{size:t,crossOrigin:n})}catch{i=await s(e,{crossOrigin:n})}else i=await s(e,{crossOrigin:n});return i}function u(e,t,{objectFit:n,size:r,correctCentering:i}){let a=n===`contain`?Math.max(e.width,e.height):Math.min(e.width,e.height),o=r.mode===`auto`?a:r.mode===`force`?r.value:Math.min(r.value,a),s=(e.width-a)/2,c=(e.height-a)/2;if(i){let n=t.getCorrectionOffset(e,a);s=n.x,c=n.y}return{sourceX:s,sourceY:c,sourceSize:a,destinationSize:o}}function d(e,t,n){let{width:r,height:i}=t.canvas,a=[],{x:o,y:s,rowHeight:c,maxRowWidth:l}=n,u={};for(let t=0,n=e.length;t<n;t++){let{key:n,image:d,sourceSize:f,sourceX:p,sourceY:m,destinationSize:h}=e[t],g=h+1;s+g>i||o+g>r&&s+g+c>i||(o+g>r&&(l=Math.max(l,o),o=0,s+=c,c=g),a.push({key:n,image:d,sourceX:p,sourceY:m,sourceSize:f,destinationX:o,destinationY:s,destinationSize:h}),u[n]={x:o,y:s,size:h},o+=g,c=Math.max(c,g))}l=Math.max(l,o);let d=l,f=s+c;for(let e=0,n=a.length;e<n;e++){let{image:n,sourceSize:r,sourceX:i,sourceY:o,destinationSize:s,destinationX:c,destinationY:l}=a[e],u=s/r,d=Math.max(i,0),f=Math.max(o,0),p=Math.min(i+r,n.width)-d,m=Math.min(o+r,n.height)-f;t.drawImage(n,d,f,p,m,c+(d-i)*u,l+(f-o)*u,p*u,m*u)}return{atlas:u,texture:t.getImageData(0,0,d,f),cursor:{x:o,y:s,rowHeight:c,maxRowWidth:l}}}function f({atlas:e,textures:t,cursor:n},r,i){let a={atlas:{...e},textures:[...t.slice(0,-1)],cursor:{...n}},o=[];for(let t in r){let n=r[t];n.status===`ready`&&typeof e[t]?.textureIndex!=`number`&&o.push({key:t,...n})}for(;o.length;){let{atlas:e,texture:t,cursor:n}=d(o,i,a.cursor);a.cursor=n;let r=[];o.forEach(t=>{e[t.key]?a.atlas[t.key]={...e[t.key],textureIndex:a.textures.length}:r.push(t)}),a.textures.push(t),o=r,o.length&&(a.cursor={x:0,y:0,rowHeight:0,maxRowWidth:0},i.clearRect(0,0,i.canvas.width,i.canvas.height))}return a}var p=class{canvas;context;constructor(){this.canvas=document.createElement(`canvas`),this.context=this.canvas.getContext(`2d`,{willReadFrequently:!0})}getCorrectionOffset(e,t){this.canvas.width=t,this.canvas.height=t,this.context.clearRect(0,0,t,t),this.context.drawImage(e,0,0,t,t);let n=this.context.getImageData(0,0,t,t).data,r=new Uint8ClampedArray(n.length/4);for(let e=0;e<n.length;e++)r[e]=n[e*4+3];let i=0,a=0,o=0;for(let e=0;e<t;e++)for(let n=0;n<t;n++){let s=r[e*t+n];o+=s,i+=s*n,a+=s*e}let s=i/o,c=a/o;return{x:s-t/2,y:c-t/2}}},m=class e extends a.EventEmitter{static NEW_TEXTURE_EVENT=`newTexture`;options;canvas=document.createElement(`canvas`);ctx=this.canvas.getContext(`2d`,{willReadFrequently:!0});frameId;corrector=new p;imageStates={};textures=[this.ctx.getImageData(0,0,1,1)];lastTextureCursor={x:0,y:0,rowHeight:0,maxRowWidth:0};atlas={};constructor(e={}){super(),this.options={...o,...e},this.canvas.width=this.options.maxTextureSize,this.canvas.height=this.options.maxTextureSize}scheduleGenerateTexture(){typeof this.frameId!=`number`&&(typeof this.options.debounceTimeout==`number`?this.frameId=window.setTimeout(()=>{this.generateTextures(),this.frameId=void 0},this.options.debounceTimeout):this.generateTextures())}generateTextures(){let{atlas:t,textures:n,cursor:r}=f({atlas:this.atlas,textures:this.textures,cursor:this.lastTextureCursor},this.imageStates,this.ctx);this.atlas=t,this.textures=n,this.lastTextureCursor=r,this.emit(e.NEW_TEXTURE_EVENT,{atlas:t,textures:n})}async registerImage(e){if(!this.imageStates[e]){this.imageStates[e]={status:`loading`};try{let{size:t}=this.options,n=await l(e,{size:t.mode===`force`?t.value:void 0,crossOrigin:this.options.crossOrigin||void 0});this.imageStates[e]={status:`ready`,image:n,...u(n,this.corrector,this.options)},this.scheduleGenerateTexture()}catch{this.imageStates[e]={status:`error`}}}}clampMaxTextureSize(e){e>=this.options.maxTextureSize||(this.options.maxTextureSize=e,this.canvas.width=e,this.canvas.height=e,this.atlas={},this.textures=[this.ctx.getImageData(0,0,1,1)],this.lastTextureCursor={x:0,y:0,rowHeight:0,maxRowWidth:0},Object.values(this.imageStates).some(e=>e.status===`ready`)&&this.scheduleGenerateTexture())}getAtlas(){return this.atlas}getTextures(){return this.textures}};n(`image`),i([`image`,`color`],`image`),r(0),n(`color`),n(`image`);var h={name:`image`,drawingMode:`image`,padding:0,colorAttribute:`color`,imageAttribute:`image`};({...o});function g(e){if(e===`image`)return 6;let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n);return 6+(1+Math.abs(t)%3)*6}function _(e,n){let{name:r,drawingMode:i,padding:a}=e,o=t(1+2*a),s=Math.max(1,n),c=`u_atlas_${r}`,l=`layer_${r}`,u=`v_texture_${r}`,d=`v_textureIndex_${r}`,f=`v_color_${r}`,p=[...Array(s)].map((e,t)=>`if (index == ${t}) texel = texture(${c}[${t}], (${u}.xy + coordinateInTexture * ${u}.zw), -1.0);`).join(`
    else `),m=`else {
      texel = texture(${c}[0], (${u}.xy + coordinateInTexture * ${u}.zw), -1.0);
      noTextureFound = true;
    }`;return`
// Texture atlas uniform - declared here because generator doesn't support sampler2D arrays
uniform sampler2D ${c}[${s}];

vec4 ${l}(${i===`color`?`vec4 ${u}, float ${d}, vec4 ${f}`:`vec4 ${u}, float ${d}`}) {
  const float bias = 255.0 / 254.0;
  const float paddingRatio = ${o};

  vec4 color = vec4(0.0);

  // Calculate coordinate within the texture
  // The UV is in [-1, 1] range, convert to [0, 1] for texture sampling
  // Note: Camera rotation is handled at the program level (vertex shader)
  vec2 coordinateInTexture = context.uv * vec2(paddingRatio, -paddingRatio) * 0.5 + vec2(0.5, 0.5);
  int index = int(${d} + 0.5); // +0.5 to avoid rounding errors

  bool noTextureFound = false;
  vec4 texel = vec4(0.0);

  // No image to display - return transparent
  if (${u}.w <= 0.0) {
    // Return transparent when no image
  }
  // Image loaded into the texture
  else {
    ${p}
    ${m}

    if (!noTextureFound) {
      ${i===`color`?`// Colorize all visible image pixels with the specified color attribute
      color = mix(vec4(0.0), ${f}, texel.a);`:`// Image mode: render image pixels as-is
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
`}function v(e,t){let{name:n,drawingMode:r,colorAttribute:i}=e,{FLOAT:a,UNSIGNED_BYTE:o}=WebGL2RenderingContext,s=Math.max(1,t),c=[],l=[{name:`texture_${n}`,size:4,type:a,source:`__texture__`},{name:`textureIndex_${n}`,size:1,type:a,source:`__textureIndex__`}];return r===`color`&&l.push({name:`color_${n}`,size:4,type:o,normalized:!0,source:i}),{name:n,uniforms:c,attributes:l,glsl:_(e,s)}}function y(e){let{textureManager:t,textureManagerOptions:n,...r}={...h,...e||{}},i=r,a=1,s=v(i,a),c=t??new m({...o,...n});return{...s,lifecycle:e=>{let{gl:t,requestShaderRegeneration:n,requestRefresh:r}=e,o=[],s=[],l={},u=g(i.name),d=()=>{for(;o.length<s.length;){let e=t.createTexture();e&&o.push(e)}for(let e=0;e<s.length;e++)t.activeTexture(t.TEXTURE0+u+e),t.bindTexture(t.TEXTURE_2D,o[e]),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,s[e]),t.generateMipmap(t.TEXTURE_2D)},f=({atlas:e,textures:t})=>{let i=t.length!==s.length;l=e,s=t,i&&(a=t.length||1,n()),d(),r()};return{init:()=>{c.on(m.NEW_TEXTURE_EVENT,f),c.clampMaxTextureSize(t.getParameter(t.MAX_TEXTURE_SIZE)),l=c.getAtlas(),s=c.getTextures(),d()},beforeRender:()=>{for(let e=0;e<s.length;e++)t.activeTexture(t.TEXTURE0+u+e),t.bindTexture(t.TEXTURE_2D,o[e]);let n=e.getUniformLocation(`u_atlas_${i.name}`);n&&t.uniform1iv(n,[...Array(s.length||1)].map((e,t)=>u+t))},regenerate:()=>v(i,a),getAttributeData:(e,t)=>{let n=e[i.imageAttribute];if(t===`__texture__`){let e=n?l[n]:void 0;if(e&&typeof e.textureIndex==`number`){let{width:t,height:n}=s[e.textureIndex];return[e.x/t,e.y/n,e.size/t,e.size/n]}return[0,0,0,0]}return t===`__textureIndex__`?(typeof n==`string`&&!l[n]&&c.registerImage(n),(n?l[n]:void 0)?.textureIndex??0):null},kill:()=>{c.off(m.NEW_TEXTURE_EVENT,f);for(let e of o)t.deleteTexture(e);o=[]}}}}}export{y as t};