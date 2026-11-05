import type { PDFDocument, PDFImage } from 'pdf-lib';
import { readFileBytesImmediately } from './fileReader';

export type DetectedImageFormat = 'png' | 'jpg' | 'webp' | 'gif' | 'bmp' | 'heic' | 'unknown';
export type ExpectedImageFormat = 'png' | 'jpg' | 'webp' | 'any';

export interface ImageInspection {
  format: DetectedImageFormat;
  label: string;
  mime: string;
  width?: number;
  height?: number;
}

export function inspectImageBytes(bytes: Uint8Array, fileName: string): ImageInspection {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 24 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    // Check IHDR chunk at bytes 12..15 ("IHDR")
    let width: number | undefined;
    let height: number | undefined;
    if (
      bytes[12] === 0x49 &&
      bytes[13] === 0x48 &&
      bytes[14] === 0x44 &&
      bytes[15] === 0x52
    ) {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      width = view.getUint32(16, false);
      height = view.getUint32(20, false);
      if (width === 0 || height === 0) {
        throw new Error(`Corrupted PNG file: "${fileName}" has invalid dimensions (0x0).`);
      }
    }
    return { format: 'png', label: 'PNG', mime: 'image/png', width, height };
  }

  // JPEG: FF D8 FF
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { format: 'jpg', label: 'JPEG', mime: 'image/jpeg' };
  }

  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { format: 'webp', label: 'WEBP', mime: 'image/webp' };
  }

  // GIF: "GIF87a" or "GIF89a"
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return { format: 'gif', label: 'GIF', mime: 'image/gif' };
  }

  // BMP: "BM"
  if (bytes.length >= 2 && bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return { format: 'bmp', label: 'BMP', mime: 'image/bmp' };
  }

  // ISO BMFF (HEIC / HEIF / AVIF): "ftyp" at offset 4
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]).toLowerCase();
    if (brand.includes('heic') || brand.includes('heix') || brand.includes('mif1') || brand.includes('msf1')) {
      return { format: 'heic', label: 'HEIC', mime: 'image/heic' };
    }
  }

  return { format: 'unknown', label: 'Unknown/Corrupt', mime: '' };
}

function validateExpectedFormat(
  inspection: ImageInspection,
  expected: ExpectedImageFormat,
  file: File
): void {
  const reportedMime = file.type ? ` (reported MIME: ${file.type})` : '';

  if (expected === 'png' && inspection.format !== 'png') {
    if (inspection.format !== 'unknown') {
      throw new Error(
        `Invalid PNG file: "${file.name}" is actually a ${inspection.label} image${reportedMime}, not a valid PNG. Please upload a genuine PNG file.`
      );
    }
    throw new Error(
      `Invalid or corrupted PNG file: "${file.name}" does not have a valid PNG file signature.`
    );
  }

  if (expected === 'jpg' && inspection.format !== 'jpg') {
    if (inspection.format !== 'unknown') {
      throw new Error(
        `Invalid JPG file: "${file.name}" is actually a ${inspection.label} image${reportedMime}, not a valid JPEG.`
      );
    }
    throw new Error(
      `Invalid or corrupted JPG file: "${file.name}" does not have a valid JPEG file signature.`
    );
  }

  if (expected === 'webp' && inspection.format !== 'webp') {
    if (inspection.format !== 'unknown') {
      throw new Error(
        `Invalid WEBP file: "${file.name}" is actually a ${inspection.label} image${reportedMime}, not a valid WEBP.`
      );
    }
    throw new Error(
      `Invalid or corrupted WEBP file: "${file.name}" does not have a valid WEBP file signature.`
    );
  }

  if (expected === 'any' && inspection.format === 'unknown') {
    throw new Error(
      `Unsupported or corrupted image: "${file.name}"${reportedMime} is not a recognized PNG, JPG, WEBP, GIF, or BMP file.`
    );
  }
}

