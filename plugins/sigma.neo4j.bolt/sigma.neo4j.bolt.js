;(function (undefined) {
    'use strict';

    if (typeof sigma === 'undefined') {
    	throw 'sigma is not declared';
    }
    
    if (!('Promise' in window)) {
    	throw 'Your browser must support Promise Object';
    }
    
    var driver = null,
        sig = null,
        version = null;
    
    // Declare neo4j package
    sigma.utils.pkg("sigma.neo4j");
    
    /*
     * Convert the Record object of neo4j bolt web driver in order to get
     * the integer value
     *
     * @param {Record} primitive.   The Record object returned by neo4j bolt web api.
     *
     */
    var convertPrimitive = function convertPrimitive (primitive) {
        var keys = Object.keys(primitive.properties);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i],
                property = primitive.properties[key];
            if (typeof property === 'object'
                    && 'high' in property && 'low' in property) {
                property = property.low;
            }
        }
        primitive.identity = primitive.identity.low;
        if ('start' in primitive && 'end' in primitive) {
            primitive.start = primitive.start.low;
            primitive.end = primitive.end.low;
        }
    };
    
    /**
     * This function parse a neo4j cypher query result, and transform it into
     * a sigma graph object. (Inspired by sigma.neo4j.cypher plugin)
     *
     * @param {Result} response.   The Result object returned by neo4j bolt web api.
     *
     * @return {graph} Sigma.js Graph object
     */
    var driverResultToSigmaGraph = function driverResultToSigmaGraph (response) {
        var graph = { nodes: [], edges: [] },
            nodesMap = {},
            edgesMap = {},
            key;
        
        response.records.forEach(function (record) {
            record._fields.forEach(function (primitive) {
                if (!primitive) {
                    return;
                }
                convertPrimitive(primitive);
                if (('start' in primitive
                        || 'end' in primitive
                        || 'type' in primitive)
                        && !sig.graph.edges(primitive.identity)) {
                    edgesMap[primitive.identity] = {
                        id : primitive.identity,
                        label : primitive.type,
                        source : primitive.start,
                        target : primitive.end,
                        color : '#7D7C8E',
                        neo4j_type : primitive.type,
                        neo4j_data : primitive.properties
                    };
                } else if (!sig.graph.nodes(primitive.identity)) {
                    nodesMap[primitive.identity] =  {
                        id : primitive.identity,
                        label : primitive.identity,
                        x : Math.random(),
                        y : Math.random(),
                        size : 1,
                        color : '#000000',
                        neo4j_labels : primitive.labels,
                        neo4j_data : primitive.properties
                    };
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
    }
    
    //pass draw the graph
    var onResolve = function onResolve (response, addToGraph) {
        var graph = driverResultToSigmaGraph(response);
        if (!addToGraph) {//if it is invoked by queryStream method doesn't clear the graph
           sig.graph.clear();
        }
        sig.graph.read(graph);
        return sig;
    };

    /**
     * This function connect to neo4j via bolt connection and create the sigmajs object
     *
     * @param {object} neo4jOpts.   Options to pass to neo4j; defaults:
     * <b>{
     *   endpoint : 'bolt://localhost',
     *   auth : { scheme : 'basic', principal : '<neo4j_connection_username>', password : '<neo4j_connection_password>' },
     *   version : 'v1'
     * }</b>
     * @param {object} sigOpts.     Options to pass to sigma.js, see sigma.js docs for details.
     *
     * @return {Driver} A neo4j Driver object
     */
    sigma.neo4j.connect = function connect (neo4jOpts, sigOpts) {
    	if (arguments.length !== 2) {
    		throw 'You must define both neo4j and sigma options';
    	}
        version = neo4jOpts.version || 'v1';
        var endpoint = neo4jOpts.endpoint || 'bolt://localhost';
        var auth = !neo4jOpts.auth.scheme ?
                neo4j[version].auth.basic(neo4jOpts.auth.principal, neo4jOpts.auth.password) : neo4jOpts.auth;
        sig = new sigma(sigOpts);
        sig.refresh();
        driver = neo4j[version].driver(endpoint, auth);
        return driver;
    };
    
    /**
     * This function is for quering neo4j and draw the graph once the result is completly retrived
     *
     * @param {string} statement.   Neo4j Statement
     * @param {object} params.      Params of statement template
     *
     * @return {Promise} A Promise object
     */
    sigma.neo4j.query = function query (statement, params) {
    	return new Promise(function (resolve, reject) {
    		var session = driver.session();
            session.run(statement, params)
    			.then(function (response) {
                    resolve(onResolve(response));
                    session.close();
                })
    			.catch(reject);
    	});
    };
    
    /**
     * This function is for quering neo4j and draw the graph progressively
     * as records arrive by neo4j stream api
     *
     * @param {string} statement.   Neo4j Statement
     * @param {object} params.      Params of statement template
     *
     * @return {Promise} A Promise object
     */
    sigma.neo4j.queryStream = function queryStream (statement, params) {
    	return new Promise(function (resolve, reject) {
            var session = driver.session();
            session.run(statement, params)
                .subscribe({
                    onNext : function onNext (record) {
                        //console.log('onNext', record._fields);
                        onResolve({ records : [record] }, true);
                    },
                    onCompleted : function onCompleted () {
                        // Completed!
                        session.close();
                        resolve(sig);
                    },
                    onError : function onError (error) {
                        console.log('onError', error);
                        reject(error);
                    }
                });
        })
    };
    
    /**
     * This function collect all the node labels of the graph.
     *
     * @return {array} An array of labels
     */
    sigma.neo4j.getLabels = function() {
        //sigma.neo4j.send(neo4j, '/db/data/labels', 'GET', null, callback);
        return new Promise(function (resolve, reject) {
            var session = driver.session();
            session.run('match (n) with distinct labels(n) as labels unwind labels as label return label')
                .then(function (response) {
                    resolve(response.records.map(function (elem) { return elem._fields[0]; }));
                    session.close();
                })
                .catch(reject);
            
        });
    };

    /**
     * This function collect all the relationship types of the graph.
     *
     * @return {array} An array of relationships type
     */
    sigma.neo4j.getTypes = function() {
        //sigma.neo4j.send(neo4j, '/db/data/relationship/types', 'GET', null, callback);
        return new Promise(function (resolve, reject) {
            var session = driver.session();
            session.run('match (n)-[r]-() return distinct type(r)')
                .then(function (response) {
                    resolve(response.records.map(function (elem) { return elem._fields[0]; }));
                    session.close();
                })
                .catch(reject);
        });
    };

}).call(this);

    
