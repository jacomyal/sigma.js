;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  var settings = {
    nodes: {},
    edges: {}
  };

  /**
   * Sigma Designer
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.1
   */

   var _s = null,
       _mappings = null,
       _palette = null,
       _visionOnNodes = null,
       _visionOnEdges = null,
       _visualVars = ['color', 'size', 'label'];


  /**
   * Fast deep copy function.
   *
   * @param  {object} o The object.
   * @return {object}   The object copy.
   */
  function deepCopy(o) {
    var copy = Object.create(null);
    for (var i in o) {
      if (typeof o[i] === "object" && o[i] !== null) {
        copy[i] = deepCopy(o[i]);
      }
      else if (typeof o[i] === "function" && o[i] !== null) {
        // clone function:
        eval(" copy[i] = " +  o[i].toString());
        //copy[i] = o[i].bind(_g);
      }

      else
        copy[i] = o[i];
    }
    return copy;
  };

  /**
   * This method will put the values in different bins using a linear scale,
   * for a specified number of bins (i.e. histogram). It will return a
   * dictionnary of bins indexed by the specified values.
   *
   * @param  {array}  values The values.
   * @param  {number} nbins  The number of bins.
   * @return {object}        The histogram.
   */
  function histogram(values, nbins) {
    var numlist,
        min,
        max,
        bin,
        i,
        res = {};
    
    // sort values by inverse order:
    numlist = values.map(function (val) {
      return parseFloat(val);
    })
    .sort(function(a, b) { 
      return a - b; 
    });

    min = numlist[0];
    max = numlist[numlist.length - 1];

    numlist.forEach(function(num) {
      bin = Math.floor(nbins * Math.abs(num - min) / Math.abs(max - min));
      bin -= (bin == nbins) ? 1 : 0;
      res[num] = bin;
    });

    return res;
  };


  /**
   * This constructor instanciates a new vision on a specified dataset (nodes
   * or edges).
   *
   * @param  {function} dataset   The dataset accessor, e.g.
   *                              `function(s) { return s.graph.nodes(); }`.
   * @param  {object}   mappings  The mappings object.
   * @return {Vision}             The vision instance.
   */
  function Vision(dataset, mappings) {
    // nodes or edges:
    this.dataset = dataset;

    // index of data properties:
    this.idx = Object.create(null);

    // rules to map visual variables to data properties:
    this.mappings = mappings || {};
    
    // index of deprecated visions on data properties:
    this.deprecated = {};
    
    return this;
  };

  /**
   * This method will index the collection with the specified property, and
   * will compute all styles related to the specified property for each item.
   *
   * @param  {function}  fn The property accessor.
   */
  Vision.prototype.update = function(fn) {
    //console.log('update', this);
    var self = this;

    if (fn === undefined)
      throw 'Missing property accessor';
    if (typeof fn !== 'function')
      throw 'The property accessor "'+ fn +'" must be a function.';

    var val,
        key = fn.toString(),
        isSequential = true;
    
    // Index the collection:
    this.idx[key] = {};
    this.dataset(_s).forEach(function (item) {
      val = fn(item);
      if (val !== undefined) {
        if (self.idx[key][val] === undefined) {
          self.idx[key][val] = {
            items: [],
            styles: {},
            orig_styles: {}
          };
        }
        self.idx[key][val].items.push(item);
        // check if data is sequential:
        isSequential = (typeof val === 'number') ? isSequential : false;
        // TODO: throw error if is number AND (is NaN or is Infinity)
      }
    });

    this.deprecated[key] = false;

    // Find the max number of occurrence of values:
    var maxOcc = 0;
    for (val in this.idx[key]) {
      maxOcc = 
        (maxOcc < this.idx[key][val].items.length) ?
        this.idx[key][val].items.length :
        maxOcc;
    }

    // number of occurrence / max number of occurrences of the value:
    Object.keys(this.idx[key]).forEach(function (val) {
      self.idx[key][val].ratio =
        parseFloat(self.idx[key][val].items.length / maxOcc);
    });

    var format,
        min,
        max,
        colorHist,
        sizeHist,
        scheme,
        visualVars;

    // Visual variables mapped to the specified property:
    visualVars = Object.keys(this.mappings).filter(function (visualVar) {
      return (
        (self.mappings[visualVar].by !== undefined) &&
        (self.mappings[visualVar].by.toString() == key)
      );
    });

    // Validate the mappings and compute histograms if needed:
    visualVars.forEach(function (visualVar) {
      switch (visualVar) {
        case 'color':
          scheme = self.mappings.color.scheme;

          if (typeof scheme !== 'function')
            throw '"' + visualVar + '.scheme" must be a function';

          if (isSequential)
            colorHist = histogram(Object.keys(self.idx[key]), 7);
          break;

        case 'label':
          format = self.mappings.label.format || function(item) {
            return item.label;
          };

          if (typeof format !== 'function')
            throw '"' + visualVar + '.format" must be a function';
          break;

        case 'size':
          min = self.mappings.size.min || 1;
          max = self.mappings.size.max || 1;

          if (typeof min !== 'number')
            throw '"' + visualVar + '.min" must be a number';
          if (typeof max !== 'number')
            throw '"' + visualVar + '.max" must be a number';
          if (min <= 0)
            throw '"' + visualVar + '.min" must be a positive number';
          if (max <= 0)
            throw '"' + visualVar + '.max" must be a positive number';
          if (max < min)
            throw '"' + visualVar + '.max" must be greater or equal than "' + visualVar + '.min"';
          if (!isSequential)
            throw 'The values of property "' + key + '" must be numbers only';

          sizeHist = histogram(Object.keys(self.idx[key]), 7);
          break;
      }
    });

    // Compute all styles related to the property for each item:
    Object.keys(this.idx[key]).forEach(function (val) {
      visualVars.forEach(function (visualVar) {
        switch (visualVar) {

          case 'color':
            if (isSequential) {
              self.idx[key][val].styles.color = function() {
                var bin = colorHist[val];
                return scheme(_palette)[bin];
              };
            }
            else {
              // quantitative data:
              self.idx[key][val].styles.color = function() {
                if (scheme(_palette) === undefined)
                  throw 'The color scheme must be qualitative, i.e. a dict of value => color';
                
                return scheme(_palette)[val];
              };
            }
            break;

          case 'label':
            self.idx[key][val].styles.label = function(item) {
              return format(fn(item));
            };
            break;

          case 'size':
            self.idx[key][val].styles.size = function() {
              var bin = sizeHist[val];  // [0..6]
              return min + (bin / 6) * Math.abs(max - min);
            };
            break;
        }
      });
    });
  };

  /**
   * This method will return the vision on a specified property. It will update
   * the vision on the property if it is deprecated or missing.
   *
   * @param  {function}  fn  The property accessor.
   * @return {object}        The vision on the property.
   */
  Vision.prototype.get = function (fn) {
    if (fn === undefined)
      throw 'Missing property accessor';
    if (typeof fn !== 'function')
      throw 'The property accessor "'+ fn +'" must be a function.';

    var key = fn.toString();

    // lazy updating:
    if (this.deprecated[key])
      this.update(fn);

    // lazy indexing:
    if (this.idx[key] === undefined)
      this.update(fn);

    return this.idx[key];
  };

  /**
   * This method will apply a mapping between a visual variable and a property.
   * It will update the vision on the property if it is deprecated or missing.
   * It will stores the original value of the visual variable for each item.
   * Available visual variables are stored in `_visualVars`.
   *
   * @param {string}   visualVar The name of the visual variable.
   * @param {function} fn        The property accessor.
   */
  Vision.prototype.applyStyle = function(visualVar, fn) {
    if (fn === undefined)
      throw 'Missing property accessor';
    if (typeof fn !== 'function')
      throw 'The property accessor "'+ fn +'" must be a function.';

    if (_visualVars.indexOf(visualVar) == -1)
      throw 'Unknown style "' + visualVar + '"';

    var idxp = this.get(fn);

    Object.keys(idxp).forEach(function (val) {
      var o = idxp[val];
      o.items.forEach(function (item) {
        if (item !== undefined &&
            o.styles !== undefined &&
            o.styles[visualVar]) {
          
          o.orig_styles[visualVar] = o.orig_styles[visualVar] || item[visualVar];
          item[visualVar] = o.styles[visualVar](item);
        }
      });
    });
  };

  /**
   * This method will undo a mapping between a visual variable and a property.
   * It restores the original value of the visual variable for each item. It
   * will do nothing if the vision on the property is missing.
   * Available visual variables are stored in `_visualVars`.
   *
   * @param {string}   visualVar The name of the visual variable.
   * @param {function} fn        The property accessor.
   */
  Vision.prototype.undoStyle = function(visualVar, fn) {
    var self = this;

    if (fn === undefined)
      throw 'Missing property accessor';
    if (typeof fn !== 'function')
      throw 'The property accessor "'+ fn +'" must be a function.';

    if (_visualVars.indexOf(visualVar) == -1)
      throw 'Unknown style';

    var key = fn.toString();

    if (this.idx[key] === undefined)
      return;

    Object.keys(this.idx[key]).forEach(function (val) {
      var o = self.idx[key][val];
      o.items.forEach(function (item) {
        if (item !== undefined &&
            o.orig_styles !== undefined &&
            o.orig_styles[visualVar]) {
          
          item[visualVar] = o.orig_styles[visualVar];
        }
      });
      delete o.orig_styles[visualVar];
    });
  };


  /**
   * Designer Object
   * ------------------
   * @param  {sigma}   s       The related sigma instance.
   * @param  {object}  styles  The styles of the designer.
   * @param  {?object} palette The color palette.
   */
  function Designer(s, styles, palette) {
    _s = s;
    _mappings = sigma.utils.extend(styles || {}, settings);
    _palette = palette || {};

    _visionOnNodes = new Vision(function(s) {
      return s.graph.nodes();
    }, _mappings.nodes);

    _visionOnEdges = new Vision(function(s) {
      return s.graph.edges();
    }, _mappings.edges);
  };

  /**
   * This method will import the styles of the designer. Styles are mappings
   * between visual variables and data properties on nodes and edges. It will
   * deprecate existing styles.
   *
   * @param  {object} styles The styles of the designer.
   * @return {Designer}        The instance.
   */
  Designer.prototype.learnStyles = function(styles) {
    _mappings = sigma.utils.extend(styles || {}, settings);

    _visionOnNodes.mappings = _mappings.nodes;
    _visionOnEdges.mappings = _mappings.edges;

    this.deprecate();
    return this;
  };

  /**
   * This method will import the color palette of the designer. It will deprecate
   * existing styles.
   *
   * @param  {object} palette The color palette of the designer.
   * @return {Designer}         The instance.
   */
  Designer.prototype.learnColors = function(palette) {
    _palette = palette || {};

    this.deprecate();
    return this;
  };

  /**
   * This method will export the styles and palette of the designer.
   *
   * @return {Designer}  The instance.
   */
  Designer.prototype.talk = function() {
    return {
      styles: deepCopy(_mappings),
      palette: deepCopy(_palette)
    };
  };

  /**
   * This method is used to get the styles bound to each node of the graph for
   * a specified property.
   *
   * @param  {function} fn The property accessor.
   * @return {object}      The styles.
   */
  Designer.prototype.nodes = function(fn) {
    return _visionOnNodes.get(fn);
  };

  /**
   * This method is used to get the styles bound to each edge of the graph for
   * a specified property.
   *
   * @param  {function} fn The property accessor.
   * @return {object}      The styles.
   */
  Designer.prototype.edges = function(fn) {
    return _visionOnEdges.get(fn);
  };

  /**
   * This method is used to apply all target styles or a specified target
   * style, depending on how it is called.
   * It will refresh the display.
   *
   * @param  {string} target     The data target. Available values:
   *                             "nodes", "edges".
   * @param  {string} visualVar  The visual variable. Available values:
   *                             "color", "size", "label".
   * @return {Designer}            The instance.
   */
  Designer.prototype.make = function(target, visualVar) {
    if (!target)
      throw '"Designer.make": Missing target';

    var m,
        v;

    switch (target) {
      case 'nodes':
        m = _mappings.nodes;
        v = _visionOnNodes;
        break;
      case 'edges':
        m = _mappings.edges;
        v = _visionOnEdges;
        break;
      default:
        throw '"Designer.make": Unknown target ' + target;
    }

    if (!visualVar) {
      // apply all styles if no visual variable is specified:
      Object.keys(m).forEach(function (visuVar) {
        v.applyStyle(visuVar, m[visuVar].by);
      });
    }
    else {
      // apply the style of the specified visual variable:
      v.applyStyle(visualVar, m[visualVar].by);
    }

    //see https://github.com/jacomyal/sigma.js/issues/397
    _s.refresh({skipIndexation: true});

    return this;
  };

  /**
   * This method will apply all styles on nodes and edges.
   *
   * @return {Designer}  The instance.
   */
  Designer.prototype.makeAll = function() {
    this.make('nodes');
    this.make('edges');
    return this;
  };

  /**
   * This method is used to undo all target styles or a specified target style,
   * depending on how it is called.
   * It will refresh the display.
   *
   * @param  {string} target     The data target. Available values:
   *                             "nodes", "edges".
   * @param  {string} visualVar  The visual variable. Available values:
   *                             "color", "size", "label".
   * @return {Designer}  The instance.
   */
  Designer.prototype.omit = function(target, visualVar) {
    if (!target)
      throw '"Designer.omit": Missing target';

    var m,
        v;

    switch (target) {
      case 'nodes':
        m = _mappings.nodes;
        v = _visionOnNodes;
        break;
      case 'edges':
        m = _mappings.edges;
        v = _visionOnEdges;
        break;
      default:
        throw '"Designer.omit": Unknown target ' + target;
    }

    if (!visualVar) {
      // undo all styles if no visual variable is specified:
      Object.keys(m).forEach(function (visuVar) {
        v.undoStyle(visuVar, m[visuVar].by);
      });
    }
    else {
      // undo the style of the specified visual variable:
      v.undoStyle(visualVar, m[visualVar].by);
    }

    //see https://github.com/jacomyal/sigma.js/issues/397
    _s.refresh({skipIndexation: true});

    return this;
  };

  /**
   * This method will undo all styles on nodes and edges.
   *
   * @return {Designer}  The instance.
   */
  Designer.prototype.omitAll = function() {
    this.omit('nodes');
    this.omit('edges');
    return this;
  };

  /**
   * This method is used when the styles are deprecated, for instance when the
   * graph has changed. Each property style will be remakeed the next time it
   * is called using `.make()`, `.makeAll()`, `.nodes()`, or `.edges()`.
   *
   * @return {Designer}  The instance.
   */
  Designer.prototype.deprecate = function() {
    Object.keys(_visionOnNodes.deprecated).forEach(function(prop) {
      _visionOnNodes.deprecated[prop] = true;
    });

    Object.keys(_visionOnEdges.deprecated).forEach(function(prop) {
      _visionOnEdges.deprecated[prop] = true;
    });
    return this;
  };

  /**
   * This method is used to clear all styles. It will refresh the display. Use
   * `.omitAll()` instead to undo styles without losing the configuration.
   *
   * @return {Designer}  The instance.
   */
  Designer.prototype.disown = function() {
    this.omitAll();
    _mappings = sigma.utils.extend({}, settings);
    
    _visionOnNodes = new Vision(function(s) {
      return s.graph.nodes();
    }, _mappings.nodes);

    _visionOnEdges = new Vision(function(s) {
      return s.graph.edges();
    }, _mappings.edges);

    //see https://github.com/jacomyal/sigma.js/issues/397
    _s.refresh({skipIndexation: true});

    return this;
  };


  /**
   * Interface
   * ------------------
   *
   * > var designer = sigma.plugins.designer(s, options);
   */
  var _instance = null;

  /**
   * @param  {sigma}   s       The related sigma instance.
   * @param  {object}  styles  The styles of the designer.
   * @param  {?object} palette The color palette.
   * @return {Designer}          The instance.
   */
  sigma.plugins.designer = function(s, styles, palette) {
    // Create instance if undefined
    if (!_instance) {
      _instance = new Designer(s, styles, palette);
    }
    return _instance;
  };

  /**
   *  This function kills the designer instance.
   */
  sigma.plugins.killDesigner = function() {
    if (_instance instanceof Designer) {
      _instance.disown();
    }
    _instance = null;
    _s = null;
  };

}).call(this);
