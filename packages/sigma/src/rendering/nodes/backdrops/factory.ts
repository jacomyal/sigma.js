/**
 * Sigma.js Backdrop Program Factory
 * ==================================
 *
 * Builds a backdrop program instance from an SDF shape definition. The
 * program renders the union of an enlarged node shape and a label
 * rectangle, with a soft shadow effect.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import type Sigma from "../../../sigma";
import type { LabelPosition, RenderParams } from "../../../types";
import { POSITION_MODE_MAP } from "../../glsl";
import { Program } from "../../program";
import { dedupeShapeUniforms } from "../../shapes";
import { InstancedProgramDefinition, ProgramInfo } from "../../utils";
import { LabelOptions, SDFShape } from "../types";
import { BackdropShaderOptions, generateBackdropShaders } from "./generator";

export interface BackdropDisplayData {
  key: string;
  nodeIndex: number; // node-data texture index (position/size/shapeId + edge distance)
  label: string | null;
  labelWidth: number;
  labelHeight: number; // font line box (CSS px)
  textHeight: number; // actual glyph height (CSS px)
  type: string;
  position: LabelPosition;
  labelAngle: number;
  // Per-node backdrop style data
  backdropColor: [number, number, number, number]; // RGBA floats 0-1
  backdropShadowColor: [number, number, number, number]; // RGBA floats 0-1
  backdropShadowBlur: number;
  backdropPadding: number;
  backdropBorderColor: [number, number, number, number]; // RGBA floats 0-1
  backdropBorderWidth: number;
  backdropCornerRadius: number;
  backdropLabelPadding: number; // Already resolved (fallback applied)
  backdropArea: number; // 0=both, 1=node, 2=label
  labelBoxOffset: [number, number]; // Shifts label box center (e.g., to cover attachment below)
}

export interface CreateBackdropProgramOptions {
  shapes: SDFShape[];
  label?: LabelOptions;
  /** Maps local shape index to global shape ID (for multi-shape programs). */
  shapeGlobalIds?: number[];
}

