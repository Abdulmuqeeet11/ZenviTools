import React, { useState, useEffect } from 'react';
import {
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
} from 'lucide-react';
import { FileDropzone } from '../components/FileDropzone';
import { downloadBlob, formatBytes, toPdfBlob } from '../utils/download';
import { embedImageFileInPdf, type ExpectedImageFormat } from '../utils/imagePdf';

async function getPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }
  return pdfjsLib;
}

function parsePageRanges(input: string, totalPages: number): number[] {
  const parts = input
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) {
    throw new Error('Please enter at least one page number or range (e.g., 1-3, 5).');
  }
  const indices: number[] = [];
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Number(startStr);
      const end = Number(endStr);
      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 1 ||
        end > totalPages ||
        start > end
      ) {
        throw new Error(
          `Invalid range "${part}". Pages must be between 1 and ${totalPages}.`
        );
      }
      for (let i = start; i <= end; i++) {
        indices.push(i - 1);
      }
    } else {
      const num = Number(part);
      if (!Number.isInteger(num) || num < 1 || num > totalPages) {
        throw new Error(
          `Invalid page "${part}". Pages must be between 1 and ${totalPages}.`
        );
      }
      indices.push(num - 1);
    }
  }
  return indices;
}

export const PdfTools: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<{
    blob: Blob;
    filename: string;
    summary?: string;
  } | null>(null);

  // Image to PDF options
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(24);

  // PDF to JPG/PNG options
  const [renderScale, setRenderScale] = useState<number>(1.5);
  const [renderedImages, setRenderedImages] = useState<
    { url: string; blob: Blob; name: string }[]
  >([]);

  // Split / Extract / Delete / Rotate / Rearrange options
  const [pageRangeInput, setPageRangeInput] = useState('1');
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  const [rotateTarget, setRotateTarget] = useState<'all' | 'custom'>('all');
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [totalPdfPages, setTotalPdfPages] = useState<number>(0);

  // Compress options
  const [compressMode, setCompressMode] = useState<'standard' | 'strong'>('standard');
  const [compressQuality, setCompressQuality] = useState<number>(0.65);

  // Page numbers options
  const [numberFormat, setNumberFormat] = useState<'simple' | 'of'>('of');
  const [numberPosition, setNumberPosition] = useState<
    'bottom-center' | 'bottom-right' | 'top-right'
  >('bottom-center');

  // Password options
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Excel sheet selection
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');

  const resetOutput = () => {
    setError(null);
    setResultBlob(null);
    setProgress(0);
    renderedImages.forEach((img) => URL.revokeObjectURL(img.url));
    setRenderedImages([]);
  };

  useEffect(() => {
    setFiles([]);
    setPassword('');
    setConfirmPassword('');
    setSheetNames([]);
    setSelectedSheet('');
    setPageOrder([]);
    setTotalPdfPages(0);
    resetOutput();
  }, [toolId]);

  const handleFilesUpdate = async (newFiles: File[]) => {
    setFiles(newFiles);
    resetOutput();

    if (newFiles.length > 0 && toolId === 'excel-xlsx-to-pdf') {
      try {
        const XLSX = await import('xlsx');
        const buf = await newFiles[0].arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        setSheetNames(wb.SheetNames);
        setSelectedSheet(wb.SheetNames[0] || '');
      } catch {
        setError(
          'Could not read spreadsheet. Please ensure it is a valid XLSX, XLS, or CSV file.'
        );
      }
    }

    if (
      newFiles.length > 0 &&
      (toolId === 'rearrange-pdf-pages' ||
        toolId === 'split-pdf' ||
        toolId === 'extract-pdf-pages' ||
        toolId === 'delete-pdf-pages' ||
        toolId === 'rotate-pdf')
    ) {
      try {
        const { PDFDocument } = await import('pdf-lib');
        const buf = await newFiles[0].arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const count = doc.getPageCount();
        setTotalPdfPages(count);
        setPageOrder(Array.from({ length: count }, (_, i) => i + 1));
        if (toolId === 'split-pdf' || toolId === 'extract-pdf-pages') {
          setPageRangeInput(count > 1 ? `1-${Math.min(2, count)}` : '1');
        }
      } catch {
        setError(
          'Could not read PDF structure. The file may be corrupted or encrypted.'
        );
      }
    }
  };

  // 1. IMAGES TO PDF
  const runImagesToPdf = async () => {
    if (files.length === 0) {
      setError('Please select at least one image file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      const expectedFormat: ExpectedImageFormat =
        toolId === 'png-to-pdf'
          ? 'png'
          : toolId === 'jpg-to-pdf'
          ? 'jpg'
          : toolId === 'webp-to-pdf'
          ? 'webp'
          : 'any';

      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i + 0.5) / files.length) * 100));
        const { embedded, width, height } = await embedImageFileInPdf(
          pdfDoc,
          files[i],
          expectedFormat
        );

        let pageW: number;
        let pageH: number;
        if (pageSize === 'fit') {
          pageW = width + margin * 2;
          pageH = height + margin * 2;
        } else {
          const baseW = pageSize === 'a4' ? 595.28 : 612;
          const baseH = pageSize === 'a4' ? 841.89 : 792;
          pageW = orientation === 'portrait' ? baseW : baseH;
          pageH = orientation === 'portrait' ? baseH : baseW;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        const availW = Math.max(10, pageW - margin * 2);
        const availH = Math.max(10, pageH - margin * 2);
        const scale = Math.min(availW / width, availH / height);
        const drawW = width * scale;
        const drawH = height * scale;
        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;

        page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = toPdfBlob(pdfBytes);
      setProgress(100);
      const outName =
        files.length === 1
          ? `${files[0].name.replace(/\.[^.]+$/, '') || 'zenvi-image'}.pdf`
          : 'zenvi-images.pdf';
      setResultBlob({
        blob,
        filename: outName,
        summary: `Created ${files.length}-page PDF (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert images to PDF.');
    } finally {
      setProcessing(false);
    }
  };

  // 2. DOCX TO PDF
  const runDocxToPdf = async () => {
    if (files.length === 0) {
      setError('Please upload a .docx file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      setProgress(25);
      const mammoth = (await import('mammoth')).default;
      const { jsPDF } = await import('jspdf');
      const arrayBuffer = await files[0].arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      if (!text) {
        throw new Error('No readable text found in this DOCX file.');
      }

      setProgress(65);
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginPt = 48;
      const maxWidth = pageWidth - marginPt * 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);

      const paragraphs = text.split(/\r?\n/);
      let y = marginPt;
      const lineHeight = 16;

      for (const para of paragraphs) {
        if (!para.trim()) {
          y += lineHeight * 0.6;
          if (y > pageHeight - marginPt) {
            doc.addPage();
            y = marginPt;
          }
          continue;
        }
        const lines: string[] = doc.splitTextToSize(para, maxWidth);
        for (const line of lines) {
          if (y > pageHeight - marginPt) {
            doc.addPage();
            y = marginPt;
          }
          doc.text(line, marginPt, y);
          y += lineHeight;
        }
      }

      const blob = doc.output('blob');
      setProgress(100);
      const baseName = files[0].name.replace(/\.docx$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}.pdf`,
        summary: `Converted DOCX to PDF (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to convert DOCX. Ensure the file is a valid .docx document.'
      );
    } finally {
      setProcessing(false);
    }
  };

  // 3. XLSX TO PDF
  const runXlsxToPdf = async () => {
    if (files.length === 0) {
      setError('Please upload an Excel or CSV file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      setProgress(25);
      const XLSX = await import('xlsx');
      const { jsPDF } = await import('jspdf');
      const buf = await files[0].arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const targetSheet = selectedSheet || wb.SheetNames[0];
      const ws = wb.Sheets[targetSheet];
      if (!ws) throw new Error('Worksheet not found.');

      const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (rows.length === 0) {
        throw new Error('The selected worksheet is empty.');
      }

      setProgress(70);
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginPt = 36;
      const maxCols = Math.max(...rows.map((r) => r.length), 1);
      const colWidth = Math.max(55, (pageWidth - marginPt * 2) / Math.min(maxCols, 10));

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${files[0].name} — ${targetSheet}`, marginPt, marginPt);

      doc.setFontSize(9);
      let y = marginPt + 22;
      const rowHeight = 16;

      rows.forEach((row, rIdx) => {
        if (y > pageHeight - marginPt) {
          doc.addPage();
          y = marginPt;
        }
        doc.setFont('helvetica', rIdx === 0 ? 'bold' : 'normal');
        const visibleCols = row.slice(0, 10);
        visibleCols.forEach((cell, cIdx) => {
          const val = String(cell ?? '').slice(0, 24);
          doc.text(val, marginPt + cIdx * colWidth, y);
        });
        y += rowHeight;
      });

      const blob = doc.output('blob');
      setProgress(100);
      const baseName = files[0].name.replace(/\.(xlsx|xls|csv)$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}.pdf`,
        summary: `Exported "${targetSheet}" (${rows.length} rows · ${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert spreadsheet to PDF.');
    } finally {
      setProcessing(false);
    }
  };

  // 4. PPTX TO PDF
  const runPptxToPdf = async () => {
    if (files.length === 0) {
      setError('Please upload a .pptx PowerPoint file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      setProgress(20);
      const JSZip = (await import('jszip')).default;
      const { jsPDF } = await import('jspdf');
      const zip = await JSZip.loadAsync(await files[0].arrayBuffer());
      const slideFiles = Object.keys(zip.files)
        .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
        .sort((a, b) => {
          const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
          const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
          return numA - numB;
        });

      if (slideFiles.length === 0) {
        throw new Error('No slides found in this PPTX file.');
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginPt = 48;

      for (let i = 0; i < slideFiles.length; i++) {
        setProgress(Math.round(25 + ((i + 1) / slideFiles.length) * 70));
        if (i > 0) doc.addPage();
        const xmlStr = await zip.files[slideFiles[i]].async('string');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
        const paragraphs = Array.from(xmlDoc.getElementsByTagName('a:p'));

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(112, 69, 198);
        doc.text(`Slide ${i + 1} of ${slideFiles.length}`, marginPt, 32);

        doc.setTextColor(30, 21, 51);
        let y = 64;
        paragraphs.forEach((p, pIdx) => {
          const runs = Array.from(p.getElementsByTagName('a:t'))
            .map((t) => t.textContent || '')
            .join('');
          if (!runs.trim()) return;
          doc.setFont('helvetica', pIdx === 0 ? 'bold' : 'normal');
          doc.setFontSize(pIdx === 0 ? 18 : 12);
          const lines: string[] = doc.splitTextToSize(runs, pageWidth - marginPt * 2);
          lines.forEach((line) => {
            if (y < pageHeight - marginPt) {
              doc.text(line, marginPt, y);
              y += pIdx === 0 ? 24 : 18;
            }
          });
          y += 6;
        });
      }

      const blob = doc.output('blob');
      setProgress(100);
      const baseName = files[0].name.replace(/\.pptx$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}.pdf`,
        summary: `Converted ${slideFiles.length} slides to PDF (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to read PPTX file. Ensure it is a valid .pptx presentation.'
      );
    } finally {
      setProcessing(false);
    }
  };

  // 5. PDF TO JPG / PNG
  const runPdfToImages = async (format: 'jpg' | 'png') => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const pdfjsLib = await getPdfJs();
      const buf = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const numPages = pdf.numPages;
      const outputs: { url: string; blob: Blob; name: string }[] = [];
      const baseName = files[0].name.replace(/\.pdf$/i, '');

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round((i / numPages) * 100));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: renderScale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context unavailable.');

        if (format === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Failed to render page.'))),
            mime,
            0.92
          );
        });
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();

        outputs.push({
          url: URL.createObjectURL(blob),
          blob,
          name: `${baseName}-page-${i}.${format}`,
        });
      }

      setRenderedImages(outputs);
      if (outputs.length === 1) {
        setResultBlob({
          blob: outputs[0].blob,
          filename: outputs[0].name,
          summary: `Rendered 1 page (${formatBytes(outputs[0].blob.size)})`,
        });
      } else {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        outputs.forEach((o) => zip.file(o.name, o.blob));
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setResultBlob({
          blob: zipBlob,
          filename: `${baseName}-${format}-pages.zip`,
          summary: `Rendered ${outputs.length} pages into ZIP (${formatBytes(zipBlob.size)})`,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not render PDF. The file may be corrupted or password-protected.'
      );
    } finally {
      setProcessing(false);
    }
  };

  // 6. PDF TO EDITABLE DOCX
  const runPdfToDocx = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const pdfjsLib = await getPdfJs();
      const { Document, Packer, Paragraph, TextRun, PageBreak } = await import('docx');
      const buf = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const numPages = pdf.numPages;
      const docChildren: InstanceType<typeof Paragraph>[] = [];
      let totalChars = 0;

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round((i / numPages) * 90));
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as Array<{ str: string; transform: number[] }>;

        const linesMap = new Map<number, string[]>();
        for (const item of items) {
          if (!item.str) continue;
          totalChars += item.str.trim().length;
          const yKey = Math.round((item.transform?.[5] || 0) / 4) * 4;
          const existing = linesMap.get(yKey) || [];
          existing.push(item.str);
          linesMap.set(yKey, existing);
        }

        const sortedYs = Array.from(linesMap.keys()).sort((a, b) => b - a);
        for (const yKey of sortedYs) {
          const lineText = (linesMap.get(yKey) || []).join(' ').trim();
          if (lineText) {
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: lineText, size: 22 })],
                spacing: { after: 120 },
              })
            );
          }
        }

        if (i < numPages) {
          docChildren.push(new Paragraph({ children: [new PageBreak()] }));
        }
        page.cleanup();
      }

      if (totalChars === 0) {
        throw new Error(
          'No embedded text found in this PDF. It appears to be a scanned image-only PDF, which requires an OCR engine to extract text.'
        );
      }

      const wordDoc = new Document({
        sections: [{ children: docChildren }],
      });
      const blob = await Packer.toBlob(wordDoc);
      setProgress(100);
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}.docx`,
        summary: `Extracted ${numPages} pages into editable DOCX (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to DOCX.');
    } finally {
      setProcessing(false);
    }
  };

  // 7. MERGE PDF
  const runMergePdf = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i + 0.5) / files.length) * 100));
        const buf = await files[i].arrayBuffer();
        const src = await PDFDocument.load(buf);
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = toPdfBlob(bytes);
      setProgress(100);
      setResultBlob({
        blob,
        filename: 'zenvi-merged.pdf',
        summary: `Merged ${files.length} PDFs (${merged.getPageCount()} total pages · ${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to merge PDFs. Ensure none of the files are corrupted or password-locked.'
      );
    } finally {
      setProcessing(false);
    }
  };

  // 8. SPLIT PDF
  const runSplitPdf = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await files[0].arrayBuffer();
      const src = await PDFDocument.load(buf);
      const total = src.getPageCount();
      const baseName = files[0].name.replace(/\.pdf$/i, '');

      if (splitMode === 'range') {
        const indices = parsePageRanges(pageRangeInput, total);
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        const blob = toPdfBlob(bytes);
        setProgress(100);
        setResultBlob({
          blob,
          filename: `${baseName}-split.pdf`,
          summary: `Extracted ${indices.length} pages (${formatBytes(blob.size)})`,
        });
      } else {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        for (let i = 0; i < total; i++) {
          setProgress(Math.round(((i + 1) / total) * 100));
          const single = await PDFDocument.create();
          const [copied] = await single.copyPages(src, [i]);
          single.addPage(copied);
          const bytes = await single.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, bytes);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setResultBlob({
          blob: zipBlob,
          filename: `${baseName}-split-pages.zip`,
          summary: `Split into ${total} individual PDFs (${formatBytes(zipBlob.size)})`,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to split PDF.');
    } finally {
      setProcessing(false);
    }
  };

  // 9. COMPRESS PDF
  const runCompressPdf = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const origSize = files[0].size;
      const buf = await files[0].arrayBuffer();
      const baseName = files[0].name.replace(/\.pdf$/i, '');

      if (compressMode === 'standard') {
        setProgress(50);
        const doc = await PDFDocument.load(buf);
        doc.setTitle('');
        doc.setAuthor('');
        doc.setSubject('');
        doc.setKeywords([]);
        doc.setProducer('');
        doc.setCreator('');
        const bytes = await doc.save({ useObjectStreams: true });
        const blob = toPdfBlob(bytes);
        setProgress(100);
        const savedPct = Math.max(
          0,
          Math.round(((origSize - blob.size) / origSize) * 100)
        );
        setResultBlob({
          blob,
          filename: `${baseName}-compressed.pdf`,
          summary: `Original: ${formatBytes(origSize)} → Compressed: ${formatBytes(blob.size)} (${savedPct}% smaller)`,
        });
      } else {
        const pdfjsLib = await getPdfJs();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const out = await PDFDocument.create();
        for (let i = 1; i <= pdf.numPages; i++) {
          setProgress(Math.round((i / pdf.numPages) * 95));
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.25 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas unavailable.');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          const jpgBlob = await new Promise<Blob>((res, rej) =>
            canvas.toBlob(
              (b) => (b ? res(b) : rej(new Error('Compression failed'))),
              'image/jpeg',
              compressQuality
            )
          );
          canvas.width = 0;
          canvas.height = 0;
          page.cleanup();
          const jpgBytes = new Uint8Array(await jpgBlob.arrayBuffer());
          const embedded = await out.embedJpg(jpgBytes);
          const pdfPage = out.addPage([viewport.width, viewport.height]);
          pdfPage.drawImage(embedded, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
        }
        const bytes = await out.save({ useObjectStreams: true });
        const blob = toPdfBlob(bytes);
        setProgress(100);
        const savedPct = Math.round(((origSize - blob.size) / origSize) * 100);
        setResultBlob({
          blob,
          filename: `${baseName}-compressed.pdf`,
          summary: `Original: ${formatBytes(origSize)} → Compressed: ${formatBytes(blob.size)} (${savedPct > 0 ? `${savedPct}% smaller` : 'optimized'})`,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compress PDF.');
    } finally {
      setProcessing(false);
    }
  };

  // 10. ROTATE PDF
  const runRotatePdf = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const buf = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const total = doc.getPageCount();
      const targetIndices =
        rotateTarget === 'all'
          ? doc.getPageIndices()
          : parsePageRanges(pageRangeInput, total);

      targetIndices.forEach((idx) => {
        const page = doc.getPage(idx);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotateAngle) % 360));
      });

      const bytes = await doc.save();
      const blob = toPdfBlob(bytes);
      setProgress(100);
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}-rotated.pdf`,
        summary: `Rotated ${targetIndices.length} page(s) by ${rotateAngle}° (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rotate PDF.');
    } finally {
      setProcessing(false);
    }
  };

  // 11. EXTRACT PDF PAGES
  const runExtractPages = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await files[0].arrayBuffer();
      const src = await PDFDocument.load(buf);
      const indices = parsePageRanges(pageRangeInput, src.getPageCount());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = toPdfBlob(bytes);
      setProgress(100);
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}-extracted.pdf`,
        summary: `Extracted ${indices.length} page(s) (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract pages.');
    } finally {
      setProcessing(false);
    }
  };

  // 12. DELETE PDF PAGES
  const runDeletePages = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await files[0].arrayBuffer();
      const src = await PDFDocument.load(buf);
      const total = src.getPageCount();
      const toDelete = new Set(parsePageRanges(pageRangeInput, total));
      const keepIndices = src.getPageIndices().filter((idx) => !toDelete.has(idx));
      if (keepIndices.length === 0) {
        throw new Error(
          'You cannot delete all pages from a PDF. At least one page must remain.'
        );
      }
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, keepIndices);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = toPdfBlob(bytes);
      setProgress(100);
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}-edited.pdf`,
        summary: `Removed ${toDelete.size} page(s), kept ${keepIndices.length} (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pages.');
    } finally {
      setProcessing(false);
    }
  };

  // 13. ADD PAGE NUMBERS TO PDF
  const runAddPageNumbers = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
      const buf = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const label =
          numberFormat === 'of' ? `Page ${idx + 1} of ${total}` : `${idx + 1}`;
        const textWidth = font.widthOfTextAtSize(label, 10);
        let x = (width - textWidth) / 2;
        let y = 24;
        if (numberPosition === 'bottom-right') {
          x = width - textWidth - 36;
          y = 24;
        } else if (numberPosition === 'top-right') {
          x = width - textWidth - 36;
          y = height - 32;
        }
        page.drawText(label, {
          x,
          y,
          size: 10,
          font,
          color: rgb(0.25, 0.2, 0.35),
        });
      });

      const bytes = await doc.save();
      const blob = toPdfBlob(bytes);
      setProgress(100);
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}-numbered.pdf`,
        summary: `Added page numbers to ${total} pages (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add page numbers.');
    } finally {
      setProcessing(false);
    }
  };

  // 14. REARRANGE PDF PAGES
  const runRearrangePages = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await files[0].arrayBuffer();
      const src = await PDFDocument.load(buf);
      const out = await PDFDocument.create();
      const indices = pageOrder.map((p) => p - 1);
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = toPdfBlob(bytes);
      setProgress(100);
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}-reordered.pdf`,
        summary: `Saved ${indices.length} pages in new order (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rearrange pages.');
    } finally {
      setProcessing(false);
    }
  };

  // 15. PROTECT PDF WITH PASSWORD
  const runProtectPdf = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    if (!password) {
      setError('Please enter a password to protect the PDF.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const pdfjsLib = await getPdfJs();
      const { jsPDF } = await import('jspdf');
      const buf = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const firstPage = await pdf.getPage(1);
      const firstVp = firstPage.getViewport({ scale: 1.5 });

      const doc = new jsPDF({
        orientation: firstVp.width > firstVp.height ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [firstVp.width, firstVp.height],
        encryption: {
          userPassword: password,
          ownerPassword: password + '_owner',
          userPermissions: ['print'],
        },
      });

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(Math.round((i / pdf.numPages) * 95));
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1.5 });
        if (i > 1) {
          doc.addPage(
            [vp.width, vp.height],
            vp.width > vp.height ? 'landscape' : 'portrait'
          );
        }
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable.');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
        doc.addImage(imgData, 'JPEG', 0, 0, vp.width, vp.height);
      }

      const blob = doc.output('blob');
      setProgress(100);
      const baseName = files[0].name.replace(/\.pdf$/i, '');
      setResultBlob({
        blob,
        filename: `${baseName}-protected.pdf`,
        summary: `Encrypted ${pdf.numPages} pages with password (${formatBytes(blob.size)})`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encrypt PDF.');
    } finally {
      setProcessing(false);
    }
  };

  // 16. UNLOCK PDF
  const runUnlockPdf = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }
    setProcessing(true);
    resetOutput();
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await files[0].arrayBuffer();
      const baseName = files[0].name.replace(/\.pdf$/i, '');

      if (!password) {
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const bytes = await doc.save();
        const blob = toPdfBlob(bytes);
        setProgress(100);
        setResultBlob({
          blob,
          filename: `${baseName}-unlocked.pdf`,
          summary: `Removed owner restrictions (${formatBytes(blob.size)})`,
        });
      } else {
        const pdfjsLib = await getPdfJs();
        const pdf = await pdfjsLib.getDocument({ data: buf, password }).promise;
        const out = await PDFDocument.create();
        for (let i = 1; i <= pdf.numPages; i++) {
          setProgress(Math.round((i / pdf.numPages) * 95));
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas unavailable.');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
          const jpgBlob = await new Promise<Blob>((res, rej) =>
            canvas.toBlob(
              (b) => (b ? res(b) : rej(new Error('Failed to render page'))),
              'image/jpeg',
              0.92
            )
          );
          canvas.width = 0;
          canvas.height = 0;
          page.cleanup();
          const embedded = await out.embedJpg(new Uint8Array(await jpgBlob.arrayBuffer()));
          const p = out.addPage([vp.width, vp.height]);
          p.drawImage(embedded, { x: 0, y: 0, width: vp.width, height: vp.height });
        }
        const bytes = await out.save();
        const blob = toPdfBlob(bytes);
        setProgress(100);
        setResultBlob({
          blob,
          filename: `${baseName}-unlocked.pdf`,
          summary: `Unlocked ${pdf.numPages} pages (${formatBytes(blob.size)})`,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not unlock PDF. If it requires an open password, please enter the correct password.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const isImageToPdf = [
    'jpg-to-pdf',
    'png-to-pdf',
    'webp-to-pdf',
    'multiple-images-to-pdf',
  ].includes(toolId);

  let accept = '.pdf';
  let multiple = false;
  let allowReorder = false;
  let actionLabel = 'Process File';
  let onRun = () => {};

  if (isImageToPdf) {
    accept =
      toolId === 'jpg-to-pdf'
        ? '.jpg,.jpeg,image/jpeg'
        : toolId === 'png-to-pdf'
        ? '.png,image/png'
        : toolId === 'webp-to-pdf'
        ? '.webp,image/webp'
        : '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
    multiple = true;
    allowReorder = true;
    actionLabel = 'Convert to PDF';
    onRun = runImagesToPdf;
  } else if (toolId === 'word-docx-to-pdf') {
    accept =
      '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    actionLabel = 'Convert DOCX to PDF';
    onRun = runDocxToPdf;
  } else if (toolId === 'excel-xlsx-to-pdf') {
    accept = '.xlsx,.xls,.csv';
    actionLabel = 'Convert Spreadsheet to PDF';
    onRun = runXlsxToPdf;
  } else if (toolId === 'powerpoint-pptx-to-pdf') {
    accept =
      '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation';
    actionLabel = 'Convert PPTX to PDF';
    onRun = runPptxToPdf;
  } else if (toolId === 'pdf-to-jpg') {
    actionLabel = 'Convert PDF to JPG';
    onRun = () => runPdfToImages('jpg');
  } else if (toolId === 'pdf-to-png') {
    actionLabel = 'Convert PDF to PNG';
    onRun = () => runPdfToImages('png');
  } else if (toolId === 'pdf-to-editable-docx') {
    actionLabel = 'Convert PDF to DOCX';
    onRun = runPdfToDocx;
  } else if (toolId === 'merge-pdf') {
    multiple = true;
    allowReorder = true;
    actionLabel = 'Merge PDFs';
    onRun = runMergePdf;
  } else if (toolId === 'split-pdf') {
    actionLabel = 'Split PDF';
    onRun = runSplitPdf;
  } else if (toolId === 'compress-pdf') {
    actionLabel = 'Compress PDF';
    onRun = runCompressPdf;
  } else if (toolId === 'rotate-pdf') {
    actionLabel = 'Rotate PDF';
    onRun = runRotatePdf;
  } else if (toolId === 'extract-pdf-pages') {
    actionLabel = 'Extract Pages';
    onRun = runExtractPages;
  } else if (toolId === 'delete-pdf-pages') {
    actionLabel = 'Delete Pages';
    onRun = runDeletePages;
  } else if (toolId === 'add-page-numbers-to-pdf') {
    actionLabel = 'Add Page Numbers';
    onRun = runAddPageNumbers;
  } else if (toolId === 'rearrange-pdf-pages') {
    actionLabel = 'Save Rearranged PDF';
    onRun = runRearrangePages;
  } else if (toolId === 'protect-pdf-with-password') {
    actionLabel = 'Protect PDF with Password';
    onRun = runProtectPdf;
  } else if (toolId === 'unlock-pdf') {
    actionLabel = 'Unlock PDF';
    onRun = runUnlockPdf;
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={accept}
        multiple={multiple}
        allowReorder={allowReorder}
        files={files}
        onFilesChange={handleFilesUpdate}
      />

      {isImageToPdf && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Page Size
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter' | 'fit')}
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm text-[#1E1533]"
            >
              <option value="a4">A4 (Standard)</option>
              <option value="letter">US Letter</option>
              <option value="fit">Fit to Image</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Orientation
            </label>
            <select
              value={orientation}
              disabled={pageSize === 'fit'}
              onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm text-[#1E1533] disabled:opacity-50"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Margin
            </label>
            <select
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm text-[#1E1533]"
            >
              <option value={0}>No Margin (0 pt)</option>
              <option value={24}>Small (24 pt)</option>
              <option value={48}>Medium (48 pt)</option>
            </select>
          </div>
        </div>
      )}

      {toolId === 'excel-xlsx-to-pdf' && sheetNames.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <label className="block text-xs font-semibold text-[#38205F] mb-1">
            Select Worksheet
          </label>
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="w-full sm:w-72 min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm text-[#1E1533]"
          >
            {sheetNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(toolId === 'pdf-to-jpg' || toolId === 'pdf-to-png') && files.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <label className="block text-xs font-semibold text-[#38205F] mb-1">
            Render Resolution
          </label>
          <select
            value={renderScale}
            onChange={(e) => setRenderScale(Number(e.target.value))}
            className="w-full sm:w-64 min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm text-[#1E1533]"
          >
            <option value={1}>Standard (1.0x)</option>
            <option value={1.5}>High (1.5x)</option>
            <option value={2}>Ultra Crisp (2.0x)</option>
          </select>
        </div>
      )}

      {toolId === 'split-pdf' && files.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] space-y-3">
          <p className="text-xs font-semibold text-[#38205F]">
            Split Mode (Total pages: {totalPdfPages})
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={splitMode === 'all'}
                onChange={() => setSplitMode('all')}
                className="w-4 h-4 accent-[#7045C6]"
              />
              <span>Split into all individual pages (ZIP)</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={splitMode === 'range'}
                onChange={() => setSplitMode('range')}
                className="w-4 h-4 accent-[#7045C6]"
              />
              <span>Extract custom page range (PDF)</span>
            </label>
          </div>
          {splitMode === 'range' && (
            <div>
              <label className="block text-xs font-medium text-[#5B4D7A] mb-1">
                Page Range (e.g., 1-3, 5)
              </label>
              <input
                type="text"
                value={pageRangeInput}
                onChange={(e) => setPageRangeInput(e.target.value)}
                className="w-full sm:w-64 min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm font-mono-tabular"
              />
            </div>
          )}
        </div>
      )}

      {(toolId === 'extract-pdf-pages' || toolId === 'delete-pdf-pages') &&
        files.length > 0 && (
          <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              {toolId === 'extract-pdf-pages'
                ? `Pages to Extract (1–${totalPdfPages}, e.g. 1-2, 4)`
                : `Pages to Delete (1–${totalPdfPages}, e.g. 1, 3-4)`}
            </label>
            <input
              type="text"
              value={pageRangeInput}
              onChange={(e) => setPageRangeInput(e.target.value)}
              className="w-full sm:w-72 min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm font-mono-tabular"
            />
          </div>
        )}

      {toolId === 'rotate-pdf' && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Rotation Angle
            </label>
            <select
              value={rotateAngle}
              onChange={(e) => setRotateAngle(Number(e.target.value) as 90 | 180 | 270)}
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm"
            >
              <option value={90}>90° Clockwise</option>
              <option value={180}>180° Upside Down</option>
              <option value={270}>270° Clockwise (90° Counter-Clockwise)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Target Pages (Total: {totalPdfPages})
            </label>
            <select
              value={rotateTarget}
              onChange={(e) => setRotateTarget(e.target.value as 'all' | 'custom')}
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm mb-2"
            >
              <option value="all">All Pages</option>
              <option value="custom">Specific Pages</option>
            </select>
            {rotateTarget === 'custom' && (
              <input
                type="text"
                value={pageRangeInput}
                onChange={(e) => setPageRangeInput(e.target.value)}
                placeholder="e.g., 1, 3-4"
                className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm font-mono-tabular"
              />
            )}
          </div>
        </div>
      )}

      {toolId === 'compress-pdf' && files.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={compressMode === 'standard'}
                onChange={() => setCompressMode('standard')}
                className="w-4 h-4 accent-[#7045C6]"
              />
              <span>Standard (Lossless structure optimization, keeps selectable text)</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={compressMode === 'strong'}
                onChange={() => setCompressMode('strong')}
                className="w-4 h-4 accent-[#7045C6]"
              />
              <span>Strong (Re-renders pages as compressed JPEG for maximum size reduction)</span>
            </label>
          </div>
          {compressMode === 'strong' && (
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Image Quality: {Math.round(compressQuality * 100)}%
              </label>
              <input
                type="range"
                min={0.3}
                max={0.9}
                step={0.05}
                value={compressQuality}
                onChange={(e) => setCompressQuality(Number(e.target.value))}
                className="w-full sm:w-64 accent-[#7045C6]"
              />
            </div>
          )}
        </div>
      )}

      {toolId === 'add-page-numbers-to-pdf' && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Number Format
            </label>
            <select
              value={numberFormat}
              onChange={(e) => setNumberFormat(e.target.value as 'simple' | 'of')}
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm"
            >
              <option value="of">Page 1 of N</option>
              <option value="simple">1, 2, 3...</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Position
            </label>
            <select
              value={numberPosition}
              onChange={(e) =>
                setNumberPosition(
                  e.target.value as 'bottom-center' | 'bottom-right' | 'top-right'
                )
              }
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm"
            >
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
        </div>
      )}

      {toolId === 'rearrange-pdf-pages' && pageOrder.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] space-y-2">
          <p className="text-xs font-semibold text-[#38205F]">
            Reorder Pages ({pageOrder.length} pages)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {pageOrder.map((pageNum, idx) => (
              <div
                key={`${pageNum}-${idx}`}
                className="flex items-center justify-between bg-white border border-[#D6C6F7] rounded-lg px-3 py-2 text-sm"
              >
                <span className="font-mono-tabular font-semibold text-[#38205F]">
                  Page {pageNum}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      const next = [...pageOrder];
                      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                      setPageOrder(next);
                    }}
                    className="p-1.5 hover:bg-[#F7F3FF] rounded disabled:opacity-30 cursor-pointer"
                    aria-label="Move page earlier"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === pageOrder.length - 1}
                    onClick={() => {
                      const next = [...pageOrder];
                      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                      setPageOrder(next);
                    }}
                    className="p-1.5 hover:bg-[#F7F3FF] rounded disabled:opacity-30 cursor-pointer"
                    aria-label="Move page later"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toolId === 'protect-pdf-with-password' && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Open Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter strong password"
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm"
            />
          </div>
        </div>
      )}

      {toolId === 'unlock-pdf' && files.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <label className="block text-xs font-semibold text-[#38205F] mb-1">
            Open Password (leave blank if only owner/printing restrictions are locked)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter PDF password if required"
            className="w-full sm:w-80 min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={processing || files.length === 0}
          onClick={onRun}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] disabled:opacity-50 transition-colors cursor-pointer"
        >
          {processing && <Loader2 className="w-4 h-4 animate-spin" />}
          {toolId === 'protect-pdf-with-password' && <Lock className="w-4 h-4" />}
          {toolId === 'unlock-pdf' && <Unlock className="w-4 h-4" />}
          <span>{processing ? `Processing (${progress}%)...` : actionLabel}</span>
        </button>
      </div>

      {processing && (
        <div className="w-full bg-[#F0E8FF] rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#7045C6] h-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
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

      {resultBlob && (
        <div className="rounded-2xl border border-[#7045C6]/30 bg-[#F7F3FF] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#7045C6] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#38205F]">
                Ready to Download: {resultBlob.filename}
              </p>
              {resultBlob.summary && (
                <p className="text-xs text-[#5B4D7A] mt-0.5 font-mono-tabular">
                  {resultBlob.summary}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => downloadBlob(resultBlob.blob, resultBlob.filename)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      )}

      {renderedImages.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-[#38205F]">
            Rendered Pages ({renderedImages.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderedImages.map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E4D9FA] bg-white p-3 flex flex-col justify-between gap-3"
              >
                <img
                  src={img.url}
                  alt={`Rendered PDF page ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-48 object-contain bg-[#F7F3FF] rounded-lg"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-tabular text-[#5B4D7A] truncate">
                    Page {idx + 1} ({formatBytes(img.blob.size)})
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadBlob(img.blob, img.name)}
                    className="text-xs font-semibold text-[#7045C6] hover:underline cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
