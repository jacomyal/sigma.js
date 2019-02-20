export default function getBoundaries(graph, prefix, doEdges) {
  const edges = graph.edges();
  const nodes = graph.nodes();
  let weightMax = -Infinity;
  let sizeMax = -Infinity;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  if (doEdges) {
    edges.forEach(edge => {
      weightMax = Math.max(edge[`${prefix}size`], weightMax);
    });
  }

  nodes.forEach(node => {
    sizeMax = Math.max(node[`${prefix}size`], sizeMax);
    maxX = Math.max(node[`${prefix}x`], maxX);
    minX = Math.min(node[`${prefix}x`], minX);
    maxY = Math.max(node[`${prefix}y`], maxY);
    minY = Math.min(node[`${prefix}y`], minY);
  });

  weightMax = weightMax || 1;
  sizeMax = sizeMax || 1;

  return {
    weightMax,
    sizeMax,
    minX,
    minY,
    maxX,
    maxY
  };
}
