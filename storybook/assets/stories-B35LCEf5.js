import{G as p,S as h,w as u}from"./sigma-BsJT_GRv.js";import{d as f}from"./data-Bz6iBPrE.js";import"./_commonjsHelpers-C4iS2aBk.js";const b=()=>{const i=document.getElementById("sigma-container"),d=document.getElementById("sigma-logs"),r=new p;r.import(f);function s(e,n,t){const l=document.createElement("div");let g=`Event "${e}"`;if(t&&n)if(n==="positions")t=t,g+=`, x ${t.x}, y ${t.y}`;else{const v=n==="node"?r.getNodeAttribute(t,"label"):r.getEdgeAttribute(t,"label");g+=`, ${n} ${v||"with no label"} (id "${t}")`,n==="edge"&&(g+=`, source ${r.getSourceAttribute(t,"label")}, target: ${r.getTargetAttribute(t,"label")}`)}l.innerHTML=`<span>${g}</span>`,d.appendChild(l),d.scrollTo({top:d.scrollHeight}),d.children.length>50&&d.children[0].remove()}let a=null;const o=new h(r,i,{enableEdgeEvents:!0,edgeReducer(e,n){const t={...n};return e===a&&(t.color="#cc0000"),t}}),c=["enterNode","leaveNode","downNode","clickNode","rightClickNode","doubleClickNode","wheelNode"],m=["downEdge","clickEdge","rightClickEdge","doubleClickEdge","wheelEdge"],E=["downStage","clickStage","doubleClickStage","wheelStage"];return c.forEach(e=>o.on(e,({node:n})=>s(e,"node",n))),m.forEach(e=>o.on(e,({edge:n})=>s(e,"edge",n))),o.on("enterEdge",({edge:e})=>{s("enterEdge","edge",e),a=e,o.refresh()}),o.on("leaveEdge",({edge:e})=>{s("leaveEdge","edge",e),a=null,o.refresh()}),E.forEach(e=>{o.on(e,({event:n})=>{s(e,"positions",n)})}),()=>{o.kill()}},y=`<style>
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
  #sigma-container .sigma-mouse {
    z-index: 1;
  }
  #sigma-logs {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  #sigma-logs > div {
    padding: 3px;
  }
  #sigma-logs > div > span {
    background: #ffffff99;
  }
</style>
<div id="sigma-container"></div>
<div id="sigma-logs"></div>
`,w=`/**
 * This example shows how to use node and edges events in sigma.
 */
import Graph from "graphology";
import Sigma from "sigma";
import { MouseCoords } from "sigma/types";

import data from "../../_data/data.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const logsDOM = document.getElementById("sigma-logs") as HTMLElement;

  const graph = new Graph();
  graph.import(data);

  function logEvent(event: string, itemType: "node" | "edge" | "positions", item: string | MouseCoords): void {
    const div = document.createElement("div");
    let message = \`Event "\${event}"\`;
    if (item && itemType) {
      if (itemType === "positions") {
        item = item as MouseCoords;
        message += \`, x \${item.x}, y \${item.y}\`;
      } else {
        const label =
          itemType === "node" ? graph.getNodeAttribute(item, "label") : graph.getEdgeAttribute(item, "label");
        message += \`, \${itemType} \${label || "with no label"} (id "\${item}")\`;

        if (itemType === "edge") {
          message += \`, source \${graph.getSourceAttribute(item, "label")}, target: \${graph.getTargetAttribute(
            item,
            "label",
          )}\`;
        }
      }
    }
    div.innerHTML = \`<span>\${message}</span>\`;
    logsDOM.appendChild(div);
    logsDOM.scrollTo({ top: logsDOM.scrollHeight });

    if (logsDOM.children.length > 50) logsDOM.children[0].remove();
  }

  let hoveredEdge: null | string = null;
  const renderer = new Sigma(graph, container, {
    enableEdgeEvents: true,
    edgeReducer(edge, data) {
      const res = { ...data };
      if (edge === hoveredEdge) res.color = "#cc0000";
      return res;
    },
  });

  const nodeEvents = [
    "enterNode",
    "leaveNode",
    "downNode",
    "clickNode",
    "rightClickNode",
    "doubleClickNode",
    "wheelNode",
  ] as const;
  const edgeEvents = ["downEdge", "clickEdge", "rightClickEdge", "doubleClickEdge", "wheelEdge"] as const;
  const stageEvents = ["downStage", "clickStage", "doubleClickStage", "wheelStage"] as const;

  nodeEvents.forEach((eventType) => renderer.on(eventType, ({ node }) => logEvent(eventType, "node", node)));
  edgeEvents.forEach((eventType) => renderer.on(eventType, ({ edge }) => logEvent(eventType, "edge", edge)));

  renderer.on("enterEdge", ({ edge }) => {
    logEvent("enterEdge", "edge", edge);
    hoveredEdge = edge;
    renderer.refresh();
  });
  renderer.on("leaveEdge", ({ edge }) => {
    logEvent("leaveEdge", "edge", edge);
    hoveredEdge = null;
    renderer.refresh();
  });

  stageEvents.forEach((eventType) => {
    renderer.on(eventType, ({ event }) => {
      logEvent(eventType, "positions", event);
    });
  });

  return () => {
    renderer.kill();
  };
};
`,C={id:"events",title:"Core library/Features showcases"},N={name:"Events",render:()=>y,play:u(b),args:{},parameters:{storySource:{source:w}}};export{C as default,N as story};
