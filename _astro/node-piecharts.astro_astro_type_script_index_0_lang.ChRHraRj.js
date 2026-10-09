import{i as A}from"./index.05z0eyqs.js";import{s as S}from"./index.D6kH3ct1.js";import{f as v,s,S as L}from"./graphology.BwGEgIxD.js";import{r as I}from"./_controls.BjInEjVR.js";import{g as M}from"./small-graph.D6DIB7I0.js";import{c as C,n as h,a as B}from"./schema.DPqDLh61.js";B({color:C("#000000",{variable:!0}),value:h(1,{variable:!0})}),h(0,{variable:!0}),C("#000000");const E="#000000",i=2*Math.PI;function y(e){return typeof e=="string"}function _(e){return typeof e=="object"&&e!==null&&"attribute"in e}function g(e){return typeof e=="object"&&e!==null&&"attribute"in e}function x(e){return typeof e=="number"}function d(e){return typeof e=="object"&&e!==null&&"attribute"in e}function O(e,a){const r=[...d(a)?["float v_offset"]:[],...e.flatMap(({color:o},t)=>_(o)?[`vec4 v_sliceColor_${t+1}`]:[]),...e.flatMap(({value:o},t)=>g(o)?[`float v_sliceValue_${t+1}`]:[])],u=[...x(a)?["float u_offset"]:[],"vec4 u_defaultColor",...e.flatMap(({color:o},t)=>y(o)?[`vec4 u_sliceColor_${t+1}`]:[])],f=[...r,...u].join(", "),c=e.map(({color:o},t)=>_(o)?`  vec4 sliceColor_${t+1} = v_sliceColor_${t+1};`:`  vec4 sliceColor_${t+1} = u_sliceColor_${t+1};`).join(`
`),m=e.map((o,t)=>`  sliceColor_${t+1}.a *= bias;`).join(`
`),p=e.map(({value:o},t)=>{const j=g(o)?`v_sliceValue_${t+1}`:s(typeof o=="number"?o:1);return`  float sliceValue_${t+1} = ${j};`}).join(`
`),l=e.map((o,t)=>`sliceValue_${t+1}`).join(" + "),n=e.map((o,t)=>`    float angle_${t+1} = angle_${t} + sliceValue_${t+1} * ${s(i)} / total;`).join(`
`),V=e.slice(1).map((o,t)=>`  color = mix(color, sliceColor_${t+2}, smoothstep(angle_${t+1} - aa, angle_${t+1} + aa, angle));`).join(`
`);return`
vec4 layer_piechart(${f}) {
  const float bias = 255.0 / 254.0;
  float offsetValue = ${d(a)?"v_offset":"u_offset"};

  // Calculate angle from UV coordinates
  // atan2(y, x) gives angle in [-PI, PI], we convert to [0, 2*PI]
  // Note: Camera rotation is handled at the program level (vertex shader)
  float angle = atan(context.uv.y, context.uv.x);
  if (angle < 0.0) angle += ${s(i)};

  // Apply offset
  angle = angle + offsetValue;
  angle = mod(angle, ${s(i)});

  // Set up colors
${c}
${m}

  // Set up values
${p}

  // Normalize slice values into boundary angles
  float total = ${l};

  // Fall back to default color if all slices are zero
  if (total <= 0.0) {
    vec4 fallback = u_defaultColor;
    fallback.a *= bias;
    return fallback;
  }

  float angle_0 = 0.0;
${n}

  // ~1px expressed in angle units at this radius (arc length = radius * angle)
  float r = length(context.uv);
  float aa = context.aaWidth / max(r, context.aaWidth);

  vec4 color = sliceColor_1;
${V}

  // Blend the last/first boundary across the mod() seam at 0 / 2*PI
  color = mix(sliceColor_${e.length}, color, smoothstep(-aa, aa, angle));
  color = mix(color, sliceColor_1, smoothstep(${s(i)} - aa, ${s(i)} + aa, angle));

  return color;
}
`}function z(e){const a=e?.slices??[],r=e?.offset??0,u=e?.defaultColor;if(a.length===0)return{name:"piechart",uniforms:[],attributes:[],glsl:"vec4 layer_piechart() { return vec4(0.0); }"};const{UNSIGNED_BYTE:f,FLOAT:c}=WebGL2RenderingContext,m=[...x(r)?[{name:"u_offset",type:"float",value:r}]:[],{name:"u_defaultColor",type:"vec4",value:v(u)},...a.flatMap(({color:l},n)=>y(l)?[{name:`u_sliceColor_${n+1}`,type:"vec4",value:v(l)}]:[])],p=[...d(r)?[{name:"offset",size:1,type:c,source:r.attribute,defaultValue:r.default}]:[],...a.flatMap(({color:l},n)=>_(l)?[{name:`sliceColor_${n+1}`,size:4,type:f,normalized:!0,source:l.attribute,defaultValue:l.default||E}]:[]),...a.flatMap(({value:l},n)=>g(l)?[{name:`sliceValue_${n+1}`,size:1,type:c,source:l.attribute,defaultValue:l.default}]:[])];return{name:"piechart",uniforms:m,attributes:p,glsl:O(a,r)}}const F=document.getElementById("sigma-container"),{slices:P}=I({slices:{type:"number",label:"Slices",default:3,min:1,max:32,step:1}}),b=M(),G=S("sigma"),N=A(P,{seed:"sigma",colorSpace:"green-mint"}),$=Array.from({length:P},(e,a)=>`slice${a}`);b.forEachNode(e=>{$.forEach(a=>{b.setNodeAttribute(e,a,e==="d"?0:Math.max(G()**2-.01,0))})});new L(b,F,{primitives:{nodes:{variables:Object.fromEntries($.map(e=>[e,{type:"number",default:0}])),layers:[z({defaultColor:"#BCB7C4",slices:$.map((e,a)=>({color:N[a],value:{attribute:e}}))})]}}});
