/**
 * Sigma.js Core Unit Tests
 * =========================
 *
 * Testing the core class.
 */
import assert from 'assert';
import Graph from 'graphology';
import Sigma from '../src/sigma';
import CanvasRenderer from '../src/renderers/canvas';

const graph = new Graph();
graph.addNodesFrom(['John', 'Mary', 'Martha']);

const renderer = new CanvasRenderer();

const sigma = new Sigma(graph, renderer);
sigma.refresh();

console.log(sigma);

describe('Sigma', function() {

  describe('instantiation', function() {

    it('should throw if the given graph is invalid.', function() {

      assert.throws(function() {
        const sigma = new Sigma();
      }, /graphology/);

      assert.throws(function() {
        const sigma = new Sigma(null);
      }, /graphology/);
    });

    it('should throw if the given renderer is invalid.', function() {

      assert.throws(function() {
        const sigma = new Sigma(new Graph(), null);
      }, /renderer/);
    });
  });
});
