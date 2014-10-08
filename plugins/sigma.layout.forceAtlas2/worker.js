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
        barnesHutDepthLimit: 3
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

    function __emptyObject(obj) {
      var k;

      for (k in obj)
        if (!('hasOwnProperty' in obj) || obj.hasOwnProperty(k))
          delete obj[k];

      return obj;
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
        throw 'np: non int.';

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
      // o.barnesHutOptimize = false;
      W.settings = extend(o, W.settings);
    }

    /**
     * Algorithm pass
     */

    // MATH: get distances stuff and power 2 issues
    function pass() {
      var a, i, j, l, r, n, n1, n2, q, e, w, g, k, m;

      var barnesHutMatrix,
          outboundAttCompensation,
          coefficient,
          xDist,
          yDist,
          ewc,
          mass,
          distance,
          size,
          factor,
          nodes,
          lvl,
          maxl,
          child,
          q0,q1,q2,q3;

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

      // TODO: arrange shortcuts in iteration when too few nodes.
      if (W.settings.barnesHutOptimize) {
        var massSumX,
            massSumY,
            walker_location,
            locations_index;

        // Setting up
        barnesHutMatrix = [];
        walker_location = [0];

        // Initial nodes holder
        nodes = [];
        for (n = 0; n < W.nodesLength; n += W.ppn) {
          nodes.push(n);
        }

        // Max level
        maxl = W.settings.barnesHutDepthLimit

        // Max length = (4^n+1 - 1) / 3
        l = (Math.pow(4, (maxl + 1)) - 1) / 3;
        barnesHutMatrix.length = l;

        // Build Locations Index
        locations_index = {};
        i = 0
        while(i < l) {
          locations_index[walker_location.join('')] = i
          
          // Next iteration
          // console.log('i: ' + i + ' - loc: ' + walker_location.join(' '))
          i++
          if(walker_location.length <= maxl){
            walker_location.push(0)
          } else {
            if(walker_location[maxl] < 3){
              walker_location[maxl]++
            } else {
              lvl = maxl
              while(lvl > 0){
                walker_location.pop()
                lvl--
                if(walker_location[lvl] < 3){
                  walker_location[lvl]++
                  break;
                }
              }
            }
          }

        }
        walker_location = [0];

        // Iterate
        i = 0
        while(i < l) {

          // Defining region
          r = i ? barnesHutMatrix[i] : {
            nodes: nodes,
            jump: -1,
            lvl: 0
          };

          // TODO: do we need an object here? or his a simple node array valid?
          r.mass = 0;
          r.massCenterX = 0;
          r.massCenterY = 0;
          r.size = 0;

          massSumX = 0;
          massSumY = 0;

          // Iterating through nodes to split regions
          if (r.nodes.length) {
            for (j = 0, k = r.nodes.length; j < k; j++) {
              n = r.nodes[j];

              mass = W.nodeMatrix[np(n, 'mass')];
              r.mass += mass;
              massSumX += W.nodeMatrix[np(n, 'x')] * mass;
              massSumY += W.nodeMatrix[np(n, 'y')] * mass;
            }

            r.massCenterX = massSumX / r.mass;
            r.massCenterY = massSumY / r.mass;

            // Computing size
            for (j = 0, k = r.nodes.length; j < k; j++) {
              n = r.nodes[j];

              distance = 2 * Math.sqrt(
                Math.pow((W.nodeMatrix[np(n, 'x')] - r.massCenterX), 2) +
                Math.pow((W.nodeMatrix[np(n, 'y')] - r.massCenterY), 2)
              );
              r.size = (r.size === 0) ?
                distance :
                Math.max(r.size, distance);
            }
          }

          // Adding to index
          barnesHutMatrix[i] = r;

          // Create sub-regions if we are not at leaf level          
          if (walker_location.length <= maxl){

            // Defining subregions
            q0 = locations_index[walker_location.slice(0).concat([0]).join('')]
            q1 = locations_index[walker_location.slice(0).concat([1]).join('')]
            q2 = locations_index[walker_location.slice(0).concat([2]).join('')]
            q3 = locations_index[walker_location.slice(0).concat([3]).join('')]
            barnesHutMatrix[q0] = {nodes: [], lvl: r.lvl+1, jump:q1}
            barnesHutMatrix[q1] = {nodes: [], lvl: r.lvl+1, jump:q2}
            barnesHutMatrix[q2] = {nodes: [], lvl: r.lvl+1, jump:q3}
            barnesHutMatrix[q3] = {nodes: [], lvl: r.lvl+1, jump:r.jump}

            // Attributing nodes to subregions
            // NOTE: side attribution is not that relevant
            for (j = 0, k = r.nodes.length; j < k; j++) {
              n = r.nodes[j];

              if (W.nodeMatrix[np(n, 'x')] < r.massCenterX) {

                // Left
                if (W.nodeMatrix[np(n, 'y')] < r.massCenterY)
                  barnesHutMatrix[q0].nodes.push(n);
                else
                  barnesHutMatrix[q1].nodes.push(n);
              }
              else {

                // Right
                if (W.nodeMatrix[np(n, 'y')] < r.massCenterY)
                  barnesHutMatrix[q2].nodes.push(n);
                else
                  barnesHutMatrix[q3].nodes.push(n);
              }
            }
          }

          // Next iteration
          i++
          if(walker_location.length <= maxl){
            walker_location.push(0)
          } else {
            if(walker_location[maxl] < 3){
              walker_location[maxl]++
            } else {
              lvl = maxl
              while(lvl > 0){
                walker_location.pop()
                lvl--
                if(walker_location[lvl] < 3){
                  walker_location[lvl]++
                  break;
                }
              }
            }
          }
          
        }
      }


      // 2) Repulsion
      //--------------
      // NOTES: adjustSize = antiCollision & scalingRatio = coefficient

      if (W.settings.barnesHutOptimize) {
        coefficient = W.settings.scalingRatio;

        // Applying repulsion through regions
        for (n = 0; n < W.nodesLength; n += W.ppn) {

          // Computing leaf quad nodes iteration
          l = barnesHutMatrix.length;
          i = 0

          while (i < l) {
            r = barnesHutMatrix[i];

            // If no node we continue
            if (!r.nodes.length){
              i = r.jump;
              if(i<0)
                break;
              continue;
            }

            distance = Math.sqrt(
              (Math.pow(W.nodeMatrix[np(n, 'x')] - r.massCenterX, 2)) +
              (Math.pow(W.nodeMatrix[np(n, 'y')] - r.massCenterY, 2))
            );

            // If the region is small enough for the distance, we compute
            if (r.size / distance < W.settings.barnesHutTheta){
              
              xDist = W.nodeMatrix[np(n, 'x')] - r.massCenterX;
              yDist = W.nodeMatrix[np(n, 'y')] - r.massCenterY;

              if (W.settings.adjustSize) {

                //-- Linear Anti-collision Repulsion
                if (distance > 0) {
                  factor = coefficient * W.nodeMatrix[np(n, 'mass')] *
                    r.mass / distance / distance;

                  W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                  W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                }
                else if (distance < 0) {
                  factor = -coefficient * W.nodeMatrix[np(n, 'mass')] *
                    r.mass / distance;

                  W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                  W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                }
              }
              else {

                //-- Linear Repulsion
                if (distance > 0) {
                  factor = coefficient * W.nodeMatrix[np(n, 'mass')] *
                    r.mass / distance / distance;

                  W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                  W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                }
              }

              i = r.jump;
              if(i<0)
                break;
            }

            // At this point we look for smaller quadrants
            else {
              i++
              continue;
            }

            

          }
        }
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
    var listener = function(e) {
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

        case 'kill':

          // Deleting context for garbage collection
          __emptyObject(W);
          self.removeEventListener('message', listener);
          break;

        default:
      }
    };

    // Adding event listener
    self.addEventListener('message', listener);
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
