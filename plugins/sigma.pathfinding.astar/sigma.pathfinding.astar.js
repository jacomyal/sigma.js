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
    'astar',
    function(srcId, destId, settings) {
      var currentSettings = new sigma.classes.configurable(
        // Default settings
        {
          // Graph is directed, affects which edges are taken into account
          undirected: false,
          // Function to compute the distance between two connected node
          pathLengthFunction: defaultPathLengthFunction,
          // Function to compute an distance between two nodes
          // if undefined, uses pathLengthFunction
          heuristicLengthFunction: undefined
        },
        settings || {});

      var pathLengthFunction = currentSettings("pathLengthFunction"),
          heuristicLengthFunction = currentSettings("heuristicLengthFunction") || pathLengthFunction;

      var srcNode = this.nodes(srcId),
          destNode = this.nodes(destId);

      var closedList = {},
          openList = [];

      var addToLists = function(node, previousNode, pathLength, heuristicLength) {
        var nodeId = node.id;
        var newItem = {
          pathLength: pathLength,
          heuristicLength: heuristicLength,
          node: node,
          nodeId: nodeId,
          previousNode: previousNode
        };

        if(closedList[nodeId] == undefined || closedList[nodeId].pathLenth > pathLength) {
          closedList[nodeId] = newItem;

          var item;
          var i;
          for(i = 0; i < openList.length; i++) {
            item = openList[i];
            if(item.heuristicLength > heuristicLength) {
              break;
            }
          }

          openList.splice(i, 0, newItem);
        }
      };

      addToLists(srcNode, null, 0, 0);

      var pathFound = false;

      // Depending of the type of graph (directed or not),
      // the neighbors are either the out neighbors or all.
      var allNeighbors;
      if(currentSettings("undirected")) {
        allNeighbors = this.allNeighborsIndex;
      }
      else {
        allNeighbors = this.outNeighborsIndex;
      }


      var inspectedItem,
          neighbors,
          neighbor,
          pathLength,
          heuristicLength,
          i;
      while(openList.length > 0) {
        inspectedItem = openList.shift();

        // We reached the destination node
        if(inspectedItem.nodeId == destId) {
          pathFound = true;
          break;
        }

        neighbors = Object.keys(allNeighbors[inspectedItem.nodeId]);
        for(i = 0; i < neighbors.length; i++) {
          neighbor = this.nodes(neighbors[i]);
          pathLength = pathLengthFunction(inspectedItem.node, neighbor, inspectedItem.pathLength);
          heuristicLength = heuristicLengthFunction(neighbor, destNode);
          addToLists(neighbor, inspectedItem.node, pathLength, heuristicLength);
        }
      }

      if(pathFound) {
        // Rebuilding path
        var path = [],
            currentNode = destNode;

        while(currentNode) {
          path.unshift(currentNode);
          currentNode = closedList[currentNode.id].previousNode;
        }

        return path;
      }
      else {
        return undefined;
      }
    }
  );
}).call(window);
