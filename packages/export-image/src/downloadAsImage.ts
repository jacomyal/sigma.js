import FileSaver from "file-saver";
import Sigma from "sigma";

import { DEFAULT_TO_IMAGE_OPTIONS, ToImageOptions } from "./options";
import { toBlob } from "./toImage";

/**
 * This function takes a Sigma instance, draws its layers on a canvas using `drawOnCanvas`, and then downloads a local
 * image file from the canvas. Accepted formats are "image/png" and "image/jpeg".
 */
export async function downloadAsImage(sigma: Sigma, opts: Partial<ToImageOptions> = {}): Promise<void> {
  const { fileName, format } = {
    ...DEFAULT_TO_IMAGE_OPTIONS,
    ...opts,
  };

  const blob = await toBlob(sigma, opts);
  FileSaver.saveAs(blob, `${fileName}.${format}`);
}

/**
 * This function is just some sugar around `downloadAsImage`, with forced PNG format.
 */
export function downloadAsPNG(sigma: Sigma, opts: Partial<Omit<ToImageOptions, "format">> = {}): Promise<void> {
  return downloadAsImage(sigma, { ...opts, format: "png" });
}

/**
 * This function is just some sugar around `downloadAsImage`, with forced JPEG format.
 */
export function downloadAsJPEG(sigma: Sigma, opts: Partial<Omit<ToImageOptions, "format">> = {}): Promise<void> {
  return downloadAsImage(sigma, { ...opts, format: "jpeg" });
}
