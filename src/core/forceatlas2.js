var forceatlas2 = {};

forceatlas2.ForceAtlas2 = function(graph) {
  var self = this;
  this.graph = graph;

  // Behavior
  this.linLogMode = false;
  this.outboundAttractionDistribution = false;
  this.adjustSizes = false;
  this.edgeWeightInfluence = 0;
  // Tuning
  this.scalingRatio = 1;
  this.strongGravityMode = false;
  this.gravity = 1;
  // Performance
  this.jitterTolerance = 1;
  this.barnesHutOptimize = false;
  this.barnesHutTheta = 1.2;

  // Atomizing
  this.state = {step: 0, index: 0};   // The state tracked from one atomic "go" to another
  this.complexIntervals = 10;     // Short interval for costly operations
  this.simpleIntervals = 100;     // Large interval for cheap operations

  // Info
  this.totalSwinging = 0;  // How much irregular movement
  this.totalEffectiveTraction = 0;  // Hom much useful movement

  // other...
  this.speed = 1;
  this.rootRegion;
  this.outboundAttCompensation = 1;

  // Getters & Setters
  this.setLinLogMode = function(x) {
    if (self.state.step == 0) {
      self.linLogMode = x;
      return true;
    }
    return false;
  }
  this.getLinLogMode = function() {
    return linLogMode;
  }
  this.setOutboundAttractionDistribution = function(x) {
    if (self.state.step == 0) {
      self.outboundAttractionDistribution = x;
      return true;
    }
    return false;
  }
  this.getOutboundAttractionDistribution = function() {
    return outboundAttractionDistribution;
  }
  this.setAdjustSizes = function(x) {
    if (self.state.step == 0) {
      self.adjustSizes = x;
      return true;
    }
    return false;
  }
  this.getAdjustSizes = function() {
    return adjustSizes;
  }
  this.setEdgeWeightInfluence = function(x) {
    if (self.state.step == 0) {
      self.edgeWeightInfluence = x;
      return true;
    }
    return false;
  }
  this.getEdgeWeightInfluence = function() {
    return edgeWeightInfluence;
  }
  this.setScalingRatio = function(x) {
    if (self.state.step == 0) {
      self.scalingRatio = x;
      return true;
    }
    return false;
  }
  this.getScalingRatio = function() {
    return scalingRatio;
  }
  this.setStrongGravityMode = function(x) {
    if (self.state.step == 0) {
      self.strongGravityMode = x;
      return true;
    }
    return false;
  }
  this.getStrongGravityMode = function() {
    return strongGravityMode;
  }
  this.setGravity = function(x) {
    if (self.state.step == 0) {
      self.gravity = x;
      return true;
    }
    return false;
  }
  this.getGravity = function() {
    return gravity;
  }
  this.setJitterTolerance = function(x) {
    if (self.state.step == 0) {
      self.jitterTolerance = x;
      return true;
    }
    return false;
  }
  this.getJitterTolerance = function() {
    return jitterTolerance;
  }
  this.setBarnesHutOptimize = function(x) {
    if (self.state.step == 0) {
      self.barnesHutOptimize = x;
      return true;
    }
    return false;
  }
  this.getBarnesHutOptimize = function() {
    return barnesHutOptimize;
  }
  this.setBarnesHutTheta = function(x) {
    if (self.state.step == 0) {
      self.barnesHutTheta = x;
      return true;
    }
    return false;
  }
  this.getBarnesHutTheta = function() {
    return barnesHutTheta;
  }
  // Monitoring
  this.getTotalSwinging = function() {
    return self.totalSwinging;
  }
  this.getTotalEffectiveTraction = function() {
    return self.totalEffectiveTraction;
  }
  this.getTractionPerNode = function() {
    return self.totalEffectiveTraction / graph.nodes.length;
  }

  // Runtime (the ForceAtlas2 itself)
  this.init = function() {
    self.graph.nodes.forEach(function(n) {
      n.fa2 = {
        mass: 1 + n.degree,
        old_dx: 0,
        old_dy: 0,
        dx: 0,
        dy: 0
      };
    });
  }

  this.go = function() {
    while (self.atomicGo()) {}
  }

  this.atomicGo = function() {
    var graph = self.graph;

    switch (self.state.step) {
      case 0: // Pass init
        // Initialise layout data
        graph.nodes.forEach(function(n) {
          n.fa2.mass = 1 + n.degree;
          n.fa2.old_dx = n.fa2.dx;
          n.fa2.old_dy = n.fa2.dx;
          n.fa2.dx = 0;
          n.fa2.dy = 0;
        });

        // If Barnes Hut active, initialize root region
        if (self.barnesHutOptimize) {
          self.rootRegion = forceatlas2.Region(graph.nodes, 0);
          self.rootRegion.buildSubRegions();
        }

        // If outboundAttractionDistribution active, compensate.
        if (self.outboundAttractionDistribution) {
          self.outboundAttCompensation = 0;
          graph.nodes.forEach(function(n) {
            self.outboundAttCompensation += n.fa2.mass;
          });
          self.outboundAttCompensation /= graph.nodes.length;
        }
        self.state.step = 1;
        self.state.index = 0;
        return true;
        break;

      case 1: // Repulsion
        var Repulsion = self.ForceFactory.buildRepulsion(self.adjustSizes, self.scalingRatio);
        if (self.barnesHutOptimize) {
          var rootRegion = self.rootRegion;
          var barnesHutTheta = self.barnesHutTheta; // Pass to the scope of forEach
          for (var i = self.state.index; i < graph.nodes.length && i < self.state.index + self.complexIntervals; i++) {
            var n = graph.nodes[i];
            rootRegion.applyForce(n, Repulsion, barnesHutTheta);
          }
          if (i == graph.nodes.length) {
            self.state.step = 2;
            self.state.index = 0;
          } else {
            self.state.index = i;
          }
        } else {
          for (var i1 = self.state.index; i1 < graph.nodes.length && i1 < self.state.index + self.complexIntervals; i1++) {
            var n1 = graph.nodes[i1];
            graph.nodes.forEach(function(n2,i2) {
              if (i2 < i1) {
                Repulsion.apply_nn(n1, n2);
              }
            });
          }
          if (i1 == graph.nodes.length) {
            self.state.step = 2;
            self.state.index = 0;
          } else {
            self.state.index = i1;
          }
        }
        return true;
        break;

      case 2: // Gravity
        var Gravity = (self.strongGravityMode) ? (self.ForceFactory.getStrongGravity(self.scalingRatio)) : (self.ForceFactory.buildRepulsion(self.adjustSizes, self.scalingRatio));
        // Pass gravity and scalingRatio to the scope of the function
        var gravity = self.gravity,
        scalingRatio = self.scalingRatio;
        for (var i = self.state.index; i < graph.nodes.length && i < self.state.index + self.simpleIntervals; i++) {
          var n = graph.nodes[i];
          Gravity.apply_g(n, gravity / scalingRatio);
        }
        if (i == graph.nodes.length) {
          self.state.step = 3;
          self.state.index = 0;
        } else {
          self.state.index = i;
        }
        return true;
        break;

      case 3: // Attraction
        var Attraction = self.ForceFactory.buildAttraction(self.linLogMode, self.outboundAttractionDistribution, self.adjustSizes, 1 * ((self.outboundAttractionDistribution) ? (self.outboundAttCompensation) : (1)));
        if (self.edgeWeightInfluence == 0) {
          for (var i = self.state.index; i < graph.edges.length && i < self.state.index + self.complexIntervals; i++) {
            var e = graph.edges[i];
            Attraction.apply_nn(e.source, e.target, 1);
          }
        } else if (self.edgeWeightInfluence == 1) {
          for (var i = self.state.index; i < graph.edges.length && i < self.state.index + self.complexIntervals; i++) {
            var e = graph.edges[i];
            Attraction.apply_nn(e.source, e.target, e.weight || 1);
          }
        } else {
          for (var i = self.state.index; i < graph.edges.length && i < self.state.index + self.complexIntervals; i++) {
            var e = graph.edges[i];
            Attraction.apply_nn(e.source, e.target, Math.pow(e.weight || 1, self.edgeWeightInfluence));
          }
        }
        if (i == graph.edges.length) {
          self.state.step = 4;
          self.state.index = 0;
        } else {
          self.state.index = i;
        }
        return true;
        break;

      case 4: // Auto adjust speed
        var totalSwinging = 0;  // How much irregular movement
        var totalEffectiveTraction = 0;  // Hom much useful movement
        graph.nodes.forEach(function(n) {
          var fixed = n.fixed || false;
          if (!fixed) {
            var swinging = Math.sqrt(Math.pow(n.fa2.old_dx - n.fa2.dx, 2) + Math.pow(n.fa2.old_dy - n.fa2.dy, 2));
            totalSwinging += n.fa2.mass * swinging;   // If the node has a burst change of direction, then it's not converging.
            totalEffectiveTraction += n.fa2.mass * 0.5 * Math.sqrt(Math.pow(n.fa2.old_dx + n.fa2.dx, 2) + Math.pow(n.fa2.old_dy + n.fa2.dy, 2));
          }
        });
        self.totalSwinging = totalSwinging;
        self.totalEffectiveTraction = totalEffectiveTraction;
        // We want that swingingMovement < tolerance * convergenceMovement
        var targetSpeed = self.jitterTolerance * self.jitterTolerance * self.totalEffectiveTraction / self.totalSwinging;

        // But the speed shoudn't rise too much too quickly, since it would make the convergence drop dramatically.
        var maxRise = 0.5;   // Max rise: 50%
        self.speed = self.speed + Math.min(targetSpeed - self.speed, maxRise * self.speed);

        // Save old coordinates
        graph.nodes.forEach(function(n) {
          n.old_x = +n.x;
          n.old_y = +n.y;
        });
        self.state.step = 5;
        return true;
        break;

      case 5: // Apply forces
        var i;
        if (self.adjustSizes) {
          var speed = self.speed;
          // If nodes overlap prevention is active, it's not possible to trust the swinging mesure.
          for (i = self.state.index; i < graph.nodes.length && i < self.state.index + self.simpleIntervals; i++) {
            var n = graph.nodes[i];
            var fixed = n.fixed || false;
            if (!fixed) {
              // Adaptive auto-speed: the speed of each node is lowered
              // when the node swings.
              var swinging = Math.sqrt((n.fa2.old_dx - n.fa2.dx) * (n.fa2.old_dx - n.fa2.dx) + (n.fa2.old_dy - n.fa2.dy) * (n.fa2.old_dy - n.fa2.dy));
              var factor = 0.1 * speed / (1 + speed * Math.sqrt(swinging));

              var df = Math.sqrt(Math.pow(n.fa2.dx, 2) + Math.pow(n.fa2.dy, 2));
              factor = Math.min(factor * df, 10) / df;

              n.x += n.fa2.dx * factor;
              n.y += n.fa2.dy * factor;
            }
          }
        } else {
          var speed = self.speed;
          for (i = self.state.index; i < graph.nodes.length && i < self.state.index + self.simpleIntervals; i++) {
            var n = graph.nodes[i];
            var fixed = n.fixed || false;
            if (!fixed) {
              // Adaptive auto-speed: the speed of each node is lowered
              // when the node swings.
              var swinging = Math.sqrt((n.fa2.old_dx - n.fa2.dx) * (n.fa2.old_dx - n.fa2.dx) + (n.fa2.old_dy - n.fa2.dy) * (n.fa2.old_dy - n.fa2.dy));
              var factor = speed / (1 + speed * Math.sqrt(swinging));

              n.x += n.fa2.dx * factor;
              n.y += n.fa2.dy * factor;
            }
          }
        }

        if (i == graph.nodes.length) {
          self.state.step = 0;
          self.state.index = 0;
          return false;
        } else {
          self.state.index = i;
          return true;
        }
        break;

      default:
        //Liste d'instructions;
        throw new Error('ForceAtlas2 - atomic state error');
        break;
    }
  }

  this.end = function() {
    this.graph.nodes.forEach(function(n) {
      n.fa2 = null;
    });
  }

  // Auto Settings
  this.setAutoSettings = function() {
    var graph = this.graph;

    // Tuning
    if (graph.nodes.length >= 100) {
      this.scalingRatio = 2.0;
    } else {
      this.scalingRatio = 10.0;
    }
    this.strongGravityMode = false;
    this.gravity = 1;

    // Behavior
    this.outboundAttractionDistribution = false;
    this.linLogMode = false;
    this.adjustSizes = false;
    this.edgeWeightInfluence = 1;

    // Performance
    if (graph.nodes.length >= 50000) {
      this.jitterTolerance = 10;
    } else if (graph.nodes.length >= 5000) {
      this.jitterTolerance = 1;
    } else {
      this.jitterTolerance = 0.1;
    }
    if (graph.nodes.length >= 1000) {
      this.barnesHutOptimize = true;
    } else {
      this.barnesHutOptimize = false;
    }
    this.barnesHutTheta = 1.2;
  }

  // All the different forces
  this.ForceFactory = {
    buildRepulsion: function(adjustBySize, coefficient) {
      if (adjustBySize) {
        return new this.linRepulsion_antiCollision(coefficient);
      } else {
        return new this.linRepulsion(coefficient);
      }
    },

    getStrongGravity: function(coefficient) {
      return new this.strongGravity(coefficient);
    },

    buildAttraction: function(logAttraction, distributedAttraction, adjustBySize, coefficient) {
      if (adjustBySize) {
        if (logAttraction) {
          if (distributedAttraction) {
            return new this.logAttraction_degreeDistributed_antiCollision(coefficient);
          } else {
            return new this.logAttraction_antiCollision(coefficient);
          }
        } else {
          if (distributedAttraction) {
            return new this.linAttraction_degreeDistributed_antiCollision(coefficient);
          } else {
            return new this.linAttraction_antiCollision(coefficient);
          }
        }
      } else {
        if (logAttraction) {
          if (distributedAttraction) {
            return new this.logAttraction_degreeDistributed(coefficient);
          } else {
            return new this.logAttraction(coefficient);
          }
        } else {
          if (distributedAttraction) {
            return new this.linAttraction_massDistributed(coefficient);
          } else {
            return new this.linAttraction(coefficient);
          }
        }
      }
    },

    // Repulsion force: Linear
    linRepulsion: function(c) {
      this.coefficient = c;
      this.apply_nn = function(n1, n2) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = this.coefficient * n1.fa2.mass * n2.fa2.mass / distance / distance;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }

      this.apply_nr = function(n, r) {
        // Get the distance
        var xDist = n.x - r.getMassCenterX();
        var yDist = n.y - r.getMassCenterY();
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = this.coefficient * n.fa2.mass * r.getMass() / distance / distance;

          n.fa2.dx += xDist * factor;
          n.fa2.dy += yDist * factor;
        }
      }

      this.apply_g = function(n, g) {
        // Get the distance
        var xDist = n.x;
        var yDist = n.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = this.coefficient * n.fa2.mass * g / distance;

          n.fa2.dx -= xDist * factor;
          n.fa2.dy -= yDist * factor;
        }
      }
    },

    linRepulsion_antiCollision: function(c) {
      this.coefficient = c;
      this.apply_nn = function(n1,n2) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist) - n1.size - n2.size;

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = this.coefficient * n1.fa2.mass * n2.fa2.mass / distance / distance;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;

        } else if (distance < 0) {
          var factor = 100 * this.coefficient * n1.fa2.mass * n2.fa2.mass;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }

      this.apply_nr = function(n, r) {
        // Get the distance
        var xDist = n.fa2.x() - r.getMassCenterX();
        var yDist = n.fa2.y() - r.getMassCenterY();
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = this.coefficient * n.fa2.mass * r.getMass() / distance / distance;

          n.fa2.dx += xDist * factor;
          n.fa2.dy += yDist * factor;
        } else if (distance < 0) {
          var factor = -this.coefficient * n.fa2.mass * r.getMass() / distance;

          n.fa2.dx += xDist * factor;
          n.fa2.dy += yDist * factor;
        }
      }

      this.apply_g = function(n, g) {
        // Get the distance
        var xDist = n.x;
        var yDist = n.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = this.coefficient * n.fa2.mass * g / distance;

          n.fa2.dx -= xDist * factor;
          n.fa2.dy -= yDist * factor;
        }
      }
    },

    // Repulsion force: Strong Gravity (as a Repulsion Force because it is easier)
    strongGravity: function(c) {
      this.coefficient = c;
      this.apply_nn = function(n1,n2) {
        // Not Relevant
      }
      this.apply_nr = function(n, r) {
        // Not Relevant
      }

      this.apply_g = function(n, g) {
        // Get the distance
        var xDist = n.x;
        var yDist = n.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = this.coefficient * n.fa2.mass * g;

          n.fa2.dx -= xDist * factor;
          n.fa2.dy -= yDist * factor;
        }
      }
    },

    // Attraction force: Linear
    linAttraction: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;

        // NB: factor = force / distance
        var factor = -this.coefficient * e;

        n1.fa2.dx += xDist * factor;
        n1.fa2.dy += yDist * factor;

        n2.fa2.dx -= xDist * factor;
        n2.fa2.dy -= yDist * factor;
      }
    },


    // Attraction force: Linear, distributed by mass (typically, degree)
    linAttraction_massDistributed: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;

        // NB: factor = force / distance
        var factor = -this.coefficient * e / n1.fa2.mass;

        n1.fa2.dx += xDist * factor;
        n1.fa2.dy += yDist * factor;

        n2.fa2.dx -= xDist * factor;
        n2.fa2.dy -= yDist * factor;
      }
    },


    // Attraction force: Logarithmic
    logAttraction: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = -this.coefficient * e * Math.log(1 + distance) / distance;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }
    },


    // Attraction force: Linear, distributed by Degree
    logAttraction_degreeDistributed: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = -this.coefficient * e * Math.log(1 + distance) / distance / n1.fa2.mass;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }
    },


    // Attraction force: Linear, with Anti-Collision
    linAttraction_antiCollision: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = -this.coefficient * e;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }
    },


    // Attraction force: Linear, distributed by Degree, with Anti-Collision
    linAttraction_degreeDistributed_antiCollision: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = -this.coefficient * e / n1.fa2.mass;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }
    },


    // Attraction force: Logarithmic, with Anti-Collision
    logAttraction_antiCollision: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = -this.coefficient * e * Math.log(1 + distance) / distance;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }
    },


    // Attraction force: Linear, distributed by Degree, with Anti-Collision
    logAttraction_degreeDistributed_antiCollision: function(c) {
      this.coefficient = c;

      this.apply_nn = function(n1, n2, e) {
        // Get the distance
        var xDist = n1.x - n2.x;
        var yDist = n1.y - n2.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);

        if (distance > 0) {
          // NB: factor = force / distance
          var factor = -this.coefficient * e * Math.log(1 + distance) / distance / n1.fa2.mass;

          n1.fa2.dx += xDist * factor;
          n1.fa2.dy += yDist * factor;

          n2.fa2.dx -= xDist * factor;
          n2.fa2.dy -= yDist * factor;
        }
      }
    }
  };
};

