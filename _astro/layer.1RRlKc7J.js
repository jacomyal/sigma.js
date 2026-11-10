import{T as e,v as t}from"./graphology.DvPOi-Ni.js";function n(e){return typeof e==`object`&&!!e&&`attribute`in e}function r(e){return typeof e==`string`}function i(e){return typeof e==`object`&&!!e&&`attribute`in e}function a(t){let a=t.filter(e=>e.fill).length,o=e(a||1),s=t.flatMap((t,n)=>{if(t.fill)return[];let{size:r,mode:a}=t,o=a===`pixels`,s;return s=i(r)?`v_borderSize_${n+1}`:e(typeof r==`number`?r:0),o?[`  float borderSize_${n+1} = ${s} * context.pixelToUV;`]:[`  float borderSize_${n+1} = context.shapeHalfSize * ${s};`]}).join(`
`),c=t.flatMap((e,t)=>e.fill?[]:[`borderSize_${t+1}`]).join(` + `)||`0.0`,l=t.flatMap((e,t)=>e.fill?[`  float borderSize_${t+1} = fillBorderSize;`]:[]).join(`
`),u=t.map((e,t)=>`  float boundary_${t+1} = boundary_${t} - borderSize_${t+1};`).join(`
`),d=t.map(({color:e},t)=>n(e)?`  vec4 borderColor_${t+1} = v_borderColor_${t+1};`:`  vec4 borderColor_${t+1} = u_borderColor_${t+1};`).join(`
`),f=t.map((e,t)=>`  borderColor_${t+1}.a *= bias;
  if (borderSize_${t+1} <= 2.0 * context.aaWidth) { borderColor_${t+1} = ${t===0?`borderColor_1`:`borderColor_${t}`}; }`).join(`
`),p=t.map((e,t)=>t===0?`if (context.sdf > boundary_1) {
    color = borderColor_1;
  } else `:`if (context.sdf > boundary_${t} - 2.0 * context.aaWidth) {
    color = mix(borderColor_${t+1}, borderColor_${t}, (context.sdf - boundary_${t} + 2.0 * context.aaWidth) / (2.0 * context.aaWidth));
  } else if (context.sdf > boundary_${t+1}) {
    color = borderColor_${t+1};
  } else `).join(``),m=[...t.flatMap(({color:e},t)=>n(e)?[`vec4 v_borderColor_${t+1}`]:[]),...t.flatMap(({size:e},t)=>i(e)?[`float v_borderSize_${t+1}`]:[])],h=t.flatMap(({color:e},t)=>r(e)?[`vec4 u_borderColor_${t+1}`]:[]);return`
vec4 layer_border(${[...m,...h].join(`, `)}) {
  const float bias = 255.0 / 254.0;

  // Calculate border sizes (using context.shapeSize and context.pixelSize)
${s}
${i(t[0].size)?`
  // Early return if first border size is effectively zero (layer disabled)
  if (borderSize_1 <= context.aaWidth) {
    return vec4(0.0);
  }
`:``}
  // Calculate fill border size (distribute remaining space)
  // Use inradiusFactor to get actual shape depth from the bounding size
  // For circle/square (inradiusFactor=1.0), this equals shapeSize
  // For triangle (inradiusFactor=0.5), this is half of shapeSize
  float shapeDepth = context.shapeSize * context.inradiusFactor;
  float fillBorderSize = (shapeDepth - (${c})) / ${o};
${l}

  // Calculate cumulative boundaries (from outside to inside in SDF space)
  float boundary_0 = 0.0;  // Shape edge at context.sdf=0
${u}

  // Set up colors
${d}
${f}

  // Select color based on SDF position with antialiasing
  // Note: outer edge AA (context.sdf > 0 transition) is handled by the composed generator's smoothstep
  vec4 color = vec4(0.0);
  ${p}{ color = borderColor_${t.length}; }

  return color;
}
`}function o(e){let o=e?.borders??[];if(o.length===0)return{name:`border`,uniforms:[],attributes:[],glsl:`vec4 layer_border() { return vec4(0.0); }`};let{UNSIGNED_BYTE:s,FLOAT:c}=WebGL2RenderingContext;return{name:`border`,uniforms:o.flatMap(({color:e},n)=>r(e)?[{name:`u_borderColor_${n+1}`,type:`vec4`,value:t(e)}]:[]),attributes:[...o.flatMap(({color:e},t)=>n(e)?[{name:`borderColor_${t+1}`,size:4,type:s,normalized:!0,source:e.attribute,defaultValue:e.default}]:[]),...o.flatMap(({size:e},t)=>i(e)?[{name:`borderSize_${t+1}`,size:1,type:c,source:e.attribute,defaultValue:e.default}]:[])],glsl:a(o)}}export{o as t};