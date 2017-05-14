import {UndirectedGraph} from 'graphology';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import randomLayout from 'graphology-layout/random';
import Sigma from '../src/sigma';
import WebGLRenderer from '../src/renderers/webgl';

const container = document.getElementById('container');

const graph = erdosRenyi(UndirectedGraph, {n: 20, probability: 0.7});
randomLayout.assign(graph);

const renderer = new WebGLRenderer(container);

new Sigma(graph, renderer);
