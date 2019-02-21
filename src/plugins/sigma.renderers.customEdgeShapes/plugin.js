import canvasEdgeHoversDashed from "./sigma.canvas.edgehovers.dashed";
import canvasEdgeHoversDotted from "./sigma.canvas.edgehovers.dotted";
import canvasEdgeHoversParallel from "./sigma.canvas.edgehovers.parallel";
import canvasEdgeHoversTapered from "./sigma.canvas.edgehovers.tapered";
import canvasEdgesDashed from "./sigma.canvas.edges.dashed";
import canvasEdgesDotted from "./sigma.canvas.edges.dotted";
import canvasEdgesParallel from "./sigma.canvas.edges.parallel";
import canvasEdgesTapered from "./sigma.canvas.edges.tapered";

export default function extend(sigma) {
  canvasEdgeHoversDashed(sigma);
  canvasEdgeHoversDotted(sigma);
  canvasEdgeHoversParallel(sigma);
  canvasEdgeHoversTapered(sigma);
  canvasEdgesDashed(sigma);
  canvasEdgesDotted(sigma);
  canvasEdgesParallel(sigma);
  canvasEdgesTapered(sigma);
}
