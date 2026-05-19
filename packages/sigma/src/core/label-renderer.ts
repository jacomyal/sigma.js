/**
 * Sigma.js Label Renderer
 * =======================
 *
 * Handles all label, backdrop, and attachment rendering for sigma.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import { LabelAttachmentContext } from "../primitives";
import {
  BackdropDisplayData,
  EdgeLabelBackgroundData,
  LabelBackgroundData,
  POSITION_MODE_MAP,
  getShapeId,
} from "../rendering";
import { ATTACHMENT_GAP, ATTACHMENT_PLACEMENT_MAP, ATTACHMENT_TEXTURE_UNIT } from "../rendering/nodes/attachments";
import { EdgeLabelDisplayData, EdgeLabelPosition, LabelDisplayData, RenderParams } from "../types";
import {
  colorToArray,
  extend,
  floatColor,
  indexToColor,
  matrixFromCamera,
  multiplyVec2,
  parseFontString,
} from "../utils";
import { KIND_REGISTRY, pickingIdOf } from "./interactive-kinds";
import { LabelGrid, edgeLabelsToDisplayFromNodes } from "./labels";
import { SigmaInternals } from "./sigma-internals";

const X_LABEL_MARGIN = 150;
const Y_LABEL_MARGIN = 50;
const BACKDROP_AREA_MAP: Record<string, number> = { both: 0, node: 1, label: 2 };
const EDGE_POSITION_MODE_MAP: Record<EdgeLabelPosition, number> = { over: 0, above: 1, below: 2, auto: 3 };
const DEFAULT_EDGE_LABEL_SIZE = 12;
const DEFAULT_EDGE_LABEL_PADDING = 3;

/**
 * Owns the label grid and per-frame label sets, and exposes all label, backdrop,
 * and attachment rendering methods extracted from sigma.
 */
export class LabelRenderer<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> {
  labelGrid: LabelGrid = new LabelGrid();
  displayedNodeLabels: Set<string> = new Set();
  displayedEdgeLabels: Set<string> = new Set();
  /** Per-frame edge-label candidate list, shared by background and label passes. */
  private edgeLabelCandidates: string[] = [];
  private renderedNodeLabels: Set<string> = new Set();
  private labelSizeCache = new Map<string, { width: number; height: number }>();
  private measureContext: CanvasRenderingContext2D | null = null;

  constructor(private internals: SigmaInternals<N, E, G>) {}

  /** Reset per-frame state at the start of render(). */
  resetFrame(): void {
    this.displayedNodeLabels = new Set();
    this.renderedNodeLabels = new Set();
    this.labelSizeCache.clear();
  }

  /** Reset edge label set (called from clearEdgeState). */
  clearEdgeLabels(): void {
    this.displayedEdgeLabels = new Set();
  }

  /** Reset the label grid (called from clearNodeIndices). */
  resetLabelGrid(): void {
    this.labelGrid = new LabelGrid();
  }

  /** Release the measurement canvas (called from sigma's kill). */
  kill(): void {
    this.measureContext = null;
  }

  /**
   * Pre-generate glyphs for all node labels.
   * Actual label rendering happens per-frame in renderWebGLLabels.
   */
  processWebGLLabels(nodes: string[]): void {
    const { labelProgram, primitives, nodeDataCache } = this.internals;
    if (!labelProgram?.ensureGlyphsReady) return;

    const defaultLabelFont = primitives?.nodes?.label?.font?.family || "sans-serif";
    const textsByFont = new Map<string, string[]>();

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];
      const data = nodeDataCache[node];

      if (data.visibility === "hidden" || !data.label) continue;

