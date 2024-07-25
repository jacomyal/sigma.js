var I=Object.defineProperty;var V=(o,e,t)=>e in o?I(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var u=(o,e,t)=>(V(o,typeof e!="symbol"?e+"":e,t),t);import{n as B,N as F,f as G,c as y,G as m,S as h,o as v,D as w}from"./utils-Ph0PoCvK.js";import"./_commonjsHelpers-BosuxZz1.js";function j({slices:o,offset:e}){return`
precision highp float;

varying vec2 v_diffVector;
varying float v_radius;

#ifdef PICKING_MODE
varying vec4 v_color;
#else
// For normal mode, we use the border colors defined in the program:
${o.flatMap(({value:n},a)=>"attribute"in n?[`varying float v_sliceValue_${a+1};`]:[]).join(`
`)}
${o.map(({color:n},a)=>"attribute"in n?`varying vec4 v_sliceColor_${a+1};`:`uniform vec4 u_sliceColor_${a+1};`).join(`
`)}
#endif

uniform vec4 u_defaultColor;
uniform float u_cameraAngle;
uniform float u_correctionRatio;

${"attribute"in e?`varying float v_offset;
`:""}
${"value"in e?`uniform float u_offset;
`:""}

const float bias = 255.0 / 254.0;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float aaBorder = u_correctionRatio * 2.0;;
  float dist = length(v_diffVector);
  float offset = ${"attribute"in e?"v_offset":"u_offset"};
  float angle = atan(v_diffVector.y / v_diffVector.x);
  if (v_diffVector.x < 0.0 && v_diffVector.y < 0.0) angle += ${Math.PI};
  else if (v_diffVector.x < 0.0) angle += ${Math.PI};
  else if (v_diffVector.y < 0.0) angle += ${2*Math.PI};
  angle = angle - u_cameraAngle + offset;
  angle = mod(angle, ${2*Math.PI});

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_radius)
    gl_FragColor = transparent;
  else {
    gl_FragColor = v_color;
    gl_FragColor.a *= bias;
  }
  #else
  // Colors:
${o.map(({color:n},a)=>{const d=[];return"attribute"in n?d.push(`  vec4 sliceColor_${a+1} = v_sliceColor_${a+1};`):"transparent"in n?d.push(`  vec4 sliceColor_${a+1} = vec4(0.0, 0.0, 0.0, 0.0);`):d.push(`  vec4 sliceColor_${a+1} = u_sliceColor_${a+1};`),d.push(`  sliceColor_${a+1}.a *= bias;`),d.join(`
`)}).join(`
`)}
  vec4 color = u_defaultColor;
  color.a *= bias;

  // Sizes:
${o.map(({value:n},a)=>`  float sliceValue_${a+1} = ${"attribute"in n?`v_sliceValue_${a+1}`:B(n.value)};`).join(`
`)}

  // Angles and final color:
  float total = ${o.map((n,a)=>`sliceValue_${a+1}`).join(" + ")};
  float angle_0 = 0.0;
  if (total > 0.0) {
${o.map((n,a)=>`    float angle_${a+1} = angle_${a} + sliceValue_${a+1} * ${2*Math.PI} / total;`).join(`
`)}
    ${o.map((n,a)=>`if (angle < angle_${a+1}) color = sliceColor_${a+1};`).join(`
    else `)}
  }

  if (dist < v_radius - aaBorder) {
    gl_FragColor = color;
  } else if (dist < v_radius) {
    gl_FragColor = mix(transparent, color, (v_radius - dist) / aaBorder);
  }
  #endif
}
`}function U({slices:o,offset:e}){return`
attribute vec4 a_id;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec2 v_diffVector;
varying float v_radius;

${"attribute"in e?`attribute float a_offset;
`:""}
${"attribute"in e?`varying float v_offset;
`:""}

#ifdef PICKING_MODE
varying vec4 v_color;
#else
${o.flatMap(({value:n},a)=>"attribute"in n?[`attribute float a_sliceValue_${a+1};`,`varying float v_sliceValue_${a+1};`]:[]).join(`
`)}
${o.flatMap(({color:n},a)=>"attribute"in n?[`attribute vec4 a_sliceColor_${a+1};`,`varying vec4 v_sliceColor_${a+1};`]:[]).join(`
`)}
#endif

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main() {
  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  v_radius = size / 2.0;
  v_diffVector = diffVector;
  ${"attribute"in e?`v_offset = a_offset;
`:""}

  #ifdef PICKING_MODE
  v_color = a_id;
  #else
${o.flatMap(({value:n},a)=>"attribute"in n?[`  v_sliceValue_${a+1} = a_sliceValue_${a+1};`]:[]).join(`
`)}
${o.flatMap(({color:n},a)=>"attribute"in n?[`  v_sliceColor_${a+1} = a_sliceColor_${a+1};`]:[]).join(`
`)}
  #endif
}
`}const _="#000000",H={defaultColor:_,offset:{value:0}},{UNSIGNED_BYTE:C,FLOAT:f}=WebGLRenderingContext;function b(o){var d;const e={...H,...o},{slices:t,offset:n}=e,a=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_matrix","u_defaultColor",..."value"in n?["u_offset"]:[],...t.flatMap(({color:p},c)=>"value"in p?[`u_sliceColor_${c+1}`]:[])];return d=class extends F{getDefinition(){return{VERTICES:3,VERTEX_SHADER_SOURCE:U(e),FRAGMENT_SHADER_SOURCE:j(e),METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:a,ATTRIBUTES:[{name:"a_position",size:2,type:f},{name:"a_id",size:4,type:C,normalized:!0},{name:"a_size",size:1,type:f},..."attribute"in n?[{name:"a_offset",size:1,type:f}]:[],...t.flatMap(({color:c},r)=>"attribute"in c?[{name:`a_sliceColor_${r+1}`,size:4,type:C,normalized:!0}]:[]),...t.flatMap(({value:c},r)=>"attribute"in c?[{name:`a_sliceValue_${r+1}`,size:1,type:f}]:[])],CONSTANT_ATTRIBUTES:[{name:"a_angle",size:1,type:f}],CONSTANT_DATA:[[d.ANGLE_1],[d.ANGLE_2],[d.ANGLE_3]]}}processVisibleItem(c,r,s){const i=this.array;i[r++]=s.x,i[r++]=s.y,i[r++]=c,i[r++]=s.size,"attribute"in n&&(i[r++]=s[n.attribute]||0),t.forEach(({color:l})=>{"attribute"in l&&(i[r++]=G(s[l.attribute]||l.defaultValue||_))}),t.forEach(({value:l})=>{"attribute"in l&&(i[r++]=s[l.attribute]||0)})}setUniforms(c,{gl:r,uniformLocations:s}){const{u_sizeRatio:i,u_correctionRatio:l,u_cameraAngle:g,u_matrix:N,u_defaultColor:P}=s;r.uniform1f(l,c.correctionRatio),r.uniform1f(i,c.sizeRatio),r.uniform1f(g,c.cameraAngle),r.uniformMatrix3fv(N,!1,c.matrix),"value"in n&&r.uniform1f(s.u_offset,n.value);const[x,O,$,R]=y(e.defaultColor||_);r.uniform4f(P,x/255,O/255,$/255,R/255),t.forEach(({color:z},S)=>{if("value"in z){const A=s[`u_sliceColor_${S+1}`],[D,L,M,T]=y(z.value);r.uniform4f(A,D/255,L/255,M/255,T/255)}})}},u(d,"ANGLE_1",0),u(d,"ANGLE_2",2*Math.PI/3),u(d,"ANGLE_3",4*Math.PI/3),d}const k=()=>{const o=document.getElementById("sigma-container"),e=new m;e.addNode("a",{x:0,y:0,size:20,label:"A",positive:10,neutral:17,negative:14}),e.addNode("b",{x:1,y:-1,size:40,label:"B",positive:2,neutral:4,negative:1}),e.addNode("c",{x:3,y:-2,size:20,label:"C",positive:0,neutral:8,negative:3}),e.addNode("d",{x:1,y:-3,size:20,label:"D",positive:0,negative:0}),e.addNode("e",{x:3,y:-4,size:40,label:"E",positive:17,neutral:1,negative:3}),e.addNode("f",{x:4,y:-5,size:20,label:"F",neutral:8,negative:4}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const t=b({defaultColor:"#BCB7C4",slices:[{color:{value:"#F05454"},value:{attribute:"negative"}},{color:{value:"#7798FA"},value:{attribute:"neutral"}},{color:{value:"#6DDB55"},value:{attribute:"positive"}}]}),n=new h(e,o,{defaultNodeType:"piechart",nodeProgramClasses:{piechart:t}});v(()=>{n.kill()})},K=`import { createNodePiechartProgram } from "@sigma/node-piechart";
import Graph from "graphology";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
    positive: 10,
    neutral: 17,
    negative: 14,
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    positive: 2,
    neutral: 4,
    negative: 1,
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    positive: 0,
    neutral: 8,
    negative: 3,
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    positive: 0,
    negative: 0,
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    positive: 17,
    neutral: 1,
    negative: 3,
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    neutral: 8,
    negative: 4,
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const NodePiechartProgram = createNodePiechartProgram({
    defaultColor: "#BCB7C4",
    slices: [
      { color: { value: "#F05454" }, value: { attribute: "negative" } },
      { color: { value: "#7798FA" }, value: { attribute: "neutral" } },
      { color: { value: "#6DDB55" }, value: { attribute: "positive" } },
    ],
  });
  const renderer = new Sigma(graph, container, {
    defaultNodeType: "piechart",
    nodeProgramClasses: {
      piechart: NodePiechartProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,W=()=>{const o=document.getElementById("sigma-container"),e=new m,t="#956b5e",n="#ff44de",a="#71db97",d="#ff813b";e.addNode("a",{x:0,y:0,size:20,label:"A",colors:[t]}),e.addNode("b",{x:1,y:-1,size:40,label:"B",colors:[t,n,a]}),e.addNode("c",{x:3,y:-2,size:20,label:"C",colors:[n]}),e.addNode("d",{x:1,y:-3,size:20,label:"D",colors:[n,a]}),e.addNode("e",{x:3,y:-4,size:40,label:"E",colors:[n,a,d]}),e.addNode("f",{x:4,y:-5,size:20,label:"F",colors:[d]}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const p=Math.max(...e.mapNodes((s,{colors:i})=>i.length)),c={...w};for(let s=2;s<=p;s++){const i=[{color:{attribute:"color"},value:{value:1}}];for(let l=1;l<s;l++)i.push({color:{attribute:`color-${l}`},value:{value:1}});c[`pie-${s}`]=b({slices:i})}const r=new h(e,o,{nodeProgramClasses:c,nodeReducer:(s,i)=>{const l=i.colors;i.type=l.length<=1?"circle":`pie-${l.length}`,i.color=l[0];for(let g=1;g<l.length;g++)i[`color-${g}`]=l[g];return i}});v(()=>{r.kill()})},X=`import { CreateNodePiechartProgramOptions, createNodePiechartProgram } from "@sigma/node-piechart";
import Graph from "graphology";
import Sigma from "sigma";
import { DEFAULT_NODE_PROGRAM_CLASSES } from "sigma/settings";
import { NodeDisplayData } from "sigma/types";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph<Partial<NodeDisplayData> & { colors: string[] }>();

  const COLOR_1 = "#956b5e";
  const COLOR_2 = "#ff44de";
  const COLOR_3 = "#71db97";
  const COLOR_4 = "#ff813b";

  // This example shows how to render nodes that have multiple colors:
  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
    colors: [COLOR_1],
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    colors: [COLOR_1, COLOR_2, COLOR_3],
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    colors: [COLOR_2],
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    colors: [COLOR_2, COLOR_3],
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    colors: [COLOR_2, COLOR_3, COLOR_4],
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    colors: [COLOR_4],
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const maxCount = Math.max(...graph.mapNodes((_, { colors }) => colors.length));
  const nodeProgramClasses = { ...DEFAULT_NODE_PROGRAM_CLASSES };

  for (let i = 2; i <= maxCount; i++) {
    const slices: CreateNodePiechartProgramOptions["slices"] = [{ color: { attribute: "color" }, value: { value: 1 } }];
    for (let j = 1; j < i; j++) slices.push({ color: { attribute: \`color-\${j}\` }, value: { value: 1 } });
    nodeProgramClasses[\`pie-\${i}\`] = createNodePiechartProgram({
      slices,
    });
  }
  const renderer = new Sigma(graph, container, {
    nodeProgramClasses,
    nodeReducer: (_, data) => {
      const colors = data.colors as string[];
      data.type = colors.length <= 1 ? "circle" : \`pie-\${colors.length}\`;
      data.color = colors[0];
      for (let i = 1; i < colors.length; i++) data[\`color-\${i}\` as "color"] = colors[i];
      return data;
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,E=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
<div id="sigma-container"></div>
`,Y=()=>{const o=document.getElementById("sigma-container"),e=new m;e.addNode("a",{x:0,y:0,size:20,label:"A"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",offset:Math.PI/3}),e.addNode("c",{x:3,y:-2,size:20,label:"C",offset:Math.PI/2}),e.addNode("d",{x:1,y:-3,size:20,label:"D",offset:Math.PI}),e.addNode("e",{x:3,y:-4,size:40,label:"E",offset:Math.PI*2/3}),e.addNode("f",{x:4,y:-5,size:20,label:"F",offset:Math.PI*3/2}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const t=b({defaultColor:"#BCB7C4",offset:{attribute:"offset"},slices:[{color:{value:"yellow"},value:{value:1}},{color:{value:"orange"},value:{value:1}}]}),n=new h(e,o,{defaultNodeType:"piechart",nodeProgramClasses:{piechart:t}});v(()=>{n.kill()})},q=`import { createNodePiechartProgram } from "@sigma/node-piechart";
import Graph from "graphology";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    offset: Math.PI / 3,
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    offset: Math.PI / 2,
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    offset: Math.PI,
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    offset: (Math.PI * 2) / 3,
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    offset: (Math.PI * 3) / 2,
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const NodePiechartProgram = createNodePiechartProgram({
    defaultColor: "#BCB7C4",
    offset: { attribute: "offset" },
    slices: [
      { color: { value: "yellow" }, value: { value: 1 } },
      { color: { value: "orange" }, value: { value: 1 } },
    ],
  });
  const renderer = new Sigma(graph, container, {
    defaultNodeType: "piechart",
    nodeProgramClasses: {
      piechart: NodePiechartProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,ee={id:"node-piechart",title:"node-piechart"},ae={name:"Fixed colors, varying values",render:()=>E,play:k,args:{},parameters:{storySource:{source:K}}},ne={name:"Fixed values, varying colors",render:()=>E,play:W,args:{},parameters:{storySource:{source:X}}},oe={name:"Varying offsets",render:()=>E,play:Y,args:{},parameters:{storySource:{source:q}}};export{ee as default,ae as fixedColors,ne as fixedValues,oe as offsets};
