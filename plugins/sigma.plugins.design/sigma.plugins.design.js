;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma design
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.4
   */


  /**
   * Convert Javascript string in dot notation into an object reference.
   *
   * @param  {object} obj The object.
   * @param  {string} str The string to convert, e.g. 'a.b.etc'.
   * @return {?}          The object reference.
   */
  function strToObjectRef(obj, str) {
    // http://stackoverflow.com/a/6393943
    return str.split('.').reduce(function(obj, i) { return obj[i] }, obj);
  }

  /**
   * This custom tool function removes every pair key/value from an hash. The
   * goal is to avoid creating a new object while some other references are
   * still hanging in some scopes...
   *
   * @param  {object} obj The object to empty.
   * @return {object}     The empty object.
   */
  function emptyObject(obj) {
    var k;

    for (k in obj)
      if (!('hasOwnProperty' in obj) || obj.hasOwnProperty(k))
        delete obj[k];

    return obj;
  }

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
   * dictionary of bins indexed by the specified values.
   *
   * @param  {array}  values The values.
   * @param  {number} nbins  The number of bins.
   * @return {object}        The basic histogram.
   */
  function baseHistogram(values, nbins) {
    var numlist,
        min,
        max,
        bin,
        res = {};

    if (!values.length)
      return res;

    // sort values by inverse order:
    numlist = values.map(function (val) {
      return parseFloat(val);
    })
    .sort(function(a, b) {
      return a - b;
    });

    min = numlist[0];
    max = numlist[numlist.length - 1];


    if (max - min !== 0) {
      numlist.forEach(function (num) {
        bin = Math.floor(nbins * Math.abs(num - min) / Math.abs(max - min));
        bin -= (bin == nbins) ? 1 : 0;
        res[num] = bin;
      });
    } else {
      // if the max is the same as the minimum, we put all the numbers in the same bin.
      numlist.forEach(function(num){
        res[num] = 0;
      });
    }

    return res;
  };

  /**
   * This function will generate a consolidated histogram of values grouped by
   * bins. The result is an array of objects ordered by bins. Each object
   * contains the list of `values` in the `bin`, the `min` and `max` values,
   * and the `ratio` of values in the bin compared to the largest bin.
   *
   * @param  {object} h         The nodes or edges histograms.
   * @param  {string} p         The property accessor.
   * @return {array}            The consolidated histogram.
   */
  function histogram(h, p) {
    var d = [],
        bins,
        maxOcc = 0;

    if (h && h[p]) {
      Object.keys(h[p]).forEach(function(value) {
        var bin = h[p][value];
        d[bin] = d[bin] || [];
        d[bin].push(+value);
      });

      bins = (d.length !== 1 ) ? d.length : 7;

      for (var bin = 0; bin < bins; bin++) {
        if (d[bin]) {
          maxOcc = (maxOcc > d[bin].length) ? maxOcc : d[bin].length;
        }
      }

      for (var bin = 0; bin < bins; bin++) {
        if (d[bin] === undefined) {
          d[bin] = [];
        }
        d[bin] = {
          bin: bin,
          values: d[bin],
          ratio: d[bin].length / maxOcc
        };
        // d[bin][visualVar] = design.palette.sequential[bins][bin];

        if (d[bin].values.length) {
          d[bin].min = Math.min.apply(null, d[bin].values);
          d[bin].max = Math.max.apply(null, d[bin].values);
        }
      }
    }
    return d;
  };

  /**
   * This constructor instanciates a new vision on a specified dataset (nodes
   * or edges).
   *
   * @param  {sigma} s              The sigma instance.
   * @param  {function} datasetName The dataset. Available options: 'nodes',
   *                                'edges'.
   * @param  {object} mappings      The style mappings object.
   * @param  {object} palette       The palette object.
   * @return {Vision}               The vision instance.
   */
  function Vision(s, datasetName, mappings, palette) {
    var that = this;

    // defined below:
    this.visualVars = null;

    // mappings may be overriden:
    this.mappings = null;

    // palette may be overriden:
    this.palette = palette;

    // index of data properties:
    this.idx = Object.create(null);

    // histograms of data properties for visual variables:
    this.histograms = Object.create(null);

    // index of deprecated visions on data properties:
    this.deprecated = Object.create(null);

    // some original sigma settings:
    this.sigmaSettings = Object.create(null);

    // properties are sequential or qualitative data
    this.dataTypes = Object.create(null);

    // original values of visual variables
    this.originalVisualVariable = Object.create(null);

    // nodes or edges:
    if (datasetName === 'nodes') {
      this.visualVars = ['color', 'size', 'label', 'type', 'icon', 'image'];
      this.mappings = mappings.nodes;
      this.dataset = function() { return s.graph.nodes(); }
    }
    else if (datasetName === 'edges') {
      this.visualVars = ['color', 'size', 'label', 'type'];
      this.mappings = mappings.edges;
      this.dataset = function() { return s.graph.edges(); }
    }
    else
      throw 'Vision: Unknown dataset ' + datasetName;


    /**
     * This method will index the collection with the specified property, and
     * will compute all styles related to the specified property for each item.
     *
     * @param  {string}  key The property accessor.
     */
    this.update = function(key) {
      // console.log('Vision.update', key);
      var self = this;

      if (key === undefined)
        throw 'Vision.update: Missing property accessor';

      if (typeof key !== 'string')
        throw 'Vision.update: The property accessor "'+ key +'" must be a string.';

      var val,
          byFn,
          schemeFn,
          isSequential = undefined,
          isArray = true;

      byFn = function(item, key) { return strToObjectRef(item, key); };
      schemeFn = function(palette, key) { return strToObjectRef(palette, key); }

      function insertItem(val, item) {
        if (self.idx[key][val] === undefined) {
          self.idx[key][val] = {
            key: val,
            items: [],
            styles: Object.create(null)
          };
        }
        self.idx[key][val].items.push(item);

        if (isSequential || isSequential === undefined) {
          isSequential = (typeof val === 'number');
          // TODO: throw error if is number AND (is NaN or is Infinity)
        }
      };

      // Index the collection:
      this.idx[key] = {};
      this.dataset().forEach(function (item) {
        val = byFn(item, key);
        if (val !== undefined) {
          if (isArray) {
            isArray = (Object.prototype.toString.call(val) === '[object Array]') ? isArray : false;
          }
          if (isArray) {
            if (val.length === 1) {
              insertItem(val[0], item);
            }
            else {
              val.forEach(function (v) {
                insertItem(v, item);
              });
            }
          }
          else {
            insertItem(val, item);
          }
        }
      });

      this.dataTypes[key] = { sequential: isSequential, array: isArray };
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
          colorHist,
          sizeHist,
          colorScheme,
          typeScheme,
          iconScheme,
          imageScheme,
          bins,
          visualVars,
          nset = 0;

      // Visual variables mapped to the specified property:
      visualVars = Object.keys(that.mappings).filter(function (visualVar) {
        return (
          (that.mappings[visualVar]) &&
          (that.mappings[visualVar].by !== undefined) &&
          (that.mappings[visualVar].by.toString() == key)
        );
      });

      // Validate the mappings and compute histograms if needed:
      visualVars.forEach(function (visualVar) {
        switch (visualVar) {
          case 'color':
            colorScheme = that.mappings.color.scheme;

            if (typeof colorScheme !== 'string')
              throw 'Vision.update: color.scheme "' + colorScheme + '" must be a string';

            if (isSequential) {
              bins = that.mappings.color.bins || 7;
              self.histograms.color = self.histograms.color || {};
              self.histograms.color[key] = baseHistogram(Object.keys(self.idx[key]), bins);
            }

            break;

          case 'label':
            format = that.mappings.label.format || function(item) {
              return item.label;
            };

            if (typeof format !== 'function')
              throw 'Vision.update: label.format "' + format + '" must be a function';
            break;

          case 'size':
            if (!isSequential)
              throw 'Vision.update: The values of property "' + key + '" must be numbers only';

            self.histograms.size = self.histograms.size || {};
            self.histograms.size[key] = baseHistogram(
              Object.keys(self.idx[key]),
              (that.mappings.size.bins || 7)
            );
            break;

          case 'type':
            typeScheme = that.mappings.type.scheme;

            if (typeof typeScheme !== 'string')
              throw 'Vision.update: type.scheme "' + typeScheme + '" must be a string';

            break;

          case 'icon':
            iconScheme = that.mappings.icon.scheme;

            if (typeof iconScheme !== 'string')
              throw 'Vision.update: icon.scheme "' + iconScheme + '" must be a string';

            break;

          case 'image':
            imageScheme = that.mappings.image.scheme;

            if (typeof imageScheme !== 'string')
              throw 'Vision.update: type.scheme "' + imageScheme + '" must be a string';

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
                  var bin = self.histograms.color[key][val];
                  return schemeFn(that.palette, colorScheme)[bins][bin];
                };
              }
              else {
                self.idx[key][val].styles.color = function() {
                  if (schemeFn(that.palette, colorScheme) === undefined)
                    throw 'Vision.update: Wrong or undefined color scheme';

                  if (that.mappings.color.set > 0) {
                    var setItem = schemeFn(that.palette, colorScheme)[that.mappings.color.set][nset];
                    nset = (nset + 1) % that.mappings.color.set;
                    return setItem;
                  }

                  return schemeFn(that.palette, colorScheme)[val];
                };
              }
              break;

            case 'label':
              self.idx[key][val].styles.label = function(item) {
                return format(byFn(item, key));
              };
              break;

            case 'size':
              self.idx[key][val].styles.size = function() {
                return 1 + self.histograms.size[key][val];
              };
              break;

            case 'type':
              self.idx[key][val].styles.type = function() {
                if (schemeFn(that.palette, typeScheme) === undefined)
                  throw 'Vision.update: Wrong or undefined type scheme';

                return schemeFn(that.palette, typeScheme)[val];
              };
              break;

            case 'icon':
              self.idx[key][val].styles.icon = function() {
                if (schemeFn(that.palette, iconScheme) === undefined)
                  throw 'Vision.update: Wrong or undefined icon scheme';

                return schemeFn(that.palette, iconScheme)[val];
              };
              break;

            case 'image':
              self.idx[key][val].styles.image = function() {
                if (schemeFn(that.palette, imageScheme) === undefined)
                  throw 'Vision.update: Wrong or undefined image scheme';

                return schemeFn(that.palette, imageScheme)[val];
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
     * @param  {string} key  The property accessor.
     * @return {object}      The vision on the property.
     */
    this.get = function (key) {
      if (key === undefined)
        throw 'Vision.get: Missing property accessor';

      if (typeof key !== 'string')
        throw 'Vision.get: The property accessor "'+ key +'" must be a string.';

      // lazy updating:
      if (this.deprecated[key]) this.update(key);

      // lazy indexing:
      if (this.idx[key] === undefined) this.update(key);

      return this.idx[key];
    };

    /**
     * This method will apply a mapping between a visual variable and a property.
     * It will update the vision on the property if it is deprecated or missing.
     * It will stores the original value of the visual variable for each item.
     * If the new value is `undefined`, it will keep the original value.
     * Available visual variables are stored in `visualVars`.
     *
     * @param {string} visualVar The name of the visual variable.
     * @param {string} key       The property accessor.
     */
    this.applyStyle = function(visualVar, key) {
      if (key === undefined)
        throw 'Vision.applyStyle: Missing property accessor';

      if (typeof key !== 'string')
        throw 'Vision.applyStyle: The property accessor "'+ key +'" must be a string.';

      if (this.visualVars.indexOf(visualVar) == -1)
        throw 'Vision.applyStyle: Unknown style "' + visualVar + '"';

      var self = this,
          idxp = this.get(key);

      if (visualVar === 'color' && self.dataTypes[key].array) {
        this.dataset().forEach(function (item) {
          delete item.colors;
        });

        Object.keys(idxp).forEach(function (val) {
          var o = idxp[val];
          o.items.forEach(function (item) {
            item.colors = [];
          });
        });
      }

      Object.keys(idxp).forEach(function (val) {
        var o = idxp[val];
        o.items.forEach(function (item) {
          if (item !== undefined &&
              o.styles !== undefined &&
              typeof o.styles[visualVar] === 'function') {

            if (!self.originalVisualVariable[item.id]) {
              self.originalVisualVariable[item.id] = {};
            }
            if (!(visualVar in self.originalVisualVariable[item.id])) {
              // non-writable property
              Object.defineProperty(self.originalVisualVariable[item.id], visualVar, {
               enumerable: true,
               value: item[visualVar]
              });
            }

            var newVal = o.styles[visualVar](item);

            if (visualVar === 'color' && self.dataTypes[key].array) {
              if (newVal !== undefined) {
                item.colors.push(newVal);
              }
            }
            else if (newVal !== undefined) {
              item[visualVar] = newVal;
            }
          }
          else {
            if (typeof o.styles[visualVar] === 'function')
              throw 'Vision.applyStyle: ' + o.styles + '.' + visualVar + 'must be a function.';
          }
        });
      });

      if (visualVar === 'size') {
        if (datasetName === 'nodes') {
          if (this.mappings.size.min > this.mappings.size.max) {
            throw 'Vision.applyStyle: nodes.size.min must not be ' +
            'greater than nodes.size.max';
          }

          if (this.mappings.size.min) {
            if (!this.sigmaSettings.minNodeSize) {
              this.sigmaSettings.minNodeSize = s.settings('minNodeSize');
            }
            s.settings('minNodeSize', this.mappings.size.min);
          }

          if (this.mappings.size.max) {
            if (!this.sigmaSettings.maxNodeSize) {
              this.sigmaSettings.maxNodeSize = s.settings('maxNodeSize');
            }
            s.settings('maxNodeSize', this.mappings.size.max);
          }
        }
        else if (datasetName === 'edges') {
          if (this.mappings.size.min > this.mappings.size.max) {
            throw 'Vision.applyStyle: edges.size.min must not be '+
            'greater than edges.size.max';
          }

          if (this.mappings.size.min) {
            if (!this.sigmaSettings.minEdgeSize) {
              this.sigmaSettings.minEdgeSize = s.settings('minEdgeSize');
            }
            s.settings('minEdgeSize', this.mappings.size.min);
          }

          if (this.mappings.size.max) {
            if (!this.sigmaSettings.maxEdgeSize) {
              this.sigmaSettings.maxEdgeSize = s.settings('maxEdgeSize');
            }
            s.settings('maxEdgeSize', this.mappings.size.max);
          }
        }
      }
    };

    /**
     * This method will reset a mapping between a visual variable and a property.
     * It restores the original value of the visual variable for each item. It
     * will do nothing if the vision on the property is missing.
     * Available visual variables are stored in `visualVars`.
     *
     * @param {string} visualVar The name of the visual variable.
     * @param {string} key       The property accessor.
     */
    this.resetStyle = function(visualVar, key) {
      if (key === undefined)
        throw 'Vision.resetStyle: Missing property accessor';

      if (typeof key !== 'string')
        throw 'Vision.resetStyle: The property accessor "'+ key +'" must be a string.';

      if (this.visualVars.indexOf(visualVar) == -1)
        throw 'Vision.resetStyle: Unknown style';

      if (this.idx[key] === undefined) return;

      var self = this,
          idxp = this.get(key);

      if (visualVar === 'color' && self.dataTypes[key].array) {
        Object.keys(idxp).forEach(function (val) {
          var o = idxp[val];
          o.items.forEach(function (item) {
            delete item.colors;
          });
        });
      }

      Object.keys(idxp).forEach(function (val) {
        var o = idxp[val];
        o.items.forEach(function (item) {
          if (item !== undefined && item[visualVar] !== undefined) {

            if (self.originalVisualVariable[item.id] === undefined ||
              self.originalVisualVariable[item.id][visualVar] === undefined) {

              // Avoid Sigma bug on edge with no size
              if (self.key === 'edges' && visualVar === 'size')
                item.size = 1;
              else
                delete item[visualVar];
          }
            else
              item[visualVar] = self.originalVisualVariable[item.id][visualVar];
          }
        });
      });

      if (visualVar === 'size') {
        if (datasetName === 'nodes') {
          if (this.sigmaSettings.minNodeSize) {
            s.settings('minNodeSize', this.sigmaSettings.minNodeSize);
          }
          if (this.sigmaSettings.maxNodeSize) {
            s.settings('maxNodeSize', this.sigmaSettings.maxNodeSize);
          }
        }
        else if (datasetName === 'edges') {
          if (this.sigmaSettings.minEdgeSize) {
            s.settings('minEdgeSize', this.sigmaSettings.minEdgeSize);
          }
          if (this.sigmaSettings.maxEdgeSize) {
            s.settings('maxEdgeSize', this.sigmaSettings.maxEdgeSize);
          }
        }
      }
    };

    /**
     * This method empties the arrays and indexes.
     */
    this.clear = function() {
      this.visualVars.length = 0;
      emptyObject(this.idx);
      emptyObject(this.histograms);
      emptyObject(this.deprecated);
      emptyObject(this.sigmaSettings);
      emptyObject(this.dataTypes);
      emptyObject(this.originalVisualVariable);
    };

    return this;
  };


  /**
   * design Object
   * ------------------
   * @param  {sigma}   s       The related sigma instance.
   * @param  {?object} options The object contains `palette` and `styles`.
   *                           Styles are mappings between visual variables and
   *                           data properties on nodes and edges.
   */
  function design(s, options) {
    this.palette = (options || {}).palette || {};
    this.styles = sigma.utils.extend((options || {}).styles || {}, {
      nodes: {},
      edges: {}
    });

    var self = this,
        _visionOnNodes = new Vision(s, 'nodes', this.styles, this.palette),
        _visionOnEdges = new Vision(s, 'edges', this.styles, this.palette);

    s.bind('kill', function() {
      sigma.plugins.killDesign(s);
    });


    /**
     * This method will set new styles. Styles are mappings between visual
     * variables and data properties on nodes and edges. It will deprecate
     * existing styles.
     *
     * @param  {object}  styles The styles object.
     * @return {design}       The instance.
     */
    this.setStyles = function(styles) {
      this.styles = sigma.utils.extend(styles || {}, {
        nodes: {},
        edges: {}
      });

      _visionOnNodes.mappings = this.styles.nodes;
      _visionOnEdges.mappings = this.styles.edges;

      this.deprecate();
      return this;
    };

    /**
     * This method will set a specified node style. Styles are mappings between
     * visual variables and data properties on nodes and edges. It will
     * deprecate existing node styles bound to the specified data property.
     *
     * @param  {string}  visualVar The visual variable.
     * @param  {object}  params    The style parameter.
     * @return {design}          The instance.
     */
    this.nodesBy = function(visualVar, params) {
      this.styles = sigma.utils.extend(this.styles || {}, {
        nodes: {},
        edges: {}
      });

      this.styles.nodes[visualVar] = params;
      _visionOnNodes.mappings = this.styles.nodes;

      if (params.by) {
        this.deprecate('nodes', params.by);
      }

      return this;
    };

    /**
     * This method will set a specified edge style. Styles are mappings between
     * visual variables and data properties on nodes and edges. It will
     * deprecate existing edge styles bound to the specified data property.
     *
     * @param  {string}  visualVar The visual variable.
     * @param  {object}  params    The style parameter.
     * @return {design}          The instance.
     */
    this.edgesBy = function(visualVar, params) {
      this.styles = sigma.utils.extend(this.styles || {}, {
        nodes: {},
        edges: {}
      });

      this.styles.edges[visualVar] = params;
      _visionOnEdges.mappings = this.styles.edges;

      if (params.by) {
        this.deprecate('edges', params.by);
      }

      return this;
    };


    /**
     * This method will set a new palette. It will deprecate existing styles.
     *
     * @param  {object}  palette The palette object.
     * @return {design}        The instance.
     */
    this.setPalette = function(palette) {
      this.palette = palette;

      _visionOnNodes.palette = this.palette;
      _visionOnEdges.palette = this.palette;

      this.deprecate();
      return this;
    };

    /**
     * This method is used to get the styles bound to each node of the graph for
     * a specified property.
     *
     * @param  {string} key The property accessor. Use a dot notation like
     *                      'data.myProperty'.
     * @return {object}     The styles.
     */
    this.nodes = function(key) {
      return _visionOnNodes.get(key);
    };

    /**
     * This method is used to get the styles bound to each edge of the graph for
     * a specified property.
     *
     * @param  {string} key The property accessor. Use a dot notation like
     *                      'data.myProperty'.
     * @return {object}     The styles.
     */
    this.edges = function(key) {
      return _visionOnEdges.get(key);
    };

    /**
     * This method will export a deep copy of the internal `Vision` objects,
     * which store the indexes, bound styles and histograms.
     *
     * @return {object}  The object of keys `nodes` and `edges`.
     */
    this.inspect = function() {
      return {
        nodes: deepCopy(_visionOnNodes),
        edges: deepCopy(_visionOnEdges)
      };
    };

    function __apply(mappings, vision, visualVar) {
      if (!visualVar) {
        // apply all styles if no visual variable is specified:
        Object.keys(mappings).forEach(function (visuVar) {
          mappings[visuVar].active = false;
          if (mappings[visuVar] && mappings[visuVar].by) {
            vision.applyStyle(visuVar, mappings[visuVar].by);
            mappings[visuVar].active = true;
          }
        });
      }
      else if (mappings[visualVar] && mappings[visualVar].by) {
        // apply the style of the specified visual variable:
        vision.applyStyle(visualVar, mappings[visualVar].by);
        mappings[visualVar].active = true;
      }

      if (s) s.refresh({skipIndexation: true});
    };

    /**
     * This method is used to apply all target styles or a specified target
     * style, depending on how it is called. Apply all styles if it is called
     * without argument. It will refresh the display.
     *
     * @param  {?string} target     The data target. Available values:
     *                              "nodes", "edges".
     * @param  {?string} visualVar  The visual variable. Available values:
     *                              "color", "size", "label".
     * @return {design}            The instance.
     */
    this.apply = function(target, visualVar) {
      if (!this.styles) return;

      if (!target) {
        __apply(this.styles.nodes, _visionOnNodes, visualVar);
        __apply(this.styles.edges, _visionOnEdges, visualVar);
        return this;
      }

      switch (target) {
        case 'nodes':
          __apply(this.styles.nodes, _visionOnNodes, visualVar);
          break;
        case 'edges':
          __apply(this.styles.edges, _visionOnEdges, visualVar);
          break;
        default:
          throw '"design.apply": Unknown target ' + target;
      }

      return this;
    };

    function __reset(mappings, vision, visualVar) {
      if (!visualVar) {
        // reset all styles if no visual variable is specified:
        Object.keys(mappings).forEach(function (visuVar) {
          if (mappings[visuVar].active) {
            vision.resetStyle(visuVar, mappings[visuVar].by);
            mappings[visuVar].active = false;
          }
        });
      }
      else if (mappings[visualVar] && mappings[visualVar].active) {
        // reset the style of the specified visual variable:
        vision.resetStyle(visualVar, mappings[visualVar].by);
        mappings[visualVar].active = false;
      }

      if (s) s.refresh({skipIndexation: true});
    };

    /**
     * This method is used to reset all target styles or a specified target style,
     * depending on how it is called. reset all styles if it is called
     * without argument. It will do nothing if the visual variable
     * is not in the existing styles. It will finally refresh the display.
     *
     * @param  {?string} target     The data target. Available values:
     *                               "nodes", "edges".
     * @param  {?string} visualVar  The visual variable. Available values:
     *                             "color", "size", "label".
     * @return {design}  The instance.
     */
    this.reset = function(target, visualVar) {
      if (!this.styles) return;

      if (!target) {
        __reset(this.styles.nodes, _visionOnNodes, visualVar);
        __reset(this.styles.edges, _visionOnEdges, visualVar);
        return this;
      }

      switch (target) {
        case 'nodes':
          __reset(this.styles.nodes, _visionOnNodes, visualVar);
          break;
        case 'edges':
          __reset(this.styles.edges, _visionOnEdges, visualVar);
          break;
        default:
          throw '"design.reset": Unknown target ' + target;
      }

      return this;
    };

    /**
     * This method is used when the styles are deprecated, for instance when the
     * graph has changed. The specified property style will be remade the next
     * time it is called using `.apply()`, `.nodes()`, or `.edges()`
     * or all property styles if called without argument.
     *
     * @param  {?string} target  The data target. Available values:
     *                           "nodes", "edges".
     * @param  {?string} key     The property accessor. Use a dot notation like
     *                           'data.myProperty'.
     * @return {design}        The instance.
     */
    this.deprecate = function(target, key) {
      if (target) {
        if (target !== 'nodes' && target !== 'edges')
          throw '"design.deprecate": Unknown target ' + target;

        if (key) {
          if (target === 'nodes') {
            _visionOnNodes.deprecated[key] = true;
          }
          else if (target === 'edges') {
            _visionOnEdges.deprecated[key] = true;
          }
          else
            throw '"design.deprecate": Unknown target ' + target;
        }
        else {
          if (target === 'nodes') {
            Object.keys(_visionOnNodes.deprecated).forEach(function(prop) {
              _visionOnNodes.deprecated[prop] = true;
            });
          }
          else if (target === 'edges') {
            Object.keys(_visionOnEdges.deprecated).forEach(function(prop) {
              _visionOnEdges.deprecated[prop] = true;
            });
          }
        }
      }
      else {
        Object.keys(_visionOnNodes.deprecated).forEach(function(prop) {
          _visionOnNodes.deprecated[prop] = true;
        });

        Object.keys(_visionOnEdges.deprecated).forEach(function(prop) {
          _visionOnEdges.deprecated[prop] = true;
        });
      }

      return this;
    };

    /**
     * This method is used to clear all styles. It will refresh the display. Use
     * `.reset()` instead to reset styles without losing the configuration.
     *
     * @return {design}  The instance.
     */
    this.clear = function() {
      this.reset();
      this.styles = {
        nodes: {},
        edges: {}
      };
      this.palette = {};

      _visionOnNodes.clear();
      _visionOnEdges.clear();

      _visionOnNodes = new Vision(s, 'nodes', this.styles, this.palette);
      _visionOnEdges = new Vision(s, 'edges', this.styles, this.palette);

      if (s) s.refresh({skipIndexation: true});

      return this;
    };

    /**
     * This method destroys the current instance.
     */
    this.kill = function() {
      delete this.styles;
      delete this.palette;
      _visionOnNodes.clear();
      _visionOnEdges.clear();
    };

    this.utils = {};

    /**
     * This method is used to get the data type of a specified property on nodes
     * or edges. It is true if data is sequential, false otherwise (qualitative),
     * or undefined if the property doesn't exist.
     *
     * @param  {string} target     The data target. Available values:
     *                             "nodes", "edges".
     * @param  {string} property   The property accessor.
     * @return {boolean}           The data type.
     */
    this.utils.isSequential = function(target, property) {
      if (!target)
        throw '"design.utils.isSequential": Missing target';

      var v;
      switch (target) {
        case 'nodes':
          v = _visionOnNodes;
          break;
        case 'edges':
          v = _visionOnEdges;
          break;
        default:
          throw '"design.utils.isSequential": Unknown target ' + target;
      }

      if (property === undefined)
        throw 'design.utils.isSequential: Missing property accessor';

      if (typeof property !== 'string')
        throw 'design.utils.isSequential: The property accessor "'+ property +'" must be a string.';

      if (!(property in v.dataTypes) || v.dataTypes[property].sequential === undefined) {
        var val,
            found = false,
            isSequential = true;

        v.dataset().forEach(function (item) {
          val = strToObjectRef(item, property);
          if (val !== undefined) {
            found = true;
            isSequential = (typeof val === 'number') ? isSequential : false;
            // TODO: throw error if is number AND (is NaN or is Infinity)
          }
        });

        if (found) {
          v.dataTypes[property] = { sequential: isSequential };
        }
      }

      return (v.dataTypes[property] || {}).sequential;
    };

    /**
     * This method is used to get the histogram of values, grouped by bins, on
     * a specified property of nodes or edges computed for a visual variable.
     * The property must have been used on a style before calling this method.
     *
     * The result is an array of objects ordered by bins. Each object contains
     * the list of `values` in the `bin`, the `min` and `max` values, and the
     * `ratio` of values in the bin compared to the largest bin.
     * If the visual variable is the `color`, it also contains the `color` of the
     * bin.
     *
     * @param  {string} target     The data target. Available values:
     *                             "nodes", "edges".
     * @param  {string} visualVar  The visual variable. Available values:
     *                             "color", "size", "label".
     * @param  {string} property   The property accessor.
     * @return {array}             The histogram.
     */
    this.utils.histogram = function(target, visualVar, property) {
      if (!target)
        throw 'design.utils.histogram: Missing target';

      var v;
      switch (target) {
        case 'nodes':
          v = _visionOnNodes;
          break;
        case 'edges':
          v = _visionOnEdges;
          break;
        default:
          throw 'design.utils.histogram: Unknown target "' + target + '"';
      }

      if (v.visualVars.indexOf(visualVar) == -1)
        throw 'design.utils.histogram: Unknown visual variable.';

      if (property === undefined)
        throw 'design.utils.histogram: Missing property accessor';

      if (typeof property !== 'string')
        throw 'design.utils.histogram: The property accessor "'+ property +'" must be a string.';

      var isSequential = this.isSequential(target, property);

      if (isSequential === undefined)
        throw 'design.utils.histogram: Missing property "'+ property + '"';

      if (!isSequential)
        throw 'design.utils.histogram: the property "'+ property +'" must be sequential.';

      var h = histogram(v.histograms[visualVar], property);

      if (visualVar === 'color') {
        var bins = h.length,
          o = null;
        for (var bin = 0; bin < bins; bin++) {
          o = strToObjectRef(self.palette, self.styles[target].color.scheme);
          if (!o)
            throw 'design.utils.histogram: color scheme "' + self.styles[target].color.scheme + '" not in '+ target +' palette.';
          if (!o[bins])
            throw 'design.utils.histogram: missing key "'+ bins +'" in '+ target +' palette " of color scheme ' + self.styles[target].color.scheme + '".';

          h[bin][visualVar] = o[bins][bin];
        }
      }

      return h;
    };
  };


  /**
   * Interface
   * ------------------
   *
   * > var design = sigma.plugins.design(s, options);
   */
  var _instance = {};

  /**
   * @param  {sigma}   s       The related sigma instance.
   * @param  {?object} options The object contains `palette` and `styles`.
   *                           Styles are mappings between visual variables and
   *                           data properties on nodes and edges.
   * @return {design}        The instance.
   */
  sigma.plugins.design = function(s, options) {
    // Create instance if undefined
    if (!_instance[s.id]) {
      _instance[s.id] = new design(s, options);
    }
    return _instance[s.id];
  };

  /**
   *  This function kills the design instance.
   */
  sigma.plugins.killDesign = function(s) {
    if (_instance[s.id] instanceof design) {
      _instance[s.id].kill();
    }
    delete _instance[s.id];
  };

}).call(this);
