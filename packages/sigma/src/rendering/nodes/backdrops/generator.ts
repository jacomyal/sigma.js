/**
 * Sigma.js Backdrop Shader Generator
 * ===================================
 *
 * Generates GLSL shaders for backdrop rendering. The backdrop is the union of
 * an enlarged node shape and a label rectangle, with a soft shadow effect.
 *
 * @module
 */
import {
  GLSL_NODE_SIZE_TO_PIXELS,
  GLSL_READ_NODE_DATA,
  GLSL_READ_NODE_FRAME,
  GLSL_SDF_BOX,
  GLSL_SDF_ROTATED_BOX,
  GLSL_SDF_ROUNDED_BOX,
  GLSL_SDF_ROUNDED_ROTATED_BOX,
} from "../../glsl";
import { dedupeShapeUniforms, getShapeGLSLForShapes } from "../../shapes";
import { numberToGLSLFloat } from "../../utils";
import { SDFShape } from "../types";

export interface GeneratedBackdropShaders {
  vertexShader: string;
  fragmentShader: string;
  uniforms: string[];
}

export interface BackdropShaderOptions {
  shapes: SDFShape[];
  rotateWithCamera?: boolean;
  /** Maps local shape index to global shape ID (for multi-shape programs). */
  shapeGlobalIds?: number[];
}

