function MouseCaptor(canvas, graph, id) {
  var self = this;
  sigma.classes.EventDispatcher.call(this);

  this.canvas = canvas;
  this.graph = graph;
  this.id = id;

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
  this.oldStageX = 0;
  this.oldStageY = 0;
  this.oldRatio = 1;
  this.stageX = 0;
  this.stageY = 0;
  this.ratio = 1;

  this.targetStageX = 0;
  this.targetStageY = 0;
  this.targetRatio = 1;

  this.progress = 0;

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
    startZooming(event.wheelDelta);
  };

  // CUSTOM ACTIONS
  function startDrag() {
    self.startX = self.mouseX;
    self.startY = self.mouseY;

    self.dispatch('startdrag');
  };

  function stopDrag() {
    self.oldStageX = self.stageX;
    self.oldStageY = self.stageY;
    self.dispatch('stopdrag');
  };

  function drag() {
    self.stageX = self.mouseX - self.startX + self.oldStageX;
    self.stageY = self.mouseY - self.startY + self.oldStageY;

    self.dispatch('drag');
  };

  function startZooming(delta) {
    self.oldRatio = self.ratio;
    self.targetRatio = self.ratio * (delta > 0 ? 2 : 1 / 2);
    self.progress = 0;

    /*sigma.scheduler.addWorker(
      zooming,
      'zooming_'+self.id,
      false
    ).queueWorker(
      stopZooming,
      'stopzooming_'+self.id,
      'zooming_'+self.id
    ).start();*/

    self.zoomID = window.setInterval(zooming, 50);
  };

  function stopZooming() {
    var oldRatio = self.ratio;

    self.ratio = self.targetRatio;
    self.stageX = self.mouseX +
                  (self.stageX - self.mouseX) *
                  self.ratio /
                  self.ratio;
    self.stageY = self.mouseY +
                  (self.stageY - self.mouseY) *
                  self.ratio /
                  self.ratio;

    self.dispatch('stopzooming');
    return false;
  };

  function zooming() {
    self.progress += 0.05;
    var k = sigma.easing.quadratic.easeinout(self.progress);
    var oldRatio = self.ratio;

    self.ratio = self.oldRatio * (1 - k) + self.targetRatio * k;
    self.stageX = self.mouseX +
                  (self.stageX - self.mouseX) *
                  self.ratio /
                  self.ratio;
    self.stageY = self.mouseY +
                  (self.stageY - self.mouseY) *
                  self.ratio /
                  self.ratio;

    dispatch('zooming');

    //return self.progress<1;

    if (self.progress > 1) {
      window.clearInterval(self.zoomID);
      window.setTimeout(stopZooming, 50);
    }
  };

  // ADD CALLBACKS
  this.canvas.onmousewheel = wheelHandler;
  this.canvas.onmousemove = moveHandler;
  this.canvas.onmousedown = downHandler;
  document.onmouseup = upHandler;
}
