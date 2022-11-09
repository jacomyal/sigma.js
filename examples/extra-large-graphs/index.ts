/**
 * NVIDIA 2022 (c)
 * This example aims at showcasing sigma's performances.
 */

import {Table} from 'apache-arrow';
import Sigma from 'sigma';
import Graph from 'graphology';

import EdgesGpuProgram from './edge.gpu';
import gpuLoader from './gpu-loader';
import NodesGpuProgram from './node.gpu';
import RapidsGraphologyGraph from './rapids-graph'

import EdgesDefaultProgram from "sigma/rendering/webgl/programs/edge";
import EdgesFastProgram from "sigma/rendering/webgl/programs/edge.fast";

import circlepack from "graphology-layout/circlepack";
import clusters from "graphology-generators/random/clusters";

import seedrandom from "seedrandom";
const rng = seedrandom("sigma");

// node-rapids demo for sigma.js
(async function() {
  await (async function() {
    console.log('extra-large-graphs');

    // Load the graph via node-rapids. It will be resident on your
    // local GPU.
    const t0 = performance.now();
    await gpuLoader.init();
    const bounds  = await gpuLoader.getNodesBounds();
    const nodes   = await gpuLoader.getNodesBuffer();
    const edges   = await gpuLoader.getEdgesBuffer();
    const options = await gpuLoader.getTable('options');
    const graph   = new RapidsGraphologyGraph(nodes, edges, options);
    graph.setExtent(JSON.parse(bounds.toString()).bounds);
    const t1 = performance.now();
    const ioTime = t1 - t0;
    
    // Render the graph:
    const container = document.getElementById('sigma-gpu-container') as HTMLElement;
    const t2 = performance.now();
    const renderer  = new Sigma(graph, container, {
      defaultEdgeColor: '#e6e6e6',
      defaultEdgeType: 'edges-fast',
      edgeProgramClasses: {
        'edges-fast': EdgesGpuProgram,
      },
      nodeProgramClasses: {
        'circle': NodesGpuProgram,
      },
    });
    const t3 = performance.now();
    const renderTime = t3 - t2;

    const updateFields = () => {
      const orderField = document.getElementById('order_gpu') as HTMLDivElement;
      orderField.innerHTML = String(nodes.numRows / 4);
      const sizeField = document.getElementById('size_gpu') as HTMLDivElement;
      sizeField.innerHTML = String(edges.numRows / 6);
      const ioTimeField = document.getElementById('io_time_gpu') as HTMLDivElement;
      ioTimeField.innerHTML = String(ioTime) + ' msec';
      const renderTimeField = document.getElementById('render_time_gpu') as HTMLDivElement;
      renderTimeField.innerHTML = String(renderTime) + ' msec';
    };

    setTimeout(() => {
      updateFields();
    }, 100);
  })();

  // Original demo, plus performance measures

  await (async function() {
    console.log('large-graphs');

    // 1. Read query string, and set form values accordingly:
    const query = new URLSearchParams(location.search).entries();
    for (const [key, value] of query) {
      const domList = document.getElementsByName(key);
      if (domList.length === 1) {
        (domList[0] as HTMLInputElement).value = value;
      } else if (domList.length > 1) {
        domList.forEach((dom: HTMLElement) => {
          const input = dom as HTMLInputElement;
          input.value = value;
          input.checked = input.value === value;
        });
      }
    }

    // 2. Read form values to build a full state:
    const state = {
      order: +document.querySelector<HTMLInputElement>("#order")?.value,
      size: +document.querySelector<HTMLInputElement>("#size")?.value,
      clusters: +document.querySelector<HTMLInputElement>("#clusters")?.value,
      edgesRenderer: document.querySelector<HTMLInputElement>('[name="edges-renderer"]:checked')?.value,
    };

    const t0 = performance.now();
    // 3. Generate a graph:
    const graph = clusters(Graph, { ...state, rng });
    circlepack.assign(graph, {
      hierarchyAttributes: ["cluster"],
    });
    const colors: Record<string, string> = {};
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
    const t1 = performance.now();
    const generateTime = t1 - t0;

    // 4. Render the graph:
    const t2 = performance.now();
    const container = document.getElementById("sigma-container") as HTMLElement;
    const renderer = new Sigma(graph, container, {
      defaultEdgeColor: "#e6e6e6",
      defaultEdgeType: state.edgesRenderer,
      edgeProgramClasses: {
        "edges-default": EdgesDefaultProgram,
        "edges-fast": EdgesFastProgram,
      },
    });
    const t3 = performance.now();
    const renderTimeHost = t3 - t2;
    
    // Cheap trick: tilt the camera a bit to make labels more readable:
    renderer.getCamera().setState({
      angle: 0.2,
    });
    
    const updateFieldsHost = () => {
      const ioTimeField = document.getElementById('io_time_host') as HTMLDivElement;
      ioTimeField.innerHTML = String(generateTime) + ' msec';
      const renderTimeField = document.getElementById('render_time_host') as HTMLDivElement;
      renderTimeField.innerHTML = String(renderTimeHost) + ' msec';
    };

    setTimeout(() => {
      updateFieldsHost();
    }, 100);
  })();
})();
