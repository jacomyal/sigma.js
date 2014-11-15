;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Packages initialization:
  sigma.utils.pkg('sigma.settings');

  var settings = {
    /**
     * GRAPH SETTINGS:
     * ***************
     */
    // {boolean} Indicates if the data have to be cloned in methods to add
    //           nodes or edges.
    clone: true,
    // {boolean} Indicates if nodes "id" values and edges "id", "source" and
    //           "target" values must be set as immutable.
    immutable: true,
    // {boolean} Indicates if sigma can log its errors and warnings.
    verbose: false,


    /**
     * RENDERERS SETTINGS:
     * *******************
     */
    // {string}
    classPrefix: 'sigma',
    // {string}
    defaultNodeType: 'def',
    // {string}
    defaultEdgeType: 'def',
    // {string}
    defaultLabelColor: '#000',
    // {string}
    defaultEdgeColor: '#000',
    // {string}
    defaultNodeColor: '#000',
    // {string}
    defaultLabelSize: 14,
    // {string} Indicates how to choose the edges color. Available values:
    //          "source", "target", "default"
    edgeColor: 'source',
    // {number} Defines the minimal edge's arrow display size.
    minArrowSize: 0,
    // {string}
    font: 'arial',
    // {string} Example: 'bold'
    fontStyle: '',
    // {string} Indicates how to choose the labels color. Available values:
    //          "node", "default"
    labelColor: 'default',
    // {string} Indicates how to choose the labels size. Available values:
    //          "fixed", "proportional"
    labelSize: 'fixed',
    // {string} The ratio between the font size of the label and the node size.
    labelSizeRatio: 1,
    // {number} The minimum size a node must have to see its label displayed.
    labelThreshold: 8,
    // {number} The oversampling factor used in WebGL renderer.
    webglOversamplingRatio: 2,
    // {number} The size of the border of hovered nodes.
    borderSize: 0,
    // {number} The default hovered node border's color.
    defaultNodeBorderColor: '#000',
    // {number} The hovered node's label font. If not specified, will heritate
    //          the "font" value.
    hoverFont: '',
    // {boolean} If true, then only one node can be hovered at a time.
    singleHover: false,
    // {string} Example: 'bold'
    hoverFontStyle: '',
    // {string} Indicates how to choose the hovered nodes shadow color.
    //          Available values: "node", "default"
    labelHoverShadow: 'default',
    // {string}
    labelHoverShadowColor: '#000',
    // {string} Indicates how to choose the hovered nodes color.
    //          Available values: "node", "default"
    nodeHoverColor: 'node',
    // {string}
    defaultNodeHoverColor: '#000',
    // {string} Indicates how to choose the hovered nodes background color.
    //          Available values: "node", "default"
    labelHoverBGColor: 'default',
    // {string}
    defaultHoverLabelBGColor: '#fff',
    // {string} Indicates how to choose the hovered labels color.
    //          Available values: "node", "default"
    labelHoverColor: 'default',
    // {string}
    defaultLabelHoverColor: '#000',
    // {string} Indicates how to choose the edges hover color. Available values:
    //          "edge", "default"
    edgeHoverColor: 'edge',
    // {number} The size multiplicator of hovered edges.
    edgeHoverSizeRatio: 1,
    // {string}
    defaultEdgeHoverColor: '#000',
    // {boolean} Indicates if the edge extremities must be hovered when the
    //           edge is hovered.
    edgeHoverExtremities: false,
    // {booleans} The different drawing modes:
    //           false: Layered not displayed.
    //           true: Layered displayed.
    drawEdges: true,
    drawNodes: true,
    drawLabels: true,
    drawEdgeLabels: false,
    // {boolean} Indicates if the edges must be drawn in several frames or in
    //           one frame, as the nodes and labels are drawn.
    batchEdgesDrawing: false,
    // {boolean} Indicates if the edges must be hidden during dragging and
    //           animations.
    hideEdgesOnMove: false,
    // {numbers} The different batch sizes, when elements are displayed in
    //           several frames.
    canvasEdgesBatchSize: 500,
    webglEdgesBatchSize: 1000,




    /**
     * RESCALE SETTINGS:
     * *****************
     */
    // {string} Indicates of to scale the graph relatively to its container.
    //          Available values: "inside", "outside"
    scalingMode: 'inside',
    // {number} The margin to keep around the graph.
    sideMargin: 0,
    // {number} Determine the size of the smallest and the biggest node / edges
    //          on the screen. This mapping makes easier to display the graph,
    //          avoiding too big nodes that take half of the screen, or too
    //          small ones that are not readable. If the two parameters are
    //          equals, then the minimal display size will be 0. And if they
    //          are both equal to 0, then there is no mapping, and the radius
    //          of the nodes will be their size.
    minEdgeSize: 0.5,
    maxEdgeSize: 1,
    minNodeSize: 1,
    maxNodeSize: 8,




    /**
     * CAPTORS SETTINGS:
     * *****************
     */
    // {boolean}
    touchEnabled: true,
    // {boolean}
    mouseEnabled: true,
    // {boolean}
    mouseWheelEnabled: true,
    // {boolean}
    doubleClickEnabled: true,
    // {boolean} Defines whether the custom events such as "clickNode" can be
    //           used.
    eventsEnabled: true,
    // {number} Defines by how much multiplicating the zooming level when the
    //          user zooms with the mouse-wheel.
    zoomingRatio: 1.7,
    // {number} Defines by how much multiplicating the zooming level when the
    //          user zooms by double clicking.
    doubleClickZoomingRatio: 2.2,
    // {number} The minimum zooming level.
    zoomMin: 0.0625,
    // {number} The maximum zooming level.
    zoomMax: 2,
    // {number} The duration of animations following a mouse scrolling.
    mouseZoomDuration: 200,
    // {number} The duration of animations following a mouse double click.
    doubleClickZoomDuration: 200,
    // {number} The duration of animations following a mouse dropping.
    mouseInertiaDuration: 200,
    // {number} The inertia power (mouse captor).
    mouseInertiaRatio: 3,
    // {number} The duration of animations following a touch dropping.
    touchInertiaDuration: 200,
    // {number} The inertia power (touch captor).
    touchInertiaRatio: 3,
    // {number} The maximum time between two clicks to make it a double click.
    doubleClickTimeout: 300,
    // {number} The maximum time between two taps to make it a double tap.
    doubleTapTimeout: 300,
    // {number} The maximum time of dragging to trigger intertia.
    dragTimeout: 200,




    /**
     * GLOBAL SETTINGS:
     * ****************
     */
    // {boolean} Determines whether the instance has to refresh itself
    //           automatically when a "resize" event is dispatched from the
    //           window object.
    autoResize: true,
    // {boolean} Determines whether the "rescale" middleware has to be called
    //           automatically for each camera on refresh.
    autoRescale: true,
    // {boolean} If set to false, the camera method "goTo" will basically do
    //           nothing.
    enableCamera: true,
    // {boolean} If set to false, the nodes cannot be hovered.
    enableHovering: true,
    // {boolean} If set to true, the edges can be hovered.
    enableEdgeHovering: false,
    // {number} The size of the area around the edges to activate hovering.
    edgeHoverPrecision: 5,
    // {boolean} If set to true, the rescale middleware will ignore node sizes
    //           to determine the graphs boundings.
    rescaleIgnoreSize: false,
    // {boolean} Determines if the core has to try to catch errors on
    //           rendering.
    skipErrors: false,




    /**
     * CAMERA SETTINGS:
     * ****************
     */
    // {number} The power degrees applied to the nodes/edges size relatively to
    //          the zooming level. Basically:
    //           > onScreenR = Math.pow(zoom, nodesPowRatio) * R
    //           > onScreenT = Math.pow(zoom, edgesPowRatio) * T
    nodesPowRatio: 0.5,
    edgesPowRatio: 0.5,




    /**
     * ANIMATIONS SETTINGS:
     * ********************
     */
    // {number} The default animation time.
    animationsTime: 200
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);
}).call(this);
