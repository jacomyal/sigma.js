import Graph from "graphology";
import Sigma from "sigma";
import { circular } from "graphology-layout";
import { PlainObject } from "sigma/types";
import { animateNodes } from "sigma/utils/animate";
import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { RelativeSize } from "react-sigma-v2";

// import data from './json/water-links.json' assert { type: 'JSON' };
import Anodes from "./json/taxonomy.json";
import Arelated from "./json/taxonomy-related.json";
import Aparents from "./json/taxonomy-parents.json";

//const waterNodes = JSON.parse(Wnodes);
//console.log(Wnodes[0].tid);
import Tnodes from "./json/test-nodes.json";
import Tlinks from "./json/test-links.json";

const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchSuggestions = document.getElementById(
  "suggestions"
) as HTMLDataListElement;
const FA2Button = document.getElementById("forceatlas2");
const randomButton = document.getElementById("random");
const circularButton = document.getElementById("circular");

var nodeList = [];
var nameList = [];
var reList = [];
var paList = [];
var vidList = [];
var colorList = ["#4695d6","#fed95c","#fa6e57","#f69e53"];

// <----- push nodes ----->
Anodes.forEach((node) => {
  nodeList.push(node.tid);
  nameList.push(node.name);
  vidList.push(node.vid);
});

// var temp = [];
// var NTlinks = Tlinks.filter((item)=>{
//   if(!temp.includes(item.id)){
//     temp.push(item);
//     console.log(temp);
//     return true;
//   }
// })
// console.log(NTlinks);
// console.log(temp);

// <----- Deduplication ----->
const relinks = Arelated.filter(
  (thing, index, self) => index === self.findIndex((t) => t.uuid === thing.uuid)
);
// <----- push related links ----->
relinks.forEach((node) => {
  //console.log(node.source);
  node.target.forEach((target) => {
    //console.log(target);
    reList.push([node.source, target]);
  });
});
// console.log(paList.length)
//console.log(linkList)
// var mylinks = [];
// for (let i = 0; i < 5; i++) {
//   if (!mylinks.includes(linkList[i])) {
//     mylinks.push(linkList[i]);
//     console.log(mylinks);
//   }
// }
// console.log(Array.from(new Set(mylinks)));
// console.log(reList.length);
//console.log(links.length);
//console.log(linkList.indexOf(linkList[7]));

// for(let i=1;i<20;i++){
//   if(linkList[i][0]===linkList[i-1][0]&&linkList[i][1]===linkList[i-1][1]){
//     console.log(linkList[i]);
//     linkList.splice(i, 1);
//   }
// }
// var linknew = Array.from(new Set(linkList));

// <----- Deduplication ----->
const palinks = Aparents.filter(
  (thing, index, self) => index === self.findIndex((t) => t.uuid === thing.uuid)
);

// <----- push parent links ----->
palinks.forEach((node) => {
  paList.push([node.source, node.target[0]]);
});
// console.log(paList.slice(1,5))
// console.log(paList.length)

const container = document.getElementById("sigma-container") as HTMLElement;

const graph = new Graph();

for (let i = 0; i < nodeList.length; i++) {
  // if (nodeList.lastIndexOf(nodeList[i]) > i) {
  //   //console.log(nodeList.lastIndexOf(nodeList[i]));
  //   continue;
  // } else {
  if (vidList[i] == "Tags") {
    graph.addNode(nodeList[i], {
      x: Math.random() * 500,
      y: Math.random() * 400,
      size: 3,
      label: nameList[i],
      color: colorList[0]
    });
  } else if (vidList[i] == "Water") {
    graph.addNode(nodeList[i], {
      x: Math.random() * 500,
      y: Math.random() * 400,
      size: 3,
      label: nameList[i],
      color: colorList[1]
    });
  } else if (vidList[i] == "Space") {
    graph.addNode(nodeList[i], {
      x: Math.random() * 500,
      y: Math.random() * 400,
      size: 3,
      label: nameList[i],
      color: colorList[2]
    });
  } else if (vidList[i] == "Environmental Terms") {
    graph.addNode(nodeList[i], {
      x: Math.random() * 500,
      y: Math.random() * 400,
      size: 3,
      label: nameList[i],
      color: colorList[3]
    });
  }
}

