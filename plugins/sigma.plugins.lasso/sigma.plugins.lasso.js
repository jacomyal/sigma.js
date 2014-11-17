;(function (undefined) {
  'use strict';

  if (typeof sigma === 'undefined') {
    throw 'sigma is not declared';
  }

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma Lasso
   * =============================
   *
   * @author Florent Schildknecht <florent.schildknecht@gmail.com> (Florent Schildknecht)
   * @version 0.0.1
   */
   var _graph = undefined,
       _sigmaInstance = undefined;

  /**
   * Lasso Object
   * ------------------
   * @param  {sigma} sigmaInstance The related sigma instance.
   */
  function Lasso (sigmaInstance) {
    _sigmaInstance = sigmaInstance;
    _graph = sigmaInstance.graph;
  };

  /**
   * This method is used to destroy the lasso.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.clear();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.clear = function () {
    lasso = null;
    return this;
  };


  /**
   * Interface
   * ------------------
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   */
  var lasso = null;

  /**
   * @param  {sigma} sigmaInstance The related sigma instance.
   */
  sigma.plugins.lasso = function (sigmaInstance) {
    // Create lasso if undefined
    if (!lasso) {
      lasso = new Lasso(sigmaInstance);
    }
    return lasso;
  };

}).call(this);
