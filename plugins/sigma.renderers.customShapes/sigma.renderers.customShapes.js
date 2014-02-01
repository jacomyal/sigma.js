;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof ShapeLibrary === 'undefined')
    throw 'ShapeLibrary is not declared';
  

  // Initialize package:
  sigma.utils.pkg('sigma.canvas.nodes');

  var sigInst = undefined;
  var imgCache = {};

  var initPlugin = function(inst) {
    sigInst = inst;
  }

  var drawImage = function (node,x,y,size,context) {
    if(sigInst && node.image && node.image.url) {
      var url = node.image.url;
      var ih = node.image.h || 1; // 1 is arbitrary, anyway only the ratio counts
      var iw = node.image.w || 1;
      var scale = node.image.scale || 1;
      var clip = node.image.clip || 1;

      // create new IMG or get from imgCache
      var image = imgCache[url];
      if(!image) {
        image = document.createElement('IMG');
        image.src = url;
        image.onload = function(){
          // TODO see how we redraw on load
          // need to provide the siginst as a parameter to the library
          console.log("redraw on image load");
          sigInst.refresh();
        };
        imgCache[url] = image;
      }

      // calculate position and draw
      var xratio = (iw<ih) ? (iw/ih) : 1;
      var yratio = (ih<iw) ? (ih/iw) : 1;
      var r = size*scale;

      // Draw the clipping disc:
      context.save(); // enter clipping mode
      context.beginPath();
      context.arc(x,y,size*clip,0,Math.PI*2,true);
      context.closePath();
      context.clip();

      // Draw the actual image
      context.drawImage(image,
          x+Math.sin(-3.142/4)*r*xratio,
          y-Math.cos(-3.142/4)*r*yratio,
          r*xratio*2*Math.sin(-3.142/4)*(-1),
          r*yratio*2*Math.cos(-3.142/4));
      context.restore(); // exit clipping mode
    }
  }


  var register = function(name,drawShape,drawBorder) {
    sigma.canvas.nodes[name] = function(node, context, settings) {
      var args = arguments,
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          color = node.color || settings('defaultNodeColor'),
          borderColor = node.borderColor || color,
          x = node[prefix + 'x'],
          y = node[prefix + 'y'];

      context.save();

      if(drawShape) {
        drawShape(node,x,y,size,color,context);
      }

      if(drawBorder) {
        drawBorder(node,x,y,size,borderColor,context);
      }
      
      drawImage(node,x,y,size,context);

      context.restore();
    };
  }

  ShapeLibrary.enumerate().forEach(function(shape) {
    register(shape.name,shape.drawShape,shape.drawBorder);
  });

  /**
   * Exporting
   * ----------
   */
  this.CustomShapes = {

    // Functions
    init: initPlugin,
    // add pre-cache images

    // Version
    version: '0.1'
  };



}).call(this);
