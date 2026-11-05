import React, { useState, useEffect } from 'react';
import {
  Download,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { FileDropzone } from '../components/FileDropzone';
import { downloadBlob, formatBytes, toPdfBlob } from '../utils/download';
import { embedImageFileInPdf, loadHtmlImageFromBlob } from '../utils/imagePdf';
import { readFileBytesImmediately } from '../utils/fileReader';

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function digitsOnly(raw: string): string {
  return raw.replace(/[^0-9]/g, '');
}

async function loadImageElement(file: File): Promise<{
  img: HTMLImageElement;
  url: string;
}> {
  if (file.size === 0) {
    throw new Error(`"${file.name}" is empty (0 bytes).`);
  }
  const bytes = await readFileBytesImmediately(file);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: file.type || 'image/png' });
  const img = await loadHtmlImageFromBlob(blob, file.name);
  const url = URL.createObjectURL(blob);
  return { img, url };
}

export const ImageTools: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [output, setOutput] = useState<{
    blob: Blob;
    url: string;
    filename: string;
    summary: string;
  } | null>(null);

  const [quality, setQuality] = useState<number>(0.8);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>(
    toolId === 'jpg-to-png'
      ? 'image/png'
      : toolId === 'png-to-jpg'
      ? 'image/jpeg'
      : 'image/webp'
  );
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  // Resizer string states (so mobile users can backspace freely)
  const [widthInput, setWidthInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>('');
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  // Cropper string states
  const [cropXInput, setCropXInput] = useState<string>('0');
  const [cropYInput, setCropYInput] = useState<string>('0');
  const [cropWInput, setCropWInput] = useState<string>('');
  const [cropHInput, setCropHInput] = useState<string>('');

  // Rotator
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Multi-image checker
  const [multiInfo, setMultiInfo] = useState<
    { name: string; size: number; type: string; w: number; h: number }[]
  >([]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (output?.url) URL.revokeObjectURL(output.url);
    };
  }, [previewUrl, output]);

  const clearOutput = () => {
    setError(null);
    if (output?.url) URL.revokeObjectURL(output.url);
    setOutput(null);
  };

  const handleFilesChange = async (newFiles: File[]) => {
    clearOutput();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFiles(newFiles);
    setMultiInfo([]);

    if (newFiles.length === 0) {
      setNaturalSize({ w: 0, h: 0 });
      setWidthInput('');
      setHeightInput('');
      return;
    }

    try {
      if (toolId === 'image-file-size-checker') {
        const infos = await Promise.all(
          newFiles.map(async (f) => {
            const { img, url } = await loadImageElement(f);
            const info = {
              name: f.name,
              size: f.size,
              type: f.type || 'image',
              w: img.naturalWidth,
              h: img.naturalHeight,
            };
            URL.revokeObjectURL(url);
            return info;
          })
        );
        setMultiInfo(infos);
        return;
      }

      const { img, url } = await loadImageElement(newFiles[0]);
      setPreviewUrl(url);
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setWidthInput(String(img.naturalWidth));
      setHeightInput(String(img.naturalHeight));
      setCropXInput('0');
      setCropYInput('0');
      setCropWInput(String(img.naturalWidth));
      setCropHInput(String(img.naturalHeight));
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image.');
    }
  };

  const getExtension = (mime: string) =>
    mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';

  const processSingleImage = async (
    mime: 'image/jpeg' | 'image/png' | 'image/webp',
    q: number,
    customDraw?: (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement
    ) => void
  ) => {
    if (files.length === 0) {
      setError('Please upload an image first.');
      return;
    }
    setProcessing(true);
    clearOutput();
    await new Promise((r) => setTimeout(r, 0));
    try {
      const { img, url } = await loadImageElement(files[0]);
      const canvas = document.createElement('canvas');
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context unavailable.');

        if (customDraw) {
          customDraw(ctx, img, canvas);
        } else {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          if (mime === 'image/jpeg') {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
        }

        const outW = canvas.width;
        const outH = canvas.height;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Failed to encode output image.'))),
            mime,
            mime === 'image/png' ? undefined : q
          );
        });

        const outUrl = URL.createObjectURL(blob);
        const baseName = files[0].name.replace(/\.[^.]+$/, '');
        const ext = getExtension(mime);
        const origSize = files[0].size;
        const diffPct = Math.round(((origSize - blob.size) / origSize) * 100);

        setOutput({
          blob,
          url: outUrl,
          filename: `${baseName}.${ext}`,
          summary: `Original: ${formatBytes(origSize)} → Output: ${formatBytes(blob.size)} (${
            diffPct >= 0 ? `${diffPct}% smaller` : `${Math.abs(diffPct)}% larger`
          }) · ${outW}×${outH}px`,
        });
      } finally {
        canvas.width = 0;
        canvas.height = 0;
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  const runBatchCompress = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    setProcessing(true);
    clearOutput();
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      let totalOrig = 0;
      let totalNew = 0;

      for (const file of files) {
        totalOrig += file.size;
        const { img, url } = await loadImageElement(file);
        const canvas = document.createElement('canvas');
        try {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas unavailable.');
          if (targetFormat === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const blob = await new Promise<Blob>((res, rej) =>
            canvas.toBlob(
              (b) => (b ? res(b) : rej(new Error('Compression failed'))),
              targetFormat,
              quality
            )
          );
          totalNew += blob.size;
          const base = file.name.replace(/\.[^.]+$/, '');
          zip.file(`${base}.${getExtension(targetFormat)}`, blob);
        } finally {
          canvas.width = 0;
          canvas.height = 0;
          URL.revokeObjectURL(url);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const savedPct = Math.max(0, Math.round(((totalOrig - totalNew) / totalOrig) * 100));
      setOutput({
        blob: zipBlob,
        url: URL.createObjectURL(zipBlob),
        filename: 'zenvi-compressed-images.zip',
        summary: `Compressed ${files.length} images: ${formatBytes(totalOrig)} → ${formatBytes(totalNew)} (${savedPct}% saved)`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch compression failed.');
    } finally {
      setProcessing(false);
    }
  };

  const runImageToPdf = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    setProcessing(true);
    clearOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const { embedded, width, height } = await embedImageFileInPdf(pdf, file, 'any');
        const page = pdf.addPage([width, height]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }
      const bytes = await pdf.save();
      const blob = toPdfBlob(bytes);
      const outName =
        files.length === 1
          ? `${files[0].name.replace(/\.[^.]+$/, '') || 'zenvi-image'}.pdf`
          : 'zenvi-image.pdf';
      setOutput({
        blob,
        url: URL.createObjectURL(blob),
        filename: outName,
        summary: `Created ${files.length}-page PDF (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert image to PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const isMultiple =
    toolId === 'multiple-images-compressor' ||
    toolId === 'image-to-pdf' ||
    toolId === 'image-file-size-checker';

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/*"
        multiple={isMultiple}
        files={files}
        onFilesChange={handleFilesChange}
        helperText="Supports JPG, PNG, WEBP, GIF · Processed locally in your browser"
      />

      {/* DIMENSION CHECKER */}
      {toolId === 'image-dimension-checker' && naturalSize.w > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7]">
          <div>
            <p className="text-xs text-[#5B4D7A]">Width</p>
            <p className="text-lg font-bold font-mono-tabular text-[#38205F]">
              {naturalSize.w} px
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5B4D7A]">Height</p>
            <p className="text-lg font-bold font-mono-tabular text-[#38205F]">
              {naturalSize.h} px
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5B4D7A]">Aspect Ratio</p>
            <p className="text-lg font-bold font-mono-tabular text-[#7045C6]">
              {naturalSize.w / gcd(naturalSize.w, naturalSize.h)} :{' '}
              {naturalSize.h / gcd(naturalSize.w, naturalSize.h)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5B4D7A]">Megapixels</p>
            <p className="text-lg font-bold font-mono-tabular text-[#38205F]">
              {((naturalSize.w * naturalSize.h) / 1_000_000).toFixed(2)} MP
            </p>
          </div>
        </div>
      )}

      {/* FILE SIZE CHECKER */}
      {toolId === 'image-file-size-checker' && multiInfo.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[#E4D9FA]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F3FF] text-xs font-semibold text-[#38205F]">
              <tr>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">Size (KB / MB)</th>
                <th className="px-4 py-3">Exact Bytes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8FF] bg-white font-mono-tabular">
              {multiInfo.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2.5 font-sans font-medium text-[#38205F]">
                    {item.name}
                  </td>
                  <td className="px-4 py-2.5">
                    {item.w} × {item.h} px
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-[#7045C6]">
                    {formatBytes(item.size)}
                  </td>
                  <td className="px-4 py-2.5 text-[#5B4D7A]">
                    {item.size.toLocaleString()} B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* COMPRESSOR / FORMAT CONVERTER CONTROLS */}
      {(toolId === 'image-compressor' ||
        toolId === 'multiple-images-compressor' ||
        toolId === 'webp-converter' ||
        toolId === 'png-to-jpg' ||
        toolId === 'png-to-webp' ||
        toolId === 'jpg-to-webp') &&
        files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
            {(toolId === 'image-compressor' ||
              toolId === 'multiple-images-compressor' ||
              toolId === 'webp-converter') && (
              <div>
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Output Format
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) =>
                    setTargetFormat(
                      e.target.value as 'image/jpeg' | 'image/png' | 'image/webp'
                    )
                  }
                  className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm"
                >
                  <option value="image/webp">WEBP (Smallest size)</option>
                  <option value="image/jpeg">JPG (Universal compatibility)</option>
                  <option value="image/png">PNG (Lossless)</option>
                </select>
              </div>
            )}

            {toolId === 'png-to-jpg' && (
              <div>
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Transparent Background Fill
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-20 rounded-lg border border-[#D6C6F7] cursor-pointer"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#7045C6]"
              />
            </div>
          </div>
        )}

      {/* RESIZER CONTROLS */}
      {toolId === 'image-resizer' && naturalSize.w > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Width (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={widthInput}
                onChange={(e) => {
                  const clean = digitsOnly(e.target.value);
                  setWidthInput(clean);
                  const w = parseInt(clean, 10);
                  if (lockAspect && !isNaN(w) && w > 0 && naturalSize.w > 0) {
                    setHeightInput(
                      String(Math.max(1, Math.round((w * naturalSize.h) / naturalSize.w)))
                    );
                  }
                }}
                placeholder={String(naturalSize.w)}
                className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Height (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={heightInput}
                onChange={(e) => {
                  const clean = digitsOnly(e.target.value);
                  setHeightInput(clean);
                  const h = parseInt(clean, 10);
                  if (lockAspect && !isNaN(h) && h > 0 && naturalSize.h > 0) {
                    setWidthInput(
                      String(Math.max(1, Math.round((h * naturalSize.w) / naturalSize.h)))
                    );
                  }
                }}
                placeholder={String(naturalSize.h)}
                className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm font-mono-tabular"
              />
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#38205F] cursor-pointer">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              className="w-4 h-4 accent-[#7045C6]"
            />
            <span>
              Lock Aspect Ratio ({naturalSize.w}×{naturalSize.h})
            </span>
          </label>
        </div>
      )}

      {/* CROPPER CONTROLS */}
      {toolId === 'image-cropper' && naturalSize.w > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Full Image', ratio: 0 },
              { label: '1:1 Square', ratio: 1 },
              { label: '16:9 Widescreen', ratio: 16 / 9 },
              { label: '4:3 Standard', ratio: 4 / 3 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  if (preset.ratio === 0) {
                    setCropXInput('0');
                    setCropYInput('0');
                    setCropWInput(String(naturalSize.w));
                    setCropHInput(String(naturalSize.h));
                  } else {
                    let w = naturalSize.w;
                    let h = Math.round(w / preset.ratio);
                    if (h > naturalSize.h) {
                      h = naturalSize.h;
                      w = Math.round(h * preset.ratio);
                    }
                    setCropWInput(String(w));
                    setCropHInput(String(h));
                    setCropXInput(String(Math.floor((naturalSize.w - w) / 2)));
                    setCropYInput(String(Math.floor((naturalSize.h - h) / 2)));
                  }
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-[#D6C6F7] text-[#38205F] hover:border-[#7045C6] cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5B4D7A] mb-1">
                X Offset (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cropXInput}
                onChange={(e) => setCropXInput(digitsOnly(e.target.value))}
                className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-2.5 py-1.5 text-base sm:text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5B4D7A] mb-1">
                Y Offset (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cropYInput}
                onChange={(e) => setCropYInput(digitsOnly(e.target.value))}
                className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-2.5 py-1.5 text-base sm:text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5B4D7A] mb-1">
                Crop Width (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cropWInput}
                onChange={(e) => setCropWInput(digitsOnly(e.target.value))}
                className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-2.5 py-1.5 text-base sm:text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5B4D7A] mb-1">
                Crop Height (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cropHInput}
                onChange={(e) => setCropHInput(digitsOnly(e.target.value))}
                className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-2.5 py-1.5 text-base sm:text-sm font-mono-tabular"
              />
            </div>
          </div>
        </div>
      )}

      {/* ROTATOR CONTROLS */}
      {toolId === 'image-rotator' && naturalSize.w > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 270) % 360)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-white border border-[#D6C6F7] text-[#38205F] hover:border-[#7045C6] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Rotate Left 90°
          </button>
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-white border border-[#D6C6F7] text-[#38205F] hover:border-[#7045C6] cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotate Right 90°
          </button>
          <button
            type="button"
            onClick={() => setFlipH((f) => !f)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
              flipH
                ? 'bg-[#7045C6] text-white border-[#7045C6]'
                : 'bg-white text-[#38205F] border-[#D6C6F7]'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" /> Flip Horizontal
          </button>
          <button
            type="button"
            onClick={() => setFlipV((f) => !f)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
              flipV
                ? 'bg-[#7045C6] text-white border-[#7045C6]'
                : 'bg-white text-[#38205F] border-[#D6C6F7]'
            }`}
          >
            <FlipVertical className="w-3.5 h-3.5" /> Flip Vertical
          </button>
        </div>
      )}

      {/* ACTION BUTTON */}
      {toolId !== 'image-dimension-checker' &&
        toolId !== 'image-file-size-checker' && (
          <button
            type="button"
            disabled={processing || files.length === 0}
            onClick={() => {
              if (toolId === 'multiple-images-compressor') runBatchCompress();
              else if (toolId === 'image-to-pdf') runImageToPdf();
              else if (toolId === 'jpg-to-png') processSingleImage('image/png', 1);
              else if (toolId === 'png-to-jpg') processSingleImage('image/jpeg', quality);
              else if (toolId === 'png-to-webp' || toolId === 'jpg-to-webp')
                processSingleImage('image/webp', quality);
              else if (toolId === 'image-resizer') {
                const w = parseInt(widthInput, 10);
                const h = parseInt(heightInput, 10);
                if (isNaN(w) || isNaN(h) || w < 1 || h < 1) {
                  setError('Please enter valid width and height in pixels (minimum 1 px).');
                  return;
                }
                processSingleImage('image/png', 1, (ctx, img, canvas) => {
                  canvas.width = w;
                  canvas.height = h;
                  ctx.drawImage(img, 0, 0, w, h);
                });
              } else if (toolId === 'image-cropper') {
                const x = parseInt(cropXInput || '0', 10);
                const y = parseInt(cropYInput || '0', 10);
                const w = parseInt(cropWInput, 10);
                const h = parseInt(cropHInput, 10);
                if (isNaN(w) || isNaN(h) || w < 1 || h < 1) {
                  setError('Please enter valid crop width and height (minimum 1 px).');
                  return;
                }
                processSingleImage('image/png', 1, (ctx, img, canvas) => {
                  const safeX = Math.min(Math.max(0, x), img.naturalWidth - 1);
                  const safeY = Math.min(Math.max(0, y), img.naturalHeight - 1);
                  const safeW = Math.min(w, img.naturalWidth - safeX);
                  const safeH = Math.min(h, img.naturalHeight - safeY);
                  canvas.width = Math.max(1, safeW);
                  canvas.height = Math.max(1, safeH);
                  ctx.drawImage(
                    img,
                    safeX,
                    safeY,
                    safeW,
                    safeH,
                    0,
                    0,
                    safeW,
                    safeH
                  );
                });
              } else if (toolId === 'image-rotator')
                processSingleImage('image/png', 1, (ctx, img, canvas) => {
                  const swap = rotation === 90 || rotation === 270;
                  canvas.width = swap ? img.naturalHeight : img.naturalWidth;
                  canvas.height = swap ? img.naturalWidth : img.naturalHeight;
                  ctx.translate(canvas.width / 2, canvas.height / 2);
                  ctx.rotate((rotation * Math.PI) / 180);
                  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
                  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
                });
              else processSingleImage(targetFormat, quality);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{processing ? 'Processing...' : 'Process & Prepare Download'}</span>
          </button>
        )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* OUTPUT DOWNLOAD */}
      {output && (
        <div className="rounded-2xl border border-[#7045C6]/30 bg-[#F7F3FF] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#7045C6] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#38205F]">
                Ready: {output.filename}
              </p>
              <p className="text-xs text-[#5B4D7A] mt-0.5 font-mono-tabular">
                {output.summary}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => downloadBlob(output.blob, output.filename)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewUrl && (
        <div className="rounded-2xl border border-[#E4D9FA] bg-[#F7F3FF]/50 p-4">
          <p className="text-xs font-semibold text-[#5B4D7A] mb-2">Preview</p>
          <img
            src={
              output &&
              !output.filename.endsWith('.pdf') &&
              !output.filename.endsWith('.zip')
                ? output.url
                : previewUrl
            }
            alt="Uploaded image preview"
            style={
              toolId === 'image-rotator' && !output
                ? {
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${
                      flipV ? -1 : 1
                    })`,
                  }
                : undefined
            }
            className="max-h-72 mx-auto object-contain rounded-lg transition-transform"
          />
        </div>
      )}
    </div>
  );
};
