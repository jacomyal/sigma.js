var B=Object.defineProperty;var $=(n,e,d)=>e in n?B(n,e,{enumerable:!0,configurable:!0,writable:!0,value:d}):n[e]=d;var g=(n,e,d)=>($(n,typeof e!="symbol"?e+"":e,d),d);import{n as h,N as P,f as D,d as R,G as p,S as m,o as u,c as T}from"./utils-Bhbjx1g-.js";import{g as A}from"./factory-CzukJLPY.js";import"./_commonjsHelpers-BosuxZz1.js";const z=`<style>
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
`,M="relative",k={borders:[{size:{value:.1},color:{attribute:"borderColor"}},{size:{fill:!0},color:{attribute:"color"}}]},I="#000000";function G({borders:n}){const e=h(n.filter(({size:r})=>"fill"in r).length);return`
precision highp float;

varying vec2 v_diffVector;
varying float v_radius;

#ifdef PICKING_MODE
varying vec4 v_color;
#else
// For normal mode, we use the border colors defined in the program:
${n.flatMap(({size:r},o)=>"attribute"in r?[`varying float v_borderSize_${o+1};`]:[]).join(`
`)}
${n.flatMap(({color:r},o)=>"attribute"in r?[`varying vec4 v_borderColor_${o+1};`]:"value"in r?[`uniform vec4 u_borderColor_${o+1};`]:[]).join(`
`)}
#endif

uniform float u_correctionRatio;

const float bias = 255.0 / 254.0;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_diffVector);
  float aaBorder = 2.0 * u_correctionRatio;
  float v_borderSize_0 = v_radius;
  vec4 v_borderColor_0 = transparent;

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_radius)
    gl_FragColor = transparent;
  else {
    gl_FragColor = v_color;
    gl_FragColor.a *= bias;
  }
  #else
  // Sizes:
${n.flatMap(({size:r},o)=>{if("fill"in r)return[];r=r;const t="attribute"in r?`v_borderSize_${o+1}`:h(r.value),i=(r.mode||M)==="pixels"?"u_correctionRatio":"v_radius";return[`  float borderSize_${o+1} = ${i} * ${t};`]}).join(`
`)}
  // Now, let's split the remaining space between "fill" borders:
  float fillBorderSize = (v_radius - (${n.flatMap(({size:r},o)=>"fill"in r?[]:[`borderSize_${o+1}`]).join(" + ")}) ) / ${e};
${n.flatMap(({size:r},o)=>"fill"in r?[`  float borderSize_${o+1} = fillBorderSize;`]:[]).join(`
`)}

  // Finally, normalize all border sizes, to start from the full size and to end with the smallest:
  float adjustedBorderSize_0 = v_radius;
${n.map((r,o)=>`  float adjustedBorderSize_${o+1} = adjustedBorderSize_${o} - borderSize_${o+1};`).join(`
`)}

  // Colors:
  vec4 borderColor_0 = transparent;
${n.map(({color:r},o)=>{const t=[];return"attribute"in r?t.push(`  vec4 borderColor_${o+1} = v_borderColor_${o+1};`):"transparent"in r?t.push(`  vec4 borderColor_${o+1} = vec4(0.0, 0.0, 0.0, 0.0);`):t.push(`  vec4 borderColor_${o+1} = u_borderColor_${o+1};`),t.push(`  borderColor_${o+1}.a *= bias;`),t.push(`  if (borderSize_${o+1} <= 1.0 * u_correctionRatio) { borderColor_${o+1} = borderColor_${o}; }`),t.join(`
`)}).join(`
`)}
  if (dist > adjustedBorderSize_0) {
    gl_FragColor = borderColor_0;
  } else ${n.map((r,o)=>`if (dist > adjustedBorderSize_${o} - aaBorder) {
    gl_FragColor = mix(borderColor_${o+1}, borderColor_${o}, (dist - adjustedBorderSize_${o} + aaBorder) / aaBorder);
  } else if (dist > adjustedBorderSize_${o+1}) {
    gl_FragColor = borderColor_${o+1};
  } else `).join("")} { /* Nothing to add here */ }
  #endif
}
`}function F({borders:n}){return`
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec2 v_diffVector;
varying float v_radius;

#ifdef PICKING_MODE
attribute vec4 a_id;
varying vec4 v_color;
#else
${n.flatMap(({size:d},r)=>"attribute"in d?[`attribute float a_borderSize_${r+1};`,`varying float v_borderSize_${r+1};`]:[]).join(`
`)}
${n.flatMap(({color:d},r)=>"attribute"in d?[`attribute vec4 a_borderColor_${r+1};`,`varying vec4 v_borderColor_${r+1};`]:[]).join(`
`)}
#endif

const float bias = 255.0 / 254.0;
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

  #ifdef PICKING_MODE
  v_color = a_id;
  #else
${n.flatMap(({size:d},r)=>"attribute"in d?[`  v_borderSize_${r+1} = a_borderSize_${r+1};`]:[]).join(`
`)}
${n.flatMap(({color:d},r)=>"attribute"in d?[`  v_borderColor_${r+1} = a_borderColor_${r+1};`]:[]).join(`
`)}
  #endif
}
`}const{UNSIGNED_BYTE:_,FLOAT:b}=WebGLRenderingContext;function f(n){var o;const e={...k,...n||{}},{borders:d}=e,r=["u_sizeRatio","u_correctionRatio","u_matrix",...d.flatMap(({color:t},i)=>"value"in t?[`u_borderColor_${i+1}`]:[])];return o=class extends P{getDefinition(){return{VERTICES:3,VERTEX_SHADER_SOURCE:F(e),FRAGMENT_SHADER_SOURCE:G(e),METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:r,ATTRIBUTES:[{name:"a_position",size:2,type:b},{name:"a_id",size:4,type:_,normalized:!0},{name:"a_size",size:1,type:b},...d.flatMap(({color:i},a)=>"attribute"in i?[{name:`a_borderColor_${a+1}`,size:4,type:_,normalized:!0}]:[]),...d.flatMap(({size:i},a)=>"attribute"in i?[{name:`a_borderSize_${a+1}`,size:1,type:b}]:[])],CONSTANT_ATTRIBUTES:[{name:"a_angle",size:1,type:b}],CONSTANT_DATA:[[o.ANGLE_1],[o.ANGLE_2],[o.ANGLE_3]]}}processVisibleItem(i,a,s){const c=this.array;c[a++]=s.x,c[a++]=s.y,c[a++]=i,c[a++]=s.size,d.forEach(({color:l})=>{"attribute"in l&&(c[a++]=D(s[l.attribute]||l.defaultValue||I))}),d.forEach(({size:l})=>{"attribute"in l&&(c[a++]=s[l.attribute]||l.defaultValue)})}setUniforms(i,{gl:a,uniformLocations:s}){const{u_sizeRatio:c,u_correctionRatio:l,u_matrix:E}=s;a.uniform1f(l,i.correctionRatio),a.uniform1f(c,i.sizeRatio),a.uniformMatrix3fv(E,!1,i.matrix),d.forEach(({color:C},y)=>{if("value"in C){const N=s[`u_borderColor_${y+1}`],[v,S,x,w]=R(C.value);a.uniform4f(N,v/255,S/255,x/255,w/255)}})}},g(o,"ANGLE_1",0),g(o,"ANGLE_2",2*Math.PI/3),g(o,"ANGLE_3",4*Math.PI/3),o}const j=f(),L=()=>{const n=document.getElementById("sigma-container"),e=new p;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",borderColor:"red"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",borderColor:"red"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"yellow",borderColor:"red"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"pink",borderColor:"blue"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"pink",borderColor:"blue"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"yellow",borderColor:"blue"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const d=new m(e,n,{defaultNodeType:"bordered",nodeProgramClasses:{bordered:j}});u(()=>{d.kill()})},O=`import { NodeBorderProgram } from "@sigma/node-border";
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
    color: "pink",
    borderColor: "red",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    color: "yellow",
    borderColor: "red",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    color: "yellow",
    borderColor: "red",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    color: "pink",
    borderColor: "blue",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    color: "pink",
    borderColor: "blue",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    color: "yellow",
    borderColor: "blue",
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

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "bordered",
    nodeProgramClasses: {
      bordered: NodeBorderProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,V=()=>{const n=document.getElementById("sigma-container"),e=new p;e.addNode("a",{x:0,y:0,size:20,label:"A",borderColor:"blue",fillColor:"white",dotColor:"red"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",borderColor:"purple",fillColor:"white",dotColor:"red"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",borderColor:"purple",fillColor:"white",dotColor:"red"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",borderColor:"blue",fillColor:"white",dotColor:"green"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",borderColor:"blue",fillColor:"white",dotColor:"green"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",borderColor:"purple",fillColor:"white",dotColor:"green"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const d=new m(e,n,{defaultNodeType:"bordered",nodeProgramClasses:{bordered:f({borders:[{size:{value:10,mode:"pixels"},color:{attribute:"borderColor"}},{size:{fill:!0},color:{attribute:"fillColor"}},{size:{value:20,mode:"pixels"},color:{attribute:"dotColor"}}]})}});u(()=>{d.kill()})},H=`import { createNodeBorderProgram } from "@sigma/node-border";
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
    borderColor: "blue",
    fillColor: "white",
    dotColor: "red",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    borderColor: "purple",
    fillColor: "white",
    dotColor: "red",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    borderColor: "purple",
    fillColor: "white",
    dotColor: "red",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    borderColor: "blue",
    fillColor: "white",
    dotColor: "green",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    borderColor: "blue",
    fillColor: "white",
    dotColor: "green",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    borderColor: "purple",
    fillColor: "white",
    dotColor: "green",
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

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "bordered",
    nodeProgramClasses: {
      bordered: createNodeBorderProgram({
        borders: [
          { size: { value: 10, mode: "pixels" }, color: { attribute: "borderColor" } },
          { size: { fill: true }, color: { attribute: "fillColor" } },
          { size: { value: 20, mode: "pixels" }, color: { attribute: "dotColor" } },
        ],
      }),
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,U=()=>{const n=document.getElementById("sigma-container"),e=new p;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",borderColor:"red"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",borderColor:"red"}),e.addNode("c",{x:3,y:-2,size:20,borderSize:.8,label:"C",color:"yellow",borderColor:"red"}),e.addNode("d",{x:1,y:-3,size:20,borderSize:.8,label:"D",color:"pink",borderColor:"blue"}),e.addNode("e",{x:3,y:-4,size:40,borderSize:.2,label:"E",color:"pink",borderColor:"blue"}),e.addNode("f",{x:4,y:-5,size:20,borderSize:.2,label:"F",color:"yellow",borderColor:"blue"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const d=new m(e,n,{defaultNodeType:"bordered",nodeProgramClasses:{bordered:f({borders:[{size:{attribute:"borderSize",defaultValue:.5},color:{attribute:"borderColor"}},{size:{fill:!0},color:{attribute:"color"}}]})}});u(()=>{d.kill()})},K=`import { createNodeBorderProgram } from "@sigma/node-border";
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
    color: "pink",
    borderColor: "red",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    color: "yellow",
    borderColor: "red",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    borderSize: 0.8,
    label: "C",
    color: "yellow",
    borderColor: "red",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    borderSize: 0.8,
    label: "D",
    color: "pink",
    borderColor: "blue",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    borderSize: 0.2,
    label: "E",
    color: "pink",
    borderColor: "blue",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    borderSize: 0.2,
    label: "F",
    color: "yellow",
    borderColor: "blue",
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

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "bordered",
    nodeProgramClasses: {
      bordered: createNodeBorderProgram({
        borders: [
          { size: { attribute: "borderSize", defaultValue: 0.5 }, color: { attribute: "borderColor" } },
          { size: { fill: true }, color: { attribute: "color" } },
        ],
      }),
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,W=()=>{const n=document.getElementById("sigma-container"),e=new p;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/person.svg"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/chat.svg"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"yellow",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const d=f({borders:[{size:{value:.1},color:{attribute:"pictoColor"}},{size:{fill:!0},color:{attribute:"color"}}]}),r=A({padding:.3,size:{mode:"force",value:256},drawingMode:"color",colorAttribute:"pictoColor"}),o=T([d,r]),t=new m(e,n,{defaultNodeType:"pictogram",nodeProgramClasses:{pictogram:o}});u(()=>{t.kill()})},X=`import { createNodeBorderProgram } from "@sigma/node-border";
import { createNodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";
import { createNodeCompoundProgram } from "sigma/rendering";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
    color: "pink",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/person.svg",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    color: "yellow",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    color: "yellow",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/chat.svg",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    color: "pink",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    color: "pink",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    color: "yellow",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
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

  const NodeBorderCustomProgram = createNodeBorderProgram({
    borders: [
      { size: { value: 0.1 }, color: { attribute: "pictoColor" } },
      { size: { fill: true }, color: { attribute: "color" } },
    ],
  });

  const NodePictogramCustomProgram = createNodeImageProgram({
    padding: 0.3,
    size: { mode: "force", value: 256 },
    drawingMode: "color",
    colorAttribute: "pictoColor",
  });

  const NodeProgram = createNodeCompoundProgram([NodeBorderCustomProgram, NodePictogramCustomProgram]);

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "pictogram",
    nodeProgramClasses: {
      pictogram: NodeProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,Q={id:"node-border",title:"node-border"},ee={name:"NodeBorderProgram",render:()=>z,play:L,args:{},parameters:{storySource:{source:O}}},oe={name:'"pixels" mode for border sizes',render:()=>z,play:V,args:{},parameters:{storySource:{source:H}}},re={name:"Combined with images",render:()=>z,play:W,args:{},parameters:{storySource:{source:X}}},ne={name:"Variable border sizes",render:()=>z,play:U,args:{},parameters:{storySource:{source:K}}};export{Q as default,ee as nodeBorder,oe as pixelsBorder,ne as variableSizes,re as withImages};
