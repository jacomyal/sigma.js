import{c as r}from"./chroma-CKzHTTCE.js";import{G as d,S as p,o as i}from"./utils-Ph0PoCvK.js";import{d as m}from"./data-ro0eVT-D.js";import"./_commonjsHelpers-BosuxZz1.js";const c={nodesAlpha:.5,edgesAlpha:.5},h=t=>{const o={...c,...t.args},s=document.getElementById("sigma-container"),a=new d;a.import(m);const e=new p(a,s,{enableEdgeEvents:!0,edgeReducer:(l,n)=>(n.color=r(n.color||"#000000").alpha(o.edgesAlpha).hex(),n),nodeReducer:(l,n)=>(n.color=r(n.color).alpha(o.nodesAlpha).hex(),n.label=null,n)});i(()=>{e==null||e.kill()})},g=`<style>
  body {
    font-family: sans-serif;
  }
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
`,u=`/**
 * This example shows how to render nodes and edges with various opacities
 */
import chroma from "chroma-js";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../_data/data.json";
import { onStoryDown } from "../utils";

const DEFAULT_ARGS = {
  nodesAlpha: 0.5,
  edgesAlpha: 0.5,
};

export default (input: { args: typeof DEFAULT_ARGS }) => {
  const args = {
    ...DEFAULT_ARGS,
    ...input.args,
  };

  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();
  graph.import(data);
  const renderer = new Sigma(graph, container, {
    enableEdgeEvents: true,
    edgeReducer: (_, attr) => {
      attr.color = chroma(attr.color || "#000000")
        .alpha(args.edgesAlpha)
        .hex();
      return attr;
    },
    nodeReducer: (_, attr) => {
      attr.color = chroma(attr.color).alpha(args.nodesAlpha).hex();
      attr.label = null;
      return attr;
    },
  });

  onStoryDown(() => {
    renderer?.kill();
  });
};
`,E={id:"nodes-edges-opacity",title:"Examples",argTypes:{nodesAlpha:{name:"Nodes alpha",defaultValue:.5,control:{type:"number",step:"0.05",min:"0",max:"1"}},edgesAlpha:{name:"Edges alpha",defaultValue:.5,control:{type:"number",step:"0.05",min:"0",max:"1"}}}},S={name:"Display nodes and edges with opacity",render:()=>g,play:h,args:{nodesAlpha:.5,edgesAlpha:.5},parameters:{storySource:{source:u}}};export{E as default,S as story};
