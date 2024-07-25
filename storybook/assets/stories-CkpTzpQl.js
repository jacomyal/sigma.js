import{G as i,S as r,o as l}from"./utils-Ph0PoCvK.js";import"./_commonjsHelpers-BosuxZz1.js";const d=()=>{const n=document.getElementById("sigma-container"),e=new i;e.addNode("Andrea",{x:0,y:0,size:6,label:"Andrea",color:"blue"}),e.addNode("Bill",{x:10,y:0,size:4,label:"Bill",color:"red"}),e.addNode("Carole",{x:10,y:10,size:6,label:"Carole",color:"green"}),e.addNode("Daniel",{x:0,y:10,size:4,label:"Daniel",color:"purple"}),e.addEdge("Andrea","Bill",{size:12}),e.addEdge("Bill","Carole",{size:12}),e.addEdge("Carole","Daniel",{size:8}),e.addEdge("Daniel","Andrea",{size:8});const o=new r(e,n,{itemSizesReference:"positions",zoomToSizeRatioFunction:a=>a});l(()=>{o.kill()})},s=`<style>
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
`,t=`/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */
import Graph from "graphology";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("Andrea", { x: 0, y: 0, size: 6, label: "Andrea", color: "blue" });
  graph.addNode("Bill", { x: 10, y: 0, size: 4, label: "Bill", color: "red" });
  graph.addNode("Carole", { x: 10, y: 10, size: 6, label: "Carole", color: "green" });
  graph.addNode("Daniel", { x: 0, y: 10, size: 4, label: "Daniel", color: "purple" });

  graph.addEdge("Andrea", "Bill", { size: 12 });
  graph.addEdge("Bill", "Carole", { size: 12 });
  graph.addEdge("Carole", "Daniel", { size: 8 });
  graph.addEdge("Daniel", "Andrea", { size: 8 });

  const renderer = new Sigma(graph, container, {
    itemSizesReference: "positions",
    zoomToSizeRatioFunction: (x) => x,
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,m={id:"fit-sizes-to-positions",title:"Examples"},p={name:"Fit sizes to positions",render:()=>s,play:d,args:{},parameters:{storySource:{source:t}}};export{m as default,p as story};
