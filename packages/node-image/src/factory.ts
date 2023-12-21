import Sigma from "sigma";
import * as utils from "sigma/utils";
import * as NodeRendering from "sigma/rendering/node";
import { NodeProgramType, ProgramInfo } from "sigma/rendering";
import { NodeLabelDrawingFunction } from "sigma/rendering/node-labels";
import { Coordinates, Dimensions, NodeDisplayData, RenderParams } from "sigma/types";

import VERTEX_SHADER_SOURCE from "./shader-vert";
import FRAGMENT_SHADER_SOURCE from "./shader-frag";

const { floatColor } = utils;
const { NodeProgram } = NodeRendering;

// maximum size of single texture in atlas
const MAX_TEXTURE_SIZE = 192;
// maximum width of atlas texture (limited by browser)
// low setting of 3072 works on phones & tablets
const MAX_CANVAS_WIDTH = 3072;

type ImageLoading = { status: "loading" };
type ImageError = { status: "error" };
type ImagePending = { status: "pending"; image: HTMLImageElement };
type ImageReady = { status: "ready" } & Coordinates & Dimensions;
type ImageType = ImageLoading | ImageError | ImagePending | ImageReady;

const UNIFORMS = ["u_sizeRatio", "u_correctionRatio", "u_matrix", "u_atlas"] as const;

interface CreateNodeImageProgramOptions {
  padding: number;
  // NOTE: only work with svg accessible through CORS and having proper dimensions
  forcedSvgSize: number;
  correctCentering: boolean;
  // NOTE: if true, the edges of some pictogram might be cropped to fit the circle
  // This might be desirable when showing pictogram inside a node, but not if
  // you need to rely on pictograms to display node as shapes
  keepWithinCircle: boolean;
  // NODE:
  // - If "background", color will be used to color full node behind the image.
  // - If "color", color will be used to color image pixels (for pictograms)
  drawingMode: "background" | "color";

  drawLabel: NodeLabelDrawingFunction | undefined;
  drawHover: NodeLabelDrawingFunction | undefined;
}

const DEFAULT_CREATE_NODE_IMAGE_OPTIONS: CreateNodeImageProgramOptions = {
  padding: 0,
  forcedSvgSize: 0,
  correctCentering: false,
  keepWithinCircle: true,
  drawingMode: "background",
  drawLabel: undefined,
  drawHover: undefined,
};

/**
 * To share the texture between the program instances of the graph and the
 * hovered nodes (to prevent some flickering, mostly), this program must be
 * "built" for each sigma instance:
 */