// The Region class, as used by the Barnes Hut optimization
forceatlas2.Region = function(nodes, depth) {
  this.depthLimit = 20;
  this.mass = 0;
  this.massCenterX = 0;
  this.massCenterY = 0;
  this.size = 0;
  this.nodes = nodes;
  this.subregions = [];
  this.depth = depth;

  this.updateMassAndGeometry = function() {
    if (this.nodes.length > 1) {
      // Compute Mass
      var mass = 0;
      var massSumX = 0;
      var massSumY = 0;
      this.nodes.forEach(function(n) {
        mass += n.fa2.mass;
        massSumX += n.x * n.fa2.mass;
        massSumY += n.y * n.fa2.mass;
      });
      var massCenterX = massSumX / mass;
      massCenterY = massSumY / mass;

      // Compute size
      var size = -10000000000;
      this.nodes.forEach(function(n) {
        var distance = Math.sqrt((n.x - massCenterX) * (n.x - massCenterX) + (n.y - massCenterY) * (n.y - massCenterY));
        size = Math.max(size, 2 * distance);
      });

      this.mass = mass;
      this.massCenterX = massCenterX;
      this.massCenterY = massCenterY;
      this.size = size;
    }
  }

  this.updateMassAndGeometry();

  this.buildSubRegions = function() {
    if (this.nodes.length > 1) {
      var leftNodes = [];
      var rightNodes = [];
      var subregions = [];
      var massCenterX = this.massCenterX;
      var massCenterY = this.massCenterY;
      var nextDepth = this.depth + 1;

      this.nodes.forEach(function(n) {
        var nodesColumn = (n.x < massCenterX) ? (leftNodes) : (rightNodes);
        nodesColumn.push(n);
      });

      var topleftNodes = [];
      var bottomleftNodes = [];
      leftNodes.forEach(function(n) {
        var nodesLine = (n.y < massCenterY) ? (topleftNodes) : (bottomleftNodes);
        nodesLine.push(n);
      });

      var bottomrightNodes = [];
      var toprightNodes = [];
      rightNodes.forEach(function(n) {
        var nodesLine = (n.y < massCenterY) ? (toprightNodes) : (bottomrightNodes);
        nodesLine.push(n);
      });

      if (topleftNodes.length > 0) {
        if (nextDepth <= this.depthLimit && topleftNodes.length < this.nodes.length) {
          var subregion = forceatlas2.Region(topleftNodes, nextDepth);
          subregions.push(subregion);
        } else {
          topleftNodes.forEach(function(n) {
            var oneNodeList = [n];
            var subregion = forceatlas2.Region(oneNodeList, nextDepth);
            subregions.push(subregion);
          });
        }
      }

      if (bottomleftNodes.length > 0) {
        if (nextDepth <= this.depthLimit && bottomleftNodes.length < this.nodes.length) {
          var subregion = forceatlas2.Region(bottomleftNodes, nextDepth);
          subregions.push(subregion);
        } else {
          bottomleftNodes.forEach(function(n) {
            var oneNodeList = [n];
            var subregion = forceatlas2.Region(oneNodeList, nextDepth);
            subregions.push(subregion);
          });
        }
      }
      if (bottomrightNodes.length > 0) {
        if (nextDepth <= this.depthLimit && bottomrightNodes.length < this.nodes.length) {
          var subregion = forceatlas2.Region(bottomrightNodes, nextDepth);
          subregions.push(subregion);
        } else {
          bottomrightNodes.forEach(function(n) {
            var oneNodeList = [n];
            var subregion = forceatlas2.Region(oneNodeList, nextDepth);
            subregions.push(subregion);
          });
        }
      }
      if (toprightNodes.length > 0) {
        if (nextDepth <= this.depthLimit && toprightNodes.length < this.nodes.length) {
          var subregion = forceatlas2.Region(toprightNodes, nextDepth);
          subregions.push(subregion);
        } else {
          toprightNodes.forEach(function(n) {
            var oneNodeList = [n];
            var subregion = forceatlas2.Region(oneNodeList, nextDepth);
            subregions.push(subregion);
          });
        }
      }

      this.subregions = subregions;

      subregions.forEach(function(subregion) {
        subregion.buildSubRegions();
      });
    }
  }

  this.applyForce = function(n, Force, theta) {
    if (this.nodes.length < 2) {
      var regionNode = this.nodes[0];
      Force.apply_nn(n, regionNode);
    } else {
      var distance = Math.sqrt((n.x - this.massCenterX) * (n.x - this.massCenterX) + (n.y - this.massCenterY) * (n.y - this.massCenterY));
      if (distance * theta > this.size) {
        Force.apply_nr(n, this);
      } else {
        this.subregions.forEach(function(subregion) {
          subregion.applyForce(n, Force, theta);
        });
      }
    }
  }

  this.getMass = function() {
    return this.mass;
  }

  this.setMass = function(mass) {
    this.mass = mass;
  }

  this.getMassCenterX = function() {
    return this.massCenterX;
  }

  this.setMassCenterX = function(massCenterX) {
    this.massCenterX = massCenterX;
  }

  this.getMassCenterY = function() {
    return this.massCenterY;
  }

  this.setMassCenterY = function(massCenterY) {
    this.massCenterY = massCenterY;
  }
};
