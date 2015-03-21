;(function (undefined) {
    'use strict';

    if (typeof sigma === 'undefined')
        throw 'sigma is not declared';

    // Declare cypher package
    sigma.utils.pkg("sigma.neo4j");

    // Initialize package:
    sigma.utils.pkg('sigma.utils');
    sigma.utils.pkg('sigma.parsers');


    /**
     * This function execute a cypher and creates a new sigma instance or
     * updates the graph of a given instance. It is possible to give a callback
     * that will be executed at the end of the process.
     *
     * @param  {string}       url      The URL of neo4j server.
     * @param  {string}       cypher   The cypher query
     * @param  {object|sigma} sig      A sigma configuration object or a sigma
     *                                 instance.
     * @param  {?function}    callback Eventually a callback to execute after
     *                                 having parsed the file. It will be called
     *                                 with the related sigma instance as
     *                                 parameter.
     */
    sigma.neo4j.cypher = function (url, cypher, sig, callback) {
        var graph = { nodes: [], edges: [] },
            xhr = sigma.utils.xhr(),
            neo4jTransactionEndPoint = url + '/db/data/transaction/commit';

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';

        var data = {
            "statements": [
                {
                    "statement": cypher,
                    "resultDataContents": ["graph"],
                    "includeStats": false
                }
            ]
        };

        xhr.open('POST', neo4jTransactionEndPoint, true);
        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {
                var neo4jResult = JSON.parse(xhr.responseText);

                graph =  sigma.neo4j.cypher_parse(neo4jResult);

                // Update the instance's graph:
                if (sig instanceof sigma) {
                    sig.graph.clear();
                    sig.graph.read(graph);

                    // ...or instantiate sigma if needed:
                } else if (typeof sig === 'object') {
                    sig.graph = graph;
                    sig = new sigma(sig);

                    // ...or it's finally the callback:
                } else if (typeof sig === 'function') {
                    callback = sig;
                    sig = null;
                }

                // Call the callback if specified:
                if (callback)
                    callback(sig || graph);
            }
        };

        var postData = JSON.stringify(data);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(postData);
    };

    /**
     * This function parse a neo4j cypher query result.
     *
     * @param  {object}       neo4jResult The URL of neo4j server.
     *
     * @return A graph object
     */
    sigma.neo4j.cypher_parse = function(neo4jResult) {
        var graph = { nodes: [], edges: [] },
            nodesMap = {},
            edgesMap = {},
            key;

        // Iteration on all result data
        neo4jResult.results[0].data.forEach(function (data, index, ar) {

            // iteration on graph for all node
            data.graph.nodes.forEach(function (node, index, ar) {

                var sigmaNode = node.properties;
                sigmaNode.id = node.id;
                sigmaNode.label = node.id;
                sigmaNode.labels = node.labels;
                sigmaNode.x = Math.random();
                sigmaNode.y = Math.random();
                sigmaNode.size = 1;
                sigmaNode.color = '#000000';

                if (sigmaNode.id in nodesMap) {
                    // do nothing
                } else {
                    nodesMap[sigmaNode.id] = sigmaNode;
                }
            });

            // iteration on graph for all node
            data.graph.relationships.forEach(function (edge, index, ar) {
                var sigmaEdge = edge.properties;
                sigmaEdge.id = edge.id;
                sigmaEdge.type = edge.type;
                sigmaEdge.label = edge.type;
                sigmaEdge.source = edge.startNode;
                sigmaEdge.target = edge.endNode;
                sigmaEdge.color = '#7D7C8E';

                if (sigmaEdge.id in edgesMap) {
                    // do nothing
                } else {
                    edgesMap[sigmaEdge.id] = sigmaEdge;
                }
            });

        });

        // construct sigma nodes
        for (key in nodesMap) {
            graph.nodes.push(nodesMap[key]);
        }
        // construct sigma nodes
        for (key in edgesMap) {
            graph.edges.push(edgesMap[key]);
        }

        return graph;
    };

    /**
     * This function call neo4j to get all labels of the graph.
     *
     * @param  {string}       server      The URL of neo4j server.
     *
     * @return An array of label
     */
    sigma.neo4j.getLabels = function(server, callback) {
        var xhr = sigma.utils.xhr(),
            url;

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';
        url = server + '/db/data/labels';

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Call the callback if specified:
                if (callback)
                    callback(JSON.parse(xhr.responseText).sort());
            }
        };
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send();
    };

    /**
     * This function parse a neo4j cypher query result.
     *
     * @param  {string}       server      The URL of neo4j server.
     *
     * @return An array of relationship type
     */
    sigma.neo4j.getTypes = function(server, callback) {
        var xhr = sigma.utils.xhr(),
            url;

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';
        url = server + '/db/data/relationship/types';

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Call the callback if specified:
                if (callback)
                    callback(JSON.parse(xhr.responseText).sort());
            }
        };
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send();
    };

}).call(this);

    
