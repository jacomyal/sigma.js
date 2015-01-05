;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof ShapeLibrary === 'undefined')
    throw 'ShapeLibrary is not declared';


  // Initialize package:
  sigma.utils.pkg('sigma.canvas.nodes');

  // incrementally scaled, not automatically resized for now
  // (ie. possible memory leak if there are many graph load / unload)
  var imgCache = {};

  var drawImage = function (node,x,y,size,context, imgCrossOrigin) {
    if(node.image && node.image.url) {
      var url = node.image.url;
      var ih = node.image.h || 1; // 1 is arbitrary, anyway only the ratio counts
      var iw = node.image.w || 1;
      var scale = node.image.scale || 1;
      var clip = node.image.clip || 1;

      // create new IMG or get from imgCache
      var image = imgCache[url];
      if(!image) {
        image = document.createElement('IMG');
        image.setAttribute('crossOrigin', imgCrossOrigin);
        image.src = url;
        image.onload = function(){
          window.dispatchEvent(new Event('resize'));
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
  };


    var drawIcon = function (node,x,y,size,ctx) {

        var font = node.icon.font || 'Arial',
            fgColor = node.icon.color || '#F00',
            text = node.icon.content || '?',
            px = node.icon.x || 0.5,
            py = node.icon.y || 0.5,
            height = size,
            width = size;


        var fontSizeRatio = 0.70;
        if (typeof node.icon.scale === "number") {
          fontSizeRatio = Math.abs(Math.max(0.01, node.icon.scale));
        }


        var fontSize = Math.round(fontSizeRatio * height);

        //ctx.beginPath();
        ctx.fillStyle = fgColor;

        ctx.font = '' + fontSize + 'px ' + font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
  };


  var register = function(name,drawShape,drawBorder) {
    sigma.canvas.nodes[name] = function(node, context, settings) {
      var args = arguments,
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          color = node.color || settings('defaultNodeColor'),
          imgCrossOrigin = settings('imgCrossOrigin') || 'anonymous',
          borderColor = node.borderColor || color,
          x = node[prefix + 'x'],
          y = node[prefix + 'y'];


      context.save();

      if(drawShape) {
        drawShape(node, x, y, size, color, context);
      }

      if(drawBorder) {
        drawBorder(node, x, y, size, borderColor, context);
      }

      drawImage(node, x, y, size, context, imgCrossOrigin);

      if (typeof node.icon !== "undefined") {
        drawIcon(node, x, y, size, context);
      }

      context.restore();
    };
  };

  ShapeLibrary.enumerate().forEach(function(shape) {
    register(shape.name, shape.drawShape, shape.drawBorder);
  });

  /**
   * Exporting
   * ----------
   */
  this.CustomShapes = {

    // Functions

    // add pre-cache images

    // Version
    version: '0.2'
  };



}).call(this);
