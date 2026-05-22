// A self-loop edge's label sits on the node instead of following the loop.
//
// Any self-loop with a visible label is affected, whatever direction the loop
// points and whether or not the label has a background: the label bunches up
// on the node instead of sitting along the loop's curve.
import Graph from "graphology";
import Sigma from "sigma";
import { layerFill, layerPlain, pathLine, pathLoop } from "sigma/rendering";
import { DEFAULT_STYLES } from "sigma/types";

const PI = Math.PI;

interface LoopSpec {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  loopAngle: number;
  /** Background ribbon is rendered only when set. */
  labelBackgroundColor?: string;
}

// Loops fan out in five directions; the background ribbon alternates on/off.
const LOOPS: LoopSpec[] = [
  { id: "n0", x: -8, y: 0, color: "#E8684A", label: "loop east", loopAngle: 0, labelBackgroundColor: "#ffe0d8" },
  { id: "n1", x: -4, y: 0, color: "#5B8FF9", label: "loop north", loopAngle: PI / 2 },
  { id: "n2", x: 0, y: 0, color: "#9270CA", label: "loop west", loopAngle: PI, labelBackgroundColor: "#e7ddf6" },
  { id: "n3", x: 4, y: 0, color: "#61DDAA", label: "loop south", loopAngle: (3 * PI) / 2 },
  {
    id: "n4",
    x: 8,
    y: 0,
    color: "#F6BD16",
    label: "loop diagonal",
    loopAngle: PI / 4,
    labelBackgroundColor: "#fff1cf",
  },
];

export default (container: HTMLElement) => {
  const graph = new Graph({ multi: true });

  for (const loop of LOOPS) {
    graph.addNode(loop.id, { x: loop.x, y: loop.y, size: 0.6, color: loop.color, label: "" });
    graph.addEdge(loop.id, loop.id, {
      size: 0.2,
      color: loop.color,
      label: loop.label,
      loopAngle: loop.loopAngle,
      loopSpread: (70 * PI) / 180,
      labelBackgroundColor: loop.labelBackgroundColor,
    });
  }

  return new Sigma(graph, container, {
    primitives: {
      nodes: { layers: [layerFill()] },
      edges: { paths: [pathLine(), pathLoop()], layers: [layerPlain()], label: { color: "#1c1c1c" } },
    },
    styles: {
      edges: [
        DEFAULT_STYLES.edges,
        {
          selfLoopPath: "loop",
          labelVisibility: "visible",
          labelBackgroundColor: { attribute: "labelBackgroundColor" },
          labelBackgroundPadding: 6,
        },
      ],
    },
    settings: { renderEdgeLabels: true, itemSizesReference: "positions", autoRescale: true },
  });
};
