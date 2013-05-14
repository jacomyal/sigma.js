sigma.tools.drawRoundRect = function(ctx, x, y, w, h, ellipse, corners) {
  var e = ellipse ? ellipse : 0;
  var c = corners ? corners : [];
  c = ((typeof c) == 'string') ? c.split(' ') : c;

  var tl = e && (c.indexOf('topleft') >= 0 ||
                 c.indexOf('top') >= 0 ||
                 c.indexOf('left') >= 0);
  var tr = e && (c.indexOf('topright') >= 0 ||
                 c.indexOf('top') >= 0 ||
                 c.indexOf('right') >= 0);
  var bl = e && (c.indexOf('bottomleft') >= 0 ||
                 c.indexOf('bottom') >= 0 ||
                 c.indexOf('left') >= 0);
  var br = e && (c.indexOf('bottomright') >= 0 ||
                 c.indexOf('bottom') >= 0 ||
                 c.indexOf('right') >= 0);

  ctx.moveTo(x, y + e);

  if (tl) {
    ctx.arcTo(x, y, x + e, y, e);
  }else {
    ctx.lineTo(x, y);
  }

  if (tr) {
    ctx.lineTo(x + w - e, y);
    ctx.arcTo(x + w, y, x + w, y + e, e);
  }else {
    ctx.lineTo(x + w, y);
  }

  if (br) {
    ctx.lineTo(x + w, y + h - e);
    ctx.arcTo(x + w, y + h, x + w - e, y + h, e);
  }else {
    ctx.lineTo(x + w, y + h);
  }

  if (bl) {
    ctx.lineTo(x + e, y + h);
    ctx.arcTo(x, y + h, x, y + h - e, e);
  }else {
    ctx.lineTo(x, y + h);
  }

  ctx.lineTo(x, y + e);
};

/**
 * Draws a filled arrowhead shape to the corresponding canvas.
 * @param  {CanvasRenderingContext2D} ctx  The context within which to draw the arrowhead.
 * @param  {number} x0                     The x-coordinate of the tip of the arrowhead.
 * @param  {number} y0                     The y-coordinate of the tip of the arrowhead.
 * @param  {number} size                   The length of the arrowhead.
 * @param  {number} rotationAngle          The angle of rotation of the arrowhead, in degrees.
 * @return {undefined} 
 */
sigma.tools.drawArrowhead = function(ctx, x0, y0, size, rotationAngle) {
  var ARROW_SHARPNESS = 22;  // angle between one side of arrowhead and shaft

  ctx.beginPath();

  ctx.moveTo(x0, y0);

  // (Math.PI / 180) === 0.017453292519943295 
  var x1 = x0 + Math.cos(0.017453292519943295 * (ARROW_SHARPNESS + rotationAngle)) * size; 
  var y1 = y0 + Math.sin(0.017453292519943295 * (ARROW_SHARPNESS + rotationAngle)) * size; 
  var x2 = x0 + Math.cos(0.017453292519943295 * (rotationAngle - ARROW_SHARPNESS)) * size; 
  var y2 = y0 + Math.sin(0.017453292519943295 * (rotationAngle - ARROW_SHARPNESS)) * size; 

  ctx.lineTo(x1, y1);
  ctx.quadraticCurveTo((x0 + x1 + x2) / 3, (y0 + y1 + y2) / 3, x2, y2);
  ctx.lineTo(x0, y0);
  ctx.fill();
};

sigma.tools.getRGB = function(s, asArray) {
  s = s.toString();
  var res = {
    'r': 0,
    'g': 0,
    'b': 0
  };

  if (s.length >= 3) {
    if (s.charAt(0) == '#') {
      var l = s.length - 1;
      if (l == 6) {
        res = {
          'r': parseInt(s.charAt(1) + s.charAt(2), 16),
          'g': parseInt(s.charAt(3) + s.charAt(4), 16),
          'b': parseInt(s.charAt(5) + s.charAt(5), 16)
        };
      }else if (l == 3) {
        res = {
          'r': parseInt(s.charAt(1) + s.charAt(1), 16),
          'g': parseInt(s.charAt(2) + s.charAt(2), 16),
          'b': parseInt(s.charAt(3) + s.charAt(3), 16)
        };
      }
    }
  }

  if (asArray) {
    res = [
      res['r'],
      res['g'],
      res['b']
    ];
  }

  return res;
};

sigma.tools.rgbToHex = function(R, G, B) {
  return sigma.tools.toHex(R) + sigma.tools.toHex(G) + sigma.tools.toHex(B);
};

sigma.tools.toHex = function(n) {
  n = parseInt(n, 10);

  if (isNaN(n)) {
    return '00';
  }
  n = Math.max(0, Math.min(n, 255));
  return '0123456789ABCDEF'.charAt((n - n % 16) / 16) +
         '0123456789ABCDEF'.charAt(n % 16);
};

/**
 * Provides the angle of incidence of the end point of a line or quadratic curve, in degrees. 
 * @param  {number} x1  The x-coordinate of the start point of the line or control point of the quadratic curve.
 * @param  {number} y1  The y-coordinate of the start point of the line or control point of the quadratic curve.
 * @param  {number} x2  The x-coordinate of the line or quadratic curve end point.
 * @param  {number} y2  The y-coordinate of the line or quadratic curve end point.
 * @return {number}     Returns the angle of incidence of the end point of the line or quadratic curve cooresponding to the coordinate parms, in degrees.
 */
sigma.tools.getIncidenceAngle = function(x1, y1, x2, y2) {
    return (x1 <= x2 ? 180 : 0) + Math.atan(((y2 - y1) / (x2 - x1))) * 180 / Math.PI;
};
