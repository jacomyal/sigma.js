;(function(undefined) {
  'use strict';

  /**
   * Sigma ForceAtlas2 Webworker
   * ============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Version: 0.1
   */

   /**
   * Message Receiver
   * -----------------
   */
  this.onmessage = function(e) {
    var view = new Float32Array(e.data);
  };
}).call(this);
