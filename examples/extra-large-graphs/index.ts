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

  // 2. Read form values to build a full state:
  const state = {
    order: +document.querySelector<HTMLInputElement>('#order')?.value,
    size: +document.querySelector<HTMLInputElement>('#size')?.value,
    clusters: +document.querySelector<HTMLInputElement>('#clusters')?.value,
    edgesRenderer:
      document.querySelector<HTMLInputElement>('[name="edges-renderer"]:checked')?.value,
  };

  // 3. Load the graph from node-rapids
  await gpuLoader.init();
  const bounds  = await gpuLoader.getNodesBounds();
  const nodes   = await gpuLoader.getNodesBuffer();
  const edges   = await gpuLoader.getEdgesBuffer();
  const options = await gpuLoader.getTable('options');
  const graph   = new RapidsGraphologyGraph(nodes, edges, options);
  graph.setExtent(JSON.parse(bounds.toString()).bounds);

  // 3. Generate a graph:
  /*
  const small_graph = clusters(Graph, {...state, rng});
  circlepack.assign(small_graph, {
    hierarchyAttributes: ['cluster'],
  });
  const colors: Record<string, string> = {};
  for (let i = 0; i < +state.clusters; i++) {
    colors[i] = '#' + Math.floor(rng() * 16777215).toString(16);
  }
  let i = 0;
  small_graph.forEachNode((node, {cluster}) => {small_graph.mergeNodeAttributes(node, {
                            size: small_graph.degree(node) * 4,
                            label: `Node n°${++i}, in cluster n°${cluster}`,
                            color: colors[cluster + ''],
                          })});
                          */

  // create random clusters from random source
  // set the graph to have cluster attributes
  // create n random colors
  // for each node in the cluster
  //   set the size based on its connectedness
  //   give it an increasing label index
  //   set the color based on the cluster

  // 4. Render the graph:
  const container = document.getElementById('sigma-container') as HTMLElement;
  const renderer  = new Sigma(graph, container, {
    defaultEdgeColor: '#e6e6e6',
    defaultEdgeType: state.edgesRenderer,
    edgeProgramClasses: {
      'edges-default': EdgesGpuProgram,
      'edges-fast': EdgesGpuProgram,
    },
    nodeProgramClasses: {
      'circle': NodesGpuProgram,
    },
  });
  // Object.defineProperty(renderer, 'nodeDataCache', {value: graph._gpu_nodes})
  // Object.defineProperty(renderer, 'process', {value: () => { console.log('no more processing.')
  // }})

  // 5. Enable FA2 button:
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

  // Cheap trick: tilt the camera a bit to make labels more readable:
  renderer.getCamera().setState({
    angle: 0.2,
  });
})();
