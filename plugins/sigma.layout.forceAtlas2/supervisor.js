;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw new Error('sigma is not declared');

  // Initialize package:
  sigma.utils.pkg('sigma.layouts');

  /**
   * Sigma ForceAtlas2.5 Supervisor
   * ===============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Autostop author: Sébastien Heymann @ Linkurious
   * Version: 0.1
   */
  var _root = this;

  /**
   * Feature detection
   * ------------------
   */
  var webWorkers = 'Worker' in _root;

  /**
   * Event emitter Object
   * ------------------
   */
  var eventEmitter = {};
  sigma.classes.dispatcher.extend(eventEmitter);

  /**
   * Supervisor Object
   * ------------------
   */
  function Supervisor(sigInst, options) {
    // Window URL Polyfill
    _root.URL = _root.URL || _root.webkitURL;

    options = options || {};

    // Properties
    this.sigInst = sigInst;
    this.graph = this.sigInst.graph;
    this.ppn = 10;
    this.ppe = 3;
    this.config = {};
    this.worker = null;
    this.shouldUseWorker =
      options.worker === false ? false : true && webWorkers;
    this.workerUrl = options.workerUrl;
    this.runOnBackground = (options.background) ? true : false;
    this.easing = options.easing;

    // State
    this.started = false;
    this.running = false;

    this.initWorker();
  }

  Supervisor.prototype.makeBlob = function(workerFn) {
    var blob;

    try {
      blob = new Blob([workerFn], {type: 'application/javascript'});
    }
    catch (e) {
      _root.BlobBuilder = _root.BlobBuilder ||
                          _root.WebKitBlobBuilder ||
                          _root.MozBlobBuilder;

      blob = new BlobBuilder();
      blob.append(workerFn);
      blob = blob.getBlob();
    }

    return blob;
  };

  Supervisor.prototype.graphToByteArrays = function() {
    var nodes = this.graph.nodes(),
        edges = this.graph.edges(),
        nbytes = nodes.length * this.ppn,
        ebytes = edges.length * this.ppe,
        nIndex = {},
        i,
        j,
        l;

    // Allocating Byte arrays with correct nb of bytes
    this.nodesByteArray = new Float32Array(nbytes);
    this.edgesByteArray = new Float32Array(ebytes);

    // Iterate through nodes
    for (i = j = 0, l = nodes.length; i < l; i++) {

      // Populating index
      nIndex[nodes[i].id] = j;

      // Populating byte array
      this.nodesByteArray[j] = nodes[i].x;
      this.nodesByteArray[j + 1] = nodes[i].y;
      this.nodesByteArray[j + 2] = 0;
      this.nodesByteArray[j + 3] = 0;
      this.nodesByteArray[j + 4] = 0;
      this.nodesByteArray[j + 5] = 0;
      this.nodesByteArray[j + 6] = 1 + this.graph.degree(nodes[i].id);
      this.nodesByteArray[j + 7] = 1;
      this.nodesByteArray[j + 8] = nodes[i].size;
      this.nodesByteArray[j + 9] = nodes[i].fixed || 0;
      j += this.ppn;
    }

    // Iterate through edges
    for (i = j = 0, l = edges.length; i < l; i++) {
      this.edgesByteArray[j] = nIndex[edges[i].source];
      this.edgesByteArray[j + 1] = nIndex[edges[i].target];
      this.edgesByteArray[j + 2] = edges[i].weight || 0;
      j += this.ppe;
    }
  };

  // TODO: make a better send function
  Supervisor.prototype.applyLayoutChanges = function(prefixed) {
    var nodes = this.graph.nodes(),
        j = 0,
        realIndex;

    // Moving nodes
    for (var i = 0, l = this.nodesByteArray.length; i < l; i += this.ppn) {
      if (prefixed) {
        nodes[j].fa2_x = this.nodesByteArray[i];
        nodes[j].fa2_y = this.nodesByteArray[i + 1];

      } else {
        nodes[j].x = this.nodesByteArray[i];
        nodes[j].y = this.nodesByteArray[i + 1];
      }
      j++;
    }
  };

  Supervisor.prototype.sendByteArrayToWorker = function(action) {
    var content = {
      action: action || 'loop',
      nodes: this.nodesByteArray.buffer
    };

    var buffers = [this.nodesByteArray.buffer];

    if (action === 'start') {
      content.config = this.config || {};
      content.edges = this.edgesByteArray.buffer;
      buffers.push(this.edgesByteArray.buffer);
    }

    if (this.shouldUseWorker)
      this.worker.postMessage(content, buffers);
    else
      _root.postMessage(content, '*');
  };

  Supervisor.prototype.start = function() {
    if (this.running)
      return;

    this.running = true;

    if (!this.started) {
      // Sending init message to worker
      this.sendByteArrayToWorker('start');
      this.started = true;
      eventEmitter.dispatchEvent('start');
    }
    else {
      this.sendByteArrayToWorker();
    }
  };

  Supervisor.prototype.stop = function() {
    if (!this.running)
      return;

    this.running = false;
    eventEmitter.dispatchEvent('stop');
  };

  Supervisor.prototype.initWorker = function() {
    var _this = this,
        workerFn = sigma.layouts.getForceAtlas2Worker();

    // Web worker or classic DOM events?
    if (this.shouldUseWorker) {
      if (!this.workerUrl) {
        var blob = this.makeBlob(workerFn);
        this.worker = new Worker(URL.createObjectURL(blob));
      }
      else {
        this.worker = new Worker(this.workerUrl);
      }

      // Post Message Polyfill
      this.worker.postMessage =
        this.worker.webkitPostMessage || this.worker.postMessage;
    }
    else {

      // TODO: do we crush?
      eval(workerFn);
    }

    // Worker message receiver
    this.msgName = (this.worker) ? 'message' : 'newCoords';
    this.listener = function(e) {

      // Retrieving data
      _this.nodesByteArray = new Float32Array(e.data.nodes);

      // If ForceAtlas2 is running, we act accordingly
      if (_this.running) {

        // Applying layout
        _this.applyLayoutChanges(_this.runOnBackground);

        // Send data back to worker and loop
        _this.sendByteArrayToWorker();

        // Rendering graph
        if (!_this.runOnBackground)
          _this.sigInst.refresh({skipIndexation: true});
      }

      // Stop ForceAtlas2 if it has converged
      if (e.data.converged) {
        _this.running = false;
      }

      if (!_this.running) {
        _this.killWorker();
        if (_this.runOnBackground && _this.easing) {
          _this.applyLayoutChanges(true);
          eventEmitter.dispatchEvent('interpolate');
          sigma.plugins.animate(
            _this.sigInst,
            {
              x: 'fa2_x',
              y: 'fa2_y'
            },
            {
              easing: _this.easing,
              onComplete: function() {
                _this.sigInst.refresh();
                eventEmitter.dispatchEvent('stop');
              }
            }
          );
        }
        else {
          _this.applyLayoutChanges(false);
          _this.sigInst.refresh();
          eventEmitter.dispatchEvent('stop');
        }
      }
    };

    (this.worker || document).addEventListener(this.msgName, this.listener);

    // Filling byteArrays
    this.graphToByteArrays();

    // Binding on kill to properly terminate layout when parent is killed
    _this.sigInst.bind('kill', function() {
      sigma.layouts.killForceAtlas2();
    });
  };

  Supervisor.prototype.killWorker = function() {
    if (this.worker) {
      this.worker.terminate();
    }
    else {
      _root.postMessage({action: 'kill'}, '*');
      document.removeEventListener(this.msgName, this.listener);
    }
  };

  Supervisor.prototype.configure = function(config) {

    // Setting configuration
    this.config = config;

    if (!this.started)
      return;

    var data = {action: 'config', config: this.config};

    if (this.shouldUseWorker)
      this.worker.postMessage(data);
    else
      _root.postMessage(data, '*');
  };

  /**
   * Interface
   * ----------
   */
  var supervisor = null;

  sigma.layouts.startForceAtlas2 = function(sigInst, config) {

    // Create supervisor if undefined
    if (!supervisor) {
      supervisor = new Supervisor(sigInst, config);
    }
    else if (!supervisor.running) {
      supervisor.killWorker();
      supervisor.initWorker();
      supervisor.started = false;
    }

    // Configuration provided?
    if (config)
      supervisor.configure(config);

    // Start algorithm
    supervisor.start();

    return eventEmitter;
  };

  sigma.layouts.stopForceAtlas2 = function() {
    if (!supervisor)
      return;

    // Stop algorithm
    supervisor.stop();

    return supervisor;
  };

  sigma.layouts.killForceAtlas2 = function() {
    if (!supervisor)
      return;

    // Stop Algorithm
    supervisor.stop();

    // Kill Worker
    supervisor.killWorker();

    // Kill supervisor
    supervisor = null;

    eventEmitter = {};
    sigma.classes.dispatcher.extend(eventEmitter);
  };

  sigma.layouts.configForceAtlas2 = function(sigInst, config) {
    if (!supervisor) {
      supervisor = new Supervisor(sigInst, config);
    }
    else if (!supervisor.running) {
      supervisor.killWorker();
      supervisor.initWorker();
      supervisor.started = false;
    }

    supervisor.configure(config);

    return eventEmitter;
  };

  sigma.layouts.isForceAtlas2Running = function() {
    return !!supervisor && supervisor.running;
  };
}).call(this);
