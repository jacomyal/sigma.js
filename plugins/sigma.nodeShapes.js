// ron.peleg@gmail.com (https://github.com/rpeleg1970)
// (requires sigma.js to be loaded)

// some plug-in related additions to sigma.tools
sigma.tools.drawSquare = function(ctx,color,x,y,size,node) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.fillRect(
      x+Math.sin(-3.142/4)*size,
      y-Math.cos(-3.142/4)*size,
      size*2*Math.sin(-3.142/4)*(-1),
      size*2*Math.cos(-3.142/4));
  ctx.closePath();
  ctx.fill();
}

sigma.tools.drawDiamond = function(ctx,color,x,y,size,node) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x-size, y);
  ctx.lineTo(x, y-size);
  ctx.lineTo(x+size, y);
  ctx.lineTo(x, y+size);
  ctx.moveTo(x-size, y);
  ctx.closePath();
  ctx.fill();
}

sigma.tools.drawTriangle = function(ctx,color,x,y,size,node) {
  ctx.fillStyle = color;
  ctx.beginPath();
  // equilateral, standing on base
  ctx.moveTo(x, y-size);
  ctx.lineTo(x+Math.sin(2*Math.PI/3)*size, y-Math.cos(2*Math.PI/3)*size);
  ctx.lineTo(x+Math.sin(2*Math.PI*2/3)*size, y-Math.cos(2*Math.PI*2/3)*size);
  ctx.moveTo(x, y+size);
  ctx.closePath();
  ctx.fill();
}

/*
 * this function expects the following hash on node.attr.shape:
 * {
 *   name: equilat-poly
 *   numPoints: number of points in equilateral polygon, default 5
 *   rotate: degrees to rotate clockwise (0 is default, one corner at 12
 *   o'clock)
 * }
 */
sigma.tools.drawEquilatPoly = function(ctx,color,x,y,size,node) {
  ctx.fillStyle = color;
  ctx.beginPath();
  var pcount = node.attr.shape.numPoints || 5;
  var rotate = (node.attr.shape.rotate || 0)*Math.PI/180;
  var radius = size;
  ctx.moveTo(x+radius*Math.sin(rotate), y-radius*Math.cos(rotate)); // first point on outer radius, angle 'rotate'
  for(var i=1; i<pcount; i++) {
    ctx.lineTo(x+Math.sin(rotate+2*Math.PI*i/pcount)*radius, y-Math.cos(rotate+2*Math.PI*i/pcount)*radius);
  }
  ctx.closePath();
  ctx.fill();
}

/*
 * this function expects the following hash on node.attr.shape:
 * {
 *   name: star
 *   numPoints: number of points in star, default 5
 *   innerRatio: ratio of inner radius to size (==outer radius)
 * }
 */
sigma.tools.drawStar = function(ctx,color,x,y,size,node) {
  ctx.fillStyle = color;
  ctx.beginPath();
  var pcount = node.attr.shape.numPoints || 5;
  var inRatio = node.attr.shape.innerRatio || 0.5;
  var outR = size;
  var inR = size*inRatio;
  var angleOffset = Math.PI/pcount; // offset of inner angles
  ctx.moveTo(x, y-size); // first point on outer radius, top
  for(var i=0; i<pcount; i++) {
    ctx.lineTo(x+Math.sin(angleOffset+2*Math.PI*i/pcount)*inR, y-Math.cos(angleOffset+2*Math.PI*i/pcount)*inR);
    ctx.lineTo(x+Math.sin(2*Math.PI*(i+1)/pcount)*outR, y-Math.cos(2*Math.PI*(i+1)/pcount)*outR);
  }
  ctx.closePath();
  ctx.fill();
}

