import{i as E,G as B,S,b as A,w as I}from"./sigma-D6zuMBvc.js";import{F as C}from"./worker-QJSZ-tcp.js";import{c as N}from"./circular-4kFIkoUP.js";import{d as L}from"./getters-Dzi6BvTr.js";import{f as M}from"./index--VWyBF35.js";import{d as P}from"./data-ro0eVT-D.js";import"./_commonjsHelpers-BosuxZz1.js";var k=L,T=E,R={dimensions:["x","y"],center:.5,rng:Math.random,scale:1};function w(e,c,r){if(!T(c))throw new Error("graphology-layout/random: the given graph is not a valid graphology instance.");r=k(r,R);var a=r.dimensions;if(!Array.isArray(a)||a.length<1)throw new Error("graphology-layout/random: given dimensions are invalid.");var d=a.length,y=r.center,f=r.rng,p=r.scale,s=(y-.5)*p;function n(m){for(var l=0;l<d;l++)m[a[l]]=f()*p+s;return m}if(!e){var g={};return c.forEachNode(function(m){g[m]=n({})}),g}c.updateEachNodeAttributes(function(m,l){return n(l),l},{attributes:a})}var O=w.bind(null,!1);O.assign=w.bind(null,!0);var G=L,D=E,H=Math.PI/180,U={dimensions:["x","y"],centeredOnZero:!1,degrees:!1};function F(e,c,r,a){if(!D(c))throw new Error("graphology-layout/rotation: the given graph is not a valid graphology instance.");a=G(a,U),a.degrees&&(r*=H);var d=a.dimensions;if(!Array.isArray(d)||d.length!==2)throw new Error("graphology-layout/random: given dimensions are invalid.");if(c.order===0)return e?void 0:{};var y=d[0],f=d[1],p=0,s=0;if(!a.centeredOnZero){var n=1/0,g=-1/0,m=1/0,l=-1/0;c.forEachNode(function(t,o){var i=o[y],h=o[f];i<n&&(n=i),i>g&&(g=i),h<m&&(m=h),h>l&&(l=h)}),p=(n+g)/2,s=(m+l)/2}var b=Math.cos(r),x=Math.sin(r);function v(t){var o=t[y],i=t[f];return t[y]=p+(o-p)*b-(i-s)*x,t[f]=s+(o-p)*x+(i-s)*b,t}if(!e){var u={};return c.forEachNode(function(t,o){var i={};i[y]=o[y],i[f]=o[f],u[t]=v(i)}),u}c.updateEachNodeAttributes(function(t,o){return v(o),o},{attributes:d})}var _=F.bind(null,!1);_.assign=F.bind(null,!0);var j=N;const $=()=>{const e=new B;e.import(P);const c=document.getElementById("sigma-container"),r=document.getElementById("forceatlas2"),a=document.getElementById("forceatlas2-stop-label"),d=document.getElementById("forceatlas2-start-label"),y=document.getElementById("random"),f=document.getElementById("circular"),p=M.inferSettings(e),s=new C(e,{settings:p});let n=null;function g(){s.stop(),d.style.display="flex",a.style.display="none"}function m(){n&&n(),s.start(),d.style.display="none",a.style.display="flex"}function l(){s.isRunning()?g():m()}r.addEventListener("click",l);function b(){s.isRunning()&&g(),n&&n();const u={min:0,max:0},t={min:0,max:0};e.forEachNode((i,h)=>{u.min=Math.min(h.x,u.min),u.max=Math.max(h.x,u.max),t.min=Math.min(h.y,t.min),t.max=Math.max(h.y,t.max)});const o={};e.forEachNode(i=>{o[i]={x:Math.random()*(u.max-u.min),y:Math.random()*(t.max-t.min)}}),n=A(e,o,{duration:2e3})}y.addEventListener("click",b);function x(){s.isRunning()&&g(),n&&n();const u=j(e,{scale:100});n=A(e,u,{duration:2e3,easing:"linear"})}f.addEventListener("click",x);const v=new S(e,c);return()=>{v.kill()}},Y=`<style>
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
  #buttons {
    position: absolute;
    right: 1em;
    top: 1em;
    display: flex;
  }
  #buttons > button {
    margin-right: 1em;
    display: inline-block;
    text-align: center;
    background: white;
    outline: none;
    border: 1px solid dimgrey;
    border-radius: 2px;
    cursor: pointer;
  }
  #buttons > button img {
    height: 2em;
  }
  #buttons > button > span {
    height: 100%;
    display: flex;
    align-items: center;
  }
  #buttons > button:last-child {
    margin-right: 0;
  }
</style>
<div id="sigma-container"></div>
<div id="buttons">
  <button id="random">
    <span><img src="./GiPerspectiveDiceSixFaces.svg" />random</span>
  </button>
  <button id="forceatlas2">
    <span>
      <img id="forceatlas2-start-label" src="./BiPlay.svg" />
      <img id="forceatlas2-stop-label" style="display: none" src="./BiPause.svg" />
      Force Atlas 2
    </span>
  </button>
  <button id="circular">
    <span><img src="./BiLoaderCircle.svg" />circular</span>
  </button>
</div>
`,Z=`/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */
import Graph from "graphology";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import Sigma from "sigma";
import { PlainObject } from "sigma/types";
import { animateNodes } from "sigma/utils";

import data from "../../_data/data.json";

export default () => {
  // Initialize the graph object with data
  const graph = new Graph();
  graph.import(data);

  // Retrieve some useful DOM elements:
  const container = document.getElementById("sigma-container") as HTMLElement;

  const FA2Button = document.getElementById("forceatlas2") as HTMLElement;
  const FA2StopLabel = document.getElementById("forceatlas2-stop-label") as HTMLElement;
  const FA2StartLabel = document.getElementById("forceatlas2-start-label") as HTMLElement;

  const randomButton = document.getElementById("random") as HTMLElement;

  const circularButton = document.getElementById("circular") as HTMLElement;

  /** FA2 LAYOUT **/
  /* This example shows how to use the force atlas 2 layout in a web worker */

  // Graphology provides a easy to use implementation of Force Atlas 2 in a web worker
  const sensibleSettings = forceAtlas2.inferSettings(graph);
  const fa2Layout = new FA2Layout(graph, {
    settings: sensibleSettings,
  });

  // A button to trigger the layout start/stop actions

  // A variable is used to toggle state between start and stop
  let cancelCurrentAnimation: (() => void) | null = null;

  // correlate start/stop actions with state management
  function stopFA2() {
    fa2Layout.stop();
    FA2StartLabel.style.display = "flex";
    FA2StopLabel.style.display = "none";
  }
  function startFA2() {
    if (cancelCurrentAnimation) cancelCurrentAnimation();
    fa2Layout.start();
    FA2StartLabel.style.display = "none";
    FA2StopLabel.style.display = "flex";
  }

  // the main toggle function
  function toggleFA2Layout() {
    if (fa2Layout.isRunning()) {
      stopFA2();
    } else {
      startFA2();
    }
  }
  // bind method to the forceatlas2 button
  FA2Button.addEventListener("click", toggleFA2Layout);

  /** RANDOM LAYOUT **/
  /* Layout can be handled manually by setting nodes x and y attributes */
  /* This random layout has been coded to show how to manipulate positions directly in the graph instance */
  /* Alternatively a random layout algo exists in graphology: https://github.com/graphology/graphology-layout#random  */
  function randomLayout() {
    // stop fa2 if running
    if (fa2Layout.isRunning()) stopFA2();
    if (cancelCurrentAnimation) cancelCurrentAnimation();

    // to keep positions scale uniform between layouts, we first calculate positions extents
    const xExtents = { min: 0, max: 0 };
    const yExtents = { min: 0, max: 0 };
    graph.forEachNode((_node, attributes) => {
      xExtents.min = Math.min(attributes.x, xExtents.min);
      xExtents.max = Math.max(attributes.x, xExtents.max);
      yExtents.min = Math.min(attributes.y, yExtents.min);
      yExtents.max = Math.max(attributes.y, yExtents.max);
    });
    const randomPositions: PlainObject<PlainObject<number>> = {};
    graph.forEachNode((node) => {
      // create random positions respecting position extents
      randomPositions[node] = {
        x: Math.random() * (xExtents.max - xExtents.min),
        y: Math.random() * (yExtents.max - yExtents.min),
      };
    });
    // use sigma animation to update new positions
    cancelCurrentAnimation = animateNodes(graph, randomPositions, { duration: 2000 });
  }

  // bind method to the random button
  randomButton.addEventListener("click", randomLayout);

  /** CIRCULAR LAYOUT **/
  /* This example shows how to use an existing deterministic graphology layout */
  function circularLayout() {
    // stop fa2 if running
    if (fa2Layout.isRunning()) stopFA2();
    if (cancelCurrentAnimation) cancelCurrentAnimation();

    //since we want to use animations we need to process positions before applying them through animateNodes
    const circularPositions = circular(graph, { scale: 100 });
    //In other context, it's possible to apply the position directly we : circular.assign(graph, {scale:100})
    cancelCurrentAnimation = animateNodes(graph, circularPositions, { duration: 2000, easing: "linear" });
  }

  // bind method to the random button
  circularButton.addEventListener("click", circularLayout);

  /** instantiate sigma into the container **/
  const renderer = new Sigma(graph, container);

  return () => {
    renderer.kill();
  };
};
`,X={id:"layouts",title:"Core library/Features showcases"},tt={name:"Layouts example",render:()=>Y,play:I($),args:{},parameters:{storySource:{source:Z}}};export{X as default,tt as story};
