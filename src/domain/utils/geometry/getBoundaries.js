export default function getBoundaries(graph, prefix, doEdges) {
  let i;
  let l;
  const e = graph.edges();
  const n = graph.nodes();
  let weightMax = -Infinity;
  let sizeMax = -Infinity;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  if (doEdges)
    for (i = 0, l = e.length; i < l; i++)
      weightMax = Math.max(e[i][`${prefix}size`], weightMax);

  for (i = 0, l = n.length; i < l; i++) {
    sizeMax = Math.max(n[i][`${prefix}size`], sizeMax);
    maxX = Math.max(n[i][`${prefix}x`], maxX);
    minX = Math.min(n[i][`${prefix}x`], minX);
    maxY = Math.max(n[i][`${prefix}y`], maxY);
    minY = Math.min(n[i][`${prefix}y`], minY);
  }

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
