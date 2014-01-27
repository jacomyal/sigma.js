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
  function Supervisor(graph, workerFunc, options) {
    var _this = this;

    // TODO: later, check if transferable is possible
    // Window URL Polyfill
    window.URL = window.URL || window.webkitURL;

    // Properties
    this.graph = graph;
    this.ppn = 8;
    this.ppe = 3;

    var blob = this.makeBlob(workerFunc);
    this.worker = new Worker(URL.createObjectURL(blob));

    // Post Message Polyfill
    this.worker.postMessage = 
      this.worker.webkitPostMessage || this.worker.postMessage;

    // Filling byteArrays
    this.graphToByteArrays();

    // Sending to worker
    console.log(this.nodesByteArray.byteLength, this.edgesByteArray.byteLength);
    this.sendByteArrayToWorker();
    console.log(this.nodesByteArray.byteLength, this.edgesByteArray.byteLength);
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
        ebytes = nodes.length * this.ppe,
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
      nIndex[nodes[i].id] = i;

      // Populating byte array
      this.nodesByteArray[j] = nodes[i].x;
      this.nodesByteArray[j + 1] = nodes[i].y;
      this.nodesByteArray[j + 2] = 0;
      this.nodesByteArray[j + 3] = 0;
      this.nodesByteArray[j + 4] = 0;
      this.nodesByteArray[j + 5] = 0;
      this.nodesByteArray[j + 6] = 1 + this.graph.degree(nodes[i].id);
      this.nodesByteArray[j + 7] = nodes[i].size;
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

  Supervisor.prototype.sendByteArrayToWorker = function() {
    this.worker.postMessage(
      {
        header: 'start',
        config: {},
        nodes: this.nodesByteArray.buffer,
        edges: this.edgesByteArray.buffer
      },
      [this.nodesByteArray.buffer, this.edgesByteArray.buffer]
    );
  };

   /**
   * Interface
   * ----------
   */

  sigma.prototype.startForceAtlas2 = function() {};
  sigma.prototype.stopForceAtlas2 = function() {};

  sigma.prototype.testFA2Supervisor = function() {
    new Supervisor(this.graph, this.getForceAtlas2Worker());
    return this;
  };
}).call(this);
