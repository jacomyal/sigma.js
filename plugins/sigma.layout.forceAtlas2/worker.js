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
        barnesHutTheta: 1.2
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
      var a, i, j, l, r, n, n1, n2, q, q2, e, w, g, k, m;

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
          // maxl, full barnes hut
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
        var minX = Number.MAX_VALUE,
            maxX = -Number.MAX_VALUE,
            minY = Number.MAX_VALUE,
            maxY = -Number.MAX_VALUE;

        // Setting up
        barnesHutMatrix = [];

        // Initial nodes holder
        nodes = [];
        for (n = 0; n < W.nodesLength; n += W.ppn) {
          nodes.push(n);
          minX = Math.min(minX, W.nodeMatrix[np(n, 'x')]);
          maxX = Math.max(maxX, W.nodeMatrix[np(n, 'x')]);
          minY = Math.min(minY, W.nodeMatrix[np(n, 'y')]);
          maxY = Math.max(maxY, W.nodeMatrix[np(n, 'y')]);
        }

        // Build the Barnes Hut Tree
        barnesHutMatrix.push([  // Root region
          -1,                               // Node
          (minX + maxX) / 2,                // x center
          (minY + maxY) / 2,                // y center
          Math.max(maxX-minX, maxY-minY),   // Size (half-width of the square)
          -1,                               // Next sibling index
          -1,                               // First child index
          0,                                // Mass
          0,                                // Mass center x
          0                                 // Mass center y
        ]);

        // Add each node in the tree
        for (n = 0; n < W.nodesLength; n += W.ppn) {
          r = barnesHutMatrix[0];   // Current region
                                    // We start with root region

          while(true){

            // Are there sub-regions ?

            if(r[5] >= 0){ // We look at first child index

              // There are sub-regions

              // We just iterate to find a "leave" of the tree
              // that is an empty region or a region with a single node
              // (see next case)

              // Find the quadrant of n
              if(W.nodeMatrix[np(n, 'x')]<r[1]){
                if(W.nodeMatrix[np(n, 'y')]<r[2]){
                  // Top Left quarter
                  q = barnesHutMatrix[r[5]]
                } else {
                  // Bottom Left quarter
                  q = barnesHutMatrix[r[5]+1]
                }
              } else {
                if(W.nodeMatrix[np(n, 'y')]<r[2]){
                  // Top Right quarter
                  q = barnesHutMatrix[r[5]+2]
                } else {
                  // Bottom Right quarter
                  q = barnesHutMatrix[r[5]+3]
                }
              }

              // Update center of mass and mass (we only do it for non-leave regions)
              r[7] = (r[7] * r[6] + W.nodeMatrix[np(n, 'x')] * W.nodeMatrix[np(n, 'mass')]) / (r[6] + W.nodeMatrix[np(n, 'mass')]);
              r[8] = (r[8] * r[6] + W.nodeMatrix[np(n, 'y')] * W.nodeMatrix[np(n, 'mass')]) / (r[6] + W.nodeMatrix[np(n, 'mass')]);
              r[6] += W.nodeMatrix[np(n, 'mass')];

              // Iterate on the right quadrant
              r = q;
              continue;

            } else {

              // There are no sub-regions: we are in a "leave"

              // Is there a node in this leave?
              if(r[0] < 0){

                // There is no node in region:
                // we record node n and go on
                r[0] = n;

                break;

              } else {

                // There is a node in this region

                // We will need to create sub-regions, stick the two
                // nodes (the old one r[0] and the new one n) in two
                // subregions. If they fall in the same quadrant,
                // we will iterate.

                // Create sub-regions

                r[5] = barnesHutMatrix.length;  // first child index
                w = r[3]/2  // new size (half)

                // NB: we use screen coordinates
                // from Top Left to Bottom Right

                // Top Left sub-region
                barnesHutMatrix[r[5]] = [
                  -1,             // Node
                  r[1] - w,       // x center
                  r[2] - w,       // y center
                  w,              // Size (half-width of the square)
                  r[5] + 1,        // Next sibling index
                  -1,             // First child index
                  0,              // Mass
                  0,              // Mass center x
                  0               // Mass center y
                ]

                // Bottom Left sub-region
                barnesHutMatrix[r[5]+1] = [
                  -1,             // Node
                  r[1] - w,       // x center
                  r[2] + w,       // y center
                  w,              // Size (half-width of the square)
                  r[5] + 2,       // Next sibling index
                  -1,             // First child index
                  0,              // Mass
                  0,              // Mass center x
                  0               // Mass center y
                ]

                // Top Right sub-region
                barnesHutMatrix[r[5]+2] = [
                  -1,             // Node
                  r[1] + w,       // x center
                  r[2] - w,       // y center
                  w,              // Size (half-width of the square)
                  r[5] + 3,       // Next sibling index
                  -1,             // First child index
                  0,              // Mass
                  0,              // Mass center x
                  0               // Mass center y
                ]

                // Bottom Right sub-region
                barnesHutMatrix[r[5]+3] = [
                  -1,             // Node
                  r[1] + w,       // x center
                  r[2] + w,       // y center
                  w,              // Size (half-width of the square)
                  r[4],           // Next sibling index -> Jump to parent's next sibling
                  -1,             // First child index
                  0,              // Mass
                  0,              // Mass center x
                  0               // Mass center y
                ]

                // Now the goal is to find two different sub-regions
                // for the two nodes: the one previously recorded (r[0])
                // and the one we want to add (n)

                // Find the quadrant of r[0] (old node)
                if(W.nodeMatrix[np(r[0], 'x')]<r[1]){
                  if(W.nodeMatrix[np(r[0], 'y')]<r[2]){
                    // Top Left quarter
                    q = barnesHutMatrix[r[5]]
                  } else {
                    // Bottom Left quarter
                    q = barnesHutMatrix[r[5]+1]
                  }
                } else {
                  if(W.nodeMatrix[np(r[0], 'y')]<r[2]){
                    // Top Right quarter
                    q = barnesHutMatrix[r[5]+2]
                  } else {
                    // Bottom Right quarter
                    q = barnesHutMatrix[r[5]+3]
                  }
                }

                // We remove r[0] from the region r, add its mass to r and record it in q
                r[6] = W.nodeMatrix[np(r[0], 'mass')];  // Mass
                r[7] = W.nodeMatrix[np(r[0], 'x')];  // Mass center x
                r[8] = W.nodeMatrix[np(r[0], 'y')];  // Mass center y
                q[0] = r[0];
                r[0] = -1;

                // Find the quadrant of n
                if(W.nodeMatrix[np(n, 'x')]<r[1]){
                  if(W.nodeMatrix[np(n, 'y')]<r[2]){
                    // Top Left quarter
                    q2 = barnesHutMatrix[r[5]]
                  } else {
                    // Bottom Left quarter
                    q2 = barnesHutMatrix[r[5]+1]
                  }
                } else {
                  if(W.nodeMatrix[np(n, 'y')]<r[2]){
                    // Top Right quarter
                    q2 = barnesHutMatrix[r[5]+2]
                  } else {
                    // Bottom Right quarter
                    q2 = barnesHutMatrix[r[5]+3]
                  }
                }

                if(q == q2){
                  
                  // If both nodes are in the same quadrant,
                  // we have to try it again on this quadrant
                  r = q;
                  continue;
                }
                
                // If both quadrants are different, we record n
                // in its quadrant
                q2[0] = n
                break;
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

          r = barnesHutMatrix[0]; // Starting with root region
          while (true) {

            if(r[5] >= 0){

              // The region has sub-regions

              // We run the Barnes Hut test to see if we are at the right distance
              distance = Math.sqrt(
                (Math.pow(W.nodeMatrix[np(n, 'x')] - r[7], 2)) +
                (Math.pow(W.nodeMatrix[np(n, 'y')] - r[8], 2))
              );
              if (2 * r[3] / distance < W.settings.barnesHutTheta){

                // We treat the region as a single body, and we repulse

                xDist = W.nodeMatrix[np(n, 'x')] - r[7];
                yDist = W.nodeMatrix[np(n, 'y')] - r[8];

                if (W.settings.adjustSize) {

                  //-- Linear Anti-collision Repulsion
                  if (distance > 0) {
                    factor = coefficient * W.nodeMatrix[np(n, 'mass')] *
                      r[6] / distance / distance;

                    W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                    W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                  }
                  else if (distance < 0) {
                    factor = -coefficient * W.nodeMatrix[np(n, 'mass')] *
                      r[6] / distance;

                    W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                    W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                  }
                }
                else {

                  //-- Linear Repulsion
                  if (distance > 0) {
                    factor = coefficient * W.nodeMatrix[np(n, 'mass')] *
                      r[6] / distance / distance;

                    W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                    W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                  }
                }

                // When this is done, we iterate. We have to look at the next sibling.
                if(r[4] < 0)
                  break;  // No next sibling: we have finished the tree
                r = barnesHutMatrix[r[4]]
                continue;

              } else {

                // The region is too close and we have to look at sub-regions
                r = barnesHutMatrix[r[5]]
                continue;
              }

            } else {

              // The region has no sub-region
              // If there is a node r[0] and it is not n, then repulse

              if(r[0] >= 0 && r[0] !== n){
                xDist = W.nodeMatrix[np(n, 'x')] - W.nodeMatrix[np(r[0], 'x')];
                yDist = W.nodeMatrix[np(n, 'y')] - W.nodeMatrix[np(r[0], 'y')];

                if (W.settings.adjustSize) {

                  //-- Linear Anti-collision Repulsion
                  if (distance > 0) {
                    factor = coefficient * W.nodeMatrix[np(n, 'mass')] *
                      W.nodeMatrix[np(r[0], 'mass')] / distance / distance;

                    W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                    W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                  }
                  else if (distance < 0) {
                    factor = -coefficient * W.nodeMatrix[np(n, 'mass')] *
                      W.nodeMatrix[np(r[0], 'mass')] / distance;

                    W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                    W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                  }
                }
                else {

                  //-- Linear Repulsion
                  if (distance > 0) {
                    factor = coefficient * W.nodeMatrix[np(n, 'mass')] *
                      W.nodeMatrix[np(r[0], 'mass')] / distance / distance;

                    W.nodeMatrix[np(n, 'dx')] += xDist * factor;
                    W.nodeMatrix[np(n, 'dy')] += yDist * factor;
                  }
                }

              }

              // When this is done, we iterate. We have to look at the next sibling.
              if(r[4] < 0)
                break;  // No next sibling: we have finished the tree
              r = barnesHutMatrix[r[4]]
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
