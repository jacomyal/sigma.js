import{G as I,S as E,w as x}from"./sigma-BsJT_GRv.js";import{b as v}from"./index-DlD6yKaT.js";import"./_commonjsHelpers-C4iS2aBk.js";import"./is-graph-constructor-BVugt_gr.js";import"./add-edge-DJG1E9TZ.js";import"./infer-type-BZ77ykGk.js";async function B(){const o=await(await fetch("./arctic.gexf")).text(),g=v.parse(I,o),a=new E(g,document.getElementById("sigma-container")),i=document.getElementById("controls"),s=document.querySelector('form button[type="submit"]');function m(){const e=new FormData(i),n={};n.enableCameraZooming=!!e.get("enable-zooming"),n.enableCameraPanning=!!e.get("enable-panning"),n.enableCameraRotation=!!e.get("enable-rotation");const u=e.get("min-ratio");n.minCameraRatio=u?+u:null;const b=e.get("max-ratio");n.maxCameraRatio=b?+b:null;const h=e.get("is-camera-bound"),y=e.get("tolerance");return n.cameraPanBoundaries=h?{tolerance:+(y||0)}:null,n}i.addEventListener("submit",e=>{e.preventDefault(),a.setSettings(m()),s.disabled=!0}),i.querySelectorAll("input").forEach(e=>{e.addEventListener("change",()=>{s.disabled=!1})}),a.setSettings(m());const l=document.getElementById("enable-zooming"),p=document.getElementById("min-ratio"),f=document.getElementById("max-ratio");l.addEventListener("change",()=>{const e=!l.checked;p.disabled=e,f.disabled=e});const d=document.getElementById("enable-panning"),r=document.getElementById("is-camera-bound"),c=document.getElementById("tolerance");return r.addEventListener("change",()=>{c.disabled=!r.checked}),d.addEventListener("change",()=>{const e=!d.checked;r.disabled=e,c.disabled=e}),document.querySelector('button[type="button"]').addEventListener("click",()=>{a.getCamera().animatedReset({duration:600})}),a}const L=()=>{let t;return B().then(o=>{t=o}),()=>{t==null||t.kill()}},R=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    font-family: sans-serif;
  }
  #controls {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ffffffcc;
    padding: 10px;
  }

  input[type="number"] {
    width: 5em;
  }
  h4 {
    margin: 0;
  }
  fieldset {
    border: none;
  }
  h4,
  fieldset > div {
    margin-bottom: 0.2em;
  }
  button {
    margin-right: 0.1em;
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
<form id="controls" action="#">
  <fieldset>
    <h4>Interactions</h4>
    <div>
      <input type="checkbox" id="enable-panning" name="enable-panning" checked />
      <label for="enable-panning">Enable panning</label>
    </div>
    <div>
      <input type="checkbox" id="enable-zooming" name="enable-zooming" checked />
      <label for="enable-zooming">Enable zooming</label>
    </div>
    <div>
      <input type="checkbox" id="enable-rotation" name="enable-rotation" checked />
      <label for="enable-rotation">Enable camera rotations <br /><small>(for multitouch device only)</small></label>
    </div>
  </fieldset>
  <fieldset>
    <h4>Camera</h4>
    <div>
      <input type="number" id="min-ratio" name="min-ratio" value="0.08" min="0.001" step="0.001" />
      <label for="min-ratio">Minimum camera zoom ratio <br /><small>(leave empty for no limit)</small></label>
    </div>
    <div>
      <input type="number" id="max-ratio" name="max-ratio" value="3" min="0.001" step="0.001" />
      <label for="max-ratio">Maximum camera zoom ratio <br /><small>(leave empty for no limit)</small></label>
    </div>
    <div>
      <input type="checkbox" id="is-camera-bound" name="is-camera-bound" checked />
      <label for="is-camera-bound">Bound camera</label>
    </div>
    <div>
      <input type="number" id="tolerance" name="tolerance" min="0" step="1" value="500" />
      <label for="tolerance">Tolerance (in pixels)</label>
    </div>
  </fieldset>
  <fieldset>
    <button type="submit" disabled>Update sigma settings</button>
  </fieldset>
</form>
`,k=`/**
 * This example demonstrates how to adjust Sigma's settings for better control
 * over the camera's capabilities.
 */
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";
import { Settings } from "sigma/src/settings";

async function initGraph() {
  // Load external GEXF file:
  const res = await fetch("./arctic.gexf");
  const gexf = await res.text();
  const graph = parse(Graph, gexf);

  // Retrieve some useful DOM elements:

  // Instantiate sigma:
  const renderer = new Sigma(graph, document.getElementById("sigma-container") as HTMLElement);

  // Handle form submits:
  const form = document.getElementById("controls") as HTMLFormElement;
  const submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
  function readForm(): Partial<Settings> {
    const data = new FormData(form);
    const res: Partial<Settings> = {};

    // Interactions:
    res.enableCameraZooming = !!data.get("enable-zooming");
    res.enableCameraPanning = !!data.get("enable-panning");
    res.enableCameraRotation = !!data.get("enable-rotation");

    // Zoom boundaries:
    const minRatio = data.get("min-ratio");
    res.minCameraRatio = minRatio ? +minRatio : null;
    const maxRatio = data.get("max-ratio");
    res.maxCameraRatio = maxRatio ? +maxRatio : null;

    // Pan boundaries:
    const isBound = data.get("is-camera-bound");
    const tolerance = data.get("tolerance");
    res.cameraPanBoundaries = isBound ? { tolerance: +(tolerance || 0) } : null;

    return res;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderer.setSettings(readForm());
    submitButton.disabled = true;
  });
  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      submitButton.disabled = false;
    });
  });

  // Initialize settings:
  renderer.setSettings(readForm());

  // Handle disabling some inputs contextually:
  const enableZoomingInput = document.getElementById("enable-zooming") as HTMLInputElement;
  const minRatioInput = document.getElementById("min-ratio") as HTMLInputElement;
  const maxRatioInput = document.getElementById("max-ratio") as HTMLInputElement;
  enableZoomingInput.addEventListener("change", () => {
    const disabled = !enableZoomingInput.checked;
    minRatioInput.disabled = disabled;
    maxRatioInput.disabled = disabled;
  });

  const enablePanningInput = document.getElementById("enable-panning") as HTMLInputElement;
  const isCameraBoundInput = document.getElementById("is-camera-bound") as HTMLInputElement;
  const toleranceInput = document.getElementById("tolerance") as HTMLInputElement;
  isCameraBoundInput.addEventListener("change", () => {
    toleranceInput.disabled = !isCameraBoundInput.checked;
  });
  enablePanningInput.addEventListener("change", () => {
    const disabled = !enablePanningInput.checked;
    isCameraBoundInput.disabled = disabled;
    toleranceInput.disabled = disabled;
  });

  // Handle reset camera position
  const resetButton = document.querySelector('button[type="button"]') as HTMLButtonElement;
  resetButton.addEventListener("click", () => {
    renderer.getCamera().animatedReset({ duration: 600 });
  });

  return renderer;
}

export default () => {
  let renderer: Sigma;
  initGraph().then((r) => {
    renderer = r;
  });

  return () => {
    renderer?.kill();
  };
};
`,P={id:"camera-control",title:"Core library/Features showcases"},F={name:"Camera control",render:()=>R,play:x(L),args:{},parameters:{storySource:{source:k}}};export{P as default,F as story};
