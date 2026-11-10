import{n as e}from"./rolldown-runtime.WkwZ5CU-.js";import{T as t,n,v as r}from"./graphology.DvPOi-Ni.js";import{i,n as a,t as o}from"./schema.DHbLvR1R.js";import{t as s}from"./iwanthue.BdzuWOeM.js";import{t as c}from"./seedrandom.C_0xDXD3.js";import{t as l}from"./_controls.DxjZImZY.js";import{t as u}from"./small-graph.DE4MUY7S.js";o({color:a(`#000000`,{variable:!0}),value:i(1,{variable:!0})}),i(0,{variable:!0}),a(`#000000`);var d=2*Math.PI;function f(e){return typeof e==`string`}function p(e){return typeof e==`object`&&!!e&&`attribute`in e}function m(e){return typeof e==`object`&&!!e&&`attribute`in e}function h(e){return typeof e==`number`}function g(e){return typeof e==`object`&&!!e&&`attribute`in e}function _(e,n){let r=[...g(n)?[`float v_offset`]:[],...e.flatMap(({color:e},t)=>p(e)?[`vec4 v_sliceColor_${t+1}`]:[]),...e.flatMap(({value:e},t)=>m(e)?[`float v_sliceValue_${t+1}`]:[])],i=[...h(n)?[`float u_offset`]:[],`vec4 u_defaultColor`,...e.flatMap(({color:e},t)=>f(e)?[`vec4 u_sliceColor_${t+1}`]:[])],a=[...r,...i].join(`, `),o=e.map(({color:e},t)=>p(e)?`  vec4 sliceColor_${t+1} = v_sliceColor_${t+1};`:`  vec4 sliceColor_${t+1} = u_sliceColor_${t+1};`).join(`
`),s=e.map((e,t)=>`  sliceColor_${t+1}.a *= bias;`).join(`
`),c=e.map(({value:e},n)=>{let r=m(e)?`v_sliceValue_${n+1}`:t(typeof e==`number`?e:1);return`  float sliceValue_${n+1} = ${r};`}).join(`
`),l=e.map((e,t)=>`sliceValue_${t+1}`).join(` + `),u=e.map((e,n)=>`    float angle_${n+1} = angle_${n} + sliceValue_${n+1} * ${t(d)} / total;`).join(`
`),_=e.slice(1).map((e,t)=>`  color = mix(color, sliceColor_${t+2}, smoothstep(angle_${t+1} - aa, angle_${t+1} + aa, angle));`).join(`
`);return`
vec4 layer_piechart(${a}) {
  const float bias = 255.0 / 254.0;
  float offsetValue = ${g(n)?`v_offset`:`u_offset`};

  // Calculate angle from UV coordinates
  // atan2(y, x) gives angle in [-PI, PI], we convert to [0, 2*PI]
  // Note: Camera rotation is handled at the program level (vertex shader)
  float angle = atan(context.uv.y, context.uv.x);
  if (angle < 0.0) angle += ${t(d)};

  // Apply offset
  angle = angle + offsetValue;
  angle = mod(angle, ${t(d)});

  // Set up colors
${o}
${s}

  // Set up values
${c}

  // Normalize slice values into boundary angles
  float total = ${l};

  // Fall back to default color if all slices are zero
  if (total <= 0.0) {
    vec4 fallback = u_defaultColor;
    fallback.a *= bias;
    return fallback;
  }

  float angle_0 = 0.0;
${u}

  // ~1px expressed in angle units at this radius (arc length = radius * angle)
  float r = length(context.uv);
  float aa = context.aaWidth / max(r, context.aaWidth);

  vec4 color = sliceColor_1;
${_}

  // Blend the last/first boundary across the mod() seam at 0 / 2*PI
  color = mix(sliceColor_${e.length}, color, smoothstep(-aa, aa, angle));
  color = mix(color, sliceColor_1, smoothstep(${t(d)} - aa, ${t(d)} + aa, angle));

  return color;
}
`}function v(e){let t=e?.slices??[],n=e?.offset??0,i=e?.defaultColor??`#000000`;if(t.length===0)return{name:`piechart`,uniforms:[],attributes:[],glsl:`vec4 layer_piechart() { return vec4(0.0); }`};let{UNSIGNED_BYTE:a,FLOAT:o}=WebGL2RenderingContext;return{name:`piechart`,uniforms:[...h(n)?[{name:`u_offset`,type:`float`,value:n}]:[],{name:`u_defaultColor`,type:`vec4`,value:r(i)},...t.flatMap(({color:e},t)=>f(e)?[{name:`u_sliceColor_${t+1}`,type:`vec4`,value:r(e)}]:[])],attributes:[...g(n)?[{name:`offset`,size:1,type:o,source:n.attribute,defaultValue:n.default}]:[],...t.flatMap(({color:e},t)=>p(e)?[{name:`sliceColor_${t+1}`,size:4,type:a,normalized:!0,source:e.attribute,defaultValue:e.default||`#000000`}]:[]),...t.flatMap(({value:e},t)=>m(e)?[{name:`sliceValue_${t+1}`,size:1,type:o,source:e.attribute,defaultValue:e.default}]:[])],glsl:_(t,n)}}var y=e(s()),b=e(c()),x=document.getElementById(`sigma-container`),{slices:S}=l({slices:{type:`number`,label:`Slices`,default:3,min:1,max:32,step:1}}),C=u(),w=(0,b.default)(`sigma`),T=(0,y.default)(S,{seed:`sigma`,colorSpace:`green-mint`}),E=Array.from({length:S},(e,t)=>`slice${t}`);C.forEachNode(e=>{E.forEach(t=>{C.setNodeAttribute(e,t,e===`d`?0:Math.max(w()**2-.01,0))})}),new n(C,x,{primitives:{nodes:{variables:Object.fromEntries(E.map(e=>[e,{type:`number`,default:0}])),layers:[v({defaultColor:`#BCB7C4`,slices:E.map((e,t)=>({color:T[t],value:{attribute:e}}))})]}}});