export default function getNodeImageProgram(options?: Partial<CreateNodeImageProgramOptions>): NodeProgramType {
  const { drawHover, drawLabel }: CreateNodeImageProgramOptions = {
    ...DEFAULT_CREATE_NODE_IMAGE_OPTIONS,
    ...(options || {}),
  };

  /**
   * These attributes are shared between all instances of this exact class,
   * returned by this call to getNodeProgramImage:
   */
  const rebindTextureFns: (() => void)[] = [];
  const images: Record<string, ImageType> = {};
  let textureImage: ImageData;
  let hasReceivedImages = false;
  let pendingImagesFrameID: number | undefined = undefined;

  // next write position in texture
  let writePositionX = 0;
  let writePositionY = 0;
  // height of current row
  let writeRowHeight = 0;

  interface PendingImage {
    image: HTMLImageElement;
    id: string;
    size: number;
  }

  /**
   * Helper to load an image:
   */
  function loadImage(imageSource: string): void {
    if (images[imageSource]) return;

    const image = new Image();
    image.addEventListener("load", () => {
      images[imageSource] = {
        status: "pending",
        image,
      };

      if (typeof pendingImagesFrameID !== "number") {
        pendingImagesFrameID = requestAnimationFrame(() => finalizePendingImages());
      }
    });
    image.addEventListener("error", () => {
      images[imageSource] = { status: "error" };
    });
    images[imageSource] = { status: "loading" };

    // Load image:
    image.setAttribute("crossOrigin", "");
    image.src = imageSource;
  }

  /**
   * Helper that takes all pending images and adds them into the texture:
   */
  function finalizePendingImages(): void {
    pendingImagesFrameID = undefined;

    const pendingImages: PendingImage[] = [];

    // List all pending images:
    for (const id in images) {
      const state = images[id];
      if (state.status === "pending") {
        pendingImages.push({
          id,
          image: state.image,
          size: Math.min(state.image.width, state.image.height) || 1,
        });
      }
    }

    // Add images to texture:
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

    // limit canvas size to avoid browser and platform limits
    let totalWidth = hasReceivedImages ? textureImage.width : 0;
    let totalHeight = hasReceivedImages ? textureImage.height : 0;

    // initialize image drawing offsets with current write position
    let xOffset = writePositionX;
    let yOffset = writePositionY;

    /**
     * Draws a (full or partial) row of images into the atlas texture
     * @param pendingImages
     */
    const drawRow = (pendingImages: PendingImage[]) => {
      // update canvas size before drawing
      if (canvas.width !== totalWidth || canvas.height !== totalHeight) {
        canvas.width = Math.min(MAX_CANVAS_WIDTH, totalWidth);
        canvas.height = totalHeight;

        // draw previous texture into resized canvas
        if (hasReceivedImages) {
          ctx.putImageData(textureImage, 0, 0);
        }
      }

      pendingImages.forEach(({ id, image, size }) => {
        const imageSizeInTexture = Math.min(MAX_TEXTURE_SIZE, size);

        // Crop image, to only keep the biggest square, centered:
        let dx = 0,
          dy = 0;
        if ((image.width || 0) > (image.height || 0)) {
          dx = (image.width - image.height) / 2;
        } else {
          dy = (image.height - image.width) / 2;
        }
        ctx.drawImage(image, dx, dy, size, size, xOffset, yOffset, imageSizeInTexture, imageSizeInTexture);

        // Update image state:
        images[id] = {
          status: "ready",
          x: xOffset,
          y: yOffset,
          width: imageSizeInTexture,
          height: imageSizeInTexture,
        };

        xOffset += imageSizeInTexture;
      });

      hasReceivedImages = true;
      textureImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    let rowImages: PendingImage[] = [];
    pendingImages.forEach((image) => {
      const { size } = image;
      const imageSizeInTexture = Math.min(size, MAX_TEXTURE_SIZE);

      if (writePositionX + imageSizeInTexture > MAX_CANVAS_WIDTH) {
        // existing row is full: flush row and continue on next line
        if (rowImages.length > 0) {
          totalWidth = Math.max(writePositionX, totalWidth);
          totalHeight = Math.max(writePositionY + writeRowHeight, totalHeight);
          drawRow(rowImages);

          rowImages = [];
          writeRowHeight = 0;
        }

        writePositionX = 0;
        writePositionY = totalHeight;
        xOffset = 0;
        yOffset = totalHeight;
      }

      // add image to row
      rowImages.push(image);

      // advance write position and update maximum row height
      writePositionX += imageSizeInTexture;
      writeRowHeight = Math.max(writeRowHeight, imageSizeInTexture);
    });

    // flush pending images in row - keep write position (and drawing cursor)
    totalWidth = Math.max(writePositionX, totalWidth);
    totalHeight = Math.max(writePositionY + writeRowHeight, totalHeight);
    drawRow(rowImages);
    rowImages = [];

    rebindTextureFns.forEach((fn) => fn());
  }

  const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

  return class NodeImageProgram extends NodeProgram<(typeof UNIFORMS)[number]> {
    static readonly ANGLE_1 = 0;
    static readonly ANGLE_2 = (2 * Math.PI) / 3;
    static readonly ANGLE_3 = (4 * Math.PI) / 3;

    static drawLabel = drawLabel;
    static drawHover = drawHover;

    getDefinition() {
      return {
        VERTICES: 3,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE,
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS,
        ATTRIBUTES: [
          { name: "a_position", size: 2, type: FLOAT },
          { name: "a_size", size: 1, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_texture", size: 4, type: FLOAT },
        ],
        CONSTANT_ATTRIBUTES: [{ name: "a_angle", size: 1, type: FLOAT }],
        CONSTANT_DATA: [[NodeImageProgram.ANGLE_1], [NodeImageProgram.ANGLE_2], [NodeImageProgram.ANGLE_3]],
      };
    }

    texture: WebGLTexture;
    latestRenderParams?: RenderParams;

    constructor(gl: WebGLRenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma) {
      super(gl, pickingBuffer, renderer);

      rebindTextureFns.push(() => {
        if (this && this.bindTexture) {
          this.bindTexture();
          if (this.latestRenderParams) this.render(this.latestRenderParams);
        }
        if (renderer && renderer.refresh) renderer.refresh();
      });

      textureImage = new ImageData(1, 1);

      this.texture = gl.createTexture() as WebGLTexture;
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    }

    bindTexture() {
      const gl = this.normalProgram.gl;

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    protected renderProgram(params: RenderParams, programInfo: ProgramInfo) {
      if (!programInfo.isPicking) {
        // Rebind texture (since it's been just unbound by picking):
        const gl = programInfo.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
      }
      super.renderProgram(params, programInfo);
    }

    processVisibleItem(nodeIndex: number, startIndex: number, data: NodeDisplayData & { image?: string }): void {
      const array = this.array;
      const color = floatColor(data.color);

      const imageSource = data.image;
      const imageState = imageSource && images[imageSource];
      if (typeof imageSource === "string" && !imageState) loadImage(imageSource);

      array[startIndex++] = data.x;
      array[startIndex++] = data.y;
      array[startIndex++] = data.size;
      array[startIndex++] = color;
      array[startIndex++] = nodeIndex;

      // Reference texture:
      if (imageState && imageState.status === "ready") {
        const { width, height } = textureImage;
        array[startIndex++] = imageState.x / width;
        array[startIndex++] = imageState.y / height;
        array[startIndex++] = imageState.width / width;
        array[startIndex++] = imageState.height / height;
      } else {
        array[startIndex++] = 0;
        array[startIndex++] = 0;
        array[startIndex++] = 0;
        array[startIndex++] = 0;
      }
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      const { u_sizeRatio, u_correctionRatio, u_matrix, u_atlas } = uniformLocations;
      this.latestRenderParams = params;

      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniformMatrix3fv(u_matrix, false, params.matrix);
      gl.uniform1i(u_atlas, 0);
    }
  };
}
