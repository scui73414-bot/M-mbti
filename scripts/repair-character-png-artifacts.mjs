import { deflateSync, inflateSync } from "node:zlib";
import {
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = dirname(SCRIPT_DIR);
const ASSET_DIR = join(
  PROJECT_DIR,
  "public/characters/destiny-card/characters",
);
const CHECK_ONLY = process.argv.includes("--check");
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

/**
 * These two source PNGs contain a detached fragment above the real character.
 * The shift recentres the surviving character without changing the 4:5 canvas.
 */
const DETACHED_FRAGMENT_REPAIRS = new Map([
  [
    "mg-23.png",
    {
      expectedBand: [184, 207],
      clearThrough: 224,
      shiftUp: 68,
    },
  ],
  [
    "mg-81.png",
    {
      expectedBand: [141, 159],
      clearThrough: 170,
      shiftUp: 26,
    },
  ],
]);

function paethPredictor(left, up, upperLeft) {
  const prediction = left + up - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const upDistance = Math.abs(prediction - up);
  const upperLeftDistance = Math.abs(prediction - upperLeft);

  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) {
    return left;
  }

  return upDistance <= upperLeftDistance ? up : upperLeft;
}

function parsePng(filePath) {
  const source = readFileSync(filePath);

  if (!source.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`${basename(filePath)} is not a PNG file.`);
  }

  const chunks = [];
  const idatParts = [];
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlaceMethod = 0;
  let offset = PNG_SIGNATURE.length;

  while (offset < source.length) {
    const length = source.readUInt32BE(offset);
    const type = source.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const chunkEnd = dataEnd + 4;
    const data = source.subarray(dataStart, dataEnd);

    chunks.push({
      type,
      raw: source.subarray(offset, chunkEnd),
    });

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlaceMethod = data[12];
    } else if (type === "IDAT") {
      idatParts.push(data);
    }

    offset = chunkEnd;

    if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || colorType !== 6 || interlaceMethod !== 0) {
    throw new Error(
      `${basename(filePath)} must be an 8-bit, non-interlaced RGBA PNG.`,
    );
  }

  return {
    chunks,
    height,
    pixels: decodePixels(width, height, Buffer.concat(idatParts)),
    width,
  };
}

function decodePixels(width, height, compressedData) {
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(compressedData);
  const expectedLength = height * (stride + 1);

  if (inflated.length !== expectedLength) {
    throw new Error(
      `Unexpected PNG payload size: ${inflated.length}; expected ${expectedLength}.`,
    );
  }

  const pixels = Buffer.alloc(stride * height);
  let sourceOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filterType = inflated[sourceOffset];
    sourceOffset += 1;
    const rowOffset = y * stride;

    for (let x = 0; x < stride; x += 1) {
      const encoded = inflated[sourceOffset];
      sourceOffset += 1;
      const left =
        x >= bytesPerPixel ? pixels[rowOffset + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[rowOffset + x - stride] : 0;
      const upperLeft =
        y > 0 && x >= bytesPerPixel
          ? pixels[rowOffset + x - stride - bytesPerPixel]
          : 0;
      let predictor = 0;

      switch (filterType) {
        case 0:
          predictor = 0;
          break;
        case 1:
          predictor = left;
          break;
        case 2:
          predictor = up;
          break;
        case 3:
          predictor = Math.floor((left + up) / 2);
          break;
        case 4:
          predictor = paethPredictor(left, up, upperLeft);
          break;
        default:
          throw new Error(`Unsupported PNG filter type: ${filterType}.`);
      }

      pixels[rowOffset + x] = (encoded + predictor) & 0xff;
    }
  }

  return pixels;
}

function findGhostBands(width, height, pixels) {
  const bands = [];
  let start = -1;

  for (let y = 0; y < height; y += 1) {
    let ghostWhitePixels = 0;

    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      const alpha = pixels[offset + 3];

      if (
        red > 238 &&
        green > 238 &&
        blue > 238 &&
        alpha < 24
      ) {
        ghostWhitePixels += 1;
      }
    }

    const isGhostBand = ghostWhitePixels > width * 0.5;

    if (isGhostBand && start < 0) {
      start = y;
    } else if (!isGhostBand && start >= 0) {
      if (y - start >= 2) {
        bands.push([start, y - 1]);
      }
      start = -1;
    }
  }

  if (start >= 0 && height - start >= 2) {
    bands.push([start, height - 1]);
  }

  return bands;
}

function clearGhostBands(width, height, pixels, bands) {
  let changedPixels = 0;

  for (const [start, end] of bands) {
    const clearStart = Math.max(0, start - 2);
    const clearEnd = Math.min(height - 1, end + 2);

    for (let y = clearStart; y <= clearEnd; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (y * width + x) * 4;
        const alpha = pixels[offset + 3];

        if (alpha < 32) {
          if (
            pixels[offset] !== 0 ||
            pixels[offset + 1] !== 0 ||
            pixels[offset + 2] !== 0 ||
            alpha !== 0
          ) {
            changedPixels += 1;
          }

          pixels.fill(0, offset, offset + 4);
        }
      }
    }
  }

  return changedPixels;
}

function overlapsBand([start, end], [expectedStart, expectedEnd]) {
  return start <= expectedEnd && end >= expectedStart;
}

