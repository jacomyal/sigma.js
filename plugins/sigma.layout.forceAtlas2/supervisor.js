;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma ForceAtlas2.1 Supervisor
   * =============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Version: 0.1
   */

  /**
   * Helpers Namespace
   * ------------------
   */
  var _helpers = {};

  /**
   * Supervisor Object
   * ------------------
   */
  function Supervisor(sigInst, workerFunc, options) {
    var _this = this;

    // TODO: later, check if transferable is possible
    // Window URL Polyfill
    window.URL = window.URL || window.webkitURL;

    // Properties
    this.sigInst = sigInst;
    this.graph = this.sigInst.graph;
    this.ppn = 8;
    this.ppe = 3;

    var blob = this.makeBlob(workerFunc);
    this.worker = new Worker(URL.createObjectURL(blob));

    // Worker message receiver
    this.worker.onmessage = function(e) {

      // Retrieving data
      _this.nodesByteArray = new Float64Array(e.data.nodes);
      _this.edgesByteArray = new Float64Array(e.data.edges);

      // Applying layout
      _this.applyLayoutChanges();

      // Send data back to worker and loop
      _this.sendByteArrayToWorker();
    };

    // Post Message Polyfill
    this.worker.postMessage = 
      this.worker.webkitPostMessage || this.worker.postMessage;

    // Filling byteArrays
    this.graphToByteArrays();

    // Sending to worker
    this.sendByteArrayToWorker('start');
  }

  Supervisor.prototype.makeBlob = function(workerFunc) {
    var blob;

    try {
      blob = new Blob([workerFunc], {type: 'application/javascript'});
    }
    catch (e) {
      window.BlobBuilder = window.BlobBuilder ||
                           window.WebKitBlobBuilder ||
                           window.MozBlobBuilder;

      blob = new BlobBuilder();
      blob.append(workerFunc);
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
    // TODO: Float32Array?
    this.nodesByteArray = new Float64Array(nbytes);
    this.edgesByteArray = new Float64Array(ebytes);

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
      this.nodesByteArray[j + 7] = 0;
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

  // TODO: send edges only once.
  // make a better send function
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

    // Refreshing
    this.sigInst.refresh();
  };

  Supervisor.prototype.sendByteArrayToWorker = function(header) {
    console.log('sending...');
    var content = {
      header: header || 'loop',
      nodes: this.nodesByteArray.buffer,
      edges: this.edgesByteArray.buffer 
    };

    var buffers = [this.nodesByteArray.buffer, this.edgesByteArray.buffer];

    if (header === 'start')
      content.config = {};

    this.worker.postMessage(content, buffers);
  };


  /**
   * Interface
   * ----------
   */

  sigma.prototype.startForceAtlas2 = function() {};
  sigma.prototype.stopForceAtlas2 = function() {};

  sigma.prototype.testFA2Supervisor = function() {
    new Supervisor(this, this.getForceAtlas2Worker());
    return this;
  };
}).call(this);
