import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  Camera,
  CameraOff,
  Upload,
  AlertCircle,
  ArrowLeftRight,
} from 'lucide-react';
import { copyToClipboard, downloadBlob, downloadDataUrl } from '../utils/download';

function sanitizeDecimal(raw: string, allowNegative = true): string {
  let v = raw.replace(/,/g, '.').replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, '');
  if (allowNegative) {
    const hasMinus = v.startsWith('-');
    v = v.replace(/-/g, '');
    if (hasMinus) v = '-' + v;
  }
  const parts = v.split('.');
  if (parts.length > 2) {
    v = parts[0] + '.' + parts.slice(1).join('');
  }
  return v;
}

function sanitizeInteger(raw: string, allowNegative = false): string {
  let v = raw.replace(allowNegative ? /[^0-9-]/g : /[^0-9]/g, '');
  if (allowNegative) {
    const hasMinus = v.startsWith('-');
    v = v.replace(/-/g, '');
    if (hasMinus) v = '-' + v;
  }
  return v;
}

function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  const maxValid = Math.floor(0xffffffff / range) * range;
  let val = 0;
  do {
    window.crypto.getRandomValues(array);
    val = array[0];
  } while (val >= maxValid);
  return min + (val % range);
}

function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new Error('Enter a whole number between 1 and 3999.');
  }
  const map: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let n = num;
  let res = '';
  for (const [val, sym] of map) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}

function fromRoman(str: string): number {
  const s = str.trim().toUpperCase();
  if (!/^[IVXLCDM]+$/.test(s)) {
    throw new Error('Invalid Roman numeral characters.');
  }
  const vals: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = vals[s[i]];
    const next = vals[s[i + 1]] || 0;
    if (cur < next) total -= cur;
    else total += cur;
  }
  if (toRoman(total) !== s) {
    throw new Error('Non-standard Roman numeral sequence.');
  }
  return total;
}

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion'];

function integerToWords(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return `negative ${integerToWords(Math.abs(n))}`;
  let num = Math.floor(n);
  const parts: string[] = [];
  let scaleIdx = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords: string[] = [];
      const hundreds = Math.floor(chunk / 100);
      const rem = chunk % 100;
      if (hundreds > 0) {
        chunkWords.push(`${ONES[hundreds]} hundred`);
      }
      if (rem > 0) {
        if (rem < 20) {
          chunkWords.push(ONES[rem]);
        } else {
          const t = Math.floor(rem / 10);
          const o = rem % 10;
          chunkWords.push(o > 0 ? `${TENS[t]}-${ONES[o]}` : TENS[t]);
        }
      }
      if (SCALES[scaleIdx]) {
        chunkWords.push(SCALES[scaleIdx]);
      }
      parts.unshift(chunkWords.join(' '));
    }
    num = Math.floor(num / 1000);
    scaleIdx++;
  }
  return parts.join(' ');
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0').toUpperCase())
      .join('')
  );
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

