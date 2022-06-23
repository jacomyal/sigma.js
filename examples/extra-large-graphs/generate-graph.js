/**
 * This example aims at showcasing sigma's performances.
 */

const fs = require('fs');
const seedrandom = require('seedrandom');

const {Graph} = require('graphology');

const circlepack = require( "graphology-layout/circlepack");
const clusters = require( "graphology-generators/random/clusters");

const rng = seedrandom("sigma");
const state = {
  order: 1000000,
  size: 2000000,
  clusters: 3,
  edgesRenderer: 'edges-fast'
};

// 1. Generate a graph:
const graph = clusters(Graph, { ...state, rng });
circlepack.assign(graph, {
  hierarchyAttributes: ["cluster"],
});
const colors = {};
for (let i = 0; i < +state.clusters; i++) {
  colors[i] = "#" + Math.floor(rng() * 16777215).toString(16);
}
let i = 0;
graph.forEachNode((node, { cluster }) => {
  graph.mergeNodeAttributes(node, {
    size: graph.degree(node) / 3,
    label: `Node n°${++i}, in cluster n°${cluster}`,
    color: colors[cluster + ""],
  });
});

// 2. Save the graph:
fs.writeFile('./large-graph.json', JSON.stringify(graph.toJSON(), {}, 2), (err) => {
  if(err) {
    console.log('unable to savfe file');
  } else {
    console.log('file saved?');
  }
});
console.log('Finished step 2');
