;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma ForceAtlas2.5 Supervisor
   * =============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Version: 0.1
   */

  /**
   * Feature detection
   * ------------------
   */
  var webWorkers = 'Worker' in window;

  /**
   * Supervisor Object
   * ------------------
   */
  function Supervisor(sigInst, options) {
    var _this = this,
        workerFn = sigInst.getForceAtlas2Worker();

    // Window URL Polyfill
    window.URL = window.URL || window.webkitURL;

    // Properties
    this.sigInst = sigInst;
    this.graph = this.sigInst.graph;
    this.ppn = 10;
    this.ppe = 3;
    this.config = {};

    // State
    this.started = false;
    this.running = false;

    // Web worker or classic DOM events?
    if (webWorkers) {
      var blob = this.makeBlob(workerFn);
      this.worker = new Worker(URL.createObjectURL(blob));

      // Post Message Polyfill
      this.worker.postMessage =
        this.worker.webkitPostMessage || this.worker.postMessage;
    }
    else {

      // TODO: do we crush?
      eval(workerFn);
    }

    // Worker message receiver
    var msgName = (this.worker) ? 'message' : 'newCoords';
    (this.worker || document).addEventListener(msgName, function(e) {

      // Retrieving data
      _this.nodesByteArray = new Float32Array(e.data.nodes);

      // If ForceAtlas2 is running, we act accordingly
      if (_this.running) {

        // Applying layout
        _this.applyLayoutChanges();

        // Send data back to worker and loop
        _this.sendByteArrayToWorker();

        // Rendering graph
        _this.sigInst.refresh();
      }
    });

    // Filling byteArrays
    this.graphToByteArrays();
  }

  Supervisor.prototype.makeBlob = function(workerFn) {
    var blob;

    try {
      blob = new Blob([workerFn], {type: 'application/javascript'});
    }
    catch (e) {
      window.BlobBuilder = window.BlobBuilder ||
                           window.WebKitBlobBuilder ||
                           window.MozBlobBuilder;

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
      this.nodesByteArray[j + 9] = 0;
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
  Supervisor.prototype.applyLayoutChanges = function() {
    var nodes = this.graph.nodes(),
        j = 0,
        realIndex;

    // Moving nodes
    for (var i = 0, l = this.nodesByteArray.length; i < l; i += this.ppn) {
      nodes[j].x = this.nodesByteArray[i];
      nodes[j].y = this.nodesByteArray[i + 1];
      j++;
    }
  };

  Supervisor.prototype.sendByteArrayToWorker = function(action, config) {
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

    if (webWorkers)
      this.worker.postMessage(content, buffers);
    else
      window.postMessage(content, '*');
  };

  Supervisor.prototype.start = function() {
    if (this.running)
      return;

    this.running = true;

    if (!this.started) {

      // Sending init message to worker
      this.sendByteArrayToWorker('start');
      this.started = true;
    }
    else {
      this.sendByteArrayToWorker();
    }
  };

  Supervisor.prototype.stop = function() {
    if (!this.running)
      return;

    this.running = false;
  };

  // TODO: kill polyfill when worker is not true worker
  Supervisor.prototype.killWorker = function() {
    this.worker.terminate();
  };

  Supervisor.prototype.configure = function(config) {

    // Setting configuration
    this.config = config;

    if (!this.started)
      return;

    var data = {action: 'config', config: this.config};

    if (webWorkers)
      this.worker.postMessage(data);
    else
      window.postMessage(data, '*');
  };

  /**
   * Interface
   * ----------
   */
  var supervisor = null;

  sigma.prototype.startForceAtlas2 = function(config) {

    // Create supervisor if undefined
    if (!supervisor)
      supervisor = new Supervisor(this);

    // Start algorithm
    supervisor.start(config);

    return this;
  };

  sigma.prototype.stopForceAtlas2 = function() {
    if (!supervisor)
      return this;

    // Pause algorithm
    supervisor.stop();

    return this;
  };

  sigma.prototype.killForceAtlas2 = function() {
    if (!supervisor)
      return this;

    // Stop Algorithm
    supervisor.stop();

    // Kill Worker
    supervisor.killWorker();

    // Kill supervisor
    supervisor = null;

    return this;
  };

  sigma.prototype.configForceAtlas2 = function(config) {
    if (!supervisor)
      supervisor = new Supervisor(this);

    supervisor.configure(config);

    return this;
  };

  sigma.prototype.isForceAtlas2Running = function(config) {
    return supervisor && supervisor.running;
  };
}).call(this);
