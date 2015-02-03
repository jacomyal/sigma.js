;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma ForceAtlas2.5 Supervisor
   * ===============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Version: 0.1
   */
  var _root = this;

  /**
   * Feature detection
   * ------------------
   */
  var webWorkers = 'Worker' in _root;

  /**
   * Supervisor Object
   * ------------------
   */
  function Supervisor(sigInst, options) {
    var self = this,
        workerFn = sigInst.getForceAtlas2Worker &&
          sigInst.getForceAtlas2Worker();

    options = options || {};

    // _root URL Polyfill
    _root.URL = _root.URL || _root.webkitURL;

    // Properties
    this.sigInst = sigInst;
    this.graph = this.sigInst.graph;
    this.ppn = 10;
    this.ppe = 3;
    this.config = {};
    this.shouldUseWorker =
      options.worker === false ? false : true && webWorkers;
    this.workerUrl = options.workerUrl;

    // State
    this.started = false;
    this.running = false;

    // Cooling
    this.cooling = false;
    this.cpi = -1;
    this.cei = null;

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

      eval(workerFn);
    }

    // Worker message receiver
    this.msgName = (this.worker) ? 'message' : 'newCoords';
    this.listener = function(e) {

      // Retrieving data
      self.nodesByteArray = new Float32Array(e.data.nodes);

      // If ForceAtlas2 is running, we act accordingly
      if (self.running) {

        // Applying layout
        self.applyLayoutChanges();

        // Counting iterations
        if (self.cooling) {

          // One more
          self.cpi++;

          // Ought to stop?
          if (self.cpi === self.cei) {

            // Tearing
            self.cooling = false;
            self.cpi = -1;
            self.cei = null;

            self.afterCooldown();
            delete self.afterCooldown;
            self.stop();
            return;
          }

          // Send data back to worker and loop
          self.sendByteArrayToWorker('cooldown', {nbIterations: self.cei});
        }
        else {

          // Send data back to worker and loop
          self.sendByteArrayToWorker('loop');
        }

        // Rendering graph
        self.sigInst.refresh();
      }
    };

    (this.worker || document).addEventListener(this.msgName, this.listener);

    // Filling byteArrays
    this.graphToByteArrays();

    // Binding on kill to properly terminate layout when parent is killed
    sigInst.bind('kill', function() {
      sigInst.killForceAtlas2();
    });
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

  Supervisor.prototype.sendByteArrayToWorker = function(action, params) {
    var content = {
      action: action || 'loop',
      nodes: this.nodesByteArray.buffer
    };

    if (params)
      content.params = params;

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

    // Do not refresh edgequadtree during layout:
    var k,
        c;
    for (k in this.sigInst.cameras) {
      c = this.sigInst.cameras[k];
      c.edgequadtree._enabled = false;
    }

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

    // Allow to refresh edgequadtree:
    var k,
        c,
        bounds;
    for (k in this.sigInst.cameras) {
      c = this.sigInst.cameras[k];
      c.edgequadtree._enabled = true;

      // Find graph boundaries:
      bounds = sigma.utils.getBoundaries(
        this.graph,
        c.readPrefix
      );

      // Refresh edgequadtree:
      if (c.settings('drawEdges') && c.settings('enableEdgeHovering'))
        c.edgequadtree.index(this.sigInst.graph, {
          prefix: c.readPrefix,
          bounds: {
            x: bounds.minX,
            y: bounds.minY,
            width: bounds.maxX - bounds.minX,
            height: bounds.maxY - bounds.minY
          }
        });
    }

    this.running = false;
  };

  Supervisor.prototype.cooldown = function(nbIterations, callback) {
    if (typeof nbIterations === 'function') {
      callback = nbIterations;
      nbIterations = null;
    }

    this.cei = nbIterations || 30;
    this.cooling = true;
    this.afterCooldown = typeof callback === 'function' ?
      callback :
      Function.prototype;
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
    this.config = sigma.utils.extend(config, this.config);

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
  function ForceAtlas2Interface(sigInst) {
    this.supervisor = null;
    this.sigInst = sigInst;
  }

  ForceAtlas2Interface.prototype.start = function(config) {

    // Create supervisor if undefined
    if (!this.supervisor)
      this.supervisor = new Supervisor(this.sigInst, config);

    // Configuration provided?
    if (config)
      this.supervisor.configure(config);

    // Start algorithm
    this.supervisor.start();

    return this;
  };

  ForceAtlas2Interface.prototype.stop = function() {
    if (!this.supervisor)
      return this;

    // Pause algorithm
    this.supervisor.stop();

    return this;
  };

  ForceAtlas2Interface.prototype.cooldown = function(nbIterations, callback) {
    var self = this;

    if (!this.supervisor)
      return this;

    this.supervisor.cooldown(nbIterations, callback);
    return this;
  };

  ForceAtlas2Interface.prototype.kill = function() {
    if (!this.supervisor)
      return this;

    // Stop Algorithm
    this.supervisor.stop();

    // Kill Worker
    this.supervisor.killWorker();

    // Kill supervisor
    this.supervisor = null;

    return this;
  };

  ForceAtlas2Interface.prototype.config = function(config) {
    if (!this.supervisor)
      this.supervisor = new Supervisor(this, config);

    this.supervisor.configure(config);

    return this;
  };

  ForceAtlas2Interface.prototype.running = function() {
    return !!this.supervisor && this.supervisor.running;
  };

  ForceAtlas2Interface.prototype.cooling = function() {
    return !!this.supervisor && this.supervisor.cooling;
  };

  /**
   * Registering constructor extension
   * ----------------------------------
   */
  sigma.register(function() {

    // Main object
    this.forceAtlas2 = new ForceAtlas2Interface(this);
  });
}).call(this);
