// ron.peleg@gmail.com (https://github.com/rpeleg1970)
// (requires sigma.js to be loaded)
sigma.nodeShapes = sigma.nodeShapes || {};
sigma.nodeShapes.NodeShapes = function(graph,plotter) {
  sigma.classes.Cascade.call(this);
  var self = this;
  this.graph = graph;
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
   */
  function drawImageOnNode(ctx, color, x, y, size, node) {
    if(node.attr.image) {
      var url = node.attr.image.url;
      var ih = node.attr.image.h;
      var iw = node.attr.image.w;

      // create new IMG or get from imgCache
      var image = imgCache[url];
      if(!image) {
        image = document.createElement('IMG');
        image.src = url;
        imgCache[url] = image;
      }

      // calculate position and draw
      var xratio = (iw<ih) ? (iw/ih) : 1;
      var yratio = (ih<iw) ? (ih/iw) : 1;
      var r = size;
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
    var functions = shapeFunctions[node.attr.shape] || shapeFunctions['circle'];
    functions['drawNodeShape'](ctx, color, x, y, size, node);
    drawImageOnNode(ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawHoverNodeShape, adds image on top
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawHoverNodeShapeWImage(ctx, color, x, y, size, node) {
    var functions = shapeFunctions[node.attr.shape] || shapeFunctions['circle'];
    functions['drawHoverNodeShape'](ctx, color, x, y, size, node);
    drawImageOnNode(ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawHoverNodeBorder
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawHoverNodeShapeBorder(ctx, color, x, y, size, node) {
    var functions = shapeFunctions[node.attr.shape] || shapeFunctions['circle'];
    functions['drawHoverNodeBorder'](ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawActiveNodeShape, adds image on top
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawActiveNodeShapeWImage(ctx, color, x, y, size, node) {
    var functions = shapeFunctions[node.attr.shape] || shapeFunctions['circle'];
    functions['drawActiveNodeShape'](ctx, color, x, y, size, node);
    drawImageOnNode(ctx, color, x, y, size, node);
  }

  /**
   * wrapper for drawActiveNodeBorder
   * @see this.addShapeFunctions for explanation on function prototype
   */
  function drawActiveNodeShapeBorder(ctx, color, x, y, size, node) {
    var functions = shapeFunctions[node.attr.shape] || shapeFunctions['circle'];
    functions['drawActiveNodeBorder'](ctx, color, x, y, size, node);
  }
};

sigma.publicPrototype.startNodeShapes = function() {
  this.nodeShapes = new sigma.nodeShapes.NodeShapes(this._core.graph, this._core.plotter);
  this.nodeShapes.init();
};

sigma.publicPrototype.stopNodeShapes = function() {
  this.nodeShapes.finalize();
};
