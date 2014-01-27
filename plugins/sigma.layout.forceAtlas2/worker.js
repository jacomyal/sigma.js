;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma ForceAtlas2.1 Webworker
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

  // TODO: rewrite the Force Factory
  var Worker = function() {

    /**
     * Worker Properties
     */
    var _w = {};

    /**
     * Helpers namespace
     */
    var _helpers = {
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
    function _np(i, prop) {
      switch (prop) {
        case 'y':
          return i + 1;
          break;
        case 'dx':
          return i + 2;
          break;
        case 'dy':
          return i + 3;
          break;
        case 'old_dx':
          return i + 4;
          break;
        case 'old_dy':
          return i + 5;
          break;
        case 'degree':
        case 'mass':
          return i + 6;
          break;
        case 'fixed':
          return i + 7;
          break;
        default:
          return i;
      }
    }

    function _ep(i, prop) {
      switch (prop) {
        case 'target':
          return i + 1;
          break;
        case 'weight':
          return i + 2;
          break;
        default:
          return i;
      }
    }

    /**
     * Worker functions
     * -----------------
     */
    function _init(nodes, eges, config) {
      var i,
          l;

      // Merging configuration
      _w.p = _helpers.extend(
        config || {},
        this.defaults
      );

      // Storing nodes
      _w.nodes = nodes;
      _w.edges = nodes;
      _w.ppn = 8;
      _w.ppe = 3;
      _w.nIndex = [];
      _w.eIndex = [];

      // Building node index
      for (i = 0, l = _w.nodes.byteLength; i < l; i += _w.ppn) {
        _w.nIndex.push(i);
      }

      // Building edge index
      for (i = 0, l = _w.edges.byteLength; i < l; i += _w.ppe) {
        _w.eIndex.push(i);
      }

      // State
      _w.state = {step: 0, index: 0};
      _w.rootRegion = false;
    }

    function _setAutoSettings() {
      var nlen = _w.nodes.byteLength / _w.ppn;

      // Tuning
      if (nlen >= 100)
        _w.p.scalingRatio = 2.0;
      else
        _w.p.scalingRatio = 10.0;

      _w.p.strongGravityMode = false;
      _w.p.gravity = 1;

      // Behaviour
      _w.p.outboundAttractionDistribution = false;
      _w.p.linLogMode = false;
      _w.p.adjustSizes = false;
      _w.p.edgeWeightInfluence = 1;

      // Tweak
      if (nlen >= 1000)
        _w.p.barnesHutOptimize = true;
      else
        _w.p.barnesHutOptimize = false;

      _w.p.jitterTolerance = 1;
      _w.p.barnesHutTheta = 1.2;
    }

    /**
     * Algorithm's pass
     */
    function _atomicGo() {
      var nodes = _w.nodes,
          edges = _w.edges,
          cInt = _w.p.complexIntervals,
          sInt = _w.p.simpleIntervals,
          j,
          n,
          l;

      switch (_w.state.step) {
        case 0: // Pass init
          // Initialise layout data
          if (_w.p.outboundAttCompensation)
            _w.p.outboundAttCompensation = 0;

          for (j = 0, l = _w.nIndex.length; j < l; j++) {
            n = _w.nIndex[j];

            nodes[_np(n, 'old_dx')] = nodes[_np(n, 'dx')];
            nodes[_np(n, 'old_dy')] = nodes[_np(n, 'dy')];

            if (_w.p.outboundAttractionDistribution) {
              _w.p.outboundAttCompensation  += nodes[_np(n, 'mass')]
            }
          }

          _w.p.outboundAttCompensation /= l;

          // If Barnes Hut active, initialize root region
          if (_w.p.barnesHutOptimize) {
            _w.rootRegion = new Region(nIndex, 0);
            _w.rootRegion.buildSubRegions();
          }

          _w.state.step = 1;
          _w.state.index = 0;
          return true;
          break;

        case 1: // Repulsion
          var Repulsion = _forceFactory.buildRepulsion(
            _w.p.adjustSizes,
            _w.p.scalingRatio
          );

          if (_w.p.barnesHutOptimize) {
            var rootRegion = _w.rootRegion;

            // Pass to the scope of forEach
            var barnesHutTheta = _w.p.barnesHutTheta;
            var i = _w.state.index;
            while (i < nIndex.length && i < _w.state.index + cInt) {
              var n = nodes[nIndex[i + 1]];
              rootRegion.applyForce(n, Repulsion, barnesHutTheta);
            }
            if (i == nIndex.length) {
              _w.state.step = 2;
              _w.state.index = 0;
            } else {
              _w.state.index = i;
            }
          } else {
            var i1 = _w.state.index;
            while (i1 < nIndex.length && i1 < _w.state.index + cInt) {
              var n1 = nodes[nIndex[i1 + 1]];
              for (j = 0, l = nIndex.length; j < l; j++) {
                if (j < i1) {
                  Repulsion.apply_nn(n1, nodes[nIndex[j]]);
                }
              }
            }
            if (i1 == nIndex.length) {
              _w.state.step = 2;
              _w.state.index = 0;
            } else {
              _w.state.index = i1;
            }
          }
          return true;
          break;

        case 2: // Gravity
          var Gravity = (_w.p.strongGravityMode) ?
                        (_forceFactory.getStrongGravity(
                          _w.p.scalingRatio
                        )) :
                        (_forceFactory.buildRepulsion(
                          _w.p.adjustSizes,
                          _w.p.scalingRatio
                        ));
          // Pass gravity and scalingRatio to the scope of the function
          var gravity = _w.p.gravity,
              scalingRatio = _w.p.scalingRatio;

          var i = _w.state.index;
          while (i < nIndex.length && i < _w.state.index + sInt) {
            var n = nodes[nIndex[i++]];
            Gravity.apply_g(n, gravity / scalingRatio);
          }

          if (i == nIndex.length) {
            _w.state.step = 3;
            _w.state.index = 0;
          } else {
            _w.state.index = i;
          }
          return true;
          break;

        case 3: // Attraction
          var Attraction = _forceFactory.buildAttraction(
            _w.p.linLogMode,
            _w.p.outboundAttractionDistribution,
            _w.p.adjustSizes,
            1 * ((_w.p.outboundAttractionDistribution) ?
              (_w.p.outboundAttCompensation) :
              (1))
          );

          // CURSOR
          var i = _w.state.index;
          if (_w.p.edgeWeightInfluence == 0) {
            while (i < eIndex.length && i < _w.state.index + cInt) {
              var e = edges[eIndex[i++]];
              Attraction.apply_nn(
                nodes[edges[_ep(e, 'source')]],
                nodes[edges[_ep(e, 'target')]],
                1
              );
            }
          } else if (_w.p.edgeWeightInfluence == 1) {
            while (i < eIndex.length && i < _w.state.index + cInt) {
              var e = edges[eIndex[i++]];
              Attraction.apply_nn(
                nodes[edges[_ep(e, 'source')]],
                nodes[edges[_ep(e, 'target')]],
                nodes[edges[_ep(e, 'weigth')]] || 1
              );
            }
          } else {
            while (i < eIndex.length && i < _w.state.index + cInt) {
              var e = edges[eIndex[i++]];
              Attraction.apply_nn(
                nodes[edges[_ep(e, 'source')]],
                nodes[edges[_ep(e, 'target')]],
                Math.pow(
                  nodes[edges[_ep(e, 'weigth')]] || 1,
                  _w.p.edgeWeightInfluence
                )
              );
            }
          }

          if (i == eIndex.length) {
            _w.state.step = 4;
            _w.state.index = 0;
          } else {
            _w.state.index = i;
          }

          return true;
          break;

        case 4: // Auto adjust speed
          var totalSwinging = 0,  // How much irregular movement
              totalEffectiveTraction = 0,
              fixed,
              swinging;  // Hom much useful movement

          for (j = 0, l = _w.nIndex.length; j < l; j++) {
            n = _w.nIndex[j];
            fixed = !!nodes[_np(n, 'fixed')] || false;
            if (!fixed) {
              swinging = Math.sqrt(Math.pow(
                nodes[_np(n, 'old_dx')] - nodes[_np(n, 'dx')], 2) +
                Math.pow(nodes[_np(n, 'old_dy')] - nodes[_np(n, 'dy')], 2));

              totalSwinging += nodes[_np(n, 'mass')] * swinging;
              totalEffectiveTraction += nodes[_np(n, 'mass')] *
                                        0.5 *
                                        Math.sqrt(
                                          Math.pow(
                                            nodes[_np(n, 'old_dx')] +
                                            nodes[_np(n, 'dx')], 2) +
                                          Math.pow(
                                            nodes[_np(n, 'old_dy')] +
                                            nodes[_np(n, 'dy')], 2)
                                        );
            }
          }

          _w.p.totalSwinging = totalSwinging;
          _w.p.totalEffectiveTraction = totalEffectiveTraction;

          // We want that swingingMovement < tolerance * convergenceMovement
          /*var targetSpeed = Math.pow(_w.p.jitterTolerance, 2) *
                            _w.p.totalEffectiveTraction /
                            _w.p.totalSwinging;*/
          /// Tweak start
          // Optimize jitter tolerance:
          // var jitterTolerance = Math.max(_w.p.jitterTolerance, Math.min(5, _w.p.totalEffectiveTraction / Math.pow(nodes.length, 2)))
          var estimatedOptimalJitterTolerance = 0.02 * Math.sqrt(nIndex.length) // The 'right' jitter tolerance for this network. Bigger networks need more tolerance.
            ,minJT = Math.sqrt(estimatedOptimalJitterTolerance)
            ,maxJT = 10
            ,jitterTolerance = _w.p.jitterTolerance *
              Math.max(
                minJT,
                Math.min(
                  maxJT,
                  estimatedOptimalJitterTolerance *
                    _w.p.totalEffectiveTraction / Math.pow(nIndex.length, 2)))

          var minSpeedEfficiency = 0.05;
          
          // Protection against erratic behavior
          if(_w.p.totalSwinging / _w.p.totalEffectiveTraction > 2.0){
              if(_w.p.speedEfficiency > minSpeedEfficiency)
                  _w.p.speedEfficiency *= 0.5;
              jt = Math.max(jitterTolerance, _w.p.jitterTolerance);
          }

          var targetSpeed = jitterTolerance *
                            _w.p.speedEfficiency *
                            _w.p.totalEffectiveTraction /
                            _w.p.totalSwinging;

          // Speed efficiency is how the speed really corresponds to the swinging vs. convergence tradeoff
          // We adjust it slowly and carefully
          if(_w.p.totalSwinging > jitterTolerance * _w.p.totalEffectiveTraction){
            if(_w.p.speedEfficiency > minSpeedEfficiency)
              _w.p.speedEfficiency *= 0.7
          } else {
            if(_w.p.speed < 1000)
              _w.p.speedEfficiency *= 1.3
          }

          /// End tweak

          // But the speed shoudn't rise too much too quickly,
          // since it would make the convergence drop dramatically.
          var maxRise = 0.5;   // Max rise: 50%
          _w.p.speed = _w.p.speed +
                         Math.min(
                           targetSpeed - _w.p.speed,
                           maxRise * _w.p.speed
                         );
          
          // console.log('speed '+Math.floor(1000*_w.p.speed)/1000+' sEff '+Math.floor(1000*_w.p.speedEfficiency)/1000+' jitter '+Math.floor(1000*jitterTolerance)/1000+' swing '+Math.floor(_w.p.totalSwinging/nodes.length)+' conv '+Math.floor(_w.p.totalEffectiveTraction/nodes.length));

          // Save old coordinates
          for (j = 0, l = _w.nIndex.length; j < l; j++) {
            n = _w.nIndex[j];
            nodes[_np(n, 'old_x')] = nodes[_np(n)];
            nodes[_np(n, 'old_y')] = nodes[_np(n, 'y')];
          }

          _w.state.step = 5;
          return true;
          break;

        case 5: // Apply forces
          var i = _w.state.index,
              fixed;
          if (_w.p.adjustSizes) {
            var speed = _w.p.speed;
            // If nodes overlap prevention is active,
            // it's not possible to trust the swinging mesure.
            while (i < nIndex.length && i < _w.state.index + sInt) {
              n = _w.nIndex[i];
              fixed = !!nodes[_np(n, 'fixed')] || false;
              if (!fixed) {
                // Adaptive auto-speed: the speed of each node is lowered
                // when the node swings.
                var swinging = nodes[_np(n, 'mass')] * Math.sqrt(  // tweak
                // var swinging = Math.sqrt(
                  (nodes[_np(n, 'old_dx')] - nodes[_np(n, 'dx')]) *
                  (nodes[_np(n, 'old_dx')] - nodes[_np(n, 'dx')]) +
                  (nodes[_np(n, 'old_dy')] - nodes[_np(n, 'dy')]) *
                  (nodes[_np(n, 'old_dy')] - nodes[_np(n, 'dy')])
                );
                var factor = 0.1 * speed / (1 + speed * Math.sqrt(swinging));

                var df = Math.sqrt(Math.pow(nodes[_np(n, 'dx')], 2) +
                         Math.pow(nodes[_np(n, 'dy')], 2));

                factor = Math.min(factor * df, 10) / df;

                nodes[_np(n, 'x')] += nodes[_np(n, 'dx')] * factor;
                nodes[_np(n, 'y')] += nodes[_np(n, 'dy')] * factor;
              }
            }
          } else {
            var speed = _w.p.speed;
            while (i < nIndex.length && i < _w.state.index + sInt) {
              n = _w.nIndex[i];
              fixed = !!nodes[_np(n, 'fixed')] || false;
              if (!fixed) {
                // Adaptive auto-speed: the speed of each node is lowered
                // when the node swings.
                var swinging = nodes[_np(n, 'mass')] * Math.sqrt(  // tweak
                // var swinging = Math.sqrt(
                  (nodes[_np(n, 'old_dx')] - nodes[_np(n, 'dx')]) *
                  (nodes[_np(n, 'old_dx')] - nodes[_np(n, 'dx')]) +
                  (nodes[_np(n, 'old_dy')] - nodes[_np(n, 'dy')]) *
                  (nodes[_np(n, 'old_dy')] - nodes[_np(n, 'dy')])
                );
  //              var factor = speed / (1 + speed * Math.sqrt(swinging));
                var factor = speed / (1 + Math.sqrt(speed * swinging)); // Tweak

                nodes[_np(n, 'x')] += nodes[_np(n, 'dx')] * factor;
                nodes[_np(n, 'y')] += nodes[_np(n, 'dy')] * factor;
              }
            }
          }

          if (i == nIndex.length) {
            _w.state.step = 0;
            _w.state.index = 0;
            return false;
          } else {
            _w.state.index = i;
            return true;
          }
          break;

        default:
          throw 'ForceAtlas2 - atomic state error';
          break;
      }
    }

    /**
     * Force Factory Namespace
     * ------------------------
     */
    var _forceFactory = {
      buildRepulsion: function(adjustBySize, coefficient) {
        if (adjustBySize)
          return new this.linRepulsion_antiCollision(coefficient);
        else
          return new this.linRepulsion(coefficient);
      },
      getStrongGravity: function(coefficient) {
        return new this.strongGravity(coefficient);
      },
      buildAttraction: function(logAttr, distributedAttr, adjustBySize, c) {
        if (adjustBySize) {
          if (logAttr) {
            if (distributedAttr) {
              return new this.logAttraction_degreeDistributed_antiCollision(c);
            } else {
              return new this.logAttraction_antiCollision(c);
            }
          } else {
            if (distributedAttr) {
              return new this.linAttraction_degreeDistributed_antiCollision(c);
            } else {
              return new this.linAttraction_antiCollision(c);
            }
          }
        } else {
          if (logAttr) {
            if (distributedAttr) {
              return new this.logAttraction_degreeDistributed(c);
            } else {
              return new this.logAttraction(c);
            }
          } else {
            if (distributedAttr) {
              return new this.linAttraction_massDistributed(c);
            } else {
              return new this.linAttraction(c);
            }
          }
        }
      },
      linRepulsion: function(coefficient) {
        this.apply_nn = function(n1, n2) {

          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = coefficient *
                         _w.nodes[_np(n1, 'mass')] *
                         _w.nodes[_np(n2, 'mass')] /
                         Math.pow(distance, 2);

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }

        this.apply_nr = function(n, r) {

          // Get the distance
          var xDist = _w.nodes[n] - r.massCenterX,
              yDist = _w.nodes[_np(n, 'y')] - r.massCenterY,
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = coefficient *
                         _w.nodes[_np(n, 'mass')] *
                         r.mass /
                         Math.pow(distance, 2);

            _w.nodes[_np(n, 'dx')] += xDist * factor;
            _w.nodes[_np(n, 'dy')] += yDist * factor;
          }
        }

        this.apply_g = function(n, g) {
          // Get the distance
          var xDist = _w.nodes[n],
              yDist = _w.nodes[_np(n, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = coefficient * _w.nodes[_np(n, 'mass')] * g / distance;

            w.nodes[n] -= xDist * factor;
            w.nodes[_np(n, 'y')] -= yDist * factor;
          }
        }
      },
      linRepulsion_antiCollision: function(coefficient) {
        this.apply_nn = function(n1, n2) {

          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist) -
                         _w.nodes[_np(n1, 'size')] -
                         _w.nodes[_np(n2, 'size')];

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = coefficient *
                         _w.nodes[_np(n1, 'mass')] *
                         _w.nodes[_np(n2, 'mass')] /
                         Math.pow(distance, 2);

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;

          } else if (distance < 0) {
            var factor = 100 * coefficient *
                         w.nodes[_np(n1, 'mass')] *
                         w.nodes[_np(n2, 'mass')];

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }

        this.apply_nr = function(n, r) {

          // Get the distance
          var xDist = _w.nodes[n] - r.massCenterX,
              yDist = _w.nodes[_np(n, 'y')] - r.massCenterY,
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = coefficient *
                         _w.nodes[_np(n, 'mass')] *
                         r.mass /
                         Math.pow(distance, 2);

            _w.nodes[_np(n, 'dx')] += xDist * factor;
            _w.nodes[_np(n, 'dy')] += yDist * factor;
          } else if (distance < 0) {
            var factor = -coefficient *
                         _w.nodes[_np(n, 'mass')] *
                         r.mass /
                         distance;

            _w.nodes[_np(n, 'dx')] += xDist * factor;
            _w.nodes[_np(n, 'dy')] += yDist * factor;
          }
        }

        this.apply_g = function(n, g) {
          // Get the distance
          var xDist = _w.nodes[n],
              yDist = _w.nodes[_np(n, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = coefficient * _w.nodes[_np(n, 'mass')] * g / distance;

            _w.nodes[_np(n, 'dx')] -= xDist * factor;
            _w.nodes[_np(n, 'dy')] -= yDist * factor;
          }
        }
      },
      strongGravity: function(coefficient) {
        this.apply_g = function(n, g) {
          // Get the distance
          var xDist = _w.nodes[n],
              yDist = _w.nodes[_np(n, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = coefficient * _w.nodes[_np(n, 'mass')] * g;

            _w.nodes[_np(n, 'dx')] -= xDist * factor;
            _w.nodes[_np(n, 'dy')] -= yDist * factor;
          }
        }
      },
      linAttraction: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              factor = -coefficient * e;

          _w.nodes[_np(n1, 'dx')] += xDist * factor;
          _w.nodes[_np(n1, 'dy')] += yDist * factor;

          _w.nodes[_np(n2, 'dx')] -= xDist * factor;
          _w.nodes[_np(n2, 'dy')] -= yDist * factor;
        }
      },
      linAttraction_massDistributed: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              factor = -coefficient * e / w.nodes[_np(n1, 'mass')];

          _w.nodes[_np(n1, 'dx')] += xDist * factor;
          _w.nodes[_np(n1, 'dy')] += yDist * factor;

          _w.nodes[_np(n2, 'dx')] -= xDist * factor;
          _w.nodes[_np(n2, 'dy')] -= yDist * factor;
        }
      },
      logAttraction: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = -coefficient *
                         e *
                         Math.log(1 + distance) /
                         distance;

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }
      },
      logAttraction_degreeDistributed: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = -coefficient *
                         e *
                         Math.log(1 + distance) /
                         distance /
                         _w.nodes[_np(n1, 'mass')];

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }
      },
      linAttraction_antiCollision: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = -coefficient * e;

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }
      },
      linAttraction_degreeDistributed_antiCollision: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = -coefficient * e / _w.nodes[_np(n1, 'mass')];

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }
      },
      logAttraction_antiCollision: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = -coefficient *
                         e *
                         Math.log(1 + distance) /
                         distance;

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }
      },
      logAttraction_degreeDistributed_antiCollision: function(coefficient) {
        this.apply_nn = function(n1, n2, e) {
          // Get the distance
          var xDist = _w.nodes[n1] - _w.nodes[n2],
              yDist = _w.nodes[_np(n1, 'y')] - _w.nodes[_np(n2, 'y')],
              distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            // NB: factor = force / distance
            var factor = -coefficient *
                         e *
                         Math.log(1 + distance) /
                         distance /
                         _w.nodes[_np(n1, 'mass')];

            _w.nodes[_np(n1, 'dx')] += xDist * factor;
            _w.nodes[_np(n1, 'dy')] += yDist * factor;

            _w.nodes[_np(n2, 'dx')] -= xDist * factor;
            _w.nodes[_np(n2, 'dy')] -= yDist * factor;
          }
        }
      }
    };

    /**
     * Barnes Hut Region
     * ------------------
     */
    function Region(nodesIndexes, depth) {

      // Properties
      this.depthLimit = 20;
      this.size = 0;
      this.nodes = nodesIndexes;
      this.subregions = [];
      this.depth = depth;

      this.p = {
        mass: 0,
        massCenterX: 0,
        massCenterY: 0
      };

      this.updateMassAndGeometry();
    }

    Region.prototype.updateMassAndGeometry = function() {
      if (this.nodes.length > 1) {
        // Compute Mass
        var mass = 0,
            massSumX = 0,
            massSumY = 0,
            size,
            distance
            curmass,
            i,
            n;

        for (i = 0, l = this.nodes.length; i < l; i++) {
          n = this.nodes[i];

          // Mass
          curmass = _w.nodes[_np(n), 'mass'];
          mass += curmass;
          massSumX += _w.nodes[n] * curmass;
          massSumY += _w.nodes[_np(n), 'y'] * curmass;
        }

        var massCenterX = massSumX / mass,
            massCenterY = massSumY / mass;

        for (i = 0, l = this.nodes.length; i < l; i++) {
          n = this.nodes[i];

          // Size
          distance = Math.sqrt(
            (_w.nodes[n] - massCenterX) *
            (_w.nodes[n] - massCenterX) +
            (_w.nodes[_np(n, 'y')] - massCenterY) *
            (_w.nodes[_np(n, 'y')] - massCenterY)
          );

          size = Math.max(size || (2 * distance), 2 * distance);
        }

        this.p.mass = mass;
        this.p.massCenterX = massCenterX;
        this.p.massCenterY = massCenterY;
        this.size = size;
      }
    };

    Region.prototype.buildSubRegions = function() {
      if (this.nodes.length > 1) {
        var leftNodes = [],
            rightNodes = [],
            subregions = [],
            massCenterX = this.p.massCenterX,
            massCenterY = this.p.massCenterY,
            nextDepth = this.depth + 1,
            nodesColumn,
            nodeLine,
            i,
            j;

        for (i = 0, l = this.nodes.length; i < l; i++) {
          nodesColumn = (_w.nodes[this.nodes[i]] < massCenterX) ?
            (leftNodes) :
            (rightNodes);
          nodesColumn.push(n);
        }

        var tl = [], bl = [], br = [], tr = [];

        for (i = 0, l = leftNodes.length; i < l; i++) {
          nodesLine = (_w.nodes[_np(this.nodes[i], 'y')] < massCenterY) ?
            (tl) :
            (bl);
          nodesLine.push(n);
        }

        for (i = 0, l = rightNodes.length; i < l; i++) {
          nodesLine = (_w.nodes[_np(this.nodes[i], 'y')] < massCenterY) ?
            (tr) :
            (br);
          nodesLine.push(n);
        }

        var todo = [tl, bl, br, tr],
            subregion,
            tab;
        for (i = 0; i < 4; i++) {
          tab = todo[i];

          if (tab.length > 0) {
            if (nextDepth <= this.depthLimit &&
                tab.length < this.nodes.length) {
              subregion = new Region(a, nextDepth);
              subregions.push(subregion);
            } else {
              for (j = 0; j < tab.length; j++) {
                var oneNodeList = [n];
                subregion = Region(oneNodeList, nextDepth);
                subregions.push(subregion);
              }
            }
          }
        }

        this.subregions = subregions;
        for (i = 0, l = this.subregions.length; i < l; i++) {
          this.subregions[i].buildSubRegions();
        }
      }
    };

    Region.prototype.applyForce = function(n, Force, theta) {
      if (this.nodes.length < 2) {
        var regionNode = this.nodes[0];
        Force.apply_nn(n, regionNode);
      } else {
        var distance = Math.sqrt(
          (_w.nodes[n] - this.p.massCenterX) *
          (_w.nodes[n] - this.p.massCenterX) +
          (_w.nodes[_np(n, 'y')] - this.p.massCenterY) *
          (_w.nodes[_np(n, 'y')] - this.p.massCenterY)
        );

        if (distance * theta > this.size) {
          Force.apply_nr(n, this);
        } else {
          for (var i = 0, l = this.subregions.length; i < l; i++) {
            this.subregions[i].applyForce(n, Force, theta);
          }
        }
      }
    };

    /**
     * Message Receiver
     * -----------------
     */
    this.onmessage = function(e) {

      if (e.data.header = 'start') {
        var nodes = new Float64Array(e.data.nodes),
            edges = new Float64Array(e.data.edges);

        _init(nodes, edges, e.data.config);
      }
    };

    /**
     * ForceAtlas2 Defaults
     */
    _w.defaults = {
      linLogMode: false,
      outboundAttractionDistribution: false,
      adjustSizes: false,
      edgeWeightInfluence: 0,
      scalingRatio: 1,
      strongGravityMode: false,
      gravity: 1,
      jitterTolerance: 1,
      barnesHutOptimize: false,
      barnesHutTheta: 1.2,
      speed: 1,
      outboundAttCompensation: 1,
      totalSwinging: 0,
      totalEffectiveTraction: 0,
      speedEfficiency: 1, // tweak
      complexIntervals: 500,
      simpleIntervals: 1000
    };
  };

  /**
   * Exporting
   * ----------
   */
  sigma.prototype.getForceAtlas2Worker = function() {
    return ';(' + Worker.toString() + ').call(this);';
  };
}).call(this);
