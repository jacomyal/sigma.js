const fs = require('fs');
const seedrandom = require('seedrandom');

const {Graph} = require('graphology');

const circlepack = require( 'graphology-layout/circlepack');
const clusters = require( 'graphology-generators/random/clusters');

try {
  const args = process.argv.slice(2);
  const order = Number(args[0]);
  const size = Number(args[1]);
  const num_clusters = Number(args[2]);
  const outputName = args[3];
  const rng = seedrandom('sigma');
  const state = {
    size: size,
    order: order,
    clusters: num_clusters,
    edgesRenderer: 'edges-fast'
  };

  // 1. Generate a graph:
  const graph = clusters(Graph, { ...state, rng });
  circlepack.assign(graph, {
    hierarchyAttributes: ['cluster'],
  });
  const colors = {};
  for (let i = 0; i < +state.clusters; i++) {
    colors[i] = '#' + Math.floor(rng() * 16777215).toString(16);
  }
  let i = 0;
  graph.forEachNode((node, { cluster }) => {
    graph.mergeNodeAttributes(node, {
      size: graph.degree(node) > 1 ? graph.degree(node) / 2 : 1,
      label: `Node n°${++i}, in cluster n°${cluster}`,
      color: colors[cluster + ''],
    });
  });

  // 2. Save the graph:
  fs.writeFileSync(outputName, JSON.stringify(graph.toJSON(), {}, 2), (err) => {
    if(err) {
      console.log('unable to save file');
    } else {
      console.log('file saved');
    }
  });
  console.log('Graph Generated.');
  console.log('You must copy the output file to');
  console.log('');
  console.log('node/modules/demo/api-server/routes/public/graphology.json');
  console.log('to use with node-rapids/demo-api-server');
  console.log('and sigma.js/examples/extra-large-graph');
}
catch (e) {
  console.log('Exception');
  console.log(e);
  console.log('');
  console.log('generate-graph.js usage:');
  console.log('------------------------');
  console.log('');
  console.log('node generate-graph.js <node_count> <edge_count> <clusters_count> <filename>');
  console.log('');
  console.log('example: ');
  console.log('node generate-graph.js 2000000 1000000 3 graphology.json');
  console.log('');
}

