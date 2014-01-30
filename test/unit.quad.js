module('sigma.classes.quad');

// Test Beginning
//================
test('QuadTree', function() {

  // Helpers
  //---------
  function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function generateRandomGraph(nb) {
    var nodes = [];

    for (var i = 0; i < nb; i++) {
      nodes.push({
        x: getRandom(4, 95),
        y: getRandom(4, 95),
        size: getRandom(1, 2),
        data: 'Node#'+i,
        id: i
      });
    }

    return nodes;
  }

  function approx(v) {
    return Math.round(v * 10000) / 10000;
  }

  // Instanciation
  //---------------
  var quad = new sigma.classes.quad(),
      geom = quad._geom;

  // Geometry
  //----------
  var rectangles = [
    {x1: 1, y1: 2, x2: 2, y2: 1, height: Math.sqrt(2)},
    {x1: 3, y1: 4, x2: 4, y2: 3, height: Math.sqrt(2)},
    {x1: 2, y1: 2, x2: 4, y2: 2, height: 1},
    {x1: 10, y1: 10, x2: 12, y2: 10, height: 2},
    {x1: 2, y1: 6, x2: 6, y2: 6, height: 4}
  ];

  var llc = geom.lowerLeftCoor(rectangles[0]);

  strictEqual(geom.isAxisAligned(rectangles[0]), false, 'Non Axis Aligned');
  strictEqual(geom.isAxisAligned(rectangles[2]), true, 'Axis Aligned');

  var topCorners = {x1: 2, y1: 2, x2: 4, y2: 2, height: 2};
  deepEqual(
    geom.axisAlignedTopPoints({x1: 2, y1: 2, x2: 4, y2: 2, height: 2}),
    topCorners,
    'Non-rotated top points'
  );

  deepEqual(
    geom.axisAlignedTopPoints({x1: 4, y1: 2, x2: 4, y2: 4, height: 2}),
    topCorners,
    'Right shift top points'
  );

  deepEqual(
    geom.axisAlignedTopPoints({x1: 2, y1: 4, x2: 2, y2: 2, height: 2}),
    topCorners,
    'Left shift top points'
  );

  deepEqual(
    geom.axisAlignedTopPoints({x1: 4, y1: 4, x2: 2, y2: 4, height: 2}),
    topCorners,
    'Bottom\'s up top points'
  );

  deepEqual(
    llc,
    {x: 2, y: 3},
    'Lower Left Corner'
  );

  deepEqual(
    geom.lowerRightCoor(rectangles[0], llc),
    {x: 3, y: 2},
    'Lower Right Corner'
  );

  var projection = geom.projection({x: 2, y: 6}, {x: 3, y: 4});
  deepEqual(
    {x: approx(projection.x), y: approx(projection.y)},
    {x: 3.6, y: 4.8},
    'Projection'
  );

  var solutions = [
    [
      {x: 1, y: 2},
      {x: 2, y: 1},
      {x: 2, y: 3},
      {x: 3, y: 2}
    ],
    [
      {x: 3, y: 4},
      {x: 4, y: 3},
      {x: 4, y: 5},
      {x: 5, y: 4}
    ],
    [
      {x: 2, y: 2},
      {x: 4, y: 2},
      {x: 2, y: 3},
      {x: 4, y: 3}
    ],
    [
      {x: 10, y: 10},
      {x: 12, y: 10},
      {x: 10, y: 12},
      {x: 12, y: 12}
    ],
    [
      {x: 2, y: 6},
      {x: 6, y: 6},
      {x: 2, y: 10},
      {x: 6, y: 10}
    ],
    [
      {x: 2, y: 2},
      {x: 6, y: 2},
      {x: 2, y: 6},
      {x: 6, y: 6}
    ]
  ];

  deepEqual(
    geom.pointToSquare({x: 4, y: 4, size: 2}),
    {x1: 2, y1: 2, x2: 6, y2: 2, height: 4},
    'Point to Square'
  );

  rectangles.map(function(r, i) {
    deepEqual(
      geom.rectangleCorners(r),
      solutions[i],
      'Rectangle Corners #'+i
    );
  });

  var cr = [
    geom.rectangleCorners({x1: 4, y1: 6, x2: 6, y2: 4, height: Math.sqrt(8)}),
    geom.rectangleCorners({x1: 4, y1: 8, x2: 6, y2: 6, height: Math.sqrt(8)}),
    geom.rectangleCorners({x1: 10, y1: 10, x2: 12, y2: 10, height: 2}),
    geom.rectangleCorners({x1: 0, y1: 0, x2: 200, y2: 200, height: 200}),
    geom.rectangleCorners({x1: 200, y1: 200, x2: 400, y2: 400, height: 200})
  ];

  strictEqual(geom.collision(cr[0], cr[1]), true, 'Collision');
  strictEqual(geom.collision(cr[0], cr[2]), false, 'Non-Collision');
  strictEqual(geom.collision(cr[0], cr[3]), true, 'Containing Collision');
  strictEqual(geom.collision(cr[0], cr[4]), false, 'Outbounding Collision');

  deepEqual(
    geom.splitSquare({x: 0, y: 0, width: 100, height: 100}),
    [
      [{x: 0, y: 0}, {x: 50, y: 0}, {x: 0, y: 50}, {x: 50, y: 50}],
      [{x: 50, y: 0}, {x: 100, y: 0}, {x: 50, y: 50}, {x: 100, y: 50}],
      [{x: 0, y: 50}, {x: 50, y: 50}, {x: 0, y: 100}, {x: 50, y: 100}],
      [{x: 50, y: 50}, {x: 100, y: 50}, {x: 50, y: 100}, {x: 100, y: 100}]
    ],
    'Split Square'
  );


  // Quad Tree
  //-----------
  // var nodes = generateRandomGraph(1000);

  // var tree = quad.index(
  //   nodes,
  //   {
  //     bounds: {
  //       x: 0,
  //       y: 0,
  //       width: 100,
  //       height: 100
  //     },
  //     maxLevel: 4
  //   }
  // );

  // console.log(tree);
  // console.log(quad.point(34, 53));
  // console.log(quad.area({x1: 25, y1: 25, x2: 30, y2: 25, height: 10}));
  // console.log(quad.area({x1: 0, y1: 0, x2: 100, y2: 0, height: 100}).length);
});
