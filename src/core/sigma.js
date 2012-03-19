/**
 * Sigma is the main class. It represents the core of any instance id sigma.js.
 * It is private and can be initialized only from inside sigma.js. To see its
 * public interface, see {@link SigmaPublic}.
 * It owns its own {@link Graph}, {@link MouseCaptor}, {@link Plotter}
 * and {@link Monitor}.
 * @constructor
 * @extends sigma.classes.Cascade
 * @extends sigma.classes.EventDispatcher
 * @param {element} root The DOM root of this instance (a div, for example).
 * @param {string} id    The ID of this instance.
 * @this {Sigma}
 */
function Sigma(root, id) {
  sigma.classes.Cascade.call(this);
  sigma.classes.EventDispatcher.call(this);

  /**
   * Represents "this", without the well-known scope issue.
   * @private
   * @type {Sigma}
   */
  var self = this;

  /**
   * The ID of the instance.
   * @type {string}
   */
  this.id = id.toString();

  /**
   * The different parameters that define how this instance should work.
   * @see sigma.classes.Cascade
   * @type {Object}
   */
  this.p = {
    auto: true,
    drawNodes: 2,
    drawEdges: 1,
    drawLabels: 2,
    lastNodes: 2,
    lastEdges: 0,
    lastLabels: 2,
    drawHoverNodes: true,
    drawActiveNodes: true
  };

  /**
   * The root DOM element of this instance, containing every other elements.
   * @type {element}
   */
  this.domRoot = root;

  /**
   * The width of this instance - initially, the root's width.
   * @type {number}
   */
  this.width = this.domRoot.offsetWidth;

  /**
   * The height of this instance - initially, the root's height.
   * @type {number}
   */
  this.height = this.domRoot.offsetHeight;

  /**
   * The graph of this instance - initiallyempty.
   * @type {Graph}
   */
  this.graph = new Graph();

  /**
   * An object referencing every DOM elements used by this instance.
   * @type {Object}
   */
  this.domElements = {};

  initDOM('edges', 'canvas');
  initDOM('nodes', 'canvas');
  initDOM('labels', 'canvas');
  initDOM('hover', 'canvas');
  initDOM('monitor', 'div');
  initDOM('mouse', 'canvas');

  /**
   * The class dedicated to manage the drawing process of the graph of the
   * different canvas.
   * @type {Plotter}
   */
  this.plotter = new Plotter(
    this.domElements.nodes.getContext('2d'),
    this.domElements.edges.getContext('2d'),
    this.domElements.labels.getContext('2d'),
    this.domElements.hover.getContext('2d'),
    this.graph,
    this.width,
    this.height
  );

  /**
   * The class dedicated to monitor different probes about the running
   * processes or the data, such as the number of nodes or edges, or how
   * many times the graph is drawn per second.
   * @type {Monitor}
   */
  this.monitor = new Monitor(
    this,
    this.domElements.monitor
  );

  /**
   * The class dedicated to manage the different mouse events.
   * @type {MouseCaptor}
   */
  this.mousecaptor = new MouseCaptor(
    this.domElements.mouse,
    this.id
  );

  // Interaction listeners:
  this.mousecaptor.bind('drag interpolate', function(e) {
    self.draw(
      self.p.auto ? 2 : self.p.drawNodes,
      self.p.auto ? 0 : self.p.drawEdges,
      self.p.auto ? 2 : self.p.drawLabels,
      true
    );
  }).bind('stopdrag stopinterpolate', function(e) {
    self.draw(
      self.p.auto ? 2 : self.p.drawNodes,
      self.p.auto ? 1 : self.p.drawEdges,
      self.p.auto ? 2 : self.p.drawLabels,
      true
    );
  }).bind('mousedown mouseup', function(e) {
    var targeted = self.graph.nodes.filter(function(n) {
      return !!n['hover'];
    }).map(function(n) {
      return n.id;
    });

    self.dispatch(
      e['type'] == 'mousedown' ?
        'downgraph' :
        'upgraph'
    );

    if (targeted.length) {
      self.dispatch(
        e['type'] == 'mousedown' ?
          'downnodes' :
          'upnodes',
        targeted
      );
    }
  }).bind('move', function() {
    self.domElements.hover.getContext('2d').clearRect(
      0,
      0,
      self.domElements.hover.width,
      self.domElements.hover.height
    );

    drawHover();
    drawActive();
  });

  sigma.chronos.bind('startgenerators', function() {
    if (sigma.chronos.getGeneratorsIDs().some(function(id) {
      return !!id.match(new RegExp('_ext_' + self.id + '$', ''));
    })) {
      self.draw(
        self.p.auto ? 2 : self.p.drawNodes,
        self.p.auto ? 0 : self.p.drawEdges,
        self.p.auto ? 2 : self.p.drawLabels
      );
    }
  }).bind('stopgenerators', function() {
    self.draw();
  });

  /**
   * Resizes the element, and redraws the graph with the last settings.
   * @param  {?number} w The new width (if undefined, it will use the root
   *                     width).
   * @param  {?number} h The new height (if undefined, it will use the root
   *                     height).
   * @return {Sigma} Returns itself.
   */
  function resize(w, h) {
    var oldW = self.width, oldH = self.height;

    if (w != undefined && h != undefined) {
      self.width = w;
      self.height = h;
    }else {
      self.width = self.domRoot.offsetWidth;
      self.height = self.domRoot.offsetHeight;
    }

    if (oldW != self.width || oldH != self.height) {
      for (var k in self.domElements) {
        self.domElements[k].setAttribute('width', self.width + 'px');
        self.domElements[k].setAttribute('height', self.height + 'px');
      }

      self.plotter.resize(self.width, self.height);

      self.draw(
        self.p.lastNodes,
        self.p.lastEdges,
        self.p.lastLabels,
        true
      );
    }
    return self;
  };

  /**
   * Kills every drawing task currently running. Basically, it stops this
   * instance's drawing process.
   * @return {Sigma} Returns itself.
   */
  function clearSchedule() {
    sigma.chronos.removeTask(
      'node_' + self.id, 2
    ).removeTask(
      'edge_' + self.id, 2
    ).removeTask(
      'label_' + self.id, 2
    ).stopTasks();
    return self;
  };

  /**
   * Initialize a DOM element, that will be stores by this instance, to make
   * automatic these elements resizing.
   * @private
   * @param  {string} id   The element's ID.
   * @param  {string} type The element's nodeName (Example : canvas, div, ...).
   * @return {Sigma} Returns itself.
   */
  function initDOM(id, type) {
    self.domElements[id] = document.createElement(type);
    self.domElements[id].style.position = 'absolute';
    self.domElements[id].setAttribute('id', 'sigma_' + id + '_' + self.id);
    self.domElements[id].setAttribute('class', 'sigma_' + id + '_' + type);
    self.domElements[id].setAttribute('width', self.width + 'px');
    self.domElements[id].setAttribute('height', self.height + 'px');

    self.domRoot.appendChild(self.domElements[id]);
    return self;
  };

  /**
   * Starts the graph drawing process. The three first parameters indicate
   * how the different layers have to be drawn:
   * . -1: The layer is not drawn, but it is not erased.
   * . 0:  The layer is not drawn.
   * . 1:  The layer is drawn progressively.
   * . 2:  The layer is drawn directly.
   * @param  {?number} nodes  Determines if and how the nodes must be drawn.
   * @param  {?number} edges  Determines if and how the edges must be drawn.
   * @param  {?number} labels Determines if and how the labels must be drawn.
   * @param  {?boolean} safe  If true, nothing will happen if any generator
   *                          affiliated to this instance is currently running
   *                          (an iterative layout, for example).
   * @return {Sigma} Returns itself.
   */
  function draw(nodes, edges, labels, safe) {
    if (safe && sigma.chronos.getGeneratorsIDs().some(function(id) {
      return !!id.match(new RegExp('_ext_' + self.id + '$', ''));
    })) {
      return self;
    }

    var n = (nodes == undefined) ? self.p.drawNodes : nodes;
    var e = (edges == undefined) ? self.p.drawEdges : edges;
    var l = (labels == undefined) ? self.p.drawLabels : labels;

    var params = {
      nodes: n,
      edges: e,
      labels: l
    };

    self.p.lastNodes = n;
    self.p.lastEdges = e;
    self.p.lastLabels = l;

    // Remove tasks:
    clearSchedule();

    // Rescale graph:
    self.graph.rescale(
      self.width,
      self.height,
      n > 0,
      e > 0
    ).setBorders();

    self.mousecaptor.checkBorders(
      self.graph.borders,
      self.width,
      self.height
    );

    self.graph.translate(
      self.mousecaptor.stageX,
      self.mousecaptor.stageY,
      self.mousecaptor.ratio,
      n > 0,
      e > 0
    );

    self.dispatch(
      'graphscaled'
    );

    // Clear scene:
    for (var k in self.domElements) {
      if (
        self.domElements[k].nodeName.toLowerCase() == 'canvas' &&
        (params[k] == undefined || params[k] >= 0)
      ) {
        self.domElements[k].getContext('2d').clearRect(
          0,
          0,
          self.domElements[k].width,
          self.domElements[k].height
        );
      }
    }

    self.plotter.currentEdgeIndex = 0;
    self.plotter.currentNodeIndex = 0;
    self.plotter.currentLabelIndex = 0;

    var previous = null;
    var start = false;

    if (n) {
      if (n > 1) {
        while (self.plotter.task_drawNode()) {}
      }else {
        sigma.chronos.addTask(
          self.plotter.task_drawNode,
          'node_' + self.id,
          false
        );

        start = true;
        previous = 'node_' + self.id;
      }
    }

    if (l) {
      if (l > 1) {
        while (self.plotter.task_drawLabel()) {}
      } else {
        if (previous) {
          sigma.chronos.queueTask(
            self.plotter.task_drawLabel,
            'label_' + self.id,
            previous
          );
        } else {
          sigma.chronos.addTask(
            self.plotter.task_drawLabel,
            'label_' + self.id,
            false
          );
        }

        start = true;
        previous = 'label_' + self.id;
      }
    }

    if (e) {
      if (e > 1) {
        while (self.plotter.task_drawEdge()) {}
      }else {
        if (previous) {
          sigma.chronos.queueTask(
            self.plotter.task_drawEdge,
            'edge_' + self.id,
            previous
          );
        }else {
          sigma.chronos.addTask(
            self.plotter.task_drawEdge,
            'edge_' + self.id,
            false
          );
        }

        start = true;
        previous = 'edge_' + self.id;
      }
    }

    self.dispatch(
      'draw'
    );

    self.refresh();

    start && sigma.chronos.runTasks();
    return self;
  };

  /**
   * Draws the hover and active nodes labels.
   * @return {Sigma} Returns itself.
   */
  function refresh() {
    self.domElements.hover.getContext('2d').clearRect(
      0,
      0,
      self.domElements.hover.width,
      self.domElements.hover.height
    );

    drawHover();
    drawActive();

    return self;
  }

  /**
   * Draws the hover nodes labels. This method is applied directly, and does
   * not use the pseudo-asynchronous tasks process.
   * @return {Sigma} Returns itself.
   */
  function drawHover() {
    if (self.p.drawHoverNodes) {
      self.graph.checkHover(
        self.mousecaptor.mouseX,
        self.mousecaptor.mouseY
      );

      self.graph.nodes.forEach(function(node) {
        if (node.hover && !node.active) {
          self.plotter.drawHoverNode(node);
        }
      });
    }

    return self;
  }

  /**
   * Draws the active nodes labels. This method is applied directly, and does
   * not use the pseudo-asynchronous tasks process.
   * @return {Sigma} Returns itself.
   */
  function drawActive() {
    if (self.p.drawActiveNodes) {
      self.graph.nodes.forEach(function(node) {
        if (node.active) {
          self.plotter.drawActiveNode(node);
        }
      });
    }

    return self;
  }

  // Apply plugins:
  for (var i = 0; i < local.plugins.length; i++) {
    local.plugins[i](this);
  }

  this.draw = draw;
  this.resize = resize;
  this.refresh = refresh;
  this.drawHover = drawHover;
  this.drawActive = drawActive;
  this.clearSchedule = clearSchedule;

  window.addEventListener('resize', function() {
    self.resize();
  });
}

