import{G as m,S as p,w as v}from"./sigma-BsJT_GRv.js";import{d as E}from"./data-Bz6iBPrE.js";import"./_commonjsHelpers-C4iS2aBk.js";const u=()=>{const a=document.getElementById("sigma-logs"),d=new m;d.import(E);function i(l,o,n){const t=document.createElement("div");let r=`Event "${l}"`;if(n&&o)if(o==="positions")n=n,r+=`, x ${n.x}, y ${n.y}`;else{const g=o==="node"?d.getNodeAttribute(n,"label"):d.getEdgeAttribute(n,"label");r+=`, ${o} ${g||"with no label"} (id "${n}")`,o==="edge"&&(r+=`, source ${d.getSourceAttribute(n,"label")}, target: ${d.getTargetAttribute(n,"label")}`)}t.innerHTML=`<span>${r}</span>`,a.appendChild(t),a.scrollTo({top:a.scrollHeight}),a.children.length>50&&a.children[0].remove()}window.customElements.define("sigma-shadow",class extends HTMLElement{constructor(){super(),this._container=null}connectedCallback(){const l=this.attachShadow({mode:"open"}),o=document.createElement("div");o.style.cssText=`
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden;
            `,this._container=o,l.appendChild(o);let n=null;const t=new p(d,this._container,{enableEdgeEvents:!0,edgeReducer(e,s){const c={...s};return e===n&&(c.color="#cc0000"),c}});t.getCanvases().mouse.style.cssText="z-index: 100; position: absolute";const r=["enterNode","leaveNode","downNode","clickNode","rightClickNode","doubleClickNode","wheelNode"],g=["downEdge","clickEdge","rightClickEdge","doubleClickEdge","wheelEdge"],h=["downStage","clickStage","doubleClickStage","wheelStage"];r.forEach(e=>t.on(e,({node:s})=>i(e,"node",s))),g.forEach(e=>t.on(e,({edge:s})=>i(e,"edge",s))),t.on("enterEdge",({edge:e})=>{i("enterEdge","edge",e),n=e,t.refresh()}),t.on("leaveEdge",({edge:e})=>{i("leaveEdge","edge",e),n=null,t.refresh()}),h.forEach(e=>{t.on(e,({event:s})=>{i(e,"positions",s)})})}})},f=`<style>
  html,
  body,
  #storybook-root {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    font-family: sans-serif;
  }
  #sigma-logs {
    position: absolute;
    top: 0;
    overflow: hidden;
  }
  #sigma-logs > div {
    padding: 3px;
  }
  #sigma-logs > div > span {
    background: #ffffff99;
  }
</style>
<sigma-shadow></sigma-shadow>
<div id="sigma-logs"></div>
`,w=`import Graph from "graphology";
import Sigma from "sigma";
import { MouseCoords } from "sigma/types";

import data from "../../_data/data.json";

export default () => {
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

  window.customElements.define(
    "sigma-shadow",
    class extends HTMLElement {
      _container: HTMLDivElement | null = null;

      constructor() {
        super();
      }

      connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: "open" });
        const container = document.createElement("div");
        container.style.cssText = \`
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden;
            \`;
        this._container = container;
        shadowRoot.appendChild(container);

        let hoveredEdge: null | string = null;
        const renderer = new Sigma(graph, this._container, {
          enableEdgeEvents: true,
          edgeReducer(edge, data) {
            const res = { ...data };
            if (edge === hoveredEdge) res.color = "#cc0000";
            return res;
          },
        });

        // Put the mouse canvas on top, so events can be catched even if the logs container is in front
        renderer.getCanvases().mouse.style.cssText = "z-index: 100; position: absolute";

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
      }
    },
  );
};
`,T={id:"events-shadowdom",title:"Core library/Advanced use cases"},k={name:"Events ShadowDom",render:()=>f,play:v(u),parameters:{storySource:{source:w}}};export{T as default,k as story};
