const fileBytesCache = new WeakMap<File, Uint8Array>();

export interface FileReadAttempt {
  method: string;
  ok: boolean;
  byteLength?: number;
  errorName?: string;
  errorMessage?: string;
}

export interface FileReadDiagnostics {
  fileName: string;
  isFileInstance: boolean;
  size: number;
  type: string;
  lastModified: number;
  inIframe: boolean;
  attempts: FileReadAttempt[];
}

export function getCachedFileBytes(file: File): Uint8Array | undefined {
  return fileBytesCache.get(file);
}

function extractErrorInfo(err: unknown): { name: string; message: string } {
  if (err instanceof DOMException) {
    return { name: err.name, message: err.message };
  }
  if (err instanceof Error) {
    return { name: err.name || 'Error', message: err.message };
  }
  return { name: 'UnknownError', message: String(err) };
}

function readViaFileReaderArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('FileReader did not return an ArrayBuffer.'));
      }
    };
    reader.onerror = () => {
      reject(reader.error || new Error('FileReader.readAsArrayBuffer failed.'));
    };
    reader.readAsArrayBuffer(file);
  });
}

function readViaFileReaderDataUrl(file: File): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('FileReader did not return a DataURL string.'));
        return;
      }
      const commaIdx = reader.result.indexOf(',');
      if (commaIdx === -1) {
        reject(new Error('Invalid DataURL format.'));
        return;
      }
      const base64 = reader.result.slice(commaIdx + 1);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      resolve(bytes);
    };
    reader.onerror = () => {
      reject(reader.error || new Error('FileReader.readAsDataURL failed.'));
    };
    reader.readAsDataURL(file);
  });
}

async function readViaStream(file: File): Promise<Uint8Array> {
  if (typeof file.stream !== 'function') {
    throw new Error('file.stream() is not supported.');
  }
  const reader = file.stream().getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
    }
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

export async function runFileReadDiagnostics(file: File): Promise<{
  bytes: Uint8Array | null;
  diagnostics: FileReadDiagnostics;
}> {
  let inIframe = false;
  try {
    inIframe = window.self !== window.top;
  } catch {
    inIframe = true;
  }

  const attempts: FileReadAttempt[] = [];
  let resolvedBytes: Uint8Array | null = null;

  const tryMethod = async (method: string, fn: () => Promise<Uint8Array>) => {
    try {
      const bytes = await fn();
      attempts.push({ method, ok: true, byteLength: bytes.byteLength });
      if (!resolvedBytes) resolvedBytes = bytes;
    } catch (err) {
      const info = extractErrorInfo(err);
      attempts.push({
        method,
        ok: false,
        errorName: info.name,
        errorMessage: info.message,
      });
    }
  };

  await tryMethod('file.arrayBuffer()', async () => new Uint8Array(await file.arrayBuffer()));
  await tryMethod('FileReader.readAsArrayBuffer()', () => readViaFileReaderArrayBuffer(file));
  await tryMethod('new Response(file).arrayBuffer()', async () =>
    new Uint8Array(await new Response(file).arrayBuffer())
  );
  await tryMethod('file.stream()', () => readViaStream(file));
  await tryMethod('FileReader.readAsDataURL()', () => readViaFileReaderDataUrl(file));

  return {
    bytes: resolvedBytes,
    diagnostics: {
      fileName: file.name,
      isFileInstance: file instanceof File,
      size: file.size,
      type: file.type || '(empty)',
      lastModified: file.lastModified,
      inIframe,
      attempts,
    },
  };
}

export async function readFileBytesImmediately(file: File): Promise<Uint8Array> {
  const cached = fileBytesCache.get(file);
  if (cached) return cached;

  // Fast path: try file.arrayBuffer() first
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    fileBytesCache.set(file, bytes);
    return bytes;
  } catch {
    // Run full fallback chain & diagnostics
    const { bytes, diagnostics } = await runFileReadDiagnostics(file);
    if (bytes) {
      fileBytesCache.set(file, bytes);
      return bytes;
    }

    const firstErr = diagnostics.attempts[0];
    const errDetail = firstErr
      ? `${firstErr.errorName}: ${firstErr.errorMessage}`
      : 'Unknown read failure';
    const iframeHint = diagnostics.inIframe
      ? ' Note: Running inside an embedded preview iframe—Android Chrome content:// file picker URIs may be blocked in cross-origin iframes; try opening the app directly in a standalone browser tab.'
      : '';

    throw new Error(
      `Could not read "${file.name}" (${file.size} bytes, type: ${diagnostics.type}). Browser error: ${errDetail}.${iframeHint}`
    );
  }
}

export async function materializeInMemoryFile(file: File): Promise<File> {
  const bytes = await readFileBytesImmediately(file);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const inMemoryFile = new File([copy], file.name, {
    type: file.type,
    lastModified: file.lastModified || Date.now(),
  });
  fileBytesCache.set(inMemoryFile, copy);
  return inMemoryFile;
}
