/**
 * This class listen to all the different mouse events, to normalize them and
 * dispatch action events instead (from "startinterpolate" to "isdragging",
 * etc).
 * @constructor
 * @extends sigma.classes.Cascade
 * @extends sigma.classes.EventDispatcher
 * @param {element} dom The DOM element to bind the handlers on.
 * @this {MouseCaptor}
 */
function MouseCaptor(dom) {
  sigma.classes.Cascade.call(this);
  sigma.classes.EventDispatcher.call(this);

  /**
   * Represents "this", without the well-known scope issue.
   * @private
   * @type {MouseCaptor}
   */
  var self = this;

  /**
   * The DOM element to bind the handlers on.
   * @type {element}
   */
  var dom = dom;

  /**
   * The different parameters that define how this instance should work.
   * @see sigma.classes.Cascade
   * @type {Object}
   */
  this.p = {
    minRatio: 1,
    maxRatio: 32,
    marginRatio: 1,
    zoomDelta: 0.1,
    dragDelta: 0.3,
    zoomMultiply: 2,
    directZooming: false,
    blockScroll: true,
    inertia: 1.1,
    mouseEnabled: true
  };

  var oldMouseX = 0;
  var oldMouseY = 0;
  var startX = 0;
  var startY = 0;

  var oldStageX = 0;
  var oldStageY = 0;
  var oldRatio = 1;

  var targetRatio = 1;
  var targetStageX = 0;
  var targetStageY = 0;

  var lastStageX = 0;
  var lastStageX2 = 0;
  var lastStageY = 0;
  var lastStageY2 = 0;

  var progress = 0;
  var isZooming = false;

  this.stageX = 0;
  this.stageY = 0;
  this.ratio = 1;

  this.mouseX = 0;
  this.mouseY = 0;

  this.isMouseDown = false;

  /**
   * Extract the local X position from a mouse event.
   * @private
   * @param  {event} e A mouse event.
   * @return {number} The local X value of the mouse.
   */
  function getX(e) {
    return e.offsetX != undefined && e.offsetX ||
           e.layerX != undefined && e.layerX ||
           e.clientX != undefined && e.clientX;
  };

  /**
   * Extract the local Y position from a mouse event.
   * @private
   * @param  {event} e A mouse event.
   * @return {number} The local Y value of the mouse.
   */
  function getY(e) {
    return e.offsetY != undefined && e.offsetY ||
           e.layerY != undefined && e.layerY ||
           e.clientY != undefined && e.clientY;
  };

  /**
   * Extract the wheel delta from a mouse event.
   * @private
   * @param  {event} e A mouse event.
   * @return {number} The wheel delta of the mouse.
   */
  function getDelta(e) {
    return e.wheelDelta != undefined && e.wheelDelta ||
           e.detail != undefined && -e.detail;
  };

  /**
   * The handler listening to the 'move' mouse event. It will set the mouseX
   * and mouseY values as the mouse position values, prevent the default event,
   * and dispatch a 'move' event.
   * @private
   * @param  {event} event A 'move' mouse event.
   */
  function moveHandler(event) {
    oldMouseX = self.mouseX;
    oldMouseY = self.mouseY;

    self.mouseX = getX(event);
    self.mouseY = getY(event);

    self.isMouseDown && drag(event);
    self.dispatch('move');

    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  };

  /**
   * The handler listening to the 'up' mouse event. It will set the isMouseDown
   * value as false, dispatch a 'mouseup' event, and trigger stopDrag().
   * @private
   * @param  {event} event A 'up' mouse event.
   */
  function upHandler(event) {
    if (self.p.mouseEnabled && self.isMouseDown) {
      self.isMouseDown = false;
      self.dispatch('mouseup');
      stopDrag();

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }
  };

  /**
   * The handler listening to the 'down' mouse event. It will set the
   * isMouseDown value as true, dispatch a 'mousedown' event, and trigger
   * startDrag().
   * @private
   * @param  {event} event A 'down' mouse event.
   */
  function downHandler(event) {
    if (self.p.mouseEnabled) {
      self.isMouseDown = true;
      oldMouseX = self.mouseX;
      oldMouseY = self.mouseY;

      self.dispatch('mousedown');

      startDrag();

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }
  };

  /**
   * The handler listening to the 'wheel' mouse event. It will trigger
   * {@link startInterpolate} with the event delta as parameter.
   * @private
   * @param  {event} event A 'wheel' mouse event.
   */
  function wheelHandler(event) {
    if (self.p.mouseEnabled) {
      startInterpolate(
        self.mouseX,
        self.mouseY,
        self.ratio * (getDelta(event) > 0 ?
          self.p.zoomMultiply :
          1 / self.p.zoomMultiply)
      );

      if (self.p['blockScroll']) {
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
      }
    }
  };

  /**
   * Will start computing the scene X and Y, until {@link stopDrag} is
   * triggered.
   */
  function startDrag() {
    oldStageX = self.stageX;
    oldStageY = self.stageY;
    startX = self.mouseX;
    startY = self.mouseY;

    lastStageX = self.stageX;
    lastStageX2 = self.stageX;
    lastStageY = self.stageY;
    lastStageY2 = self.stageY;

    self.dispatch('startdrag');
  };

  /**
   * Stops computing the scene position.
   */
  function stopDrag() {
    if (oldStageX != self.stageX || oldStageY != self.stageY) {
      startInterpolate(
        self.stageX + self.p.inertia * (self.stageX - lastStageX2),
        self.stageY + self.p.inertia * (self.stageY - lastStageY2)
      );
    }
  };

  /**
   * Computes the position of the scene, relatively to the mouse position, and
   * dispatches a "drag" event.
   */
  function drag() {
    var newStageX = self.mouseX - startX + oldStageX;
    var newStageY = self.mouseY - startY + oldStageY;

    if (newStageX != self.stageX || newStageY != self.stageY) {
      lastStageX2 = lastStageX;
      lastStageY2 = lastStageY;

      lastStageX = newStageX;
      lastStageY = newStageY;

      self.stageX = newStageX;
      self.stageY = newStageY;
      self.dispatch('drag');
    }
  };

  /**
   * Will start computing the scene zoom ratio, until {@link stopInterpolate} is
   * triggered.
   * @param {number} x     The new stage X.
   * @param {number} y     The new stage Y.
   * @param {number} ratio The new zoom ratio.
   */
  function startInterpolate(x, y, ratio) {
    if (self.isMouseDown) {
      return;
    }

    window.clearInterval(self.interpolationID);
    isZooming = ratio != undefined;

    oldStageX = self.stageX;
    targetStageX = x;

    oldStageY = self.stageY;
    targetStageY = y;

    oldRatio = self.ratio;
    targetRatio = ratio || self.ratio;
    targetRatio = Math.min(
      Math.max(targetRatio, self.p.minRatio),
      self.p.maxRatio
    );

    progress =
      self.p.directZooming ?
      1 - (isZooming ? self.p.zoomDelta : self.p.dragDelta) :
      0;

    if (
      self.ratio != targetRatio ||
      self.stageX != targetStageX ||
      self.stageY != targetStageY
    ) {
      interpolate();
      self.interpolationID = window.setInterval(interpolate, 50);
      self.dispatch('startinterpolate');
    }
  };

  /**
   * Stops the move interpolation.
   */
  function stopInterpolate() {
    var oldRatio = self.ratio;

    if (isZooming) {
      self.ratio = targetRatio;
      self.stageX = targetStageX +
                    (self.stageX - targetStageX) *
                    self.ratio /
                    oldRatio;
      self.stageY = targetStageY +
                    (self.stageY - targetStageY) *
                    self.ratio /
                    oldRatio;
    }else {
      self.stageX = targetStageX;
      self.stageY = targetStageY;
    }

    self.dispatch('stopinterpolate');
  };

  /**
   * Computes the interpolate ratio and the position of the scene, relatively
   * to the last mouse event delta received, and dispatches a "interpolate"
   * event.
   */
  function interpolate() {
    progress += (isZooming ? self.p.zoomDelta : self.p.dragDelta);
    progress = Math.min(progress, 1);

    var k = sigma.easing.quadratic.easeout(progress);
    var oldRatio = self.ratio;

    self.ratio = oldRatio * (1 - k) + targetRatio * k;

    if (isZooming) {
      self.stageX = targetStageX +
                    (self.stageX - targetStageX) *
                    self.ratio /
                    oldRatio;

      self.stageY = targetStageY +
                    (self.stageY - targetStageY) *
                    self.ratio /
                    oldRatio;
    } else {
      self.stageX = oldStageX * (1 - k) + targetStageX * k;
      self.stageY = oldStageY * (1 - k) + targetStageY * k;
    }

    self.dispatch('interpolate');
    if (progress >= 1) {
      window.clearInterval(self.interpolationID);
      stopInterpolate();
    }
  };

  /**
   * Checks that there is always a part of the graph that is displayed, to
   * avoid the user to drag the graph out of the stage.
   * @param  {Object} b      An object containing the borders of the graph.
   * @param  {number} width  The width of the stage.
   * @param  {number} height The height of the stage.
   * @return {MouseCaptor} Returns itself.
   */
  function checkBorders(b, width, height) {
    // TODO : Find the good formula
    /*if (!isNaN(b.minX) && !isNaN(b.maxX)) {
      self.stageX = Math.min(
        self.stageX = Math.max(
          self.stageX,
          (b.minX - width) * self.ratio +
            self.p.marginRatio*(b.maxX - b.minX)
        ),
        (b.maxX - width) * self.ratio +
          width -
          self.p.marginRatio*(b.maxX - b.minX)
      );
    }

    if (!isNaN(b.minY) && !isNaN(b.maxY)) {
      self.stageY = Math.min(
        self.stageY = Math.max(
          self.stageY,
          (b.minY - height) * self.ratio +
            self.p.marginRatio*(b.maxY - b.minY)
        ),
        (b.maxY - height) * self.ratio +
          height -
          self.p.marginRatio*(b.maxY - b.minY)
      );
    }*/

    return self;
  };

  // ADD CALLBACKS
  dom.addEventListener('DOMMouseScroll', wheelHandler, true);
  dom.addEventListener('mousewheel', wheelHandler, true);
  dom.addEventListener('mousemove', moveHandler, true);
  dom.addEventListener('mousedown', downHandler, true);
  document.addEventListener('mouseup', upHandler, true);

  this.checkBorders = checkBorders;
  this.interpolate = startInterpolate;
}