function repairDetachedFragment(
  filename,
  width,
  height,
  pixels,
  bands,
) {
  const repair = DETACHED_FRAGMENT_REPAIRS.get(filename);

  if (
    !repair ||
    !bands.some((band) => overlapsBand(band, repair.expectedBand))
  ) {
    return 0;
  }

  const stride = width * 4;
  let changedPixels = 0;

  for (let y = 0; y <= repair.clearThrough; y += 1) {
    const rowOffset = y * stride;

    for (let x = 0; x < width; x += 1) {
      const offset = rowOffset + x * 4;

      if (
        pixels[offset] !== 0 ||
        pixels[offset + 1] !== 0 ||
        pixels[offset + 2] !== 0 ||
        pixels[offset + 3] !== 0
      ) {
        changedPixels += 1;
      }
    }

    pixels.fill(0, rowOffset, rowOffset + stride);
  }

  const shifted = Buffer.alloc(pixels.length);
  const sourceStart = repair.shiftUp * stride;
  pixels.copy(shifted, 0, sourceStart);
  shifted.copy(pixels);

  return changedPixels;
}

function signedByteScore(value) {
  return value < 128 ? value : 256 - value;
}

function filterRow(row, previousRow) {
  const bytesPerPixel = 4;
  let bestType = 0;
  let bestData = Buffer.from(row);
  let bestScore = Number.POSITIVE_INFINITY;

  for (let filterType = 0; filterType <= 4; filterType += 1) {
    const filtered = Buffer.alloc(row.length);
    let score = 0;

    for (let x = 0; x < row.length; x += 1) {
      const value = row[x];
      const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0;
      const up = previousRow ? previousRow[x] : 0;
      const upperLeft =
        previousRow && x >= bytesPerPixel
          ? previousRow[x - bytesPerPixel]
          : 0;
      let predictor = 0;

      switch (filterType) {
        case 0:
          predictor = 0;
          break;
        case 1:
          predictor = left;
          break;
        case 2:
          predictor = up;
          break;
        case 3:
          predictor = Math.floor((left + up) / 2);
          break;
        case 4:
          predictor = paethPredictor(left, up, upperLeft);
          break;
      }

      const encoded = (value - predictor + 256) & 0xff;
      filtered[x] = encoded;
      score += signedByteScore(encoded);
    }

    if (score < bestScore) {
      bestType = filterType;
      bestData = filtered;
      bestScore = score;
    }
  }

  return { data: bestData, type: bestType };
}

function encodePixels(width, height, pixels) {
  const stride = width * 4;
  const scanlines = Buffer.alloc(height * (stride + 1));

  for (let y = 0; y < height; y += 1) {
    const row = pixels.subarray(y * stride, (y + 1) * stride);
    const previousRow =
      y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : undefined;
    const filtered = filterRow(row, previousRow);
    const targetOffset = y * (stride + 1);

    scanlines[targetOffset] = filtered.type;
    filtered.data.copy(scanlines, targetOffset + 1);
  }

  return deflateSync(scanlines, { level: 9 });
}

const CRC_TABLE = Array.from({ length: 256 }, (_, tableIndex) => {
  let value = tableIndex;

  for (let bit = 0; bit < 8; bit += 1) {
    value =
      value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.alloc(data.length + 12);

  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(
    crc32(Buffer.concat([typeBuffer, data])),
    data.length + 8,
  );

  return chunk;
}

function rebuildPng(chunks, compressedData) {
  const outputChunks = [PNG_SIGNATURE];
  let wroteIdat = false;

  for (const chunk of chunks) {
    if (chunk.type === "IDAT") {
      if (!wroteIdat) {
        outputChunks.push(createChunk("IDAT", compressedData));
        wroteIdat = true;
      }
      continue;
    }

    outputChunks.push(chunk.raw);
  }

  return Buffer.concat(outputChunks);
}

function repairFile(filePath) {
  const filename = basename(filePath);
  const png = parsePng(filePath);
  const ghostBands = findGhostBands(
    png.width,
    png.height,
    png.pixels,
  );
  const bandChanges = clearGhostBands(
    png.width,
    png.height,
    png.pixels,
    ghostBands,
  );
  const fragmentChanges = repairDetachedFragment(
    filename,
    png.width,
    png.height,
    png.pixels,
    ghostBands,
  );
  const changedPixels = fragmentChanges + bandChanges;

  if (changedPixels === 0) {
    return undefined;
  }

  if (!CHECK_ONLY) {
    const compressedData = encodePixels(
      png.width,
      png.height,
      png.pixels,
    );
    const repairedPng = rebuildPng(png.chunks, compressedData);
    const temporaryPath = `${filePath}.repairing`;

    writeFileSync(temporaryPath, repairedPng);
    renameSync(temporaryPath, filePath);
  }

  return {
    changedPixels,
    filename,
    ghostBands,
  };
}

const files = readdirSync(ASSET_DIR)
  .filter((filename) => /^mg-\d{2}\.png$/.test(filename))
  .sort();
const repaired = files
  .map((filename) => repairFile(join(ASSET_DIR, filename)))
  .filter(Boolean);

if (repaired.length === 0) {
  console.log(`Character PNG check passed (${files.length} files).`);
  process.exit(0);
}

for (const item of repaired) {
  const bands = item.ghostBands
    .map(([start, end]) => `${start}-${end}`)
    .join(", ");
  console.log(
    `${CHECK_ONLY ? "needs repair" : "repaired"} ${item.filename}: ` +
      `bands ${bands}; ${item.changedPixels} pixels`,
  );
}

if (CHECK_ONLY) {
  process.exitCode = 1;
} else {
  console.log(`Repaired ${repaired.length} of ${files.length} character PNGs.`);
}
