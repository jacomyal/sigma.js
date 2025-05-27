import{G as d,S as r,a as s,w as o}from"./sigma-BsJT_GRv.js";import{N as i}from"./program-CjPoEhGo.js";import"./_commonjsHelpers-C4iS2aBk.js";const g=`<style>
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
`,t=()=>{const a=document.getElementById("sigma-container"),e=new d;e.addNode("a",{x:0,y:0,size:20,label:"A"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",type:"square"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",type:"square"}),e.addNode("d",{x:1,y:-3,size:20,label:"D"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",type:"square"}),e.addNode("f",{x:4,y:-5,size:20,label:"F"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const n=new r(e,a,{nodeProgramClasses:{...s,square:i}});return()=>{n.kill()}},m=`import { NodeSquareProgram } from "@sigma/node-square";
import Graph from "graphology";
import Sigma from "sigma";
import { DEFAULT_NODE_PROGRAM_CLASSES } from "sigma/settings";

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
    type: "square",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    type: "square",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    type: "square",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
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
    nodeProgramClasses: {
      ...DEFAULT_NODE_PROGRAM_CLASSES,
      square: NodeSquareProgram,
    },
  });

  return () => {
    renderer.kill();
  };
};
`,E={id:"@sigma/node-square",title:"Satellite packages/@sigma--node-square"},z={name:"Mixed programs",render:()=>g,play:o(t),args:{},parameters:{storySource:{source:m}}};export{E as default,z as mixedPrograms};
