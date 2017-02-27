(function() {
    'use strict';

    if (typeof sigma === 'undefined') {
        throw 'sigma is not declared';
    }

    // Default function to compute path length between two nodes:
    // the euclidian
    var defaultPathLengthFunction = function(node1, node2, previousPathLength) {
        var isEverythingDefined =
            node1 != undefined &&
            node2 != undefined &&
            node1.x != undefined &&
            node1.y != undefined &&
            node2.x != undefined &&
            node2.y != undefined;
        if(!isEverythingDefined) {
            return undefined;
        }

        return (previousPathLength || 0) + Math.sqrt(
                Math.pow((node2.y - node1.y), 2) + Math.pow((node2.x - node1.x), 2)
            );
    };

    sigma.classes.graph.addMethod(
        'floydwarshall',
        function(settings) {
            var self=this;

            var currentSettings = new sigma.classes.configurable(
                // Default settings
                {
                    // Graph is directed, affects which edges are taken into account
                    undirected: false,
                    // Function to compute the distance between two connected node
                    pathLengthFunction: defaultPathLengthFunction
                },
                settings || {});

            var pathLengthFunction = currentSettings("pathLengthFunction");

            var nodeIndexMap = {};
            var adjList = new Array(this.nodesArray.length);
            var createAdjList = function() {
                self.nodesArray.forEach(function(node, idx) {
                    nodeIndexMap[node.id] = idx;
                });
                console.log(adjList.length);
                var i;
                for(i=0; i<self.nodesArray.length; i++) {
                    adjList[i] = new Array();
                }
                self.edgesArray.forEach(function(edge) {
                    var src = nodeIndexMap[edge.source];
                    var dest = nodeIndexMap[edge.target];
                    adjList[src].push(dest);
                    if(currentSettings.undirected)
                        adjList[dest].push(src);
                });
            };
            createAdjList();
        }
    );
}).call(window);
