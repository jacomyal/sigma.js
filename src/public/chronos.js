/**
 * sigma.chronos manages frames insertion to simulate asynchronous computing.
 * It has been designed to make possible to execute heavy computing tasks
 * for the browser, without freezing it.
 * @constructor
 * @extends sigma.classes.Cascade
 * @extends sigma.classes.EventDispatcher
 * @this {sigma.chronos}
 */
sigma.chronos = new (function() {
  sigma.classes.EventDispatcher.call(this);

  /**
   * Represents "this", without the well-known scope issue.
   * @private
   * @type {sigma.chronos}
   */
  var self = this;

  /**
   * Indicates whether any task is actively running or not.
   * @private
   * @type {boolean}
   */
  var isRunning = false;

  /**
   * Indicates the FPS "goal", that will define the theoretical
   * frame length.
   * @private
   * @type {number}
   */
  var fpsReq = 80;

  /**
   * Stores the last computed FPS value (FPS is computed only when any
   * task is running).
   * @private
   * @type {number}
   */
  var lastFPS = 0;

  /**
   * The number of frames inserted since the last start.
   * @private
   * @type {number}
   */
  var framesCount = 0;

  /**
   * The theoretical frame time.
   * @private
   * @type {number}
   */
  var frameTime = 1000 / fpsReq;

  /**
   * The theoretical frame length, minus the last measured delay.
   * @private
   * @type {number}
   */
  var correctedFrameTime = frameTime;

  /**
   * The measured length of the last frame.
   * @private
   * @type {number}
   */
  var effectiveTime = 0;

  /**
   * The time passed since the last runTasks action.
   * @private
   * @type {number}
   */
  var currentTime = 0;

  /**
   * The time when the last frame was inserted.
   * @private
   * @type {number}
   */
  var startTime = 0;

  /**
   * The difference between the theoretical frame length and the
   * last measured frame length.
   * @private
   * @type {number}
   */
  var delay = 0;

  /**
   * The container of all active generators.
   * @private
   * @type {Object.<string, Object>}
   */
  var generators = {};

  /**
   * The array of all the referenced and active tasks.
   * @private
   * @type {Array.<Object>}
   */
  var tasks = [];

  /**
   * The array of all the referenced and queued tasks.
   * @private
   * @type {Array.<Object>}
   */
  var queuedTasks = [];

  /**
   * The index of the next task to execute.
   * @private
   * @type {number}
   */
  var taskIndex = 0;


  /**
   * Inserts a frame before executing the callback.
   * @param  {function()} callback The callback to execute after having
   *                               inserted the frame.
   * @return {sigma.chronos} Returns itself.
   */
  function insertFrame(callback) {
    window.setTimeout(callback, 0);
    return self;
  }

  /**
   * The local method that executes routine, and inserts frames when needed.
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
   * The local method that executes the tasks, and compares the current frame
   * length to the ideal frame length.
   * @private
   * @return {boolean} Returns false if the current frame should be ended,
   *                   and true else.
   */
  function routine() {
    taskIndex = taskIndex % tasks.length;

    if (!tasks[taskIndex].task()) {
      var n = tasks[taskIndex].taskName;

      queuedTasks = queuedTasks.filter(function(e) {
        (e.taskParent == n) && tasks.push({
          taskName: e.taskName,
          task: e.task
        });
        return e.taskParent != n;
      });

      self.dispatch('killed', tasks.splice(taskIndex--, 1)[0]);
    }

    taskIndex++;
    effectiveTime = (new Date()).getTime() - startTime;
    return effectiveTime <= correctedFrameTime;
  };

  /**
   * Starts tasks execution.
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
   * Stops tasks execution, and dispatch a "stop" event.
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
   * This method will add the task to this execution process.
   * @param {function(): boolean} task     The task to add.
   * @param {string} name                  The name of the worker, used for
   *                                       managing the different tasks.
   * @param {boolean} autostart            If true, sigma.chronos will start
   *                                       automatically if it is not working
   *                                       yet.
   * @return {sigma.chronos} Returns itself.
   */
  function addTask(task, name, autostart) {
    if (typeof task != 'function') {
      throw new Error('Task "' + name + '" is not a function');
    }

    tasks.push({
      taskName: name,
      task: task
    });

    isRunning = !!(isRunning || (autostart && runTasks()) || true);
    return self;
  };

  /**
   * Will add a task that will be start to be executed as soon as a task
   * named as the parent will be removed.
   * @param {function(): boolean} task     The task to add.
   * @param {string} name                  The name of the worker, used for
   *                                       managing the different tasks.
   * @param {string} parent                The name of the parent task.
   * @return {sigma.chronos} Returns itself.
   */
  function queueTask(task, name, parent) {
    if (typeof task != 'function') {
      throw new Error('Task "' + name + '" is not a function');
    }

    if (!tasks.concat(queuedTasks).some(function(e) {
      return e.taskName == parent;
    })) {
      throw new Error(
        'Parent task "' + parent + '" of "' + name + '" is not attached.'
      );
    }

    queuedTasks.push({
      taskParent: parent,
      taskName: name,
      task: task
    });

    return self;
  };

  /**
   * Removes a task.
   * @param  {string} v           If v is undefined, then every tasks will
   *                              be removed. If not, each task named v will
   *                              be removed.
   * @param  {number} queueStatus Determines the queued tasks behaviour. If 0,
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
        if ((typeof v == 'string') ? e.taskName == v : e.task == v) {
          n = e.taskName;
          return false;
        }
        return true;
      });

      if (queueStatus > 0) {
        queuedTasks = queuedTasks.filter(function(e) {
          if (queueStatus == 1 && e.taskParent == n) {
            tasks.push(e);
          }
          return e.taskParent != n;
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
   * @param {string} id                     The generators ID.
   * @param {function(): boolean} task      The generator's task.
   * @param {function(): boolean} condition The generator's condition.
   * @return {sigma.chronos} Returns itself.
   */
  function addGenerator(id, task, condition) {
    if (generators[id] != undefined) {
      return self;
    }

    generators[id] = {
      task: task,
      condition: condition
    };

    getGeneratorsCount(true) == 0 && startGenerators();
    return self;
  };

  /**
   * Removes a generator. It means that the task will continue being eecuted
   * until it returns false, but then the
   * condition will not be tested.
   * @param  {string} id The generator's ID.
   * @return {sigma.chronos} Returns itself.
   */
  function removeGenerator(id) {
    if (generators[id]) {
      generators[id].on = false;
      generators[id].del = true;
    }
    return self;
  };

  /**
   * Returns the number of generators.
   * @private
   * @param  {boolean} running If true, returns the number of active
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
   * Returns the array of the generators IDs.
   * @return {array.<string>} The array of IDs.
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
   * A callback triggered everytime the task of a generator stops, that will
   * test the related generator's condition, and see if there is still any
   * generator to start.
   * @private
   * @param  {Object} e The sigma.chronos "killed" event.
   */
  function onTaskEnded(e) {
    if (generators[e['content'].taskName] != undefined) {
      if (generators[e['content'].taskName].del ||
          !generators[e['content'].taskName].condition()) {
        delete generators[e['content'].taskName];
      }else {
        generators[e['content'].taskName].on = false;
      }

      if (getGeneratorsCount(true) == 0) {
        startGenerators();
      }
    }
  };

  /**
   * Either set or returns the fpsReq property. This property determines
   * the number of frames that should be inserted per second.
   * @param  {?number} v The frequency asked.
   * @return {(Chronos|number)} Returns the frequency if v is undefined, and
   *                          itself else.
   */
  function frequency(v) {
    if (v != undefined) {
      fpsReq = Math.abs(1 * v);
      frameTime = 1000 / fpsReq;
      framesCount = 0;
      return self;
    } else {
      return fpsReq;
    }
  };

  /**
   * Returns the actual average number of frames that are inserted per
   * second.
   * @return {number} The actual average FPS.
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
   * Returns the number of tasks.
   * @return {number} The number of tasks.
   */
  function getTasksCount() {
    return tasks.length;
  }

  /**
   * Returns the number of queued tasks.
   * @return {number} The number of queued tasks.
   */
  function getQueuedTasksCount() {
    return queuedTasks.length;
  }

  /**
   * Returns how long sigma.chronos has active tasks running
   * without interuption for, in ms.
   * @return {number} The time chronos is running without interuption for.
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

