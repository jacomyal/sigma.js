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
                    undirected: true,
                    // Function to compute the distance between two connected node
                    pathLengthFunction: defaultPathLengthFunction
                },
                settings || {});

            var pathLengthFunction = currentSettings("pathLengthFunction");

            // nodeIndexMap maps the nodes to its index in the nodesArray
            var nodeIndexMap = {};

            var adjList = new Array(this.nodesArray.length);
            // creates an adjacent list in adjList
            var createAdjList = function() {
                self.nodesArray.forEach(function(node, idx) {
                    nodeIndexMap[node.id] = idx;
                });
                var i;
                for(i=0; i<self.nodesArray.length; i++) {
                    adjList[i] = new Array();
                }
                self.edgesArray.forEach(function(edge) {
                    var src = nodeIndexMap[edge.source];
                    var dest = nodeIndexMap[edge.target];
                    adjList[src].push(dest);
                    if(currentSettings("undirected")) {
                        adjList[dest].push(src);
                    }
                });
            };
            createAdjList();

            var floydWarshall = function() {
                var INF =1000000000;
                var nodeSize = self.nodesArray.length;
                var i,j,k;
                // dist stores the final shortest paths
                var dist = new Array(nodeSize);
                for(i=0;i<nodeSize;i++)
                    dist[i]=new Array(nodeSize);

                // Initialize the shortest lengths to infinity (INF).
                for(i=0;i<nodeSize;i++) {
                    for(j=0;j<nodeSize;j++) {
                        dist[i][j]=(i==j?0:INF);
                    }
                }

                // Fill the appropriate path lengths in dist matrix
                for(i=0;i<nodeSize;i++) {
                    for(j=0;j<adjList[i].length;j++) {
                        var node1 = self.nodesArray[i];
                        var node2 = self.nodesArray[adjList[i][j]];
                        dist[i][adjList[i][j]]=defaultPathLengthFunction(node1,node2,0);
                    }
                }

                // Floyd Warshall Algorithm
                for(k=0;k<nodeSize;k++) {
                    for(i=0;i<nodeSize;i++) {
                        for(j=0;j<nodeSize;j++) {
                            dist[i][j]=Math.min(dist[i][j], dist[i][k]+dist[k][j]);
                        }
                    }
                }
                return dist;
            };
            return floydWarshall();
        }
    );
}).call(window);