sigma.scheduler = (function() {
  sigma.classes.EventDispatcher.call(this);
  var self = this;

  this.isRunning = false;
  this.fpsReq = 60;
  this.lastFPS = 0;
  this.frameTime = 1000 / this.fpsReq;
  this.correctedFrameTime = this.frameTime;
  this.frames = 0;

  this.queuedTasks = [];
  this.tasks = [];

  this.delay = 0;

  this.frameInjector = function() {
    while (self.isRunning && self.tasks.length && self.routine()) {}

    if (!self.isRunning || !self.tasks.length) {
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
    self.index = self.index % self.tasks.length;

    if (!self.tasks[self.index]['task']()) {
      var n = self.tasks[self.index]['name'];

      self.queuedTasks = self.queuedTasks.filter(function(e) {
        (e['parent'] == n) && self.tasks.push({
          'name': e['name'],
          'task': e['task']
        });
        return e['parent'] != n;
      });

      self.dispatch('killed', self.tasks.splice(self.index--, 1)[0]);
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

  this.addTask = function(task, name, autostart) {
    if (typeof task != 'function') {
      throw new Error('Task "' + name + '" is not a function');
    }

    self.tasks.push({
      'name': name,
      'task': task
    });
    self.isRunning = !!(self.isRunning || (autostart && run()) || true);
    return self;
  };

  this.queueTask = function(task, name, parent) {
    if (typeof task != 'function') {
      throw new Error('Task "' + name + '" is not a function');
    }

    if (!self.tasks.concat(self.queuedTasks).some(function(e) {
      return e['name'] == parent;
    })) {
      throw new Error(
        'Parent task "' + parent + '" of "' + name + '" is not attached.'
      );
    }

    self.queuedTasks.push({
      'parent': parent,
      'name': name,
      'task': task
    });

    return self;
  };

  // queueStatus:
  //  - 0: nothing
  //  - 1: trigger queuedTasks
  //  - 2: empty queuedTasks
  this.removeTask = function(v, queueStatus) {
    if (v == undefined) {
      self.tasks = [];
      if (queueStatus > 0) {
        self.queuedTasks = [];
      }
      stop();
    } else {
      var n = (typeof v == 'string') ? v : '';
      self.tasks = self.tasks.filter(function(e) {
        if ((typeof v == 'string') ? e['name'] == v : e['task'] == v) {
          n = e['name'];
          return false;
        }
        return true;
      });

      if (queueStatus > 0) {
        self.queuedTasks = self.queuedTasks.filter(function(e) {
          if (queueStatus == 1 && e['parent'] == n) {
            self.tasks.push(e);
          }
          return e['parent'] != n;
        });
      }
    }

    self.isRunning = !!(!self.tasks.length || (stop() && false));
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
