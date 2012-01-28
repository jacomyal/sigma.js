sigma.scheduler = (function() {
  sigma.classes.EventDispatcher.call(this);
  var _self = this;

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 0);
      };
  })();

  this.isRunning = false;
  this.fpsReq = 30;
  this.workers = [];
  this.frameTime = 1000 / this.fpsReq;
  this.correctedFrameTime = this.frameTime;
  this.frames = 0;

  this.delay = 0;

  this.frameInjector = function() {
    while (_self.isRunning && _self.workers.length && _self.routine()) {}

    if (!_self.isRunning || !_self.workers.length) {
      _self.dispatch('stop');
      _self.isRunning = false;
    } else {
      _self.startTime = (new Date()).getTime();
      _self.frames++;
      _self.delay = _self.effectiveTime - _self.frameTime;
      _self.correctedFrameTime = _self.frameTime - _self.delay;
      window.requestAnimFrame(_self.frameInjector);
    }
  };

  this.start = function() {
    this.isRunning = true;
    this.index = 0;
    this.frames = 0;

    this.startTime = (new Date()).getTime();
    this.time = this.startTime;

    this.dispatch('start');
    this.frameInjector();
    return this;
  };

  this.stop = function() {
    this.isRunning = false;
    return this;
  };

  this.routine = function() {
    this.index = this.index % this.workers.length;
    if (!this.workers[this.index]['w']()) {
      this.dispatch('killed', this.workers.splice(this.index--, 1)[0]);
    }

    this.index++;
    this.effectiveTime = (new Date()).getTime() - this.startTime;
    return this.effectiveTime <= this.correctedFrameTime;
  };

  this.addWorker = function(w, name, autostart) {
    this.workers.push({
      'name': name,
      'w': w
    });
    this.isRunning = !!(this.isRunning || (autostart && start()) || true);
    return this;
  };

  this.removeWorker = function(v) {
    if (v == undefined) {
      this.workers = [];
      stop();
    } else {
      this.workers = this.workers.filter(function(e) {
        return (typeof v == 'string') ? e['name'] != v : e['w'] != v;
      });
    }

    this.isRunning = !!(this.workers.length || (stop() && false));
    return this;
  };

  this.fps = function(v) {
    if (v != undefined) {
      this.fpsReq = Math.abs(1 * v);
      this.frameTime = 1000 / this.fpsReq;
      this.frames = 0;
      this.time = (new Date()).getTime();
      return this;
    } else {
      return this.fpsReq;
    }
  };

  this.getFPS = function() {
    if (this.isRunning) {
      return this.frames / ((new Date()).getTime() - this.time) * 1000;
    } else {
      return false;
    }
  };

  return this;
})();
