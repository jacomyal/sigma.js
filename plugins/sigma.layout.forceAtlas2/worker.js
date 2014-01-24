;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma ForceAtlas2 Webworker
   * ============================
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Algorithm author: Mathieu Jacomy @ Sciences Po Medialab & WebAtlas
   * Version: 0.1
   */

  /**
   * Worker Function Wrapper
   * ------------------------
   *
   * The worker has to been wrapped into a single stringified function
   * to be passed afterwards as a BLOB object to the supervisor.
   */

  var _wrapper = function() {
    var _this = this;

    // Helpers Namespace
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

    function _np(i, prop) {
      switch (prop) {
        case 'dy':
          return i + 1;
          break;
        case 'old_dx':
          return i + 2;
          break;
        case 'old_dy':
          return i + 3;
          break;
        case 'size':
          return i + 4;
        case 'degree':
        case 'mass':
          return i + 5;
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

    // Default Configuration
    var _defaults = {
      autoSettings: true,
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
      complexIntervals: 500,
      simpleIntervals: 1000
    };

    // Worker State
    this.state = {step: 0, index: 0};

    // Mesage Receiver
    this.onmessage = function(e) {
      this.p = _helpers.extend(
        e.data.config || {},
        _defaults
      );
          
      this.nodes = new Float64Array(e.data.nodes);
      this.edges = new Float64Array(e.data.edges);
    };

    // Algorithm run
    this.atomicGo = function() {
      var i,
          n,
          e,
          l,
          fixed,
          swinging,
          factor,
          graph = _this.graph,
          nIndex = graph.nodes,
          eIndex = graph.edges,
          nodes = nIndex(),
          edges = eIndex(),
          cInt = this.p.complexIntervals,
          sInt = this.p.simpleIntervals;

      switch (_this.state.step) {
        // Pass init
        case 0:
          // Initialise layout data
          for (i = 0, l = nodes.length; i < l; i++) {
            n = nodes[i];
            if (n.fa2)
              n.fa2 = {
                mass: 1 + _this.graph.degree(n.id),
                old_dx: n.fa2.dx || 0,
                old_dy: n.fa2.dy || 0,
                dx: 0,
                dy: 0
              };
            else
              n.fa2 = {
                mass: 1 + _this.graph.degree(n.id),
                old_dx: 0,
                old_dy: 0,
                dx: 0,
                dy: 0
              };
          }

          // If Barnes Hut is active, initialize root region
          if (_this.p.barnesHutOptimize) {
            _this.rootRegion = new forceatlas2.Region(nodes, 0);
            _this.rootRegion.buildSubRegions();
          }

          // If outboundAttractionDistribution active, compensate.
          if (_this.p.outboundAttractionDistribution) {
            _this.p.outboundAttCompensation = 0;
            for (i = 0, l = nodes.length; i < l; i++) {
              n = nodes[i];
              _this.p.outboundAttCompensation += n.fa2.mass;
            }
            _this.p.outboundAttCompensation /= nodes.length;
          }

          _this.state.step = 1;
          _this.state.index = 0;
          return true;

         // Repulsion
        case 1:
          var n1,
              n2,
              i1,
              i2,
              rootRegion,
              barnesHutTheta,
              Repulsion = _this.ForceFactory.buildRepulsion(
                _this.p.adjustSizes,
                _this.p.scalingRatio
              );

          if (_this.p.barnesHutOptimize) {
            rootRegion = _this.rootRegion;

            // Pass to the scope of forEach
            barnesHutTheta = _this.p.barnesHutTheta;
            i = _this.state.index;

            while (i < nodes.length && i < _this.state.index + cInt)
              if ((n = nodes[i++]).fa2)
                rootRegion.applyForce(n, Repulsion, barnesHutTheta);

            if (i === nodes.length)
              _this.state = {
                step: 2,
                index: 0
              };
            else
              _this.state.index = i;
          } else {
            i1 = _this.state.index;

            while (i1 < nodes.length && i1 < _this.state.index + cInt)
              if ((n1 = nodes[i1++]).fa2)
                for (i2 = 0; i2 < i1; i2++)
                  if ((n2 = nodes[i2]).fa2)
                    Repulsion.apply_nn(n1, n2);

            if (i1 === nodes.length)
              _this.state = {
                step: 2,
                index: 0
              };
            else
              _this.state.index = i1;
          }
          return true;

         // Gravity
        case 2:
          var Gravity =
            _this.p.strongGravityMode ?
              _this.ForceFactory.getStrongGravity(
                _this.p.scalingRatio
              ) :
              _this.ForceFactory.buildRepulsion(
                _this.p.adjustSizes,
                _this.p.scalingRatio
              ),
            // Pass gravity and scalingRatio to the scope of the function
            gravity = _this.p.gravity,
            scalingRatio = _this.p.scalingRatio;

          i = _this.state.index;
          while (i < nodes.length && i < _this.state.index + sInt) {
            n = nodes[i++];
            if (n.fa2)
              Gravity.apply_g(n, gravity / scalingRatio);
          }

          if (i === nodes.length)
            _this.state = {
              step: 3,
              index: 0
            };
          else
            _this.state.index = i;
          return true;

        // Attraction
        case 3:
          var Attraction = _this.ForceFactory.buildAttraction(
                _this.p.linLogMode,
                _this.p.outboundAttractionDistribution,
                _this.p.adjustSizes,
                _this.p.outboundAttractionDistribution ?
                  _this.p.outboundAttCompensation :
                  1
              );

          i = _this.state.index;
          if (_this.p.edgeWeightInfluence === 0)
            while (i < edges.length && i < _this.state.index + cInt) {
              e = edges[i++];
              Attraction.apply_nn(nIndex(e.source), nIndex(e.target), 1);
            }
          else if (_this.p.edgeWeightInfluence === 1)
            while (i < edges.length && i < _this.state.index + cInt) {
              e = edges[i++];
              Attraction.apply_nn(
                nIndex(e.source),
                nIndex(e.target),
                e.weight || 1
              );
            }
          else
            while (i < edges.length && i < _this.state.index + cInt) {
              e = edges[i++];
              Attraction.apply_nn(
                nIndex(e.source), nIndex(e.target),
                Math.pow(e.weight || 1, _this.p.edgeWeightInfluence)
              );
            }

          if (i === edges.length)
            _this.state = {
              step: 4,
              index: 0
            };
          else
            _this.state.index = i;

          return true;

        // Auto adjust speed
        case 4:
          var maxRise,
              targetSpeed,
              totalSwinging = 0, // How much irregular movement
              totalEffectiveTraction = 0; // Hom much useful movement

          for (i = 0, l = nodes.length; i < l; i++) {
            n = nodes[i];

            fixed = n.fixed || false;
            if (!fixed && n.fa2) {
              swinging =
                Math.sqrt(Math.pow(n.fa2.old_dx - n.fa2.dx, 2) +
                Math.pow(n.fa2.old_dy - n.fa2.dy, 2));

              // If the node has a burst change of direction,
              // then it's not converging.
              totalSwinging += n.fa2.mass * swinging;
              totalEffectiveTraction += n.fa2.mass *
                0.5 *
                Math.sqrt(
                  Math.pow(n.fa2.old_dx + n.fa2.dx, 2) +
                  Math.pow(n.fa2.old_dy + n.fa2.dy, 2)
                );
            }
          }

          _this.p.totalSwinging = totalSwinging;
          _this.p.totalEffectiveTraction = totalEffectiveTraction;

          // We want that swingingMovement < tolerance * convergenceMovement
          targetSpeed =
            Math.pow(_this.p.jitterTolerance, 2) *
            _this.p.totalEffectiveTraction /
            _this.p.totalSwinging;

          // But the speed shoudn't rise too much too quickly,
          // since it would make the convergence drop dramatically.
          // Max rise: 50%
          maxRise = 0.5;
          _this.p.speed =
            _this.p.speed +
            Math.min(
              targetSpeed - _this.p.speed,
              maxRise * _this.p.speed
            );

          // Save old coordinates
          for (i = 0, l = nodes.length; i < l; i++) {
            n = nodes[i];
            n.old_x = +n.x;
            n.old_y = +n.y;
          }

          _this.state.step = 5;
          return true;

        // Apply forces
        case 5:
          var df,
              speed;

          i = _this.state.index;
          if (_this.p.adjustSizes) {
            speed = _this.p.speed;
            // If nodes overlap prevention is active,
            // it's not possible to trust the swinging mesure.
            while (i < nodes.length && i < _this.state.index + sInt) {
              n = nodes[i++];
              fixed = n.fixed || false;
              if (!fixed && n.fa2) {
                // Adaptive auto-speed: the speed of each node is lowered
                // when the node swings.
                swinging = Math.sqrt(
                  (n.fa2.old_dx - n.fa2.dx) *
                  (n.fa2.old_dx - n.fa2.dx) +
                  (n.fa2.old_dy - n.fa2.dy) *
                  (n.fa2.old_dy - n.fa2.dy)
                );
                factor = 0.1 * speed / (1 + speed * Math.sqrt(swinging));

                df =
                  Math.sqrt(Math.pow(n.fa2.dx, 2) +
                  Math.pow(n.fa2.dy, 2));

                factor = Math.min(factor * df, 10) / df;

                n.x += n.fa2.dx * factor;
                n.y += n.fa2.dy * factor;
              }
            }
          } else {
            speed = _this.p.speed;
            while (i < nodes.length && i < _this.state.index + sInt) {
              n = nodes[i++];
              fixed = n.fixed || false;
              if (!fixed && n.fa2) {
                // Adaptive auto-speed: the speed of each node is lowered
                // when the node swings.
                swinging = Math.sqrt(
                  (n.fa2.old_dx - n.fa2.dx) *
                  (n.fa2.old_dx - n.fa2.dx) +
                  (n.fa2.old_dy - n.fa2.dy) *
                  (n.fa2.old_dy - n.fa2.dy)
                );

                factor = speed / (1 + speed * Math.sqrt(swinging));

                n.x += n.fa2.dx * factor;
                n.y += n.fa2.dy * factor;
              }
            }
          }

          if (i === nodes.length) {
            _this.state = {
              step: 0,
              index: 0
            };
            return false;
          } else {
            _this.state.index = i;
            return true;
          }
          break;

        default:
          throw new Error('ForceAtlas2 - atomic state error');
      }
    };
  };

  /**
   * Exporting
   * ----------
   */

  sigma.prototype.getForceAtlas2Worker = function() {
    return ';(' + _wrapper.toString() + ').call(this);';
  };
}).call(this);
