/**
 * Downloads the SNAP datasets listed in datasets.mjs into public/data/, as
 * their original gzipped edge lists. Files already on disk are skipped, so
 * this is cheap to run before every dev/build.
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { rename, unlink } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

import { DATASETS } from "./datasets.mjs";

const DATA_DIR = fileURLToPath(new URL("../public/data", import.meta.url));
mkdirSync(DATA_DIR, { recursive: true });

for (const { file: fileName } of Object.values(DATASETS)) {
  const filePath = `${DATA_DIR}/${fileName}`;
  if (existsSync(filePath)) {
    console.log(`[datasets] ${fileName} already there, skipping`);
    continue;
  }

  const url = `https://snap.stanford.edu/data/${fileName}`;
  console.log(`[datasets] downloading ${url}`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Cannot fetch ${url} (HTTP ${res.status})`);

  // Download to a temp path first, so an interrupted run never leaves a
  // truncated file that a later run would mistake for a complete one:
  const tempPath = `${filePath}.part`;
  try {
    await pipeline(Readable.fromWeb(res.body), createWriteStream(tempPath));
    await rename(tempPath, filePath);
  } catch (error) {
    await unlink(tempPath).catch(() => {});
    throw error;
  }
}

console.log("[datasets] all datasets ready");
