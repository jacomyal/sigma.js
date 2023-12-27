import { EventEmitter } from "events";
import { Coordinates } from "sigma/types";

/**
 * Useful types:
 * *************
 */
export type ImageLoading = { status: "loading" };
export type ImageError = { status: "error" };
export type ImageReady = { status: "ready"; image: HTMLImageElement };
export type ImageType = ImageLoading | ImageError | ImageReady;

export type Atlas = Record<string, Coordinates & { size: number }>;

export type TextureManagerOptions = {
  // - If mode "auto", will always display images with their given size.
  // - If mode "force", will always scale images to the given value.
  // - If mode "max", will downscale images larger than the given value.
  size: { mode: "auto" } | { mode: "max"; value: number } | { mode: "force"; value: number };
  // The padding should be expressed as a [0, 1] percentage.
  // A padding of 0.05 will always be 5% of the diameter of a node.
  padding: number;
  // Tries to mimic the related CSS property.
  objectFit: "contain" | "cover" | "fill";
  // If true, the image is centered on its alpha barycenter.
  correctCentering: boolean;
};

export const DEFAULT_TEXTURE_MANAGER_OPTIONS: TextureManagerOptions = {
  size: { mode: "max", value: 512 },
  padding: 0,
  objectFit: "cover",
  correctCentering: false,
};

export const DEBOUNCE_TIMEOUT = 100;

/**
 * Helpers:
 * ********
 */
/**
 * This helper loads an image at a given URL, and returns an HTMLImageElement
 * with it displayed once it's properly loaded, within a promise.
 */
export function loadRasterImage(imageSource: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener(
      "load",
      () => {
        resolve(image);
      },
      { once: true },
    );
    image.addEventListener(
      "error",
      (e) => {
        reject(e.error);
      },
      { once: true },
    );

    // Load image:
    image.setAttribute("crossOrigin", "");
    image.src = imageSource;
  });
}

/**
 * This helper loads an SVG image at a given URL, adjusts its size to a given
 * size, and returns an HTMLImageElement with it displayed once it's properly
 * loaded, within a promise.
 */