// <----- add related links ----->
for (let i = 0; i < reList.length; i++) {
  if (
    graph.hasNode(reList[i][0]) &&
    graph.hasNode(reList[i][1]) &&
    !graph.hasEdge(reList[i][0], reList[i][1])
  ) {
    graph.addUndirectedEdge(reList[i][0], reList[i][1], {
      type: "line",
      color: "#4d9ab8",
      size: 1
    });
    //continue;
    //console.log(linkList[i]);
  }
}
// console.log(graph.size);
// <----- add parent links ----->
for (let i = 0; i < paList.length; i++) {
  if (
    graph.hasNode(paList[i][0]) &&
    graph.hasNode(paList[i][1]) &&
    !graph.hasEdge(paList[i][0], paList[i][1])
  ) {
    graph.addEdge(paList[i][0], paList[i][1], {
      type: "arrow",
      color: "#034862",
      size: 1
    });
    //continue;
    //console.log(linkList[i]);
  }
}
// console.log(graph.size);

// // circle layout
// graph.nodes().forEach((node, i) => {
//   const angle = (i * 2 * Math.PI) / graph.order;
//   graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
//   graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
// });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderer = new Sigma(graph, container);

interface State {
  hoveredNode?: string;
  searchQuery: string;

  selectedNode?: string;
  suggestions?: Set<string>;

  hoveredNeighbors?: Set<string>;
}
const state: State = { searchQuery: "" };

searchSuggestions.innerHTML = graph
  .nodes()
  .map(
    (node) =>
      `<option value="${graph.getNodeAttribute(node, "label")}"></option>`
  )
  .join("\n");

function setSearchQuery(query: string) {
  state.searchQuery = query;

  if (searchInput.value !== query) searchInput.value = query;

  if (query) {
    const lcQuery = query.toLowerCase();
    const suggestions = graph
      .nodes()
      .map((n) => ({
        id: n,
        label: graph.getNodeAttribute(n, "label") as string
      }))
      .filter(({ label }) => label.toLowerCase().includes(lcQuery));

    if (suggestions.length === 1 && suggestions[0].label === query) {
      state.selectedNode = suggestions[0].id;
      state.suggestions = undefined;

      // Move the camera to center it on the selected node:
      const nodePosition = renderer.getNodeDisplayData(
        state.selectedNode
      ) as Coordinates;
      renderer.getCamera().animate(nodePosition, {
        duration: 500
      });
    }
    // Else display the suggestions list:
    else {
      state.selectedNode = undefined;
      state.suggestions = new Set(suggestions.map(({ id }) => id));
    }
  }
  // If the query is empty,  reset the selectedNode / suggestions state:
  else {
    state.selectedNode = undefined;
    state.suggestions = undefined;
  }

  // Refresh rendering:
  // renderer.graph.read(graph)
  // Sigma.plugins.RelativeSize(renderer, 1);
  renderer.refresh();
}

// Bind search input interactions:
searchInput.addEventListener("input", () => {
  setSearchQuery(searchInput.value || "");
});
searchInput.addEventListener("blur", () => {
  setSearchQuery("");
});

function setHoveredNode(node?: string) {
  if (node) {
    state.hoveredNode = node;
    state.hoveredNeighbors = new Set(graph.neighbors(node));
  } else {
    state.hoveredNode = undefined;
    state.hoveredNeighbors = undefined;
  }
  renderer.refresh();
}

// Bind graph interactions:
renderer.on("enterNode", ({ node }) => {
  setHoveredNode(node);
});
renderer.on("leaveNode", () => {
  setHoveredNode(undefined);
});

renderer.on("clickNode", ({ node }) => {
  console.log("clicked" + node);
  window.open(`https://space4water.org/taxonomy/term/${node}`);
});

