;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma ForceAtlas2 Supervisor
   * =============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Version: 0.1
   */

  /**
   * Helpers Namespace
   * ------------------
   */
  var _helpers = {
    bytesToMB: function(bytes) {
      return Math.round(bytes / 1024 / 1024);
    },
    MBtoBytes: function(bytes) {
      return bytes * 1024 * 1024;
    }
  };

  /**
   * Supervisor Object
   * ------------------
   */
  function Supervisor(graph, options) {
    var _this = this;

    // Properties
    this.graph = graph;
    this.worker = new Worker('/plugins/sigma.layout.forceAtlas2/worker.js');
    this.nodesByteArray = new Float32Array(_helpers.MBtoBytes(4));
    this.edgesByteArray = new Float32Array(_helpers.MBtoBytes(4));

    // Polyfill
    this.worker.postMessage = 
      this.worker.webkitPostMessage || this.worker.postMessage;

    // Filling byteArrays
    this.graphToByteArrays();

    // Sending to worker
    console.log(this.nodesByteArray.byteLength, this.edgesByteArray.byteLength);
    this.sendByteArrayToWorker();
    console.log(this.nodesByteArray.byteLength, this.edgesByteArray.byteLength);
  }

  Supervisor.prototype.graphToByteArrays = function() {
    var nodes = this.graph.nodes(),
        edges = this.graph.edges(),
        i,
        j,
        l;

    // Iterate through nodes
    for (i = j = 0, l = nodes.length; i < l; i++) {
      this.nodesByteArray[j] = nodes[i].x;
      this.nodesByteArray[j + 1] = nodes[i].y;
      this.nodesByteArray[j + 2] = nodes[i].size;
      this.nodesByteArray[j + 3] = 0;
      this.nodesByteArray[j + 4] = 0;
      j += 5;
    }

    // Iterate through edges
    for (i = j = 0, l = edges.length; i < l; i++) {
      this.edgesByteArray[j] = 0;
      this.edgesByteArray[j + 1] = 0;
      this.edgesByteArray[j + 2] = edges[i].weight || 0;
      j += 3;
    }
  };

  Supervisor.prototype.sendByteArrayToWorker = function() {
    this.worker.postMessage(
      this.nodesByteArray.buffer,
      [this.nodesByteArray.buffer, this.edgesByteArray.buffer]
    )
  };

   /**
   * Interface
   * ----------
   */

  sigma.prototype.testFA2Supervisor = function() {
    new Supervisor(this.graph);
    return this;
  };
}).call(this);
