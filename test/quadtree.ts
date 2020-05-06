/**
 * Sigma.js QuadTree Unit Tests
 * =============================
 *
 * Testing the quadtree class.
 */
// import assert from 'assert';
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

  const tree = new QuadTree({boundaries: {x: 0, y: 0, width: 500, height: 500}});

  nodes.forEach(node => (tree.add(node.key, node.x, node.y, node.size)));

  // console.log(tree.point(10, 14));
});
