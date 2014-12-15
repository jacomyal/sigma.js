;(function(undefined) {
  'use strict';

  /**
   * Sigma Spreadsheet File Exporter
   * ================================
   *
   * The aim of this plugin is to enable users to retrieve an Excel 2007+
   * spreadsheet file for nodes and edges of the graph.
   *
   * Author: Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * Version: 0.0.1
   */

  if (typeof sigma === 'undefined')
    throw 'sigma.exporters.xlsx: sigma is not declared';

  if (typeof XLSX === 'undefined')
    throw 'sigma.exporters.xlsx: XLSX is not declared';

  // Utilities
  function doThrow(str) {
    throw 'sigma.exporters.xlsx: ' + str;
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

  // string to array buffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  function format(x) {
    if (x === null || x === undefined)
      return '';

    if (typeof x === 'function')
      x = x.toString();

    if (typeof x !== 'number')
      x = (typeof x === 'string') ? x : JSON.stringify(x);

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

  function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }

  function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  }

  // make sheet from array of arrays
  function sheet(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
      for(var C = 0; C != data[R].length; ++C) {
        if(range.s.r > R) range.s.r = R;
        if(range.s.c > C) range.s.c = C;
        if(range.e.r < R) range.e.r = R;
        if(range.e.c < C) range.e.c = C;
        var cell = {v: data[R][C] };
        if(cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

        if(typeof cell.v === 'number') cell.t = 'n';
        else if(typeof cell.v === 'boolean') cell.t = 'b';
        else if(cell.v instanceof Date) {
          cell.t = 'n'; cell.z = XLSX.SSF._table[14];
          cell.v = datenum(cell.v);
        }
        else cell.t = 's';

        ws[cell_ref] = cell;
      }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  }

  // make array of nodes or edges
  function toArray(data, params) {
    var cpt = 0,
        index = {},
        attributesArr = [],
        attributes,
        attributesPath,
        o,
        rows = [];

    attributesPath = (params.what === 'edges') ?
      params.edgesAttributes : params.nodesAttributes;

    // Find all attributes keys to provide fixed row length to deal with
    // missing attributes
    index['id'] = cpt++;
    attributesArr.push('id');

    if (params.what === 'edges') {
      index['source'] = cpt++;
      attributesArr.push('source');
      index['target'] = cpt++;
      attributesArr.push('target');
    }

    for (var i = 0 ; i < data.length ; i++) {
      o = data[i];
      attributes = strToObjectRef(o, attributesPath) || {};
      Object.keys(attributes).forEach(function (k) {
        if (!(k in index)) {
          index[k] = cpt++;
          attributesArr.push(format(k));
        }
      });
    }
    rows.push(attributesArr);

    // Get attribute values
    for (var i = 0 ; i < data.length ; i++) {
      o = data[i];
      var arr = [];
      arr.length = cpt;

      arr[0] = format(o.id);

      if (params.what === 'edges') {
        arr[1] = format(o.source);
        arr[2] = format(o.target);
      }

      attributes = strToObjectRef(o, attributesPath) || {};
      Object.keys(attributes).forEach(function (k) {
        arr[index[k]] = format(attributes[k]);
      });
      rows.push(arr);
    }
    return rows;
  }

  /**
   * Transform the graph memory structure into a Spreadsheet file.
   *
   * @param  {object} params The options.
   * @return {string}        The Spreadsheet string.
   */
  sigma.prototype.toXLSX = function(params) {
      params = params || {};

      var wb = new Workbook(),
          wsNodes,
          wsEdges,
          data;

      if (!params.what) {
        params.what = 'nodes';
        wsNodes = sheet(toArray(this.graph.nodes(), params));
        params.what = 'edges';
        wsEdges = sheet(toArray(this.graph.edges(), params));
      }
      else {
        if (params.what === 'nodes') {
          if (params.which)
            data = this.graph.nodes(params.which)
          else
            data = this.graph.nodes();

          wsNodes = sheet(toArray(data, params));
        }
        else if (params.what === 'edges') {
          if (params.which)
            data = this.graph.edges(params.which)
          else
            data = this.graph.edges();

          wsEdges = sheet(toArray(data, params));
        }
        else
          doThrow('Wrong argument "what": ' + params.what);
      }

      /* add worksheets to workbook */
      if (wsNodes) {
        wb.SheetNames.push('Nodes');
        wb.Sheets['Nodes'] = wsNodes;
      }
      if (wsEdges) {
        wb.SheetNames.push("Edges");
        wb.Sheets["Edges"] = wsEdges;
      }

      var wbout = XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'binary' });
      var blob = new Blob([s2ab(wbout)], {type:''});

      download(
        URL.createObjectURL(blob),
        'xlsx',
        params.filename
      );
  };
}).call(this);
