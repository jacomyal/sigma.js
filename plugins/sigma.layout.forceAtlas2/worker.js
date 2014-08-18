;(function(undefined) {
  'use strict';

  /**
   * Sigma ForceAtlas2.5 Webworker
   * ==============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Algorithm author: Mathieu Jacomy @ Sciences Po Medialab & WebAtlas
   * Version: 0.1
   */

  var _root = this,
      inWebWorker = !('document' in _root);

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
     * Worker settings and properties
     */
    var W = {

      // Properties
      ppn: 10,
      ppe: 3,
      ppq: 2,
      maxForce: 10,
      iterations: 0,
      converged: false,

      // Possible to change through config
      settings: {
        linLogMode: false,
        outboundAttractionDistribution: false,
        adjustSizes: false,
        edgeWeightInfluence: 0,
        scalingRatio: 1,
        strongGravityMode: false,
        gravity: 1,
        slowDown: 1,
        barnesHutOptimize: false,
        barnesHutTheta: 1.2,
        barnesHutDepthLimit: 4
      }
    };

    /**
     * Helpers
     */
    function extend() {
      var i,
          k,
          res = {},
          l = arguments.length;

      for (i = l - 1; i >= 0; i--)
        for (k in arguments[i])
          res[k] = arguments[i][k];
      return res;
    }

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
     * Algorithm initialization
     */

    // TODO: autosettings
    function init(nodes, edges, config) {
      config = config || {};
      var i, l;

      // Matrices
      W.nodeMatrix = nodes;
      W.edgeMatrix = edges;

      // Length
      W.nodesLength = W.nodeMatrix.length;
      W.edgesLength = W.edgeMatrix.length;

      // Merging configuration
      configure(config);
    }

    function configure(o) {

      // OVERRIDE: we disable barnesHut by default until coded
      o.barnesHutOptimize = false;
      W.settings = extend(o, W.settings);
    }

    /**
     * Algorithm pass
     */

    // MATH: get distances stuff and power 2 issues
    function pass() {
      var a, i, j, l, n, n1, n2, q, e, w, g;

      var barnesHutNodes = [],
          rootRegion,
          outboundAttCompensation,
          coefficient,
          xDist,
          yDist,
          ewc,
          distance,
          factor;


      // 1) Initializing layout data
      //-----------------------------

      // Resetting positions & computing max values
      for (n = 0; n < W.nodesLength; n += W.ppn) {
        W.nodeMatrix[np(n, 'old_dx')] = W.nodeMatrix[np(n, 'dx')];
        W.nodeMatrix[np(n, 'old_dy')] = W.nodeMatrix[np(n, 'dy')];
        W.nodeMatrix[np(n, 'dx')] = 0;
        W.nodeMatrix[np(n, 'dy')] = 0;
      }

      // If outbound attraction distribution, compensate
      if (W.settings.outboundAttractionDistribution) {
        outboundAttCompensation = 0;
        for (n = 0; n < W.nodesLength; n += W.ppn) {
          outboundAttCompensation += W.nodeMatrix[np(n, 'mass')];
        }

        outboundAttCompensation /= W.nodesLength;
      }


      // 1.bis) Barnes-Hut computation
      //------------------------------
      if (W.settings.barnesHutOptimize) {

        // Necessary variables
        // UInt16 should be enough, if not, switch to UInt32
        var quadNb = Math.pow(2, 2 * W.settings.barnesHutDepthLimit),
            quadRowNb = Math.pow(2, W.settings.barnesHutDepthLimit),
            quads = new UInt16Array(quadNb),
            quadsProperties = new Float32Array(quadNb * W.ppq),
            quadsSteps = new UInt16Array(quadNb),
            quadsAcc = new UInt16Array(quadNb),
            nodesQuads = new UInt16Array(W.nodesLength),
            quadsNodes = new UInt16Array(W.nodesLength),
            maxX = 0,
            maxY = 0,
            minX = 0,
            minY = 0,
            xIndex,
            yIndex;

        // Retrieving max values
        // OPTIMIZE: this could be computed on the n loop preceding this one
        // but at the cost of doing it even when Barnes-Hut is disabled
        for (n = 0; n < W.nodesLength; n += W.ppn) {
          maxX = Math.max(maxX, W.nodeMatrix[np(n, 'x')]);
          minX = Math.min(minX, W.nodeMatrix[np(n, 'x')]);
          maxY = Math.max(maxY, W.nodeMatrix[np(n, 'y')]);
          minY = Math.min(minY, W.nodeMatrix[np(n, 'y')]);
        }

        // Adding epsilon to max values
        maxX += 0.0001 * (maxX - minX);
        maxY += 0.0001 * (maxY - minY);

        // Assigning nodes to quads
        for (n = 0, i = 0; n < W.nodesLength; n += W.ppn, i++) {
          xIndex = ((W.nodeMatrix[np(n, 'x')] - minX) / (maxX - minX) *
            Math.pow(2, W.settings.barnesHutDepthLimit)) | 0;

          yIndex = ((W.nodeMatrix[np(n, 'y')] - minY) / (maxY - minY) *
            Math.pow(2, W.settings.barnesHutDepthLimit)) | 0;

          // OPTIMIZE: possible to gain some really little time here
          quads[xIndex * quadRowNb + yIndex] += 1;
          nodesQuads[i] = xIndex * quadRowNb + yIndex;
        }

        // Computing quad steps
        // ALEXIS: here we need to build the second array containing nodes ids
        // in order for the quads iteration in force applications later.
        for (a = 0, i = 0; i < quadNb; i++) {
          a += quads[i];
          quadsSteps[i] = a;
        }
      }


      // 2) Repulsion
      //--------------
      // NOTES: adjustSize = antiCollision & scalingRatio = coefficient

      if (W.settings.barnesHutOptimize) {

        // Applying forces through Barnes-Hut
        // TODO
      }
      else {

        // Square iteration
        // TODO: don't apply forces when n1 === n2
        for (n1 = 0; n1 < W.nodesLength; n1 += W.ppn) {
          for (n2 = 0; n2 < W.nodesLength; n2 += W.ppn) {

            // Common to both methods
            xDist = W.nodeMatrix[np(n1, 'x')] - W.nodeMatrix[np(n2, 'x')];
            yDist = W.nodeMatrix[np(n1, 'y')] - W.nodeMatrix[np(n2, 'y')];

            if (W.settings.adjustSize) {

              //-- Anticollision Linear Repulsion
              distance = Math.sqrt(xDist * xDist + yDist * yDist) -
                W.nodeMatrix[np(n1, 'size')] -
                W.nodeMatrix[np(n2, 'size')];

              if (distance > 0) {
                factor = W.settings.scalingRatio *
                  W.nodeMatrix[np(n1, 'mass')] *
                  W.nodeMatrix[np(n2, 'mass')] /
                  distance / distance;

                // Updating nodes' dx and dy
                W.nodeMatrix[np(n1, 'dx')] += xDist * factor;
                W.nodeMatrix[np(n1, 'dy')] += yDist * factor;

                W.nodeMatrix[np(n2, 'dx')] += xDist * factor;
                W.nodeMatrix[np(n2, 'dy')] += yDist * factor;
              }
              else if (distance < 0) {
                factor = 100 * W.settings.scalingRatio *
                  W.nodeMatrix[np(n1, 'mass')] *
                  W.nodeMatrix[np(n2, 'mass')];

                // Updating nodes' dx and dy
                W.nodeMatrix[np(n1, 'dx')] += xDist * factor;
                W.nodeMatrix[np(n1, 'dy')] += yDist * factor;

                W.nodeMatrix[np(n2, 'dx')] -= xDist * factor;
                W.nodeMatrix[np(n2, 'dy')] -= yDist * factor;
              }
            }
            else {

              //-- Linear Repulsion
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

              if (distance > 0) {
                factor = W.settings.scalingRatio *
                  W.nodeMatrix[np(n1, 'mass')] *
                  W.nodeMatrix[np(n2, 'mass')] /
                  distance / distance;

                // Updating nodes' dx and dy
                W.nodeMatrix[np(n1, 'dx')] += xDist * factor;
                W.nodeMatrix[np(n1, 'dy')] += yDist * factor;

                W.nodeMatrix[np(n2, 'dx')] -= xDist * factor;
                W.nodeMatrix[np(n2, 'dy')] -= yDist * factor;
              }
            }
          }
        }
      }


      // 3) Gravity
      //------------
      g = W.settings.gravity / W.settings.scalingRatio;
      coefficient = W.settings.scalingRatio;
      for (n = 0; n < W.nodesLength; n += W.ppn) {
        factor = 0;

        // Common to both methods
        xDist = W.nodeMatrix[np(n, 'x')];
        yDist = W.nodeMatrix[np(n, 'y')];
        distance = Math.sqrt(
          Math.pow(xDist, 2) + Math.pow(yDist, 2)
        );

        if (W.settings.strongGravityMode) {

          //-- Strong gravity
          if (distance > 0)
            factor = coefficient * W.nodeMatrix[np(n, 'mass')] * g;
        }
        else {

          //-- Linear Anti-collision Repulsion n
          if (distance > 0)
            factor = coefficient * W.nodeMatrix[np(n, 'mass')] * g / distance;
        }

        // Updating node's dx and dy
        W.nodeMatrix[np(n, 'dx')] -= xDist * factor;
        W.nodeMatrix[np(n, 'dy')] -= yDist * factor;
      }



      // 4) Attraction
      //---------------
      coefficient = 1 *
        (W.settings.outboundAttractionDistribution ?
          outboundAttCompensation :
          1);

      // TODO: simplify distance
      // TODO: coefficient is always used as -c --> optimize?
      for (e = 0; e < W.edgesLength; e += W.ppe) {
        n1 = W.edgeMatrix[ep(e, 'source')];
        n2 = W.edgeMatrix[ep(e, 'target')];
        w = W.edgeMatrix[ep(e, 'weight')];

        // Edge weight influence
        if (W.settings.edgeWeightInfluence === 0)
          ewc = 1
        else if (W.settings.edgeWeightInfluence === 1)
          ewc = w;
        else
          ewc = Math.pow(w, W.settings.edgeWeightInfluence);

        // Common measures
        xDist = W.nodeMatrix[np(n1, 'x')] - W.nodeMatrix[np(n2, 'x')];
        yDist = W.nodeMatrix[np(n1, 'y')] - W.nodeMatrix[np(n2, 'y')];

        // Applying attraction to nodes
        if (W.settings.adjustSizes) {

          distance = Math.sqrt(
            (Math.pow(xDist, 2) + Math.pow(yDist, 2)) -
            W.nodeMatrix[np(n1, 'size')] -
            W.nodeMatrix[np(n2, 'size')]
          );

          if (W.settings.linLogMode) {
            if (W.settings.outboundAttractionDistribution) {

              //-- LinLog Degree Distributed Anti-collision Attraction
              if (distance > 0) {
                factor = -coefficient * ewc * Math.log(1 + distance) /
                distance /
                W.nodeMatrix[np(n1, 'mass')];
              }
            }
            else {

              //-- LinLog Anti-collision Attraction
              if (distance > 0) {
                factor = -coefficient * ewc * Math.log(1 + distance) / distance;
              }
            }
          }
          else {
            if (W.settings.outboundAttractionDistribution) {

              //-- Linear Degree Distributed Anti-collision Attraction
              if (distance > 0) {
                factor = -coefficient * ewc / W.nodeMatrix[np(n1, 'mass')];
              }
            }
            else {

              //-- Linear Anti-collision Attraction
              if (distance > 0) {
                factor = -coefficient * ewc;
              }
            }
          }
        }
        else {

          distance = Math.sqrt(
            Math.pow(xDist, 2) + Math.pow(yDist, 2)
          );

          if (W.settings.linLogMode) {
            if (W.settings.outboundAttractionDistribution) {

              //-- LinLog Degree Distributed Attraction
              if (distance > 0) {
                factor = -coefficient * ewc * Math.log(1 + distance) /
                  distance /
                  W.nodeMatrix[np(n1, 'mass')];
              }
            }
            else {

              //-- LinLog Attraction
              if (distance > 0)
                factor = -coefficient * ewc * Math.log(1 + distance) / distance;
            }
          }
          else {
            if (W.settings.outboundAttractionDistribution) {

              //-- Linear Attraction Mass Distributed
              // NOTE: Distance is set to 1 to override next condition
              distance = 1;
              factor = -coefficient * ewc / W.nodeMatrix[np(n1, 'mass')];
            }
            else {

              //-- Linear Attraction
              // NOTE: Distance is set to 1 to override next condition
              distance = 1;
              factor = -coefficient * ewc;
            }
          }
        }

        // Updating nodes' dx and dy
        // TODO: if condition or factor = 1?
        if (distance > 0) {

          // Updating nodes' dx and dy
          W.nodeMatrix[np(n1, 'dx')] += xDist * factor;
          W.nodeMatrix[np(n1, 'dy')] += yDist * factor;

          W.nodeMatrix[np(n2, 'dx')] -= xDist * factor;
          W.nodeMatrix[np(n2, 'dy')] -= yDist * factor;
        }
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
                W.nodeMatrix[np(n, 'dx')] * W.maxForce / force;
              W.nodeMatrix[np(n, 'dy')] =
                W.nodeMatrix[np(n, 'dy')] * W.maxForce / force;
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
              W.nodeMatrix[np(n, 'x')] + W.nodeMatrix[np(n, 'dx')] *
              (nodespeed / W.settings.slowDown);
            W.nodeMatrix[np(n, 'y')] =
              W.nodeMatrix[np(n, 'y')] + W.nodeMatrix[np(n, 'dy')] *
              (nodespeed / W.settings.slowDown);
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
              W.nodeMatrix[np(n, 'x')] + W.nodeMatrix[np(n, 'dx')] *
              (nodespeed / W.settings.slowDown);
            W.nodeMatrix[np(n, 'y')] =
              W.nodeMatrix[np(n, 'y')] + W.nodeMatrix[np(n, 'dy')] *
              (nodespeed / W.settings.slowDown);
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

    if (typeof window !== 'undefined' && window.document) {

      // From same document as sigma
      sendNewCoords = function() {
        var e = new Event('newCoords');
        e.data = {
          nodes: W.nodeMatrix.buffer
        };
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

        case 'config':

          // Merging new settings
          configure(e.data.config);
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

  // Exporting
  function getWorkerFn() {
    var fnString = crush ? crush(Worker.toString()) : Worker.toString();
    return ';(' + fnString + ').call(this);';
  }

  if (inWebWorker) {

    // We are in a webworker, so we launch the Worker function
    eval(getWorkerFn());
  }
  else {

    // We are requesting the worker from sigma, we retrieve it therefore
    if (typeof sigma === 'undefined')
      throw 'sigma is not declared';

    sigma.prototype.getForceAtlas2Worker = getWorkerFn;
  }
}).call(this);
