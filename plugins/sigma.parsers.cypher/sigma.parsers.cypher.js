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
     * This function is an helper for the neo4j communication.
     *
     * @param   {string|object}     neo4j       The URL of neo4j server or a neo4j server object.
     * @param   {string}            endpoint    Endpoint of the neo4j server
     * @param   {string}            method      The calling method for the endpoint : 'GET' or 'POST'
     * @param   {object|string}     data        Data that will be send to the server
     * @param   {function}          callback    The callback function
     */
    sigma.neo4j.send = function(neo4j, endpoint, method, data, callback) {
        var xhr = sigma.utils.xhr(),
            url, user, password;

        // if neo4j arg is not an object
        url = neo4j;
        if(typeof neo4j === 'object') {
            url = neo4j.url;
            user = neo4j.user;
            password = neo4j.password;
        }

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';

        // Construct the endpoint url
        url += endpoint;

        xhr.open(method, url, true);
        if( user && password) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + password));
        }
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Call the callback if specified:
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.send(data);
    };

    /**
     * This function parse a neo4j cypher query result, and transform it into
     * a sigma graph object.
     *
     * @param  {object}     result      The server response of a cypher query.
     *
     * @return A graph object
     */
    sigma.neo4j.cypher_parse = function(result) {
        var graph = { nodes: [], edges: [] },
            nodesMap = {},
            edgesMap = {},
            key;

        // Iteration on all result data
        result.results[0].data.forEach(function (data) {

            // iteration on graph for all node
            data.graph.nodes.forEach(function (node) {

                var sigmaNode =  {
                    id : node.id,
                    label : node.id,
                    x : Math.random(),
                    y : Math.random(),
                    size : 1,
                    color : '#000000',
                    neo4j_labels : node.labels,
                    neo4j_data : node.properties
                };

                if (sigmaNode.id in nodesMap) {
                    // do nothing
                } else {
                    nodesMap[sigmaNode.id] = sigmaNode;
                }
            });

            // iteration on graph for all node
            data.graph.relationships.forEach(function (edge) {
                var sigmaEdge =  {
                    id : edge.id,
                    label : edge.type,
                    source : edge.startNode,
                    target : edge.endNode,
                    color : '#7D7C8E',
                    neo4j_type : edge.type,
                    neo4j_data : edge.properties
                };

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
     * This function execute a cypher and create a new sigma instance or
     * updates the graph of a given instance. It is possible to give a callback
     * that will be executed at the end of the process.
     *
     * @param  {object|string}      neo4j       The URL of neo4j server or a neo4j server object.
     * @param  {string}             cypher      The cypher query
     * @param  {?object|?sigma}     sig         A sigma configuration object or a sigma instance.
     * @param  {?function}          callback    Eventually a callback to execute after
     *                                          having parsed the file. It will be called
     *                                          with the related sigma instance as
     *                                          parameter.
     */
    sigma.neo4j.cypher = function (neo4j, cypher, sig, callback) {
        var endpoint = '/db/data/transaction/commit',
            data, cypherCallback;

        // Data that will be send to the server
        data = JSON.stringify({
            "statements": [
                {
                    "statement": cypher,
                    "resultDataContents": ["graph"],
                    "includeStats": false
                }
            ]
        });

        // Callback method after server response
        cypherCallback = function (callback) {

            return function (response) {

                var graph = { nodes: [], edges: [] };

                graph = sigma.neo4j.cypher_parse(response);

                // Update the instance's graph:
                if (sig instanceof sigma) {
                    sig.graph.clear();
                    sig.graph.read(graph);

                    // ...or instantiate sigma if needed:
                } else if (typeof sig === 'object') {
                    sig = new sigma(sig);
                    sig.graph.read(graph);
                    sig.refresh();

                    // ...or it's finally the callback:
                } else if (typeof sig === 'function') {
                    callback = sig;
                    sig = null;
                }

                // Call the callback if specified:
                if (callback)
                    callback(sig || graph);
            };
        };

        // Let's call neo4j
        sigma.neo4j.send(neo4j, endpoint, 'POST', data, cypherCallback(callback));
    };

    /**
     * This function call neo4j to get all labels of the graph.
     *
     * @param  {string}       neo4j      The URL of neo4j server or an object with the url, user & password.
     * @param  {function}     callback   The callback function
     *
     * @return An array of label
     */
    sigma.neo4j.getLabels = function(neo4j, callback) {
        sigma.neo4j.send(neo4j, '/db/data/labels', 'GET', null, callback);
    };

    /**
     * This function parse a neo4j cypher query result.
     *
     * @param  {string}       neo4j      The URL of neo4j server or an object with the url, user & password.
     * @param  {function}     callback   The callback function
     *
     * @return An array of relationship type
     */
    sigma.neo4j.getTypes = function(neo4j, callback) {
        sigma.neo4j.send(neo4j, '/db/data/relationship/types', 'GET', null, callback);
    };

}).call(this);

    