export function generateBackdropVertexShader(options: BackdropShaderOptions): string {
  const { shapes, shapeGlobalIds } = options;

  // Per-shape inradius/circumradius ratio, selected by shape id. Used to grow
  // the quad bounds to the shape's circumradius so corners/tips (and their
  // shadow) aren't clipped — see boundRadius below.
  const inradiusFactorSelector =
    shapes.length === 1
      ? `float inradiusFactor = ${numberToGLSLFloat(shapes[0].inradiusFactor ?? 1.0)};`
      : `float inradiusFactor = ${numberToGLSLFloat(shapes[0].inradiusFactor ?? 1.0)};
  switch (int(shapeId)) {
${shapes
  .map((shape, index) => {
    const caseId = shapeGlobalIds ? shapeGlobalIds[index] : index;
    return `    case ${caseId}: inradiusFactor = ${numberToGLSLFloat(shape.inradiusFactor ?? 1.0)}; break;`;
  })
  .join("\n")}
    default: break;
  }`;

  // The vertex shader no longer searches the SDF: it reads the normalized edge
  // distance from the shared frame texture. Shape SDFs now live only in the
  // fragment shader (for the outline). a_labelWidth/Height/positionMode/angle
  // stay per-instance because backdrops augment the label box with their
  // attachment and also render nodes whose label isn't in the displayed set.
  // language=GLSL
  const glsl = /*glsl*/ `#version 300 es

in float a_nodeIndex;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in vec4 a_backdropColor;
in vec4 a_backdropShadowColor;
in float a_backdropShadowBlur;
in float a_backdropPadding;
in vec4 a_backdropBorderColor;
in vec4 a_backdropExtra; // [borderWidth, cornerRadius, labelPadding, area]
in vec2 a_labelBoxOffset;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

out vec2 v_uv;
out vec2 v_nodeCenter;
out float v_nodeRadius;
out vec2 v_labelCenter;
out vec2 v_labelHalfSize;
out float v_aaWidth;
out float v_shapeId;
out float v_labelAngle;
out vec4 v_backdropColor;
out vec4 v_backdropShadowColor;
out float v_backdropShadowBlur;
out float v_backdropPadding;
out vec4 v_backdropBorderColor;
out float v_backdropBorderWidth;
out float v_backdropCornerRadius;
out float v_backdropArea;

${GLSL_READ_NODE_DATA}
${GLSL_READ_NODE_FRAME}

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId). shapeId (global) is forwarded to the
  // fragment shader, which keeps the shape SDF for the outline.
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;
  float shapeId = nodeData.w;

  ${GLSL_NODE_SIZE_TO_PIXELS}
  // CSS pixel attributes are multiplied by u_pixelRatio to match nodeRadiusPixels,
  // which is already in physical pixels (nodeRadiusNDC * u_resolution.x / 2.0).
  float padding = a_backdropPadding * u_pixelRatio;
  float shadowBlur = a_backdropShadowBlur * u_pixelRatio;
  // Unpack a_backdropExtra: [borderWidth, cornerRadius, labelPadding, area]
  float borderWidth = a_backdropExtra.x * u_pixelRatio;
  float cornerRadius = a_backdropExtra.y * u_pixelRatio;
  float labelPad = a_backdropExtra.z * u_pixelRatio;
  float backdropArea = a_backdropExtra.w;
  // Use 2x shadowBlur so the Gaussian fully decays before the quad edge
  float totalExpansion = shadowBlur * 2.0 + borderWidth;
  float enlargedRadius = nodeRadiusPixels + padding;

  // Circumscribed radius for the quad bounds. Non-circular shapes reach past
  // their inradius out to their circumradius (= enlargedRadius / inradiusFactor),
  // in any direction once rotated. The axis-aligned quad must contain that, or
  // the fill/shadow gets clipped (square corners, triangle tip, etc.).
  ${inradiusFactorSelector}
  float boundRadius = enlargedRadius / inradiusFactor;

  // Apply zoom-dependent label size scaling
  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Only apply labelPad when a label is actually present
  float effectiveLabelPad = labelW > 0.0 ? labelPad : 0.0;
  vec2 labelHalfSize = vec2(labelW * 0.5 + effectiveLabelPad, labelH * 0.5 + effectiveLabelPad);
  vec2 labelOffset = vec2(0.0);

  float la_c = cos(a_labelAngle);
  float la_s = sin(a_labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 snapDelta = vec2(0.0);

  if (labelW > 0.0) {
    // labelW > 0.0 means this node's label is displayed, so the frame-pass wrote
    // its edge distance this frame.
    float edgeDistPixels = nodeRadiusPixels * readNodeFrame(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx);
    // labelMargin matches the label shader's margin (gap from node edge to text)
    float labelStart = edgeDistPixels + labelMargin;
    // Above/below center on the actual glyph height, not the font line box, so
    // the box stays aligned with the rendered text (matches labelBoxCenter()).
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;

    // Snap node center to pixel grid so label/backdrop/attachment move as a unit
    vec2 nodeScreen = vec2(
      (nodeClip.x + 1.0) * u_resolution.x,
      (1.0 - nodeClip.y) * u_resolution.y
    ) * 0.5;
    snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

    if (a_positionMode < 0.5) {
      // Right: box spans from node center to text end + padding
      float boxRightEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(boxRightEdge * 0.5, 0.0);
      labelHalfSize.x = boxRightEdge * 0.5;
    } else if (a_positionMode < 1.5) {
      // Left: mirror of right
      float boxLeftEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(-boxLeftEdge * 0.5, 0.0);
      labelHalfSize.x = boxLeftEdge * 0.5;
    } else if (a_positionMode < 2.5) {
      // Above: text bottom at labelStart, centered horizontally
      labelOffset = vec2(0.0, -(labelStart + textHalf));
    } else if (a_positionMode < 3.5) {
      // Below: text top at labelStart, centered horizontally
      labelOffset = vec2(0.0, labelStart + textHalf);
    }
    // over (>=4): labelOffset stays (0,0) — text centered on the node.

    // The attachment-cover shift is in label space (like the attachment itself),
    // so rotate it together with the position offset — otherwise the box drifts
    // off the attachment as the label angle grows.
    labelOffset = labelRotMat * (labelOffset + a_labelBoxOffset * zoomScale * u_pixelRatio);
  }

  // For node-only mode, zero out label dimensions
  if (backdropArea > 0.5 && backdropArea < 1.5) {
    labelHalfSize = vec2(0.0);
    labelOffset = vec2(0.0);
  }

  vec2 minBound, maxBound;

  bool hasLabelBounds = labelW > 0.0 && (backdropArea > 1.5 || backdropArea < 0.5);

  if (hasLabelBounds) {
    // Union with label bounds (area=both) or label-only bounds (area=label)
    vec2 labelMin, labelMax;

    if (a_labelAngle != 0.0) {
      vec2 corner1 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, -labelHalfSize.y);
      vec2 corner2 = labelOffset + labelRotMat * vec2(labelHalfSize.x, -labelHalfSize.y);
      vec2 corner3 = labelOffset + labelRotMat * vec2(labelHalfSize.x, labelHalfSize.y);
      vec2 corner4 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, labelHalfSize.y);
      labelMin = min(min(corner1, corner2), min(corner3, corner4));
      labelMax = max(max(corner1, corner2), max(corner3, corner4));
    } else {
      labelMin = labelOffset - labelHalfSize;
      labelMax = labelOffset + labelHalfSize;
    }

    if (backdropArea > 1.5) {
      // Label-only: bounds from label rect only
      minBound = labelMin - totalExpansion;
      maxBound = labelMax + totalExpansion;
    } else {
      // Both: union of node + label
      minBound = min(-vec2(boundRadius), labelMin) - totalExpansion;
      maxBound = max(vec2(boundRadius), labelMax) + totalExpansion;
    }
  } else {
    // Node-only or no visible label
    float totalRadius = boundRadius + totalExpansion;
    minBound = -vec2(totalRadius);
    maxBound = vec2(totalRadius);
  }

  vec2 quadSize = maxBound - minBound;
  vec2 quadCenter = (minBound + maxBound) * 0.5;

  vec2 localPos = quadCenter + a_quadCorner * quadSize * 0.5 + snapDelta;
  vec2 ndcOffset = localPos * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);

  v_uv = localPos;
  v_nodeCenter = vec2(0.0);
  v_nodeRadius = nodeRadiusPixels;
  v_labelCenter = labelOffset;
  v_labelHalfSize = labelHalfSize;
  v_aaWidth = 1.0;
  v_shapeId = shapeId;
  v_labelAngle = a_labelAngle;
  v_backdropColor = a_backdropColor;
  v_backdropShadowColor = a_backdropShadowColor;
  v_backdropShadowBlur = a_backdropShadowBlur;
  v_backdropPadding = a_backdropPadding;
  v_backdropBorderColor = a_backdropBorderColor;
  v_backdropBorderWidth = borderWidth;
  v_backdropCornerRadius = cornerRadius;
  v_backdropArea = backdropArea;
}
`;

  return glsl;
}

