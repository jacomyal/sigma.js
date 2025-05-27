import{r as P,G as O,S as G,b as C,w as q}from"./sigma-BsJT_GRv.js";import{r as D}from"./circlepack-DXqN3GYD.js";import{r as _}from"./circular-D8icM7Tl.js";import{r as T}from"./defaults-BeBqgnWC.js";import{f as H}from"./index-BUEWZHga.js";import{F as U}from"./worker-B6sB0a3K.js";import{d as j}from"./data-Bz6iBPrE.js";import"./_commonjsHelpers-C4iS2aBk.js";import"./getters-CXJ0gpj8.js";var A={},B,k;function Y(){if(k)return B;k=1;var r=T(),E=P(),L={dimensions:["x","y"],center:.5,rng:Math.random,scale:1};function h(v,y,o){if(!E(y))throw new Error("graphology-layout/random: the given graph is not a valid graphology instance.");o=r(o,L);var a=o.dimensions;if(!Array.isArray(a)||a.length<1)throw new Error("graphology-layout/random: given dimensions are invalid.");var e=a.length,i=o.center,u=o.rng,c=o.scale,f=(i-.5)*c;function m(t){for(var n=0;n<e;n++)t[a[n]]=u()*c+f;return t}if(!v){var p={};return y.forEachNode(function(t){p[t]=m({})}),p}y.updateEachNodeAttributes(function(t,n){return m(n),n},{attributes:a})}var g=h.bind(null,!1);return g.assign=h.bind(null,!0),B=g,B}var S,N;function Z(){if(N)return S;N=1;var r=T(),E=P(),L=Math.PI/180,h={dimensions:["x","y"],centeredOnZero:!1,degrees:!1};function g(y,o,a,e){if(!E(o))throw new Error("graphology-layout/rotation: the given graph is not a valid graphology instance.");e=r(e,h),e.degrees&&(a*=L);var i=e.dimensions;if(!Array.isArray(i)||i.length!==2)throw new Error("graphology-layout/random: given dimensions are invalid.");if(o.order===0)return y?void 0:{};var u=i[0],c=i[1],f=0,m=0;if(!e.centeredOnZero){var p=1/0,t=-1/0,n=1/0,x=-1/0;o.forEachNode(function(d,s){var l=s[u],F=s[c];l<p&&(p=l),l>t&&(t=l),F<n&&(n=F),F>x&&(x=F)}),f=(p+t)/2,m=(n+x)/2}var w=Math.cos(a),b=Math.sin(a);function I(d){var s=d[u],l=d[c];return d[u]=f+(s-f)*w-(l-m)*b,d[c]=m+(s-f)*b+(l-m)*w,d}if(!y){var R={};return o.forEachNode(function(d,s){var l={};l[u]=s[u],l[c]=s[c],R[d]=I(l)}),R}o.updateEachNodeAttributes(function(d,s){return I(s),s},{attributes:i})}var v=g.bind(null,!1);return v.assign=g.bind(null,!0),S=v,S}var M;function z(){return M||(M=1,A.circlepack=D(),A.circular=_(),A.random=Y(),A.rotation=Z()),A}var V=z();const J=()=>{const r=new O;r.import(j);const E=document.getElementById("sigma-container"),L=document.getElementById("forceatlas2"),h=document.getElementById("forceatlas2-stop-label"),g=document.getElementById("forceatlas2-start-label"),v=document.getElementById("random"),y=document.getElementById("circular"),o=H.inferSettings(r),a=new U(r,{settings:o});let e=null;function i(){a.stop(),g.style.display="flex",h.style.display="none"}function u(){e&&e(),a.start(),g.style.display="none",h.style.display="flex"}function c(){a.isRunning()?i():u()}L.addEventListener("click",c);function f(){a.isRunning()&&i(),e&&e();const t={min:0,max:0},n={min:0,max:0};r.forEachNode((w,b)=>{t.min=Math.min(b.x,t.min),t.max=Math.max(b.x,t.max),n.min=Math.min(b.y,n.min),n.max=Math.max(b.y,n.max)});const x={};r.forEachNode(w=>{x[w]={x:Math.random()*(t.max-t.min),y:Math.random()*(n.max-n.min)}}),e=C(r,x,{duration:2e3})}v.addEventListener("click",f);function m(){a.isRunning()&&i(),e&&e();const t=V.circular(r,{scale:100});e=C(r,t,{duration:2e3,easing:"linear"})}y.addEventListener("click",m);const p=new G(r,E);return()=>{p.kill()}},K=`<style>
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
`,Q=`/**
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
`,it={id:"layouts",title:"Core library/Features showcases"},st={name:"Layouts example",render:()=>K,play:q(J),args:{},parameters:{storySource:{source:Q}}};export{it as default,st as story};
