QUnit.module("sigma.classes.edgequad");

// Test Beginning
//= ===============
QUnit.test("EdgeQuadTree", assert => {
  // Helpers
  //---------
  function approx(v) {
    return Math.round(v * 10000) / 10000;
  }

  // Instanciation
  //---------------
  const quad = new sigma.classes.edgequad();

  const geom = quad._geom;

  // Geometry
  //----------
  const rectangles = [
    { x1: 1, y1: 2, x2: 2, y2: 1, height: Math.sqrt(2) },
    { x1: 3, y1: 4, x2: 4, y2: 3, height: Math.sqrt(2) },
    { x1: 2, y1: 2, x2: 4, y2: 2, height: 1 },
    { x1: 10, y1: 10, x2: 12, y2: 10, height: 2 },
    { x1: 2, y1: 6, x2: 6, y2: 6, height: 4 }
  ];

  const llc = geom.lowerLeftCoor(rectangles[0]);

  assert.strictEqual(
    geom.isAxisAligned(rectangles[0]),
    false,
    "Non Axis Aligned"
  );
  assert.strictEqual(geom.isAxisAligned(rectangles[2]), true, "Axis Aligned");

  const topCorners = { x1: 2, y1: 2, x2: 4, y2: 2, height: 2 };
  assert.deepEqual(
    geom.axisAlignedTopPoints({ x1: 2, y1: 2, x2: 4, y2: 2, height: 2 }),
    topCorners,
    "Non-rotated top points"
  );

  assert.deepEqual(
    geom.axisAlignedTopPoints({ x1: 4, y1: 2, x2: 4, y2: 4, height: 2 }),
    topCorners,
    "Right shift top points"
  );

  assert.deepEqual(
    geom.axisAlignedTopPoints({ x1: 2, y1: 4, x2: 2, y2: 2, height: 2 }),
    topCorners,
    "Left shift top points"
  );

  assert.deepEqual(
    geom.axisAlignedTopPoints({ x1: 4, y1: 4, x2: 2, y2: 4, height: 2 }),
    topCorners,
    "Bottom's up top points"
  );

  assert.deepEqual(llc, { x: 2, y: 3 }, "Lower Left Corner");

  assert.deepEqual(
    geom.lowerRightCoor(rectangles[0], llc),
    { x: 3, y: 2 },
    "Lower Right Corner"
  );

  const projection = geom.projection({ x: 2, y: 6 }, { x: 3, y: 4 });
  assert.deepEqual(
    { x: approx(projection.x), y: approx(projection.y) },
    { x: 3.6, y: 4.8 },
    "Projection"
  );

  const solutions = [
    [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 2 }],
    [{ x: 3, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 5 }, { x: 5, y: 4 }],
    [{ x: 2, y: 2 }, { x: 4, y: 2 }, { x: 2, y: 3 }, { x: 4, y: 3 }],
    [{ x: 10, y: 10 }, { x: 12, y: 10 }, { x: 10, y: 12 }, { x: 12, y: 12 }],
    [{ x: 2, y: 6 }, { x: 6, y: 6 }, { x: 2, y: 10 }, { x: 6, y: 10 }],
    [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 2, y: 6 }, { x: 6, y: 6 }]
  ];

  assert.deepEqual(
    geom.pointToSquare({ x: 4, y: 4, size: 2 }),
    { x1: 2, y1: 2, x2: 6, y2: 2, height: 4 },
    "Point to Square"
  );

  rectangles.forEach((r, i) => {
    assert.deepEqual(
      geom.rectangleCorners(r),
      solutions[i],
      `Rectangle Corners #${i}`
    );
  });

  const cr = [
    geom.rectangleCorners({ x1: 4, y1: 6, x2: 6, y2: 4, height: Math.sqrt(8) }),
    geom.rectangleCorners({ x1: 4, y1: 8, x2: 6, y2: 6, height: Math.sqrt(8) }),
    geom.rectangleCorners({ x1: 10, y1: 10, x2: 12, y2: 10, height: 2 }),
    geom.rectangleCorners({ x1: 0, y1: 0, x2: 200, y2: 200, height: 200 }),
    geom.rectangleCorners({ x1: 200, y1: 200, x2: 400, y2: 400, height: 200 })
  ];

  assert.strictEqual(geom.collision(cr[0], cr[1]), true, "Collision");
  assert.strictEqual(geom.collision(cr[0], cr[2]), false, "Non-Collision");
  assert.strictEqual(
    geom.collision(cr[0], cr[3]),
    true,
    "Containing Collision"
  );
  assert.strictEqual(
    geom.collision(cr[0], cr[4]),
    false,
    "Outbounding Collision"
  );

  assert.deepEqual(
    geom.splitSquare({ x: 0, y: 0, width: 100, height: 100 }),
    [
      [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 0, y: 50 }, { x: 50, y: 50 }],
      [{ x: 50, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 50 }],
      [{ x: 0, y: 50 }, { x: 50, y: 50 }, { x: 0, y: 100 }, { x: 50, y: 100 }],
      [
        { x: 50, y: 50 },
        { x: 100, y: 50 },
        { x: 50, y: 100 },
        { x: 100, y: 100 }
      ]
    ],
    "Split Square"
  );
});
