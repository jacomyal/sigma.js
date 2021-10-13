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
import { AbstractNodeProgram, RenderNodeParams } from "./common/node";

const POINTS = 1,
  ATTRIBUTES = 8;

type ImageLoading = { status: "loading" };
type ImageError = { status: "error" };
type ImageReady = { status: "ready" } & Coordinates & Dimensions;
type ImageType = ImageLoading | ImageError | ImageReady;

function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) == 0;
}

export default class NodeProgramImage extends AbstractNodeProgram {
  textureImage: ImageData;
  images: Record<string, ImageType> = {};
  hasReceivedImages = false;

  texture: WebGLTexture;
  textureLocation: GLint;
  atlasLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    this.textureImage = new ImageData(1, 1);

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
    const imageState = imageSource && this.images[imageSource];
    if (typeof imageSource === "string" && !imageState) this.loadImage(imageSource);

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
      const { width, height } = this.textureImage;
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

  render(params: RenderNodeParams): void {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
    gl.uniform1i(this.atlasLocation, 0);

    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }

  /**
   * Helper to load an image:
   */
  private loadImage(imageSource: string): void {
    if (this.images[imageSource]) return;

    const image = new Image();
    image.addEventListener("load", () => {
      this.addToTexture([image]);
      this.images[imageSource] = {
        status: "ready",
        x: this.textureImage.width - image.width,
        y: 0,
        width: image.width,
        height: image.height,
      };
    });
    image.addEventListener("error", () => {
      this.images[imageSource] = { status: "error" };
    });
    this.images[imageSource] = { status: "loading" };

    // Load image:
    image.src = imageSource;
  }

  /**
   * Helper to add an image into the texture (it actually generates a new
   * texture):
   */
  private addToTexture(images: HTMLImageElement[]): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = images.reduce(
      (iter, image) => iter + image.width,
      this.hasReceivedImages ? this.textureImage.width : 0,
    );
    canvas.height = Math.max(...images.map((image) => image.height));

    let xOffset = 0;
    if (this.hasReceivedImages) {
      ctx.putImageData(this.textureImage, 0, 0);
      xOffset = this.textureImage.width;
    }
    images.forEach((image) => {
      ctx.drawImage(image, xOffset, 0);
      xOffset += image.width;
    });

    this.textureImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImage);

    if (isPowerOf2(this.textureImage.width) && isPowerOf2(this.textureImage.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    this.hasReceivedImages = true;
  }
}
