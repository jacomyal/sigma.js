import{G as p,S as m,o as f}from"./utils-Ph0PoCvK.js";import{d as v}from"./data-ro0eVT-D.js";import"./_commonjsHelpers-BosuxZz1.js";const y=()=>{const c=document.getElementById("sigma-container"),i=document.getElementById("search-input"),u=document.getElementById("suggestions"),s=new p;s.import(v);const r=new m(s,c),e={searchQuery:""};u.innerHTML=s.nodes().map(n=>`<option value="${s.getNodeAttribute(n,"label")}"></option>`).join(`
`);function g(n){if(e.searchQuery=n,i.value!==n&&(i.value=n),n){const a=n.toLowerCase(),t=s.nodes().map(o=>({id:o,label:s.getNodeAttribute(o,"label")})).filter(({label:o})=>o.toLowerCase().includes(a));if(t.length===1&&t[0].label===n){e.selectedNode=t[0].id,e.suggestions=void 0;const o=r.getNodeDisplayData(e.selectedNode);r.getCamera().animate(o,{duration:500})}else e.selectedNode=void 0,e.suggestions=new Set(t.map(({id:o})=>o))}else e.selectedNode=void 0,e.suggestions=void 0;r.refresh({skipIndexation:!0})}function l(n){n&&(e.hoveredNode=n,e.hoveredNeighbors=new Set(s.neighbors(n)));const a=s.filterNodes(d=>{var h;return d!==e.hoveredNode&&!((h=e.hoveredNeighbors)!=null&&h.has(d))}),t=new Set(a),o=s.filterEdges(d=>s.extremities(d).some(h=>t.has(h)));n||(e.hoveredNode=void 0,e.hoveredNeighbors=void 0),r.refresh({partialGraph:{nodes:a,edges:o},skipIndexation:!0})}i.addEventListener("input",()=>{g(i.value||"")}),i.addEventListener("blur",()=>{g("")}),r.on("enterNode",({node:n})=>{l(n)}),r.on("leaveNode",()=>{l(void 0)}),r.setSetting("nodeReducer",(n,a)=>{const t={...a};return e.hoveredNeighbors&&!e.hoveredNeighbors.has(n)&&e.hoveredNode!==n&&(t.label="",t.color="#f6f6f6"),e.selectedNode===n?t.highlighted=!0:e.suggestions&&(e.suggestions.has(n)?t.forceLabel=!0:(t.label="",t.color="#f6f6f6")),t}),r.setSetting("edgeReducer",(n,a)=>{const t={...a};return e.hoveredNode&&!s.hasExtremity(n,e.hoveredNode)&&(t.hidden=!0),e.suggestions&&(!e.suggestions.has(s.source(n))||!e.suggestions.has(s.target(n)))&&(t.hidden=!0),t}),f(()=>{r.kill()})},N=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sigma example: Use node and edge reducers</title>
  </head>
  <body>
    <style>
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
      #search {
        position: absolute;
        right: 1em;
        top: 1em;
      }
    </style>
    <div id="sigma-container"></div>
    <div id="search">
      <input type="search" id="search-input" list="suggestions" placeholder="Try searching for a node..." />
      <datalist id="suggestions"></datalist>
    </div>
    <script src="build/bundle.js"><\/script>
  </body>
</html>
`,b=`/**
 * This example showcases sigma's reducers, which aim to facilitate dynamically
 * changing the appearance of nodes and edges, without actually changing the
 * main graphology data.
 */
import Graph from "graphology";
import Sigma from "sigma";
import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

import data from "../_data/data.json";
import { onStoryDown } from "../utils";

