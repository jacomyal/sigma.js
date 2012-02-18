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

