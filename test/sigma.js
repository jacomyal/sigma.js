/* eslint no-new: 0 */
/**
 * Sigma.js Core Unit Tests
 * =========================
 *
 * Testing the core class.
 */
import assert from 'assert';
import Graph from 'graphology';
import Sigma from '../src/sigma';

describe('Sigma', function() {

  describe('instantiation', function() {

    it('should throw if the given graph is invalid.', function() {

      assert.throws(function() {
        new Sigma();
      }, /graphology/);

      assert.throws(function() {
        new Sigma(null);
      }, /graphology/);
    });

    it('should throw if the given renderer is invalid.', function() {

      assert.throws(function() {
        new Sigma(new Graph(), null);
      }, /renderer/);
    });
  });
});
