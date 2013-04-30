/**
 * This class draws the graph on the different canvas DOM elements. It just
 * contains all the different methods to draw the graph, synchronously or
 * pseudo-asynchronously.
 * @constructor
 * @param {CanvasRenderingContext2D} nodesCtx  Context dedicated to draw nodes.
 * @param {CanvasRenderingContext2D} edgesCtx  Context dedicated to draw edges.
 * @param {CanvasRenderingContext2D} labelsCtx Context dedicated to draw
 *                                             labels.
 * @param {CanvasRenderingContext2D} hoverCtx  Context dedicated to draw hover
 *                                             nodes labels.
 * @param {Graph} graph                        A reference to the graph to
 *                                             draw.
 * @param {number} w                           The width of the DOM root
 *                                             element.
 * @param {number} h                           The width of the DOM root
 *                                             element.
 * @extends sigma.classes.Cascade
 * @this {Plotter}
 */
function Plotter(nodesCtx, edgesCtx, labelsCtx, hoverCtx, graph, w, h) {
  sigma.classes.Cascade.call(this);

  /**
   * Represents "this", without the well-known scope issue.
   * @private
   * @type {Plotter}
   */
  var self = this;

  /**
   * The different parameters that define how this instance should work.
   * @see sigma.classes.Cascade
   * @type {Object}
   */
  this.p = {
    // -------
    // LABELS:
    // -------
    //   Label color:
    //   - 'node'
    //   - default (then defaultLabelColor
    //              will be used instead)
    labelColor: 'default',
    defaultLabelColor: '#000',
    //   Label hover background color:
    //   - 'node'
    //   - default (then defaultHoverLabelBGColor
    //              will be used instead)
    labelHoverBGColor: 'default',
    defaultHoverLabelBGColor: '#fff',
    //   Label hover shadow:
    labelHoverShadow: true,
    labelHoverShadowColor: '#000',
    //   Label hover color:
    //   - 'node'
    //   - default (then defaultLabelHoverColor
    //              will be used instead)
    labelHoverColor: 'default',
    defaultLabelHoverColor: '#000',
    //   Label active background color:
    //   - 'node'
    //   - default (then defaultActiveLabelBGColor
    //              will be used instead)
    labelActiveBGColor: 'default',
    defaultActiveLabelBGColor: '#fff',
    //   Label active shadow:
    labelActiveShadow: true,
    labelActiveShadowColor: '#000',
    //   Label active color:
    //   - 'node'
    //   - default (then defaultLabelActiveColor
    //              will be used instead)
    labelActiveColor: 'default',
    defaultLabelActiveColor: '#000',
    //   Label size:
    //   - 'fixed'
    //   - 'proportional'
    //   Label size:
    //   - 'fixed'
    //   - 'proportional'
    labelSize: 'fixed',
    defaultLabelSize: 12, // for fixed display only
    labelSizeRatio: 2,    // for proportional display only
    labelThreshold: 6,
    font: 'Arial',
    hoverFont: '',
    activeFont: '',
    fontStyle: '',
    hoverFontStyle: '',
    activeFontStyle: '',
    // ------
    // EDGES:
    // ------
    //   Edge color:
    //   - 'source'
    //   - 'target'
    //   - default (then defaultEdgeColor or edge['color']
    //              will be used instead)
    edgeColor: 'source',
    defaultEdgeColor: '#aaa',
    defaultEdgeType: 'line',
    // ------
    // NODES:
    // ------
    defaultNodeColor: '#aaa',
    // HOVER:
    //   Node hover color:
    //   - 'node'
    //   - default (then defaultNodeHoverColor
    //              will be used instead)
    nodeHoverColor: 'node',
    defaultNodeHoverColor: '#fff',
    // ACTIVE:
    //   Node active color:
    //   - 'node'
    //   - default (then defaultNodeActiveColor
    //              will be used instead)
    nodeActiveColor: 'node',
    defaultNodeActiveColor: '#fff',
    //   Node border color:
    //   - 'node'
    //   - default (then defaultNodeBorderColor
    //              will be used instead)
    borderSize: 0,
    nodeBorderColor: 'node',
    defaultNodeBorderColor: '#fff',
    // --------
    // PROCESS:
    // --------
    edgesSpeed: 200,
    nodesSpeed: 200,
    labelsSpeed: 200,
    // ---------
    // Directed var (added by JCM)    
    directed: 0
  };

  /**
   * The canvas context dedicated to draw the nodes.
   * @type {CanvasRenderingContext2D}
   */
  var nodesCtx = nodesCtx;

  /**
   * The canvas context dedicated to draw the edges.
   * @type {CanvasRenderingContext2D}
   */
  var edgesCtx = edgesCtx;

  /**
   * The canvas context dedicated to draw the labels.
   * @type {CanvasRenderingContext2D}
   */
  var labelsCtx = labelsCtx;

  /**
   * The canvas context dedicated to draw the hover nodes.
   * @type {CanvasRenderingContext2D}
   */
  var hoverCtx = hoverCtx;

  /**
   * A reference to the graph to draw.
   * @type {Graph}
   */
  var graph = graph;

  /**
   * The width of the stage to draw on.
   * @type {number}
   */
  var width = w;

  /**
   * The height of the stage to draw on.
   * @type {number}
   */
  var height = h;

  /**
   * The index of the next edge to draw.
   * @type {number}
   */
  this.currentEdgeIndex = 0;

  /**
   * The index of the next node to draw.
   * @type {number}
   */
  this.currentNodeIndex = 0;

  /**
   * The index of the next label to draw.
   * @type {number}
   */
  this.currentLabelIndex = 0;

  /**
   * An atomic function to drawn the N next edges, with N as edgesSpeed.
   * The counter is {@link this.currentEdgeIndex}.
   * This function has been designed to work with {@link sigma.chronos}, that
   * will insert frames at the middle of the calls, to make the edges drawing
   * process fluid for the user.
   * @see sigma.chronos
   * @return {boolean} Returns true if all the edges are drawn and false else.
   */
  function task_drawEdge() {
    var c = graph.edges.length;
    var s, t, i = 0;

    while (i++< self.p.edgesSpeed && self.currentEdgeIndex < c) {
      e = graph.edges[self.currentEdgeIndex];
      s = e['source'];
      t = e['target'];
      if (e['hidden'] ||
          s['hidden'] ||
          t['hidden'] ||
          (!self.isOnScreen(s) && !self.isOnScreen(t))) {
        self.currentEdgeIndex++;
      }else {
        drawEdge(graph.edges[self.currentEdgeIndex++]);
      }
    }

    return self.currentEdgeIndex < c;
  };

  /**
   * An atomic function to drawn the N next nodes, with N as nodesSpeed.
   * The counter is {@link this.currentEdgeIndex}.
   * This function has been designed to work with {@link sigma.chronos}, that
   * will insert frames at the middle of the calls, to make the nodes drawing
   * process fluid for the user.
   * @see sigma.chronos
   * @return {boolean} Returns true if all the nodes are drawn and false else.
   */
  function task_drawNode() {
    var c = graph.nodes.length;
    var i = 0;

    while (i++< self.p.nodesSpeed && self.currentNodeIndex < c) {
      if (!self.isOnScreen(graph.nodes[self.currentNodeIndex])) {
        self.currentNodeIndex++;
      }else {
        drawNode(graph.nodes[self.currentNodeIndex++]);
      }
    }

    return self.currentNodeIndex < c;
  };

  /**
   * An atomic function to drawn the N next labels, with N as labelsSpeed.
   * The counter is {@link this.currentEdgeIndex}.
   * This function has been designed to work with {@link sigma.chronos}, that
   * will insert frames at the middle of the calls, to make the labels drawing
   * process fluid for the user.
   * @see sigma.chronos
   * @return {boolean} Returns true if all the labels are drawn and false else.
   */
  function task_drawLabel() {
    var c = graph.nodes.length;
    var i = 0;

    while (i++< self.p.labelsSpeed && self.currentLabelIndex < c) {
      if (!self.isOnScreen(graph.nodes[self.currentLabelIndex])) {
        self.currentLabelIndex++;
      }else {
        drawLabel(graph.nodes[self.currentLabelIndex++]);
      }
    }

    return self.currentLabelIndex < c;
  };

  /**
   * Draws one node to the corresponding canvas.
   * @param  {Object} node The node to draw.
   * @return {Plotter} Returns itself.
   */
  function drawNode(node) {
    var size = Math.round(node['displaySize'] * 10) / 10;
    var ctx = nodesCtx;

    ctx.fillStyle = node['color'];
    ctx.beginPath();
    ctx.arc(node['displayX'],
            node['displayY'],
            size,
            0,
            Math.PI * 2,
            true);

    ctx.closePath();
    ctx.fill();

    node['hover'] && drawHoverNode(node);
    return self;
  };

  /**
   * Draws one edge to the corresponding canvas.
   * @param  {Object} edge The edge to draw.
   * @return {Plotter} Returns itself.
   */
  function drawEdge(edge) {
    var x1 = edge['source']['displayX'];
    var y1 = edge['source']['displayY'];
    var x2 = edge['target']['displayX'];
    var y2 = edge['target']['displayY'];
    var color = edge['color'];
	var directed = self.p.directed

	// JM: I got this arrow-drawing code from Patrick Horgan (see below)

	// Copyright Patrick Horgan patrick at dbp-consulting dot com
	// Permission to use granted as long as you keep this notice intact
	// use strict is everywhere because some browsers still don't support
	// using it once for the whole file and need per method/function
	// use.
	// Part is derivitive of work by Juan Mendes as noted below as appropriate.
	// Some things depend on code in http://dbp-consulting/scripts/utilities.js

	var drawHead=function(ctx,x0,y0,x1,y1,x2,y2,style,color)
	{
	  'use strict';
	  // all cases do this.
	  ctx.save();
	  ctx.beginPath();
	  ctx.moveTo(x0,y0);
	  ctx.lineTo(x1,y1);
	  ctx.lineTo(x2,y2);
	  switch(style){
		case 0:
		  // curved filled, add the bottom as an arcTo curve and fill
		  var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
		  ctx.arcTo(x1,y1,x0,y0,.55*backdist);
		  ctx.fillStyle = color;
		  ctx.fill();
		  break;
		case 1:
		  // straight filled, add the bottom as a line and fill.
		  ctx.lineTo(x0,y0);
		  ctx.fillStyle = color;
		  ctx.fill();
		  break;
		case 2:
		  // unfilled head, just stroke.
		  ctx.strokeStyle = color;
		  ctx.stroke();
		  break;
		case 3:
		  //filled head, add the bottom as a quadraticCurveTo curve and fill
		  var cpx=(x0+x1+x2)/3;
		  var cpy=(y0+y1+y2)/3;
		  ctx.quadraticCurveTo(cpx,cpy,x0,y0);
		  ctx.fillStyle = color;
		  ctx.fill();
		  break;
		case 4:
		  //filled head, add the bottom as a bezierCurveTo curve and fill
		  var cp1x, cp1y, cp2x, cp2y,backdist;
		  var shiftamt=5;
		  if(x2==x0){
		// Avoid a divide by zero if x2==x0
		backdist=y2-y0;
		cp1x=(x1+x0)/2;
		cp2x=(x1+x0)/2;
		cp1y=y1+backdist/shiftamt;
		cp2y=y1-backdist/shiftamt;
		  }else{
		backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
		var xback=(x0+x2)/2;
		var yback=(y0+y2)/2;
		var xmid=(xback+x1)/2;
		var ymid=(yback+y1)/2;

		var m=(y2-y0)/(x2-x0);
		var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
		var dy=m*dx;
		cp1x=xmid-dx;
		cp1y=ymid-dy;
		cp2x=xmid+dx;
		cp2y=ymid+dy;
		  }

		  ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
		  ctx.fillStyle = color;
		  ctx.fill();
		  break;
	  }
	  ctx.restore();
	};

	var drawArrow=function(ctx,x1,y1,x2,y2,style,which,angle,d,color)
	{
	  'use strict';
	  style=typeof(style)!='undefined'? style:3;
	  which=typeof(which)!='undefined'? which:1; // end point gets arrow
	  angle=typeof(angle)!='undefined'? angle:Math.PI/8;
	  d    =typeof(d)    !='undefined'? d    :10;
	  // default to using drawHead to draw the head, but if the style
	  // argument is a function, use it instead
	  var toDrawHead=typeof(style)!='function'?drawHead:style;

	  // For ends with arrow we actually want to stop before we get to the arrow
	  // so that wide lines won't put a flat end on the arrow.
	  //
	  var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	  var ratio=(dist-d/3)/dist;
	  var tox, toy,fromx,fromy;
	  if(which&1){
		tox=x1+(x2-x1)*ratio;
		toy=y1+(y2-y1)*ratio;
	  }else{
		tox=x2;
		toy=y2;
	  }
	  if(which&2){
		fromx=x1+(x2-x1)*(1-ratio);
		fromy=y1+(y2-y1)*(1-ratio);
	  }else{
		fromx=x1;
		fromy=y1;
	  }
	  
	  // Draw the shaft of the arrow
	  ctx.beginPath();
	  ctx.moveTo(fromx,fromy);
	  ctx.lineTo(tox,toy);
	  ctx.strokeStyle = color;
	  ctx.stroke();

	  // calculate the angle of the line
	  var lineangle=Math.atan2(y2-y1,x2-x1);
	  // h is the line length of a side of the arrow head
	  var h=Math.abs(d/Math.cos(angle));

	  if(which&1){	// handle far end arrow head
		var angle1=lineangle+Math.PI+angle;
		var topx=x2+Math.cos(angle1)*h;
		var topy=y2+Math.sin(angle1)*h;
		var angle2=lineangle+Math.PI-angle;
		var botx=x2+Math.cos(angle2)*h;
		var boty=y2+Math.sin(angle2)*h;	
		toDrawHead(ctx,topx,topy,x2,y2,botx,boty,style,color);
	  }
	  if(which&2){ // handle near end arrow head
		var angle1=lineangle+angle;
		var topx=x1+Math.cos(angle1)*h;
		var topy=y1+Math.sin(angle1)*h;
		var angle2=lineangle-angle;
		var botx=x1+Math.cos(angle2)*h;
		var boty=y1+Math.sin(angle2)*h;
		toDrawHead(ctx,topx,topy,x1,y1,botx,boty,style,color);
	  }
	}



    if (!color) {
      switch (self.p.edgeColor) {
        case 'source':
          color = edge['source']['color'] ||
                  self.p.defaultNodeColor;
          break;
        case 'target':
          color = edge['target']['color'] ||
                  self.p.defaultNodeColor;
          break;
        default:
          color = self.p.defaultEdgeColor;
          break;
      }
    }

	var drawUndirectedEdge=function(ctx,x1,y1,x2,y2,color)
	{
		switch (edge['type'] || self.p.defaultEdgeType) {
		  case 'curve':
			ctx.strokeStyle = color;
			ctx.lineWidth = edge['displaySize'] / 3;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.quadraticCurveTo((x1 + x2) / 2 + (y2 - y1) / 4,
								 (y1 + y2) / 2 + (x1 - x2) / 4,
								 x2,
								 y2);
			ctx.stroke();
			break;
		  case 'line':
		  default:
			ctx.strokeStyle = color;
			ctx.lineWidth = edge['displaySize'] / 3;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);

			ctx.stroke();
			break;
		}
	}
	
    var ctx = edgesCtx;
    ctx.lineWidth=3;

	if(directed==1){
		drawArrow(ctx,x1,y1,x2,y2,3,1,0.34,20,color);
	}else{
		drawUndirectedEdge(ctx,x1,y1,x2,y2,color);
	}

    return self;
  };

  /**
   * Draws one label to the corresponding canvas.
   * @param  {Object} node The label to draw.
   * @return {Plotter} Returns itself.
   */
  function drawLabel(node) {
    var ctx = labelsCtx;

    if (node['displaySize'] >= self.p.labelThreshold || node['forceLabel']) {
      var fontSize = self.p.labelSize == 'fixed' ?
                     self.p.defaultLabelSize :
                     self.p.labelSizeRatio * node['displaySize'];

      ctx.font = self.p.fontStyle + fontSize + 'px ' + self.p.font;

      ctx.fillStyle = self.p.labelColor == 'node' ?
                      (node['color'] || self.p.defaultNodeColor) :
                      self.p.defaultLabelColor;
      ctx.fillText(
        node['label'],
        Math.round(node['displayX'] + node['displaySize'] * 1.5),
        Math.round(node['displayY'] + fontSize / 2 - 3)
      );
    }

    return self;
  };

  /**
   * Draws one hover node to the corresponding canvas.
   * @param  {Object} node The hover node to draw.
   * @return {Plotter} Returns itself.
   */
  function drawHoverNode(node) {
    var ctx = hoverCtx;

    var fontSize = self.p.labelSize == 'fixed' ?
                   self.p.defaultLabelSize :
                   self.p.labelSizeRatio * node['displaySize'];

    ctx.font = (self.p.hoverFontStyle || self.p.fontStyle || '') + ' ' +
               fontSize + 'px ' +
               (self.p.hoverFont || self.p.font || '');

    ctx.fillStyle = self.p.labelHoverBGColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultHoverLabelBGColor;

    // Label background:
    ctx.beginPath();

    if (self.p.labelHoverShadow) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 4;
      ctx.shadowColor = self.p.labelHoverShadowColor;
    }

    sigma.tools.drawRoundRect(
      ctx,
      Math.round(node['displayX'] - fontSize / 2 - 2),
      Math.round(node['displayY'] - fontSize / 2 - 2),
      Math.round(ctx.measureText(node['label']).width +
        node['displaySize'] * 1.5 +
        fontSize / 2 + 4),
      Math.round(fontSize + 4),
      Math.round(fontSize / 2 + 2),
      'left'
    );
    ctx.closePath();
    ctx.fill();

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;

    // Node border:
    ctx.beginPath();
    ctx.fillStyle = self.p.nodeBorderColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultNodeBorderColor;
    ctx.arc(Math.round(node['displayX']),
            Math.round(node['displayY']),
            node['displaySize'] + self.p.borderSize,
            0,
            Math.PI * 2,
            true);
    ctx.closePath();
    ctx.fill();

    // Node:
    ctx.beginPath();
    ctx.fillStyle = self.p.nodeHoverColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultNodeHoverColor;
    ctx.arc(Math.round(node['displayX']),
            Math.round(node['displayY']),
            node['displaySize'],
            0,
            Math.PI * 2,
            true);

    ctx.closePath();
    ctx.fill();

    // Label:
    ctx.fillStyle = self.p.labelHoverColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultLabelHoverColor;
    ctx.fillText(
      node['label'],
      Math.round(node['displayX'] + node['displaySize'] * 1.5),
      Math.round(node['displayY'] + fontSize / 2 - 3)
    );

    return self;
  };

  /**
   * Draws one active node to the corresponding canvas.
   * @param  {Object} node The active node to draw.
   * @return {Plotter} Returns itself.
   */
  function drawActiveNode(node) {
    var ctx = hoverCtx;

    if (!isOnScreen(node)) {
      return self;
    }

    var fontSize = self.p.labelSize == 'fixed' ?
                   self.p.defaultLabelSize :
                   self.p.labelSizeRatio * node['displaySize'];

    ctx.font = (self.p.activeFontStyle || self.p.fontStyle || '') + ' ' +
               fontSize + 'px ' +
               (self.p.activeFont || self.p.font || '');

    ctx.fillStyle = self.p.labelHoverBGColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultActiveLabelBGColor;

    // Label background:
    ctx.beginPath();

    if (self.p.labelActiveShadow) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 4;
      ctx.shadowColor = self.p.labelActiveShadowColor;
    }

    sigma.tools.drawRoundRect(
      ctx,
      Math.round(node['displayX'] - fontSize / 2 - 2),
      Math.round(node['displayY'] - fontSize / 2 - 2),
      Math.round(ctx.measureText(node['label']).width +
        node['displaySize'] * 1.5 +
        fontSize / 2 + 4),
      Math.round(fontSize + 4),
      Math.round(fontSize / 2 + 2),
      'left'
    );
    ctx.closePath();
    ctx.fill();

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;

    // Node border:
    ctx.beginPath();
    ctx.fillStyle = self.p.nodeBorderColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultNodeBorderColor;
    ctx.arc(Math.round(node['displayX']),
            Math.round(node['displayY']),
            node['displaySize'] + self.p.borderSize,
            0,
            Math.PI * 2,
            true);
    ctx.closePath();
    ctx.fill();

    // Node:
    ctx.beginPath();
    ctx.fillStyle = self.p.nodeActiveColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultNodeActiveColor;
    ctx.arc(Math.round(node['displayX']),
            Math.round(node['displayY']),
            node['displaySize'],
            0,
            Math.PI * 2,
            true);

    ctx.closePath();
    ctx.fill();

    // Label:
    ctx.fillStyle = self.p.labelActiveColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultLabelActiveColor;
    ctx.fillText(
      node['label'],
      Math.round(node['displayX'] + node['displaySize'] * 1.5),
      Math.round(node['displayY'] + fontSize / 2 - 3)
    );

    return self;
  };

  /**
   * Determines if a node is on the screen or not. The limits here are
   * bigger than the actual screen, to avoid seeing labels disappear during
   * the graph manipulation.
   * @param  {Object}  node The node to check if it is on or out the screen.
   * @return {boolean} Returns false if the node is hidden or not on the screen
   *                   or true else.
   */
  function isOnScreen(node) {
    if (isNaN(node['x']) || isNaN(node['y'])) {
      throw (new Error('A node\'s coordinate is not a ' +
                       'number (id: ' + node['id'] + ')')
      );
    }

    return !node['hidden'] &&
           (node['displayX'] + node['displaySize'] > -width / 3) &&
           (node['displayX'] - node['displaySize'] < width * 4 / 3) &&
           (node['displayY'] + node['displaySize'] > -height / 3) &&
           (node['displayY'] - node['displaySize'] < height * 4 / 3);
  };

  /**
   * Resizes this instance.
   * @param  {number} w The new width.
   * @param  {number} h The new height.
   * @return {Plotter} Returns itself.
   */
  function resize(w, h) {
    width = w;
    height = h;

    return self;
  }

  this.task_drawLabel = task_drawLabel;
  this.task_drawEdge = task_drawEdge;
  this.task_drawNode = task_drawNode;
  this.drawActiveNode = drawActiveNode;
  this.drawHoverNode = drawHoverNode;
  this.isOnScreen = isOnScreen;
  this.resize = resize;
}

