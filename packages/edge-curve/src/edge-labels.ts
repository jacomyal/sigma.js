import { Attributes } from "graphology-types";
import { EdgeLabelDrawingFunction } from "sigma/rendering";
import { Settings } from "sigma/settings";

import { CreateEdgeCurveProgramOptions } from "./utils";

interface Point {
  x: number;
  y: number;
}

function getCurvePoint(t: number, p0: Point, p1: Point, p2: Point): Point {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
  return { x, y };
}

function getCurveLength(p0: Point, p1: Point, p2: Point): number {
  const steps = 20;
  let length = 0;
  let lastPoint = p0;
  for (let i = 0; i < steps; i++) {
    const point = getCurvePoint((i + 1) / steps, p0, p1, p2);
    length += Math.sqrt((lastPoint.x - point.x) ** 2 + (lastPoint.y - point.y) ** 2);
    lastPoint = point;
  }

  return length;
}

export function createDrawCurvedEdgeLabel<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>({
  curvatureAttribute,
  defaultCurvature,
  keepLabelUpright = true,
}: CreateEdgeCurveProgramOptions & { keepLabelUpright?: boolean }): EdgeLabelDrawingFunction<N, E, G> {
  return (context, edgeData, sourceData, targetData, settings: Settings<N, E, G>): void => {
    const size = settings.edgeLabelSize,
      curvature = edgeData[curvatureAttribute] || defaultCurvature,
      font = settings.edgeLabelFont,
      weight = settings.edgeLabelWeight,
      color = settings.edgeLabelColor.attribute
        ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000"
        : settings.edgeLabelColor.color;

    let label = edgeData.label;

    if (!label) return;

    context.fillStyle = color;
    context.font = `${weight} ${size}px ${font}`;

    // Computing positions without considering nodes sizes:
    const ltr = !keepLabelUpright || sourceData.x < targetData.x;
    let sourceX = ltr ? sourceData.x : targetData.x;
    let sourceY = ltr ? sourceData.y : targetData.y;
    let targetX = ltr ? targetData.x : sourceData.x;
    let targetY = ltr ? targetData.y : sourceData.y;
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;
    const diffX = targetX - sourceX;
    const diffY = targetY - sourceY;
    const diff = Math.sqrt(diffX ** 2 + diffY ** 2);
    // Anchor point:
    const orientation = ltr ? 1 : -1;
    let anchorX = centerX + diffY * curvature * orientation;
    let anchorY = centerY - diffX * curvature * orientation;

    // Adapt curve points to edge thickness:
    const offset = edgeData.size * 0.7 + 5;
    const sourceOffsetVector = {
      x: anchorY - sourceY,
      y: -(anchorX - sourceX),
    };
    const sourceOffsetVectorLength = Math.sqrt(sourceOffsetVector.x ** 2 + sourceOffsetVector.y ** 2);
    const targetOffsetVector = {
      x: targetY - anchorY,
      y: -(targetX - anchorX),
    };
    const targetOffsetVectorLength = Math.sqrt(targetOffsetVector.x ** 2 + targetOffsetVector.y ** 2);
    sourceX += (offset * sourceOffsetVector.x) / sourceOffsetVectorLength;
    sourceY += (offset * sourceOffsetVector.y) / sourceOffsetVectorLength;
    targetX += (offset * targetOffsetVector.x) / targetOffsetVectorLength;
    targetY += (offset * targetOffsetVector.y) / targetOffsetVectorLength;
    // For anchor, the vector is simpler, so it is inlined:
    anchorX += (offset * diffY) / diff;
    anchorY -= (offset * diffX) / diff;

    // Compute curve length:
    const anchorPoint = { x: anchorX, y: anchorY };
    const sourcePoint = { x: sourceX, y: sourceY };
    const targetPoint = { x: targetX, y: targetY };
    const curveLength = getCurveLength(sourcePoint, anchorPoint, targetPoint);

    if (curveLength < sourceData.size + targetData.size) return;

    // Handling ellipsis
    let textLength = context.measureText(label).width;
    const availableTextLength = curveLength - sourceData.size - targetData.size;
    if (textLength > availableTextLength) {
      const ellipsis = "…";
      label = label + ellipsis;
      textLength = context.measureText(label).width;

      while (textLength > availableTextLength && label.length > 1) {
        label = label.slice(0, -2) + ellipsis;
        textLength = context.measureText(label).width;
      }

      if (label.length < 4) return;
    }

    // Measure each character:
    const charactersLengthCache: Record<string, number> = {};
    for (let i = 0, length = label.length; i < length; i++) {
      const character = label[i];

      if (!charactersLengthCache[character]) {
        charactersLengthCache[character] = context.measureText(character).width * (1 + curvature * 0.35);
      }
    }

    // Draw each character:
    let t = 0.5 - textLength / curveLength / 2;
    for (let i = 0, length = label.length; i < length; i++) {
      const character = label[i];
      const point = getCurvePoint(t, sourcePoint, anchorPoint, targetPoint);

      const tangentX = 2 * (1 - t) * (anchorX - sourceX) + 2 * t * (targetX - anchorX);
      const tangentY = 2 * (1 - t) * (anchorY - sourceY) + 2 * t * (targetY - anchorY);
      const angle = Math.atan2(tangentY, tangentX);

      context.save();
      context.translate(point.x, point.y);
      context.rotate(angle);

      // Dessiner le caractère
      context.fillText(character, 0, 0);

      context.restore();

      t += charactersLengthCache[character] / curveLength;
    }
  };
}
