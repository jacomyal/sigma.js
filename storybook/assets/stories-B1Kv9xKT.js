import{G as l,S as d,w as c}from"./sigma-OLFhweM6.js";import{c as m}from"./chroma-CrraTPB2.js";import{N as h}from"./program-DwKUPjEP.js";import"./_commonjsHelpers-BosuxZz1.js";const p=()=>{const a=document.getElementById("sigma-container"),n=new l,s=m.scale(["yellow","navy"]).mode("lch"),t=20;for(let e=0;e<t;e++)for(let o=0;o<t;o++){const i=s((o+e)/(t*2)).hex();n.addNode(`${e}/${o}`,{x:20*o,y:20*e,size:5,color:i}),e>=1&&n.addEdge(`${e-1}/${o}`,`${e}/${o}`,{size:10}),o>=1&&n.addEdge(`${e}/${o-1}`,`${e}/${o}`,{size:10})}const r=new d(n,a,{itemSizesReference:"positions",zoomToSizeRatioFunction:e=>e,autoRescale:!1,defaultNodeType:"square",nodeProgramClasses:{square:h}});return()=>{r.kill()}},g=`<style>
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
`,f=`/**
 * Sigma has been designed to display any graph in a "readable way" by default:
 * https://www.sigmajs.org/docs/advanced/coordinate-systems
 *
 * This design principle is enforced by three main features:
 * 1. Graph is rescaled and centered to fit by default in the viewport
 * 2. Node sizes are interpolated by default to fit in a pixels range,
 *    independent of the viewport (and not correlated to the nodes positions)
 * 3. When users scroll into the graph, the node sizes do not scale with the
 *    zoom ratio, but with its square root instead
 *
 * In some cases, it is better to disable these features, to have better
 * control over the way nodes are displayed on screen.
 *
 * This example shows how to disable these three features.
 */
import { NodeSquareProgram } from "@sigma/node-square";
import chroma from "chroma-js";
import Graph from "graphology";
import Sigma from "sigma";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Let's first build a graph that will look like a perfect grid:
  const graph = new Graph();
  const colorScale = chroma.scale(["yellow", "navy"]).mode("lch");
  const GRID_SIZE = 20;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const color = colorScale((col + row) / (GRID_SIZE * 2)).hex();
      graph.addNode(\`\${row}/\${col}\`, {
        x: 20 * col,
        y: 20 * row,
        size: 5,
        color,
      });

      if (row >= 1) graph.addEdge(\`\${row - 1}/\${col}\`, \`\${row}/\${col}\`, { size: 10 });
      if (col >= 1) graph.addEdge(\`\${row}/\${col - 1}\`, \`\${row}/\${col}\`, { size: 10 });
    }
  }

  const renderer = new Sigma(graph, container, {
    // This flag tells sigma to disable the nodes and edges sizes interpolation
    // and instead scales them in the same way it handles positions:
    itemSizesReference: "positions",
    // This function tells sigma to grow sizes linearly with the zoom, instead
    // of relatively to the zoom ratio's square root:
    zoomToSizeRatioFunction: (x) => x,
    // This disables the default sigma rescaling, so that by default, positions
    // and sizes are preserved on screen (in pixels):
    autoRescale: false,
    // Finally, let's indicate that we want square nodes, to get a perfect
    // grid:
    defaultNodeType: "square",
    nodeProgramClasses: {
      square: NodeSquareProgram,
    },
  });

  return () => {
    renderer.kill();
  };
};
`,z={id:"fit-sizes-to-positions",title:"Core library/Advanced use cases"},$={name:"Disable sigma's autoRescale features",render:()=>g,play:c(p),args:{},parameters:{storySource:{source:f}}};export{z as default,$ as story};