export function createBackdropProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
  options: CreateBackdropProgramOptions,
): BackdropProgram<N, E, G> {
  const { label: labelOptions = {}, shapes, shapeGlobalIds } = options;

  if (shapes.length === 0) {
    throw new Error("createBackdropProgram: at least one shape must be provided in 'shapes'");
  }

  const labelMargin = labelOptions.margin ?? 5;
  const zoomToLabelSizeRatioFunction = labelOptions.zoomToLabelSizeRatioFunction ?? (() => 1);

  const shaderOptions: BackdropShaderOptions = { shapes, shapeGlobalIds };
  const generatedShaders = generateBackdropShaders(shaderOptions);

  type BackdropUniform = string;

  class NodeBackdropProgram extends Program<BackdropUniform, N, E, G> {
    static readonly labelMargin = labelMargin;

    protected totalBackdropCount = 0;
    protected bufferCapacity = 0;

    getDefinition(): InstancedProgramDefinition<BackdropUniform> {
      const { FLOAT, TRIANGLE_STRIP } = WebGL2RenderingContext;

      return {
        VERTICES: 4,
        VERTEX_SHADER_SOURCE: generatedShaders.vertexShader,
        FRAGMENT_SHADER_SOURCE: generatedShaders.fragmentShader,
        METHOD: TRIANGLE_STRIP,
        UNIFORMS: generatedShaders.uniforms as BackdropUniform[],
        ATTRIBUTES: [
          { name: "a_nodeIndex", size: 1, type: FLOAT },
          { name: "a_labelWidth", size: 1, type: FLOAT },
          { name: "a_labelHeight", size: 1, type: FLOAT },
          { name: "a_textHeight", size: 1, type: FLOAT },
          { name: "a_positionMode", size: 1, type: FLOAT },
          { name: "a_labelAngle", size: 1, type: FLOAT },
          { name: "a_backdropColor", size: 4, type: FLOAT },
          { name: "a_backdropShadowColor", size: 4, type: FLOAT },
          { name: "a_backdropShadowBlur", size: 1, type: FLOAT },
          { name: "a_backdropPadding", size: 1, type: FLOAT },
          { name: "a_backdropBorderColor", size: 4, type: FLOAT },
          // Packed: [borderWidth, cornerRadius, labelPadding, area]
          { name: "a_backdropExtra", size: 4, type: FLOAT },
          { name: "a_labelBoxOffset", size: 2, type: FLOAT },
        ],
        CONSTANT_ATTRIBUTES: [{ name: "a_quadCorner", size: 2, type: FLOAT }],
        CONSTANT_DATA: [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ],
      };
    }

    processBackdrop(offset: number, data: BackdropDisplayData): void {
      const { floats, STRIDE } = this;
      let i = offset * STRIDE;

      floats[i++] = data.nodeIndex;
      floats[i++] = data.labelWidth;
      floats[i++] = data.labelHeight;
      floats[i++] = data.textHeight;
      floats[i++] = POSITION_MODE_MAP[data.position];
      floats[i++] = data.labelAngle;
      floats[i++] = data.backdropColor[0];
      floats[i++] = data.backdropColor[1];
      floats[i++] = data.backdropColor[2];
      floats[i++] = data.backdropColor[3];
      floats[i++] = data.backdropShadowColor[0];
      floats[i++] = data.backdropShadowColor[1];
      floats[i++] = data.backdropShadowColor[2];
      floats[i++] = data.backdropShadowColor[3];
      floats[i++] = data.backdropShadowBlur;
      floats[i++] = data.backdropPadding;
      floats[i++] = data.backdropBorderColor[0];
      floats[i++] = data.backdropBorderColor[1];
      floats[i++] = data.backdropBorderColor[2];
      floats[i++] = data.backdropBorderColor[3];
      // Packed vec4: [borderWidth, cornerRadius, labelPadding, area]
      floats[i++] = data.backdropBorderWidth;
      floats[i++] = data.backdropCornerRadius;
      floats[i++] = data.backdropLabelPadding;
      floats[i++] = data.backdropArea;
      floats[i++] = data.labelBoxOffset[0];
      floats[i++] = data.labelBoxOffset[1];
    }

    setUniforms(params: RenderParams, programInfo: ProgramInfo): void {
      const { gl, uniformLocations } = programInfo;

      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);
      gl.uniform2f(uniformLocations.u_resolution, params.width * params.pixelRatio, params.height * params.pixelRatio);
      gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);
      gl.uniform1f(uniformLocations.u_labelMargin, NodeBackdropProgram.labelMargin);

      // Zoom-dependent label size ratio
      gl.uniform1f(uniformLocations.u_zoomLabelSizeRatio, 1 / zoomToLabelSizeRatioFunction(params.zoomRatio));
      gl.uniform1f(uniformLocations.u_labelPixelSnapping, params.labelPixelSnapping);

      // Shared node-data + frame textures (position/size/shapeId + edge distance)
      gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
      gl.uniform1i(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      gl.uniform1i(uniformLocations.u_nodeFrameTexture, params.nodeFrameTextureUnit);
      gl.uniform1i(uniformLocations.u_nodeFrameTextureWidth, params.nodeFrameTextureWidth);

      // Shape-specific uniforms (fragment shader keeps the node SDF for the outline)
      for (const uniform of dedupeShapeUniforms(shapes)) {
        this.setTypedUniform(uniform, programInfo);
      }
    }

    hasNothingToRender(): boolean {
      return this.totalBackdropCount === 0;
    }

    drawWebGL(method: number, { gl }: ProgramInfo): void {
      if (this.totalBackdropCount === 0) return;

      if (!this.isInstanced) {
        gl.drawArrays(method, 0, this.totalBackdropCount * this.VERTICES);
      } else {
        gl.drawArraysInstanced(method, 0, this.VERTICES, this.totalBackdropCount);
      }
    }

    reallocate(backdropCount: number): void {
      this.totalBackdropCount = backdropCount;

      if (backdropCount > this.bufferCapacity) {
        this.bufferCapacity = Math.max(backdropCount, Math.ceil(this.bufferCapacity * 1.5) || 10);
        super.reallocate(this.bufferCapacity);
      }
    }
  }

  return new NodeBackdropProgram(gl, pickingBuffer, renderer);
}

export interface BackdropProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<string, N, E, G> {
  processBackdrop(offset: number, data: BackdropDisplayData): void;
}