async function decodeBlobToPngBytes(
  blob: Blob,
  fileName: string
): Promise<{ pngBytes: Uint8Array; width: number; height: number }> {
  const canvas = document.createElement('canvas');
  try {
    // 1. Primary path: createImageBitmap (works reliably on Android Chrome & preserves alpha)
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(blob);
        try {
          const width = bitmap.width;
          const height = bitmap.height;
          if (width === 0 || height === 0) {
            throw new Error(`Image "${fileName}" has zero dimensions.`);
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D context unavailable.');
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(bitmap, 0, 0);
          const outBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error(`Failed to encode "${fileName}" to PNG.`))),
              'image/png'
            );
          });
          return {
            pngBytes: new Uint8Array(await outBlob.arrayBuffer()),
            width,
            height,
          };
        } finally {
          bitmap.close();
        }
      } catch {
        // Fall through to HTMLImageElement fallback
      }
    }

    // 2. Fallback path: HTMLImageElement with ObjectURL, then DataURL
    const img = await loadHtmlImageFromBlob(blob, fileName);
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (width === 0 || height === 0) {
      throw new Error(`Image "${fileName}" has zero dimensions.`);
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    const outBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error(`Failed to encode "${fileName}" to PNG.`))),
        'image/png'
      );
    });
    return {
      pngBytes: new Uint8Array(await outBlob.arrayBuffer()),
      width,
      height,
    };
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

export async function loadHtmlImageFromBlob(blob: Blob, fileName: string): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`ObjectURL decode failed for "${fileName}"`));
      el.src = objectUrl;
    });
    if (typeof img.decode === 'function') {
      await img.decode().catch(() => {});
    }
    return img;
  } catch {
    // Secondary fallback: Data URL via FileReader (bypasses blob: restrictions in some WebViews)
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        typeof reader.result === 'string'
          ? resolve(reader.result)
          : reject(new Error(`Could not read "${fileName}".`));
      reader.onerror = () => reject(new Error(`Could not read "${fileName}".`));
      reader.readAsDataURL(blob);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () =>
        reject(new Error(`Could not decode image "${fileName}". The file may be corrupted or unsupported.`));
      el.src = dataUrl;
    });
    if (typeof img.decode === 'function') {
      await img.decode().catch(() => {});
    }
    return img;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function bytesToBlob(bytes: Uint8Array, mime: string): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: mime });
}

export async function embedImageFileInPdf(
  pdfDoc: PDFDocument,
  file: File,
  expectedFormat: ExpectedImageFormat = 'any'
): Promise<{ embedded: PDFImage; width: number; height: number }> {
  if (file.size === 0) {
    throw new Error(`"${file.name}" is empty (0 bytes).`);
  }

  // Read from in-memory cache (or immediately with FileReader fallback) so OS permission never expires
  const rawBytes = await readFileBytesImmediately(file);
  const inspection = inspectImageBytes(rawBytes, file.name);
  validateExpectedFormat(inspection, expectedFormat, file);

  // 1. Direct lossless PNG embedding (preserves full alpha transparency & avoids canvas RAM overhead)
  if (inspection.format === 'png') {
    try {
      const embedded = await pdfDoc.embedPng(rawBytes);
      return {
        embedded,
        width: embedded.width,
        height: embedded.height,
      };
    } catch {
      // Fallback for 16-bit, interlaced, or non-standard PNGs: decode via browser & re-encode 8-bit RGBA PNG
      const blob = bytesToBlob(rawBytes, 'image/png');
      const { pngBytes } = await decodeBlobToPngBytes(blob, file.name);
      const embedded = await pdfDoc.embedPng(pngBytes);
      return {
        embedded,
        width: embedded.width,
        height: embedded.height,
      };
    }
  }

  // 2. Direct lossless JPEG embedding
  if (inspection.format === 'jpg') {
    try {
      const embedded = await pdfDoc.embedJpg(rawBytes);
      return {
        embedded,
        width: embedded.width,
        height: embedded.height,
      };
    } catch {
      const blob = bytesToBlob(rawBytes, 'image/jpeg');
      const { pngBytes } = await decodeBlobToPngBytes(blob, file.name);
      const embedded = await pdfDoc.embedPng(pngBytes);
      return {
        embedded,
        width: embedded.width,
        height: embedded.height,
      };
    }
  }

  // 3. WEBP / GIF / BMP (and browser-supported HEIC): decode via createImageBitmap / Image -> transparent PNG -> embedPng
  const blob = bytesToBlob(rawBytes, inspection.mime || file.type || 'image/png');
  const { pngBytes } = await decodeBlobToPngBytes(blob, file.name);
  const embedded = await pdfDoc.embedPng(pngBytes);
  return {
    embedded,
    width: embedded.width,
    height: embedded.height,
  };
}
