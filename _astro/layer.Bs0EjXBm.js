import{f as v,s as _}from"./graphology.BwGEgIxD.js";function f(o){return typeof o=="object"&&o!==null&&"attribute"in o}function p(o){return typeof o=="string"}function i(o){return typeof o=="object"&&o!==null&&"attribute"in o}function F(o){const n=o.filter(t=>t.fill).length,s=_(n||1),c=o.flatMap((t,e)=>{if(t.fill)return[];const{size:d,mode:y}=t,g=y==="pixels";let l;return i(d)?l=`v_borderSize_${e+1}`:l=_(typeof d=="number"?d:0),g?[`  float borderSize_${e+1} = ${l} * context.pixelToUV;`]:[`  float borderSize_${e+1} = context.shapeHalfSize * ${l};`]}).join(`
`),u=o.flatMap((t,e)=>t.fill?[]:[`borderSize_${e+1}`]).join(" + ")||"0.0",r=o.flatMap((t,e)=>t.fill?[`  float borderSize_${e+1} = fillBorderSize;`]:[]).join(`
`),a=o.map((t,e)=>`  float boundary_${e+1} = boundary_${e} - borderSize_${e+1};`).join(`
`),$=o.map(({color:t},e)=>f(t)?`  vec4 borderColor_${e+1} = v_borderColor_${e+1};`:`  vec4 borderColor_${e+1} = u_borderColor_${e+1};`).join(`
`),S=o.map((t,e)=>`  borderColor_${e+1}.a *= bias;
  if (borderSize_${e+1} <= 2.0 * context.aaWidth) { borderColor_${e+1} = ${e===0?"borderColor_1":`borderColor_${e}`}; }`).join(`
`),m=o.map((t,e)=>e===0?`if (context.sdf > boundary_1) {
    color = borderColor_1;
  } else `:`if (context.sdf > boundary_${e} - 2.0 * context.aaWidth) {
    color = mix(borderColor_${e+1}, borderColor_${e}, (context.sdf - boundary_${e} + 2.0 * context.aaWidth) / (2.0 * context.aaWidth));
  } else if (context.sdf > boundary_${e+1}) {
    color = borderColor_${e+1};
  } else `).join(""),z=[...o.flatMap(({color:t},e)=>f(t)?[`vec4 v_borderColor_${e+1}`]:[]),...o.flatMap(({size:t},e)=>i(t)?[`float v_borderSize_${e+1}`]:[])],h=o.flatMap(({color:t},e)=>p(t)?[`vec4 u_borderColor_${e+1}`]:[]),C=[...z,...h].join(", "),x=i(o[0].size);return`
vec4 layer_border(${C}) {
  const float bias = 255.0 / 254.0;

  // Calculate border sizes (using context.shapeSize and context.pixelSize)
${c}
${x?`
  // Early return if first border size is effectively zero (layer disabled)
  if (borderSize_1 <= context.aaWidth) {
    return vec4(0.0);
  }
`:""}
  // Calculate fill border size (distribute remaining space)
  // Use inradiusFactor to get actual shape depth from the bounding size
  // For circle/square (inradiusFactor=1.0), this equals shapeSize
  // For triangle (inradiusFactor=0.5), this is half of shapeSize
  float shapeDepth = context.shapeSize * context.inradiusFactor;
  float fillBorderSize = (shapeDepth - (${u})) / ${s};
${r}

  // Calculate cumulative boundaries (from outside to inside in SDF space)
  float boundary_0 = 0.0;  // Shape edge at context.sdf=0
${a}

  // Set up colors
${$}
${S}

  // Select color based on SDF position with antialiasing
  // Note: outer edge AA (context.sdf > 0 transition) is handled by the composed generator's smoothstep
  vec4 color = vec4(0.0);
  ${m}{ color = borderColor_${o.length}; }

  return color;
}
`}function A(o){const n=o?.borders??[];if(n.length===0)return{name:"border",uniforms:[],attributes:[],glsl:"vec4 layer_border() { return vec4(0.0); }"};const{UNSIGNED_BYTE:s,FLOAT:c}=WebGL2RenderingContext,b=n.flatMap(({color:r},a)=>p(r)?[{name:`u_borderColor_${a+1}`,type:"vec4",value:v(r)}]:[]),u=[...n.flatMap(({color:r},a)=>f(r)?[{name:`borderColor_${a+1}`,size:4,type:s,normalized:!0,source:r.attribute,defaultValue:r.default}]:[]),...n.flatMap(({size:r},a)=>i(r)?[{name:`borderSize_${a+1}`,size:1,type:c,source:r.attribute,defaultValue:r.default}]:[])];return{name:"border",uniforms:b,attributes:u,glsl:F(n)}}export{A as l};
