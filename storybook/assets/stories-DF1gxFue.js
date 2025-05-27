var R=Object.defineProperty;var T=(d,e,n)=>e in d?R(d,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):d[e]=n;var b=(d,e,n)=>T(d,typeof e!="symbol"?e+"":e,n);import{n as E,N as A,f as k,c as D,G as m,S as u,h as M,w as z}from"./sigma-BsJT_GRv.js";import{c as I}from"./factory-C5ffFMeX.js";import"./_commonjsHelpers-C4iS2aBk.js";const f=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }
</style>
<div id="sigma-container"></div>
`,G="relative",F={drawLabel:void 0,drawHover:void 0,borders:[{size:{value:.1},color:{attribute:"borderColor"}},{size:{fill:!0},color:{attribute:"color"}}]},L="#000000";function j({borders:d}){const e=E(d.filter(({size:o})=>"fill"in o).length);return`
precision highp float;

varying vec2 v_diffVector;
varying float v_radius;

#ifdef PICKING_MODE
varying vec4 v_color;
#else
// For normal mode, we use the border colors defined in the program:
${d.flatMap(({size:o},r)=>"attribute"in o?[`varying float v_borderSize_${r+1};`]:[]).join(`
`)}
${d.flatMap(({color:o},r)=>"attribute"in o?[`varying vec4 v_borderColor_${r+1};`]:"value"in o?[`uniform vec4 u_borderColor_${r+1};`]:[]).join(`
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
${d.flatMap(({size:o},r)=>{if("fill"in o)return[];o=o;const t="attribute"in o?`v_borderSize_${r+1}`:E(o.value),i=(o.mode||G)==="pixels"?"u_correctionRatio":"v_radius";return[`  float borderSize_${r+1} = ${i} * ${t};`]}).join(`
`)}
  // Now, let's split the remaining space between "fill" borders:
  float fillBorderSize = (v_radius - (${d.flatMap(({size:o},r)=>"fill"in o?[]:[`borderSize_${r+1}`]).join(" + ")}) ) / ${e};
${d.flatMap(({size:o},r)=>"fill"in o?[`  float borderSize_${r+1} = fillBorderSize;`]:[]).join(`
`)}

  // Finally, normalize all border sizes, to start from the full size and to end with the smallest:
  float adjustedBorderSize_0 = v_radius;
${d.map((o,r)=>`  float adjustedBorderSize_${r+1} = adjustedBorderSize_${r} - borderSize_${r+1};`).join(`
`)}

  // Colors:
  vec4 borderColor_0 = transparent;
${d.map(({color:o},r)=>{const t=[];return"attribute"in o?t.push(`  vec4 borderColor_${r+1} = v_borderColor_${r+1};`):"transparent"in o?t.push(`  vec4 borderColor_${r+1} = vec4(0.0, 0.0, 0.0, 0.0);`):t.push(`  vec4 borderColor_${r+1} = u_borderColor_${r+1};`),t.push(`  borderColor_${r+1}.a *= bias;`),t.push(`  if (borderSize_${r+1} <= 1.0 * u_correctionRatio) { borderColor_${r+1} = borderColor_${r}; }`),t.join(`
`)}).join(`
`)}
  if (dist > adjustedBorderSize_0) {
    gl_FragColor = borderColor_0;
  } else ${d.map((o,r)=>`if (dist > adjustedBorderSize_${r} - aaBorder) {
    gl_FragColor = mix(borderColor_${r+1}, borderColor_${r}, (dist - adjustedBorderSize_${r} + aaBorder) / aaBorder);
  } else if (dist > adjustedBorderSize_${r+1}) {
    gl_FragColor = borderColor_${r+1};
  } else `).join("")} { /* Nothing to add here */ }
  #endif
}
`}function O({borders:d}){return`
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
${d.flatMap(({size:n},o)=>"attribute"in n?[`attribute float a_borderSize_${o+1};`,`varying float v_borderSize_${o+1};`]:[]).join(`
`)}
${d.flatMap(({color:n},o)=>"attribute"in n?[`attribute vec4 a_borderColor_${o+1};`,`varying vec4 v_borderColor_${o+1};`]:[]).join(`
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
${d.flatMap(({size:n},o)=>"attribute"in n?[`  v_borderSize_${o+1} = a_borderSize_${o+1};`]:[]).join(`
`)}
${d.flatMap(({color:n},o)=>"attribute"in n?[`  v_borderColor_${o+1} = a_borderColor_${o+1};`]:[]).join(`
`)}
  #endif
}
`}const{UNSIGNED_BYTE:y,FLOAT:p}=WebGLRenderingContext;function C(d){var i;const e={...F,...d||{}},{borders:n,drawLabel:o,drawHover:r}=e,t=["u_sizeRatio","u_correctionRatio","u_matrix",...n.flatMap(({color:N},h)=>"value"in N?[`u_borderColor_${h+1}`]:[])];return i=class extends A{constructor(){super(...arguments);b(this,"drawLabel",o);b(this,"drawHover",r)}getDefinition(){return{VERTICES:3,VERTEX_SHADER_SOURCE:O(e),FRAGMENT_SHADER_SOURCE:j(e),METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:t,ATTRIBUTES:[{name:"a_position",size:2,type:p},{name:"a_id",size:4,type:y,normalized:!0},{name:"a_size",size:1,type:p},...n.flatMap(({color:l},a)=>"attribute"in l?[{name:`a_borderColor_${a+1}`,size:4,type:y,normalized:!0}]:[]),...n.flatMap(({size:l},a)=>"attribute"in l?[{name:`a_borderSize_${a+1}`,size:1,type:p}]:[])],CONSTANT_ATTRIBUTES:[{name:"a_angle",size:1,type:p}],CONSTANT_DATA:[[i.ANGLE_1],[i.ANGLE_2],[i.ANGLE_3]]}}processVisibleItem(l,a,c){const g=this.array;g[a++]=c.x,g[a++]=c.y,g[a++]=l,g[a++]=c.size,n.forEach(({color:s})=>{"attribute"in s&&(g[a++]=k(c[s.attribute]||s.defaultValue||L))}),n.forEach(({size:s})=>{"attribute"in s&&(g[a++]=c[s.attribute]||s.defaultValue)})}setUniforms(l,{gl:a,uniformLocations:c}){const{u_sizeRatio:g,u_correctionRatio:s,u_matrix:v}=c;a.uniform1f(s,l.correctionRatio),a.uniform1f(g,l.sizeRatio),a.uniformMatrix3fv(v,!1,l.matrix),n.forEach(({color:_},S)=>{if("value"in _){const x=c[`u_borderColor_${S+1}`],[w,B,$,P]=D(_.value);a.uniform4f(x,w/255,B/255,$/255,P/255)}})}},b(i,"ANGLE_1",0),b(i,"ANGLE_2",2*Math.PI/3),b(i,"ANGLE_3",4*Math.PI/3),i}const V=C(),H=()=>{const d=document.getElementById("sigma-container"),e=new m;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",borderColor:"red"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",borderColor:"red"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"yellow",borderColor:"red"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"pink",borderColor:"blue"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"pink",borderColor:"blue"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"yellow",borderColor:"blue"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const n=new u(e,d,{defaultNodeType:"bordered",nodeProgramClasses:{bordered:V}});return()=>{n.kill()}},U=`import { NodeBorderProgram } from "@sigma/node-border";
import Graph from "graphology";
import Sigma from "sigma";

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

  return () => {
    renderer.kill();
  };
};
`,K=()=>{const d=document.getElementById("sigma-container"),e=new m;e.addNode("a",{x:0,y:0,size:20,label:"A",borderColor:"blue",fillColor:"white",dotColor:"red"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",borderColor:"purple",fillColor:"white",dotColor:"red"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",borderColor:"purple",fillColor:"white",dotColor:"red"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",borderColor:"blue",fillColor:"white",dotColor:"green"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",borderColor:"blue",fillColor:"white",dotColor:"green"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",borderColor:"purple",fillColor:"white",dotColor:"green"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const n=new u(e,d,{defaultNodeType:"bordered",nodeProgramClasses:{bordered:C({borders:[{size:{value:10,mode:"pixels"},color:{attribute:"borderColor"}},{size:{fill:!0},color:{attribute:"fillColor"}},{size:{value:20,mode:"pixels"},color:{attribute:"dotColor"}}]})}});return()=>{n.kill()}},W=`import { createNodeBorderProgram } from "@sigma/node-border";
import Graph from "graphology";
import Sigma from "sigma";

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

  return () => {
    renderer.kill();
  };
};
`,X=()=>{const d=document.getElementById("sigma-container"),e=new m;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",borderColor:"red"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",borderColor:"red"}),e.addNode("c",{x:3,y:-2,size:20,borderSize:.8,label:"C",color:"yellow",borderColor:"red"}),e.addNode("d",{x:1,y:-3,size:20,borderSize:.8,label:"D",color:"pink",borderColor:"blue"}),e.addNode("e",{x:3,y:-4,size:40,borderSize:.2,label:"E",color:"pink",borderColor:"blue"}),e.addNode("f",{x:4,y:-5,size:20,borderSize:.2,label:"F",color:"yellow",borderColor:"blue"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const n=new u(e,d,{defaultNodeType:"bordered",nodeProgramClasses:{bordered:C({borders:[{size:{attribute:"borderSize",defaultValue:.5},color:{attribute:"borderColor"}},{size:{fill:!0},color:{attribute:"color"}}]})}});return()=>{n.kill()}},Y=`import { createNodeBorderProgram } from "@sigma/node-border";
import Graph from "graphology";
import Sigma from "sigma";

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

  return () => {
    renderer.kill();
  };
};
`,Z=()=>{const d=document.getElementById("sigma-container"),e=new m;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/person.svg"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/chat.svg"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"yellow",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const n=C({borders:[{size:{value:.1},color:{attribute:"pictoColor"}},{size:{fill:!0},color:{attribute:"color"}}]}),o=I({padding:.3,size:{mode:"force",value:256},drawingMode:"color",colorAttribute:"pictoColor"}),r=M([n,o]),t=new u(e,d,{defaultNodeType:"pictogram",nodeProgramClasses:{pictogram:r}});return()=>{t.kill()}},q=`import { createNodeBorderProgram } from "@sigma/node-border";
import { createNodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";
import { createNodeCompoundProgram } from "sigma/rendering";

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

  return () => {
    renderer.kill();
  };
};
`,re={id:"@sigma/node-border",title:"Satellite packages/@sigma--node-border"},de={name:"NodeBorderProgram",render:()=>f,play:z(H),args:{},parameters:{storySource:{source:U}}},ne={name:'"pixels" mode for border sizes',render:()=>f,play:z(K),args:{},parameters:{storySource:{source:W}}},ae={name:"Combined with images",render:()=>f,play:z(Z),args:{},parameters:{storySource:{source:q}}},ie={name:"Variable border sizes",render:()=>f,play:z(X),args:{},parameters:{storySource:{source:Y}}};export{re as default,de as nodeBorder,ne as pixelsBorder,ie as variableSizes,ae as withImages};
