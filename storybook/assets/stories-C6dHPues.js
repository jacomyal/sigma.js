import{G as g,S as h,D as c,w as p}from"./sigma-BsJT_GRv.js";import{c as S}from"./index-DUfPS_J0.js";import{N as z}from"./program-CjPoEhGo.js";import"./_commonjsHelpers-C4iS2aBk.js";const R=()=>{const d=document.getElementById("sigma-container"),t=new g,l=S.scale(["yellow","navy"]).mode("lch"),i=20;for(let e=0;e<i;e++)for(let n=0;n<i;n++){const f=l((n+e)/(i*2)).hex();t.addNode(`${e}/${n}`,{x:20*n,y:20*e,size:5,color:f}),e>=1&&t.addEdge(`${e-1}/${n}`,`${e}/${n}`,{size:10}),n>=1&&t.addEdge(`${e}/${n-1}`,`${e}/${n}`,{size:10})}const o=new h(t,d,{itemSizesReference:"positions",zoomToSizeRatioFunction:e=>e,autoRescale:!1,defaultNodeType:"square",nodeProgramClasses:{square:z}}),s=document.getElementById("linearZoomToSizeRatioFunction"),a=document.getElementById("itemSizesReferencePositions"),r=document.getElementById("disabledAutoRescale"),m=document.getElementById("resetCamera");s.checked=o.getSetting("zoomToSizeRatioFunction")!==c.zoomToSizeRatioFunction,a.checked=o.getSetting("itemSizesReference")==="positions",r.checked=!o.getSetting("autoRescale");function u(){o.setSetting("zoomToSizeRatioFunction",s.checked?e=>e:c.zoomToSizeRatioFunction),o.setSetting("itemSizesReference",a.checked?"positions":c.itemSizesReference),o.setSetting("autoRescale",!r.checked)}return[s,a,r].forEach(e=>e.addEventListener("change",u)),m.addEventListener("click",()=>{o.getCamera().animatedReset()}),()=>{o.kill()}},y=`<style>
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
  #controls {
    font-family: sans-serif;
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ffffffcc;
    padding: 10px;
  }
  #controls fieldset {
    outline: none;
    border: none;
    display: flex;
    flex-direction: row;
    padding: 0;
  }
  #controls fieldset label {
    flex-grow: 1;
  }
</style>
<div id="sigma-container"></div>
<section id="controls">
  <fieldset>
    <label for="linearZoomToSizeRatioFunction">Use linear <code>zoomToSizeRatioFunction</code></label>
    <input type="checkbox" id="linearZoomToSizeRatioFunction" />
  </fieldset>
  <fieldset>
    <label for="itemSizesReferencePositions">Set <code>itemSizesReference</code> to <code>"positions"</code></label>
    <input type="checkbox" id="itemSizesReferencePositions" />
  </fieldset>
  <fieldset>
    <label for="disabledAutoRescale">Disable <code>autoRescale</code>?</label>
    <input type="checkbox" id="disabledAutoRescale" />
  </fieldset>
  <fieldset>
    <button id="resetCamera">Reset camera</button>
  </fieldset>
</section>
`,T=`/**
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
import { DEFAULT_SETTINGS } from "sigma/settings";

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

  // Handle controls:
  const linearZoomToSizeRatioFunction = document.getElementById("linearZoomToSizeRatioFunction") as HTMLInputElement;
  const itemSizesReferencePositions = document.getElementById("itemSizesReferencePositions") as HTMLInputElement;
  const disabledAutoRescale = document.getElementById("disabledAutoRescale") as HTMLInputElement;
  const resetCamera = document.getElementById("resetCamera") as HTMLButtonElement;

  // Set initial form values:
  linearZoomToSizeRatioFunction.checked =
    renderer.getSetting("zoomToSizeRatioFunction") !== DEFAULT_SETTINGS.zoomToSizeRatioFunction;
  itemSizesReferencePositions.checked = renderer.getSetting("itemSizesReference") === "positions";
  disabledAutoRescale.checked = !renderer.getSetting("autoRescale");

  // Handle controls updates:
  function refreshSettings() {
    renderer.setSetting(
      "zoomToSizeRatioFunction",
      linearZoomToSizeRatioFunction.checked ? (x) => x : DEFAULT_SETTINGS.zoomToSizeRatioFunction,
    );
    renderer.setSetting(
      "itemSizesReference",
      itemSizesReferencePositions.checked ? "positions" : DEFAULT_SETTINGS.itemSizesReference,
    );
    renderer.setSetting("autoRescale", !disabledAutoRescale.checked);
  }
  [linearZoomToSizeRatioFunction, itemSizesReferencePositions, disabledAutoRescale].forEach((input) =>
    input.addEventListener("change", refreshSettings),
  );

  // Handle reset camera button:
  resetCamera.addEventListener("click", () => {
    renderer.getCamera().animatedReset();
  });

  return () => {
    renderer.kill();
  };
};
`,F={id:"fit-sizes-to-positions",title:"Core library/Advanced use cases"},k={name:"Customize how sigma handles sizes and positions",render:()=>y,play:p(R),args:{},parameters:{storySource:{source:T}}};export{F as default,k as story};
