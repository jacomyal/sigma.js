;
(function() {
  'use strict';

  sigma.utils.pkg('sigma.webgl.nodes');

  /**
   * This node renderer can display nodes as regular polygons:
   * triangle, square, pentagram, hexagon..
   *
   * The fragment shader does not deal with anti-aliasing, so make sure that
   * you deal with it somewhere else in the code (by default, the WebGL
   * renderer will oversample the rendering through the webglOversamplingRatio
   * value).
   */
  sigma.webgl.nodes.def = {

    POINTS: 3,
    ATTRIBUTES: 12,

    addNode: function(node, data, i, prefix, settings) {

      var self = this;

      var trueColor = node.color || settings('defaultNodeColor');
      var imgCrossOrigin = settings('imgCrossOrigin') || 'anonymous';

      var color = sigma.utils.floatColor(trueColor);


      if (typeof self.spriteSheet === "undefined") {
        self.createSpriteSheet(settings);
      }
      var imageIndex = -1;

      var scale = 0.7;

      var numPoints = 999; // leave default
      var imageScaleW = 1.0; // leave default
      var imageScaleH = 1.0;

      var isConvex = 1;
      var shapeRotation = 0;

      switch (node.type || 'circle') {

        case 'circle':
        case 'disc':
        case 'disk':
          isConvex = 1;
          numPoints = 999;
          scale = 1.0;
          break;

        case 'square':
          isConvex = 0;
          numPoints = 4;
          scale = 0.7;
          if (typeof node.square !== "undefined") {
            if (typeof node.square.rotate === "number") {
              shapeRotation = node.square.rotate;
            }
          }
          break;

        case 'diamond':
          isConvex = 0;
          numPoints = 4;
          scale = 0.7;
          shapeRotation = 45 * Math.PI / 180; // 45°
          if (typeof node.diamond !== "undefined") {
            if (typeof node.diamond.rotate === "number") {
              shapeRotation = node.diamond.rotate;
            }
          }
          break;

        case 'triangle':
          isConvex = 0;
          numPoints = 3;
          scale = 0.5;
          shapeRotation = Math.PI;
          if (typeof node.triangle !== "undefined") {
            if (typeof node.triangle.rotate === "number") {
              shapeRotation = node.triangle.rotate;
            }
          }
          break;

        case 'star':
          isConvex = 1;
          scale = 0.7;
          numPoints = 5;
          if (typeof node.star !== "undefined") {
            if (typeof node.star.numPoints === "number") {
              numPoints = node.star.numPoints;
            }
            if (typeof node.star.rotate === "number") {
              shapeRotation = node.star.rotate;
            }
            // innerRatio: node.star.innerRatio || 1.0 // ratio of inner radius in star, compared to node.size
          }
          break;

        case 'seastar':
          isConvex = 2;
          scale = 0.5;
          numPoints = 5;
          if (typeof node.seastar !== "undefined") {
            if (typeof node.seastar.numPoints === 'number') {
              numPoints = node.seastar.numPoints;
            }
            if (typeof node.seastar.rotate === 'number') {
              shapeRotation = node.seastar.rotate;
            }
            // innerRatio: node.star.innerRatio || 1.0 // ratio of inner radius in star, compared to node.size
          }
          break;



        case 'equilateral':
          isConvex = 0;
          numPoints = 7;
          scale = 0.7;
          shapeRotation = 0;
          if (typeof node.equilateral !== "undefined") {
            if (typeof node.equilateral.numPoints === "number") {
              numPoints = node.equilateral.numPoints;
            }
            if (typeof node.equilateral.rotate === "number") {
              shapeRotation = node.equilateral.rotate;
            }
          }

          break;

        case 'hexagon':
          isConvex = 0;
          numPoints = 6;
          scale = 0.7;
          if (typeof node.hexagon !== "undefined") {
            if (typeof node.hexagon.rotate === "number") {
              shapeRotation = node.hexagon.rotate;
            }
          }
          break;

        case 'polygon':
          isConvex = 1;
          numPoints = 5;
          scale = 0.5;
          shapeRotation = 0;
          if (typeof node.polygon !== "undefined") {
            if (typeof node.polygon.type === "string") {
              isConvex = (node.polygon.type == 'convex') ? 1 : 0;
            }
            if (typeof node.polygon.angles === "number") {
              numPoints = Math.round(Math.max(3, Math.min(8, node.polygon.angles)));
            }
            if (typeof node.polygon.scale === "number") {
              scale = node.polygon.scale || (isConvex ? 0.5 : 0.7);
            }
            if (typeof node.polygon.rotate === "number") {
              shapeRotation = node.polygon.rotate;
            }
          }
          break;

        case 'cross':
          isConvex = 0; // desn't matter much
          numPoints = 9; // special code
          scale = 0.10;
          if (typeof node.cross !== "undefined") {
            if (typeof node.cross.lineWeight === "number") {
              scale = Math.max(0.10, Math.min(0.50, (node.cross.lineWeight) * 0.1));
            }
            if (typeof node.rotate === "number") {
              shapeRotation = node.cross.rotate;
            }
          }
          break;
      }


      if (typeof node.image !== "undefined") {

        var url = node.image.url || "";
        if (url.length > 0) {
          imageIndex = self.getImage(url, imgCrossOrigin);
          imageScaleW = node.image.w || 1.0;
          imageScaleH = node.image.h || 1.0;
        }

      }

      if (typeof node.icon !== "undefined") {

        var font = "Arial";
        if (typeof node.icon.font === "string") {
          font = node.icon.font;
        }

        var content = "";
        if (typeof node.icon.content === "string") {
          content = node.icon.content;
        }

        // adjust icon size
        var fontSizeRatio = 0.70;
        if (typeof node.icon.scale === "number") {
          fontSizeRatio = Math.abs(Math.max(0.01, node.icon.scale)) * 0.5;
        }

        // adjust icon background (border) and foreground (main) color
        var fgColor = node.icon.color || trueColor; // '#f00';
        var bgColor = node.color || trueColor;

        // adjust icon position
        var px = 0.5,
          py = 0.5;
        if (typeof node.icon.x === "number") {
          px = node.icon.x;
        }
        if (typeof node.icon.y === "number") {
          py = node.icon.y;
        }

        imageIndex = self.getText(font, bgColor, fgColor, fontSizeRatio, px, py, content);

      }



      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = 0;
      data[i++] = isConvex;
      data[i++] = numPoints;
      data[i++] = scale;
      data[i++] = shapeRotation;
      data[i++] = imageIndex;
      data[i++] = imageScaleW;
      data[i++] = imageScaleH;



      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = 2 * Math.PI / 3;
      data[i++] = isConvex;
      data[i++] = numPoints;
      data[i++] = scale;
      data[i++] = shapeRotation;
      data[i++] = imageIndex;
      data[i++] = imageScaleW;
      data[i++] = imageScaleH;


      data[i++] = node[prefix + 'x'];
      data[i++] = node[prefix + 'y'];
      data[i++] = node[prefix + 'size'];
      data[i++] = color;
      data[i++] = 4 * Math.PI / 3;
      data[i++] = isConvex;
      data[i++] = numPoints;
      data[i++] = scale;
      data[i++] = shapeRotation;
      data[i++] = imageIndex;
      data[i++] = imageScaleW;
      data[i++] = imageScaleH;



    },

    render: function(gl, program, data, params) {
      var buffer, self = this,
        args = arguments;


      if (typeof self.spriteSheet === 'undefined') {
        self.createSpriteSheet();
      }

      // Define attributes:
      var positionLocation = gl.getAttribLocation(program, 'a_position'),
        sizeLocation = gl.getAttribLocation(program, 'a_size'),
        colorLocation = gl.getAttribLocation(program, 'a_color'),
        angleLocation = gl.getAttribLocation(program, 'a_angle'),
        imageLocation = gl.getAttribLocation(program, 'a_image'),
        shapeLocation = gl.getAttribLocation(program, 'a_shape'),
        resolutionLocation = gl.getUniformLocation(program, 'u_resolution'),
        matrixLocation = gl.getUniformLocation(program, 'u_matrix'),
        ratioLocation = gl.getUniformLocation(program, 'u_ratio'),
        scaleLocation = gl.getUniformLocation(program, 'u_scale'),


        spriteDimLocation = gl.getUniformLocation(program, 'u_sprite_dim'),
        textureDimLocation = gl.getUniformLocation(program, 'u_texture_dim'),
        samplerUniformLocation = gl.getUniformLocation(program, 'u_sampler');

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.uniform2f(resolutionLocation, params.width, params.height);
      gl.uniform1f(
        ratioLocation, 1 / Math.pow(params.ratio, params.settings('nodesPowRatio')));
      gl.uniform1f(scaleLocation, params.scalingRatio);
      gl.uniformMatrix3fv(matrixLocation, false, params.matrix);


      gl.uniform2f(spriteDimLocation, self.spriteSheet.spriteWidth, self.spriteSheet.spriteHeight);
      gl.uniform2f(textureDimLocation, self.spriteSheet.maxWidth, self.spriteSheet.maxHeight);

      gl.enableVertexAttribArray(positionLocation);
      gl.enableVertexAttribArray(sizeLocation);
      gl.enableVertexAttribArray(colorLocation);
      gl.enableVertexAttribArray(angleLocation);
      gl.enableVertexAttribArray(shapeLocation);
      gl.enableVertexAttribArray(imageLocation);

      gl.vertexAttribPointer(
        positionLocation, 2, gl.FLOAT, false, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.vertexAttribPointer(
        sizeLocation, 1, gl.FLOAT, false, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
      gl.vertexAttribPointer(
        colorLocation, 1, gl.FLOAT, false, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12);
      gl.vertexAttribPointer(
        angleLocation, 1, gl.FLOAT, false, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);

      gl.vertexAttribPointer(
        shapeLocation, 4, gl.FLOAT, false, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);

      gl.vertexAttribPointer(
        imageLocation, 3, gl.FLOAT, false, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 36);



      // https://developer.mozilla.org/en-US/docs/Web/WebGL/Using_textures_in_WebGL
      if (typeof self.texture === 'undefined') {

        self.texture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, self.texture);


        // this function can throw a SecurityError:
        // "Failed to execute 'texImage2D' on 'WebGLRenderingContext':
        // Tainted canvases may not be loaded."
        //
        // This means the browser believes the canvas data is tainted / compromised
        // by an untrusted source (eg. an image from another website has been copied in it).
        // This can be caused by a cross-domain policy problem (eg. you used the
        // file:// protocol, or the image provider is not trusted)
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          self.spriteSheet.canvas
        );

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);


        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);

        //gl.uniform1i(gl.getUniformLocation(program, "u_sampler"), 0);
        //  gl.bindTexture(gl.TEXTURE_2D, null);
        //console.log("empty texture created");
        // this is a temporary hack, to force refresh
        setTimeout(function() {
          self.render.apply(self, args);
        }, 1000);
      }


      //console.log("self.updateNeeded: "+self.updateNeeded);
      if (typeof self.texture !== "undefined") {
        //console.log("texture defined, selecting it..");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, self.texture);

        if (self.updateNeeded) {
          //console.log("update needed!");
          self.updateNeeded = false;

          // https://www.khronos.org/webgl/public-mailing-list/archives/1212/msg00050.html
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

          gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.spriteSheet.canvas);
          //console.log("texture updated");
        }

        gl.uniform1i(gl.getUniformLocation(program, "u_sampler"), 0);

      }


      gl.drawArrays(
        gl.TRIANGLES,
        params.start || 0, params.count || (data.length / this.ATTRIBUTES)
      );


    },

    initProgram: function(gl) {
      var vertexShader, fragmentShader, program;

      vertexShader = sigma.utils.loadShader(
        gl, [
          'attribute vec2 a_position;',
          'attribute float a_size;',
          'attribute float a_color;',
          'attribute float a_angle;',

          'attribute vec4 a_shape;',
          'attribute vec3 a_image;',

          'uniform vec2 u_resolution;',
          'uniform float u_ratio;',
          'uniform float u_scale;',
          'uniform mat3 u_matrix;',
          'uniform vec2 u_sprite_dim;',
          'uniform vec2 u_texture_dim;',

          'varying vec4 shape;',
          'varying highp vec4 v_sprite;',
          'varying vec4 color;',
          'varying vec2 center;',
          'varying float radius;',
          'varying vec3 image;',

          'void main() {',
          // Multiply the point size twice:
          'radius = a_size * u_ratio;',

          // Scale from [[-1 1] [-1 1]] to the container:
          'vec2 position = (u_matrix * vec3(a_position, 1)).xy;',

          'center = position * u_scale;',
          'center = vec2(center.x, u_scale * u_resolution.y - center.y);',

          'position = position +',
          '2.0 * radius * vec2(cos(a_angle), sin(a_angle));',
          'position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);',

          'radius = radius * u_scale;',

          // s: isconvex, t: angles, p: scale, q: rotation
          'shape = a_shape;',
          'image = a_image;',

          // compute the index in the texture
          'highp vec2 sp = ',
          'vec2(mod((a_image.s * u_sprite_dim.x), u_texture_dim.x),',
          'floor((a_image.s * u_sprite_dim.x) / u_texture_dim.y) * u_sprite_dim.y);',

          // move pointer to center of sprite
          'sp = vec2(sp.x + (u_sprite_dim.x * 0.5),',
          ' sp.y + (u_sprite_dim.y * 0.5));',

          // we have the coordinates in pixel, we need to normalize [0.0, 1.0]
          'v_sprite = vec4(',
          'sp.x / u_texture_dim.x,',
          'sp.y / u_texture_dim.y,',
          'u_sprite_dim.x / u_texture_dim.x,',

          // https://www.khronos.org/webgl/public-mailing-list/archives/1212/msg00050.html
          '- u_sprite_dim.y / u_texture_dim.y', // the minus here is to flip the texture
          ');',

          'gl_Position = vec4(position, 0, 1);',

          // Extract the color:
          'float c = a_color;',
          'color.b = mod(c, 256.0); c = floor(c / 256.0);',
          'color.g = mod(c, 256.0); c = floor(c / 256.0);',
          'color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;',
          'color.a = 1.0;',
          '}'
        ].join('\n'), gl.VERTEX_SHADER);

      fragmentShader = sigma.utils.loadShader(
        gl, [

          '#ifdef GL_ES',
          'precision mediump float;',
          '#endif',

          '#define PI_2 6.283185307179586',
          '#define MAX_ANGLES 8', // no need to support a lot of angles, actually

          'varying vec4 shape;',
          'varying highp vec4 v_sprite;',
          'varying vec4 color;',
          'varying vec2 center;',
          'varying float radius;',
          'varying vec3 image;',

          'uniform sampler2D u_sampler;',

          'void main(void) {',


          // s: isconvex, t: angles, p: scale, q: rotation

          'int angles = int(shape.t);', // nb angles
          'int convex = int(shape.s);', // 0 for concave, 1 for convex

          'vec2 m = gl_FragCoord.xy - center;',

          'vec2 p = m.xy/radius;',


          'float theta = atan(p.y,p.x);',

          // transparent
          'vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);',


          // if we want to rotate the background:
          //'float bgAngle = 0.8;',
          //'mat2 bgRot = mat2(cos(bgAngle),sin(bgAngle),-sin(bgAngle),cos(bgAngle));',
          //'vec2 sp = p * bgRot;',


          // now we need to normalize pixels

          'vec4 color1 = (image.s >= 0.0) ?',
          ' texture2D(u_sampler, ',
          'vec2(',
          '(v_sprite.s + v_sprite.p * p.x * 0.5 * image.t),',
          '(v_sprite.t + v_sprite.q * p.y * 0.5 * image.p)',
          '))',
          ' : color',
          ';',


          // rotate the shape (shape.q is the rotation angle)
          'mat2 shapeRot = mat2(cos(shape.q),sin(shape.q),-sin(shape.q),cos(shape.q));',
          'p = p * shapeRot;',


          // render a disc
          'if (angles > 9) {',
          'gl_FragColor = ',
          // check if we are in the circle
          '((radius - sqrt(m.x * m.x + m.y * m.y)) > 0.0)',
          '? color1 : color0;',

          // render a cross
          '} else if (angles > 8){',
          'gl_FragColor = (',
          '(abs(p.x) > 0.0 && abs(p.x) < (1.0 - sin(shape.p)) && abs(p.y) < shape.p)',
          '|| (abs(p.y) > 0.0 && abs(p.y) < (1.0 - sin(shape.p)) && abs(p.x) < shape.p)',
          ') ? color1 : color0;',

          // render a polygon
          // note: this method does not permit changing a star's inner radius
          '} else {',

          // render a rounded star


          /*
          'if (false){', //convex > 0) {',
          // here shape.s is the number of angles and already in float
          // so we use it directly rather than 'angles'
          'float pk = 0.2;',
          'float k = 0.5;',
          'float radstart = 0.4;',
          'float n = 5.0;',
          'float powr = 1.0;',

          'if (dot(p,p) < ',
          '(1.0/pk',
          '* 1.0 / (',
          '1.0 - k ',
          '* pow(',
          '2.0*n ',
          '* abs(',
          'mod(',
          '(theta + radstart) / PI_2, 1.0/n) ',
          ' - 1.0/(2.0 * n)',
          ')',
          ', powr',
          ')',
          ')',
          ')',
          ') {',
          //'if (dot(p,p) < (  1.0 / exp(acos(sin(theta*shape.t)*0.5)))  )',
          '  gl_FragColor = color1;',
          'else ',
          'discard;',
          '} else {',
          */


          // divide scale by two for convex shapes, so that spikes are not cropped
          'float scale = (convex > 0) ? shape.p * 0.5 : shape.p;',

          // compute the angle for each side
          'float angle = PI_2 / shape.t;',
          'mat2 t = mat2(cos(angle),sin(angle),-sin(angle),cos(angle));',

          'int q = 0;',
          'for (int i=0;i<MAX_ANGLES;i++) {',
          'if (i >= angles) break;',

          'if (p.y < scale) q++;',

          'p *= t;',
          '}',

          'gl_FragColor =',
          '((convex > 0)', // select the kind of polygon
          '? (q > angles - (angles - 1) / 2)', // convex
          ': (q > angles - 1))', // concave
          '? color1 : color0;', // inside: color, outside: transparent
          //  '}',
          '}',


          '}'
        ].join('\n'), gl.FRAGMENT_SHADER);

      program = sigma.utils.loadProgram(gl, [vertexShader, fragmentShader]);

      return program;
    },

    createSpriteSheet: function(settings) {
      var self = this;

      var config = {
        maxWidth: settings('spriteSheetResolution') || 2048,
        maxHeight: settings('spriteSheetResolution') || 2048,
        maxSprites: settings('spriteSheetMaxSprites') || 256
      };

      //console.log(config);

      var spriteWidth = config.maxWidth / Math.sqrt(config.maxSprites);
      var spriteHeight = config.maxHeight / Math.sqrt(config.maxSprites);

      // console.log("sprite width: " + spriteWidth + ", height: " + spriteHeight);

      // to debug you can use an existing canvas: getElementById("canvas");
      var canvas = document.createElement('canvas');
      canvas.width = config.maxWidth;
      canvas.height = config.maxHeight;

      var ctx = canvas.getContext('2d');

      self.spriteSheet = {
        canvas: canvas,
        maxWidth: config.maxWidth,
        maxHeight: config.maxHeight,
        maxSprites: config.maxSprite,
        spriteWidth: spriteWidth,
        spriteHeight: spriteHeight,
        currentIndex: 1,
        urlToIndex: {}
      };

    },

    getText: function(font, bgColor, fgColor, fontSizeRatio, px, py, text) {

      var self = this;

      var fontSize = Math.round(fontSizeRatio * self.spriteSheet.spriteHeight);

      var pwx = px * self.spriteSheet.spriteWidth;
      var phy = py * self.spriteSheet.spriteHeight;

      var uid = font +
        ':' + bgColor +
        ':' + fgColor +
        ':' + fontSize +
        ':' + text +
        ':' + pwx +
        ':' + phy;

      if (uid in self.spriteSheet.urlToIndex) {
        return self.spriteSheet.urlToIndex[uid];
      }

      var index = self.spriteSheet.currentIndex;

      self.spriteSheet.currentIndex += 1;

      self.spriteSheet.urlToIndex[uid] = index;

      var x = (index * self.spriteSheet.spriteWidth) % self.spriteSheet.maxWidth;
      var y = Math.floor(
        (index * self.spriteSheet.spriteWidth) / self.spriteSheet.maxWidth
      ) * self.spriteSheet.spriteHeight;

      var ctx = self.spriteSheet.canvas.getContext('2d');

      ctx.beginPath();
      ctx.rect(x, y, self.spriteSheet.spriteWidth, self.spriteSheet.spriteHeight);
      ctx.fillStyle = bgColor;
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = fgColor;
      ctx.font = '' + (fontSize) + 'px ' + font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + pwx, y + phy);

      self.updateNeeded = true;

      return index;
    },

    // load an image from the internet, scale it and put in in the spreadsheet
    // there is an unmanaged cache, which will incrementally grow in size
    // in the future we should fix this memory leak somehow, eg. limited size
    // of the cache (parametrable)
    getImage: function(url, imgCrossOrigin) {

      var self = this;

      var ctx = self.spriteSheet.canvas.getContext('2d');

      if (url.length < 1) {
        return -1;
      }


      if (url in self.spriteSheet.urlToIndex) {
        return self.spriteSheet.urlToIndex[url];
      }


      var index = self.spriteSheet.currentIndex;

      if (index > self.spriteSheet.maxSprites) {
        //console.log("sorry, max number of different images reached (maxSprites: " + self.spriteSheet.maxSprites + ")");
        return -1;
      }

      self.spriteSheet.currentIndex += 1;

      self.spriteSheet.urlToIndex[url] = index;

      var img = new Image();

      img.setAttribute('crossOrigin', imgCrossOrigin);

      img.onload = function() {

        var x = (index * self.spriteSheet.spriteWidth) % self.spriteSheet.maxWidth;
        var y = Math.floor((index * self.spriteSheet.spriteWidth) / self.spriteSheet.maxWidth) * self.spriteSheet.spriteHeight;


        ctx.drawImage(
          img,
          0, 0,
          img.width, img.height,
          x, y,
          self.spriteSheet.spriteWidth, self.spriteSheet.spriteHeight
        );

        self.updateNeeded = true;

      };
      img.src = url;

      return index;
    }


  };

})();
