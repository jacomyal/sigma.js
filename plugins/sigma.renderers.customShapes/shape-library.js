;(function(undefined) {
  'use strict';

  var shapes = [];
  var register = function(name,drawShape,drawBorder) {
    shapes.push({
      'name': name,
      'drawShape': drawShape,
      'drawBorder': drawBorder
    });
  }

  var enumerateShapes = function() {
    return shapes;
  }

  /**
   * For the standard closed shapes - the shape fill and border are drawn the
   * same, with some minor differences for fill and border. To facilitate this we
   * create the generic draw functions, that take a shape drawing func and
   * return a shape-renderer/border-renderer
   * ----------
   */
  var genericDrawShape = function(shapeFunc) {
    return function(node,x,y,size,color,context) {
      context.fillStyle = color;
      context.beginPath();
      shapeFunc(node,x,y,size,context);
      context.closePath();
      context.fill();
    };
  }

  var genericDrawBorder = function(shapeFunc) {
    return function(node,x,y,size,color,context) {
      context.strokeStyle = color;
      context.lineWidth = size / 5;
      context.beginPath();
      shapeFunc(node,x,y,size,context);
      context.closePath();
      context.stroke();
    };
  }

  /**
   * We now proced to use the generics to define our standard shape/border
   * drawers: square, diamond, equilateral (polygon), and star
   * ----------
   */
  var drawSquare = function(node,x,y,size,context) {
    var rotate = Math.PI*45/180; // 45 deg rotation of a diamond shape
    context.moveTo(x+size*Math.sin(rotate), y-size*Math.cos(rotate)); // first point on outer radius, dwangle 'rotate'
    for(var i=1; i<4; i++) {
      context.lineTo(x+Math.sin(rotate+2*Math.PI*i/4)*size, y-Math.cos(rotate+2*Math.PI*i/4)*size);
    }
  }
  register("square",genericDrawShape(drawSquare),genericDrawBorder(drawSquare));

  var drawCircle = function(node,x,y,size,context) {
    context.arc(x,y,size,0,Math.PI*2,true);
  }
  register("circle",genericDrawShape(drawCircle),genericDrawBorder(drawCircle));

  var drawDiamond = function(node,x,y,size,context) {
    context.moveTo(x-size, y);
    context.lineTo(x, y-size);
    context.lineTo(x+size, y);
    context.lineTo(x, y+size);
  }
  register("diamond",genericDrawShape(drawDiamond),genericDrawBorder(drawDiamond));

  var drawCross = function(node,x,y,size,context) {
    var lineWeight = (node.cross && node.cross.lineWeight) || 5;
    context.moveTo(x-size, y-lineWeight);
    context.lineTo(x-size, y+lineWeight);
    context.lineTo(x-lineWeight, y+lineWeight);
    context.lineTo(x-lineWeight, y+size);
    context.lineTo(x+lineWeight, y+size);
    context.lineTo(x+lineWeight, y+lineWeight);
    context.lineTo(x+size, y+lineWeight);
    context.lineTo(x+size, y-lineWeight);
    context.lineTo(x+lineWeight, y-lineWeight);
    context.lineTo(x+lineWeight, y-size);
    context.lineTo(x-lineWeight, y-size);
    context.lineTo(x-lineWeight, y-lineWeight);
  }
  register("cross",genericDrawShape(drawCross),genericDrawBorder(drawCross));

  var drawEquilateral = function(node,x,y,size,context) {
    var pcount = (node.equilateral && node.equilateral.numPoints) || 5;
    var rotate = ((node.equilateral && node.equilateral.rotate) || 0)*Math.PI/180;
    var radius = size;
    context.moveTo(x+radius*Math.sin(rotate), y-radius*Math.cos(rotate)); // first point on outer radius, angle 'rotate'
    for(var i=1; i<pcount; i++) {
      context.lineTo(x+Math.sin(rotate+2*Math.PI*i/pcount)*radius, y-Math.cos(rotate+2*Math.PI*i/pcount)*radius);
    }
  }
  register("equilateral",genericDrawShape(drawEquilateral),genericDrawBorder(drawEquilateral));


  var starShape = function(node,x,y,size,context) {
    var pcount = (node.star && node.star.numPoints) || 5,
        inRatio = (node.star && node.star.innerRatio) || 0.5,
        outR = size,
        inR = size*inRatio,
        angleOffset = Math.PI/pcount;
    context.moveTo(x, y-size); // first point on outer radius, top
    for(var i=0; i<pcount; i++) {
      context.lineTo(x+Math.sin(angleOffset+2*Math.PI*i/pcount)*inR,
          y-Math.cos(angleOffset+2*Math.PI*i/pcount)*inR);
      context.lineTo(x+Math.sin(2*Math.PI*(i+1)/pcount)*outR,
          y-Math.cos(2*Math.PI*(i+1)/pcount)*outR);
    }
  }
  register("star",genericDrawShape(starShape),genericDrawBorder(starShape));

  /**
   * An example of a non standard shape (pacman). Here we WILL NOT use the
   * genericDraw functions, but rather register a full custom node renderer for
   * fill, and skip the border renderer which is irrelevant for this shape
   * ----------
   */
  var drawPacman = function(node,x,y,size,color,context) {
    context.fillStyle = 'yellow';
    context.beginPath();
    context.arc(x,y,size,1.25*Math.PI,0,false);
    context.arc(x,y,size,0,0.75*Math.PI,false);
    context.lineTo(x,y);
    context.closePath();
    context.fill();

    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(x+size/3,y-size/3,size/4,0,2*Math.PI,false);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x+4*size/9,y-size/3,size/8,0,2*Math.PI,false);
    context.closePath();
    context.fill();
  }
  register("pacman",drawPacman,null);

  /**
   * Exporting
   * ----------
   */
  this.ShapeLibrary = {

    // Functions
    enumerate: enumerateShapes,
    // add: addShape,

    // Version
    version: '0.1'
  };

}).call(this);
