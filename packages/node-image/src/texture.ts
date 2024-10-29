import { EventEmitter } from "events";
import { Coordinates } from "sigma/types";

/**
 * Useful types:
 * *************
 */
export type TextureCursor = Coordinates & { rowHeight: number; maxRowWidth: number };
export type ImageLoading = { status: "loading" };
export type ImageError = { status: "error" };
export type ImageReady = {
  status: "ready";
  image: HTMLImageElement;
  sourceX: number;
  sourceY: number;
  sourceSize: number;
  destinationSize: number;
  textureIndex?: number;
};
export type ImageType = ImageLoading | ImageError | ImageReady;

export type Atlas = Record<string, Coordinates & { size: number; textureIndex?: number }>;

export type TextureManagerOptions = {
  // - If mode "auto", will always display images with their given size.
  // - If mode "force", will always scale images to the given value.
  // - If mode "max", will downscale images larger than the given value.
  size: { mode: "auto" } | { mode: "max"; value: number } | { mode: "force"; value: number };
  // Tries to mimic the related CSS property.
  objectFit: "contain" | "cover" | "fill";
  // If true, the image is centered on its alpha barycenter.
  correctCentering: boolean;
  // Max texture size (use gl.getParameter(gl.MAX_TEXTURE_SIZE)).
  maxTextureSize: number;
  // Minimal time (in ms) between two consecutive textures generations.
  // If null, then no timeout will be used (for debug purpose only!).
  debounceTimeout: number | null;
  // "crossOrigin" attribute used to request the image.
  // By default, this is set to "anonymous".
  // Setting this to `null` will cause the image to be fetched without CORS.
  crossOrigin: CrossOrigin | null;
};

type CrossOrigin = "anonymous" | "use-credentials";

export const DEFAULT_TEXTURE_MANAGER_OPTIONS: TextureManagerOptions = {
  size: { mode: "max", value: 512 },
  objectFit: "cover",
  correctCentering: false,
  maxTextureSize: 4096,
  debounceTimeout: 500,
  crossOrigin: "anonymous",
};

// This margin helps to avoid images collisions in the texture:
export const MARGIN_IN_TEXTURE = 1;

/**
 * Helpers:
 * ********
 */
/**
 * This helper loads an image at a given URL, and returns an HTMLImageElement
 * with it displayed once it's properly loaded, within a promise.
 */
export function loadRasterImage(
  imageSource: string,
  { crossOrigin }: { crossOrigin?: CrossOrigin } = {},
): Promise<HTMLImageElement> {
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
    if (crossOrigin) {
      image.setAttribute("crossOrigin", crossOrigin);
    }
    image.src = imageSource;
  });
}

/**
 * This helper loads an SVG image at a given URL, adjusts its size to a given
 * size, and returns an HTMLImageElement with it displayed once it's properly
 * loaded, within a promise.
 */
