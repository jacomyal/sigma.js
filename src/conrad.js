/**
 * conrad.js is a tiny JavaScript jobs scheduler,
 *
 * Version: 0.1.0
 * Sources: http://github.com/jacomyal/conrad.js
 * Doc:     http://github.com/jacomyal/conrad.js#readme
 *
 * License:
 * --------
 * Copyright © 2013 Alexis Jacomy, Sciences-Po médialab
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * The Software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the
 * authors or copyright holders be liable for any claim, damages or other
 * liability, whether in an action of contract, tort or otherwise, arising
 * from, out of or in connection with the software or the use or other dealings
 * in the Software.
 */
(function(global) {
  'use strict';

  // Check that conrad.js has not been loaded yet:
  if (global.conrad)
    throw new Error('conrad already exists');


  /**
   * PRIVATE VARIABLES:
   * ******************
   */

  /**
   * A flag indicating whether conrad is running or not.
   *
   * @type {Number}
   */
  var _lastFrameTime;

  /**
   * A flag indicating whether conrad is running or not.
   *
   * @type {Boolean}
   */
  var _isRunning = false;

  /**
   * The hash of registered jobs. Each job must at least have a unique ID
   * under the key "id" and a function under the key "job". This hash
   * contains each running job and each waiting job.
   *
   * @type {Object}
   */
  var _jobs = {};

  /**
   * The hash of currently running jobs.
   *
   * @type {Object}
   */
  var _runningJobs = {};

  /**
   * The array of currently running jobs, sorted by priority.
   *
   * @type {Array}
   */
  var _sortedByPriorityJobs = [];

  /**
   * The array of currently waiting jobs.
   *
   * @type {Object}
   */
  var _waitingJobs = {};

  /**
   * The array of finished jobs. They are stored in an array, since two jobs
   * with the same "id" can happen at two different times.
   *
   * @type {Array}
   */
  var _doneJobs = [];

  /**
   * A dirty flag to keep conrad from starting: Indeed, when addJob() is called
   * with several jobs, conrad must be started only at the end. This flag keeps
   * me from duplicating the code that effectively adds a job.
   *
   * @type {Boolean}
   */
  var _noStart = false;

  /**
   * An hash containing some global settings about how conrad.js should
   * behave.
   *
   * @type {Object}
   */
  var _parameters = {
    frameDuration: 20,
    history: true
  };

  /**
   * This object contains every handlers bound to conrad events. It does not
   * requirea any DOM implementation, since the events are all JavaScript.
   *
   * @type {Object}
   */
  var _handlers = Object.create(null);


  /**
   * PRIVATE FUNCTIONS:
   * ******************
   */

  /**
   * Will execute the handler everytime that the indicated event (or the
   * indicated events) will be triggered.
   *
   * @param  {string|array|object} events  The name of the event (or the events
   *                                       separated by spaces).
   * @param  {function(Object)}    handler The handler to bind.
   * @return {Object}                      Returns conrad.
   */
  function _bind(events, handler) {
    var i,
        i_end,
        event,
        eArray;

    if (!arguments.length)
      return;
    else if (
      arguments.length === 1 &&
      Object(arguments[0]) === arguments[0]
    )
      for (events in arguments[0])
        _bind(events, arguments[0][events]);
    else if (arguments.length > 1) {
      eArray =
        Array.isArray(events) ?
          events :
          events.split(/ /);

      for (i = 0, i_end = eArray.length; i !== i_end; i += 1) {
        event = eArray[i];

        if (!_handlers[event])
          _handlers[event] = [];

        // Using an object instead of directly the handler will make possible
        // later to add flags
        _handlers[event].push({
          handler: handler
        });
      }
    }
  }

  /**
   * Removes the handler from a specified event (or specified events).
   *
   * @param  {?string}           events  The name of the event (or the events
   *                                     separated by spaces). If undefined,
   *                                     then all handlers are removed.
   * @param  {?function(Object)} handler The handler to unbind. If undefined,
   *                                     each handler bound to the event or the
   *                                     events will be removed.
   * @return {Object}            Returns conrad.
   */
  function _unbind(events, handler) {
    var i,
        i_end,
        j,
        j_end,
        a,
        event,
        eArray = Array.isArray(events) ?
                   events :
                   events.split(/ /);

    if (!arguments.length)
      _handlers = Object.create(null);
    else if (handler) {
      for (i = 0, i_end = eArray.length; i !== i_end; i += 1) {
        event = eArray[i];
        if (_handlers[event]) {
          a = [];
          for (j = 0, j_end = _handlers[event].length; j !== j_end; j += 1)
            if (_handlers[event][j].handler !== handler)
              a.push(_handlers[event][j]);

          _handlers[event] = a;
        }

        if (_handlers[event] && _handlers[event].length === 0)
          delete _handlers[event];
      }
    } else
      for (i = 0, i_end = eArray.length; i !== i_end; i += 1)
        delete _handlers[eArray[i]];
  }

  /**
   * Executes each handler bound to the event.
   *
   * @param  {string}  events The name of the event (or the events separated
   *                          by spaces).
   * @param  {?Object} data   The content of the event (optional).
   * @return {Object}         Returns conrad.
   */
  function _dispatch(events, data) {
    var i,
        j,
        i_end,
        j_end,
        event,
        eventName,
        eArray = Array.isArray(events) ?
                   events :
                   events.split(/ /);

    data = data === undefined ? {} : data;

    for (i = 0, i_end = eArray.length; i !== i_end; i += 1) {
      eventName = eArray[i];

      if (_handlers[eventName]) {
        event = {
          type: eventName,
          data: data || {}
        };

        for (j = 0, j_end = _handlers[eventName].length; j !== j_end; j += 1)
          try {
            _handlers[eventName][j].handler(event);
          } catch (e) {}
      }
    }
  }

  /**
   * Executes the most prioritary job once, and deals with filling the stats
   * (done, time, averageTime, currentTime, etc...).
   *
   * @return {?Object} Returns the job object if it has to be killed, null else.
   */
  function _executeFirstJob() {
    var i,
        l,
        test,
        kill,
        pushed = false,
        time = __dateNow(),
        job = _sortedByPriorityJobs.shift();

    // Execute the job and look at the result:
    test = job.job();

    // Deal with stats:
    time = __dateNow() - time;
    job.done++;
    job.time += time;
    job.currentTime += time;
    job.weightTime = job.currentTime / (job.weight || 1);
    job.averageTime = job.time / job.done;

    // Check if the job has to be killed:
    kill = job.count ? (job.count <= job.done) : !test;

    // Reset priorities:
    if (!kill) {
      for (i = 0, l = _sortedByPriorityJobs.length; i < l; i++)
        if (_sortedByPriorityJobs[i].weightTime > job.weightTime) {
          _sortedByPriorityJobs.splice(i, 0, job);
          pushed = true;
          break;
        }

      if (!pushed)
        _sortedByPriorityJobs.push(job);
    }

    return kill ? job : null;
  }

  /**
   * Activates a job, by adding it to the _runningJobs object and the
   * _sortedByPriorityJobs array. It also initializes its currentTime value.
   *
   * @param  {Object} job The job to activate.
   */
  function _activateJob(job) {
    var l = _sortedByPriorityJobs.length;

    // Add the job to the running jobs:
    _runningJobs[job.id] = job;
    job.status = 'running';

    // Add the job to the priorities:
    if (l) {
      job.weightTime = _sortedByPriorityJobs[l - 1].weightTime;
      job.currentTime = job.weightTime * (job.weight || 1);
    }

    // Initialize the job and dispatch:
    job.startTime = __dateNow();
    _dispatch('jobStarted', __clone(job));

    _sortedByPriorityJobs.push(job);
  }

  /**
   * The main loop of conrad.js:
   *  . It executes job such that they all occupate the same processing time.
   *  . It stops jobs that do not need to be executed anymore.
   *  . It triggers callbacks when it is relevant.
   *  . It starts waiting jobs when they need to be started.
   *  . It injects frames to keep a constant frapes per second ratio.
   *  . It stops itself when there are no more jobs to execute.
   */
  function _loop() {
    var k,
        o,
        l,
        job,
        time,
        deadJob;

    // Deal with the newly added jobs (the _jobs object):
    for (k in _jobs) {
      job = _jobs[k];

      if (job.after)
        _waitingJobs[k] = job;
      else
        _activateJob(job);

      delete _jobs[k];
    }

    // Set the _isRunning flag to false if there are no running job:
    _isRunning = !!_sortedByPriorityJobs.length;

    // Deal with the running jobs (the _runningJobs object):
    while (
      _sortedByPriorityJobs.length &&
      __dateNow() - _lastFrameTime < _parameters.frameDuration
    ) {
      deadJob = _executeFirstJob();

      // Deal with the case where the job has ended:
      if (deadJob) {
        _killJob(deadJob.id);

        // Check for waiting jobs:
        for (k in _waitingJobs)
          if (_waitingJobs[k].after === deadJob.id) {
            _activateJob(_waitingJobs[k]);
            delete _waitingJobs[k];
          }
      }
    }

    // Check if conrad still has jobs to deal with, and kill it if not:
    if (_isRunning) {
      // Update the _lastFrameTime:
      _lastFrameTime = __dateNow();

      _dispatch('enterFrame');
      setTimeout(_loop, 0);
    } else
      _dispatch('stop');
  }

  /**
   * Adds one or more jobs, and starts the loop if no job was running before. A
   * job is at least a unique string "id" and a function, and there are some
   * parameters that you can specify for each job to modify the way conrad will
   * execute it. If a job is added with the "id" of another job that is waiting
   * or still running, an error will be thrown.
   *
   * When a job is added, it is referenced in the _jobs object, by its id.
   * Then, if it has to be executed right now, it will be also referenced in
   * the _runningJobs object. If it has to wait, then it will be added into the
   * _waitingJobs object, until it can start.
   *
   * Keep reading this documentation to see how to call this method.
   *
   * @return {Object} Returns conrad.
   *
   * Adding one job:
   * ***************
   * Basically, a job is defined by its string id and a function (the job). It
   * is also possible to add some parameters:
   *
   *  > conrad.addJob('myJobId', myJobFunction);
   *  > conrad.addJob('myJobId', {
   *  >   job: myJobFunction,
   *  >   someParameter: someValue
   *  > });
   *  > conrad.addJob({
   *  >   id: 'myJobId',
   *  >   job: myJobFunction,
   *  >   someParameter: someValue
   *  > });
   *
   * Adding several jobs:
   * ********************
   * When adding several jobs at the same time, it is possible to specify
   * parameters for each one individually or for all:
   *
   *  > conrad.addJob([
   *  >   {
   *  >     id: 'myJobId1',
   *  >     job: myJobFunction1,
   *  >     someParameter1: someValue1
   *  >   },
   *  >   {
   *  >     id: 'myJobId2',
   *  >     job: myJobFunction2,
   *  >     someParameter2: someValue2
   *  >   }
   *  > ], {
   *  >   someCommonParameter: someCommonValue
   *  > });
   *  > conrad.addJob({
   *  >   myJobId1: {,
   *  >     job: myJobFunction1,
   *  >     someParameter1: someValue1
   *  >   },
   *  >   myJobId2: {,
   *  >     job: myJobFunction2,
   *  >     someParameter2: someValue2
   *  >   }
   *  > }, {
   *  >   someCommonParameter: someCommonValue
   *  > });
   *  > conrad.addJob({
   *  >   myJobId1: myJobFunction1,
   *  >   myJobId2: myJobFunction2
   *  > }, {
   *  >   someCommonParameter: someCommonValue
   *  > });
   *
   *  Recognized parameters:
   *  **********************
   *  Here is the exhaustive list of every accepted parameters:
   *
   *    {?Function} end      A callback to execute when the job is ended. It is
   *                         not executed if the job is killed instead of ended
   *                         "naturally".
   *    {?Integer}  count    The number of time the job has to be executed.
   *    {?Number}   weight   If specified, the job will be executed as it was
   *                         added "weight" times.
   *    {?String}   after    The id of another job (eventually not added yet).
   *                         If specified, this job will start only when the
   *                         specified "after" job is ended.
   */
  function _addJob(v1, v2) {
    var i,
        l,
        o;

    // Array of jobs:
    if (Array.isArray(v1)) {
      // Keep conrad to start until the last job is added:
      _noStart = true;

      for (i = 0, l = v1.length; i < l; i++)
        _addJob(v1[i].id, __extend(v1[i], v2));

      _noStart = false;
      if (!_isRunning) {
        // Update the _lastFrameTime:
        _lastFrameTime = __dateNow();

        _dispatch('start');
        _loop();
      }
    } else if (typeof v1 === 'object') {
      // One job (object):
      if (typeof v1.id === 'string')
        _addJob(v1.id, v1);

      // Hash of jobs:
      else {
        // Keep conrad to start until the last job is added:
        _noStart = true;

        for (i in v1)
          if (typeof v1[i] === 'function')
            _addJob(i, __extend({
              job: v1[i]
            }, v2));
          else
            _addJob(i, __extend(v1[i], v2));

        _noStart = false;
        if (!_isRunning) {
          // Update the _lastFrameTime:
          _lastFrameTime = __dateNow();

          _dispatch('start');
          _loop();
        }
      }

    // One job (string, *):
    } else if (typeof v1 === 'string') {
      if (_hasJob(v1))
        throw new Error(
          '[conrad.addJob] Job with id "' + v1 + '" already exists.'
        );

      // One job (string, function):
      if (typeof v2 === 'function') {
        o = {
          id: v1,
          done: 0,
          time: 0,
          status: 'waiting',
          currentTime: 0,
          averageTime: 0,
          weightTime: 0,
          job: v2
        };

      // One job (string, object):
      } else if (typeof v2 === 'object') {
        o = __extend(
          {
            id: v1,
            done: 0,
            time: 0,
            status: 'waiting',
            currentTime: 0,
            averageTime: 0,
            weightTime: 0
          },
          v2
        );

      // If none of those cases, throw an error:
      } else
        throw new Error('[conrad.addJob] Wrong arguments.');

      // Effectively add the job:
      _jobs[v1] = o;
      _dispatch('jobAdded', __clone(o));

      // Check if the loop has to be started:
      if (!_isRunning && !_noStart) {
        // Update the _lastFrameTime:
        _lastFrameTime = __dateNow();

        _dispatch('start');
        _loop();
      }

    // If none of those cases, throw an error:
    } else
      throw new Error('[conrad.addJob] Wrong arguments.');

    return this;
  }

  /**
   * Kills one or more jobs, indicated by their ids. It is only possible to
   * kill running jobs or waiting jobs. If you try to kill a job that does not
   * exists or that is already killed, a warning will be thrown.
   *
   * @param  {Array|String} v1 A string job id or an array of job ids.
   * @return {Object}       Returns conrad.
   */
  function _killJob(v1) {
    var i,
        l,
        k,
        a,
        job,
        found = false;

    // Array of job ids:
    if (Array.isArray(v1))
      for (i = 0, l = v1.length; i < l; i++)
        _killJob(v1[i]);

    // One job's id:
    else if (typeof v1 === 'string') {
      a = [_runningJobs, _waitingJobs, _jobs];

      // Remove the job from the hashes:
      for (i = 0, l = a.length; i < l; i++)
        if (v1 in a[i]) {
          job = a[i][v1];

          if (_parameters.history) {
            job.status = 'done';
            _doneJobs.push(job);
          }

          _dispatch('jobEnded', __clone(job));
          delete a[i][v1];

          if (typeof job.end === 'function')
            job.end();

          found = true;
        }

      // Remove the priorities array:
      a = _sortedByPriorityJobs;
      for (i = 0, l = a.length; i < l; i++)
        if (a[i].id === v1) {
          a.splice(i, 1);
          break;
        }

      if (!found)
        throw new Error('[conrad.killJob] Job "' + v1 + '" not found.');

    // If none of those cases, throw an error:
    } else
      throw new Error('[conrad.killJob] Wrong arguments.');

    return this;
  }

  /**
   * Kills every running, waiting, and just added jobs.
   *
   * @return {Object} Returns conrad.
   */
  function _killAll() {
    var k,
        jobs = __extend(_jobs, _runningJobs, _waitingJobs);

    // Take every jobs and push them into the _doneJobs object:
    if (_parameters.history)
      for (k in jobs) {
        jobs[k].status = 'done';
        _doneJobs.push(jobs[k]);

        if (typeof jobs[k].end === 'function')
          jobs[k].end();
      }

    // Reinitialize the different jobs lists:
    _jobs = {};
    _waitingJobs = {};
    _runningJobs = {};
    _sortedByPriorityJobs = [];

    // In case some jobs are added right after the kill:
    _isRunning = false;

    return this;
  }

  /**
   * Returns true if a job with the specified id is currently running or
   * waiting, and false else.
   *
   * @param  {String}  id The id of the job.
   * @return {?Object} Returns the job object if it exists.
   */
  function _hasJob(id) {
    var job = _jobs[id] || _runningJobs[id] || _waitingJobs[id];
    return job ? __extend(job) : null;
  }

  /**
   * This method will set the setting specified by "v1" to the value specified
   * by "v2" if both are given, and else return the current value of the
   * settings "v1".
   *
   * @param  {String}   v1 The name of the property.
   * @param  {?*}       v2 Eventually, a value to set to the specified
   *                       property.
   * @return {Object|*} Returns the specified settings value if "v2" is not
   *                    given, and conrad else.
   */
  function _settings(v1, v2) {
    var o;

    if (typeof a1 === 'string' && arguments.length === 1)
      return _parameters[a1];
    else {
      o = (typeof a1 === 'object' && arguments.length === 1) ?
        a1 || {} :
        {};
      if (typeof a1 === 'string')
        o[a1] = a2;

      for (var k in o)
        if (o[k] !== undefined)
          _parameters[k] = o[k];
        else
          delete _parameters[k];

      return this;
    }
  }

  /**
   * Returns true if conrad is currently running, and false else.
   *
   * @return {Boolean} Returns _isRunning.
   */
  function _getIsRunning() {
    return _isRunning;
  }

  /**
   * Unreference every jobs that are stored in the _doneJobs object. It will
   * not be possible anymore to get stats about these jobs, but it will release
   * the memory.
   *
   * @return {Object} Returns conrad.
   */
  function _clearHistory() {
    _doneJobs = [];
    return this;
  }

  /**
   * Returns a snapshot of every data about jobs that wait to be started, are
   * currently running or are done.
   *
   * It is possible to get only running, waiting or done jobs by giving
   * "running", "waiting" or "done" as fist argument.
   *
   * It is also possible to get every job with a specified id by giving it as
   * first argument. Also, using a RegExp instead of an id will return every
   * jobs whose ids match the RegExp. And these two last use cases work as well
   * by giving before "running", "waiting" or "done".
   *
   * @return {Array} The array of the matching jobs.
   *
   * Some call examples:
   * *******************
   *  > conrad.getStats('running')
   *  > conrad.getStats('waiting')
   *  > conrad.getStats('done')
   *  > conrad.getStats('myJob')
   *  > conrad.getStats(/test/)
   *  > conrad.getStats('running', 'myRunningJob')
   *  > conrad.getStats('running', /test/)
   */
  function _getStats(v1, v2) {
    var a,
        k,
        i,
        l,
        stats,
        pattern,
        isPatternString;

    if (!arguments.length) {
      stats = [];

      for (k in _jobs)
        stats.push(_jobs[k]);

      for (k in _waitingJobs)
        stats.push(_waitingJobs[k]);

      for (k in _runningJobs)
        stats.push(_runningJobs[k]);

      stats = stats.concat(_doneJobs);
    }

    if (typeof v1 === 'string')
      switch (v1) {
        case 'waiting':
          stats = __objectValues(_waitingJobs);
          break;
        case 'running':
          stats = __objectValues(_runningJobs);
          break;
        case 'done':
          stats = _doneJobs;
          break;
        default:
          pattern = v1;
      }

    if (v1 instanceof RegExp)
      pattern = v1;

    if (!pattern && (typeof v2 === 'string' || v2 instanceof RegExp))
      pattern = v2;

    // Filter jobs if a pattern is given:
    if (pattern) {
      isPatternString = typeof pattern === 'string';

      if (stats instanceof Array) {
        a = stats;
      } else if (typeof stats === 'object') {
        a = [];

        for (k in stats)
          a = a.concat(stats[k]);
      } else {
        a = [];

        for (k in _jobs)
          a.push(_jobs[k]);

        for (k in _waitingJobs)
          a.push(_waitingJobs[k]);

        for (k in _runningJobs)
          a.push(_runningJobs[k]);

        a = a.concat(_doneJobs);
      }

      stats = [];
      for (i = 0, l = a.length; i < l; i++)
        if (isPatternString ? a[i].id === pattern : a[i].id.match(pattern))
          stats.push(a[i]);
    }

    return __clone(stats);
  }


  /**
   * TOOLS FUNCTIONS:
   * ****************
   */

  /**
   * This function takes any number of objects as arguments, copies from each
   * of these objects each pair key/value into a new object, and finally
   * returns this object.
   *
   * The arguments are parsed from the last one to the first one, such that
   * when two objects have keys in common, the "earliest" object wins.
   *
   * Example:
   * ********
   *  > var o1 = {
   *  >       a: 1,
   *  >       b: 2,
   *  >       c: '3'
   *  >     },
   *  >     o2 = {
   *  >       c: '4',
   *  >       d: [ 5 ]
   *  >     };
   *  > __extend(o1, o2);
   *  > // Returns: {
   *  > //   a: 1,
   *  > //   b: 2,
   *  > //   c: '3',
   *  > //   d: [ 5 ]
   *  > // };
   *
   * @param  {Object+} Any number of objects.
   * @return {Object}  The merged object.
   */
  function __extend() {
    var i,
        k,
        res = {},
        l = arguments.length;

    for (i = l - 1; i >= 0; i--)
      for (k in arguments[i])
        res[k] = arguments[i][k];

    return res;
  }

  /**
   * This function simply clones an object. This object must contain only
   * objects, arrays and immutable values. Since it is not public, it does not
   * deal with cyclic references, DOM elements and instantiated objects - so
   * use it carefully.
   *
   * @param  {Object} The object to clone.
   * @return {Object} The clone.
   */
  function __clone(item) {
    var result, i, k, l;

    if (!item)
      return item;

    if (Array.isArray(item)) {
      result = [];
      for (i = 0, l = item.length; i < l; i++)
        result.push(__clone(item[i]));
    } else if (typeof item === 'object') {
      result = {};
      for (i in item)
        result[i] = __clone(item[i]);
    } else
      result = item;

    return result;
  }

  /**
   * Returns an array containing the values of an object.
   *
   * @param  {Object} The object.
   * @return {Array}  The array of values.
   */
  function __objectValues(o) {
    var k,
        a = [];

    for (k in o)
      a.push(o[k]);

    return a;
  }

  /**
   * A short "Date.now()" polyfill.
   *
   * @return {Number} The current time (in ms).
   */
  function __dateNow() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  /**
   * Polyfill for the Array.isArray function:
   */
  if (!Array.isArray)
    Array.isArray = function(v) {
      return Object.prototype.toString.call(v) === '[object Array]';
    };


  /**
   * EXPORT PUBLIC API:
   * ******************
   */
  var conrad = {
    hasJob: _hasJob,
    addJob: _addJob,
    killJob: _killJob,
    killAll: _killAll,
    settings: _settings,
    getStats: _getStats,
    isRunning: _getIsRunning,
    clearHistory: _clearHistory,

    // Events management:
    bind: _bind,
    unbind: _unbind,

    // Version:
    version: '0.1.0'
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = conrad;
    exports.conrad = conrad;
  }
  global.conrad = conrad;
})(this);
