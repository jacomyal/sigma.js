;(function(undefined) {
  "use strict";

  /**
   * Sigma Renderer Glyphs Utility
   * ================================
   *
   * The aim of this plugin is to display customized glyphs around a node,
   * at four possible positions.
   *
   * Author: Florent Schildknecht (Flo-Schield-Bobby)
   * Version: 0.0.1
   */
  if (typeof sigma === 'undefined') {
    throw 'sigma is not declared';
  }

  // Utility function
  function degreesToRadians (degrees) {
    return degrees * Math.PI / 180;
  }

  // Main method: create glyphs canvas and append it to the scene
  function glyphs (params) {
    params = params || {};

    var defFont = params.font || this.settings('glyphFont'),
        defFontStyle = params.fontStyle || this.settings('glyphFontStyle'),
        defFontSize = this.settings('labelSizeRatio') *
          (params.fontSize || this.settings('glyphFontSize')) *
          this.settings('zoomingRatio'),
        defStrokeColor = params.strokeColor || this.settings('glyphStrokeColor'),
        defLineWidth = params.lineWidth || this.settings('glyphLineWidth'),
        defFillColor = params.fillColor || this.settings('glyphFillColor'),
        defRadius = params.radius || this.settings('glyphRadius'),
        defTextColor = params.textColor || this.settings('glyphTextColor'),
        defTextThreshold = params.textThreshold || this.settings('glyphTextThreshold'),
        defDraw = params.draw || this.settings('drawGlyphs');

    if (!this.domElements['glyphs']) {
      this.initDOM('canvas', 'glyphs');
      this.domElements['glyphs'].width = this.container.offsetWidth;
      this.domElements['glyphs'].height = this.container.offsetHeight;
      this.container.insertBefore(
        this.domElements['glyphs'],
        this.domElements['glyphs'].previousSibling
      );
    }
    this.drawingContext = this.domElements['glyphs'].getContext('2d');
    this.drawingContext.textAlign = 'center';
    this.drawingContext.lineWidth = defLineWidth;
    this.drawingContext.font = defFontStyle + ' ' + defFontSize + 'px ' + defFont;
    this.drawingContext.strokeStyle = defStrokeColor;


    var self = this,
        nodes = this.nodesOnScreen || [],
        prefix = this.options.prefix || '',
        cos45 = Math.cos(degreesToRadians(45)),
        sin45 = Math.sin(degreesToRadians(45)),
        cos135 = Math.cos(degreesToRadians(135)),
        sin135 = Math.sin(degreesToRadians(135)),
        cos225 = Math.cos(degreesToRadians(225)),
        sin225 = Math.sin(degreesToRadians(225)),
        cos315 = Math.cos(degreesToRadians(315)),
        sin315 = Math.sin(degreesToRadians(315));

    function draw (o, textThreshold, context) {
      if (o.draw && o.x && o.y) {
        var x = o.x,
            y = o.y;

        switch (o.position) {
          case 'top-right':
            x += o.nodeSize * cos45;
            y += o.nodeSize * sin45;
            break;
          case 'top-left':
            x += o.nodeSize * cos135;
            y += o.nodeSize * sin135;
            break;
          case 'bottom-left':
            x += o.nodeSize * cos225;
            y += o.nodeSize * sin225;
            break;
          case 'bottom-right':
            x += o.nodeSize * cos315;
            y += o.nodeSize * sin315;
            break;
        }

        // Glyph rendering
        context.fillStyle = o.fillColor;
        if (o.strokeColor !== context.strokeStyle) {
          context.strokeStyle = o.strokeColor;
        }
        context.beginPath();
        context.arc(x, y, o.radius, 2 * Math.PI, false);
        context.closePath();
        if (context.lineWidth) context.stroke();
        context.fill();

        // Glyph content rendering
        if (o.radius > textThreshold) {
          var font =  o.fontStyle + ' ' + o.fontSize + 'px ' + o.font;
          if (font !== context.font) {
            context.font = font;
          }
          context.fillStyle = o.textColor;
          context.fillText(o.content, x, y + o.radius * 0.5);
        }
      }
    };

    nodes.forEach(function(node) {
      if (node.glyphs) {
        node.glyphs.forEach(function(glyph) {
          draw(
            {
              x: node[prefix + 'x'],
              y: node[prefix + 'y'],
              nodeSize: node[prefix + 'size'] || 0,
              position: glyph.position,
              radius: glyph.size || node[prefix + 'size'] / 2 || defRadius,
              content: (glyph.content || '').toString() || '',
              lineWidth: glyph.lineWidth || defLineWidth,
              fillColor: glyph.fillColor || defFillColor,
              textColor: glyph.textColor || defTextColor,
              strokeColor: glyph.strokeColor || defStrokeColor,
              fontStyle: glyph.fontStyle || defFontStyle,
              font: glyph.font || defFont,
              fontSize: glyph.fontSize || defFontSize,
              draw: !glyph.hidden || defDraw
            },
            glyph.threshold || defTextThreshold,
            self.drawingContext
          );
        });
      }
    });
  }

  // Bind glyphs method to renderers
  sigma.renderers.canvas.prototype.glyphs = glyphs;
}).call(this);
