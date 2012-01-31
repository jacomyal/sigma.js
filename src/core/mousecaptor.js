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
  this.startX = 0;
  this.startY = 0;

  this.isMouseDown = false;
  this.triggerDrag = false;

  // SCENE
  this.stageX = 0;
  this.stageY = 0;
  this.ratio = 1;

  // CALLBACKS
  function moveHandler(event) {
    self.oldMouseX = self.mouseX;
    self.oldMouseY = self.mouseY;

    self.mouseX = event.offsetX;
    self.mouseY = event.offsetY;

    self.isMouseDown && drag(event);
  };

  function upHandler(event) {
    self.isMouseDown = false;

    stopDrag();
  };

  function downHandler(event) {
    self.isMouseDown = true;
    self.oldMouseX = self.mouseX;
    self.oldMouseY = self.mouseY;

    self.triggerDrag = false;

    startDrag();
  };

  function wheelHandler(event) {
    self.ratio += event.wheelDelta / 10;
  };

  // CUSTOM ACTIONS
  function startDrag(event) {
    self.startX = self.mouseX;
    self.startY = self.mouseY;

    self.dispatch('startdrag', event);
  };

  function stopDrag(event) {
    // TODO
    self.dispatch('stopdrag', event);
  };

  function drag(event) {
    self.dispatch('drag', {
      dx: self.mouseX - self.startX,
      dy: self.mouseY - self.startY,
      x: self.mouseX,
      y: self.mouseY,
      ratio: self.ratio
    });
  };

  // ADD CALLBACKS
  this.canvas.onmousewheel = wheelHandler;
  this.canvas.onmousemove = moveHandler;
  this.canvas.onmousedown = downHandler;
  document.onmouseup = upHandler;
}
