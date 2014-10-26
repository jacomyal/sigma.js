;(function(undefined) {

  /**
   * Sigma Renderer PoweredBy Utility
   * ================================
   *
   * The aim of this plugin is to display a clickable "powered by" text on the canvas.
   *
   * Author: Sébastien Heymann (sheymann) for Linkurious
   * Version: 0.0.1
   */

  function poweredBy(options) {
    options = options || {};
    var content,
        html = options.html || this.settings('poweredByHTML'),
        url = options.url || this.settings('poweredByURL'),
        pingURL = options.pingURL || this.settings('poweredByPingURL');

    if (!this.domElements['poweredby']) {
      this.initDOM('div', 'poweredby');

      if (url) {
        content = [
          '<a href="' +
          url +
          '" target="_blank" style="font-family:Lato,sans-serif;font-size:11px;color:#333;text-decoration:none;">' +
          html +
          '</a>'
        ];
      }
      else {
        content = [ html ];
      }

      if (pingURL) {
        var img = new Image();
        img.src = pingURL;
      }

      this.domElements['poweredby'].innerHTML = content.join('');
      this.domElements['poweredby'].style.bottom = 0;
      this.domElements['poweredby'].style.right = 0;
      this.domElements['poweredby'].style.background = 'rgba(255, 255, 255, 0.8)';

      this.container.appendChild(this.domElements['poweredby']);
    }
  }

  // Extending canvas and webl renderers
  sigma.renderers.canvas.prototype.poweredBy = poweredBy;
  sigma.renderers.webgl.prototype.poweredBy = poweredBy;

}).call(this);
