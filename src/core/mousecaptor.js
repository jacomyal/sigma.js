function MouseCaptor(canvas, graph) {
  var self = this;
  sigma.classes.EventDispatcher.call(this);

  this.canvas = canvas;
  this.graph = graph;

  this.mouseX = 0;
  this.mouseY = 0;
  this.isMouseDown = false;

  this.moveHandler = function(event) {
    self.mouseX = event.offsetX;
    self.mouseY = event.offsetY;
  };

  this.upHandler = function(event) {
    self.isMouseDown = false;
  };

  this.downHandler = function(event) {
    self.isMouseDown = true;
  };

  this.canvas.onmousemove = this.moveHandler;
  this.canvas.onmousedown = this.downHandler;
  document.onmouseup = this.upHandler;
}
