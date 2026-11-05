'use client';
import React, { useRef, useState } from 'react';
import { Upload, X, ArrowUp, ArrowDown, File as FileIcon, AlertCircle, Loader2 } from 'lucide-react';
import { formatBytes } from '../utils/download';
import {
  materializeInMemoryFile,
  runFileReadDiagnostics,
  type FileReadDiagnostics,
} from '../utils/fileReader';

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  maxSizeMB?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  label?: string;
  helperText?: string;
  allowReorder?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept,
  multiple = false,
  maxSizeMB = 100,
  files,
  onFilesChange,
  label = 'Select or drop files here',
  helperText,
  allowReorder = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<FileReadDiagnostics | null>(null);

  const acceptedExtensions = accept
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const validateAndAdd = async (incoming: FileList | null, resetInput?: () => void) => {
    if (!incoming || incoming.length === 0) {
      resetInput?.();
      return;
    }
    setError(null);

    const rawList = Array.from(incoming);
    const maxBytes = maxSizeMB * 1024 * 1024;
    const validRawFiles: File[] = [];
    const errors: string[] = [];

    rawList.forEach((file) => {
      const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
      const mime = file.type.toLowerCase();
      const matchesAccept =
        acceptedExtensions.length === 0 ||
        acceptedExtensions.some((acc) => {
          if (acc.startsWith('.')) return ext === acc;
          if (acc.endsWith('/*')) return mime.startsWith(acc.replace('/*', '/'));
          return mime === acc;
        });

      if (!matchesAccept) {
        errors.push(`"${file.name}" has an unsupported file type.`);
        return;
      }
      if (file.size === 0) {
        errors.push(`"${file.name}" is empty (0 bytes).`);
        return;
      }
      if (file.size > maxBytes) {
        errors.push(`"${file.name}" exceeds the ${maxSizeMB} MB limit.`);
        return;
      }
      validRawFiles.push(file);
    });

    if (validRawFiles.length === 0) {
      resetInput?.();
      if (errors.length > 0) setError(errors.join(' '));
      return;
    }

    setIsReading(true);
    try {
      // Read bytes immediately while Android/browser file permission grant is active
      const materializedFiles: File[] = [];
      for (const rawFile of validRawFiles) {
        try {
          const inMem = await materializeInMemoryFile(rawFile);
          materializedFiles.push(inMem);
        } catch (readErr) {
          errors.push(
            readErr instanceof Error
              ? readErr.message
              : `Could not read "${rawFile.name}".`
          );
        }
      }

      if (errors.length > 0) {
        setError(errors.join(' '));
      }

      if (materializedFiles.length > 0) {
        if (multiple) {
          onFilesChange([...files, ...materializedFiles]);
        } else {
          onFilesChange([materializedFiles[0]]);
        }
      }
    } finally {
      setIsReading(false);
      resetInput?.();
    }
  };

  const removeFile = (index: number) => {
    const next = [...files];
    next.splice(index, 1);
    onFilesChange(next);
    setError(null);
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onFilesChange(next);
  };

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isReading) inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (!isReading && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void validateAndAdd(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors cursor-pointer select-none ${
          isDragging
            ? 'border-[#7045C6] bg-[#7045C6]/8'
            : 'border-[#D6C6F7] bg-[#F7F3FF]/60 hover:border-[#7045C6] hover:bg-[#F7F3FF]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            const inputEl = e.currentTarget;
            void validateAndAdd(inputEl.files, () => {
              inputEl.value = '';
            });
          }}
          className="sr-only"
        />
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4D9FA] flex items-center justify-center mx-auto mb-3 shadow-2xs">
          {isReading ? (
            <Loader2 className="w-5 h-5 text-[#7045C6] animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-[#7045C6]" />
          )}
        </div>
        <p className="text-sm sm:text-base font-semibold text-[#38205F]">
          {isReading ? 'Reading file into memory...' : label}
        </p>
        <p className="text-xs sm:text-sm text-[#5B4D7A] mt-1">
          {helperText ||
            `Accepted: ${accept.toUpperCase()} · Max ${maxSizeMB} MB per file`}
        </p>
        <span className="mt-4 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#7045C6] rounded-lg">
          Choose {multiple ? 'Files' : 'File'}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="space-y-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setShowDiagnostic((v) => !v)}
              className="text-xs font-semibold underline text-red-900 cursor-pointer"
            >
              {showDiagnostic ? 'Hide isolated file-read diagnostic' : 'Run isolated file-read diagnostic'}
            </button>
          </div>
        </div>
      )}

      {showDiagnostic && (
        <div className="rounded-xl border border-[#D6C6F7] bg-[#F7F3FF] p-4 text-xs text-[#38205F] space-y-3">
          <p className="font-semibold">
            Isolated HTML &lt;input type=&quot;file&quot;&gt; Read Diagnostic
          </p>
          <input
            type="file"
            accept={accept}
            onChange={async (e) => {
              const f = e.currentTarget.files?.[0];
              if (!f) return;
              const { diagnostics } = await runFileReadDiagnostics(f);
              setDiagnosticResult(diagnostics);
            }}
            className="block w-full text-xs text-[#38205F]"
          />
          {diagnosticResult && (
            <div className="space-y-1.5 font-mono-tabular bg-white p-3 rounded-lg border border-[#E4D9FA] overflow-x-auto">
              <div>
                File: {diagnosticResult.fileName} | instanceof File:{' '}
                {String(diagnosticResult.isFileInstance)} | Size: {diagnosticResult.size}B | MIME:{' '}
                {diagnosticResult.type} | inIframe: {String(diagnosticResult.inIframe)}
              </div>
              {diagnosticResult.attempts.map((att) => (
                <div
                  key={att.method}
                  className={att.ok ? 'text-emerald-700' : 'text-red-700'}
                >
                  {att.method}: {att.ok ? `OK (${att.byteLength} bytes)` : `${att.errorName}: ${att.errorMessage}`}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-[#5B4D7A]">
            <span>
              Selected {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
            <button
              type="button"
              onClick={() => {
                onFilesChange([]);
                setError(null);
              }}
              className="text-[#7045C6] hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <ul className="divide-y divide-[#F0E8FF] rounded-xl border border-[#E4D9FA] bg-white overflow-hidden">
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${file.size}-${idx}`}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileIcon className="w-4 h-4 text-[#7045C6] shrink-0" />
                  <span className="truncate font-medium text-[#38205F]">
                    {file.name}
                  </span>
                  <span className="text-xs text-[#7B6B9E] font-mono-tabular shrink-0">
                    ({formatBytes(file.size)})
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {allowReorder && files.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Move ${file.name} up`}
                        className="p-1.5 rounded-lg text-[#5B4D7A] hover:bg-[#F7F3FF] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, 1)}
                        disabled={idx === files.length - 1}
                        aria-label={`Move ${file.name} down`}
                        className="p-1.5 rounded-lg text-[#5B4D7A] hover:bg-[#F7F3FF] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    aria-label={`Remove ${file.name}`}
                    className="p-1.5 rounded-lg text-[#5B4D7A] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
