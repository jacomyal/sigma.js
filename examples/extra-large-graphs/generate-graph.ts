/**
 * This example aims at showcasing sigma's performances.
 */

const fs         = require('fs');
const seedrandom = require('seedrandom');

const {Graph} = require('graphology');

const circlepack  = require('graphology-layout/circlepack');
const clusters    = require('graphology-generators/random/clusters');
const FA2Layout   = require('graphology-layout-forceatlas2/worker');
const forceAtlas2 = require('graphology-layout-forceatlas2');

const rng   = seedrandom('sigma');
const state = {
  order: parseInt(process.argv[2]),
  size: parseInt(process.argv[3]),
  clusters: parseInt(process.argv[4]),
  edgesRenderer: 'edges-fast'
};

// 1. Generate a graph:
const graph = clusters(Graph, {...state, rng});
circlepack.assign(graph, {
  hierarchyAttributes: ['cluster'],
});
const colors = {};
for (let i = 0; i < +state.clusters; i++) {
  colors[i] = '#' + Math.floor(rng() * 16777215).toString(16);
}
let i = 0;
graph.forEachNode((node, {cluster}) => {
  graph.mergeNodeAttributes(node, {
    size: graph.degree(node),
    label: `Node n°${++i}, in cluster n°${cluster}`,
    color: colors[cluster + ''],
  });
});

// 2. Save the graph:
fs.writeFile(process.argv[5], JSON.stringify(graph.toJSON(), null, 2), (err) => {
  if (err) {
    console.log('unable to save file');
  } else {
    console.log('file saved?');
  }
});
console.log('Finished step 2');
