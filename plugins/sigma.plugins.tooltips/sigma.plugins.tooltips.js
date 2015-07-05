/**
 * This plugin provides a method to display a tooltip at a specific event, e.g.
 * to display some node properties on node hover. Check the
 * sigma.plugins.tooltip function doc or the examples/tooltip.html code sample
 * to know more.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw new Error('sigma is not declared');

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma tooltip
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.3
   */

  var settings = {
    stage: {
      show: 'rightClickStage',
      hide: 'clickStage',
      cssClass: 'sigma-tooltip',
      position: '',       // top | bottom | left | right
      autoadjust: false,
      delay: 0,
      template: '',       // HTML string
      renderer: null      // function
    },
    node: {
      show: 'clickNode',
      hide: 'clickStage',
      cssClass: 'sigma-tooltip',
      position: '',       // top | bottom | left | right
      autoadjust: false,
      delay: 0,
      template: '',       // HTML string
      renderer: null      // function
    },
    edge: {
      show: 'clickEdge',
      hide: 'clickStage',
      cssClass: 'sigma-tooltip',
      position: '',       // top | bottom | left | right
      autoadjust: false,
      delay: 0,
      template: '',       // HTML string
      renderer: null      // function
    },
    doubleClickDelay: 800
  };


  /**
   * This function will display a tooltip when a sigma event is fired. It will
   * basically create a DOM element, fill it with the template or the result of
   * the renderer function, set its position and CSS class, and insert the
   * element as a child of the sigma container. Only one tooltip may exist.
   *
   * Recognized parameters of options:
   * *********************************
   * Enable node tooltips by adding the "node" key to the options object.
   * Enable edge tooltips by adding the "edge" key to the options object.
   * Each value must be an object. Here is the exhaustive list of every
   * accepted parameters in these objects:
   *
   *   {?string}   show       The event that triggers the tooltip. Default
   *                          values: "clickNode", "clickEdge". Other suggested
   *                          values: "overNode", "doubleClickNode",
   *                          "rightClickNode", "overEdge", "doubleClickEdge",
   *                          "rightClickEdge", "doubleClickNode",
   *                          "rightClickNode".
   *   {?string}   hide       The event that hides the tooltip. Default value:
   *                          "clickStage". Other suggested values: "outNode",
   *                          "outEdge".
   *   {?string}   template   The HTML template. It is directly inserted inside
   *                          a div element unless a renderer is specified.
   *   {?function} renderer   This function may process the template or be used
   *                          independently. It should return an HTML string or
   *                          a DOM element. It is executed at runtime. Its
   *                          context is sigma.graph.
   *   {?string}   cssClass   The CSS class attached to the top div element.
   *                          Default value: "sigma-tooltip".
   *   {?string}   position   The position of the tooltip regarding the mouse.
   *                          If it is not specified, the tooltip top-left
   *                          corner is positionned at the mouse position.
   *                          Available values: "top", "bottom", "left",
   *                          "right".
   *   {?number}   delay      The delay in miliseconds before displaying the
   *                          tooltip after the show event is triggered.
   *   {?boolean}  autoadjust [EXPERIMENTAL] If true, tries to adjust the
   *                          tooltip position to be fully included in the body
   *                          area. Doesn't work on Firefox 30. Better work on
   *                          elements with fixed width and height.
   *
   * > sigma.plugins.tooltip(s, {
   * >   node: {
   * >     template: 'Hello node!'
   * >   },
   * >   edge: {
   * >     template: 'Hello edge!'
   * >   },
   * >   stage: {
   * >     template: 'Hello stage!'
   * >   }
   * > });
   *
   * @param {sigma}    s        The related sigma instance.
   * @param {renderer} renderer The related sigma renderer.
   * @param {object}   options  An object with options.
   */
  function Tooltips(s, renderer, options) {
    var self = this,
        so = sigma.utils.extend(options.stage, settings.stage),
        no = sigma.utils.extend(options.node, settings.node),
        eo = sigma.utils.extend(options.edge, settings.edge),
        _tooltip,
        _timeoutHandle,
        _doubleClick = false;

    sigma.classes.dispatcher.extend(this);

    s.bind('kill', function() {
      sigma.plugins.killTooltips(s);
    });

    function contextmenuListener(event) {
      event.preventDefault();
    };

    /**
     * This function removes the existing tooltip and creates a new tooltip for a
     * specified node or edge.
     *
     * @param {object} o       The node or the edge.
     * @param {object} options The options related to the object.
     * @param {number} x       The X coordinate of the mouse.
     * @param {number} y       The Y coordinate of the mouse.
     */
    this.open = function(o, options, x, y) {
      remove();

      // Create the DOM element:
      _tooltip = document.createElement('div');
      if (options.renderer) {
        // Copy the object:
        var clone = Object.create(null),
            tooltipRenderer,
            k;
        for (k in o)
          clone[k] = o[k];

        tooltipRenderer = options.renderer.call(s.graph, clone, options.template);

        if (typeof tooltipRenderer === 'string')
           _tooltip.innerHTML = tooltipRenderer;
        else
            // tooltipRenderer is a dom element:
           _tooltip.appendChild(tooltipRenderer);
      } else {
        _tooltip.innerHTML = options.template;
      }

      // container position:
      var containerRect = renderer.container.getBoundingClientRect();
      x = ~~(x - containerRect.left);
      y = ~~(y - containerRect.top);

      // Style it:
      _tooltip.className = options.cssClass;

      if (options.position !== 'css') {
        _tooltip.style.position = 'relative';

        // Default position is mouse position:
        _tooltip.style.left = x + 'px';
        _tooltip.style.top = y + 'px';
      }

      // Execute after rendering:
      setTimeout(function() {
        if (!_tooltip)
          return;

        // Insert the element in the DOM:
        renderer.container.appendChild(_tooltip);

        // Find offset:
        var bodyRect = document.body.getBoundingClientRect(),
            tooltipRect = _tooltip.getBoundingClientRect(),
            offsetTop =  tooltipRect.top - bodyRect.top,
            offsetBottom = bodyRect.bottom - tooltipRect.bottom,
            offsetLeft =  tooltipRect.left - bodyRect.left,
            offsetRight = bodyRect.right - tooltipRect.right;

        if (options.position === 'top') {
          // New position vertically aligned and on top of the mouse:
          _tooltip.className = options.cssClass + ' top';
          _tooltip.style.left = x - (tooltipRect.width / 2) + 'px';
          _tooltip.style.top = y - tooltipRect.height + 'px';
        }
        else if (options.position === 'bottom') {
          // New position vertically aligned and on bottom of the mouse:
          _tooltip.className = options.cssClass + ' bottom';
          _tooltip.style.left = x - (tooltipRect.width / 2) + 'px';
          _tooltip.style.top = y + 'px';
        }
        else if (options.position === 'left') {
          // New position vertically aligned and on bottom of the mouse:
          _tooltip.className = options.cssClass+ ' left';
          _tooltip.style.left = x - tooltipRect.width + 'px';
          _tooltip.style.top = y - (tooltipRect.height / 2) + 'px';
        }
        else if (options.position === 'right') {
          // New position vertically aligned and on bottom of the mouse:
          _tooltip.className = options.cssClass + ' right';
          _tooltip.style.left = x + 'px';
          _tooltip.style.top = y - (tooltipRect.height / 2) + 'px';
        }

        // Adjust position to keep the tooltip inside body:
        // FIXME: doesn't work on Firefox
        if (options.autoadjust) {

          // Update offset
          tooltipRect = _tooltip.getBoundingClientRect();
          offsetTop = tooltipRect.top - bodyRect.top;
          offsetBottom = bodyRect.bottom - tooltipRect.bottom;
          offsetLeft = tooltipRect.left - bodyRect.left;
          offsetRight = bodyRect.right - tooltipRect.right;

          if (offsetBottom < 0) {
            _tooltip.className = options.cssClass;
            if (options.position === 'top' || options.position === 'bottom') {
              _tooltip.className = options.cssClass + ' top';
            }
            _tooltip.style.top = y - tooltipRect.height + 'px';
          }
          else if (offsetTop < 0) {
            _tooltip.className = options.cssClass;
            if (options.position === 'top' || options.position === 'bottom') {
              _tooltip.className = options.cssClass + ' bottom';
            }
            _tooltip.style.top = y + 'px';
          }
          if (offsetRight < 0) {
            //! incorrect tooltipRect.width on non fixed width element.
            _tooltip.className = options.cssClass;
            if (options.position === 'left' || options.position === 'right') {
              _tooltip.className = options.cssClass + ' left';
            }
            _tooltip.style.left = x - tooltipRect.width + 'px';
          }
          else if (offsetLeft < 0) {
            _tooltip.className = options.cssClass;
            if (options.position === 'left' || options.position === 'right') {
              _tooltip.className = options.cssClass + ' right';
            }
            _tooltip.style.left = x + 'px';
          }
        }
      }, 0);
    };

    /**
     * This function removes the tooltip element from the DOM.
     */
    function remove() {
      if (_tooltip && _tooltip.parentNode) {
        // Remove from the DOM:
        _tooltip.parentNode.removeChild(_tooltip);
        _tooltip = null;
      }
    };

    /**
     * This function clears a potential timeout function related to the tooltip
     * and removes the tooltip.
     */
    function cancel() {
      clearTimeout(_timeoutHandle);
      _timeoutHandle = false;
      remove();
    };

    // INTERFACE:
    this.close = function() {
      cancel();
      this.dispatchEvent('hidden');
      return this;
    };

    this.kill = function() {
      this.unbindEvents();
      _tooltip = null;
      _timeoutHandle = null;
      _doubleClick = false;
    }

    this.unbindEvents = function() {
      if (options.stage) {
        s.unbind(so.show);
        s.unbind(so.hide);
        if (so.show !== 'doubleClickStage') {
          s.unbind('doubleClickStage');
        }
      }
      if (options.node) {
        s.unbind(no.show);
        s.unbind(no.hide);
        if (no.show !== 'doubleClickNode') {
          s.unbind('doubleClickNode');
        }
      }
      if (options.edge) {
        s.unbind(eo.show);
        s.unbind(eo.hide);
        if (eo.show !== 'doubleClickEdge') {
          s.unbind('doubleClickEdge');
        }
      }
      if (no.show === 'rightClickNode' ||
          eo.show === 'rightClickEdge') {
        renderer.container.removeEventListener(
          'contextmenu',
          contextmenuListener
        );
      }
    };

    // STAGE tooltip:
    if (options.stage) {
      if (options.stage.renderer !== undefined &&
          typeof options.stage.renderer !== 'function')
        throw new TypeError('"options.stage.renderer" is not a function, was ' + options.stage.renderer);

      if (options.stage.position !== undefined) {
        if (options.stage.position !== 'top' &&
            options.stage.position !== 'bottom' &&
            options.stage.position !== 'left' &&
            options.stage.position !== 'right' &&
            options.stage.position !== 'css') {
          throw new Error('"options.position" is not "top", "bottom", "left", "right", or "css", was ' + options.position);
        }
      }

      s.bind(so.show, function(event) {
        if (so.show !== 'doubleClickStage' && _doubleClick) {
          return;
        }

        var clientX = event.data.captor.clientX,
            clientY = event.data.captor.clientY;

        clearTimeout(_timeoutHandle);
        _timeoutHandle = setTimeout(function() {
          self.open(
            null,
            so,
            clientX,
            clientY);

          self.dispatchEvent('shown', event.data);
        }, so.delay);
      });

      s.bind(so.hide, function(event) {
        var p = _tooltip;
        cancel();
        if (p)
          self.dispatchEvent('hidden', event.data);
      });

      if (so.show !== 'doubleClickStage') {
        s.bind('doubleClickStage', function(event) {
          cancel();
          _doubleClick = true;
          self.dispatchEvent('hidden', event.data);
          setTimeout(function() {
            _doubleClick = false;
          }, settings.doubleClickDelay);
        })
      }
    }

    // NODE tooltip:
    if (options.node) {
      if (options.node.renderer !== undefined &&
          typeof options.node.renderer !== 'function')
        throw new TypeError('"options.node.renderer" is not a function, was ' + options.node.renderer);

      if (options.node.position !== undefined) {
        if (options.node.position !== 'top' &&
            options.node.position !== 'bottom' &&
            options.node.position !== 'left' &&
            options.node.position !== 'right' &&
            options.node.position !== 'css') {
          throw new Error('"options.position" is not "top", "bottom", "left", "right", or "css", was ' + options.position);
        }
      }

      s.bind(no.show, function(event) {
        if (no.show !== 'doubleClickNode' && _doubleClick) {
          return;
        }

        var n = event.data.node || event.data.nodes[0],
            clientX = event.data.captor.clientX,
            clientY = event.data.captor.clientY;

        clearTimeout(_timeoutHandle);
        _timeoutHandle = setTimeout(function() {
          self.open(
            n,
            no,
            clientX,
            clientY);

          self.dispatchEvent('shown', event.data);
        }, no.delay);
      });

      s.bind(no.hide, function(event) {
        var p = _tooltip;
        cancel();
        if (p)
          self.dispatchEvent('hidden', event.data);
      });

      if (no.show !== 'doubleClickNode') {
        s.bind('doubleClickNode', function(event) {
          cancel();
          _doubleClick = true;
          self.dispatchEvent('hidden', event.data);
          setTimeout(function() {
            _doubleClick = false;
          }, settings.doubleClickDelay);
        })
      }
    }

    // EDGE tooltip:
    if (options.edge) {
      if (options.edge.renderer !== undefined &&
          typeof options.edge.renderer !== 'function')
        throw new TypeError('"options.edge.renderer" is not a function, was ' + options.edge.renderer);

      if (options.edge.position !== undefined) {
        if (options.edge.position !== 'top' &&
            options.edge.position !== 'bottom' &&
            options.edge.position !== 'left' &&
            options.edge.position !== 'right' &&
            options.edge.position !== 'css') {
          throw new Error('"options.position" is not "top", "bottom", "left", "right", or "css", was ' + options.position);
        }
      }

      s.bind(eo.show, function(event) {
        if (eo.show !== 'doubleClickEdge' && _doubleClick) {
          return;
        }

        var e = event.data.edge || event.data.edges[0],
            clientX = event.data.captor.clientX,
            clientY = event.data.captor.clientY;

        clearTimeout(_timeoutHandle);
        _timeoutHandle = setTimeout(function() {
          self.open(
            e,
            eo,
            clientX,
            clientY);

          self.dispatchEvent('shown', event.data);
        }, eo.delay);
      });

      s.bind(eo.hide, function(event) {
        var p = _tooltip;
        cancel();
        if (p)
          self.dispatchEvent('hidden', event.data);
      });

      if (eo.show !== 'doubleClickEdge') {
        s.bind('doubleClickEdge', function(event) {
          cancel();
          _doubleClick = true;
          self.dispatchEvent('hidden', event.data);
          setTimeout(function() {
            _doubleClick = false;
          }, settings.doubleClickDelay);
        })
      }
    }

    // Prevent the browser context menu to appear
    // if the right click event is already handled:
    if (no.show === 'rightClickNode' || eo.show === 'rightClickEdge') {
      renderer.container.addEventListener(
        'contextmenu',
        contextmenuListener
      );
    }
  };

  /**
   * Interface
   * ------------------
   */
  var _instance = {};

  /**
   * @param {sigma}    s        The related sigma instance.
   * @param {renderer} renderer The related sigma renderer.
   * @param {object}   options  An object with options.
   */
  sigma.plugins.tooltips = function(s, renderer, options) {
    // Create object if undefined
    if (!_instance[s.id]) {
      _instance[s.id] = new Tooltips(s, renderer, options);
    }
    return _instance[s.id];
  };

  /**
   *  This function kills the tooltips instance.
   */
  sigma.plugins.killTooltips = function(s) {
    if (_instance[s.id] instanceof Tooltips) {
      _instance[s.id].kill();
    }
    delete _instance[s.id];
  };

}).call(window);
