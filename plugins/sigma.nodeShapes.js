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

  this.originalFunctions = {};

  this.init = function() {
    // mainain original node-drawing functions
    self.originalFunctions['drawNodeShape']   = plotter.drawNodeShape;
    self.originalFunctions['drawHoverNodeBorder']  = plotter.drawHoverNodeBorder;
    self.originalFunctions['drawHoverNodeShape']  = plotter.drawHoverNodeShape;
    self.originalFunctions['drawActiveNodeBorder']  = plotter.drawActiveNodeBorder;
    self.originalFunctions['drawActiveNodeShape']  = plotter.drawActiveNodeShape;

    // override node-drawing
    plotter.drawNodeShape   = drawShapedNode;
    // plotter.drawHoverNodeBorder  = drawShapedNodeBorder;
    plotter.drawHoverNodeShape  = drawShapedNode;
    // plotter.drawActiveNodeBorder  = drawShapedNodeBorder;
    plotter.drawActiveNodeShape  = drawShapedNode;
  };

  this.finalize = function() {
    // restore original node-drawing functions
    plotter.drawNodeShape   = self.originalFunctions['drawNodeShape'];
    plotter.drawHoverNodeBorder  = self.originalFunctions['drawHoverNodeBorder'];
    plotter.drawHoverNodeShape  = self.originalFunctions['drawHoverNodeShape'];
    plotter.drawActiveNodeBorder  = self.originalFunctions['drawActiveNodeBorder'];
    plotter.drawActiveNodeShape  = self.originalFunctions['drawActiveNodeShape'];
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

};

sigma.publicPrototype.startNodeShapes = function() {
  this.nodeShapes = new sigma.nodeShapes.NodeShapes(this._core.graph, this._core.plotter);
  this.nodeShapes.init();
};

sigma.publicPrototype.stopNodeShapes = function() {
  this.nodeShapes.finalize();
};
