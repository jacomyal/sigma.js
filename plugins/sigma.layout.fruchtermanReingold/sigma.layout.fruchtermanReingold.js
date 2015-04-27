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
    maxIterations: 1000
  };

  /**
   * Event emitter Object
   * ------------------
   */
  var eventEmitter = {};
  sigma.classes.dispatcher.extend(eventEmitter);

  /**
   * Fruchterman Object
   * ------------------
   */
  function FruchtermanReingold() {
  };

  FruchtermanReingold.prototype.init = function (sigInst, options) {
    options = options || {};

    // Properties
    this.sigInst = sigInst;
    this.graph = this.sigInst.graph;
    this.config = sigma.utils.extend(options, settings);
    this.easing = options.easing;
    this.duration = options.duration;

    if (!sigma.plugins || typeof sigma.plugins.animate === 'undefined')
      throw new Error('sigma.plugins.animate is not declared');

    // State
    this.started = false;
    this.running = false;

    // Binding on kill to properly terminate layout when parent is killed
    this.sigInst.bind('kill', function() {
      eventEmitter = {};
      sigma.classes.dispatcher.extend(eventEmitter);
      sigma.layouts.fruchterman.stop();
    });
  };

  FruchtermanReingold.prototype.atomicGo = function () {
    if (!this.running || this.iterCount < 1) return false;

    var self = this,
        nodes = this.graph.nodes(),
        edges = this.graph.edges(),
        i,
        j,
        n,
        n2,
        e,
        nodesCount = nodes.length,
        edgesCount = edges.length;

    this.config.area = this.config.autoArea ? (nodesCount * nodesCount) : this.config.area;
    this.iterCount--;
    this.running = (this.iterCount > 0);

    var maxDisplace = Math.sqrt(this.config.area) / 10;
    var k = Math.sqrt(this.config.area / (1 + nodesCount));

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
          var xDist = n.fr_x - n2.fr_x;
          var yDist = n.fr_y - n2.fr_y;
          var dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.05;
          // var dist = Math.sqrt(xDist * xDist + yDist * yDist) - n1.size - n2.size;

          if (dist > 0) {
            var repulsiveF = k * k / dist;
            n.fr.dx += xDist / dist * repulsiveF;
            n.fr.dy += yDist / dist * repulsiveF;
          }
        }
      }
    }

    for (i = 0; i < edgesCount; i++) {
      e = edges[i];

      // Attraction force
      var nf = self.graph.nodes(e.source);
      var nt = self.graph.nodes(e.target);
      var xDist = nf.fr_x - nt.fr_x;
      var yDist = nf.fr_y - nt.fr_y;
      var dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.05;
      // var dist = Math.sqrt(xDist * xDist + yDist * yDist) - nf.size - nt.size;
      var attractiveF = dist * dist / k;

      if (dist > 0) {
        nf.fr.dx -= xDist / dist * attractiveF;
        nf.fr.dy -= yDist / dist * attractiveF;
        nt.fr.dx += xDist / dist * attractiveF;
        nt.fr.dy += yDist / dist * attractiveF;
      }
    }

    for (i = 0; i < nodesCount; i++) {
      n = nodes[i];

      // Gravity
      var d = Math.sqrt(n.fr_x * n.fr_x + n.fr_y * n.fr_y);
      var gf = 0.01 * k * self.config.gravity * d;
      n.fr.dx -= gf * n.fr_x / d;
      n.fr.dy -= gf * n.fr_y / d;

      // Speed
      n.fr.dx *= self.config.speed;
      n.fr.dy *= self.config.speed;

      // Apply computed displacement
      if (!n.fixed) {
        var xDist = n.fr.dx;
        var yDist = n.fr.dy;
        var dist = Math.sqrt(xDist * xDist + yDist * yDist);

        if (dist > 0) {
          var limitedDist = Math.min(maxDisplace * self.config.speed, dist);
          n.fr_x += xDist / dist * limitedDist;
          n.fr_y += yDist / dist * limitedDist;
        }
      }
    }

    return this.running;
  };

  FruchtermanReingold.prototype.go = function () {
    this.iterCount = this.config.maxIterations;

    while (this.running) {
      this.atomicGo();
    };

    this.stop();
  };

  FruchtermanReingold.prototype.start = function() {
    if (this.running) return;

    var nodes = this.graph.nodes();

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
      eventEmitter.dispatchEvent('start');
      this.go();
    }
  };

  FruchtermanReingold.prototype.stop = function() {
    var self = this,
        nodes = this.graph.nodes();

    this.running = false;
    eventEmitter.dispatchEvent('stop');

    if (this.easing) {
      eventEmitter.dispatchEvent('interpolate');
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
            eventEmitter.dispatchEvent('stop');
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

  /**
   * Interface
   * ----------
   */
  var instance = null;

  sigma.layouts.fruchtermanReingold.configure = function(sigInst, config) {

    // Create fruchterman if undefined
    if (!instance) {
      instance = new FruchtermanReingold();
    }

    instance.init(sigInst, config);

    return eventEmitter;
  };

  sigma.layouts.fruchtermanReingold.start = function(sigInst, config) {

    if (sigInst) {
      this.configure(sigInst, config);
    }

    instance.start();

    return eventEmitter;
  };

  sigma.layouts.fruchtermanReingold.isRunning = function() {
    return !!instance && instance.running;
  };

  sigma.layouts.fruchtermanReingold.progress = function() {
    return (instance.config.maxIterations - instance.iterCount) / instance.config.maxIterations;
  };
}).call(this);
