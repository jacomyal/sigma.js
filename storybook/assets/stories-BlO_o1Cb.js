import{N as c,f as p,G as h,S as u,w as y}from"./sigma-BsJT_GRv.js";import{F as w}from"./worker-DR-cw7A-.js";import{c as v}from"./factory-C5ffFMeX.js";import"./_commonjsHelpers-C4iS2aBk.js";import"./defaults-BeBqgnWC.js";import"./getters-CXJ0gpj8.js";const b=`
precision mediump float;

varying vec4 v_color;
varying float v_border;

const float radius = 0.5;
const float halfRadius = 0.35;

void main(void) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
  float distToCenter = length(gl_PointCoord - vec2(0.5, 0.5));

  #ifdef PICKING_MODE
  if (distToCenter < radius)
    gl_FragColor = v_color;
  else
    gl_FragColor = transparent;
  #else
  // For normal mode, we use the color:
  if (distToCenter > radius)
    gl_FragColor = transparent;
  else if (distToCenter > radius - v_border)
    gl_FragColor = mix(transparent, v_color, (radius - distToCenter) / v_border);
  else
    gl_FragColor = mix(v_color, white, (radius - distToCenter) / radius);
  #endif
}
`,f=`
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;
attribute float a_size;

uniform float u_sizeRatio;
uniform float u_pixelRatio;
uniform mat3 u_matrix;

varying vec4 v_color;
varying float v_border;

const float bias = 255.0 / 254.0;

void main() {
  gl_Position = vec4(
    (u_matrix * vec3(a_position, 1)).xy,
    0,
    1
  );

  // Multiply the point size twice:
  //  - x SCALING_RATIO to correct the canvas scaling
  //  - x 2 to correct the formulae
  gl_PointSize = a_size / u_sizeRatio * u_pixelRatio * 2.0;

  v_border = (0.5 / a_size) * u_sizeRatio;

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`,{UNSIGNED_BYTE:l,FLOAT:g}=WebGLRenderingContext,E=["u_sizeRatio","u_pixelRatio","u_matrix"];class z extends c{getDefinition(){return{VERTICES:1,VERTEX_SHADER_SOURCE:f,FRAGMENT_SHADER_SOURCE:b,METHOD:WebGLRenderingContext.POINTS,UNIFORMS:E,ATTRIBUTES:[{name:"a_position",size:2,type:g},{name:"a_size",size:1,type:g},{name:"a_color",size:4,type:l,normalized:!0},{name:"a_id",size:4,type:l,normalized:!0}]}}processVisibleItem(e,a,r){const o=this.array;o[a++]=r.x,o[a++]=r.y,o[a++]=r.size,o[a++]=p(r.color),o[a++]=e}setUniforms(e,{gl:a,uniformLocations:r}){const{u_sizeRatio:o,u_pixelRatio:i,u_matrix:t}=r;a.uniform1f(o,e.sizeRatio),a.uniform1f(i,e.pixelRatio),a.uniformMatrix3fv(t,!1,e.matrix)}}const _=()=>{const s=document.getElementById("sigma-container"),e=new h,a="#FA4F40",r="#727EE0",o="#5DB346";e.addNode("John",{size:15,label:"John",type:"image",image:"./user.svg",color:a}),e.addNode("Mary",{size:15,label:"Mary",type:"image",image:"./user.svg",color:a}),e.addNode("Suzan",{size:15,label:"Suzan",type:"image",image:"./user.svg",color:a}),e.addNode("Nantes",{size:15,label:"Nantes",type:"image",image:"./city.svg",color:r}),e.addNode("New-York",{size:15,label:"New-York",type:"image",image:"./city.svg",color:r}),e.addNode("Sushis",{size:7,label:"Sushis",type:"gradient",color:o}),e.addNode("Falafels",{size:7,label:"Falafels",type:"gradient",color:o}),e.addNode("Kouign Amann",{size:7,label:"Kouign Amann",type:"gradient",color:o}),e.addEdge("John","Mary",{type:"line",label:"works with",size:5}),e.addEdge("Mary","Suzan",{type:"line",label:"works with",size:5}),e.addEdge("Mary","Nantes",{type:"arrow",label:"lives in",size:5}),e.addEdge("John","New-York",{type:"arrow",label:"lives in",size:5}),e.addEdge("Suzan","New-York",{type:"arrow",label:"lives in",size:5}),e.addEdge("John","Falafels",{type:"arrow",label:"eats",size:5}),e.addEdge("Mary","Sushis",{type:"arrow",label:"eats",size:5}),e.addEdge("Suzan","Kouign Amann",{type:"arrow",label:"eats",size:5}),e.nodes().forEach((n,m)=>{const d=m*2*Math.PI/e.order;e.setNodeAttribute(n,"x",100*Math.cos(d)),e.setNodeAttribute(n,"y",100*Math.sin(d))});const i=new u(e,s,{nodeProgramClasses:{image:v(),gradient:z},renderEdgeLabels:!0}),t=new w(e);return t.start(),()=>{t.kill(),i.kill()}},N=`<style>
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
`,S=`/**
 * This example shows how to use different programs to render nodes.
 * This works in two steps:
 * 1. You must declare all the different rendering programs to sigma when you
 *    instantiate it
 * 2. You must give to each node and edge a "type" value that matches a declared
 *    program
 * The programs offered by default by sigma are in src/rendering/webgl/programs,
 * but you can add your own.
 *
 * Here in this example, some nodes are drawn with images in them using the
 * createNodeImageProgram provided by @sigma/node-image. Some others are drawn
 * as white disc with a border, and the custom program to draw them is in this
 * directory:
 * - "./node.gradient.ts" is the node program. It tells sigma what data to give
 *   to the GPU and how.
 * - "./node.gradient.vert.glsl" is the vertex shader. It tells the GPU how to
 *   interpret the data provided by the program to obtain a node position,
 *   mostly.
 * - "./node.gradient.frag.glsl" is the fragment shader. It tells for each
 *   pixel what color it should get, relatively to data given by the program
 *   and its position inside the shape. Basically, the GPU wants to draw a
 *   square, but we "carve" a disc in it.
 */
import { createNodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";

import NodeGradientProgram from "./node-gradient";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  const RED = "#FA4F40";
  const BLUE = "#727EE0";
  const GREEN = "#5DB346";

  graph.addNode("John", { size: 15, label: "John", type: "image", image: "./user.svg", color: RED });
  graph.addNode("Mary", { size: 15, label: "Mary", type: "image", image: "./user.svg", color: RED });
  graph.addNode("Suzan", { size: 15, label: "Suzan", type: "image", image: "./user.svg", color: RED });
  graph.addNode("Nantes", { size: 15, label: "Nantes", type: "image", image: "./city.svg", color: BLUE });
  graph.addNode("New-York", { size: 15, label: "New-York", type: "image", image: "./city.svg", color: BLUE });
  graph.addNode("Sushis", { size: 7, label: "Sushis", type: "gradient", color: GREEN });
  graph.addNode("Falafels", { size: 7, label: "Falafels", type: "gradient", color: GREEN });
  graph.addNode("Kouign Amann", { size: 7, label: "Kouign Amann", type: "gradient", color: GREEN });

  graph.addEdge("John", "Mary", { type: "line", label: "works with", size: 5 });
  graph.addEdge("Mary", "Suzan", { type: "line", label: "works with", size: 5 });
  graph.addEdge("Mary", "Nantes", { type: "arrow", label: "lives in", size: 5 });
  graph.addEdge("John", "New-York", { type: "arrow", label: "lives in", size: 5 });
  graph.addEdge("Suzan", "New-York", { type: "arrow", label: "lives in", size: 5 });
  graph.addEdge("John", "Falafels", { type: "arrow", label: "eats", size: 5 });
  graph.addEdge("Mary", "Sushis", { type: "arrow", label: "eats", size: 5 });
  graph.addEdge("Suzan", "Kouign Amann", { type: "arrow", label: "eats", size: 5 });

  graph.nodes().forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / graph.order;
    graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
    graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
  });

  const renderer = new Sigma(graph, container, {
    // We don't have to declare edgeProgramClasses here, because we only use the default ones ("line" and "arrow")
    nodeProgramClasses: {
      image: createNodeImageProgram(),
      gradient: NodeGradientProgram,
    },
    renderEdgeLabels: true,
  });

  // Create the spring layout and start it
  const layout = new ForceSupervisor(graph);
  layout.start();

  return () => {
    layout.kill();
    renderer.kill();
  };
};
`,P={id:"custom-rendering",title:"Core library/Features showcases"},A={name:"Custom rendering",render:()=>N,play:y(_),args:{},parameters:{storySource:{source:S}}};export{P as default,A as story};
