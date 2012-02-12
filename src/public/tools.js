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
