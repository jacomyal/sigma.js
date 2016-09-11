/**
 * Sigma.js Core Unit Tests
 * =========================
 *
 * Testing the core class.
 */
import assert from 'assert';
import Graph from 'graphology';
import Sigma from '../src/sigma';

const graph = new Graph();
graph.addNodesFrom(['John', 'Mary', 'Martha']);

const sigma = new Sigma(graph);
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
  });
});
