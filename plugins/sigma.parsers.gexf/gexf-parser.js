/*
| -------------------------------------------------------------------
|  GEXF Parser
| -------------------------------------------------------------------
|
|
| Author : PLIQUE Guillaume (Yomguithereal)
| URL: https://github.com/Yomguithereal/gexf-parser
| Version : 1.0
*/

(function(undefined) {
  'use strict';

  // Helpers
  //=========

  // Using prototypes was a bad idea for cross-browser compatibility
  // I decided to go back to functions

  var helpers = {

    // Transform a NodeList Object to iterable array
    nodeListToArray: function(nodeList) {

      // Return array
      var children = [];

      // Iterating
      for (var i = 0, len = nodeList.length; i < len; ++i) {
        if (nodeList[i].nodeName !== '#text')
          children.push(nodeList[i]);
      }

      return children;
    },

    // Transform a NodeList Object into an indexed hash
    nodeListToHash: function(nodeList, filter) {

      // Return object
      var children = {};

      // Iterating
      for (var i = 0; i < nodeList.length; i++) {
        if (nodeList[i].nodeName !== '#text') {
          var prop = filter(nodeList[i]);
          children[prop.key] = prop.value;
        }
      }

      return children;
    },

    // Transform NamedNodeMap into hash of attributes
    namedNodeMapToObject: function(nodeMap) {

        // Return object
      var attributes = {};

      // Iterating
      for (var i = 0; i < nodeMap.length; i++) {
        attributes[nodeMap[i].name] = nodeMap[i].value;
      }

      return attributes;
    },

    // Get first el by namespaced tag name
    getFirstElementByTagNS: function(node, ns_tag) {
      var el = node.getElementsByTagName(ns_tag[1])[0];

      if (!el)
        el = node.getElementsByTagNameNS(ns_tag[0], ns_tag[1])[0];

      if (!el)
        el = node.getElementsByTagName(ns_tag.join(':'))[0];

      return el;
    },

    // Type Enforcing
    enforceType: function(type, value) {

      switch (type) {
        case 'boolean':
          value = (value === 'true');
          break;

        case 'integer':
        case 'long':
        case 'float':
        case 'double':
          value = +value;
          break;
      }

      return value;
    }

  };


  //------------------------------------------------------------------


  // Structures
  //============

  // Graph Struct
  //--------------
  function graph(xml) {

    // TODO: Controls GEXF
    // TODO: Hierarchy and Philogeny
    // TODO: Dynamics
    // TODO: Drop map instructions if performances were to be bad
    // TODO: dealing with viz on edges tags

    // Basic Properties
    //
    var _root_el = xml.getElementsByTagName('gexf')[0];
    var _graph_el = xml.getElementsByTagName('graph')[0];
    var _meta_el = xml.getElementsByTagName('meta')[0];
    var _model_els = xml.getElementsByTagName('attribute');
    var _node_els = xml.getElementsByTagName('node');
    var _edge_els = xml.getElementsByTagName('edge');

    var _hasViz = _root_el.getAttribute('xmlns:viz') !== null;

    // Parser Functions
    //

    // Graph Version
    function _version() {
      return _root_el.getAttribute('version') || '1.0';
    }

    // Graph Mode
    function _mode() {
      return _graph_el.getAttribute('mode') || 'static';
    }

    // Default Edge Type
    function _defaultEdgeType() {
      return _graph_el.getAttribute('defaultedgetype') || 'undirected';
    }

    // Meta Data
    function _metaData() {

      var metas = {};
      if (!_meta_el)
        return metas;

      // Last modified date
      metas.lastmodifieddate = _meta_el.getAttribute('lastmodifieddate');

      // Other information
      var meta_children = helpers.nodeListToArray(_meta_el.childNodes);

      meta_children.map(function(child) {
        metas[child.tagName.toLowerCase()] = child.textContent;
      });

      return metas;
    }

    // Models
    function _model() {
      var attributes = [];

      // Iterating through attributes
      helpers.nodeListToArray(_model_els).map(function(attr) {

        // Properties
        var properties = {
          id: attr.getAttribute('id') || attr.getAttribute('for'),
          type: attr.getAttribute('type') || 'string',
          title: attr.getAttribute('title') || ''
        };

        // Getting default
        var default_el = helpers.nodeListToArray(attr.childNodes);

        if (default_el.length > 0)
          properties.defaultValue = default_el[0].textContent;

        // Creating attribute
        attributes.push(properties);
      });

      return {
        attributes: attributes
      };
    }

    // Nodes
    function _nodes(model) {
      var nodes = [];

      // Iteration through nodes
      helpers.nodeListToArray(_node_els).map(function(n) {

        // Basic properties
        var properties = {
          id: n.getAttribute('id'),
          label: n.getAttribute('label') || ''
        };

        // Retrieving data from nodes if any
        if (model.attributes.length > 0)
          properties.attributes = _nodeData(model, n);

        // Retrieving viz information
        if (_hasViz)
          properties.viz = _nodeViz(n);

        nodes.push(node(properties));
      });

      return nodes;
    }

    // Data from nodes
    function _nodeData(model, node) {

      var data = {};
      var attvalues_els = node.getElementsByTagName('attvalue');

      // Getting Node Indicated Attributes
      var ah = helpers.nodeListToHash(attvalues_els, function(el) {
        var attributes = helpers.namedNodeMapToObject(el.attributes);
        var key = attributes.id || attributes['for'];

        // Returning object
        return {key: key, value: attributes.value};
      });


      // Iterating through model
      model.attributes.map(function(a) {

        // Default value?
        var att_title = a.title.toLowerCase();
        data[att_title] = !(a.id in ah) && 'defaultValue' in a ?
          helpers.enforceType(a.type, a.defaultValue) :
          helpers.enforceType(a.type, ah[a.id]);

      });

      return data;
    }

    // Viz information from nodes
    function _nodeViz(node) {
      var viz = {};

      // Color
      var color_el = helpers.getFirstElementByTagNS(node, ['viz', 'color']);

      if (color_el) {
        var color = ['r', 'g', 'b', 'a'].map(function(c) {
          return color_el.getAttribute(c);
        });

        viz.color = (color[4]) ?
          'rgba(' + color.join(',') + ')' :
          'rgb(' + color.slice(0, -1).join(',') + ')';
      }

      // Position
      var pos_tag = ['viz', 'position'];
      var position_el = helpers.getFirstElementByTagNS(node, pos_tag);

      if (position_el) {
        viz.position = {};

        ['x', 'y', 'z'].map(function(p) {
          viz.position[p] = +position_el.getAttribute(p);
        });
      }

      // Size
      var size_el = helpers.getFirstElementByTagNS(node, ['viz', 'size']);
      if (size_el)
        viz.size = +size_el.getAttribute('value');

      // Shape
      var shape_el = helpers.getFirstElementByTagNS(node, ['viz', 'shape']);
      if (shape_el)
        viz.shape = shape_el.getAttribute('value');

      return viz;
    }

    // Edges
    function _edges(default_type) {
      var edges = [];

      // Iteration through edges
      helpers.nodeListToArray(_edge_els).map(function(e) {

        // Creating the edge
        var properties = helpers.namedNodeMapToObject(e.attributes);
        if (!('type' in properties)) {
          properties.type = default_type;
        }

        edges.push(edge(properties));
      });

      return edges;
    }


    // Properties
    //
    var model = _model();
    var defaultedgetype = _defaultEdgeType();

    return {
      version: _version(),
      mode: _mode(),
      defaultEdgeType: defaultedgetype,
      meta: _metaData(),
      model: model,
      nodes: _nodes(model),
      edges: _edges(defaultedgetype)
    };
  }


  // Node Struct
  //-------------
  function node(properties) {

    // Possible Properties
    return {
      id: properties.id,
      label: properties.label,
      attributes: properties.attributes || {},
      viz: properties.viz || {}
    };
  }


  // Edge Struct
  //-------------
  function edge(properties) {

    // Possible Properties
    return {
      id: properties.id,
      type: properties.type || 'undirected',
      label: properties.label || '',
      source: properties.source,
      target: properties.target,
      weight: +properties.weight || 1.0
    };
  }


  //------------------------------------------------------------------


  // Inner Functions
  //=================

  // Fetching GEXF with XHR
  function _fetch(gexf_url, callback) {
    var xhr = (function() {
      if (window.XMLHttpRequest)
        return new XMLHttpRequest();

      var names,
          i;

      if (window.ActiveXObject) {
        names = [
          'Msxml2.XMLHTTP.6.0',
          'Msxml2.XMLHTTP.3.0',
          'Msxml2.XMLHTTP',
          'Microsoft.XMLHTTP'
        ];

        for (i in names)
          try {
            return new ActiveXObject(names[i]);
          } catch (e) {}
      }

      return null;
    })();

    if (!xhr)
      throw 'XMLHttpRequest not supported, cannot load the file.';

    if (typeof callback === 'function') {
      xhr.overrideMimeType('text/xml');
      xhr.open('GET', gexf_url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4)
          callback(xhr.responseXML);
      };
      xhr.send();

      // Returning XHR object
      return xhr;
    } else {
      xhr.overrideMimeType('text/xml');
      xhr.open('GET', gexf_url, false);
      xhr.send();

      // Returning GEXF content
      return xhr.responseXML;
    }
  }

  // Parsing the GEXF File
  function _parse(gexf) {
    return graph(gexf);
  }

  // Fetch and parse the GEXF File
  function _fetchAndParse(gexf_url, callback) {
    if (typeof callback === 'function') {
      return _fetch(gexf_url, function(gexf) {
        callback(graph(gexf));
      });
    } else
      return graph(_fetch(gexf_url));
  }


  //------------------------------------------------------------------


  // Public API
  //============
  this.GexfParser = {

    // Functions
    parse: _parse,
    fetch: _fetchAndParse,

    // Version
    version: '0.1'
  };

}).call(this);
