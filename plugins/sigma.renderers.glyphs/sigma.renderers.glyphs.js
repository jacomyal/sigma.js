;(function(undefined) {
  "use strict";

  /**
   * Sigma Renderer Glyphs Utility
   * ================================
   *
   * The aim of this plugin is to display customized glyphs around a node, at four possible positions.
   *
   * Author: Florent Schildknecht (Flo-Schield-Bobby)
   * Version: 0.0.1
   */
  if (typeof sigma === 'undefined') {
    throw 'sigma is not declared';
  }

  // Main method: create glyphs canvas and append it to the scene
  function glyphs (params) {
    params = params || {};

    if (!this.domElements['glyphs']) {
      this.initDOM('canvas', 'glyphs');
      this.domElements['glyphs'].width = this.container.offsetWidth;
      this.domElements['glyphs'].height = this.container.offsetHeight;
      this.container.insertBefore(this.domElements['glyphs'], this.domElements['glyphs'].previousSibling);
      this.drawingContext = this.domElements['glyphs'].getContext('2d');
    }

    var nodes = this.nodesOnScreen,
        prefix = this.options.prefix || '',
        degreesToRadians = function (degrees) {
          return degrees * Math.PI / 180;
        },
        drawGlyph = function (settings) {
          if (settings.node && settings.node[prefix + 'x'] && settings.node[prefix + 'y']) {
            var node = settings.node,
                x = node[prefix + 'x'],
                y = node[prefix + 'y'],
                nodeRadius = node[prefix + 'size'],
                glyphRadius = settings.size || this.settings('glyphRadius') || node[prefix + 'size'] / 4,
                fillColor = settings.fillColor || this.settings('glyphFillColor'),
                textColor = settings.textColor || this.settings('glyphTextColor'),
                strokeColor = settings.strokeColor || this.settings('glyphStrokeColor'),
                lineWidth = settings.lineWidth || this.settings('glyphLineWidth'),
                fontStyle = settings.fontStyle || this.settings('glyphFontStyle'),
                fontName = settings.fontName || this.settings('glyphFontName'),
                fontSize = this.settings('labelSizeRatio') * (settings.fontSize || this.settings('glyphFontSize')),
                hidden = settings.hidden || this.settings('glyphHidden') || false,
                content = settings.content.toString() || '';

            if (hidden !== true) {
              fontSize *= this.settings('zoomingRatio');

              switch (settings.position) {
                case 'top-right':
                  x += nodeRadius * Math.cos(degreesToRadians(45));
                  y += nodeRadius * Math.sin(degreesToRadians(45));
                  break;
                case 'top-left':
                  x += nodeRadius * Math.cos(degreesToRadians(135));
                  y += nodeRadius * Math.sin(degreesToRadians(135));
                  break;
                case 'bottom-left':
                  x += nodeRadius * Math.cos(degreesToRadians(225));
                  y += nodeRadius * Math.sin(degreesToRadians(225));
                  break;
                case 'bottom-right':
                  x += nodeRadius * Math.cos(degreesToRadians(315));
                  y += nodeRadius * Math.sin(degreesToRadians(315));
                  break;
              }

              // Glyph rendering
              this.drawingContext.fillStyle = fillColor;
              this.drawingContext.strokeStyle = strokeColor;
              this.drawingContext.lineWidth = lineWidth;
              this.drawingContext.beginPath();
              this.drawingContext.arc(x, y, glyphRadius, 2 * Math.PI, false);
              this.drawingContext.closePath();
              this.drawingContext.stroke();
              this.drawingContext.fill();

              // Glyph content rendering
              this.drawingContext.font = fontStyle + ' ' + fontSize + 'px ' + fontName;
              var textWidth = this.drawingContext.measureText(content).width;

              if ((textWidth <= nodeRadius) && (textWidth >= this.settings('labelThreshold'))) {
                this.drawingContext.fillStyle = textColor;
                this.drawingContext.textAlign = 'center';
                this.drawingContext.fillText(content, x, y + 2);
              }
            }
          }
        };


    // Get the glyphs definitions from parameters
    if (params.glyphs && params.glyphs.length > 0) {
      var glyphsLength = params.glyphs.length;
      while (glyphsLength--) {
        var glyph = params.glyphs[glyphsLength];

        if (glyph.nodeId && glyph.position) {
          drawGlyph.apply(this, [{
            node: this.graph.nodes(glyph.nodeId),
            position: glyph.position,
            size: glyph.size || node[prefix + 'size'] / 2,
            content: glyph.content,
            fillColor: glyph.fillColor,
            textColor: glyph.textColor,
            strokeColor: glyph.strokeColor,
            lineWidth: glyph.lineWidth,
            fontStyle: glyph.fontStyle,
            fontName: glyph.fontName,
            fontSize: glyph.fontSize,
            hidden: glyph.hidden
          }]);
        }
      }
    } else {
      // Try to get them from node attributes
      var nodesLength = nodes.length;
      while (nodesLength--) {
        var node = nodes[nodesLength];

        if (node.glyphs) {
          var glyphsLength = node.glyphs.length;
          while (glyphsLength--) {
            var glyph = node.glyphs[glyphsLength];

            drawGlyph.apply(this, [{
              node: node,
              position: glyph.position,
              size: glyph.size || node[prefix + 'size'] / 2,
              content: glyph.content,
              fillColor: glyph.fillColor,
              textColor: glyph.textColor,
              strokeColor: glyph.strokeColor,
              lineWidth: glyph.lineWidth,
              fontStyle: glyph.fontStyle,
              fontName: glyph.fontName,
              fontSize: glyph.fontSize,
              hidden: glyph.hidden
            }]);
          }
        }
      }
    }
  }

  // Bind glyphs method to renderers
  sigma.renderers.canvas.prototype.glyphs = glyphs;
}).call(this);
