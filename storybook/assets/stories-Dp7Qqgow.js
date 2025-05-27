import{g as D,G as M,S as T,w as S}from"./sigma-BsJT_GRv.js";import{l as L}from"./index-DQHtHSz5.js";import{i as B}from"./index-Dqwe1tyM.js";import{d as V}from"./data-Bz6iBPrE.js";import"./_commonjsHelpers-C4iS2aBk.js";import"./defaults-BeBqgnWC.js";import"./infer-type-BZ77ykGk.js";import"./getters-CXJ0gpj8.js";const H={animate:!0};function O(t,m,i={}){if(!m.length)throw new Error("getCameraStateToFitViewportToNodes: There should be at least one node.");let o=1/0,c=-1/0,n=1/0,a=-1/0,e=1/0,r=-1/0,s=1/0,d=-1/0;const h=t.getGraph();m.forEach(g=>{const N=t.getNodeDisplayData(g);if(!N)throw new Error(`getCameraStateToFitViewportToNodes: Node ${g} not found in sigma's graph.`);const{x,y:I}=h.getNodeAttributes(g),{x:v,y:E}=N;o=Math.min(o,x),c=Math.max(c,x),n=Math.min(n,I),a=Math.max(a,I),e=Math.min(e,v),r=Math.max(r,v),s=Math.min(s,E),d=Math.max(d,E)});const{x:p,y}=t.getCustomBBox()||t.getBBox(),u=p[1]-p[0]||1,l=y[1]-y[0]||1,F=(e+r)/2,_=(s+d)/2,f=c-o||u,w=a-n||l,{width:b,height:C}=t.getDimensions(),$=D({width:b,height:C},{width:u,height:l}),G=(w/f<C/b?f:w)/Math.max(u,l)*$;return{...t.getCamera().getState(),angle:0,x:F,y:_,ratio:G}}async function k(t,m,i={}){const{animate:o}={...H,...i},c=t.getCamera(),n=O(t,m,i);o?await c.animate(n):c.setState(n)}function X(t){const{width:m,height:i}=t.getDimensions();return t.getGraph().filterNodes((c,n)=>{const a=n,{x:e,y:r}=t.graphToViewport(a),s=t.scaleSize(a.size);return e+s>=0&&e-s<=m&&r+s>=0&&r-s<=i})}const Y=()=>{const t=new M;t.import(V),L.assign(t,{nodeCommunityAttribute:"community"});const m=new Set;t.forEachNode((e,r)=>m.add(r.community));const i=Array.from(m),o=B(m.size).reduce((e,r,s)=>({...e,[i[s]]:r}),{});t.forEachNode((e,r)=>t.setNodeAttribute(e,"color",o[r.community]));const c=document.getElementById("sigma-container"),n=new T(t,c),a=document.createElement("div");return a.style.position="absolute",a.style.right="10px",a.style.bottom="10px",document.body.append(a),i.forEach(e=>{const r=`cb-${e}`,s=document.createElement("div");s.innerHTML+=`
      <button id="${r}" style="color:${o[e]};margin-top:3px">Community n°${e+1}</button>    
    `,a.append(s),a.querySelector(`#${r}`).addEventListener("click",()=>{k(n,t.filterNodes((h,p)=>p.community===e),{animate:!0})})}),()=>{n==null||n.kill()}},z=`import { fitViewportToNodes } from "@sigma/utils";
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import iwanthue from "iwanthue";
import Sigma from "sigma";

import data from "../../_data/data.json";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Detect communities
  louvain.assign(graph, { nodeCommunityAttribute: "community" });
  const communities = new Set<string>();
  graph.forEachNode((_, attrs) => communities.add(attrs.community));
  const communitiesArray = Array.from(communities);

  // Determine colors, and color each node accordingly
  const palette: Record<string, string> = iwanthue(communities.size).reduce(
    (iter, color, i) => ({
      ...iter,
      [communitiesArray[i]]: color,
    }),
    {},
  );
  graph.forEachNode((node, attr) => graph.setNodeAttribute(node, "color", palette[attr.community]));

  // Retrieve some useful DOM elements
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma
  const renderer = new Sigma(graph, container);

  // Add buttons
  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.position = "absolute";
  buttonsContainer.style.right = "10px";
  buttonsContainer.style.bottom = "10px";
  document.body.append(buttonsContainer);

  communitiesArray.forEach((community) => {
    const id = \`cb-\${community}\`;
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML += \`
      <button id="\${id}" style="color:\${palette[community]};margin-top:3px">Community n°\${community + 1}</button>    
    \`;
    buttonsContainer.append(buttonContainer);
    const button = buttonsContainer.querySelector(\`#\${id}\`) as HTMLButtonElement;

    button.addEventListener("click", () => {
      fitViewportToNodes(
        renderer,
        graph.filterNodes((_, attr) => attr.community === community),
        { animate: true },
      );
    });
  });

  return () => {
    renderer?.kill();
  };
};
`,R=()=>{const t=new M;t.import(V);const m=document.getElementById("sigma-container"),i=new T(t,m),o=document.createElement("div");return o.style.position="absolute",o.style.left="10px",o.style.top="10px",document.body.append(o),setInterval(()=>{const n=X(i).length;o.innerHTML=n===0?"No visible node":n===1?"One visible node":`${n} visible nodes`},200),()=>{i==null||i.kill()}},P=`import { getNodesInViewport } from "@sigma/utils";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../../_data/data.json";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Retrieve some useful DOM elements
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma
  const renderer = new Sigma(graph, container);

  // Add buttons
  const logsContainer = document.createElement("div");
  logsContainer.style.position = "absolute";
  logsContainer.style.left = "10px";
  logsContainer.style.top = "10px";
  document.body.append(logsContainer);

  setInterval(() => {
    const nodesInViewport = getNodesInViewport(renderer);
    const count = nodesInViewport.length;
    logsContainer.innerHTML =
      count === 0 ? "No visible node" : count === 1 ? "One visible node" : \`\${count} visible nodes\`;
  }, 200);

  return () => {
    renderer?.kill();
  };
};
`,A=`<style>
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
</style>
<div id="sigma-container"></div>
`,nt={id:"@sigma/utils",title:"Satellite packages/@sigma--utils"},et={name:"Fit viewport to nodes",render:()=>A,play:S(Y),args:{},parameters:{storySource:{source:z}}},ot={name:"Get nodes in viewport",render:()=>A,play:S(R),args:{},parameters:{storySource:{source:P}}};export{et as FitViewportToNodes,ot as GetNodesInViewport,nt as default};
