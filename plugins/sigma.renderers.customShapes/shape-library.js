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

  var drawSquare = function(node,x,y,size,context) {
    context.fillRect(
        x+Math.sin(-3.142/4)*size,
        y-Math.cos(-3.142/4)*size,
        size*2*Math.sin(-3.142/4)*(-1),
        size*2*Math.cos(-3.142/4));
  }
  register("square",drawSquare,drawSquare);

  var drawDiamond = function(node,x,y,size,context) {
    context.moveTo(x-size, y);
    context.lineTo(x, y-size);
    context.lineTo(x+size, y);
    context.lineTo(x, y+size);
    context.moveTo(x-size, y);
  }
  register("diamond",drawDiamond,drawDiamond);

  var drawEquilateral = function(node,x,y,size,context) {
    var pcount = (node.equilateral && node.equilateral.numPoints) || 5;
    var rotate = ((node.equilateral && node.equilateral.rotate) || 0)*Math.PI/180;
    var radius = size;
    context.moveTo(x+radius*Math.sin(rotate), y-radius*Math.cos(rotate)); // first point on outer radius, angle 'rotate'
    for(var i=1; i<pcount; i++) {
      context.lineTo(x+Math.sin(rotate+2*Math.PI*i/pcount)*radius, y-Math.cos(rotate+2*Math.PI*i/pcount)*radius);
    }
  }
  register("equilateral",drawEquilateral,drawEquilateral);


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
  register("star",starShape,starShape);

  var drawPacman = function(node,x,y,size,context) {
    context.save();
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
    context.restore();
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
