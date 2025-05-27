import{G as d,S as m,w as c}from"./sigma-BsJT_GRv.js";import{b as u}from"./index-DlD6yKaT.js";import"./_commonjsHelpers-C4iS2aBk.js";import"./is-graph-constructor-BVugt_gr.js";import"./add-edge-DJG1E9TZ.js";import"./infer-type-BZ77ykGk.js";const p=()=>{let n=null;return fetch("./arctic.gexf").then(e=>e.text()).then(e=>{const a=u.parse(d,e),i=document.getElementById("sigma-container"),r=document.getElementById("zoom-in"),l=document.getElementById("zoom-out"),s=document.getElementById("zoom-reset"),t=document.getElementById("labels-threshold");n=new m(a,i,{minCameraRatio:.08,maxCameraRatio:3});const o=n.getCamera();r.addEventListener("click",()=>{o.animatedZoom({duration:600})}),l.addEventListener("click",()=>{o.animatedUnzoom({duration:600})}),s.addEventListener("click",()=>{o.animatedReset({duration:600})}),t.addEventListener("input",()=>{n==null||n.setSetting("labelRenderedSizeThreshold",+t.value)}),t.value=n.getSetting("labelRenderedSizeThreshold")+""}),()=>{n==null||n.kill()}},g=`<style>
  body {
    font-family: sans-serif;
  }
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
    position: absolute;
    right: 1em;
    top: 1em;
    text-align: right;
  }
  .input {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .input:not(:hover) label {
    display: none;
  }
  .input label {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: black;
    color: white;
    padding: 0.2em;
    border-radius: 2px;
    margin-top: 0.3em;
    font-size: 0.8em;
    white-space: nowrap;
  }
  .input button {
    width: 2.5em;
    height: 2.5em;
    display: inline-block;
    text-align: center;
    background: white;
    outline: none;
    border: 1px solid dimgrey;
    border-radius: 2px;
    cursor: pointer;
  }
</style>
<div id="sigma-container"></div>
<div id="controls">
  <div class="input"><label for="zoom-in">Zoom in</label><button id="zoom-in">+</button></div>
  <div class="input"><label for="zoom-out">Zoom out</label><button id="zoom-out">-</button></div>
  <div class="input"><label for="zoom-reset">Reset zoom</label><button id="zoom-reset">⊙</button></div>
  <div class="input">
    <label for="labels-threshold">Labels threshold</label>
    <input id="labels-threshold" type="range" min="0" max="15" step="0.5" />
  </div>
</div>
`,h=`/**
 * This example shows how to load a GEXF graph file (using the dedicated
 * graphology parser), and display it with some basic map features: Zoom in and
 * out buttons, reset zoom button, and a slider to increase or decrease the
 * quantity of labels displayed on screen.
 */
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";

export default () => {
  let renderer: Sigma | null = null;

  // Load external GEXF file:
  fetch("./arctic.gexf")
    .then((res) => res.text())
    .then((gexf) => {
      // Parse GEXF string:
      const graph = parse(Graph, gexf);

      // Retrieve some useful DOM elements:
      const container = document.getElementById("sigma-container") as HTMLElement;
      const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
      const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
      const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
      const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;

      // Instantiate sigma:
      renderer = new Sigma(graph, container, {
        minCameraRatio: 0.08,
        maxCameraRatio: 3,
      });
      const camera = renderer.getCamera();

      // Bind zoom manipulation buttons
      zoomInBtn.addEventListener("click", () => {
        camera.animatedZoom({ duration: 600 });
      });
      zoomOutBtn.addEventListener("click", () => {
        camera.animatedUnzoom({ duration: 600 });
      });
      zoomResetBtn.addEventListener("click", () => {
        camera.animatedReset({ duration: 600 });
      });

      // Bind labels threshold to range input
      labelsThresholdRange.addEventListener("input", () => {
        renderer?.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
      });

      // Set proper range initial value:
      labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
    });

  return () => {
    renderer?.kill();
  };
};
`,B={id:"load-gexf-file",title:"Core library/Features showcases"},x={name:"Load GEXF file",render:()=>g,play:c(p),args:{},parameters:{storySource:{source:h}}};export{B as default,x as story};