// Main plug-in goes here
sigma.nodeShapes = sigma.nodeShapes || {};
sigma.nodeShapes.NodeShapes = function(siginst,plotter) {
  sigma.classes.Cascade.call(this);
  var self = this;
  this.sigInst= siginst;
  this.plotter = plotter;

  this.p = {
    /* TODO add configuration here */
  };

  var shapeFunctions = {};

  this.init = function() {
    // mainain original node-drawing functions, as shape drawing for 'circle'
    self.addShapeFunctions('circle', {
      'drawNodeShape': plotter.drawNodeShape,
      'drawHoverNodeBorder': plotter.drawHoverNodeBorder,
      'drawHoverNodeShape': plotter.drawHoverNodeShape,
      'drawActiveNodeBorder': plotter.drawActiveNodeBorder,
      'drawActiveNodeShape': plotter.drawActiveNodeShape
    });

    self.addShapeFunctions('square', {
      'drawNodeShape': sigma.tools.drawSquare,
      'drawHoverNodeBorder': sigma.tools.drawSquare,
      'drawHoverNodeShape': sigma.tools.drawSquare,
      'drawActiveNodeBorder': sigma.tools.drawSquare,
      'drawActiveNodeShape': sigma.tools.drawSquare
    });

    self.addShapeFunctions('diamond', {
      'drawNodeShape': sigma.tools.drawDiamond,
      'drawHoverNodeBorder': sigma.tools.drawDiamond,
      'drawHoverNodeShape': sigma.tools.drawDiamond,
      'drawActiveNodeBorder': sigma.tools.drawDiamond,
      'drawActiveNodeShape': sigma.tools.drawDiamond
    });

    self.addShapeFunctions('triangle', {
      'drawNodeShape': sigma.tools.drawTriangle,
      'drawHoverNodeBorder': sigma.tools.drawTriangle,
      'drawHoverNodeShape': sigma.tools.drawTriangle,
      'drawActiveNodeBorder': sigma.tools.drawTriangle,
      'drawActiveNodeShape': sigma.tools.drawTriangle
    });

    self.addShapeFunctions('star', {
      'drawNodeShape': sigma.tools.drawStar,
      'drawHoverNodeBorder': sigma.tools.drawStar,
      'drawHoverNodeShape': sigma.tools.drawStar,
      'drawActiveNodeBorder': sigma.tools.drawStar,
      'drawActiveNodeShape': sigma.tools.drawStar
    });

    self.addShapeFunctions('equilat-poly', {
      'drawNodeShape': sigma.tools.drawEquilatPoly,
      'drawHoverNodeBorder': sigma.tools.drawEquilatPoly,
      'drawHoverNodeShape': sigma.tools.drawEquilatPoly,
      'drawActiveNodeBorder': sigma.tools.drawEquilatPoly,
      'drawActiveNodeShape': sigma.tools.drawEquilatPoly
    });

    // override node-drawing, with wrappers that switch on node.attr.shape,
    // and add images on top of the non-border drawing functions
    plotter.drawNodeShape   = drawNodeShapeWImage;
    plotter.drawHoverNodeBorder  = drawHoverNodeShapeBorder;
    plotter.drawHoverNodeShape  = drawHoverNodeShapeWImage;
    plotter.drawActiveNodeBorder  = drawActiveNodeShapeBorder;
    plotter.drawActiveNodeShape  = drawActiveNodeShapeWImage;
  };

  this.finalize = function() {
    // restore original node-drawing functions
    plotter.drawNodeShape   = shapeFunctions['circle']['drawNodeShape'];
    plotter.drawHoverNodeBorder  = shapeFunctions['circle']['drawHoverNodeBorder'];
    plotter.drawHoverNodeShape  = shapeFunctions['circle']['drawHoverNodeShape'];
    plotter.drawActiveNodeBorder  = shapeFunctions['circle']['drawActiveNodeBorder'];
    plotter.drawActiveNodeShape  = shapeFunctions['circle']['drawActiveNodeShape'];
  };

  /**
   * Sets the drawing functions for a specific shape
   * @param {string} name of shape, to be used on node.attr.shape
   * @param {object} hash of functions. the following keys are expected:
   *                 - drawNodeShape
   *                 - drawHoverNodeBorder
   *                 - drawHoverNodeShape
   *                 - drawActiveNodeBorder
   *                 - drawActiveNodeShape
   *    each functions draws the expected node shape to the corresponding canvas,
   *    following the below prototype:
   *      @param  {Object} canvas context to draw on
   *      @param  {string} designated color
   *      @param  {float}  display X for center
   *      @param  {float}  display Y for center
   *      @param  {float}  display size - all objects pixels must be inside
   *      @param  {Object} node The node to draw - node date is used to determine shape
   *              and image to draw
   */
  this.addShapeFunctions = function(name,funcs) {
    shapeFunctions[name]=funcs;
  }

  /**
   * Cache for IMG objects
   * @type {hash}
   */
  var imgCache = {};

  /**
   * draws image on node
   * @see this.addShapeFunctions for explanation on function prototype
   * this function expects the following hash on node.attr.image:
   * {
   *   url: url to image
   *   h: image height, used with width to calculate ratio
   *   w: image width
   *   scale: 0<-->1, how to scale down image below the node radius/size
   * }
   */
  function drawImageOnNode(ctx, color, x, y, size, node) {
    if(node.attr.image && node.attr.image.url) {
      var url = node.attr.image.url;
      var ih = node.attr.image.h || 10; // 10 is arbitrary, anyway only the ratio counts
      var iw = node.attr.image.w || 10;
      var scale = node.attr.image.scale || 0.85;

      // create new IMG or get from imgCache
      var image = imgCache[url];
      if(!image) {
        image = document.createElement('IMG');
        image.src = url;
        image.onload = function(){
          console.log("redraw on image load");
          self.sigInst.draw();
        };
        imgCache[url] = image;
      }

      // calculate position and draw
      var xratio = (iw<ih) ? (iw/ih) : 1;
      var yratio = (ih<iw) ? (ih/iw) : 1;
      var r = size*scale;
      ctx.drawImage(image,
                  x+Math.sin(-3.142/4)*r*xratio,
                  y-Math.cos(-3.142/4)*r*yratio,
                  r*xratio*2*Math.sin(-3.142/4)*(-1),
                  r*yratio*2*Math.cos(-3.142/4));
    }
  }

  /**
   * wrapper for drawNodeShape, adds image on top
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawNodeShapeWImage(ctx, color, x, y, size, node) {
    var functions = shapeFunctions['circle'];
    if(node.attr && node.attr.shape && node.attr.shape.name) {
      functions = shapeFunctions[node.attr.shape.name];
    }
    functions['drawNodeShape'](ctx, color, x, y, size, node);
    drawImageOnNode(ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawHoverNodeShape, adds image on top
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawHoverNodeShapeWImage(ctx, color, x, y, size, node) {
    var functions = shapeFunctions['circle'];
    if(node.attr && node.attr.shape && node.attr.shape.name) {
      functions = shapeFunctions[node.attr.shape.name];
    }
    functions['drawHoverNodeShape'](ctx, color, x, y, size, node);
    drawImageOnNode(ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawHoverNodeBorder
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawHoverNodeShapeBorder(ctx, color, x, y, size, node) {
    var functions = shapeFunctions['circle'];
    if(node.attr && node.attr.shape && node.attr.shape.name) {
      functions = shapeFunctions[node.attr.shape.name];
    }
    functions['drawHoverNodeBorder'](ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawActiveNodeShape, adds image on top
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawActiveNodeShapeWImage(ctx, color, x, y, size, node) {
    var functions = shapeFunctions['circle'];
    if(node.attr && node.attr.shape && node.attr.shape.name) {
      functions = shapeFunctions[node.attr.shape.name];
    }
    functions['drawActiveNodeShape'](ctx, color, x, y, size, node);
    drawImageOnNode(ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawActiveNodeBorder
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawActiveNodeShapeBorder(ctx, color, x, y, size, node) {
    var functions = shapeFunctions['circle'];
    if(node.attr && node.attr.shape && node.attr.shape.name) {
      functions = shapeFunctions[node.attr.shape.name];
    }
    functions['drawActiveNodeBorder'](ctx, color, x, y, size, node);
  }
};

sigma.publicPrototype.startNodeShapes = function() {
  this.nodeShapes = new sigma.nodeShapes.NodeShapes(this, this._core.plotter);
  this.nodeShapes.init();
};

sigma.publicPrototype.addShapeFunctions = function(name,funcs) {
  this.nodeShapes.addShapeFunctions(name,funcs);
};

sigma.publicPrototype.stopNodeShapes = function() {
  this.nodeShapes.finalize();
};
