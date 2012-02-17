sigma.chronos = new (function() {
  sigma.classes.EventDispatcher.call(this);
  var self = this;

  this.isRunning = false;
  this.fpsReq = 60;
  this.lastFPS = 0;
  this.frameTime = 1000 / this.fpsReq;
  this.correctedFrameTime = this.frameTime;
  this.frames = 0;

  this.generators = {};
  this.queuedTasks = [];
  this.tasks = [];

  this.delay = 0;

  // -----------
  // FRAMES    :
  // -----------
  function injectFrame(callback) {
    window.setTimeout(callback, 0);
    return self;
  }

  function frameInjector() {
    self.dispatch('frameinserted');
    while (self.isRunning && self.tasks.length && self.routine()) {}

    if (!self.isRunning || !self.tasks.length) {
      self.stop();
    } else {
      self.startTime = (new Date()).getTime();
      self.frames++;
      self.delay = self.effectiveTime - self.frameTime;
      self.correctedFrameTime = self.frameTime - self.delay;

      self.dispatch('insertframe');
      self.injectFrame(self.frameInjector);
    }
  };

  // -----------
  // TASKS     :
  // -----------
  function routine() {
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

  function run() {
    self.isRunning = true;
    self.index = 0;
    self.frames = 0;

    self.startTime = (new Date()).getTime();
    self.time = self.startTime;

    self.dispatch('start');
    self.dispatch('insertframe');
    self.injectFrame(self.frameInjector);
    return self;
  };

  function stop() {
    self.dispatch('stop');
    self.isRunning = false;
    return self;
  };

  function addTask(task, name, autostart) {
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

  function queueTask(task, name, parent) {
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
  function removeTask(v, queueStatus) {
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

  // -----------
  // GENERATORS:
  // -----------
  // addGenerator() will execute the task while it returns
  // 'true'. Then, it will execute the condition, and starts
  // the task back again if it is 'true'.
  function addGenerator(id, task, condition) {
    if (self.generators[id] != undefined) {
      return self;
    }

    self.generators[id] = {
      'task': task,
      'condition': condition
    };

    self.getGeneratorsCount(true) == 0 && self.startGenerators();
    return self;
  };

  function removeGenerator(id) {
    if (self.generators[id]) {
      self.generators[id].on = false;
      self.generators[id]['del'] = true;
    }
    return self;
  };

  function getGeneratorsCount(running) {
    return running ?
      Object.keys(self.generators).filter(function(id) {
        return !!self.generators[id].on;
      }).length :
      Object.keys(self.generators).length;
  };

  function startGenerators() {
    if (!Object.keys(self.generators).length) {
      self.dispatch('stopgenerators');
    }else {
      self.dispatch('startgenerators');

      self.unbind('killed', onTaskEnded);
      self.injectFrame(function() {
        for (var k in self.generators) {
          self.generators[k].on = true;
          self.addTask(
            self.generators[k].task,
            k,
            false
          );
        }
      });

      self.bind('killed', onTaskEnded).run();
    }

    return self;
  };

  function onTaskEnded(e) {
    if (self.generators[e.content.name] != undefined) {
      if (self.generators[e.content.name]['del'] ||
          !self.generators[e.content.name].condition()) {
        delete self.generators[e.content.name];
      }else {
        self.generators[e.content.name].on = false;
      }

      if (self.getGeneratorsCount(true) == 0) {
        self.startGenerators();
      }
    }
  };

  // -----------
  // FPS       :
  // -----------
  function fps(v) {
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

  function getFPS() {
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

  this.injectFrame = injectFrame;
  this.frameInjector = frameInjector;
  this.routine = routine;
  this.run = run;
  this.stop = stop;
  this.addTask = addTask;
  this.queueTask = queueTask;
  this.removeTask = removeTask;
  this.addGenerator = addGenerator;
  this.removeGenerator = removeGenerator;
  this.getGeneratorsCount = getGeneratorsCount;
  this.startGenerators = startGenerators;
  this.onTaskEnded = onTaskEnded;
  this.fps = fps;
  this.getFPS = getFPS;

  return this;
})();