export async function loadSVGImage(
  imageSource: string,
  { size, crossOrigin }: { size?: number; crossOrigin?: CrossOrigin } = {},
): Promise<HTMLImageElement> {
  let resp: Response;
  if (crossOrigin === "use-credentials") {
    resp = await fetch(imageSource, { credentials: "include" });
  } else {
    resp = await fetch(imageSource);
  }
  const svgString = await resp.text();
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");

  const root = svg.documentElement;

  const originalWidth = root.getAttribute("width");
  const originalHeight = root.getAttribute("height");

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
export async function loadImage(
  imageSource: string,
  { size, crossOrigin }: { size?: number; crossOrigin?: CrossOrigin } = {},
): Promise<HTMLImageElement> {
  const isSVG = imageSource.split(/[#?]/)[0].split(".").pop()?.trim().toLowerCase() === "svg";

  let image: HTMLImageElement;
  if (isSVG && size) {
    try {
      image = await loadSVGImage(imageSource, { size, crossOrigin });
    } catch (_e) {
      image = await loadRasterImage(imageSource, { crossOrigin });
    }
  } else {
    image = await loadRasterImage(imageSource, { crossOrigin });
  }

  return image;
}

/**
 * This helper computes exact coordinates to draw an image onto a texture.
 */
export function refineImage(
  image: HTMLImageElement,
  corrector: PictogramCenteringCorrector,
  { objectFit, size, correctCentering }: TextureManagerOptions,
): Omit<ImageReady, "status" | "image" | "textureIndex"> {
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

  return {
    sourceX,
    sourceY,
    sourceSize,
    destinationSize,
  };
}

/**
 * This helper takes an array of ready-to-draw images, and draws as much as possible in a single texture.
 * It then returns the atlas of the draw images, as well as the texture itself.
 */
export function drawTexture(
  images: (Omit<ImageReady, "status"> & { key: string })[],
  ctx: CanvasRenderingContext2D,
  cursor: TextureCursor,
): { atlas: Atlas; texture: ImageData; cursor: TextureCursor } {
  const { width, height } = ctx.canvas;

  // Refine images coordinates:
  const refinedImagesArray: ((typeof images)[number] & { key: string } & {
    destinationX: number;
    destinationY: number;
  })[] = [];
  let { x, y, rowHeight, maxRowWidth } = cursor;
  const atlas: Atlas = {};
  for (let i = 0, l = images.length; i < l; i++) {
    const { key, image, sourceSize, sourceX, sourceY, destinationSize } = images[i];
    const destinationSizeWithMargin = destinationSize + MARGIN_IN_TEXTURE;

    // If the image does not fit, just skip it:
    if (
      y + destinationSizeWithMargin > height ||
      (x + destinationSizeWithMargin > width && y + destinationSizeWithMargin + rowHeight > height)
    ) {
      continue;
    }

    if (x + destinationSizeWithMargin > width) {
      maxRowWidth = Math.max(maxRowWidth, x);
      x = 0;
      y += rowHeight;
      rowHeight = destinationSizeWithMargin;
    }

    refinedImagesArray.push({
      key,
      image,
      sourceX,
      sourceY,
      sourceSize,
      destinationX: x,
      destinationY: y,
      destinationSize,
    });
    atlas[key] = {
      x,
      y,
      size: destinationSize,
    };
    x += destinationSizeWithMargin;
    rowHeight = Math.max(rowHeight, destinationSizeWithMargin);
  }

  // Crop texture to final best dimensions:
  maxRowWidth = Math.max(maxRowWidth, x);
  const effectiveWidth = maxRowWidth;
  const effectiveHeight = y + rowHeight;

  // Fill texture:
  for (let i = 0, l = refinedImagesArray.length; i < l; i++) {
    const { image, sourceSize, sourceX, sourceY, destinationSize, destinationX, destinationY } = refinedImagesArray[i];

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      destinationX,
      destinationY,
      destinationSize,
      destinationSize,
    );
  }

  return {
    atlas,
    texture: ctx.getImageData(0, 0, effectiveWidth, effectiveHeight),
    cursor: { x, y, rowHeight, maxRowWidth },
  };
}

/**
 * This helper takes a collection of image states and a context, draw all the
 * images in the context, and returns an atlas to get where each image is drawn
 * on the texture.
 */
export function drawTextures(
  {
    atlas: prevAtlas,
    textures: prevTextures,
    cursor: prevCursor,
  }: { atlas: Atlas; textures: ImageData[]; cursor: TextureCursor },
  images: Record<string, ImageType>,
  ctx: CanvasRenderingContext2D,
): { atlas: Atlas; textures: ImageData[]; cursor: TextureCursor } {
  const res = {
    atlas: { ...prevAtlas },
    textures: [...prevTextures.slice(0, -1)],
    cursor: { ...prevCursor },
  };

  // Extract images that are ready to draw, but not drawn yet:
  let imagesToDraw: (Omit<ImageReady, "status"> & { key: string })[] = [];
  for (const key in images) {
    // Skip images that are not ready yet:
    const imageState = images[key];
    if (imageState.status !== "ready") continue;

    // Skip all images that already exist in a texture:
    const textureIndex = prevAtlas[key]?.textureIndex;
    if (typeof textureIndex === "number") continue;

    // Keep all the rest:
    imagesToDraw.push({
      key,
      ...imageState,
    });
  }

  // Draw remaining images on new textures until there are none remaining:
  while (imagesToDraw.length) {
    const { atlas, texture, cursor } = drawTexture(imagesToDraw, ctx, res.cursor);
    res.cursor = cursor;

    const remainingImages: typeof imagesToDraw = [];
    imagesToDraw.forEach((image) => {
      if (atlas[image.key]) {
        res.atlas[image.key] = {
          ...atlas[image.key],
          textureIndex: res.textures.length,
        };
      } else {
        remainingImages.push(image);
      }
    });
    res.textures.push(texture);
    imagesToDraw = remainingImages;

    if (imagesToDraw.length) {
      res.cursor = { x: 0, y: 0, rowHeight: 0, maxRowWidth: 0 };
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }

  return res;
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
    this.context = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
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
  private textures: ImageData[] = [this.ctx.getImageData(0, 0, 1, 1)];
  private lastTextureCursor: TextureCursor = { x: 0, y: 0, rowHeight: 0, maxRowWidth: 0 };
  private atlas: Atlas = {};

  constructor(options: Partial<TextureManagerOptions> = {}) {
    super();
    this.options = { ...DEFAULT_TEXTURE_MANAGER_OPTIONS, ...options };
    this.canvas.width = this.options.maxTextureSize;
    this.canvas.height = this.options.maxTextureSize;
  }

  private scheduleGenerateTexture() {
    if (typeof this.frameId === "number") return;

    if (typeof this.options.debounceTimeout === "number") {
      this.frameId = window.setTimeout(() => {
        this.generateTextures();
        this.frameId = undefined;
      }, this.options.debounceTimeout);
    } else {
      this.generateTextures();
    }
  }
  private generateTextures() {
    const { atlas, textures, cursor } = drawTextures(
      { atlas: this.atlas, textures: this.textures, cursor: this.lastTextureCursor },
      this.imageStates,
      this.ctx,
    );

    this.atlas = atlas;
    this.textures = textures;
    this.lastTextureCursor = cursor;

    this.emit(TextureManager.NEW_TEXTURE_EVENT, { atlas, textures });
  }

  // PUBLIC API:
  async registerImage(source: string) {
    if (this.imageStates[source]) return;

    this.imageStates[source] = { status: "loading" };

    try {
      const { size } = this.options;
      const image = await loadImage(source, {
        size: size.mode === "force" ? size.value : undefined,
        crossOrigin: this.options.crossOrigin || undefined,
      });
      this.imageStates[source] = {
        status: "ready",
        image,
        ...refineImage(image, this.corrector, this.options),
      };
      this.scheduleGenerateTexture();
    } catch (_e) {
      this.imageStates[source] = {
        status: "error",
      };
    }
  }
  getAtlas(): Atlas {
    return this.atlas;
  }
  getTextures(): ImageData[] {
    return this.textures;
  }
}
