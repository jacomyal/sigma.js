export default function extend(sigma) {
  if (typeof sigma === "undefined") {
    throw new Error("sigma is not declared");
  }

  // Default function to compute path length between two nodes:
  // the euclidian
  const defaultPathLengthFunction = function(node1, node2, previousPathLength) {
    const isEverythingDefined =
      node1 != undefined &&
      node2 != undefined &&
      node1.x != undefined &&
      node1.y != undefined &&
      node2.x != undefined &&
      node2.y != undefined;
    if (!isEverythingDefined) {
      return undefined;
    }

    return (
      (previousPathLength || 0) +
      Math.sqrt(Math.pow(node2.y - node1.y, 2) + Math.pow(node2.x - node1.x, 2))
    );
  };

  sigma.classes.graph.addMethod("astar", function(srcId, destId, settings) {
    const currentSettings = new sigma.classes.configurable(
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
      settings || {}
    );

    const pathLengthFunction = currentSettings("pathLengthFunction");

    const heuristicLengthFunction =
      currentSettings("heuristicLengthFunction") || pathLengthFunction;

    const srcNode = this.nodes(srcId);

    const destNode = this.nodes(destId);

    const closedList = {};

    const openList = [];

    const addToLists = function(
      node,
      previousNode,
      pathLength,
      heuristicLength
    ) {
      const nodeId = node.id;
      const newItem = {
        pathLength,
        heuristicLength,
        node,
        nodeId,
        previousNode
      };

      if (
        closedList[nodeId] == undefined ||
        closedList[nodeId].pathLength > pathLength
      ) {
        closedList[nodeId] = newItem;

        let item;
        let i;
        for (i = 0; i < openList.length; i++) {
          item = openList[i];
          if (item.heuristicLength > heuristicLength) {
            break;
          }
        }

        openList.splice(i, 0, newItem);
      }
    };

    addToLists(srcNode, null, 0, 0);

    let pathFound = false;

    // Depending of the type of graph (directed or not),
    // the neighbors are either the out neighbors or all.
    let allNeighbors;
    if (currentSettings("undirected")) {
      allNeighbors = this.allNeighborsIndex;
    } else {
      allNeighbors = this.outNeighborsIndex;
    }

    let inspectedItem;
    let neighbors;
    let neighbor;
    let pathLength;
    let heuristicLength;
    let i;
    while (openList.length > 0) {
      inspectedItem = openList.shift();

      // We reached the destination node
      if (inspectedItem.nodeId == destId) {
        pathFound = true;
        break;
      }

      neighbors = Object.keys(allNeighbors[inspectedItem.nodeId]);
      for (i = 0; i < neighbors.length; i++) {
        neighbor = this.nodes(neighbors[i]);
        pathLength = pathLengthFunction(
          inspectedItem.node,
          neighbor,
          inspectedItem.pathLength
        );
        heuristicLength = heuristicLengthFunction(neighbor, destNode);
        addToLists(neighbor, inspectedItem.node, pathLength, heuristicLength);
      }
    }

    if (pathFound) {
      // Rebuilding path
      const path = [];

      let currentNode = destNode;

      while (currentNode) {
        path.unshift(currentNode);
        currentNode = closedList[currentNode.id].previousNode;
      }

      return path;
    }
    return undefined;
  });
}
