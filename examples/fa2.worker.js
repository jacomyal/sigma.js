import iterate from 'graphology-layout-forceatlas2/iterate';

let edges;

const SETTINGS = {
  linLogMode: false,
  outboundAttractionDistribution: false,
  adjustSizes: false,
  edgeWeightInfluence: 0,
  scalingRatio: 1,
  strongGravityMode: false,
  gravity: 1,
  slowDown: 1,
  barnesHutOptimize: true,
  barnesHutTheta: 0.5
};

self.addEventListener('message', function(event) {
  const nodes = new Float32Array(event.data.nodes);

  if (event.data.edges)
    edges = new Float32Array(event.data.edges);

  iterate(
    SETTINGS,
    nodes,
    edges
  );

  self.postMessage({
    nodes: nodes.buffer
  }, [nodes.buffer]);
});
