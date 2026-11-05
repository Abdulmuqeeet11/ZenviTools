import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, Volume2, Square, Pause, Play, AlertCircle } from 'lucide-react';
import { copyToClipboard } from '../utils/download';

const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus, nulla gravida orci a odio.',
  'Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
  'Integer in mauris eu nibh euismod gravida.',
];

const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet',
]);

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/(\s+)/)
    .map((token, index, arr) => {
      if (/^\s+$/.test(token)) return token;
      const isFirst = index === 0;
      const isLast = index === arr.length - 1;
      if (!isFirst && !isLast && MINOR_WORDS.has(token)) {
        return token;
      }
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join('');
}

export const TextTools: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Options for specific text tools
  const [preserveNewlines, setPreserveNewlines] = useState(true);
  const [caseSensitiveDupes, setCaseSensitiveDupes] = useState(true);
  const [sortDupes, setSortDupes] = useState(false);
  const [reverseMode, setReverseMode] = useState<'chars' | 'words' | 'lines'>('chars');
  const [wpmInput, setWpmInput] = useState('200');

  // Text Cleaner options
  const [stripHtml, setStripHtml] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);

  // Lorem Ipsum options
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [loremCountInput, setLoremCountInput] = useState('3');
  const [loremOutput, setLoremOutput] = useState('');

  // Text to Speech state
  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (toolId === 'text-to-speech' && speechSupported) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        setVoices(list);
        if (list.length > 0 && !selectedVoice) {
          setSelectedVoice(list[0].name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, [toolId, speechSupported, selectedVoice]);

  useEffect(() => {
    if (toolId === 'lorem-ipsum-generator') {
      const parsed = parseInt(loremCountInput, 10);
      generateLorem(loremType, isNaN(parsed) || parsed < 1 ? 1 : parsed);
    }
  }, [toolId, loremType, loremCountInput]);

  const generateLorem = (type: 'paragraphs' | 'sentences' | 'words', count: number) => {
    const safeCount = Math.max(1, Math.min(50, count));
    if (type === 'sentences') {
      const out: string[] = [];
      for (let i = 0; i < safeCount; i++) {
        out.push(LOREM_SENTENCES[i % LOREM_SENTENCES.length]);
      }
      setLoremOutput(out.join(' '));
    } else if (type === 'paragraphs') {
      const paras: string[] = [];
      for (let p = 0; p < safeCount; p++) {
        const sents: string[] = [];
        for (let s = 0; s < 4; s++) {
          sents.push(LOREM_SENTENCES[(p * 4 + s) % LOREM_SENTENCES.length]);
        }
        paras.push(sents.join(' '));
      }
      setLoremOutput(paras.join('\n\n'));
    } else {
      const allWords = LOREM_SENTENCES.join(' ').split(/\s+/);
      const words: string[] = [];
      for (let w = 0; w < safeCount; w++) {
        words.push(allWords[w % allWords.length]);
      }
      setLoremOutput(words.join(' '));
    }
  };

  const handleCopy = async (val: string) => {
    if (!val) return;
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // LOREM IPSUM GENERATOR
  if (toolId === 'lorem-ipsum-generator') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Generate By
            </label>
            <select
              value={loremType}
              onChange={(e) =>
                setLoremType(e.target.value as 'paragraphs' | 'sentences' | 'words')
              }
              className="w-full rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Count (1–50)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={loremCountInput}
              onChange={(e) => setLoremCountInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="3"
              className="w-full min-h-[42px] rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-base sm:text-sm font-mono-tabular"
            />
          </div>
        </div>

        <textarea
          rows={8}
          readOnly
          value={loremOutput}
          aria-label="Generated Lorem Ipsum"
          className="w-full rounded-xl border border-[#D6C6F7] bg-[#F7F3FF]/40 p-4 text-sm text-[#1E1533] leading-relaxed"
        />

        <button
          type="button"
          onClick={() => handleCopy(loremOutput)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Placeholder Text'}</span>
        </button>
      </div>
    );
  }

  // TEXT TO SPEECH
  if (toolId === 'text-to-speech') {
    const startSpeak = () => {
      if (!speechSupported || !text.trim()) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      utter.rate = rate;
      utter.pitch = pitch;
      utter.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      utter.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      utter.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };
      window.speechSynthesis.speak(utter);
    };

    return (
      <div className="space-y-5">
        {!speechSupported && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Your current browser does not support the Web Speech API
              (window.speechSynthesis). Please try Chrome, Edge, or Safari.
            </span>
          </div>
        )}

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste the text you want to hear spoken aloud..."
          className="w-full rounded-xl border border-[#D6C6F7] bg-white p-4 text-sm text-[#1E1533] focus:outline-none focus:border-[#7045C6]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA]">
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={!speechSupported || voices.length === 0}
              className="w-full rounded-lg border border-[#D6C6F7] bg-white px-3 py-2 text-sm"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Speed: {rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#7045C6]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#38205F] mb-1">
              Pitch: {pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-[#7045C6]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!speechSupported || !text.trim()}
            onClick={startSpeak}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] disabled:opacity-50 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak</span>
          </button>

          {speaking && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (paused) {
                    window.speechSynthesis.resume();
                    setPaused(false);
                  } else {
                    window.speechSynthesis.pause();
                    setPaused(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#F7F3FF] text-[#38205F] border border-[#D6C6F7] cursor-pointer"
              >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{paused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setSpeaking(false);
                  setPaused(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 border border-red-200 cursor-pointer"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ANALYSIS / COUNTER TOOLS
  const isCounterTool = [
    'word-counter',
    'character-counter',
    'sentence-counter',
    'paragraph-counter',
    'reading-time-calculator',
  ].includes(toolId);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const utf8Bytes = new TextEncoder().encode(text).length;
  const sentences = text.trim()
    ? text
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean).length
    : 0;
  const paragraphs = text.trim()
    ? text
        .split(/\r?\n+/)
        .map((p) => p.trim())
        .filter(Boolean).length
    : 0;
  const parsedWpm = Math.max(50, parseInt(wpmInput, 10) || 200);
  const readMins = words / parsedWpm;
  const speakMins = words / 140;

  const formatDuration = (mins: number) => {
    const totalSec = Math.round(mins * 60);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (isCounterTool) {
    return (
      <div className="space-y-5">
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full rounded-xl border border-[#D6C6F7] bg-white p-4 text-sm text-[#1E1533] focus:outline-none focus:border-[#7045C6]"
        />

        {toolId === 'reading-time-calculator' && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-[#38205F]">
              Reading Speed (WPM):
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={wpmInput}
              onChange={(e) => setWpmInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="200"
              className="w-24 min-h-[40px] rounded-lg border border-[#D6C6F7] px-3 py-1.5 text-base sm:text-sm font-mono-tabular"
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Words', value: words.toLocaleString() },
            { label: 'Characters', value: charsWithSpaces.toLocaleString() },
            { label: 'No Spaces', value: charsWithoutSpaces.toLocaleString() },
            { label: 'Sentences', value: sentences.toLocaleString() },
            { label: 'Paragraphs', value: paragraphs.toLocaleString() },
            { label: 'Reading Time', value: formatDuration(readMins) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] p-3.5"
            >
              <p className="text-xs text-[#5B4D7A]">{stat.label}</p>
              <p className="mt-1 text-lg font-bold font-mono-tabular text-[#38205F]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {toolId === 'character-counter' && (
          <p className="text-xs font-mono-tabular text-[#5B4D7A]">
            UTF-8 Byte Length: <strong>{utf8Bytes.toLocaleString()} bytes</strong>
          </p>
        )}
        {toolId === 'reading-time-calculator' && (
          <p className="text-xs font-mono-tabular text-[#5B4D7A]">
            Estimated Speaking Time (140 WPM):{' '}
            <strong>{formatDuration(speakMins)}</strong>
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleCopy(text)}
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7045C6] text-white disabled:opacity-50 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            type="button"
            onClick={() => setText('')}
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F3FF] text-[#38205F] border border-[#D6C6F7] disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    );
  }

  // TRANSFORM TOOLS
  let transformed = text;
  if (toolId === 'uppercase-converter') {
    transformed = text.toUpperCase();
  } else if (toolId === 'lowercase-converter') {
    transformed = text.toLowerCase();
  } else if (toolId === 'title-case-converter') {
    transformed = toTitleCase(text);
  } else if (toolId === 'remove-extra-spaces') {
    if (preserveNewlines) {
      transformed = text
        .split(/\r?\n/)
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .join('\n');
    } else {
      transformed = text.replace(/\s+/g, ' ').trim();
    }
  } else if (toolId === 'remove-duplicate-lines') {
    const lines = text.split(/\r?\n/);
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const line of lines) {
      const key = caseSensitiveDupes ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }
    if (sortDupes) unique.sort((x, y) => x.localeCompare(y));
    transformed = unique.join('\n');
  } else if (toolId === 'text-reverser') {
    if (reverseMode === 'chars') {
      transformed = Array.from(text).reverse().join('');
    } else if (reverseMode === 'words') {
      transformed = text.split(/(\s+)/).reverse().join('');
    } else {
      transformed = text.split(/\r?\n/).reverse().join('\n');
    }
  } else if (toolId === 'text-cleaner') {
    let out = text;
    if (stripHtml) {
      const doc = new DOMParser().parseFromString(out, 'text/html');
      out = doc.body.textContent || '';
    }
    if (collapseSpaces) {
      out = out
        .split(/\r?\n/)
        .map((l) => l.replace(/[ \t]+/g, ' ').trim())
        .join('\n');
    }
    if (removeEmptyLines) {
      out = out
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0)
        .join('\n');
    }
    transformed = out;
  }

  return (
    <div className="space-y-5">
      {toolId === 'remove-extra-spaces' && (
        <label className="inline-flex items-center gap-2 text-sm text-[#38205F] cursor-pointer">
          <input
            type="checkbox"
            checked={preserveNewlines}
            onChange={(e) => setPreserveNewlines(e.target.checked)}
            className="accent-[#7045C6]"
          />
          <span>Preserve line breaks</span>
        </label>
      )}

      {toolId === 'remove-duplicate-lines' && (
        <div className="flex flex-wrap gap-5 text-sm text-[#38205F]">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitiveDupes}
              onChange={(e) => setCaseSensitiveDupes(e.target.checked)}
              className="accent-[#7045C6]"
            />
            <span>Case-sensitive matching</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sortDupes}
              onChange={(e) => setSortDupes(e.target.checked)}
              className="accent-[#7045C6]"
            />
            <span>Sort lines alphabetically</span>
          </label>
        </div>
      )}

      {toolId === 'text-reverser' && (
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'chars', label: 'Reverse Characters' },
            { id: 'words', label: 'Reverse Words' },
            { id: 'lines', label: 'Reverse Lines' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setReverseMode(m.id as 'chars' | 'words' | 'lines')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                reverseMode === m.id
                  ? 'bg-[#7045C6] text-white'
                  : 'bg-[#F7F3FF] text-[#38205F]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {toolId === 'text-cleaner' && (
        <div className="flex flex-wrap gap-5 text-sm text-[#38205F]">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stripHtml}
              onChange={(e) => setStripHtml(e.target.checked)}
              className="accent-[#7045C6]"
            />
            <span>Strip HTML tags</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={collapseSpaces}
              onChange={(e) => setCollapseSpaces(e.target.checked)}
              className="accent-[#7045C6]"
            />
            <span>Collapse extra spaces</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="accent-[#7045C6]"
            />
            <span>Remove empty lines</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#38205F] mb-1.5">
            Input Text
          </label>
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your input text..."
            className="w-full rounded-xl border border-[#D6C6F7] bg-white p-3.5 text-sm text-[#1E1533] focus:outline-none focus:border-[#7045C6]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#38205F] mb-1.5">
            Output Result
          </label>
          <textarea
            rows={7}
            readOnly
            value={transformed}
            placeholder="Transformed output appears here..."
            className="w-full rounded-xl border border-[#D6C6F7] bg-[#F7F3FF]/50 p-3.5 text-sm text-[#1E1533]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleCopy(transformed)}
          disabled={!transformed}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] disabled:opacity-50 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Output'}</span>
        </button>
        <button
          type="button"
          onClick={() => setText('')}
          disabled={!text}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#F7F3FF] text-[#38205F] border border-[#D6C6F7] disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
