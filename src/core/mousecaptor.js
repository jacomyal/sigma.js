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

  this.limits = {
    minRatio: 1,
    maxRatio: 16
  };

  // UTILS
  function getX(e) {
    return e.offsetX != undefined && e.offsetX ||
           e.clientX != undefined && e.clientX;
  };

  function getY(e) {
    return e.offsetY != undefined && e.offsetY ||
           e.clientY != undefined && e.clientY;
  };

  function getDelta(e) {
    console.log(e);
    return e.wheelDelta != undefined && e.wheelDelta ||
           e.detail != undefined && -e.detail;
  };

  // CALLBACKS
  function moveHandler(event) {
    self.oldMouseX = self.mouseX;
    self.oldMouseY = self.mouseY;

    self.mouseX = getX(event);
    self.mouseY = getY(event);

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
    startZooming(getDelta(event));
  };

  // CUSTOM ACTIONS
  function startDrag() {
    self.oldStageX = self.stageX;
    self.oldStageY = self.stageY;
    self.startX = self.mouseX;
    self.startY = self.mouseY;
    self.dispatch('startdrag');
  };

  function stopDrag() {
    if (self.oldStageX != self.stageX || self.oldStageY != self.stageY) {
      self.dispatch('stopdrag');
    }
  };

  function drag() {
    self.stageX = self.mouseX - self.startX + self.oldStageX;
    self.stageY = self.mouseY - self.startY + self.oldStageY;

    self.dispatch('drag');
  };

  function startZooming(delta) {
    window.clearInterval(self.zoomID);

    self.oldRatio = self.ratio;
    self.targetRatio = self.ratio * (delta > 0 ? 2 : 1 / 2);
    self.targetRatio = Math.min(
      Math.max(self.targetRatio, self.limits.minRatio),
      self.limits.maxRatio
    );
    self.progress = 0;

    if (self.ratio != self.targetRatio) {
      zooming();
      self.zoomID = window.setInterval(zooming, 50);
      self.dispatch('startzooming');
    }
  };

  function stopZooming() {
    var oldRatio = self.ratio;

    self.ratio = self.targetRatio;
    self.stageX = self.mouseX +
                  (self.stageX - self.mouseX) *
                  self.ratio /
                  oldRatio;
    self.stageY = self.mouseY +
                  (self.stageY - self.mouseY) *
                  self.ratio /
                  oldRatio;

    self.dispatch('stopzooming');
  };

  function zooming() {
    self.progress += 0.1;
    var k = sigma.easing.quadratic.easeout(self.progress);
    var oldRatio = self.ratio;

    self.ratio = self.oldRatio * (1 - k) + self.targetRatio * k;
    self.stageX = self.mouseX +
                  (self.stageX - self.mouseX) *
                  self.ratio /
                  oldRatio;
    self.stageY = self.mouseY +
                  (self.stageY - self.mouseY) *
                  self.ratio /
                  oldRatio;

    self.dispatch('zooming');
    if (self.progress > 1) {
      window.clearInterval(self.zoomID);
      stopZooming();
    }
  };

  // ADD CALLBACKS
  this.canvas.onmousewheel = wheelHandler;
  this.canvas.onmousemove = moveHandler;
  this.canvas.onmousedown = downHandler;
  document.onmouseup = upHandler;
}