// ==========================================
// QR GENERATOR SUB-COMPONENT (Debounced + Lazy)
// ==========================================
const QrGeneratorView: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [text, setText] = useState('https://zenvitools.app');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactUrl, setContactUrl] = useState('');

  const [fgColor, setFgColor] = useState('#38205F');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(320);
  const [previewPngUrl, setPreviewPngUrl] = useState('');

  let payload = text;
  if (toolId === 'wifi-qr-generator') {
    payload = `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
  } else if (toolId === 'contact-qr-generator') {
    payload = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contactName}`,
      contactOrg ? `ORG:${contactOrg}` : '',
      contactPhone ? `TEL:${contactPhone}` : '',
      contactEmail ? `EMAIL:${contactEmail}` : '',
      contactUrl ? `URL:${contactUrl}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');
  }

  // Debounced lightweight preview (280px) so typing on low-end Android is instant
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const content = payload.trim() || ' ';
        const url = await QRCode.toDataURL(content, {
          width: 280,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
        });
        if (active) setPreviewPngUrl(url);
      } catch {
        // Ignore transient QR encoding errors
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [payload, fgColor, bgColor]);

  const handleDownloadPng = async () => {
    const QRCode = (await import('qrcode')).default;
    const content = payload.trim() || ' ';
    const url = await QRCode.toDataURL(content, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    });
    downloadDataUrl(url, `${toolId}.png`);
  };

  const handleDownloadSvg = async () => {
    const QRCode = (await import('qrcode')).default;
    const content = payload.trim() || ' ';
    const svg = await QRCode.toString(content, {
      type: 'svg',
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    });
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${toolId}.svg`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-4">
        {toolId === 'wifi-qr-generator' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="MyHomeWiFi"
                className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-3.5 py-2.5 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Password
              </label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="Enter Wi-Fi password"
                className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-3.5 py-2.5 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Security Type
              </label>
              <select
                value={wifiType}
                onChange={(e) => setWifiType(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </>
        ) : toolId === 'contact-qr-generator' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 555 0199"
                className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={contactOrg}
                onChange={(e) => setContactOrg(e.target.value)}
                placeholder="Zenvi Studio"
                className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#38205F] mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={contactUrl}
                onChange={(e) => setContactUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              {toolId === 'url-qr-generator' ? 'Website URL' : 'Text or URL'}
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                toolId === 'url-qr-generator'
                  ? 'https://example.com'
                  : 'Enter text, link, or note...'
              }
              className="w-full rounded-xl border border-[#D6C6F7] px-3.5 py-2.5 text-base sm:text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Foreground
            </label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#D6C6F7] cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Background
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#D6C6F7] cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Export Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-10 rounded-lg border border-[#D6C6F7] bg-white px-2 text-xs font-mono-tabular"
            >
              <option value={256}>256×256</option>
              <option value={320}>320×320</option>
              <option value={512}>512×512</option>
              <option value={1024}>1024×1024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-2xl bg-[#F7F3FF] border border-[#E4D9FA]">
        {previewPngUrl && (
          <img
            src={previewPngUrl}
            alt="Generated QR Code"
            className="w-56 h-56 object-contain rounded-xl bg-white p-2 border border-[#E4D9FA]"
          />
        )}
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            disabled={!previewPngUrl}
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download PNG
          </button>
          <button
            type="button"
            disabled={!previewPngUrl}
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#38205F] bg-white border border-[#D6C6F7] hover:border-[#7045C6] cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download SVG
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// QR SCANNER SUB-COMPONENT (Throttled + Downscaled)
// ==========================================
const QrScannerView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const [scanning, setScanning] = useState(false);
  const [decoded, setDecoded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const stopCamera = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setError(null);
    setDecoded(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in this browser. Please upload an image instead.');
      return;
    }
    try {
      const jsQR = (await import('jsqr')).default;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      setScanning(true);

      const scanLoop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Downscale to max 640px width so low-end Android phones never freeze
          const scale = Math.min(1, 640 / (video.videoWidth || 640));
          canvas.width = Math.round(video.videoWidth * scale);
          canvas.height = Math.round(video.videoHeight * scale);
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height);
            if (code && code.data) {
              setDecoded(code.data);
              stopCamera();
              return;
            }
          }
        }
        timerRef.current = window.setTimeout(scanLoop, 150);
      };

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          timerRef.current = window.setTimeout(scanLoop, 200);
        }
      }, 100);
    } catch {
      setError('Camera permission denied or no camera found. You can upload a QR image below.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) {
      inputEl.value = '';
      return;
    }
    setError(null);
    setDecoded(null);
    let url: string | null = null;
    const canvas = document.createElement('canvas');
    try {
      const { readFileBytesImmediately } = await import('../utils/fileReader');
      const { loadHtmlImageFromBlob } = await import('../utils/imagePdf');
      const bytes = await readFileBytesImmediately(file);
      inputEl.value = '';
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      const blob = new Blob([copy], { type: file.type || 'image/png' });
      url = URL.createObjectURL(blob);

      const jsQR = (await import('jsqr')).default;
      const img = await loadHtmlImageFromBlob(blob, file.name);
      // Downscale large 12MP+ mobile photos to max 1000px for fast decoding
      const scale = Math.min(1, 1000 / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable.');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, imgData.width, imgData.height);
      if (code && code.data) {
        setDecoded(code.data);
      } else {
        setError('No QR code detected in this image. Ensure the QR code is clear and well-lit.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan image.');
    } finally {
      canvas.width = 0;
      canvas.height = 0;
      if (url) URL.revokeObjectURL(url);
      inputEl.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {!scanning ? (
          <button
            type="button"
            onClick={startCamera}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] cursor-pointer"
          >
            <Camera className="w-4 h-4" /> Start Camera Scan
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-700 bg-red-50 border border-red-200 cursor-pointer"
          >
            <CameraOff className="w-4 h-4" /> Stop Camera
          </button>
        )}

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#38205F] bg-[#F7F3FF] border border-[#D6C6F7] hover:border-[#7045C6] cursor-pointer">
          <Upload className="w-4 h-4 text-[#7045C6]" />
          <span>Upload QR Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {scanning && (
        <div className="rounded-2xl overflow-hidden border border-[#D6C6F7] bg-black max-w-md">
          <video ref={videoRef} className="w-full h-auto" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {decoded && (
        <div className="rounded-2xl bg-[#F7F3FF] border border-[#7045C6]/40 p-5 space-y-3">
          <p className="text-xs font-semibold text-[#7045C6]">Decoded QR Content</p>
          <p className="font-mono-tabular text-sm text-[#1E1533] break-all bg-white p-3.5 rounded-xl border border-[#E4D9FA]">
            {decoded}
          </p>
          <button
            type="button"
            onClick={async () => {
              if (await copyToClipboard(decoded)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7045C6] text-white cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN QR & OTHER TOOLS COMPONENT
// ==========================================
export const QrOtherTools: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  // Password generator
  const [pwLen, setPwLen] = useState(16);
  const [pwUpper, setPwUpper] = useState(true);
  const [pwLower, setPwLower] = useState(true);
  const [pwNums, setPwNums] = useState(true);
  const [pwSyms, setPwSyms] = useState(true);
  const [password, setPassword] = useState('');

  // Unit converters
  const [unitCat, setUnitCat] = useState<'length' | 'weight' | 'volume' | 'speed'>(
    toolId === 'weight-converter' ? 'weight' : 'length'
  );
  const [unitVal, setUnitVal] = useState('1');
  const [fromUnit, setFromUnit] = useState(
    toolId === 'weight-converter' ? 'kg' : 'km'
  );
  const [toUnit, setToUnit] = useState(
    toolId === 'weight-converter' ? 'lb' : 'mi'
  );
  const [tempVal, setTempVal] = useState('25');
  const [tempUnit, setTempUnit] = useState<'C' | 'F' | 'K'>('C');

  // Currency converter (Frankfurter API)
  const [currAmount, setCurrAmount] = useState('100');
  const [currFrom, setCurrFrom] = useState('USD');
  const [currTo, setCurrTo] = useState('EUR');
  const [currRate, setCurrRate] = useState<number | null>(null);
  const [currDate, setCurrDate] = useState<string | null>(null);
  const [currLoading, setCurrLoading] = useState(false);
  const [currError, setCurrError] = useState<string | null>(null);

  // Roman / Number to Words / Binary / Base64
  const [textInput, setTextInput] = useState('');
  const [romanMode, setRomanMode] = useState<'toRoman' | 'fromRoman'>('toRoman');

  // Color Picker & Converter
  const [colorHex, setColorHex] = useState('#7045C6');

  // Random Number Generator
  const [randMin, setRandMin] = useState('1');
  const [randMax, setRandMax] = useState('100');
  const [randCount, setRandCount] = useState('5');
  const [randUnique, setRandUnique] = useState(true);
  const [randResults, setRandResults] = useState<number[]>([]);
  const [randError, setRandError] = useState<string | null>(null);

  useEffect(() => {
    setTextInput('');
    setRandError(null);
    setRandResults([]);
  }, [toolId]);

  const generatePassword = () => {
    let charset = '';
    if (pwUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (pwLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (pwNums) charset += '0123456789';
    if (pwSyms) charset += '!@#$%^&*()-_=+[]{};:,.<>?';
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < pwLen; i++) {
      out += charset[secureRandomInt(0, charset.length - 1)];
    }
    setPassword(out);
  };

  useEffect(() => {
    if (toolId === 'password-generator') {
      generatePassword();
    }
  }, [toolId, pwLen, pwUpper, pwLower, pwNums, pwSyms]);

  useEffect(() => {
    if (toolId === 'currency-converter') {
      if (currFrom === currTo) {
        setCurrRate(1);
        setCurrDate(new Date().toISOString().split('T')[0]);
        setCurrError(null);
        return;
      }
      let active = true;
      setCurrLoading(true);
      setCurrError(null);
      fetch(`https://api.frankfurter.app/latest?from=${currFrom}&to=${currTo}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch exchange rates.');
          return res.json();
        })
        .then((data) => {
          if (active) {
            setCurrRate(data.rates?.[currTo] ?? null);
            setCurrDate(data.date ?? null);
          }
        })
        .catch(() => {
          if (active) {
            setCurrError(
              'Unable to reach the live exchange rate service (api.frankfurter.app). Please check your internet connection.'
            );
            setCurrRate(null);
          }
        })
        .finally(() => {
          if (active) setCurrLoading(false);
        });
      return () => {
        active = false;
      };
    }
  }, [toolId, currFrom, currTo]);

  const doCopy = async (val: string) => {
    if (await copyToClipboard(val)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // 1-5: QR TOOLS
  if (
    [
      'qr-code-generator',
      'wifi-qr-generator',
      'url-qr-generator',
      'contact-qr-generator',
    ].includes(toolId)
  ) {
    return <QrGeneratorView toolId={toolId} />;
  }

  if (toolId === 'qr-code-scanner') {
    return <QrScannerView />;
  }

  // 6: PASSWORD GENERATOR
  if (toolId === 'password-generator') {
    return (
      <div className="space-y-6 max-w-xl">
        <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-4 flex items-center justify-between gap-3">
          <span className="font-mono-tabular text-base sm:text-lg font-bold text-[#38205F] break-all">
            {password}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={generatePassword}
              aria-label="Regenerate password"
              className="p-2.5 rounded-xl bg-white border border-[#D6C6F7] text-[#38205F] hover:border-[#7045C6] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => doCopy(password)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#7045C6] text-white cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#38205F] mb-1">
            Password Length: {pwLen} characters
          </label>
          <input
            type="range"
            min={8}
            max={64}
            value={pwLen}
            onChange={(e) => setPwLen(Number(e.target.value))}
            className="w-full accent-[#7045C6]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-[#38205F]">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pwUpper}
              onChange={(e) => setPwUpper(e.target.checked)}
              className="w-4 h-4 accent-[#7045C6]"
            />
            <span>Uppercase (A–Z)</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pwLower}
              onChange={(e) => setPwLower(e.target.checked)}
              className="w-4 h-4 accent-[#7045C6]"
            />
            <span>Lowercase (a–z)</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pwNums}
              onChange={(e) => setPwNums(e.target.checked)}
              className="w-4 h-4 accent-[#7045C6]"
            />
            <span>Numbers (0–9)</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pwSyms}
              onChange={(e) => setPwSyms(e.target.checked)}
              className="w-4 h-4 accent-[#7045C6]"
            />
            <span>Symbols (!@#$...)</span>
          </label>
        </div>
      </div>
    );
  }

  // 8: TEMPERATURE CONVERTER
  if (toolId === 'temperature-converter') {
    const v = parseFloat(tempVal);
    const valid = tempVal.trim() !== '' && !isNaN(v);
    const c = valid
      ? tempUnit === 'C'
        ? v
        : tempUnit === 'F'
        ? ((v - 32) * 5) / 9
        : v - 273.15
      : 0;
    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;

    return (
      <div className="space-y-6 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Temperature Value
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={tempVal}
              onChange={(e) => setTempVal(sanitizeDecimal(e.target.value, true))}
              placeholder="25"
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-3.5 py-2.5 text-base sm:text-sm font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Input Unit
            </label>
            <select
              value={tempUnit}
              onChange={(e) => setTempUnit(e.target.value as 'C' | 'F' | 'K')}
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] bg-white px-3.5 py-2.5 text-sm"
            >
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
              <option value="K">Kelvin (K)</option>
            </select>
          </div>
        </div>

        {valid && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Celsius', val: `${c.toFixed(2)} °C` },
              { label: 'Fahrenheit', val: `${f.toFixed(2)} °F` },
              { label: 'Kelvin', val: `${k.toFixed(2)} K` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] p-3.5"
              >
                <p className="text-xs text-[#5B4D7A]">{item.label}</p>
                <p className="mt-1 font-mono-tabular font-bold text-base text-[#38205F]">
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 7, 9, 10: UNIT / LENGTH / WEIGHT CONVERTER
  if (
    toolId === 'unit-converter' ||
    toolId === 'length-converter' ||
    toolId === 'weight-converter'
  ) {
    const UNIT_TABLES: Record<
      'length' | 'weight' | 'volume' | 'speed',
      Record<string, { label: string; factor: number }>
    > = {
      length: {
        m: { label: 'Meters (m)', factor: 1 },
        km: { label: 'Kilometers (km)', factor: 1000 },
        cm: { label: 'Centimeters (cm)', factor: 0.01 },
        mm: { label: 'Millimeters (mm)', factor: 0.001 },
        mi: { label: 'Miles (mi)', factor: 1609.344 },
        yd: { label: 'Yards (yd)', factor: 0.9144 },
        ft: { label: 'Feet (ft)', factor: 0.3048 },
        in: { label: 'Inches (in)', factor: 0.0254 },
      },
      weight: {
        kg: { label: 'Kilograms (kg)', factor: 1 },
        g: { label: 'Grams (g)', factor: 0.001 },
        mg: { label: 'Milligrams (mg)', factor: 0.000001 },
        t: { label: 'Metric Tons (t)', factor: 1000 },
        lb: { label: 'Pounds (lb)', factor: 0.45359237 },
        oz: { label: 'Ounces (oz)', factor: 0.028349523125 },
      },
      volume: {
        l: { label: 'Liters (L)', factor: 1 },
        ml: { label: 'Milliliters (mL)', factor: 0.001 },
        gal: { label: 'US Gallons (gal)', factor: 3.785411784 },
        cup: { label: 'US Cups', factor: 0.2365882365 },
      },
      speed: {
        mps: { label: 'Meters/sec (m/s)', factor: 1 },
        kmh: { label: 'Kilometers/hr (km/h)', factor: 1 / 3.6 },
        mph: { label: 'Miles/hr (mph)', factor: 0.44704 },
        kn: { label: 'Knots (kn)', factor: 0.514444 },
      },
    };

    const activeCat =
      toolId === 'length-converter'
        ? 'length'
        : toolId === 'weight-converter'
        ? 'weight'
        : unitCat;
    const units = UNIT_TABLES[activeCat];
    const safeFrom = units[fromUnit] ? fromUnit : Object.keys(units)[0];
    const safeTo = units[toUnit] ? toUnit : Object.keys(units)[1] || Object.keys(units)[0];
    const num = parseFloat(unitVal);
    const valid = unitVal.trim() !== '' && !isNaN(num);
    const converted = valid
      ? (num * units[safeFrom].factor) / units[safeTo].factor
      : 0;

    return (
      <div className="space-y-6 max-w-2xl">
        {toolId === 'unit-converter' && (
          <div className="flex flex-wrap gap-2">
            {(['length', 'weight', 'volume', 'speed'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setUnitCat(cat);
                  const keys = Object.keys(UNIT_TABLES[cat]);
                  setFromUnit(keys[0]);
                  setToUnit(keys[1]);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
                  activeCat === cat
                    ? 'bg-[#7045C6] text-white'
                    : 'bg-[#F7F3FF] text-[#38205F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Value
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={unitVal}
              onChange={(e) => setUnitVal(sanitizeDecimal(e.target.value, true))}
              placeholder="1"
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-3.5 py-2.5 text-base sm:text-sm font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              From
            </label>
            <select
              value={safeFrom}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] bg-white px-3 py-2.5 text-sm"
            >
              {Object.entries(units).map(([k, u]) => (
                <option key={k} value={k}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              To
            </label>
            <select
              value={safeTo}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] bg-white px-3 py-2.5 text-sm"
            >
              {Object.entries(units).map(([k, u]) => (
                <option key={k} value={k}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {valid && (
          <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-5">
            <p className="text-xs text-[#5B4D7A]">Converted Result</p>
            <p className="mt-1 text-2xl font-bold font-mono-tabular text-[#7045C6]">
              {converted.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
              <span className="text-base text-[#38205F]">{units[safeTo].label}</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // 11: CURRENCY CONVERTER
  if (toolId === 'currency-converter') {
    const currencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD', 'NZD', 'SEK', 'NOK', 'MXN', 'BRL', 'ZAR',
    ];
    const amt = parseFloat(currAmount);
    const valid = currAmount.trim() !== '' && !isNaN(amt) && amt >= 0 && currRate !== null;

    return (
      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Amount
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={currAmount}
              onChange={(e) => setCurrAmount(sanitizeDecimal(e.target.value, false))}
              placeholder="100"
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-3.5 py-2.5 text-base sm:text-sm font-mono-tabular"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              From
            </label>
            <select
              value={currFrom}
              onChange={(e) => setCurrFrom(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] bg-white px-3 py-2.5 text-sm font-semibold"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              To
            </label>
            <select
              value={currTo}
              onChange={(e) => setCurrTo(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] bg-white px-3 py-2.5 text-sm font-semibold"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrFrom(currTo);
            setCurrTo(currFrom);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7045C6] hover:underline cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Currencies
        </button>

        {currLoading && (
          <p className="text-sm text-[#5B4D7A]">Fetching latest reference rate...</p>
        )}

        {currError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{currError}</span>
          </div>
        )}

        {valid && !currLoading && (
          <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-5 space-y-1.5">
            <p className="text-xs text-[#5B4D7A] font-mono-tabular">
              {amt} {currFrom} =
            </p>
            <p className="text-2xl font-bold font-mono-tabular text-[#7045C6]">
              {(amt * currRate!).toFixed(2)} {currTo}
            </p>
            <p className="text-xs text-[#5B4D7A] pt-1 font-mono-tabular">
              1 {currFrom} = {currRate} {currTo} · Last updated: {currDate} (ECB reference rate)
            </p>
          </div>
        )}
      </div>
    );
  }

  // 12: ROMAN NUMERAL CONVERTER
  if (toolId === 'roman-numeral-converter') {
    let result = '';
    let err: string | null = null;
    if (textInput.trim()) {
      try {
        if (romanMode === 'toRoman') {
          result = toRoman(Number(textInput.trim()));
        } else {
          result = String(fromRoman(textInput));
        }
      } catch (e) {
        err = e instanceof Error ? e.message : 'Invalid input';
      }
    }

    return (
      <div className="space-y-5 max-w-xl">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setRomanMode('toRoman');
              setTextInput('');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
              romanMode === 'toRoman'
                ? 'bg-[#7045C6] text-white'
                : 'bg-[#F7F3FF] text-[#38205F]'
            }`}
          >
            Number → Roman
          </button>
          <button
            type="button"
            onClick={() => {
              setRomanMode('fromRoman');
              setTextInput('');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
              romanMode === 'fromRoman'
                ? 'bg-[#7045C6] text-white'
                : 'bg-[#F7F3FF] text-[#38205F]'
            }`}
          >
            Roman → Number
          </button>
        </div>

        <input
          type="text"
          inputMode={romanMode === 'toRoman' ? 'numeric' : 'text'}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={
            romanMode === 'toRoman'
              ? 'Enter integer (1–3999), e.g., 2026'
              : 'Enter Roman numeral, e.g., MMXXVI'
          }
          className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-4 py-3 text-base sm:text-sm font-mono-tabular"
        />

        {err && <p className="text-sm text-red-600">{err}</p>}
        {result && (
          <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#5B4D7A]">Converted Result</p>
              <p className="text-2xl font-bold font-mono-tabular text-[#7045C6]">
                {result}
              </p>
            </div>
            <button
              type="button"
              onClick={() => doCopy(result)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#7045C6] text-white cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 13: NUMBER TO WORDS CONVERTER
  if (toolId === 'number-to-words-converter') {
    let wordsOut = '';
    let err: string | null = null;
    if (textInput.trim()) {
      const cleaned = textInput.trim().replace(/,/g, '');
      if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
        err = 'Please enter a valid number.';
      } else {
        const [intPart, decPart] = cleaned.split('.');
        const intNum = Number(intPart);
        if (!Number.isSafeInteger(intNum)) {
          err = 'Number is too large for exact conversion.';
        } else {
          wordsOut = integerToWords(intNum);
          if (decPart) {
            const decWords = decPart
              .split('')
              .map((d) => (d === '0' ? 'zero' : ONES[Number(d)]))
              .join(' ');
            wordsOut += ` point ${decWords}`;
          }
        }
      }
    }

    return (
      <div className="space-y-5 max-w-xl">
        <input
          type="text"
          inputMode="decimal"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter a number, e.g., 1450.75"
          className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-4 py-3 text-base sm:text-sm font-mono-tabular"
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {wordsOut && (
          <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-5 space-y-3">
            <p className="text-xs text-[#5B4D7A]">In Words</p>
            <p className="text-base font-semibold text-[#38205F] capitalize">
              {wordsOut}
            </p>
            <button
              type="button"
              onClick={() => doCopy(wordsOut)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#7045C6] text-white cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 14 & 15: BINARY <-> DECIMAL CONVERTER
  if (
    toolId === 'binary-to-decimal-converter' ||
    toolId === 'decimal-to-binary-converter'
  ) {
    const isBinToDec = toolId === 'binary-to-decimal-converter';
    let decVal: bigint | null = null;
    let err: string | null = null;

    if (textInput.trim()) {
      try {
        if (isBinToDec) {
          const clean = textInput.replace(/\s+/g, '');
          if (!/^[01]+$/.test(clean)) throw new Error('Binary input must contain only 0 and 1.');
          decVal = BigInt('0b' + clean);
        } else {
          const clean = textInput.trim();
          if (!/^\d+$/.test(clean)) throw new Error('Enter a non-negative whole decimal integer.');
          decVal = BigInt(clean);
        }
      } catch (e) {
        err = e instanceof Error ? e.message : 'Invalid number';
      }
    }

    return (
      <div className="space-y-5 max-w-xl">
        <input
          type="text"
          inputMode="numeric"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={
            isBinToDec
              ? 'Enter binary (e.g., 101010)'
              : 'Enter decimal integer (e.g., 255)'
          }
          className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-4 py-3 text-base sm:text-sm font-mono-tabular"
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {decVal !== null && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] p-3.5">
              <p className="text-xs text-[#5B4D7A]">Decimal (Base 10)</p>
              <p className="mt-1 font-mono-tabular font-bold text-base text-[#38205F] break-all">
                {decVal.toString(10)}
              </p>
            </div>
            <div className="rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] p-3.5">
              <p className="text-xs text-[#5B4D7A]">Binary (Base 2)</p>
              <p className="mt-1 font-mono-tabular font-bold text-base text-[#7045C6] break-all">
                {decVal.toString(2)}
              </p>
            </div>
            <div className="rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] p-3.5">
              <p className="text-xs text-[#5B4D7A]">Hexadecimal (Base 16)</p>
              <p className="mt-1 font-mono-tabular font-bold text-base text-[#38205F] break-all">
                {decVal.toString(16).toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 16 & 17: BASE64 ENCODER / DECODER
  if (toolId === 'base64-encoder' || toolId === 'base64-decoder') {
    const isEncode = toolId === 'base64-encoder';
    let out = '';
    let err: string | null = null;
    if (textInput) {
      try {
        if (isEncode) {
          const bytes = new TextEncoder().encode(textInput);
          let bin = '';
          bytes.forEach((b) => (bin += String.fromCharCode(b)));
          out = btoa(bin);
        } else {
          const bin = atob(textInput.trim());
          const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
          out = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        }
      } catch {
        err = isEncode
          ? 'Could not encode text.'
          : 'Invalid Base64 string. Please check for missing padding or invalid characters.';
      }
    }

    return (
      <div className="space-y-4">
        <textarea
          rows={5}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={
            isEncode
              ? 'Enter plain text to encode to Base64...'
              : 'Paste Base64 string to decode...'
          }
          className="w-full rounded-xl border border-[#D6C6F7] p-3.5 text-base sm:text-sm font-mono-tabular"
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <textarea
          rows={5}
          readOnly
          value={out}
          placeholder="Output appears here..."
          className="w-full rounded-xl border border-[#D6C6F7] bg-[#F7F3FF]/50 p-3.5 text-base sm:text-sm font-mono-tabular"
        />
        <button
          type="button"
          disabled={!out}
          onClick={() => doCopy(out)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] disabled:opacity-50 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Output'}</span>
        </button>
      </div>
    );
  }

  // 18 & 19: COLOR PICKER & COLOR CODE CONVERTER
  if (toolId === 'color-picker' || toolId === 'color-code-converter') {
    const parsedRgb = hexToRgb(colorHex);
    const isValidHex = parsedRgb !== null;
    const rgb = parsedRgb || { r: 112, g: 69, b: 198 };
    const normalizedHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const cmykStr = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

    return (
      <div className="space-y-6 max-w-xl">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={normalizedHex}
            onChange={(e) => setColorHex(e.target.value)}
            aria-label="Pick color"
            className="w-16 h-16 rounded-2xl border border-[#D6C6F7] cursor-pointer shrink-0"
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              HEX Color Code
            </label>
            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              placeholder="#7045C6"
              className="w-full min-h-[44px] rounded-xl border border-[#D6C6F7] px-3.5 py-2.5 text-base sm:text-sm font-mono-tabular"
            />
          </div>
        </div>

        {!isValidHex && (
          <p className="text-xs text-amber-700">
            Enter a valid 3-digit or 6-digit HEX code (e.g., #7045C6).
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'HEX', val: normalizedHex },
            { label: 'RGB', val: rgbStr },
            { label: 'HSL', val: hslStr },
            { label: 'CMYK', val: cmykStr },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] p-3.5 flex items-center justify-between gap-2"
            >
              <div>
                <p className="text-xs text-[#5B4D7A]">{c.label}</p>
                <p className="font-mono-tabular font-semibold text-sm text-[#38205F]">
                  {c.val}
                </p>
              </div>
              <button
                type="button"
                onClick={() => doCopy(c.val)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#D6C6F7] text-[#7045C6] hover:border-[#7045C6] cursor-pointer"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 20: RANDOM NUMBER GENERATOR
  const runRandom = () => {
    setRandError(null);
    const min = parseInt(randMin, 10);
    const max = parseInt(randMax, 10);
    const count = parseInt(randCount, 10);
    if (isNaN(min) || isNaN(max) || isNaN(count) || count < 1 || count > 1000) {
      setRandError('Enter valid integers (Count between 1 and 1000).');
      return;
    }
    if (min > max) {
      setRandError('Minimum must be less than or equal to Maximum.');
      return;
    }
    if (randUnique && count > max - min + 1) {
      setRandError('Range is too small to generate that many unique numbers.');
      return;
    }

    const out: number[] = [];
    const seen = new Set<number>();
    while (out.length < count) {
      const n = secureRandomInt(min, max);
      if (randUnique) {
        if (!seen.has(n)) {
          seen.add(n);
          out.push(n);
        }
      } else {
        out.push(n);
      }
    }
    setRandResults(out);
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#38205F] mb-1">
            Minimum
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={randMin}
            onChange={(e) => setRandMin(sanitizeInteger(e.target.value, true))}
            className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#38205F] mb-1">
            Maximum
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={randMax}
            onChange={(e) => setRandMax(sanitizeInteger(e.target.value, true))}
            className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#38205F] mb-1">
            How Many
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={randCount}
            onChange={(e) => setRandCount(sanitizeInteger(e.target.value, false))}
            className="w-full min-h-[42px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-[#38205F] cursor-pointer">
        <input
          type="checkbox"
          checked={randUnique}
          onChange={(e) => setRandUnique(e.target.checked)}
          className="w-4 h-4 accent-[#7045C6]"
        />
        <span>Unique numbers only (no duplicates)</span>
      </label>

      <div>
        <button
          type="button"
          onClick={runRandom}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] cursor-pointer"
        >
          Generate Numbers
        </button>
      </div>

      {randError && <p className="text-sm text-red-600">{randError}</p>}

      {randResults.length > 0 && (
        <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-5 space-y-3">
          <p className="text-xs font-semibold text-[#5B4D7A]">Generated Numbers</p>
          <p className="font-mono-tabular text-lg font-bold text-[#38205F] break-words">
            {randResults.join(', ')}
          </p>
          <button
            type="button"
            onClick={() => doCopy(randResults.join(', '))}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#7045C6] text-white cursor-pointer"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};
