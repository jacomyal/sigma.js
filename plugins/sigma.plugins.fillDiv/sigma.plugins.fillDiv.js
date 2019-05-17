/**
 * This plugin provides a method to fill the graph into it's container. Check the
 * sigma.plugins.fillDiv function doc
 */
(function () {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.plugins');


  /**
   * This function will create plugin instance.
   *
   * Recognized parameters:
   * **********************
   * @param  {sigma}    s        The related sigma instance.
   * @param  {renderer} renderer The related renderer instance.
   */
  function fillModel(x, len, min, max) { return (len / (max - min)) * (x - min) }
  function FillDiv(s, renderer) {
    sigma.classes.dispatcher.extend(this);

    var _self = this;

    this.fill = function () {
      var _container = renderer.container,
        _nodes = s.graph.nodes();
      if (_nodes.length < 2) {
        return;
      }
      const allX = _nodes.map(function (n) { return n.x })
      const allY = _nodes.map(function (n) { return n.y })
      const maxX = allX.reduce(function(l, r){return l < r ? r : l})
      const minX = allX.reduce(function(l, r){return l < r ? l : r})
      const maxY = allY.reduce(function(l, r){return l < r ? r : l})
      const minY = allY.reduce(function(l, r){return l < r ? l : r})
      const containerW = _container.offsetWidth;
      const containerH = _container.offsetHeight;

      for (var nid in _nodes) {
        var n = _nodes[nid]
        n.x = fillModel(n.x, containerW, minX, maxX)
        n.y = fillModel(n.y, containerH, minY, maxY)
      }
      s.refresh();
    }
  };

  var _instance = {};

  /**
   * @param  {sigma} s The related sigma instance.
   * @param  {renderer} renderer The related renderer instance.
   */
  sigma.plugins.fillDiv = function (s, renderer) {
    // Create object if undefined
    if (!_instance[s.id]) {
      _instance[s.id] = new FillDiv(s, renderer);
    }

    s.bind('kill', function () {
      sigma.plugins.killFillDiv(s);
    });

    return _instance[s.id];
  };

  /**
   * This method removes the event listeners and kills the fillDiv instance.
   *
   * @param  {sigma} s The related sigma instance.
   */
  sigma.plugins.killFillDiv = function (s) {
    if (_instance[s.id] instanceof FillDiv) {
      _instance[s.id].unbindAll();
      delete _instance[s.id];
    }
  };

}).call(window);
