/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Program rendering nodes using GL_POINTS, but that draws an image on top of
 * the classic colored disc.
 * @module
 */
import { Coordinates, Dimensions, NodeDisplayData } from "../../../types";
import { floatColor } from "../../../utils";
import vertexShaderSource from "../shaders/node.image.vert.glsl";
import fragmentShaderSource from "../shaders/node.image.frag.glsl";
import { AbstractNodeProgram } from "./common/node";
import { RenderParams } from "./common/program";
import Sigma from "../../../sigma";

const POINTS = 1,
  ATTRIBUTES = 8,
  MAX_TEXTURE_SIZE = 100;

type ImageLoading = { status: "loading" };
type ImageError = { status: "error" };
type ImagePending = { status: "pending"; image: HTMLImageElement };
type ImageReady = { status: "ready" } & Coordinates & Dimensions;
type ImageType = ImageLoading | ImageError | ImagePending | ImageReady;

// This class only exists for the return typing of `getNodeImageProgram`:
class AbstractNodeImageProgram extends AbstractNodeProgram {
  /* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
  constructor(gl: WebGLRenderingContext, renderer: Sigma) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
  }
  bind(): void {}
  process(data: NodeDisplayData & { image?: string }, hidden: boolean, offset: number): void {}
  render(params: RenderParams): void {}
  rebindTexture() {}
  /* eslint-enable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
}

/**
 * To share the texture between the program instances of the graph and the
 * hovered nodes (to prevent some flickering, mostly), this program must be
 * "built" for each sigma instance:
 */
export default function getNodeImageProgram(): typeof AbstractNodeImageProgram {
  /**
   * These attributes are shared between all instances of this exact class,
   * returned by this call to getNodeProgramImage:
   */
  const rebindTextureFns: (() => void)[] = [];
  const images: Record<string, ImageType> = {};
  let textureImage: ImageData;
  let hasReceivedImages = false;
  let pendingImagesFrameID: number | undefined = undefined;

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

    const pendingImages: { image: HTMLImageElement; id: string; size: number }[] = [];

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
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = pendingImages.reduce((iter, { size }) => iter + size, hasReceivedImages ? textureImage.width : 0);
    canvas.height = Math.max(hasReceivedImages ? textureImage.height : 0, ...pendingImages.map(({ size }) => size));

    let xOffset = 0;
    if (hasReceivedImages) {
      ctx.putImageData(textureImage, 0, 0);
      xOffset = textureImage.width;
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
      ctx.drawImage(image, dx, dy, size, size, xOffset, 0, imageSizeInTexture, imageSizeInTexture);

      // Update image state:
      images[id] = {
        status: "ready",
        x: xOffset,
        y: 0,
        width: imageSizeInTexture,
        height: imageSizeInTexture,
      };

      xOffset += imageSizeInTexture;
    });

    textureImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    hasReceivedImages = true;
    rebindTextureFns.forEach((fn) => fn());
  }

  return class NodeImageProgram extends AbstractNodeProgram {
    texture: WebGLTexture;
    textureLocation: GLint;
    atlasLocation: WebGLUniformLocation;
    latestRenderParams?: RenderParams;

    constructor(gl: WebGLRenderingContext, renderer: Sigma) {
      super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

      rebindTextureFns.push(() => {
        if (this && this.rebindTexture) this.rebindTexture();
        if (renderer && renderer.refresh) renderer.refresh();
      });

      textureImage = new ImageData(1, 1);

      // Attribute Location
      this.textureLocation = gl.getAttribLocation(this.program, "a_texture");

      // Uniform Location
      const atlasLocation = gl.getUniformLocation(this.program, "u_atlas");
      if (atlasLocation === null) throw new Error("NodeProgramImage: error while getting atlasLocation");
      this.atlasLocation = atlasLocation;

      // Initialize WebGL texture:
      this.texture = gl.createTexture() as WebGLTexture;
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

      this.bind();
    }

    bind(): void {
      super.bind();

      const gl = this.gl;

      gl.enableVertexAttribArray(this.textureLocation);
      gl.vertexAttribPointer(
        this.textureLocation,
        4,
        gl.FLOAT,
        false,
        this.attributes * Float32Array.BYTES_PER_ELEMENT,
        16,
      );
    }

    process(data: NodeDisplayData & { image?: string }, hidden: boolean, offset: number): void {
      const array = this.array;
      let i = offset * POINTS * ATTRIBUTES;

      const imageSource = data.image;
      const imageState = imageSource && images[imageSource];
      if (typeof imageSource === "string" && !imageState) loadImage(imageSource);

      if (hidden) {
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;
        // Texture:
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;
        return;
      }

      array[i++] = data.x;
      array[i++] = data.y;
      array[i++] = data.size;
      array[i++] = floatColor(data.color);

      // Reference texture:
      if (imageState && imageState.status === "ready") {
        const { width, height } = textureImage;
        array[i++] = imageState.x / width;
        array[i++] = imageState.y / height;
        array[i++] = imageState.width / width;
        array[i++] = imageState.height / height;
      } else {
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;
      }
    }

    render(params: RenderParams): void {
      if (this.hasNothingToRender()) return;

      this.latestRenderParams = params;

      const gl = this.gl;

      const program = this.program;
      gl.useProgram(program);

      gl.uniform1f(this.ratioLocation, 1 / Math.sqrt(params.ratio));
      gl.uniform1f(this.scaleLocation, params.scalingRatio);
      gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
      gl.uniform1i(this.atlasLocation, 0);

      gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
    }

    rebindTexture() {
      const gl = this.gl;

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
      gl.generateMipmap(gl.TEXTURE_2D);

      if (this.latestRenderParams) {
        this.bind();
        this.bufferData();
        this.render(this.latestRenderParams);
      }
    }
  };
}
