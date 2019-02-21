import canvasEdgeHoversCurve from "./sigma.canvas.edgehovers.curve";
import canvasEdgeHoversCurvedArrow from "./sigma.canvas.edgehovers.curvedArrow";
import canvasEdgesCurve from "./sigma.canvas.edges.curve";
import canvasEdgesCurvedArrow from "./sigma.canvas.edges.curvedArrow";
import edgesLabelsCurve from "./sigma.canvas.edges.labels.curve";

export default function extend(sigma) {
  canvasEdgeHoversCurve(sigma);
  canvasEdgeHoversCurvedArrow(sigma);
  canvasEdgesCurve(sigma);
  canvasEdgesCurvedArrow(sigma);
  edgesLabelsCurve(sigma);
}
