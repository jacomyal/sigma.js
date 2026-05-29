/**
 * Sigma.js WebGL Abstract Label Program
 * ======================================
 *
 * Base classes for WebGL label programs.
 * @module
 */
import { Attributes } from "graphology-types";

import type { LabelDisplayData } from "../../../types";
import { Program } from "../../program";
import { ProgramInfo } from "../../utils";

interface LabelDataBase {
  hidden?: boolean;
  text?: string;
}

/**
 * Base class for label program implementations.
 *
 * Label programs render text labels using WebGL (SDF-based rendering).
 * Unlike node/edge programs, labels are processed per-character.
 *
 * Visibility is handled by processing only visible labels each frame
 * (determined by LabelGrid), so all characters in the buffer are rendered.
 *
 * The DataType generic allows reuse by both node labels (LabelDisplayData)
 * and edge labels (EdgeLabelDisplayData) via EdgeLabelProgram.
 */
export abstract class LabelProgram<
  Uniform extends string = string,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
  DataType extends LabelDataBase = LabelDisplayData,
> extends Program<Uniform, N, E, G> {
  /** Ensure all glyphs for the given texts are generated and available. */
  abstract ensureGlyphsReady(texts: string[], fontKey?: string): void;

  /** Register a font for use in labels and return its lookup key. */
  abstract registerFont(family: string, weight?: string, style?: string): string;

  /** Measure a label using the same glyph metrics as rendering. */
  abstract measureLabel(text: string, fontSize: number, fontKey?: string): { width: number; height: number };

  /**
   * Total number of characters currently in the buffer.
   */
  protected totalCharacterCount = 0;

  /**
   * Buffer capacity (in characters) - only reallocate when exceeded.
   */
  protected bufferCapacity = 0;

  /**
   * Process a label and write its character data to the GPU buffer.
   */
  processLabel(_labelKey: string, offset: number, data: DataType): number {
    if (data.hidden || !data.text) {
      return 0;
    }

    const text = data.text;
    const charCount = text.length;

    // Process each character
    for (let i = 0; i < charCount; i++) {
      const char = text[i];
      this.processCharacter(offset + i, data, char, i);
    }

    return charCount;
  }

  /**
   * Process a single character. Override in subclasses.
   *
   * @param index - Character index in the buffer
   * @param labelData - Parent label data
   * @param char - The character to process
   * @param charIndex - Index of character within the label text
   */
  protected abstract processCharacter(index: number, labelData: DataType, char: string, charIndex: number): void;

  /**
   * Check if there's nothing to render.
   */
  hasNothingToRender(): boolean {
    return this.totalCharacterCount === 0;
  }

  /**
   * Render all characters in the buffer.
   * Since we only process visible labels, all buffered characters should be rendered.
   */
  drawWebGL(method: number, { gl }: ProgramInfo): void {
    if (this.totalCharacterCount === 0) return;

    if (!this.isInstanced) {
      gl.drawArrays(method, 0, this.totalCharacterCount * this.VERTICES);
    } else {
      gl.drawArraysInstanced(method, 0, this.VERTICES, this.totalCharacterCount);
    }
  }

  /**
   * Reallocate buffers if needed and set the character count for this frame.
   * Only reallocates GPU buffers when capacity is exceeded.
   *
   * @param characterCount - Number of characters to render this frame
   */
  reallocate(characterCount: number): void {
    this.totalCharacterCount = characterCount;

    // Only reallocate GPU buffers if we need more capacity
    if (characterCount > this.bufferCapacity) {
      // Allocate with some headroom to avoid frequent reallocations
      this.bufferCapacity = Math.max(characterCount, Math.ceil(this.bufferCapacity * 1.5) || 1000);
      super.reallocate(this.bufferCapacity);
    }
  }
}
