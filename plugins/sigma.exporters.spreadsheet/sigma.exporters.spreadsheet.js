;(function(undefined) {
  'use strict';

  /**
   * Sigma Spreadsheet File Exporter
   * ================================
   *
   * The aim of this plugin is to enable users to retrieve a Spreadsheet file
   * for nodes or edges of the graph.
   *
   * Author: Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * Version: 0.0.1
   */

  if (typeof sigma === 'undefined')
    throw 'sigma.exporters.spreadsheet: sigma is not declared';

  // Utilities
  function doThrow(str) {
    throw 'sigma.exporters.spreadsheet: ' + str;
  }

  function download(dataUrl, extension, filename) {
    // Anchor
    var anchor = document.createElement('a');
    anchor.setAttribute('href', dataUrl);
    anchor.setAttribute('download', filename || 'graph.' + extension);

    // Click event
    var event = document.createEvent('MouseEvent');
    event.initMouseEvent('click', true, false, window, 0, 0, 0 ,0, 0,
      false, false, false, false, 0, null);

    anchor.dispatchEvent(event);
    anchor.remove();
  }

  function escape(x, separator) {
    if (x === null || x === undefined)
      return separator + separator;

    if (typeof x === 'function')
      x = x.toString().replace(/\s+/g, ' ');

    x = (typeof x === 'string') ? x : JSON.stringify(x);

    if (separator && separator.length) {
      return separator +
        x.replace(
          separator,
          (separator === '"') ? "'" : '"'
        ) +
        separator;
    }
    else
      return x;
  }

  /**
   * Convert Javascript string in dot notation into an object reference.
   *
   * @param  {object} obj The object.
   * @param  {string} str The string to convert, e.g. 'a.b.etc'.
   * @return {?}          The object reference.
   */
  function strToObjectRef(obj, str) {
    // http://stackoverflow.com/a/6393943
    if (str === null || str === undefined) return null;
    return str.split('.').reduce(function(obj, i) { return obj[i] }, obj);
  }

  /**
   * Transform the graph memory structure into a Spreadsheet file.
   *
   * @param  {object} params The options.
   * @return {string}        The Spreadsheet string.
   */
  sigma.prototype.toSpreadsheet = function(params) {
      params = params || {};
      params.separator = params.separator || ',';
      params.textSeparator = params.textSeparator || '';

      if (params.textSeparator && params.textSeparator !== '"' && params.textSeparator !== "'")
        doThrow('Wrong argument "textSeparator": ' + params.textSeparator);

      var rows = [],
          index = {},
          attributesArr = [],
          cpt = 0,
          data,
          attributes,
          o;

      if (!params.what)
        doThrow('Missing argument "what".');

      if (params.what === 'nodes') {
        if (params.which)
          data = this.graph.nodes(params.which)
        else
          data = this.graph.nodes();
      }
      else if (params.what === 'edges') {
        if (params.which)
          data = this.graph.edges(params.which)
        else
          data = this.graph.edges();
      }
      else
        doThrow('Wrong argument "what": ' + params.what);

      // Find all attributes keys to provide fixed row length to deal with
      // missing attributes
      index['id'] = cpt++;
      attributesArr.push(escape('id', params.textSeparator));

      if (params.what === 'edges') {
        index['source'] = cpt++;
        attributesArr.push(escape('source', params.textSeparator));
        index['target'] = cpt++;
        attributesArr.push(escape('target', params.textSeparator));
      }

      for (var i = 0 ; i < data.length ; i++) {
        o = data[i];
        attributes = strToObjectRef(o, params.attributes) || {};
        Object.keys(attributes).forEach(function (k) {
          if (!(k in index)) {
            index[k] = cpt++;
            attributesArr.push(
              escape(k, params.textSeparator)
            );
          }
        });
      }
      rows.push(attributesArr);

      // Get attribute values
      for (var i = 0 ; i < data.length ; i++) {
        o = data[i];
        var arr = [];
        arr.length = cpt;

        arr[0] = escape(o.id, params.textSeparator);

        if (params.what === 'edges') {
          arr[1] = escape(o.source, params.textSeparator);
          arr[2] = escape(o.target, params.textSeparator);
        }

        attributes = strToObjectRef(o, params.attributes) || {};
        Object.keys(attributes).forEach(function (k) {
          arr[index[k]] = escape(attributes[k], params.textSeparator);
        });
        rows.push(arr);
      }

      var serialized = rows.map(function(arr) {
        return arr.join(params.separator);
      }).join('\n');

      if (params.download) {
        download(
          'data:text/csv;charset=UTF-8,' +
            encodeURIComponent(serialized),
          'csv',
          params.filename
        );
      }

      return serialized;
  };
}).call(this);