renderer.setSetting("nodeReducer", (node, data) => {
  const res: Partial<NodeDisplayData> = { ...data };

  if (
    state.hoveredNeighbors &&
    !state.hoveredNeighbors.has(node) &&
    state.hoveredNode !== node
  ) {
    res.label = "";
    //res.color = "#243127";
    res.color = "#efefef";
  }

  if (state.selectedNode === node) {
    res.highlighted = true;
  } else if (state.suggestions && !state.suggestions.has(node)) {
    res.label = "";
    res.color = "#243127";
  }

  return res;
});

renderer.setSetting("edgeReducer", (edge, data) => {
  const res: Partial<EdgeDisplayData> = { ...data };

  if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
    res.hidden = true;
  }

  if (
    state.suggestions &&
    (!state.suggestions.has(graph.source(edge)) ||
      !state.suggestions.has(graph.target(edge)))
  ) {
    res.hidden = true;
  }

  return res;
});

/*** FA2 LAYOUT ***/

const sensibleSettings = forceAtlas2.inferSettings(graph);
const fa2Layout = new FA2Layout(graph, {
  settings: sensibleSettings
});

// toggle state between start and stop
let cancelCurrentAnimation: (() => void) | null = null;

// correlate start/stop actions with state management
function stopFA2() {
  fa2Layout.stop();
}
function startFA2() {
  if (cancelCurrentAnimation) cancelCurrentAnimation();
  fa2Layout.start();
  //window.setTimeout(function() {renderer.killForceAtlas2()}, 10000);
}

// toggle function
function toggleFA2Layout() {
  if (fa2Layout.isRunning()) {
    stopFA2();
  } else {
    startFA2();
  }
}
FA2Button.addEventListener("click", toggleFA2Layout);

/*** RANDOM LAYOUT ***/
function randomLayout() {
  // stop fa2 if running
  if (fa2Layout.isRunning()) stopFA2();
  if (cancelCurrentAnimation) cancelCurrentAnimation();

  // to keep positions scale uniform between layouts, we first calculate positions extents
  const xExtents = { min: 0, max: 0 };
  const yExtents = { min: 0, max: 0 };
  graph.forEachNode((node, attributes) => {
    xExtents.min = Math.min(attributes.x, xExtents.min);
    xExtents.max = Math.max(attributes.x, xExtents.max);
    yExtents.min = Math.min(attributes.y, yExtents.min);
    yExtents.max = Math.max(attributes.y, yExtents.max);
  });
  const randomPositions: PlainObject<PlainObject<number>> = {};
  graph.forEachNode((node) => {
    randomPositions[node] = {
      x: Math.random() * (xExtents.max - xExtents.min),
      y: Math.random() * (yExtents.max - yExtents.min)
    };
  });
  // update new positions
  cancelCurrentAnimation = animateNodes(graph, randomPositions, {
    duration: 2000
  });
}

randomButton.addEventListener("click", randomLayout);

/*** CIRCULAR LAYOUT ***/

function circularLayout() {
  // stop fa2 if running
  if (fa2Layout.isRunning()) stopFA2();
  if (cancelCurrentAnimation) cancelCurrentAnimation();

  const circularPositions = circular(graph, { scale: 100 });
  // circular.assign(graph, {scale:100})
  cancelCurrentAnimation = animateNodes(graph, circularPositions, {
    duration: 2000,
    easing: "linear"
  });
}

circularButton.addEventListener("click", circularLayout);

// console.log("number of graph nodes:" + graph.order);
// console.log("number of graph edges:" + graph.size);
// console.log("type of graph:" + graph.type);
// console.log("number of nodes:" + nodeList.length);
// console.log("number of parent links:" + paList.length);
// console.log("number of related links:" + reList.length);

graph.forEachNode((node) => {
  graph.setNodeAttribute(node, "size", 1.5 * Math.sqrt(graph.degree(node)));
});

// console.log(graph.degree("1370"));
// console.log(graph.getNodeAttribute("1370", "size"));
// console.log(graph.getNodeAttribute("2203", "size"));

//trick: tilt the camera a bit to make labels more readable:
renderer.getCamera().setState({
  angle: 0.1
});
