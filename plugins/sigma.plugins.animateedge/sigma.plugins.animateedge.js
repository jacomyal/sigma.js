/**
 * This plugin provides a method to animate a sigma instance by interpolating
 * some edge properties. Check the sigma.plugins.animateedge function doc or the
 * examples/animateedge.html code sample to know more.
 * [Hamid Maadani](https://github.com/21stcaveman) Based on animate plugin by [Alexis Jacomy](https://github.com/jacomyal)
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.plugins');

  var _id = 0,
      _cache = {};

  /**
   * This function will animate some specified edge properties. It will
   * basically call requestAnimationFrame, interpolate the values and call the
   * refresh method during a specified duration.
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the settings
   * object:
   *
   *   {?(function|string)} easing     Either the name of an easing in the
   *                                   sigma.utils.easings package or a
   *                                   function. If not specified, the
   *                                   quadraticInOut easing from this package
   *                                   will be used instead.
   *   {?number}            duration   The duration of the animation. If not
   *                                   specified, the "animationsTime" setting
   *                                   value of the sigma instance will be used
   *                                   instead.
   *   {?function}          onComplete Eventually a function to call when the
   *                                   animation is ended.
   *
   *   {?function}          onStep     A function to call after each step.
   *
   * @param  {sigma}   s       The related sigma instance.
   * @param  {object}  animate An hash with the keys being the edge properties
   *                           to interpolate, and the values being the related
   *                           target values.
   * @param  {?object} options Eventually an object with options.
   */
  sigma.plugins.animateedge = function(s, animate, options) {
    var o = options || {},
        id = ++_id,
        duration = o.duration || s.settings('animationsTime'),
	hold = !!o.hold,
        easing = typeof o.easing === 'string' ?
          sigma.utils.easings[o.easing] :
          typeof o.easing === 'function' ?
          o.easing :
          sigma.utils.easings.quadraticOut,
        start = sigma.utils.dateNow(),
        // Store initial positions:
        startPositions = s.graph.edges().reduce(function(res, edge) {
          var k;
          res[edge.id] = {};
	  if (o.edges.indexOf(edge.id) >= 0)
           for (k in animate)
            if (k in edge)
              res[edge.id][k] = edge[k];
          return res;
        }, {});

    s.animations = s.animations || Object.create({});
    sigma.plugins.kill(s);

    // Do not refresh edgequadtree during drag:
    var k,
        c;
    for (k in s.cameras) {
      c = s.cameras[k];
      c.edgequadtree._enabled = false;
    }

    function step() {
      var p = (sigma.utils.dateNow() - start) / duration;

      if (p >= 1) {
        s.graph.edges().forEach(function(edge) {
	if (o.edges.indexOf(edge.id) >= 0)
          for (var k in animate)
            if (k in animate) 
              edge[k] = ((hold) ? animate[k] : startPositions[edge.id][k]);
        });

       // Allow to refresh edgequadtree:
        var k,
            c;
        for (k in s.cameras) {
          c = s.cameras[k];
          c.edgequadtree._enabled = true;
        }

        s.refresh();
	if (typeof o.onComplete === 'function')
      		o.onComplete();
      } else {
        p = easing(p);
 
	s.graph.edges().forEach(function(edge) {
	if (o.edges.indexOf(edge.id) >= 0) {
          for (var k in animate)
            if (k in animate) {
                edge[k] = animate[k] * p + startPositions[edge.id][k] * (1 - p);
            }
	  }
        });
        s.refresh();
        s.animations[id] = requestAnimationFrame(step);
      }
      if (typeof o.onStep === 'function')
    	o.onStep();
    }

    step();
  };

  sigma.plugins.kill = function(s) {
    for (var k in (s.animations || {}))
      cancelAnimationFrame(s.animations[k]);

    // Allow to refresh edgequadtree:
    var k,
        c;
    for (k in s.cameras) {
      c = s.cameras[k];
      c.edgequadtree._enabled = true;
    }
  };
}).call(window);
