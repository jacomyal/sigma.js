;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma ForceAtlas2.5 Webworker
   * ==============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Algorithm author: Mathieu Jacomy @ Sciences Po Medialab & WebAtlas
   * Version: 0.1
   */

  /**
   * Worker Function Wrapper
   * ------------------------
   *
   * The worker has to be wrapped into a single stringified function
   * to be passed afterwards as a BLOB object to the supervisor.
   */
  var Worker = function(undefined) {
    'use strict';

    /**
     * Worker settings and namespace
     */
    var W = {
      ppn: 10,
      ppe: 3,
      maxForce: 10,
      iterations: 0,
      settings: {
        linLogMode: false,
        outboundAttractionDistribution: false,
        adjustSizes: false,
        edgeWeightInfluence: 0,
        scalingRatio: 1,
        strongGravityMode: false,
        gravity: 1,
        barnesHutOptimize: false,
        barnesHutTheta: 1.2,
        outboundAttCompensation: 1,
        totalSwinging: 0,
        totalEffectiveTraction: 0,
        speedEfficiency: 1,
        complexIntervals: 500,
        simpleIntervals: 1000,
        converged: false
      }
    };

    /**
     * Helpers namespace
     */
    var helpers = {
      extend: function() {
        var i,
            k,
            res = {},
            l = arguments.length;

        for (i = l - 1; i >= 0; i--)
          for (k in arguments[i])
            res[k] = arguments[i][k];
        return res;
      }
    };

    /**
     * Matrices properties accessors
     */
    var nodeProperties = {
      x: 0,
      y: 1,
      dx: 2,
      dy: 3,
      old_dx: 4,
      old_dy: 5,
      mass: 6,
      convergence: 7,
      size: 8,
      fixed: 9
    };

    var edgeProperties = {
      source: 0,
      target: 1,
      weight: 2
    };

    function np(i, p) {

      // DEBUG: safeguards
      if ((i % W.ppn) !== 0)
        throw 'np: non correct (' + i + ').';
      if (i !== parseInt(i))
        throw '_np: non int.';

      if (p in nodeProperties)
        return i + nodeProperties[p];
      else
        throw 'ForceAtlas2.Worker - ' + 
              'Inexistant node property given (' + p + ').';
    }

    function ep(i, p) {

      // DEBUG: safeguards
      if ((i % W.ppe) !== 0)
        throw 'ep: non correct (' + i + ').';
      if (i !== parseInt(i))
        throw 'ep: non int.';

      if (p in edgeProperties)
        return i + edgeProperties[p];
      else
        throw 'ForceAtlas2.Worker - ' + 
              'Inexistant edge property given (' + p + ').';
    }

    // DEBUG
    function nan(v) {
      if (isNaN(v))
        throw 'NaN alert!';
    }

    /**
     * Barnes-Hut functions
     */

    var barnesHutDepthLimit = 20;

    function Region(nodes, depth) {
      var n, l, mass, size, distance;

      // Region
      var r = {
        size: 0,
        nodes: nodes,
        subregions: [],
        depth: depth,
        mass: 0,
        massCenterX: 0,
        massCenterY: 0,
        massSumX: 0,
        massSumY: 0
      };

      // Updating mass and geometry
      if (r.nodes.length > 1) {

        // Iterating through nodes
        for (n = 0, l = r.nodes.length; n < l; n++) {
          mass = W.nodeMatrix[np(n, 'mass')];
          r.mass += mass;
          r.massSumX += W.nodeMatrix[np(n, 'x')] * mass;
          r.massSumY += W.nodeMatrix[np(n, 'y')] * mass;
        }

        var massCenterX = r.massSumX / r.mass,
            massCenterY = r.massSumY / r.mass;

        // Computing size
        // MATH: something is amiss in the max thingy under here
        for (i = 0, l = r.nodes.length; n < l; n++) {
          distance = 2 * Math.sqrt(
            Math.pow((W.nodeMatrix[np(n, 'x')] - r.massCenterX), 2) +
            Math.pow((W.nodeMatrix[np(n, 'y')] - r.massCenterY), 2)
          );
          size = (size === undefined) ?
            distance :
            Math.max(size, distance);
        }
      }

      // Finalizing region
      r.massCenterX = massCenterX;
      r.massCenterY = massCenterY;
      r.size = size;

      return r;
    }

    /**
     * Algorithm initialization
     */

    // TODO: autosettings
    function init(nodes, edges, config) {
      var i, l;

      // Matrices
      W.nodeMatrix = nodes;
      W.edgeMatrix = edges;

      // Length
      W.nodesLength = W.nodeMatrix.length;
      W.edgesLength = W.edgeMatrix.length;
    }

    /**
     * Algorithm pass
     */

    // MATH: get distances stuff and power 2 issues
    function pass() {
      var n, n1, n2, e, s, t, w;

      var rootRegion,
          outboundAttCompensation;


      // 1) Initializing layout data
      //-----------------------------

      // Resetting positions
      for (n = 0; n < W.nodesLength; n += W.ppn) {
        W.nodeMatrix[np(n, 'old_dx')] = W.nodeMatrix[np(n, 'dx')];
        W.nodeMatrix[np(n, 'old_dy')] = W.nodeMatrix[np(n, 'dy')];
        W.nodeMatrix[np(n, 'dx')] = 0;
        W.nodeMatrix[np(n, 'dy')] = 0;
      }

      // Barnes-Hut root region
      if (W.settings.barnesHutOptimize) {

        // TODO: build region and subregions
      }

      // If outbound attraction distribution, compensate
      if (W.settings.outboundAttractionDistribution) {
        outboundAttCompensation = 0;
        for (n = 0, l = W.nodes.length; n < l; n++) {
          outboundAttCompensation += W.nodeMatrix[np(n, 'mass')];
        }

        outboundAttCompensation /= l;
      }


      // 2) Repulsion
      //--------------

      if (W.settings.barnesHutOptimize) {

        // TODO: apply forces to regions
      }
      else {

        // Square iteration
        for (n1 = 0; n1 < W.nodesLength; n1 += W.ppn) {
          for (n2 = 0; n2 < W.nodesLength; n2 += W.ppn) {

            // TODO: apply repulsion
          }
        }
      }


      // 3) Gravity
      //------------
      for (n = 0; n < W.nodesLength; n += W.ppn) {

        // TODO: apply gravity
      }


      // 4) Attraction
      //---------------
      for (e = 0; e < W.edgesLength; e += W.ppe) {
        s = W.edgeMatrix[ep(e, 'source')];
        t = W.edgeMatrix[ep(e, 'target')];
        w = W.edgeMatrix[ep(e, 'weight')];

        // TODO: apply attraction
      }

      // 5) Apply Forces
      //-----------------
      var force,
          swinging,
          traction,
          nodespeed;

      // MATH: sqrt and square distances
      if (W.settings.adjustSizes) {

        for (n = 0; n < W.nodesLength; n += W.ppn) {
          if (!W.nodeMatrix[np(n, 'fixed')]) {
            force = Math.sqrt(
              Math.pow(W.nodeMatrix[np(n, 'dx')], 2) +
              Math.pow(W.nodeMatrix[np(n, 'dy')], 2)
            );

            if (force > W.maxForce) {
              W.nodeMatrix[np(n, 'dx')] =
                W.nodeMatrix[np(n, 'dx')] * maxForce / force;
              W.nodeMatrix[np(n, 'dy')] =
                W.nodeMatrix[np(n, 'dy')] * maxForce / force;
            }

            swinging = W.nodeMatrix[np(n, 'mass')] *
              Math.sqrt(
                (W.nodeMatrix[np(n, 'old_dx')] - W.nodeMatrix[np(n, 'dx')]) *
                (W.nodeMatrix[np(n, 'old_dx')] - W.nodeMatrix[np(n, 'dx')]) +
                (W.nodeMatrix[np(n, 'old_dy')] - W.nodeMatrix[np(n, 'dy')]) *
                (W.nodeMatrix[np(n, 'old_dy')] - W.nodeMatrix[np(n, 'dy')])
              );

            traction = Math.sqrt(
              (W.nodeMatrix[np(n, 'old_dx')] + W.nodeMatrix[np(n, 'dx')]) *
              (W.nodeMatrix[np(n, 'old_dx')] + W.nodeMatrix[np(n, 'dx')]) +
              (W.nodeMatrix[np(n, 'old_dy')] + W.nodeMatrix[np(n, 'dy')]) *
              (W.nodeMatrix[np(n, 'old_dy')] + W.nodeMatrix[np(n, 'dy')])
            ) / 2;

            nodespeed =
              0.1 * Math.log(1 + traction) / (1 + Math.sqrt(swinging));

            // Updating node's positon
            W.nodeMatrix[np(n, 'x')] =
              W.nodeMatrix[np(n, 'x')] + W.nodeMatrix[np(n, 'dx')] * nodespeed;
            W.nodeMatrix[np(n, 'y')] =
              W.nodeMatrix[np(n, 'y')] + W.nodeMatrix[np(n, 'dy')] * nodespeed;
          }
        }
      }
      else {

        for (n = 0; n < W.nodesLength; n += W.ppn) {
          if (!W.nodeMatrix[np(n, 'fixed')]) {

            swinging = W.nodeMatrix[np(n, 'mass')] *
              Math.sqrt(
                (W.nodeMatrix[np(n, 'old_dx')] - W.nodeMatrix[np(n, 'dx')]) *
                (W.nodeMatrix[np(n, 'old_dx')] - W.nodeMatrix[np(n, 'dx')]) +
                (W.nodeMatrix[np(n, 'old_dy')] - W.nodeMatrix[np(n, 'dy')]) *
                (W.nodeMatrix[np(n, 'old_dy')] - W.nodeMatrix[np(n, 'dy')])
              );

            traction = Math.sqrt(
              (W.nodeMatrix[np(n, 'old_dx')] + W.nodeMatrix[np(n, 'dx')]) *
              (W.nodeMatrix[np(n, 'old_dx')] + W.nodeMatrix[np(n, 'dx')]) +
              (W.nodeMatrix[np(n, 'old_dy')] + W.nodeMatrix[np(n, 'dy')]) *
              (W.nodeMatrix[np(n, 'old_dy')] + W.nodeMatrix[np(n, 'dy')])
            ) / 2;

            nodespeed = W.nodeMatrix[np(n, 'convergence')] *
              Math.log(1 + traction) / (1 + Math.sqrt(swinging));

            // Updating node convergence
            W.nodeMatrix[np(n, 'convergence')] =
              Math.min(1, Math.sqrt(
                nodespeed *
                (Math.pow(W.nodeMatrix[np(n, 'dx')], 2) +
                 Math.pow(W.nodeMatrix[np(n, 'dy')], 2)) /
                (1 + Math.sqrt(swinging))
              ));

            // Updating node's positon
            W.nodeMatrix[np(n, 'x')] =
              W.nodeMatrix[np(n, 'x')] + W.nodeMatrix[np(n, 'dx')] * nodespeed;
            W.nodeMatrix[np(n, 'y')] =
              W.nodeMatrix[np(n, 'y')] + W.nodeMatrix[np(n, 'dy')] * nodespeed;
          }
        }
      }

      // Counting one more iteration
      W.iterations++;
    }

    /**
     * Message reception & sending
     */

    // Sending data back to the supervisor
    var sendNewCoords;

    if (Object(this.document) === this.document) {

      // From same document as sigma
      sendNewCoords = function() {
        var e = new Event('newCoords');
        e.nodes = W.nodeMatrix.buffer;
        requestAnimationFrame(function() {
          document.dispatchEvent(e);
        });
      };
    }
    else {

      // From a WebWorker
      sendNewCoords = function() {
        self.postMessage(
          {nodes: W.nodeMatrix.buffer},
          [W.nodeMatrix.buffer]
        );
      };
    }

    // One algorithm pass
    function run() {
      pass();
      sendNewCoords();
    }

    // On supervisor message
    self.addEventListener('message', function(e) {
      switch (e.data.action) {
        case 'start':
          init(
            new Float32Array(e.data.nodes),
            new Float32Array(e.data.edges),
            e.data.config
          );

          // First iteration
          run();
          break;

        case 'loop':
          W.nodeMatrix = new Float32Array(e.data.nodes);
          run();
          break;

        default:
      }
    });
  };


  /**
   * Exporting
   * ----------
   *
   * Crush the worker function and make it accessible by sigma's instances so
   * the supervisor can call it.
   */
  function crush(fnString) {
    var pattern,
        i,
        l;

    var np = [
      'x',
      'y',
      'dx',
      'dy',
      'old_dx',
      'old_dy',
      'mass',
      'convergence',
      'size',
      'fixed'
    ];

    var ep = [
      'source',
      'target',
      'weight'
    ];

    // Replacing matrix accessors by incremented indexes
    for (i = 0, l = np.length; i < l; i++) {
      pattern = new RegExp('np\\(([^,]*), \'' + np[i] + '\'\\)', 'g');
      fnString = fnString.replace(
        pattern,
        (i === 0) ? '$1' : '$1 + ' + i
      );
    }

    for (i = 0, l = ep.length; i < l; i++) {
      pattern = new RegExp('ep\\(([^,]*), \'' + ep[i] + '\'\\)', 'g');
      fnString = fnString.replace(
        pattern,
        (i === 0) ? '$1' : '$1 + ' + i
      );
    }

    return fnString;
  }

  sigma.prototype.getForceAtlas2Worker = function() {
    return ';(' + crush(Worker.toString()) + ').call(this);';
  };
}).call(this);
