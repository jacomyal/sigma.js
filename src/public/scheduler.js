sigma.scheduler = (function() {
  sigma.classes.EventDispatcher.call(this);
  var self = this;

  this.isRunning = false;
  this.fpsReq = 60;
  this.queue = [];
  this.workers = [];
  this.frameTime = 1000 / this.fpsReq;
  this.correctedFrameTime = this.frameTime;
  this.frames = 0;

  this.delay = 0;

  this.injectFrame = function(callback) {
    window.setTimeout(callback, 0);
    return self;
  }

  this.frameInjector = function() {
    while (self.isRunning && self.workers.length && self.routine()) {}

    if (!self.isRunning || !self.workers.length) {
      self.stop();
    } else {
      self.startTime = (new Date()).getTime();
      self.frames++;
      self.delay = self.effectiveTime - self.frameTime;
      self.correctedFrameTime = self.frameTime - self.delay;
      self.injectFrame(self.frameInjector);
    }
  };

  this.start = function() {
    this.isRunning = true;
    this.index = 0;
    this.frames = 0;

    this.startTime = (new Date()).getTime();
    this.time = this.startTime;

    this.dispatch('start');
    this.injectFrame(this.frameInjector);
    return this;
  };

  this.stop = function() {
    self.dispatch('stop');
    self.isRunning = false;
    return self;
  };

  this.routine = function() {
    this.index = this.index % this.workers.length;

    if (!this.workers[this.index]['w']()) {
      var n = this.workers[this.index]['name'];

      this.queue = this.queue.filter(function(e) {
        (e['parent'] == n) && this.workers.push({
          'name': e['name'],
          'w': e['w']
        });
        return e['parent'] != n;
      });

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

  this.queueWorker = function(w, name, parent) {
    if (!this.workers.concat(this.queue).some(function(e) {
      return e['name'] == parent;
    })) {
      throw new Error(
        'Parent worker "' + parent + '" of "' + name + '" is not attached.'
      );
    }

    this.queue.push({
      'parent': parent,
      'name': name,
      'w': w
    });

    return this;
  };

  // queueStatus:
  //  - 0: nothing
  //  - 1: trigger queue
  //  - 2: empty queue
  this.removeWorker = function(v, queueStatus) {
    var self = this;

    if (v == undefined) {
      this.workers = [];
      if (queueStatus > 0) {
        this.queue = [];
      }
      stop();
    } else {
      var n = (typeof v == 'string') ? v : '';
      this.workers = this.workers.filter(function(e) {
        if ((typeof v == 'string') ? e['name'] == v : e['w'] == v) {
          n = e['name'];
          return false;
        }
        return true;
      });

      if (queueStatus > 0) {
        this.queue = this.queue.filter(function(e) {
          if (queueStatus == 1 && e['parent'] == n) {
            this.workers.push(e);
          }
          return e['parent'] != n;
        });
      }
    }

    this.isRunning = !!(!this.workers.length || (stop() && false));
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