export async function loadSVGImage(imageSource: string, { size }: { size?: number } = {}): Promise<HTMLImageElement> {
  const resp = await fetch(imageSource);
  const svgString = await resp.text();
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");

  const root = svg.documentElement;

  let originalWidth = root.getAttribute("width");
  let originalHeight = root.getAttribute("height");

  if (!originalWidth || !originalHeight)
    throw new Error("loadSVGImage: cannot use `size` if target SVG has no definite dimensions.");

  if (typeof size === "number") {
    root.setAttribute("width", "" + size);
    root.setAttribute("height", "" + size);
  }

  // NOTE: since Google Material last changes to their icon viewBox, this
  // code is no longer necessary (hopefully it does not break something else...)
  // root.setAttribute("viewBox", `0 0 ${originalWidth} ${originalHeight}`);

  const correctedSvgString = new XMLSerializer().serializeToString(svg);

  const blob = new Blob([correctedSvgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const res = loadRasterImage(url);
  res.finally(() => URL.revokeObjectURL(url));
  return res;
}

/**
 * This helper loads an image using the proper function.
 */
export async function loadImage(imageSource: string, { size }: { size?: number } = {}): Promise<HTMLImageElement> {
  const isSVG = imageSource.split(/[#?]/)[0].split(".").pop()?.trim().toLowerCase() === "svg";

  let image: HTMLImageElement;
  if (isSVG && size) {
    try {
      image = await loadSVGImage(imageSource, { size });
    } catch (e) {
      image = await loadRasterImage(imageSource);
    }
  } else {
    image = await loadRasterImage(imageSource);
  }

  return image;
}

/**
 * This helper draws an image on the texture, with the proper size and position.
 */
export function drawImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  { x, y }: { x: number; y: number },
  {
    mode,
    size,
    padding,
    contains,
  }: { mode: "max" | "force" | "auto"; size: number; padding: number; contains?: boolean },
): number {
  const sizeOnImage = contains ? Math.max(image.width, image.height) : Math.min(image.width, image.height);
  const sizeOnTexture = mode === "auto" ? sizeOnImage : mode === "force" ? size : Math.min(size, sizeOnImage);

  let xInImage = (image.width - sizeOnImage) / 2;
  let yInImage = (image.height - sizeOnImage) / 2;

  ctx.drawImage(image, xInImage, yInImage, sizeOnImage, sizeOnImage, x, y, sizeOnTexture, sizeOnTexture);

  return sizeOnTexture;
}

export function drawTexture(
  ctx: CanvasRenderingContext2D,
  images: Record<string, ImageType>,
  corrector: PictogramCenteringCorrector,
  { size, objectFit, correctCentering }: TextureManagerOptions,
): Atlas {
  const MAX_CANVAS_WIDTH = 3072;
  const TARGET_FILL_PERCENTAGE = 0.6;

  // 1. Sort images by height, decreasingly:
  const imagesArray: {
    key: string;
    image: HTMLImageElement;
    sourceX: number;
    sourceY: number;
    sourceSize: number;
    destinationSize: number;
  }[] = [];
  let totalArea = 0;
  let maxItemWidth = 0;
  for (const key in images) {
    const imageState = images[key];
    if (imageState.status !== "ready") continue;

    const image = imageState.image;
    const sourceSize =
      objectFit === "contain" ? Math.max(image.width, image.height) : Math.min(image.width, image.height);
    const destinationSize =
      size.mode === "auto" ? sourceSize : size.mode === "force" ? size.value : Math.min(size.value, sourceSize);
    let sourceX = (image.width - sourceSize) / 2;
    let sourceY = (image.height - sourceSize) / 2;

    if (correctCentering) {
      const correction = corrector.getCorrectionOffset(image, sourceSize);
      sourceX = correction.x;
      sourceY = correction.y;
    }

    maxItemWidth = Math.max(maxItemWidth, destinationSize);
    totalArea += destinationSize ** 2;
    imagesArray.push({
      key,
      image,
      sourceX,
      sourceY,
      sourceSize,
      destinationSize,
    });
  }
  imagesArray.sort((a, b) => (a.destinationSize > b.destinationSize ? -1 : 1));

  // 2. Set canvas width, and predict its height:
  const predictedTotalArea = totalArea / TARGET_FILL_PERCENTAGE;
  const canvas = ctx.canvas;
  canvas.width = Math.max(Math.min(MAX_CANVAS_WIDTH, Math.sqrt(predictedTotalArea)), maxItemWidth);
  canvas.height = predictedTotalArea / canvas.width;

  // 3. Fill texture:
  let x = 0;
  let y = 0;
  let currentRowHeight = 0;
  let maxRowWidth = 0;
  const atlas: Atlas = {};
  for (let i = 0, l = imagesArray.length; i < l; i++) {
    const { key, image, sourceSize, sourceX, sourceY, destinationSize } = imagesArray[i];
    if (x + destinationSize > canvas.width) {
      maxRowWidth = Math.max(maxRowWidth, x);
      x = 0;
      y += currentRowHeight;
      currentRowHeight = destinationSize;
    }
    ctx.fillStyle = "#000";
    ctx.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, x, y, destinationSize, destinationSize);
    atlas[key] = {
      x,
      y,
      // This function handles rectangle for future-proof-ness, but the atlas
      // actually expects squares.
      size: Math.max(destinationSize, destinationSize),
    };
    x += destinationSize;
    currentRowHeight = Math.max(currentRowHeight, destinationSize);
  }

  // 4. Crop texture to best dimensions:
  maxRowWidth = Math.max(maxRowWidth, x);
  // canvas.width = maxRowWidth;
  // canvas.height = y + currentRowHeight;

  return atlas;
}

/**
 * This class helps to "correct" the centering of an SVG pictogram by finding
 * the "true" visually correct center through the barycenter of the pictogram's
 * alpha layer in x and y dimension.
 */
export class PictogramCenteringCorrector {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  getCorrectionOffset(image: HTMLImageElement, size: number): Coordinates {
    this.canvas.width = size;
    this.canvas.height = size;
    this.context.clearRect(0, 0, size, size);
    this.context.drawImage(image, 0, 0, size, size);
    const data = this.context.getImageData(0, 0, size, size).data;

    const alpha = new Uint8ClampedArray(data.length / 4);

    for (let i = 0; i < data.length; i++) {
      alpha[i] = data[i * 4 + 3];
    }

    let sumX = 0;
    let sumY = 0;
    let total = 0;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const a = alpha[y * size + x];

        total += a;
        sumX += a * x;
        sumY += a * y;
      }
    }

    const barycenterX = sumX / total;
    const barycenterY = sumY / total;

    return {
      x: barycenterX - size / 2,
      y: barycenterY - size / 2,
    };
  }
}

export class TextureManager extends EventEmitter {
  static NEW_TEXTURE_EVENT = "newTexture";

  private options: TextureManagerOptions;
  private canvas: HTMLCanvasElement = document.createElement("canvas");
  private ctx = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
  private frameId?: number;
  private corrector = new PictogramCenteringCorrector();

  private imageStates: Record<string, ImageType> = {};
  private texture: ImageData = this.ctx.getImageData(0, 0, 1, 1);
  private atlas: Atlas = {};

  constructor(options: Partial<TextureManagerOptions> = {}) {
    super();
    this.options = { ...DEFAULT_TEXTURE_MANAGER_OPTIONS, ...options };
  }

  private scheduleGenerateTexture() {
    if (typeof this.frameId === "number") return;

    this.frameId = window.setTimeout(() => {
      this.generateTexture();
      this.frameId = undefined;
    }, DEBOUNCE_TIMEOUT);
  }
  private generateTexture() {
    this.atlas = drawTexture(this.ctx, this.imageStates, this.corrector, this.options);
    this.texture = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.emit(TextureManager.NEW_TEXTURE_EVENT, { atlas: this.atlas, texture: this.texture });
  }

  // PUBLIC API:
  async registerImage(source: string) {
    if (this.imageStates[source]) return;

    this.imageStates[source] = { status: "loading" };

    try {
      const { size } = this.options;
      const image = await loadImage(source, { size: size.mode === "force" ? size.value : undefined });
      this.imageStates[source] = {
        status: "ready",
        image,
      };
      this.scheduleGenerateTexture();
    } catch (e) {
      this.imageStates[source] = {
        status: "error",
      };
    }
  }
  getAtlas(): Atlas {
    return this.atlas;
  }
  getTexture(): ImageData {
    return this.texture;
  }
}
