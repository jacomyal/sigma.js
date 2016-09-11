import Graph from 'graphology';
import Sigma from '../src/sigma';
import CanvasRenderer from '../src/renderers/canvas';

const graph = new Graph();
graph.addNode('John');

const renderer = new CanvasRenderer(document.getElementById('container'));

const sigma = new Sigma(graph, renderer);
