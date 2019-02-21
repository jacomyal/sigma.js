import settings from "./settings";
import canvasEdgesLabelsCurve from "./sigma.canvas.edges.labels.curve";
import canvasEdgesLabelsCurvedArrow from "./sigma.canvas.edges.labels.curvedArrow";
import canvasEdgesLabelsDef from "./sigma.canvas.edges.labels.def";

export default function extend(sigma) {
  settings(sigma);
  canvasEdgesLabelsCurve(sigma);
  canvasEdgesLabelsCurvedArrow(sigma);
  canvasEdgesLabelsDef(sigma);
}
