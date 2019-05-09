;(function(undefined) {
  'use strict';

  /**
   * Sigma SVG Exporter
   * ===================
   *
   * This plugin is designed to export a graph to a svg file that can be
   * downloaded or just used elsewhere.
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Version: 0.0.1
   */

  // Terminating if sigma were not to be found
  if (typeof sigma === 'undefined')
    throw 'sigma.renderers.snapshot: sigma not in scope.';


  /**
   * Polyfills
   */
  var URL = this.URL || this.webkitURL || this;


  /**
   * Utilities
   */
  function createBlob(data) {
    return new Blob(
      [data],
      {type: 'image/svg+xml;charset=utf-8'}
    );
  }

  function download(string, filename) {

    // Creating blob href
    var blob = createBlob(string);

    // Anchor
    var o = {};
    o.anchor = document.createElement('a');
    o.anchor.setAttribute('href', URL.createObjectURL(blob));
    o.anchor.setAttribute('download', filename);

    // Click event
    var event = document.createEvent('MouseEvent');
    event.initMouseEvent('click', true, false, window, 0, 0, 0 ,0, 0,
      false, false, false, false, 0, null);

    URL.revokeObjectURL(blob);

    o.anchor.dispatchEvent(event);
    delete o.anchor;
  }


  /**
   * Defaults
   */
  var DEFAULTS = {
    download: false,
    filename: 'graph.json'
  };

  /**
   * Extending prototype
   */
  sigma.prototype.toJSON = function(params) {
    params = params || {};

    // Retrieving json string
    var keydropper = function(node) {
      const filtered = Object.keys(node)
        .filter((key, idx, arr)=>{return !key.startsWith("read_") && !key.startsWith("renderer")})
        .reduce((obj, key)=>{
          obj[key] = node[key]
          return obj
        }, {})
      return filtered
    }
    var jsonString = JSON.stringify({nodes: this.graph.nodes().map(keydropper), edges: this.graph.edges().map(keydropper)});

    if (params.download)
      download(jsonString, params.filename || DEFAULTS.filename);

    return jsonString;
  };
}).call(this);
