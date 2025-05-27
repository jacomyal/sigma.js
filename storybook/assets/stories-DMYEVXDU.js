import{G as u,S as c,w as p}from"./sigma-BsJT_GRv.js";import{d as f}from"./data-Bz6iBPrE.js";import"./_commonjsHelpers-C4iS2aBk.js";const m=()=>{const h=document.getElementById("sigma-container"),a=document.getElementById("search-input"),l=document.getElementById("suggestions"),s=new u;s.import(f);const o=new c(s,h),e={searchQuery:""};l.innerHTML=s.nodes().map(n=>`<option value="${s.getNodeAttribute(n,"label")}"></option>`).join(`
`);function d(n){if(e.searchQuery=n,a.value!==n&&(a.value=n),n){const i=n.toLowerCase(),t=s.nodes().map(r=>({id:r,label:s.getNodeAttribute(r,"label")})).filter(({label:r})=>r.toLowerCase().includes(i));if(t.length===1&&t[0].label===n){e.selectedNode=t[0].id,e.suggestions=void 0;const r=o.getNodeDisplayData(e.selectedNode);o.getCamera().animate(r,{duration:500})}else e.selectedNode=void 0,e.suggestions=new Set(t.map(({id:r})=>r))}else e.selectedNode=void 0,e.suggestions=void 0;o.refresh({skipIndexation:!0})}function g(n){n&&(e.hoveredNode=n,e.hoveredNeighbors=new Set(s.neighbors(n))),n||(e.hoveredNode=void 0,e.hoveredNeighbors=void 0),o.refresh({skipIndexation:!0})}return a.addEventListener("input",()=>{d(a.value||"")}),a.addEventListener("blur",()=>{d("")}),o.on("enterNode",({node:n})=>{g(n)}),o.on("leaveNode",()=>{g(void 0)}),o.setSetting("nodeReducer",(n,i)=>{const t={...i};return e.hoveredNeighbors&&!e.hoveredNeighbors.has(n)&&e.hoveredNode!==n&&(t.label="",t.color="#f6f6f6"),e.selectedNode===n?t.highlighted=!0:e.suggestions&&(e.suggestions.has(n)?t.forceLabel=!0:(t.label="",t.color="#f6f6f6")),t}),o.setSetting("edgeReducer",(n,i)=>{const t={...i};return e.hoveredNode&&!s.extremities(n).every(r=>r===e.hoveredNode||s.areNeighbors(r,e.hoveredNode))&&(t.hidden=!0),e.suggestions&&(!e.suggestions.has(s.source(n))||!e.suggestions.has(s.target(n)))&&(t.hidden=!0),t}),()=>{o.kill()}},y=`<!doctype html>
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
        margin: 0 !important;
        padding: 0 !important;
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
`,v=`/**
 * This example showcases sigma's reducers, which aim to facilitate dynamically
 * changing the appearance of nodes and edges, without actually changing the
 * main graphology data.
 */
import Graph from "graphology";
import Sigma from "sigma";
import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

import data from "../../_data/data.json";

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

    if (!node) {
      state.hoveredNode = undefined;
      state.hoveredNeighbors = undefined;
    }

    // Refresh rendering
    renderer.refresh({
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

    if (
      state.hoveredNode &&
      !graph.extremities(edge).every((n) => n === state.hoveredNode || graph.areNeighbors(n, state.hoveredNode))
    ) {
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

  return () => {
    renderer.kill();
  };
};
`,I={id:"use-reducers",title:"Core library/Features showcases"},S={name:"Use node and edge reducers",render:()=>y,play:p(m),args:{},parameters:{storySource:{source:v}}};export{I as default,S as story};
