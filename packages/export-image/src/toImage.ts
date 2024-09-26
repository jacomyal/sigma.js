import Sigma from "sigma";

import { drawOnCanvas } from "./drawOnCanvas";
import { DEFAULT_TO_IMAGE_OPTIONS, ToImageOptions } from "./options";

/**
 * This function takes a Sigma instance, draws its layers on a canvas using `drawOnCanvas`, and returns a promise that
 * resolves to a blob of the expected image. Accepted formats are "image/png" and "image/jpeg".
 */
export async function toBlob(sigma: Sigma, opts: Partial<ToImageOptions> = {}): Promise<Blob> {
  const { format, ...options } = {
    ...DEFAULT_TO_IMAGE_OPTIONS,
    ...opts,
  };
  const canvas = await drawOnCanvas(sigma, options);

  // Save the canvas as a PNG image:
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error(`No actual blob was obtained by canvas.toBlob(..., "image/${format}")`));
      }
    }, `image/${format}`);
  });
}

/**
 * This function takes a Sigma instance, calls `toBlob`, and returns a File instance of the given blob.
 */
export async function toFile(sigma: Sigma, opts: Partial<ToImageOptions> = {}): Promise<File> {
  const { fileName, format } = {
    ...DEFAULT_TO_IMAGE_OPTIONS,
    ...opts,
  };

  const blob = await toBlob(sigma, opts);
  return new File([blob], `${fileName}.${format}`);
}
