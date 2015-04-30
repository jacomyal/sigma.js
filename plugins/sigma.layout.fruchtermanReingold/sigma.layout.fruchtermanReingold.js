;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw new Error('sigma is not declared');

  // Initialize package:
  sigma.utils.pkg('sigma.layouts.fruchtermanReingold');

  /**
   * Sigma Fruchterman-Reingold
   * ===============================
   *
   * Author: Sébastien Heymann @ Linkurious
   * Version: 0.1
   */


  var settings = {
    autoArea: true,
    area: 1,
    gravity: 10,
    speed: 0.1,
    iterations: 1000
  };

  var _instance = {};


  /**
   * Event emitter Object
   * ------------------
   */
  var _eventEmitter = {};


  /**
   * Fruchterman Object
   * ------------------
   */
  function FruchtermanReingold() {
    var self = this;

    this.init = function (sigInst, options) {
      options = options || {};

      // Properties
      this.sigInst = sigInst;
      this.config = sigma.utils.extend(options, settings);
      this.easing = options.easing;
      this.duration = options.duration;

      if (!sigma.plugins || typeof sigma.plugins.animate === 'undefined') {
        throw new Error('sigma.plugins.animate is not declared');
      }

      // State
      this.started = false;
      this.running = false;
    };

    this.atomicGo = function () {
      if (!this.running || this.iterCount < 1) return false;

      var nodes = this.sigInst.graph.nodes(),
          edges = this.sigInst.graph.edges(),
          i,
          j,
          n,
          n2,
          e,
          xDist,
          yDist,
          dist,
          repulsiveF,
          nodesCount = nodes.length,
          edgesCount = edges.length;

      this.config.area = this.config.autoArea ? (nodesCount * nodesCount) : this.config.area;
      this.iterCount--;
      this.running = (this.iterCount > 0);

      var maxDisplace = Math.sqrt(this.config.area) / 10,
          k = Math.sqrt(this.config.area / (1 + nodesCount));

      for (i = 0; i < nodesCount; i++) {
        n = nodes[i];

        // Init
        if (!n.fr) {
          n.fr_x = n.x;
          n.fr_y = n.y;
          n.fr = {
            dx: 0,
            dy: 0
          };
        }

        for (j = 0; j < nodesCount; j++) {
          n2 = nodes[j];

          // Repulsion force
          if (n.id != n2.id) {
            xDist = n.fr_x - n2.fr_x;
            yDist = n.fr_y - n2.fr_y;
            dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.01;
            // var dist = Math.sqrt(xDist * xDist + yDist * yDist) - n1.size - n2.size;

            if (dist > 0) {
              repulsiveF = k * k / dist;
              n.fr.dx += xDist / dist * repulsiveF;
              n.fr.dy += yDist / dist * repulsiveF;
            }
          }
        }
      }

      var nSource,
          nTarget,
          attractiveF;

      for (i = 0; i < edgesCount; i++) {
        e = edges[i];

        // Attraction force
        nSource = self.sigInst.graph.nodes(e.source);
        nTarget = self.sigInst.graph.nodes(e.target);

        xDist = nSource.fr_x - nTarget.fr_x;
        yDist = nSource.fr_y - nTarget.fr_y;
        dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.01;
        // dist = Math.sqrt(xDist * xDist + yDist * yDist) - nSource.size - nTarget.size;
        attractiveF = dist * dist / k;

        if (dist > 0) {
          nSource.fr.dx -= xDist / dist * attractiveF;
          nSource.fr.dy -= yDist / dist * attractiveF;
          nTarget.fr.dx += xDist / dist * attractiveF;
          nTarget.fr.dy += yDist / dist * attractiveF;
        }
      }

      var d,
          gf,
          limitedDist;

      for (i = 0; i < nodesCount; i++) {
        n = nodes[i];

        // Gravity
        d = Math.sqrt(n.fr_x * n.fr_x + n.fr_y * n.fr_y);
        gf = 0.01 * k * self.config.gravity * d;
        n.fr.dx -= gf * n.fr_x / d;
        n.fr.dy -= gf * n.fr_y / d;

        // Speed
        n.fr.dx *= self.config.speed;
        n.fr.dy *= self.config.speed;

        // Apply computed displacement
        if (!n.fixed) {
          xDist = n.fr.dx;
          yDist = n.fr.dy;
          dist = Math.sqrt(xDist * xDist + yDist * yDist);

          if (dist > 0) {
            limitedDist = Math.min(maxDisplace * self.config.speed, dist);
            n.fr_x += xDist / dist * limitedDist;
            n.fr_y += yDist / dist * limitedDist;
          }
        }
      }

      return this.running;
    };

    this.go = function () {
      this.iterCount = this.config.iterations;

      while (this.running) {
        this.atomicGo();
      };

      this.stop();
    };

    this.start = function() {
      if (this.running) return;

      var nodes = this.sigInst.graph.nodes();

      this.running = true;

      if (!this.started) {
        // Init nodes
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].fr_x = nodes[i].x;
          nodes[i].fr_y = nodes[i].y;
          nodes[i].fr = {
            dx: 0,
            dy: 0
          };
        }
        this.started = true;
        _eventEmitter[self.sigInst.id].dispatchEvent('start');
        this.go();
      }
    };

    this.stop = function() {
      var nodes = this.sigInst.graph.nodes();

      this.running = false;
      _eventEmitter[self.sigInst.id].dispatchEvent('stop');

      if (this.easing) {
        _eventEmitter[self.sigInst.id].dispatchEvent('interpolate');
        sigma.plugins.animate(
          self.sigInst,
          {
            x: 'fr_x',
            y: 'fr_y'
          },
          {
            easing: self.easing,
            onComplete: function() {
              self.sigInst.refresh();
              for (var i = 0; i < nodes.length; i++) {
                nodes[i].fr = null;
                nodes[i].fr_x = null;
                nodes[i].fr_y = null;
              }
              _eventEmitter[self.sigInst.id].dispatchEvent('stop');
            },
            duration: self.duration
          }
        );
      }
      else {
        // Apply changes
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].x = nodes[i].fr_x;
          nodes[i].y = nodes[i].fr_y;
        }

        this.sigInst.refresh();

        for (var i = 0; i < nodes.length; i++) {
          nodes[i].fr = null;
          nodes[i].fr_x = null;
          nodes[i].fr_y = null;
        }
      }
    };

    this.kill = function() {
      this.sigInst = null;
      this.config = null;
      this.easing = null;
    };
  };



  /**
   * Interface
   * ----------
   */

  sigma.layouts.fruchtermanReingold.configure = function(sigInst, config) {

    // Create instance if undefined
    if (!_instance[sigInst.id]) {
      _instance[sigInst.id] = new FruchtermanReingold();

      _eventEmitter[sigInst.id] = {};
      sigma.classes.dispatcher.extend(_eventEmitter[sigInst.id]);

      // Binding on kill to clear the references
      sigInst.bind('kill', function() {
        _instance[sigInst.id].kill();
        _eventEmitter[sigInst.id] = null;
      });
    }

    _instance[sigInst.id].init(sigInst, config);

    return _eventEmitter[sigInst.id];
  };

  sigma.layouts.fruchtermanReingold.start = function(sigInst, config) {

    if (config) {
      this.configure(sigInst, config);
    }

    _instance[sigInst.id].start();

    return _eventEmitter[sigInst.id];
  };

  sigma.layouts.fruchtermanReingold.isRunning = function(sigInst) {
    return !!_instance[sigInst.id] && _instance[sigInst.id].running;
  };

  sigma.layouts.fruchtermanReingold.progress = function(sigInst) {
    return (_instance[sigInst.id].config.iterations - _instance[sigInst.id].iterCount) /
      _instance[sigInst.id].config.iterations;
  };
}).call(this);
