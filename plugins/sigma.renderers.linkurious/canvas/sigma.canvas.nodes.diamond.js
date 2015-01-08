;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  // incrementally scaled, not automatically resized for now
  // (ie. possible memory leak if there are many graph load / unload)
  var imgCache = {};

  var drawDiamond = function(node, x, y, size, context) {
    context.moveTo(x - size, y);
    context.lineTo(x, y - size);
    context.lineTo(x + size, y);
    context.lineTo(x, y + size);
  }

  var drawImage = function (node, x, y, size, context, imgCrossOrigin, threshold) {
    if(!node.image || !node.image.url || size < threshold) return;

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
      image.onload = function() {
        window.dispatchEvent(new Event('resize'));
      };
      imgCache[url] = image;
    }

    // calculate position and draw
    var xratio = (iw < ih) ? (iw / ih) : 1;
    var yratio = (ih < iw) ? (ih / iw) : 1;
    var r = size * scale;

    // Draw the clipping diamond:
    context.save(); // enter clipping mode
    context.beginPath();
    drawDiamond(node, x, y, size, context);
    context.closePath();
    context.clip();

    // Draw the actual image
    context.drawImage(
      image,
      x + Math.sin(-3.142 / 4) * r * xratio,
      y - Math.cos(-3.142 / 4) * r * yratio,
      r * xratio * 2 * Math.sin(-3.142 / 4) * (-1),
      r * yratio * 2 * Math.cos(-3.142 / 4)
    );
    context.restore(); // exit clipping mode
  };

  var drawIcon = function (node, x, y, size, context, threshold) {
    if(!node.icon || size < threshold) return;

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

    context.save();
    context.fillStyle = fgColor;

    context.font = '' + fontSize + 'px ' + font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, x, y);
    context.restore();
  };

  /**
   * The node renderer renders the node as a diamond.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.diamond = function(node, context, settings) {
    var prefix = settings('prefix') || '',
        size = node[prefix + 'size'] || 1,
        x = node[prefix + 'x'],
        y = node[prefix + 'y'],
        defaultNodeColor = settings('defaultNodeColor'),
        imgCrossOrigin = settings('imgCrossOrigin') || 'anonymous',
        borderSize = settings('borderSize'),
        outerBorderSize = settings('outerBorderSize'),
        color = node.color || defaultNodeColor;

    // Color:
    if (node.active) {
      if (settings('nodeActiveColor') === 'node') {
        color = node.active_color || color;
      }
      else {
        color = settings('defaultNodeActiveColor') || color;
      }
    }

    // Border:
    if (node.active) {
      if (outerBorderSize > 0) {
        context.beginPath();
        context.fillStyle = settings('nodeOuterBorderColor') === 'node' ?
          (color || defaultNodeColor) :
          settings('defaultNodeOuterBorderColor');
        drawDiamond(node, x, y, size + borderSize + outerBorderSize, context);
        context.closePath();
        context.fill();
      }
      if (borderSize > 0) {
        context.beginPath();
        context.fillStyle = settings('nodeBorderColor') === 'node' ?
          (color || defaultNodeColor) :
          settings('defaultNodeBorderColor');
        drawDiamond(node, x, y, size + borderSize, context);
        context.closePath();
        context.fill();
      }
    }

      // TODO diamond color pie
    // if ((!node.active ||
    //   (node.active && settings('nodeActiveColor') === 'node')) &&
    //   node.colors &&
    //   node.colors.length) {

    //   // see http://jsfiddle.net/hvYkM/1/
    //   var i,
    //       l = node.colors.length,
    //       j = 1 / l,
    //       lastend = 0;

    //   for (i = 0; i < l; i++) {
    //     context.fillStyle = node.colors[i];
    //     context.beginPath();
    //     context.moveTo(x, y);
    //     context.arc(
    //       x,
    //       y,
    //       size,
    //       lastend,
    //       lastend + (Math.PI * 2 * j),
    //       false
    //     );
    //     context.lineTo(x, y);
    //     context.closePath();
    //     context.fill();
    //     lastend += Math.PI * 2 * j;
    //   }
    // }
    // else {
      context.fillStyle = color;
      context.beginPath();
      drawDiamond(node, x, y, size, context);
      context.closePath();
      context.fill();
    // }

    // Image:
    if (node.image) {
      drawImage(node, x, y, size, context, imgCrossOrigin, settings('imageThreshold'));
    }

    // Icon:
    if (node.icon) {
      drawIcon(node, x, y, size, context, settings('iconThreshold'));
    }

  };
})();