      const fontString = data.labelFont || defaultLabelFont;
      const existing = textsByFont.get(fontString);
      if (existing) {
        existing.push(data.label);
      } else {
        textsByFont.set(fontString, [data.label]);
      }
    }

    for (const [fontString, texts] of textsByFont) {
      const { family, weight, style } = parseFontString(fontString);
      const fontKey = labelProgram.registerFont?.(family, weight, style);
      labelProgram.ensureGlyphsReady(texts, fontKey);
    }
  }

  private measureNodeLabel(data: { label?: string | null; labelSize?: number; labelFont?: string }): {
    width: number;
    height: number;
  } {
    if (!data.label) return { width: 0, height: 0 };

    const { labelProgram, primitives } = this.internals;
    const labelSize = data.labelSize ?? 14;
    const fontString = data.labelFont || primitives?.nodes?.label?.font?.family || "sans-serif";
    const cacheKey = `${data.label}|${labelSize}|${fontString}`;
    if (this.labelSizeCache.has(cacheKey)) return this.labelSizeCache.get(cacheKey)!;

    const { family, weight, style } = parseFontString(fontString);
    let result: { width: number; height: number };
    if (labelProgram?.measureLabel) {
      const fontKey = labelProgram.registerFont?.(family, weight, style) || "";
      result = labelProgram.measureLabel(data.label, labelSize, fontKey);
    } else {
      if (!this.measureContext) {
        this.measureContext = document.createElement("canvas").getContext("2d")!;
      }
      this.measureContext.font = `${style} ${weight} ${labelSize}px ${family}`;
      result = { width: this.measureContext.measureText(data.label).width, height: labelSize };
    }

    this.labelSizeCache.set(cacheKey, result);
    return result;
  }

  /**
   * Determine which node labels will be displayed this frame.
   * Must be called before renderWebGLLabels, renderBackdrops, and cacheAttachments.
   */
  computeDisplayedNodeLabels(): void {
    const cameraState = this.internals.getCameraState();
    const { width, height } = this.internals.getDimensions();

    const topLeft = this.internals.viewportToFramedGraph({ x: -X_LABEL_MARGIN, y: -Y_LABEL_MARGIN });
    const topRight = this.internals.viewportToFramedGraph({ x: width + X_LABEL_MARGIN, y: -Y_LABEL_MARGIN });
    const bottomLeft = this.internals.viewportToFramedGraph({ x: -X_LABEL_MARGIN, y: height + Y_LABEL_MARGIN });
    const bottomRight = this.internals.viewportToFramedGraph({ x: width + X_LABEL_MARGIN, y: height + Y_LABEL_MARGIN });

    const graphMinX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const graphMaxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const graphMinY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    const graphMaxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    // LabelGrid uses null-camera viewport space
    const nullCameraMatrix = matrixFromCamera(
      { x: 0.5, y: 0.5, ratio: 1, angle: 0 },
      { width, height },
      this.internals.getGraphDimensions(),
      this.internals.getStagePadding(),
    );
    const toNullCameraViewport = (framedGraphPos: { x: number; y: number }): { x: number; y: number } => {
      const viewportPos = multiplyVec2(nullCameraMatrix, framedGraphPos);
      return {
        x: ((1 + viewportPos.x) * width) / 2,
        y: ((1 - viewportPos.y) * height) / 2,
      };
    };

    const nc1 = toNullCameraViewport({ x: graphMinX, y: graphMinY });
    const nc2 = toNullCameraViewport({ x: graphMaxX, y: graphMinY });
    const nc3 = toNullCameraViewport({ x: graphMinX, y: graphMaxY });
    const nc4 = toNullCameraViewport({ x: graphMaxX, y: graphMaxY });

    const gridViewport = {
      x1: Math.min(nc1.x, nc2.x, nc3.x, nc4.x),
      y1: Math.min(nc1.y, nc2.y, nc3.y, nc4.y),
      x2: Math.max(nc1.x, nc2.x, nc3.x, nc4.x),
      y2: Math.max(nc1.y, nc2.y, nc3.y, nc4.y),
    };

    const { settings, nodeDataCache, nodesWithForcedLabels } = this.internals;
    const labelsToDisplay = this.labelGrid.getLabelsToDisplay(cameraState.ratio, settings.labelDensity, gridViewport);
    extend(labelsToDisplay, nodesWithForcedLabels);

    for (let i = 0, l = labelsToDisplay.length; i < l; i++) {
      const node = labelsToDisplay[i];
      const data = nodeDataCache[node];

      if (this.displayedNodeLabels.has(node)) continue;
      if (data.visibility === "hidden" || data.labelVisibility === "hidden") continue;
      if (!data.label) continue;

      if (data.x < graphMinX || data.x > graphMaxX || data.y < graphMinY || data.y > graphMaxY) continue;

      const { x, y } = this.internals.framedGraphToViewport(data);
      const size = this.internals.scaleSize(data.size);

      if (data.labelVisibility !== "visible" && size < settings.labelRenderedSizeThreshold) continue;

      if (
        x < -X_LABEL_MARGIN - size ||
        x > width + X_LABEL_MARGIN + size ||
        y < -Y_LABEL_MARGIN - size ||
        y > height + Y_LABEL_MARGIN + size
      )
        continue;

      this.displayedNodeLabels.add(node);
    }
  }

  /** Render node labels for the given depth layer. */
  renderWebGLLabels(params: RenderParams, depth?: string): void {
    const { nodeDataCache, labelProgram, primitives, nodeDataTexture } = this.internals;
    const visibleNodes: string[] = [];
    for (const node of this.displayedNodeLabels) {
      if (this.renderedNodeLabels.has(node)) continue;
      const data = nodeDataCache[node];
      if (depth && data.labelDepth !== depth) continue;
      this.renderedNodeLabels.add(node);
      visibleNodes.push(node);
    }

    if (!labelProgram) return;

    let totalCharacters = 0;
    for (let i = 0, l = visibleNodes.length; i < l; i++) {
      const data = nodeDataCache[visibleNodes[i]];
      totalCharacters += data.label!.length;
    }

    labelProgram.reallocate(totalCharacters);

    // TODO: These defaults should come from the styles system
    const defaultLabelSize = 14;
    const defaultLabelMargin = primitives?.nodes?.label?.margin ?? 5;
    const defaultLabelPosition = "right" as const;
    const defaultLabelFont = primitives?.nodes?.label?.font?.family || "sans-serif";

    const fontKeyMap = new Map<string, string>();

    let characterOffset = 0;
    for (let i = 0, l = visibleNodes.length; i < l; i++) {
      const node = visibleNodes[i];
      const data = nodeDataCache[node];

      const fontString = data.labelFont || defaultLabelFont;
      let fontKey = fontKeyMap.get(fontString);
      if (fontKey === undefined) {
        const { family, weight, style } = parseFontString(fontString);
        fontKey = labelProgram.registerFont?.(family, weight, style) || "";
        fontKeyMap.set(fontString, fontKey);
      }

      const labelData: LabelDisplayData = {
        text: data.label!,
        x: data.x,
        y: data.y,
        size: data.labelSize ?? defaultLabelSize,
        color: data.labelColor,
        nodeSize: data.size,
        margin: defaultLabelMargin,
        position: data.labelPosition ?? defaultLabelPosition,
        hidden: false,
        forceLabel: data.labelVisibility === "visible",
        type: "default",
        zIndex: data.zIndex ?? 0,
        parentType: "node",
        parentKey: node,
        fontKey,
        labelAngle: data.labelAngle ?? 0,
        nodeIndex: nodeDataTexture!.getIndex(node),
      };

      const charsProcessed = labelProgram.processLabel(node, characterOffset, labelData);
      characterOffset += charsProcessed;
    }

    labelProgram.invalidateBuffers();
    labelProgram.render(params);
  }

  /** Render backdrops (background + shadow) behind nodes with labels. */
  renderBackdrops(params: RenderParams, depth?: string): void {
    const {
      backdropProgram,
      nodeDataCache,
      nodesWithBackdrop,
      attachmentManager,
      pixelRatio,
      nodeShapeMap,
      nodeGlobalShapeIds,
    } = this.internals;
    if (!backdropProgram) return;

    const nodes: string[] = [];
    for (const key of nodesWithBackdrop) {
      const data = nodeDataCache[key];
      if (!data || data.visibility === "hidden") continue;
      if (depth && data.depth !== depth) continue;
      nodes.push(key);
    }

    if (nodes.length === 0) return;

    backdropProgram.reallocate(nodes.length);

    for (let i = 0; i < nodes.length; i++) {
      const key = nodes[i];
      const data = nodeDataCache[key];

      const labelVisible = this.displayedNodeLabels.has(key);
      let { width: labelWidth, height: labelHeight } = labelVisible
        ? this.measureNodeLabel(data)
        : { width: 0, height: 0 };

      let labelBoxOffsetX = 0;
      let labelBoxOffsetY = 0;
      if (labelVisible && data.labelAttachment && attachmentManager) {
        const entry = attachmentManager.getEntry(key, data.labelAttachment);
        if (entry) {
          const placement = data.labelAttachmentPlacement || "below";
          if (placement === "below" || placement === "above") {
            const attachH = entry.height / pixelRatio;
            labelHeight += attachH + ATTACHMENT_GAP;
            labelWidth = Math.max(labelWidth, entry.width / pixelRatio);
            labelBoxOffsetY = placement === "below" ? (attachH + ATTACHMENT_GAP) / 2 : -(attachH + ATTACHMENT_GAP) / 2;
          } else {
            const attachW = entry.width / pixelRatio;
            labelWidth += attachW + ATTACHMENT_GAP;
            labelHeight = Math.max(labelHeight, entry.height / pixelRatio);
            labelBoxOffsetX = placement === "right" ? (attachW + ATTACHMENT_GAP) / 2 : -(attachW + ATTACHMENT_GAP) / 2;
          }
        }
      }

      let shapeId: number;
      if (nodeShapeMap && nodeGlobalShapeIds) {
        const localIndex = nodeShapeMap[data.shape || Object.keys(nodeShapeMap)[0]];
        shapeId = nodeGlobalShapeIds[localIndex];
      } else {
        shapeId = getShapeId(data.shape || "circle");
      }

      const rawBgColor = data.backdropColor ? colorToArray(data.backdropColor) : [255, 255, 255, 255];
      const rawShadowColor = data.backdropShadowColor ? colorToArray(data.backdropShadowColor) : [0, 0, 0, 128];
      const backdropColor = rawBgColor.map((c) => c / 255) as [number, number, number, number];
      const backdropShadowColor = rawShadowColor.map((c) => c / 255) as [number, number, number, number];
      const backdropShadowBlur = data.backdropShadowBlur ?? 12;
      const backdropPadding = data.backdropPadding ?? 6;

      const rawBorderColor = data.backdropBorderColor ? colorToArray(data.backdropBorderColor) : [0, 0, 0, 0];
      const backdropBorderColor = rawBorderColor.map((c) => c / 255) as [number, number, number, number];
      const backdropBorderWidth = data.backdropBorderWidth ?? 0;
      const backdropCornerRadius = data.backdropCornerRadius ?? 0;
      const rawLabelPadding = data.backdropLabelPadding ?? -1;
      const backdropLabelPadding = rawLabelPadding < 0 ? backdropPadding : rawLabelPadding;
      const backdropArea = BACKDROP_AREA_MAP[data.backdropArea ?? "both"] ?? 0;

      const backdropData: BackdropDisplayData = {
        key,
        x: data.x,
        y: data.y,
        size: data.size,
        label: data.label,
        labelWidth,
        labelHeight,
        type: "default",
        shapeId,
        position: data.labelPosition || "right",
        labelAngle: data.labelAngle ?? 0,
        backdropColor,
        backdropShadowColor,
        backdropShadowBlur,
        backdropPadding,
        backdropBorderColor,
        backdropBorderWidth,
        backdropCornerRadius,
        backdropLabelPadding,
        backdropArea,
        labelBoxOffset: [labelBoxOffsetX, labelBoxOffsetY],
      };

      backdropProgram.processBackdrop(i, backdropData);
    }

    backdropProgram.invalidateBuffers();
    backdropProgram.render(params);
  }

  /** Render label background rectangles (picking + optional visual) for displayed node labels. */
  renderLabelBackgrounds(params: RenderParams, depth?: string): void {
    const { labelBackgroundProgram, nodeDataCache, nodeShapeMap, nodeGlobalShapeIds } = this.internals;
    if (!labelBackgroundProgram) return;

    const eventsEnabled = KIND_REGISTRY.nodeLabel.writesPickingThisFrame(this.internals);

    const nodes: string[] = [];
    for (const key of this.displayedNodeLabels) {
      const data = nodeDataCache[key];
      if (!data || data.visibility === "hidden") continue;
      if (depth && data.labelDepth !== depth) continue;
      // When events are disabled, skip nodes with no visual background — nothing to render.
      if (!eventsEnabled && !data.labelBackgroundColor) continue;
      nodes.push(key);
    }

    if (nodes.length === 0) return;

    labelBackgroundProgram.reallocate(nodes.length);

    for (let i = 0; i < nodes.length; i++) {
      const key = nodes[i];
      const data = nodeDataCache[key];

      const { width: labelWidth, height: labelHeight } = this.measureNodeLabel(data);

      let shapeId: number;
      if (nodeShapeMap && nodeGlobalShapeIds) {
        const localIndex = nodeShapeMap[data.shape || Object.keys(nodeShapeMap)[0]];
        shapeId = nodeGlobalShapeIds[localIndex];
      } else {
        shapeId = getShapeId(data.shape || "circle");
      }

      // In separate mode the label kind has its own range; otherwise the rect
      // writes the parent node's picking ID so a hit resolves as a node.
      const pickingIndex =
        pickingIdOf(this.internals.pickingState, "nodeLabel", key) ||
        pickingIdOf(this.internals.pickingState, "node", key);
      const bgColor = data.labelBackgroundColor ? floatColor(data.labelBackgroundColor) : floatColor("transparent");

      const bgData: LabelBackgroundData = {
        x: data.x,
        y: data.y,
        size: data.size,
        shapeId,
        id: indexToColor(pickingIndex),
        color: bgColor,
        labelWidth,
        labelHeight,
        positionMode: POSITION_MODE_MAP[data.labelPosition || "right"] ?? 0,
        labelAngle: data.labelAngle ?? 0,
        padding: data.labelBackgroundPadding ?? 3,
      };

      labelBackgroundProgram.processLabelBackground(i, bgData);
    }

    labelBackgroundProgram.invalidateBuffers();
    labelBackgroundProgram.render(params);
  }

  /**
   * Cache attachment textures for nodes with visible backdrops.
   * Must be called before renderBackdrops so backdrop sizing includes them.
   */
  cacheAttachments(depth?: string): void {
    const { attachmentManager, pixelRatio, nodeDataCache, nodesWithBackdrop, graph } = this.internals;
    if (!attachmentManager) return;

    for (const key of nodesWithBackdrop) {
      if (!this.displayedNodeLabels.has(key)) continue;
      const data = nodeDataCache[key];
      if (!data || data.visibility === "hidden") continue;
      if (depth && data.depth !== depth) continue;
      if (!data.labelAttachment) continue;

      const attrs = graph.getNodeAttributes(key);
      const { width: labelWidth, height: labelHeight } = this.measureNodeLabel(data);

      const context: LabelAttachmentContext = {
        node: key,
        attributes: attrs as Record<string, unknown>,
        pixelRatio,
        labelWidth,
        labelHeight,
      };

      attachmentManager.renderAttachment(key, data.labelAttachment, context);
    }

    attachmentManager.regenerateAtlas();
  }

  /** Render label attachments (icons, badges, etc.) after nodes but before labels. */
  renderAttachments(params: RenderParams, depth?: string): void {
    const { attachmentManager, attachmentProgram, nodeDataCache, nodesWithBackdrop, pixelRatio } = this.internals;
    if (!attachmentManager || !attachmentProgram) return;

    let validCount = 0;
    attachmentProgram.reallocateAttachments(nodesWithBackdrop.size);

    for (const key of nodesWithBackdrop) {
      if (!this.displayedNodeLabels.has(key)) continue;
      const data = nodeDataCache[key];
      if (!data || data.visibility === "hidden") continue;
      if (depth && data.labelDepth !== depth) continue;
      if (!data.labelAttachment) continue;

      const entry = attachmentManager.getEntry(key, data.labelAttachment);
      if (!entry) continue;

      const nodeIndex = pickingIdOf(this.internals.pickingState, "node", key);
      if (nodeIndex === 0) continue;

      const { width: labelWidth, height: labelHeight } = this.measureNodeLabel(data);
      const positionMode = POSITION_MODE_MAP[data.labelPosition || "right"] ?? 0;
      const attachmentPlacement = ATTACHMENT_PLACEMENT_MAP[data.labelAttachmentPlacement || "below"] ?? 0;

      attachmentProgram.processAttachment(validCount, {
        nodeIndex,
        atlasX: entry.x,
        atlasY: entry.y,
        atlasW: entry.width,
        atlasH: entry.height,
        attachWidth: entry.width / pixelRatio,
        attachHeight: entry.height / pixelRatio,
        positionMode,
        attachmentPlacement,
        labelWidth,
        labelHeight,
        labelAngle: data.labelAngle ?? 0,
      });
      validCount++;
    }

    if (validCount === 0) return;

    attachmentProgram.reallocateAttachments(validCount);
    attachmentManager.bindTexture(ATTACHMENT_TEXTURE_UNIT);
    attachmentProgram.invalidateBuffers();
    attachmentProgram.render(params);
  }

  /**
   * Compute the per-frame list of edge labels to consider for rendering.
   * Called once before the depth loop; both `renderEdgeLabels` and
   * `renderEdgeLabelBackgrounds` consume it with their own depth filter.
   */
  computeDisplayedEdgeLabels(): void {
    const { graph, stateManager, edgesWithForcedLabels } = this.internals;
    const highlightedNodes = new Set<string>(
      graph.filterNodes((node) => stateManager.getNodeState(node).isHighlighted),
    );

    const hovered = stateManager.hovered;
    const list = edgeLabelsToDisplayFromNodes({
      graph,
      hoveredNode: hovered?.kind === "node" ? hovered.key : null,
      displayedNodeLabels: this.displayedNodeLabels,
      highlightedNodes,
    });
    extend(list, edgesWithForcedLabels);
    this.edgeLabelCandidates = list;
    this.displayedEdgeLabels = new Set();
  }

  /**
   * Returns the edge display data for candidates matching this depth that
   * should actually render (visibility checks applied). Shared filter logic
   * used by both the label and background passes.
   */
  private filterEdgeLabelsForDepth(depth?: string): string[] {
    const { graph, nodeDataCache, edgeDataCache } = this.internals;
    const result: string[] = [];
    const seen = new Set<string>();
    for (let i = 0, l = this.edgeLabelCandidates.length; i < l; i++) {
      const edge = this.edgeLabelCandidates[i];
      if (seen.has(edge)) continue;
      seen.add(edge);

      const extremities = graph.extremities(edge);
      const sourceData = nodeDataCache[extremities[0]];
      const targetData = nodeDataCache[extremities[1]];
      const edgeData = edgeDataCache[edge];
      if (!edgeData || !sourceData || !targetData) continue;

      if (
        edgeData.visibility === "hidden" ||
        edgeData.labelVisibility === "hidden" ||
        sourceData.visibility === "hidden" ||
        targetData.visibility === "hidden"
      )
        continue;

      if (depth && edgeData.labelDepth !== depth) continue;
      if (!edgeData.label) continue;

      result.push(edge);
    }
    return result;
  }

  /** Render edge labels for the given depth layer using WebGL (SDF-based). */
  renderEdgeLabels(params: RenderParams, depth?: string): void {
    const { graph, nodeDataCache, edgeDataCache, primitives, edgeLabelProgram, nodeDataTexture, edgeDataTexture } =
      this.internals;

    if (!edgeLabelProgram) return;

    const edgesToRender = this.filterEdgeLabelsForDepth(depth);

    let totalCharacters = 0;
    for (const edge of edgesToRender) totalCharacters += edgeDataCache[edge].label!.length;

    edgeLabelProgram.reallocate(totalCharacters);

    const defaultEdgeLabelMargin = primitives?.edges?.label?.margin ?? 5;
    const defaultEdgeLabelPosition = "over" as const;

    let characterOffset = 0;
    for (const edge of edgesToRender) {
      const extremities = graph.extremities(edge);
      const sourceKey = extremities[0];
      const targetKey = extremities[1];
      const sourceData = nodeDataCache[sourceKey];
      const targetData = nodeDataCache[targetKey];
      const edgeData = edgeDataCache[edge];

      const sourceNodeIndex = nodeDataTexture!.getIndex(sourceKey);
      const targetNodeIndex = nodeDataTexture!.getIndex(targetKey);
      const edgeIndex = edgeDataTexture!.getIndex(edge);

      const labelData: EdgeLabelDisplayData = {
        text: edgeData.label!,
        x: (sourceData.x + targetData.x) / 2,
        y: (sourceData.y + targetData.y) / 2,
        size: DEFAULT_EDGE_LABEL_SIZE,
        color: edgeData.labelColor,
        nodeSize: 0,
        nodeIndex: -1,
        margin: defaultEdgeLabelMargin,
        position: edgeData.labelPosition ?? defaultEdgeLabelPosition,
        hidden: false,
        forceLabel: edgeData.labelVisibility === "visible",
        type: "default",
        zIndex: edgeData.zIndex ?? 0,
        parentType: "edge",
        parentKey: edge,
        fontKey: "",
        labelAngle: 0,
        sourceX: sourceData.x,
        sourceY: sourceData.y,
        targetX: targetData.x,
        targetY: targetData.y,
        sourceSize: sourceData.size,
        targetSize: targetData.size,
        sourceShape: sourceData.shape || "circle",
        targetShape: targetData.shape || "circle",
        edgeSize: edgeData.size,
        offset: 0,
        curvature: (edgeData as unknown as { curvature?: number }).curvature || 0,
        sourceNodeIndex,
        targetNodeIndex,
        edgeIndex,
      };

      const charsProcessed = edgeLabelProgram.processEdgeLabel(edge, characterOffset, labelData);
      characterOffset += charsProcessed;
      this.displayedEdgeLabels.add(edge);
    }

    edgeLabelProgram.invalidateBuffers();
    edgeLabelProgram.render(params);
  }

  /**
   * Render ribbons behind edge labels: curves along the same offset path the
   * label characters follow. Rendered per-depth, before edge labels so the
   * text paints on top. Renders every candidate when `edgeLabelEvents` is on
   * (so picking covers transparent ribbons too); otherwise only those with a
   * visual background fill. Picking writes are further gated by the caller
   * via `pickingFrameBuffer: null`.
   */
  renderEdgeLabelBackgrounds(params: RenderParams, depth?: string): void {
    const { edgeLabelBackgroundProgram, edgeLabelProgram, edgeDataCache, primitives, edgeDataTexture } = this.internals;
    if (!edgeLabelBackgroundProgram || !edgeLabelProgram || !edgeDataTexture) return;

    const eventsEnabled = KIND_REGISTRY.edgeLabel.writesPickingThisFrame(this.internals);
    const defaultEdgeLabelMargin = primitives?.edges?.label?.margin ?? 5;
    const defaultEdgeLabelPosition = "over" as const;

    const candidates = this.filterEdgeLabelsForDepth(depth);
    const toRender: string[] = [];
    for (const edge of candidates) {
      // When events are disabled, skip edges with no visual background — nothing to render.
      if (!eventsEnabled && !edgeDataCache[edge].labelBackgroundColor) continue;
      toRender.push(edge);
    }

    if (toRender.length === 0) return;

    edgeLabelBackgroundProgram.reallocate(toRender.length);

    for (let i = 0; i < toRender.length; i++) {
      const edge = toRender[i];
      const edgeData = edgeDataCache[edge];
      const text = edgeData.label!;
      // Measure in atlas units (the unit consumed by the shader).
      const totalTextWidth = edgeLabelProgram.measureLabelAtlasWidth(text);

      const position = edgeData.labelPosition ?? defaultEdgeLabelPosition;
      const positionMode = typeof position === "string" ? (EDGE_POSITION_MODE_MAP[position] ?? 0) : 0;

      const pickingIndex =
        pickingIdOf(this.internals.pickingState, "edgeLabel", edge) ||
        pickingIdOf(this.internals.pickingState, "edge", edge);
      const bgColor = edgeData.labelBackgroundColor
        ? floatColor(edgeData.labelBackgroundColor)
        : floatColor("transparent");

      const data: EdgeLabelBackgroundData = {
        edgeIndex: edgeDataTexture.getIndex(edge),
        edgeAttrIndex: i,
        baseFontSize: DEFAULT_EDGE_LABEL_SIZE,
        totalTextWidth,
        positionMode,
        margin: defaultEdgeLabelMargin,
        padding: edgeData.labelBackgroundPadding ?? DEFAULT_EDGE_LABEL_PADDING,
        color: bgColor,
        id: indexToColor(pickingIndex),
        curvature: (edgeData as unknown as { curvature?: number }).curvature || 0,
      };

      edgeLabelBackgroundProgram.processEdgeLabelBackground(i, edge, data);
    }

    edgeLabelBackgroundProgram.invalidateBuffers();
    edgeLabelBackgroundProgram.render(params);
  }
}
