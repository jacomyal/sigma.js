function MouseCaptor(canvas, graph) {
  var self = this;
  sigma.classes.EventDispatcher.call(this);

  this.canvas = canvas;
  this.graph = graph;

  // MOUSE
  this.mouseX = 0;
  this.mouseY = 0;
  this.oldMouseX = 0;
  this.oldMouseY = 0;

  this.isMouseDown = false;
  this.triggerDrag = false;

  // SCENE
  this.stageX = 0;
  this.stageY = 0;
  this.ratio = 1;

  this.moveHandler = function(event) {
    self.oldMouseX = event.mouseX;
    self.oldMouseY = event.mouseY;

    self.mouseX = event.offsetX;
    self.mouseY = event.offsetY;

    self.isMouseDown && self.drag(event);
  };

  this.upHandler = function(event) {
    self.isMouseDown = false;

    self.stopDrag();
  };

  this.downHandler = function(event) {
    self.isMouseDown = true;
    self.oldMouseX = event.mouseX;
    self.oldMouseY = event.mouseY;

    self.triggerDrag = false;

    self.startDrag();
  };

  this.canvas.onmousemove = this.moveHandler;
  this.canvas.onmousedown = this.downHandler;
  document.onmouseup = this.upHandler;

  this.startDrag = function(event) {
    // TODO
    self.dispatch('startdrag', event);
  };

  this.stopDrag = function(event) {
    // TODO
    self.dispatch('stopdrag', event);
  };

  this.drag = function(event) {
    // TODO
    self.dispatch('drag', event);
  };
}