export default () => {
  // Retrieve some useful DOM elements:
  const container = document.getElementById("sigma-container") as HTMLElement;
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const searchSuggestions = document.getElementById("suggestions") as HTMLDataListElement;

  // Instantiate sigma:
  const graph = new Graph();
  graph.import(data);
  const renderer = new Sigma(graph, container);

  // Type and declare internal state:
  interface State {
    hoveredNode?: string;
    searchQuery: string;

    // State derived from query:
    selectedNode?: string;
    suggestions?: Set<string>;

    // State derived from hovered node:
    hoveredNeighbors?: Set<string>;
  }
  const state: State = { searchQuery: "" };

  // Feed the datalist autocomplete values:
  searchSuggestions.innerHTML = graph
    .nodes()
    .map((node) => \`<option value="\${graph.getNodeAttribute(node, "label")}"></option>\`)
    .join("\\n");

  // Actions:
  function setSearchQuery(query: string) {
    state.searchQuery = query;

    if (searchInput.value !== query) searchInput.value = query;

    if (query) {
      const lcQuery = query.toLowerCase();
      const suggestions = graph
        .nodes()
        .map((n) => ({ id: n, label: graph.getNodeAttribute(n, "label") as string }))
        .filter(({ label }) => label.toLowerCase().includes(lcQuery));

      // If we have a single perfect match, them we remove the suggestions, and
      // we consider the user has selected a node through the datalist
      // autocomplete:
      if (suggestions.length === 1 && suggestions[0].label === query) {
        state.selectedNode = suggestions[0].id;
        state.suggestions = undefined;

        // Move the camera to center it on the selected node:
        const nodePosition = renderer.getNodeDisplayData(state.selectedNode) as Coordinates;
        renderer.getCamera().animate(nodePosition, {
          duration: 500,
        });
      }
      // Else, we display the suggestions list:
      else {
        state.selectedNode = undefined;
        state.suggestions = new Set(suggestions.map(({ id }) => id));
      }
    }
    // If the query is empty, then we reset the selectedNode / suggestions state:
    else {
      state.selectedNode = undefined;
      state.suggestions = undefined;
    }

    // Refresh rendering
    // You can directly call \`renderer.refresh()\`, but if you need performances
    // you can provide some options to the refresh method.
    // In this case, we don't touch the graph data so we can skip its reindexation
    renderer.refresh({
      skipIndexation: true,
    });
  }
  function setHoveredNode(node?: string) {
    if (node) {
      state.hoveredNode = node;
      state.hoveredNeighbors = new Set(graph.neighbors(node));
    }

    // Compute the partial that we need to re-render to optimize the refresh
    const nodes = graph.filterNodes((n) => n !== state.hoveredNode && !state.hoveredNeighbors?.has(n));
    const nodesIndex = new Set(nodes);
    const edges = graph.filterEdges((e) => graph.extremities(e).some((n) => nodesIndex.has(n)));

    if (!node) {
      state.hoveredNode = undefined;
      state.hoveredNeighbors = undefined;
    }

    // Refresh rendering
    renderer.refresh({
      partialGraph: {
        nodes,
        edges,
      },
      // We don't touch the graph data so we can skip its reindexation
      skipIndexation: true,
    });
  }

  // Bind search input interactions:
  searchInput.addEventListener("input", () => {
    setSearchQuery(searchInput.value || "");
  });
  searchInput.addEventListener("blur", () => {
    setSearchQuery("");
  });

  // Bind graph interactions:
  renderer.on("enterNode", ({ node }) => {
    setHoveredNode(node);
  });
  renderer.on("leaveNode", () => {
    setHoveredNode(undefined);
  });

  // Render nodes accordingly to the internal state:
  // 1. If a node is selected, it is highlighted
  // 2. If there is query, all non-matching nodes are greyed
  // 3. If there is a hovered node, all non-neighbor nodes are greyed
  renderer.setSetting("nodeReducer", (node, data) => {
    const res: Partial<NodeDisplayData> = { ...data };

    if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
      res.highlighted = true;
    } else if (state.suggestions) {
      if (state.suggestions.has(node)) {
        res.forceLabel = true;
      } else {
        res.label = "";
        res.color = "#f6f6f6";
      }
    }

    return res;
  });

  // Render edges accordingly to the internal state:
  // 1. If a node is hovered, the edge is hidden if it is not connected to the
  //    node
  // 2. If there is a query, the edge is only visible if it connects two
  //    suggestions
  renderer.setSetting("edgeReducer", (edge, data) => {
    const res: Partial<EdgeDisplayData> = { ...data };

    if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
      res.hidden = true;
    }

    if (
      state.suggestions &&
      (!state.suggestions.has(graph.source(edge)) || !state.suggestions.has(graph.target(edge)))
    ) {
      res.hidden = true;
    }

    return res;
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,E={id:"use-reducers",title:"Examples"},x={name:"Use node and edge reducers",render:()=>N,play:y,args:{},parameters:{storySource:{source:b}}};export{E as default,x as story};
