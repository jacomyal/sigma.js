sigma.scheduler = (function() {
  sigma.classes.EventDispatcher.call(this);
  var self = this;

  this.isRunning = false;
  this.fpsReq = 60;
  this.lastFPS = 0;
  this.queue = [];
  this.workers = [];
  this.frameTime = 1000 / this.fpsReq;
  this.correctedFrameTime = this.frameTime;
  this.frames = 0;

  this.delay = 0;

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

  this.routine = function() {
    self.index = self.index % self.workers.length;

    if (!self.workers[self.index]['w']()) {
      var n = self.workers[self.index]['name'];

      self.queue = self.queue.filter(function(e) {
        (e['parent'] == n) && self.workers.push({
          'name': e['name'],
          'w': e['w']
        });
        return e['parent'] != n;
      });

      self.dispatch('killed', self.workers.splice(self.index--, 1)[0]);
    }

    self.index++;
    self.effectiveTime = (new Date()).getTime() - self.startTime;
    return self.effectiveTime <= self.correctedFrameTime;
  };

  this.injectFrame = function(callback) {
    window.setTimeout(callback, 0);
    return self;
  }

  this.run = function() {
    self.isRunning = true;
    self.index = 0;
    self.frames = 0;

    self.startTime = (new Date()).getTime();
    self.time = self.startTime;

    self.dispatch('start');
    self.injectFrame(self.frameInjector);
    return self;
  };

  this.stop = function() {
    self.dispatch('stop');
    self.isRunning = false;
    return self;
  };

  this.addWorker = function(w, name, autostart) {
    if (typeof w != 'function') {
      throw new Error('Worker "' + name + '" is not a function');
    }

    self.workers.push({
      'name': name,
      'w': w
    });
    self.isRunning = !!(self.isRunning || (autostart && run()) || true);
    return self;
  };

  this.queueWorker = function(w, name, parent) {
    if (typeof w != 'function') {
      throw new Error('Worker "' + name + '" is not a function');
    }

    if (!self.workers.concat(self.queue).some(function(e) {
      return e['name'] == parent;
    })) {
      throw new Error(
        'Parent worker "' + parent + '" of "' + name + '" is not attached.'
      );
    }

    self.queue.push({
      'parent': parent,
      'name': name,
      'w': w
    });

    return self;
  };

  // queueStatus:
  //  - 0: nothing
  //  - 1: trigger queue
  //  - 2: empty queue
  this.removeWorker = function(v, queueStatus) {
    if (v == undefined) {
      self.workers = [];
      if (queueStatus > 0) {
        self.queue = [];
      }
      stop();
    } else {
      var n = (typeof v == 'string') ? v : '';
      self.workers = self.workers.filter(function(e) {
        if ((typeof v == 'string') ? e['name'] == v : e['w'] == v) {
          n = e['name'];
          return false;
        }
        return true;
      });

      if (queueStatus > 0) {
        self.queue = self.queue.filter(function(e) {
          if (queueStatus == 1 && e['parent'] == n) {
            self.workers.push(e);
          }
          return e['parent'] != n;
        });
      }
    }

    self.isRunning = !!(!self.workers.length || (stop() && false));
    return self;
  };

  this.fps = function(v) {
    if (v != undefined) {
      self.fpsReq = Math.abs(1 * v);
      self.frameTime = 1000 / self.fpsReq;
      self.frames = 0;
      self.time = (new Date()).getTime();
      return self;
    } else {
      return self.fpsReq;
    }
  };

  this.getFPS = function() {
    if (self.isRunning) {
      self.lastFPS =
        Math.round(
          self.frames /
          ((new Date()).getTime() - self.time) *
          10000
        ) / 10;
    }

    return self.lastFPS;
  };

  return this;
})();
