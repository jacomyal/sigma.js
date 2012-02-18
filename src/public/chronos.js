/**
 * sigma.chronos manages frames insertion to simulate asynchronous computing.
 * It has been designed to make possible to execute heavy computing tasks
 * for the browser, without freezing it.
 * @constructor
 */
sigma.chronos = new (function() {
  sigma.classes.EventDispatcher.call(this);

  var self = this;

  var isRunning = false;

  var fpsReq = 60;
  var lastFPS = 0;
  var framesCount = 0;
  var correctedFrameTime = frameTime;

  var frameTime = 1000 / fpsReq;
  var effectiveTime = 0;
  var currentTime = 0;
  var startTime = 0;
  var delay = 0;

  var generators = {};
  var queuedTasks = [];
  var tasks = [];

  var taskIndex = 0;


  /**
   * insertFrame will insert a frame before executing the callback.
   * @param  {Function} callback The callback to execute after having
   *                             inserted the frame.
   * @return {sigma.chronos} Returns itself.
   */
  function insertFrame(callback) {
    window.setTimeout(callback, 0);
    return self;
  }

  /**
   * frameInserter is the local method that executes routine, and inserts
   * frames when needed.
   * It dispatches a "frameinserted" event after having inserted any frame,
   * and an "insertframe" event before.
   * @private
   */
  function frameInserter() {
    self.dispatch('frameinserted');
    while (isRunning && tasks.length && routine()) {}

    if (!isRunning || !tasks.length) {
      stopTasks();
    } else {
      startTime = (new Date()).getTime();
      framesCount++;
      delay = effectiveTime - frameTime;
      correctedFrameTime = frameTime - delay;

      self.dispatch('insertframe');
      insertFrame(frameInserter);
    }
  };

  /**
   * routine is the local method that executes the tasks, and compares
   * the current frame length to the ideal frame length.
   * @private
   * @return {Boolean} Returns false if the current frame should be ended,
   *                   and true else.
   */
  function routine() {
    taskIndex = taskIndex % tasks.length;

    if (!tasks[taskIndex]['task']()) {
      var n = tasks[taskIndex]['name'];

      queuedTasks = queuedTasks.filter(function(e) {
        (e['parent'] == n) && tasks.push({
          'name': e['name'],
          'task': e['task']
        });
        return e['parent'] != n;
      });

      self.dispatch('killed', tasks.splice(taskIndex--, 1)[0]);
    }

    taskIndex++;
    effectiveTime = (new Date()).getTime() - startTime;
    return effectiveTime <= correctedFrameTime;
  };

  /**
   * runTasks will start tasks execution.
   * @return {sigma.chronos} Returns itself.
   */
  function runTasks() {
    isRunning = true;
    taskIndex = 0;
    framesCount = 0;

    startTime = (new Date()).getTime();
    currentTime = startTime;

    self.dispatch('start');
    self.dispatch('insertframe');
    insertFrame(frameInserter);
    return self;
  };

  /**
   * stopTasks will stop tasks execution, and dispatch a "stop" event.
   * @return {sigma.chronos} Returns itself.
   */
  function stopTasks() {
    self.dispatch('stop');
    isRunning = false;
    return self;
  };

  /**
   * A task is a function that will be executed continuously while it returns
   * true. As soon as it return false, the task will be removed.
   * If several tasks are present, they will be executed in parallele.
   * addTask will add the task to this execution process.
   * @param {Function} task     The task to add.
   * @param {String} name       The name of the worker, used for
   *                            managing the different running tasks.
   * @param {Boolean} autostart If true, sigma.chronos will start
   *                            automatically if it is not working
   *                            yet.
   * @return {sigma.chronos} Returns itself.
   */
  function addTask(task, name, autostart) {
    if (typeof task != 'function') {
      throw new Error('Task "' + name + '" is not a function');
    }

    tasks.push({
      'name': name,
      'task': task
    });
    isRunning = !!(isRunning || (autostart && runTasks()) || true);
    return self;
  };

  /**
   * queueTask will add a task that will be start to be executed as soon
   * as a task named as the parent will be removed.
   * @param {Function} task     The task to add.
   * @param {String} name       The name of the worker, used for
   *                            managing the different running tasks.
   * @param {tring} parent      The name of the parent task.
   * @return {sigma.chronos} Returns itself.
   */
  function queueTask(task, name, parent) {
    if (typeof task != 'function') {
      throw new Error('Task "' + name + '" is not a function');
    }

    if (!tasks.concat(queuedTasks).some(function(e) {
      return e['name'] == parent;
    })) {
      throw new Error(
        'Parent task "' + parent + '" of "' + name + '" is not attached.'
      );
    }

    queuedTasks.push({
      'parent': parent,
      'name': name,
      'task': task
    });

    return self;
  };

  /**
   * removeTask will remove a task.
   * @param  {String} v           If v is undefined, then every tasks will
   *                              be removed. If not, each task named v will
   *                              be removed.
   * @param  {Number} queueStatus Determines the queued tasks behaviour. If 0,
   *                              then nothing will happen. If 1, the tasks
   *                              queued to any removed task will be triggered.
   *                              If 2, the tasks queued to any removed task
   *                              will be removed as well.
   * @return {sigma.chronos} Returns itself.
   */
  function removeTask(v, queueStatus) {
    if (v == undefined) {
      tasks = [];
      if (queueStatus == 1) {
        queuedTasks = [];
      }else if (queueStatus == 2) {
        tasks = queuedTasks;
        queuedTasks = [];
      }
      stopTasks();
    } else {
      var n = (typeof v == 'string') ? v : '';
      tasks = tasks.filter(function(e) {
        if ((typeof v == 'string') ? e['name'] == v : e['task'] == v) {
          n = e['name'];
          return false;
        }
        return true;
      });

      if (queueStatus > 0) {
        queuedTasks = queuedTasks.filter(function(e) {
          if (queueStatus == 1 && e['parent'] == n) {
            tasks.push(e);
          }
          return e['parent'] != n;
        });
      }
    }

    isRunning = !!(!tasks.length || (stopTasks() && false));
    return self;
  };

  /**
   * A generator is a pair task/condition. The task will be executed
   * while it returns true.
   * When it returns false, the condition will be tested. If
   * the condition returns true, the task will be executed
   * again at the next process iteration. If not, the generator
   * is removed.
   * If several generators are present, they will be executed one
   * by one: When the first stops, the second will start, etc. When
   * they are all ended, then the conditions will be tested to know
   * which generators have to be started again.
   * @param {String} id          The generators ID.
   * @param {Function} task      The generator's task.
   * @param {Function} condition The generator's condition.
   * @return {sigma.chronos} Returns itself.
   */
  function addGenerator(id, task, condition) {
    if (generators[id] != undefined) {
      return self;
    }

    generators[id] = {
      'task': task,
      'condition': condition
    };

    getGeneratorsCount(true) == 0 && startGenerators();
    return self;
  };

  /**
   * removeGenerator will remove a generator. It means that the task
   * will continue being executed until it returns false, but then the
   * condition will not be tested.
   * @param  {String} id The generator's ID.
   * @return {sigma.chronos} Returns itself.
   */
  function removeGenerator(id) {
    if (generators[id]) {
      generators[id].on = false;
      generators[id]['del'] = true;
    }
    return self;
  };

  /**
   * getGeneratorsCount returns the number of generators.
   * @param  {Boolean} running If true, returns the number of active
   *                          generators instead.
   * @return {sigma.chronos} Returns itself.
   */
  function getGeneratorsCount(running) {
    return running ?
      Object.keys(generators).filter(function(id) {
        return !!generators[id].on;
      }).length :
      Object.keys(generators).length;
  };

  /**
   * getGeneratorsIDs returns the array of the generators IDs.
   * @return {Array} The array of IDs.
   */
  function getGeneratorsIDs() {
    return Object.keys(generators);
  }

  /**
   * startGenerators is the method that manages which generator
   * is the next to start when another one stops. It will dispatch
   * a "stopgenerators" event if there is no more generator to start,
   * and a "startgenerators" event else.
   * @return {sigma.chronos} Returns itself.
   */
  function startGenerators() {
    if (!Object.keys(generators).length) {
      self.dispatch('stopgenerators');
    }else {
      self.dispatch('startgenerators');

      self.unbind('killed', onTaskEnded);
      insertFrame(function() {
        for (var k in generators) {
          generators[k].on = true;
          addTask(
            generators[k].task,
            k,
            false
          );
        }
      });

      self.bind('killed', onTaskEnded).runTasks();
    }

    return self;
  };

  /**
   * onTaskEnded will be triggered everytime the task of a generator stops,
   * test the related generator's condition, and see if there is still any
   * generator to start.
   * @param  {Object} e The sigma.chronos "killed" event.
   */
  function onTaskEnded(e) {
    if (generators[e.content.name] != undefined) {
      if (generators[e.content.name]['del'] ||
          !generators[e.content.name].condition()) {
        delete generators[e.content.name];
      }else {
        generators[e.content.name].on = false;
      }

      if (getGeneratorsCount(true) == 0) {
        startGenerators();
      }
    }
  };

  /**
   * frequency will either set or returns the fpsReq property. This property
   * determines the number of frames that should be inserted per second.
   * @param  {Number} v The frequency asked.
   * @return {not indicated} Returns the frequency if v is undefined, and
   *                         itself else.
   */
  function frequency(v) {
    if (v != undefined) {
      fpsReq = Math.abs(1 * v);
      frameTime = 1000 / fpsReq;
      framesCount = 0;
      currentTime = (new Date()).getTime();
      return self;
    } else {
      return fpsReq;
    }
  };

  /**
   * getFPS returns the actual average number of frames that are inserted per
   * second.
   * @return {Number} The actual average FPS.
   */
  function getFPS() {
    if (isRunning) {
      lastFPS =
        Math.round(
          framesCount /
          ((new Date()).getTime() - currentTime) *
          10000
        ) / 10;
    }

    return lastFPS;
  };

  /**
   * getTasksCount returns the number of tasks.
   * @return {Number} The number of tasks.
   */
  function getTasksCount() {
    return tasks.length;
  }

  /**
   * getQueuedTasksCount returns the number of queued tasks.
   * @return {Number} The number of queued tasks.
   */
  function getQueuedTasksCount() {
    return queuedTasks.length;
  }

  /**
   * getExecutionTime returns how long sigma.chronos has active tasks running
   * without interuption for, in ms.
   * @return {Number} The time chronos is running without interuption for.
   */
  function getExecutionTime() {
    return startTime - currentTime;
  }

  this.frequency = frequency;

  this.runTasks = runTasks;
  this.stopTasks = stopTasks;
  this.insertFrame = insertFrame;

  this.addTask = addTask;
  this.queueTask = queueTask;
  this.removeTask = removeTask;

  this.addGenerator = addGenerator;
  this.removeGenerator = removeGenerator;
  this.startGenerators = startGenerators;
  this.getGeneratorsIDs = getGeneratorsIDs;

  this.getFPS = getFPS;
  this.getTasksCount = getTasksCount;
  this.getQueuedTasksCount = getQueuedTasksCount;
  this.getExecutionTime = getExecutionTime;

  return this;
})();

