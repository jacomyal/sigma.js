/**
 * This example aims at showcasing sigma's performances.
 */

import {Table} from 'apache-arrow';
import Graph from 'graphology';
import clusters from 'graphology-generators/random/clusters';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2Layout from 'graphology-layout-forceatlas2/worker';
import circlepack from 'graphology-layout/circlepack';
import seedrandom from 'seedrandom';
import Sigma from 'sigma';
import Settings from 'sigma';
import NodeDisplayData from 'sigma';
import EdgesDefaultProgram from 'sigma/rendering/webgl/programs/edge';
import EdgesFastProgram from 'sigma/rendering/webgl/programs/edge.fast';
import {ConsoleLogger} from 'typedoc/dist/lib/utils';

import EdgesGpuProgram from './edge.gpu';
import gpuLoader from './gpu-loader';
import NodesGpuProgram from './node.gpu';
import RapidsGraphologyGraph from './rapids-graph'

const rng = seedrandom('sigma');

(async function() {

  // Load the graph via node-rapids. It will be resident on your
  // local GPU.
  await gpuLoader.init();
  const bounds  = await gpuLoader.getNodesBounds();
  const nodes   = await gpuLoader.getNodesBuffer();
  const edges   = await gpuLoader.getEdgesBuffer();
  const options = await gpuLoader.getTable('options');
  const graph   = new RapidsGraphologyGraph(nodes, edges, options);
  graph.setExtent(JSON.parse(bounds.toString()).bounds);
  
  console.log('Nodes size: ' + nodes.numRows / 4);
  console.log('Edges size: ' + edges.numRows / 6);

  // Render the graph:
  const container = document.getElementById('sigma-container') as HTMLElement;
  const renderer  = new Sigma(graph, container, {
    defaultEdgeColor: '#e6e6e6',
    defaultEdgeType: 'edges-fast',
    edgeProgramClasses: {
      'edges-default': EdgesGpuProgram,
      'edges-fast': EdgesGpuProgram,
    },
    nodeProgramClasses: {
      'circle': NodesGpuProgram,
    },
  });

  // Enable FA2 button:
  const fa2Button        = document.getElementById('fa2') as HTMLButtonElement;
  const sensibleSettings = forceAtlas2.inferSettings(graph);
  const fa2Layout        = new FA2Layout(graph, {
    settings: sensibleSettings,
  });
  function toggleFA2Layout() {
    if (fa2Layout.isRunning()) {
      fa2Layout.stop();
      fa2Button.innerHTML = `Start layout ▶`;
    } else {
      fa2Layout.start();
      fa2Button.innerHTML = `Stop layout ⏸`;
    }
  }
  fa2Button.addEventListener('click', toggleFA2Layout);
})();
