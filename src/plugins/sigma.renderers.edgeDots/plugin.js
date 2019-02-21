import canvasEdgesDotCurve from "./sigma.canvas.edges.dotCurve";
import canvasEdgesDotCurveArrow from "./sigma.canvas.edges.dotCurvedArrow";

export default function extend(sigma) {
  canvasEdgesDotCurve(sigma);
  canvasEdgesDotCurveArrow(sigma);
}