export function generateBackdropFragmentShader(options: BackdropShaderOptions): string {
  const { shapes, rotateWithCamera = false, shapeGlobalIds } = options;

  // Get all shape SDF functions (deduplicated)
  const shapeGLSL = getShapeGLSLForShapes(shapes);

  const shapeUniformDeclarations = dedupeShapeUniforms(shapes)
    .map((u) => `uniform ${u.type} ${u.name};`)
    .join("\n");

  // Generate shape selector for fragment shader
  let shapeCallCode: string;

  if (shapes.length === 1) {
    const shape = shapes[0];
    const floatUniforms = shape.uniforms.filter((u) => u.type === "float") as Array<{
      name: string;
      type: "float";
      value: number;
    }>;
    const paramValues = floatUniforms.map((u) => numberToGLSLFloat(u.value ?? 0));
    const shapeCall =
      paramValues.length > 0
        ? `sdf_${shape.name}(nodeUV, 1.0, ${paramValues.join(", ")})`
        : `sdf_${shape.name}(nodeUV, 1.0)`;
    shapeCallCode = `float nodeSdfNormalized = ${shapeCall};`;
  } else {
    // Multi-shape: generate switch-based SDF query
    // Use global shape IDs as case values when available (v_shapeId contains global IDs)
    const cases = shapes
      .map((shape, index) => {
        const floatUniforms = shape.uniforms.filter((u) => u.type === "float") as Array<{
          name: string;
          type: "float";
          value: number;
        }>;
        const paramValues = floatUniforms.map((u) => numberToGLSLFloat(u.value ?? 0));
        const sdfCall =
          paramValues.length > 0
            ? `sdf_${shape.name}(nodeUV, 1.0, ${paramValues.join(", ")})`
            : `sdf_${shape.name}(nodeUV, 1.0)`;
        const caseId = shapeGlobalIds ? shapeGlobalIds[index] : index;
        return `    case ${caseId}: nodeSdfNormalized = ${sdfCall}; break;`;
      })
      .join("\n");

    // Default to first shape
    const defaultShape = shapes[0];
    const defaultFloatUniforms = defaultShape.uniforms.filter((u) => u.type === "float") as Array<{
      name: string;
      type: "float";
      value: number;
    }>;
    const defaultParams = defaultFloatUniforms.map((u) => numberToGLSLFloat(u.value ?? 0));
    const defaultCall =
      defaultParams.length > 0
        ? `sdf_${defaultShape.name}(nodeUV, 1.0, ${defaultParams.join(", ")})`
        : `sdf_${defaultShape.name}(nodeUV, 1.0)`;

    shapeCallCode = `float nodeSdfNormalized;
  int shapeId = int(v_shapeId);
  switch (shapeId) {
${cases}
    default: nodeSdfNormalized = ${defaultCall};
  }`;
  }

  // Evaluate node SDF at effective scale (enlarged - cornerRadius) then subtract
  // cornerRadius. This "shrink, evaluate, expand" technique rounds convex corners.
  // When cornerRadius=0, effectiveRadius=enlargedRadius and the subtraction is a no-op.
  const nodeUVCode = rotateWithCamera
    ? `float effectiveRadius = max(enlargedRadius - cornerRadius, 0.01);
  float ca_c = cos(u_cameraAngle);
  float ca_s = sin(u_cameraAngle);
  vec2 rotatedScreenUV = mat2(ca_c, -ca_s, ca_s, ca_c) * screenUV;
  vec2 nodeUV = vec2(rotatedScreenUV.x, -rotatedScreenUV.y) / effectiveRadius;`
    : `float effectiveRadius = max(enlargedRadius - cornerRadius, 0.01);
  vec2 nodeUV = vec2(screenUV.x, -screenUV.y) / effectiveRadius;`;

  // language=GLSL
  const glsl = /*glsl*/ `#version 300 es
precision highp float;

in vec2 v_uv;
in vec2 v_nodeCenter;
in float v_nodeRadius;
in vec2 v_labelCenter;
in vec2 v_labelHalfSize;
in float v_aaWidth;
in float v_shapeId;
in float v_labelAngle;
in vec4 v_backdropColor;
in vec4 v_backdropShadowColor;
in float v_backdropShadowBlur;
in float v_backdropPadding;
in vec4 v_backdropBorderColor;
in float v_backdropBorderWidth;
in float v_backdropCornerRadius;
in float v_backdropArea;

uniform float u_cameraAngle;
${shapeUniformDeclarations}

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragPicking;

${shapeGLSL}
${GLSL_SDF_BOX}
${GLSL_SDF_ROTATED_BOX}
${GLSL_SDF_ROUNDED_BOX}
${GLSL_SDF_ROUNDED_ROTATED_BOX}

void main() {
  vec4 backdropColor = v_backdropColor;
  vec4 shadowColor = v_backdropShadowColor;
  float shadowBlur = v_backdropShadowBlur;
  float padding = v_backdropPadding;
  vec4 borderColor = v_backdropBorderColor;
  float borderWidth = v_backdropBorderWidth;
  float cornerRadius = v_backdropCornerRadius;

  float enlargedRadius = v_nodeRadius + padding;
  vec2 screenUV = v_uv - v_nodeCenter;
  ${nodeUVCode}

  // Query the correct shape SDF based on shapeId
  ${shapeCallCode}
  float nodeSdfPixels = nodeSdfNormalized * effectiveRadius - cornerRadius;

  // Label SDF with optional corner radius and rotation
  float labelSdfPixels;
  if (v_labelHalfSize.x > 0.0) {
    vec2 labelP = v_uv - v_labelCenter;
    labelSdfPixels = sdfRoundedRotatedBox(labelP, v_labelHalfSize, v_labelAngle, cornerRadius);
  } else {
    labelSdfPixels = 10000.0;
  }

  // Select area: 0=both, 1=node, 2=label
  float combinedSdf;
  if (v_backdropArea > 1.5) {
    combinedSdf = labelSdfPixels;
  } else if (v_backdropArea > 0.5) {
    combinedSdf = nodeSdfPixels;
  } else {
    combinedSdf = min(nodeSdfPixels, labelSdfPixels);
  }

  // Fill + border composite
  float outerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf);
  vec4 background;
  if (borderWidth > 0.5) {
    float innerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf + borderWidth);
    float fillAlpha = innerEdge * backdropColor.a;
    vec4 fill = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
    float borderAlpha = (outerEdge - innerEdge) * borderColor.a;
    vec4 border = vec4(borderColor.rgb * borderAlpha, borderAlpha);
    background = fill + border * (1.0 - fill.a);
  } else {
    float fillAlpha = outerEdge * backdropColor.a;
    background = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
  }

  // Gaussian-like shadow falloff (mimics canvas shadowBlur)
  vec4 shadow = vec4(0.0);
  float sigma = shadowBlur / 2.5;
  if (sigma > 0.001) {
    float shadowDist = max(0.0, combinedSdf);
    float shadowAlpha = exp(-(shadowDist * shadowDist) / (2.0 * sigma * sigma)) * shadowColor.a;
    shadow = vec4(shadowColor.rgb * shadowAlpha, shadowAlpha);
  }

  fragColor = background + shadow * (1.0 - background.a);
  fragPicking = vec4(0.0);
}
`;

  return glsl;
}

export function collectBackdropUniforms(shapes: SDFShape[]): string[] {
  const uniforms = [
    "u_matrix",
    "u_sizeRatio",
    "u_correctionRatio",
    "u_cameraAngle",
    "u_resolution",
    "u_pixelRatio",
    "u_labelMargin",
    "u_zoomLabelSizeRatio",
    "u_labelPixelSnapping",
    "u_nodeDataTexture",
    "u_nodeDataTextureWidth",
    "u_nodeFrameTexture",
    "u_nodeFrameTextureWidth",
  ];

  for (const uniform of dedupeShapeUniforms(shapes)) {
    if (!uniforms.includes(uniform.name)) uniforms.push(uniform.name);
  }

  return uniforms;
}

export function generateBackdropShaders(options: BackdropShaderOptions): GeneratedBackdropShaders {
  return {
    vertexShader: generateBackdropVertexShader(options),
    fragmentShader: generateBackdropFragmentShader(options),
    uniforms: collectBackdropUniforms(options.shapes),
  };
}
