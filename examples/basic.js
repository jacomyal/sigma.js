import Graph from 'graphology';
import Sigma from '../src/sigma';
import CanvasRenderer from '../src/renderers/canvas';

const graph = new Graph();
graph.addNode('John', {x: 50, y: 50, color: 'blue', size: 10});
graph.addNode('Martha', {x: 100, y: 100, color: 'red', size: 10});

const renderer = new CanvasRenderer(document.getElementById('container'));

const sigma = new Sigma(graph, renderer);
