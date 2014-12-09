;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  /**
   * This helper will bind any DOM renderer (for instance svg)
   * to its captors, to properly dispatch the good events to the sigma instance
   * to manage clicking, hovering etc...
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.misc.bindDOMEvents = function(container) {
    var self = this,
        graph = this.graph;

    // DOMElement abstraction
    function Element(domElement) {

      // Helpers
      this.attr = function(attrName) {
        return domElement.getAttributeNS(null, attrName);
      };

      // Properties
      this.tag = domElement.tagName;
      this.class = this.attr('class');
      this.id = this.attr('id');

      // Methods
      this.isNode = function() {
        return !!~this.class.indexOf(self.settings('classPrefix') + '-node');
      };

      this.isEdge = function() {
        return !!~this.class.indexOf(self.settings('classPrefix') + '-edge');
      };

      this.isHover = function() {
        return !!~this.class.indexOf(self.settings('classPrefix') + '-hover');
      };
    }

    // Click
    function click(e) {
      if (!self.settings('eventsEnabled'))
        return;

      // Generic event
      self.dispatchEvent('click', e);

      // Are we on a node?
      var element = new Element(e.target);

      if (element.isNode())
        self.dispatchEvent('clickNode', {
          node: graph.nodes(element.attr('data-node-id'))
        });
      else
        self.dispatchEvent('clickStage');

      e.preventDefault();
      e.stopPropagation();
    }

    // Double click
    function doubleClick(e) {
      if (!self.settings('eventsEnabled'))
        return;

      // Generic event
      self.dispatchEvent('doubleClick', e);

      // Are we on a node?
      var element = new Element(e.target);

      if (element.isNode())
        self.dispatchEvent('doubleClickNode', {
          node: graph.nodes(element.attr('data-node-id'))
        });
      else
        self.dispatchEvent('doubleClickStage');

      e.preventDefault();
      e.stopPropagation();
    }

    // On down
    function onDown(e) {
      var target = e.toElement || e.target;

      if (!self.settings('eventsEnabled') || !target)
        return;

      var el = new Element(target);

      if (el.isNode()) {
        self.dispatchEvent('downNode', {
          node: graph.nodes(el.attr('data-node-id'))
        });
      }
      else if (el.isEdge()) {
        var edge = graph.edges(el.attr('data-edge-id'));
        self.dispatchEvent('downEdge', {
          edge: edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }

      e.preventDefault();
    }

    // On over
    function onOver(e) {
      var target = e.toElement || e.target;
      // firefox fires mouseover events when user clicks the node
      // and the event has null as its source target
      var srcTarget = e.fromElement || e.relatedTarget;
      if (!self.settings('eventsEnabled') || !target || !srcTarget)
        return;

      var el = new Element(target);

      if (el.isNode()) {
        self.dispatchEvent('overNode', {
          node: graph.nodes(el.attr('data-node-id'))
        });
      }
      else if (el.isEdge()) {
        var edge = graph.edges(el.attr('data-edge-id'));
        self.dispatchEvent('overEdge', {
          edge: edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }
    }

    // On out
    function onOut(e) {
      var target = e.fromElement || e.relatedTarget;

      if (!self.settings('eventsEnabled'))
        return;

      var el = new Element(target);

      if (el.isNode()) {
        self.dispatchEvent('outNode', {
          node: graph.nodes(el.attr('data-node-id'))
        });
      }
      else if (el.isEdge()) {
        var edge = graph.edges(el.attr('data-edge-id'));
        self.dispatchEvent('outEdge', {
          edge: edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }
    }

    // On up
    function onUp(e) {
      var target = e.toElement || e.target;

      if (!self.settings('eventsEnabled') || !target)
        return;

      var el = new Element(target);

      if (el.isNode()) {
        self.dispatchEvent('upNode', {
          node: graph.nodes(el.attr('data-node-id'))
        });
      }
      else if (el.isEdge()) {
        var edge = graph.edges(el.attr('data-edge-id'));
        self.dispatchEvent('upEdge', {
          edge: edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }

      e.preventDefault();
    }

    // Registering Events:

    // Click
    container.addEventListener('click', click, false);
    sigma.utils.doubleClick(container, 'click', doubleClick);

    // Touch counterparts
    container.addEventListener('touchstart', click, false);
    sigma.utils.doubleClick(container, 'touchstart', doubleClick);

    // Mousedown
    container.addEventListener('mousedown', onDown, true);

    // Mouseover
    container.addEventListener('mouseover', onOver, true);

    // Mouseout
    container.addEventListener('mouseout', onOut, true);

    // Mouseup
    container.addEventListener('mouseup', onUp, true);

  };
}).call(this);
