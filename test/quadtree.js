/**
 * Sigma.js QuadTree Unit Tests
 * =============================
 *
 * Testing the quadtree class.
 */
import assert from 'assert';
import QuadTree from '../src/quadtree';

describe('QuadTree', function() {
  const nodes = [
    {
      key: 'a',
      x: 394,
      y: 10,
      size: 1
    },
    {
      key: 'b',
      x: 12,
      y: 10,
      size: 3
    }
  ];

  const tree = new QuadTree(nodes, {x: 0, y: 0, width: 500, height: 500});

  console.log(tree.point(140, 140));
});
