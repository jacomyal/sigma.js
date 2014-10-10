/**
 * This plugin provides a method to display a tooltip at a specific event, e.g.
 * to display some node properties on node hover. Check the
 * sigma.plugins.tooltip function doc or the examples/tooltip.html code sample
 * to know more.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

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

  var _tooltip,
      _timeoutHandle,
      _doubleClick = false;


  /**
   * Helpers
   */
  function extend() {
    var i,
        k,
        res = {},
        l = arguments.length;

    for (i = l - 1; i >= 0; i--)
      for (k in arguments[i])
        res[k] = arguments[i][k];
    return res;
  };

  /**
   * This function removes the existing tooltip and creates a new tooltip for a
   * specified node or edge.
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the settings
   * object:
   *
   *   {?string}   template   The HTML template. It is directly inserted inside
   *                          a div element unless a renderer is specified.
   *   {?function} renderer   This function may process the template or be used
   *                          independently. It should return an HTML string.
   *                          It is executed at runtime. Its context is
   *                          sigma.graph.
   *   {?string}   cssClass   The CSS class attached to the top div element.
   *                          Default value: "sigma-tooltip".
   *   {?string}   position   The position of the tooltip regarding the mouse.
   *                          If it is not specified, the tooltip top-left
   *                          corner is positionned at the mouse position.
   *                          Available values: "top", "bottom", "left",
   *                          "right".
   *   {?boolean}  autoadjust [EXPERIMENTAL] If true, tries to adjust the
   *                          tooltip position to be fully included in the body
   *                          area. Doesn't work on Firefox 30. Better work on
   *                          elements with fixed width and height.
   *
   * @param {sigma}  s       The related sigma instance.
   * @param {object} o       The node or the edge.
   * @param {object} options The options related to the object.
   * @param {number} x       The X coordinate of the mouse.
   * @param {number} y       The Y coordinate of the mouse.
   */
  function createTooltip(s, o, options, x, y) {
    removeTooltip();

    // Create the DOM element:
    _tooltip = document.createElement('div');
    if (options.renderer) {
      // Copy the object:
      var clone = Object.create(null),
          renderer, 
          k;
      for (k in o)
        clone[k] = o[k];

      renderer = options.renderer.call(s.graph, clone, options.template);

      if (typeof renderer === 'string')
         _tooltip.innerHTML = renderer;
      else
          // renderer is a dom element:
         _tooltip.appendChild(renderer);
    } else {
      _tooltip.innerHTML = options.template;
    }

    // Style it:
    _tooltip.className = options.cssClass;
    _tooltip.style.position = 'absolute';

    // Default position is mouse position:
    _tooltip.style.left = x + 'px';
    _tooltip.style.top = y + 'px';

    // Execute after rendering:
    setTimeout(function() {
      if (!_tooltip)
        return;

      // Insert the element in the DOM:
      s.renderers[0].container.appendChild(_tooltip);

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
  function removeTooltip() {
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
  function cancelTooltip() {
    clearTimeout(_timeoutHandle);
    _timeoutHandle = false;
    removeTooltip();
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
   * @param {sigma}  s       The related sigma instance.
   * @param {object} options An object with options.
   */
  function Tooltips(s, options) {
    var so = extend(options.stage, settings.stage);
    var no = extend(options.node, settings.node);
    var eo = extend(options.edge, settings.edge);

    sigma.classes.dispatcher.extend(this);

    s.bind('kill', function() {
      sigma.plugins.killTooltips();
    });

    function contextmenuListener(event) {
      event.preventDefault();
    };

    // INTERFACE:
    this.close = function() {
      cancelTooltip();
      return this;
    };

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
        s.renderers[0].container.removeEventListener(
          'contextmenu',
          contextmenuListener
        );
      }
    };

    // STAGE tooltip:
    if (options.stage) {
      if (options.stage.renderer !== undefined &&
          typeof options.stage.renderer !== 'function')
        throw 'The render of the stage tooltip must be a function.';

      if (options.stage.position !== undefined) {
        if (options.stage.position !== 'top' &&
            options.stage.position !== 'bottom' &&
            options.stage.position !== 'left' &&
            options.stage.position !== 'right') {
          throw 'The value of options.position must be either: top, bottom, left, right.';
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
          createTooltip(
            s,
            null,
            so,
            clientX,
            clientY);

          _instance.dispatchEvent('shown');
        }, so.delay);     
      });

      s.bind(so.hide, function(event) {
        var p = _tooltip;
        cancelTooltip();
        if (p)
          _instance.dispatchEvent('hidden');
      });

      if (so.show !== 'doubleClickStage') {
        s.bind('doubleClickStage', function(event) {
          cancelTooltip();
          _doubleClick = true;
          _instance.dispatchEvent('hidden');
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
        throw 'The render of the node tooltip must be a function.';

      if (options.node.position !== undefined) {
        if (options.node.position !== 'top' &&
            options.node.position !== 'bottom' &&
            options.node.position !== 'left' &&
            options.node.position !== 'right') {
          throw 'The value of options.position must be either: top, bottom, left, right.';
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
          createTooltip(
            s,
            n,
            no,
            clientX,
            clientY);

          _instance.dispatchEvent('shown');
        }, no.delay);     
      });

      s.bind(no.hide, function(event) {
        var p = _tooltip;
        cancelTooltip();
        if (p)
          _instance.dispatchEvent('hidden');
      });

      if (no.show !== 'doubleClickNode') {
        s.bind('doubleClickNode', function(event) {
          cancelTooltip();
          _doubleClick = true;
          _instance.dispatchEvent('hidden');
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
        throw 'The render of the edge tooltip must be a function.';

      if (options.edge.position !== undefined) {
        if (options.edge.position !== 'top' &&
            options.edge.position !== 'bottom' &&
            options.edge.position !== 'left' &&
            options.edge.position !== 'right') {
          throw 'The value of options.position must be either: top, bottom, left, right.';
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
          createTooltip(
            s,
            e,
            eo,
            clientX,
            clientY);

          _instance.dispatchEvent('shown');
        }, eo.delay);     
      });

      s.bind(eo.hide, function(event) {
        var p = _tooltip;
        cancelTooltip();
        if (p)
          _instance.dispatchEvent('hidden');
      });

      if (eo.show !== 'doubleClickEdge') {
        s.bind('doubleClickEdge', function(event) {
          cancelTooltip();
          _doubleClick = true;
          _instance.dispatchEvent('hidden');
          setTimeout(function() {
            _doubleClick = false;
          }, settings.doubleClickDelay);
        })
      }
    }

    // Prevent the browser context menu to appear
    // if the right click event is already handled:
    if (no.show === 'rightClickNode' || eo.show === 'rightClickEdge') {
      s.renderers[0].container.addEventListener(
        'contextmenu',
        contextmenuListener
      );
    }
  };

  /**
   * Interface
   * ------------------
   */
  var _instance = null;

  /**
   * @param {sigma}  s       The related sigma instance.
   * @param {object} options An object with options.
   */
  sigma.plugins.tooltips = function(s, options) {
    // Create object if undefined
    if (!_instance) {
      _instance = new Tooltips(s, options);
    }
    return _instance;
  };

  /**
   *  This function kills the tooltips instance.
   */
  sigma.plugins.killTooltips = function() {
    if (_instance instanceof Tooltips) {
      _instance.unbindEvents();
      _instance = null;
      _tooltip = null;
      _timeoutHandle = null;
      _doubleClick = false;
    }
  };

}).call(window);
