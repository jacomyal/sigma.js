// ron.peleg@gmail.com (https://github.com/rpeleg1970)
// (requires sigma.js to be loaded)
sigma.nodeShapes = sigma.nodeShapes || {};
sigma.nodeShapes.NodeShapes = function(graph) {
  sigma.classes.Cascade.call(this);
  var self = this;
  this.graph = graph;

  this.p = {
    /* TODO add configuration here */
  };

  this.originalFunctions = {};

  this.init = function() {
    // mainain original node-drawing functions
    self.originalFunctions['drawNodeShape']   = Plotter.prototype.drawNodeShape;
    self.originalFunctions['drawHoverNodeBorder']  = Plotter.prototype.drawHoverNodeBorder;
    self.originalFunctions['drawHoverNodeShape']  = Plotter.prototype.drawHoverNodeShape;
    self.originalFunctions['drawActiveNodeBorder']  = Plotter.prototype.drawActiveNodeBorder;
    self.originalFunctions['drawActiveNodeShape']  = Plotter.prototype.drawActiveNodeShape;

    // override node-drawing
    Plotter.prototype.drawNodeShape   = drawShapedNode;
    // Plotter.prototype.drawHoverNodeBorder  = drawShapedNodeBorder;
    Plotter.prototype.drawHoverNodeShape  = drawShapedNode;
    // Plotter.prototype.drawActiveNodeBorder  = drawShapedNodeBorder;
    Plotter.prototype.drawActiveNodeShape  = drawShapedNode;
  };

  this.finalize = function() {
    // restore original node-drawing functions
    Plotter.prototype.drawNodeShape   = self.originalFunctions['drawNodeShape'];
    Plotter.prototype.drawHoverNodeBorder  = self.originalFunctions['drawHoverNodeBorder'];
    Plotter.prototype.drawHoverNodeShape  = self.originalFunctions['drawHoverNodeShape'];
    Plotter.prototype.drawActiveNodeBorder  = self.originalFunctions['drawActiveNodeBorder'];
    Plotter.prototype.drawActiveNodeShape  = self.originalFunctions['drawActiveNodeShape'];
  };

  /**
   * Cache for IMG objects
   * @type {hash}
   */
  var imgCache = {};


  /**
   * Draws one filled node shape to the corresponding canvas.
   * @param  {Object} canvas context to draw on
   * @param  {string} designated color
   * @param  {float}  display X for center
   * @param  {float}  display Y for center
   * @param  {float}  display size - all objects pixels must be inside
   * @param  {Object} node The node to draw - node date is used to determine shape
   *        and image to draw
   */
  function drawShapedNode(ctx, color, x, y, size, node) {
    // At this point only draws filled circle, will add more shapes
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,
        y,
        size,
        0,
        Math.PI * 2,
        true);

    ctx.closePath();
    ctx.fill();

    // Use node data to draw image inside shape
    if(node.attr.image) {
      var url = node.attr.image.url;
      var ih = node.attr.image.h;
      var iw = node.attr.image.w;

      // create new IMG or get from imgCache

      // calculate position by proportions

      // draw
    }
  }

};

sigma.publicPrototype.startNodeShapes = function() {
  this.nodeShapes = new sigma.nodeShapes.NodeShapes(this._core.graph);
  this.nodeShapes.init();
};

sigma.publicPrototype.stopNodeShapes = function() {
  this.nodeShapes.finalize();
};
