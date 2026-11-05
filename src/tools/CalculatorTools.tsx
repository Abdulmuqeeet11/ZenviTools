'use client';
import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Trash2, AlertCircle, Copy, Check, Calculator } from 'lucide-react';
import {
  GRADE_POINTS,
  CalcOutput,
  sanitizeDecimal,
  sanitizeInteger,
  calculatePercentage,
  calculateAge,
  calculateGpa,
  calculateCgpa,
  calculateDiscount,
  calculateProfitLoss,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateBmi,
  calculateAverage,
  calculateRatio,
  calculateFraction,
  calculateDateDifference,
  calculateTimeDuration,
  calculateLoanEmi,
  calculateSalary,
  calculateTax,
  calculateTip,
  calculateMarksheet,
  evaluateMathExpression,
} from '../utils/calculatorEngine';

const InputField: React.FC<{
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  kind?: 'decimal' | 'positive-decimal' | 'integer' | 'positive-integer' | 'date' | 'time';
  placeholder?: string;
}> = ({ label, hint, value, onChange, kind = 'decimal', placeholder }) => {
  const isDateOrTime = kind === 'date' || kind === 'time';
  const inputMode =
    kind === 'integer' || kind === 'positive-integer'
      ? 'numeric'
      : kind === 'decimal' || kind === 'positive-decimal'
      ? 'decimal'
      : undefined;

  const handleChange = (raw: string) => {
    if (kind === 'decimal') onChange(sanitizeDecimal(raw, true));
    else if (kind === 'positive-decimal') onChange(sanitizeDecimal(raw, false));
    else if (kind === 'integer') onChange(sanitizeInteger(raw, true));
    else if (kind === 'positive-integer') onChange(sanitizeInteger(raw, false));
    else onChange(raw);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-[#38205F] mb-1">
        {label}
      </label>
      <input
        type={isDateOrTime ? kind : 'text'}
        inputMode={inputMode}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3.5 py-2.5 text-base font-mono-tabular text-[#1E1533] placeholder:text-[#9A8BB8] focus:outline-none focus:border-[#7045C6] focus:ring-2 focus:ring-[#7045C6]/15"
      />
      {hint && <p className="mt-1 text-xs text-[#5B4D7A] leading-snug">{hint}</p>}
    </div>
  );
};

const ValidationAlert: React.FC<{ message: string }> = ({ message }) => (
  <div
    role="alert"
    className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
  >
    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
    <span>{message}</span>
  </div>
);

const CalculatorShell: React.FC<{
  intro: string;
  example: string;
  hasAnyInput: boolean;
  submitted: boolean;
  output: CalcOutput;
  onCalculate: () => void;
  onReset: () => void;
  children: React.ReactNode;
}> = ({
  intro,
  example,
  hasAnyInput,
  submitted,
  output,
  onCalculate,
  onReset,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!output.copyText) return;
    try {
      await navigator.clipboard.writeText(output.copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const showError = Boolean(output.error) && (hasAnyInput || submitted);
  const showResult = !output.error && output.items.length > 0;

  return (
    <div className="space-y-6">
      {/* 1. One-line beginner-friendly explanation */}
      <p className="text-sm sm:text-base text-[#4A3B69] bg-[#F7F3FF] border border-[#E4D9FA] rounded-xl px-4 py-3">
        {intro}
      </p>

      {/* 2. Clearly labelled input fields */}
      <div className="space-y-4">{children}</div>

      {/* 3. Action buttons: Calculate, Reset, Copy Result */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onCalculate}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] transition-colors cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          Calculate
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold text-[#38205F] bg-[#F7F3FF] border border-[#D6C6F7] hover:bg-[#EDE4FF] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        {showResult && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold text-[#7045C6] bg-white border border-[#D6C6F7] hover:bg-[#F7F3FF] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        )}
      </div>

      {/* Validation error */}
      {showError && output.error && <ValidationAlert message={output.error} />}

      {/* 4. Large, prominent Result section + 5. Step-by-step explanation */}
      {showResult && (
        <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {output.items.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-4 border ${
                  item.highlight
                    ? 'bg-white border-[#7045C6]/50 shadow-2xs sm:col-span-2 lg:col-span-1'
                    : 'bg-white/80 border-[#E4D9FA]'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5B4D7A]">
                  {item.label}
                </p>
                <p
                  className={`mt-1.5 font-mono-tabular font-bold break-words ${
                    item.highlight
                      ? 'text-2xl sm:text-3xl text-[#7045C6]'
                      : 'text-lg text-[#38205F]'
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {output.steps.length > 0 && (
            <div className="pt-3 border-t border-[#E4D9FA]">
              <p className="text-xs font-bold uppercase tracking-wide text-[#38205F] mb-2">
                How this was calculated
              </p>
              <ol className="space-y-1.5 text-sm text-[#4A3B69] list-decimal list-inside">
                {output.steps.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* 6. Simple Example */}
      <div className="rounded-xl bg-white border border-[#E4D9FA] px-4 py-3 text-xs sm:text-sm text-[#5B4D7A]">
        <strong className="text-[#38205F]">Example:</strong> {example}
      </div>
    </div>
  );
};

function getDefaultMode(toolId: string): string {
  switch (toolId) {
    case 'compound-interest-calculator':
      return '12';
    case 'salary-calculator':
      return 'hourly';
    case 'tax-percentage-calculator':
      return 'add';
    case 'simple-interest-calculator':
    case 'loan-emi-calculator':
      return 'years';
    default:
      return 'mode1';
  }
}

export const CalculatorTools: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [mode, setMode] = useState(() => getDefaultMode(toolId));
  const [submitted, setSubmitted] = useState(false);

  const [gpaRows, setGpaRows] = useState([
    { name: 'Course 1', credits: '3', grade: 'A' },
    { name: 'Course 2', credits: '4', grade: 'B+' },
    { name: 'Course 3', credits: '3', grade: 'A-' },
  ]);
  const [cgpaRows, setCgpaRows] = useState([
    { semester: 'Semester 1', gpa: '3.6', credits: '15' },
    { semester: 'Semester 2', gpa: '3.8', credits: '16' },
  ]);
  const [markRows, setMarkRows] = useState([
    { subject: 'Mathematics', obtained: '88', max: '100' },
    { subject: 'Science', obtained: '92', max: '100' },
    { subject: 'English', obtained: '84', max: '100' },
  ]);

  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [numberList, setNumberList] = useState('12, 18, 24, 30, 36');
  const [fracOp, setFracOp] = useState<'+' | '-' | '*' | '/'>('+');

  const [date1, setDate1] = useState('1998-05-15');
  const [date2, setDate2] = useState(() => new Date().toISOString().split('T')[0]);
  const [time1, setTime1] = useState('09:00');
  const [time2, setTime2] = useState('17:30');
  const [overnight, setOvernight] = useState(false);

  const [sciExpr, setSciExpr] = useState('');
  const [sciDeg, setSciDeg] = useState(true);
  const [sciError, setSciError] = useState<string | null>(null);
  const [sciResult, setSciResult] = useState<string | null>(null);
  const [sciCopied, setSciCopied] = useState(false);

  useEffect(() => {
    setA('');
    setB('');
    setC('');
    setD('');
    setMode(getDefaultMode(toolId));
    setSubmitted(false);
    setSciExpr('');
    setSciError(null);
    setSciResult(null);
  }, [toolId]);

  const handleReset = () => {
    setA('');
    setB('');
    setC('');
    setD('');
    setSubmitted(false);
    setSciExpr('');
    setSciError(null);
    setSciResult(null);
  };

  // 1. PERCENTAGE CALCULATOR
  if (toolId === 'percentage-calculator') {
    const pctMode = (mode === 'mode2' || mode === 'mode3' ? mode : 'mode1') as
      | 'mode1'
      | 'mode2'
      | 'mode3';
    const output = calculatePercentage(pctMode, a, b);

    const modeMeta = {
      mode1: {
        title: 'Find a percentage of a number',
        desc: 'Use this when you want to know what a certain percent of a number equals.',
        labelA: 'Percentage (%)',
        hintA: 'Enter the percent rate (for example, 15 for 15%).',
        placeholderA: 'e.g. 15',
        labelB: 'Number',
        hintB: 'Enter the number you want to find the percentage of.',
        placeholderB: 'e.g. 240',
        example: 'What is 15% of 240? Enter 15 and 240 → Answer: 36.',
      },
      mode2: {
        title: 'Find what percentage one number is of another',
        desc: 'Use this to see how big a part is compared to a total, shown as a percentage.',
        labelA: 'Part Number',
        hintA: 'Enter the smaller or partial amount.',
        placeholderA: 'e.g. 45',
        labelB: 'Total Number',
        hintB: 'Enter the whole or total amount (cannot be 0).',
        placeholderB: 'e.g. 180',
        example: '45 is what percentage of 180? Enter 45 and 180 → Answer: 25%.',
      },
      mode3: {
        title: 'Calculate percentage increase or decrease',
        desc: 'Use this to find how much a price, score, or number grew or dropped in percent.',
        labelA: 'Starting Value',
        hintA: 'Enter the original number before the change (cannot be 0).',
        placeholderA: 'e.g. 100',
        labelB: 'New Value',
        hintB: 'Enter the new number after the change.',
        placeholderB: 'e.g. 120',
        example: 'Price increased from 100 to 120. Enter 100 and 120 → Answer: +20% (Increase).',
      },
    }[pctMode];

    return (
      <CalculatorShell
        intro="Calculate percentages easily in three everyday ways—pick a mode below and enter your numbers."
        example={modeMeta.example}
        hasAnyInput={a.trim() !== '' && b.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(
            [
              { id: 'mode1', num: 'Mode 1', title: 'Percentage of a number' },
              { id: 'mode2', num: 'Mode 2', title: 'What % one number is of another' },
              { id: 'mode3', num: 'Mode 3', title: 'Percentage increase / decrease' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setSubmitted(false);
              }}
              className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                pctMode === m.id
                  ? 'bg-[#7045C6] text-white border-[#7045C6]'
                  : 'bg-[#F7F3FF] text-[#38205F] border-[#E4D9FA] hover:bg-[#EDE4FF]'
              }`}
            >
              <span
                className={`block text-[11px] font-bold uppercase tracking-wider ${
                  pctMode === m.id ? 'text-white/80' : 'text-[#7045C6]'
                }`}
              >
                {m.num}
              </span>
              <span className="block text-xs sm:text-sm font-semibold mt-0.5">
                {m.title}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[#F7F3FF]/60 border border-[#E4D9FA] px-4 py-2.5">
          <p className="text-sm font-bold text-[#38205F]">{modeMeta.title}</p>
          <p className="text-xs text-[#5B4D7A] mt-0.5">{modeMeta.desc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label={modeMeta.labelA}
            hint={modeMeta.hintA}
            value={a}
            onChange={setA}
            placeholder={modeMeta.placeholderA}
          />
          <InputField
            label={modeMeta.labelB}
            hint={modeMeta.hintB}
            value={b}
            onChange={setB}
            placeholder={modeMeta.placeholderB}
          />
        </div>
      </CalculatorShell>
    );
  }

  // 2. AGE CALCULATOR
  if (toolId === 'age-calculator') {
    const output = calculateAge(date1, date2);
    return (
      <CalculatorShell
        intro="Find your exact age in years, months, weeks, and days between your birth date and any chosen date."
        example="Born on 1998-05-15 and checked on 2025-05-15 → 27 yrs, 0 mos, 0 days."
        hasAnyInput={Boolean(date1 && date2)}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={() => {
          setDate1('1998-05-15');
          setDate2(new Date().toISOString().split('T')[0]);
          setSubmitted(false);
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Date of Birth"
            hint="Select your birth date."
            kind="date"
            value={date1}
            onChange={setDate1}
          />
          <InputField
            label="Age at Date"
            hint="Select today's date or any future/past date."
            kind="date"
            value={date2}
            onChange={setDate2}
          />
        </div>
      </CalculatorShell>
    );
  }

  // 3. GPA CALCULATOR
  if (toolId === 'gpa-calculator') {
    const output = calculateGpa(gpaRows);
    return (
      <CalculatorShell
        intro="Calculate your semester Grade Point Average (4.0 scale) by entering each course's credits and letter grade."
        example="3 credits of A (4.0) + 4 credits of B+ (3.3) = 25.2 points ÷ 7 credits = 3.60 GPA."
        hasAnyInput={gpaRows.length > 0}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={() => {
          setGpaRows([
            { name: 'Course 1', credits: '3', grade: 'A' },
            { name: 'Course 2', credits: '4', grade: 'B+' },
            { name: 'Course 3', credits: '3', grade: 'A-' },
          ]);
          setSubmitted(false);
        }}
      >
        <div className="space-y-3">
          {gpaRows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={row.name}
                  placeholder={`Course ${idx + 1}`}
                  onChange={(e) => {
                    const next = [...gpaRows];
                    next[idx].name = e.target.value;
                    setGpaRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Credits
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={row.credits}
                  placeholder="3"
                  onChange={(e) => {
                    const next = [...gpaRows];
                    next[idx].credits = sanitizeDecimal(e.target.value, false);
                    setGpaRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Grade
                </label>
                <select
                  value={row.grade}
                  onChange={(e) => {
                    const next = [...gpaRows];
                    next[idx].grade = e.target.value;
                    setGpaRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] bg-white px-2.5 py-2 text-sm"
                >
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>
                      {g} ({GRADE_POINTS[g].toFixed(1)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  disabled={gpaRows.length <= 1}
                  onClick={() => setGpaRows(gpaRows.filter((_, i) => i !== idx))}
                  aria-label="Remove course"
                  className="p-2.5 text-[#5B4D7A] hover:text-red-600 disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setGpaRows([
              ...gpaRows,
              { name: `Course ${gpaRows.length + 1}`, credits: '3', grade: 'A' },
            ])
          }
          className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F3FF] text-[#7045C6] border border-[#D6C6F7] hover:bg-[#EDE4FF] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Another Course
        </button>
      </CalculatorShell>
    );
  }

  // 4. CGPA CALCULATOR
  if (toolId === 'cgpa-calculator') {
    const output = calculateCgpa(cgpaRows);
    return (
      <CalculatorShell
        intro="Calculate your overall Cumulative GPA across multiple semesters using each semester's GPA and credit hours."
        example="Semester 1: 3.6 GPA (15 credits) + Semester 2: 3.8 GPA (16 credits) → 3.70 CGPA."
        hasAnyInput={cgpaRows.length > 0}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={() => {
          setCgpaRows([
            { semester: 'Semester 1', gpa: '3.6', credits: '15' },
            { semester: 'Semester 2', gpa: '3.8', credits: '16' },
          ]);
          setSubmitted(false);
        }}
      >
        <div className="space-y-3">
          {cgpaRows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  value={row.semester}
                  placeholder={`Semester ${idx + 1}`}
                  onChange={(e) => {
                    const next = [...cgpaRows];
                    next[idx].semester = e.target.value;
                    setCgpaRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  GPA (0–4)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={row.gpa}
                  placeholder="3.6"
                  onChange={(e) => {
                    const next = [...cgpaRows];
                    next[idx].gpa = sanitizeDecimal(e.target.value, false);
                    setCgpaRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Credits
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={row.credits}
                  placeholder="15"
                  onChange={(e) => {
                    const next = [...cgpaRows];
                    next[idx].credits = sanitizeDecimal(e.target.value, false);
                    setCgpaRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  disabled={cgpaRows.length <= 1}
                  onClick={() => setCgpaRows(cgpaRows.filter((_, i) => i !== idx))}
                  aria-label="Remove semester"
                  className="p-2.5 text-[#5B4D7A] hover:text-red-600 disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setCgpaRows([
              ...cgpaRows,
              { semester: `Semester ${cgpaRows.length + 1}`, gpa: '3.5', credits: '15' },
            ])
          }
          className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F3FF] text-[#7045C6] border border-[#D6C6F7] hover:bg-[#EDE4FF] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Another Semester
        </button>
      </CalculatorShell>
    );
  }

  // 5. DISCOUNT CALCULATOR
  if (toolId === 'discount-calculator') {
    const output = calculateDiscount(a, b, c);
    return (
      <CalculatorShell
        intro="Find out how much money you save and the final sale price after a percentage discount."
        example="An item costs 120 with 25% off → You save 30.00 and pay 90.00."
        hasAnyInput={a.trim() !== '' && b.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Original Price"
            hint="Enter the regular price before discount."
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 120"
          />
          <InputField
            label="Discount (%)"
            hint="Enter the discount percent (0 to 100)."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="e.g. 25"
          />
          <InputField
            label="Sales Tax % (Optional)"
            hint="Leave blank or 0 if no tax applies."
            kind="positive-decimal"
            value={c}
            onChange={setC}
            placeholder="e.g. 0"
          />
        </div>
      </CalculatorShell>
    );
  }

  // 6. PROFIT AND LOSS CALCULATOR
  if (toolId === 'profit-and-loss-calculator') {
    const output = calculateProfitLoss(a, b);
    return (
      <CalculatorShell
        intro="Check whether you made a profit or a loss by comparing what you paid against what you sold for."
        example="Bought for 80 and sold for 100 → Net Profit of 20.00 (25.00% profit)."
        hasAnyInput={a.trim() !== '' && b.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Cost Price (What you paid)"
            hint="Enter the buying or production cost (must be above 0)."
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 80"
          />
          <InputField
            label="Selling Price (What you sold for)"
            hint="Enter the final selling price."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="e.g. 100"
          />
        </div>
      </CalculatorShell>
    );
  }

  // 7. SIMPLE INTEREST CALCULATOR
  if (toolId === 'simple-interest-calculator') {
    const unit = (mode === 'months' ? 'months' : 'years') as 'years' | 'months';
    const output = calculateSimpleInterest(a, b, c, unit);
    return (
      <CalculatorShell
        intro="Calculate simple interest earned or owed on a starting amount over months or years."
        example="1,000 at 5% per year for 3 years → 150.00 interest (1,150.00 total)."
        hasAnyInput={a.trim() !== '' && b.trim() !== '' && c.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Starting Amount (Principal)"
            hint="Enter the initial amount borrowed or invested."
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 1000"
          />
          <InputField
            label="Yearly Interest Rate (%)"
            hint="Enter the annual percentage rate."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="e.g. 5"
          />
          <div>
            <label className="block text-sm font-semibold text-[#38205F] mb-1">
              Time Period
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={c}
                onChange={(e) => setC(sanitizeDecimal(e.target.value, false))}
                placeholder="e.g. 3"
                className="w-full min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3.5 py-2.5 text-base font-mono-tabular focus:outline-none focus:border-[#7045C6]"
              />
              <select
                value={unit}
                onChange={(e) => setMode(e.target.value)}
                className="min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3 py-2.5 text-sm font-semibold"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
            <p className="mt-1 text-xs text-[#5B4D7A]">Choose years or months.</p>
          </div>
        </div>
      </CalculatorShell>
    );
  }

  // 8. COMPOUND INTEREST CALCULATOR
  if (toolId === 'compound-interest-calculator') {
    const freq = parseInt(mode, 10) || 12;
    const output = calculateCompoundInterest(a, b, c, freq);
    return (
      <CalculatorShell
        intro="See how your savings or investment grows when interest earns interest over time."
        example="5,000 at 6% yearly for 5 years (compounded monthly) → 6,744.25 final balance."
        hasAnyInput={a.trim() !== '' && b.trim() !== '' && c.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            label="Starting Amount"
            hint="Initial deposit or investment."
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 5000"
          />
          <InputField
            label="Yearly Interest Rate (%)"
            hint="Annual interest percentage."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="e.g. 6"
          />
          <InputField
            label="Time (Years)"
            hint="Number of years to grow."
            kind="positive-decimal"
            value={c}
            onChange={setC}
            placeholder="e.g. 5"
          />
          <div>
            <label className="block text-sm font-semibold text-[#38205F] mb-1">
              How Often Compounded
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3.5 py-2.5 text-sm"
            >
              <option value="1">Once a year (Annually)</option>
              <option value="2">Twice a year (Semi-Annually)</option>
              <option value="4">4 times a year (Quarterly)</option>
              <option value="12">12 times a year (Monthly)</option>
              <option value="365">Every day (Daily)</option>
            </select>
            <p className="mt-1 text-xs text-[#5B4D7A]">Monthly is most common.</p>
          </div>
        </div>
      </CalculatorShell>
    );
  }

  // 9. BMI CALCULATOR
  if (toolId === 'bmi-calculator') {
    const output = calculateBmi(bmiUnit, a, b, c);
    return (
      <CalculatorShell
        intro="Check your Body Mass Index (BMI) and see your healthy weight range for your height."
        example="Weight 70 kg and Height 175 cm → BMI 22.9 (Normal Weight)."
        hasAnyInput={a.trim() !== '' && b.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setBmiUnit('metric');
              handleReset();
            }}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer ${
              bmiUnit === 'metric'
                ? 'bg-[#7045C6] text-white'
                : 'bg-[#F7F3FF] text-[#38205F] border border-[#E4D9FA]'
            }`}
          >
            Metric (kg & cm)
          </button>
          <button
            type="button"
            onClick={() => {
              setBmiUnit('imperial');
              handleReset();
            }}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer ${
              bmiUnit === 'imperial'
                ? 'bg-[#7045C6] text-white'
                : 'bg-[#F7F3FF] text-[#38205F] border border-[#E4D9FA]'
            }`}
          >
            Imperial (lbs & ft/in)
          </button>
        </div>

        {bmiUnit === 'metric' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Weight (kg)"
              hint="Enter your weight in kilograms."
              kind="positive-decimal"
              value={a}
              onChange={setA}
              placeholder="e.g. 70"
            />
            <InputField
              label="Height (cm)"
              hint="Enter your height in centimeters."
              kind="positive-decimal"
              value={b}
              onChange={setB}
              placeholder="e.g. 175"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Weight (lbs)"
              hint="Enter your weight in pounds."
              kind="positive-decimal"
              value={a}
              onChange={setA}
              placeholder="e.g. 154"
            />
            <InputField
              label="Height (Feet)"
              hint="Feet part of your height."
              kind="positive-integer"
              value={b}
              onChange={setB}
              placeholder="e.g. 5"
            />
            <InputField
              label="Height (Inches)"
              hint="Remaining inches (0 to 11)."
              kind="positive-decimal"
              value={c}
              onChange={setC}
              placeholder="e.g. 9"
            />
          </div>
        )}
      </CalculatorShell>
    );
  }

  // 10. AVERAGE CALCULATOR
  if (toolId === 'average-calculator') {
    const output = calculateAverage(numberList);
    return (
      <CalculatorShell
        intro="Find the average (mean), middle value (median), total sum, and smallest/largest numbers in a list."
        example="12, 18, 24, 30, 36 → Average is 24, Sum is 120."
        hasAnyInput={numberList.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={() => {
          setNumberList('');
          setSubmitted(false);
        }}
      >
        <div>
          <label className="block text-sm font-semibold text-[#38205F] mb-1">
            Enter Your Numbers
          </label>
          <textarea
            rows={4}
            value={numberList}
            placeholder="e.g. 12, 18, 24, 30, 36"
            onChange={(e) => setNumberList(e.target.value)}
            className="w-full rounded-xl border border-[#D6C6F7] bg-white p-3.5 text-base font-mono-tabular focus:outline-none focus:border-[#7045C6]"
          />
          <p className="mt-1 text-xs text-[#5B4D7A]">
            Separate numbers with commas, spaces, or new lines.
          </p>
        </div>
      </CalculatorShell>
    );
  }

  // 11. RATIO CALCULATOR
  if (toolId === 'ratio-calculator') {
    const output = calculateRatio(a, b, c);
    return (
      <CalculatorShell
        intro="Simplify any ratio (like 1920 : 1080 → 16 : 9) or find a missing number in a proportion."
        example="Enter 1920 and 1080 → Simplified Ratio is 16 : 9. Add 1280 in C → D is 720."
        hasAnyInput={a.trim() !== '' && b.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="First Number (A)"
            hint="Left side of the ratio."
            value={a}
            onChange={setA}
            placeholder="e.g. 1920"
          />
          <InputField
            label="Second Number (B)"
            hint="Right side of the ratio."
            value={b}
            onChange={setB}
            placeholder="e.g. 1080"
          />
          <InputField
            label="New First Number (Optional)"
            hint="Enter to find the matching 4th number."
            value={c}
            onChange={setC}
            placeholder="e.g. 1280"
          />
        </div>
      </CalculatorShell>
    );
  }

  // 12. FRACTION CALCULATOR
  if (toolId === 'fraction-calculator') {
    const output = calculateFraction(a, b, fracOp, c, d);
    return (
      <CalculatorShell
        intro="Add, subtract, multiply, or divide two fractions and get the simplified answer automatically."
        example="1/2 + 1/3 → Simplified Fraction: 5 / 6 (Decimal: 0.833333)."
        hasAnyInput={
          a.trim() !== '' && b.trim() !== '' && c.trim() !== '' && d.trim() !== ''
        }
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <InputField
            label="Top 1 (Numerator)"
            hint="Whole number."
            kind="integer"
            value={a}
            onChange={setA}
            placeholder="e.g. 1"
          />
          <InputField
            label="Bottom 1 (Denominator)"
            hint="Cannot be 0."
            kind="integer"
            value={b}
            onChange={setB}
            placeholder="e.g. 2"
          />
          <div>
            <label className="block text-sm font-semibold text-[#38205F] mb-1">
              Operation
            </label>
            <select
              value={fracOp}
              onChange={(e) => setFracOp(e.target.value as '+' | '-' | '*' | '/')}
              className="w-full min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3 py-2.5 text-base font-bold"
            >
              <option value="+">+ Add</option>
              <option value="-">− Subtract</option>
              <option value="*">× Multiply</option>
              <option value="/">÷ Divide</option>
            </select>
            <p className="mt-1 text-xs text-[#5B4D7A]">Pick action.</p>
          </div>
          <InputField
            label="Top 2 (Numerator)"
            hint="Whole number."
            kind="integer"
            value={c}
            onChange={setC}
            placeholder="e.g. 1"
          />
          <InputField
            label="Bottom 2 (Denominator)"
            hint="Cannot be 0."
            kind="integer"
            value={d}
            onChange={setD}
            placeholder="e.g. 3"
          />
        </div>
      </CalculatorShell>
    );
  }

  // 13. DATE DIFFERENCE CALCULATOR
  if (toolId === 'date-difference-calculator') {
    const output = calculateDateDifference(date1, date2);
    return (
      <CalculatorShell
        intro="Count the exact number of calendar days, weeks, and weekdays (Monday–Friday) between two dates."
        example="2025-01-01 to 2025-01-15 → 14 days (2 wks, 0 days, 10 weekdays)."
        hasAnyInput={Boolean(date1 && date2)}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={() => {
          setDate1('2025-01-01');
          setDate2('2025-01-15');
          setSubmitted(false);
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Start Date"
            hint="Pick the first date."
            kind="date"
            value={date1}
            onChange={setDate1}
          />
          <InputField
            label="End Date"
            hint="Pick the second date."
            kind="date"
            value={date2}
            onChange={setDate2}
          />
        </div>
      </CalculatorShell>
    );
  }

  // 14. TIME DURATION CALCULATOR
  if (toolId === 'time-duration-calculator') {
    const output = calculateTimeDuration(time1, time2, overnight);
    return (
      <CalculatorShell
        intro="Calculate the exact hours and minutes between a start time and an end time."
        example="09:00 to 17:30 → 8h 30m (510 minutes or 8.50 hours)."
        hasAnyInput={Boolean(time1 && time2)}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={() => {
          setTime1('09:00');
          setTime2('17:30');
          setOvernight(false);
          setSubmitted(false);
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Start Time"
            hint="Enter or pick start time."
            kind="time"
            value={time1}
            onChange={setTime1}
          />
          <InputField
            label="End Time"
            hint="Enter or pick end time."
            kind="time"
            value={time2}
            onChange={setTime2}
          />
        </div>
        <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#38205F] cursor-pointer">
          <input
            type="checkbox"
            checked={overnight}
            onChange={(e) => setOvernight(e.target.checked)}
            className="w-4 h-4 accent-[#7045C6]"
          />
          <span>End time is on the next day (overnight shift)</span>
        </label>
      </CalculatorShell>
    );
  }

  // 15. LOAN EMI CALCULATOR
  if (toolId === 'loan-emi-calculator') {
    const unit = (mode === 'months' ? 'months' : 'years') as 'years' | 'months';
    const output = calculateLoanEmi(a, b, c, unit);
    return (
      <CalculatorShell
        intro="Estimate your monthly loan payment, total interest, and total repayment amount."
        example="100,000 loan at 7.5% yearly interest for 15 years → 927.01/month."
        hasAnyInput={a.trim() !== '' && b.trim() !== '' && c.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Loan Amount"
            hint="Total amount you plan to borrow."
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 100000"
          />
          <InputField
            label="Yearly Interest Rate (%)"
            hint="Annual interest rate (e.g. 7.5)."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="e.g. 7.5"
          />
          <div>
            <label className="block text-sm font-semibold text-[#38205F] mb-1">
              Loan Length
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={c}
                onChange={(e) => setC(sanitizeDecimal(e.target.value, false))}
                placeholder="e.g. 15"
                className="w-full min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3.5 py-2.5 text-base font-mono-tabular focus:outline-none focus:border-[#7045C6]"
              />
              <select
                value={unit}
                onChange={(e) => setMode(e.target.value)}
                className="min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3 py-2.5 text-sm font-semibold"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
            <p className="mt-1 text-xs text-[#5B4D7A]">Choose years or months.</p>
          </div>
        </div>
      </CalculatorShell>
    );
  }

  // 16. SALARY CALCULATOR
  if (toolId === 'salary-calculator') {
    const freq = (
      ['hourly', 'weekly', 'monthly', 'annual'].includes(mode) ? mode : 'hourly'
    ) as 'hourly' | 'weekly' | 'monthly' | 'annual';
    const output = calculateSalary(a, freq, b, c);
    return (
      <CalculatorShell
        intro="Convert your hourly, weekly, monthly, or yearly pay into all other pay periods."
        example="35/hour at 40 hours/week for 52 weeks → 72,800.00/year (6,066.67/month)."
        hasAnyInput={a.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            label="Pay Amount"
            hint="Enter your pay rate."
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 35"
          />
          <div>
            <label className="block text-sm font-semibold text-[#38205F] mb-1">
              Pay Frequency
            </label>
            <select
              value={freq}
              onChange={(e) => setMode(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-[#D6C6F7] bg-white px-3.5 py-2.5 text-sm"
            >
              <option value="hourly">Per Hour</option>
              <option value="weekly">Per Week</option>
              <option value="monthly">Per Month</option>
              <option value="annual">Per Year</option>
            </select>
            <p className="mt-1 text-xs text-[#5B4D7A]">How often you are paid.</p>
          </div>
          <InputField
            label="Hours per Week"
            hint="Default is 40 hours."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="40"
          />
          <InputField
            label="Weeks per Year"
            hint="Default is 52 weeks."
            kind="positive-decimal"
            value={c}
            onChange={setC}
            placeholder="52"
          />
        </div>
      </CalculatorShell>
    );
  }

  // 17. TAX PERCENTAGE CALCULATOR
  if (toolId === 'tax-percentage-calculator') {
    const taxMode = (mode === 'extract' ? 'extract' : 'add') as 'add' | 'extract';
    const output = calculateTax(taxMode, a, b);
    return (
      <CalculatorShell
        intro="Add sales tax/VAT to a net price, or extract the tax included inside a gross total."
        example="Add 8.5% tax to 100 → Tax is 8.50 and Total With Tax is 108.50."
        hasAnyInput={a.trim() !== '' && b.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer ${
              taxMode === 'add'
                ? 'bg-[#7045C6] text-white'
                : 'bg-[#F7F3FF] text-[#38205F] border border-[#E4D9FA]'
            }`}
          >
            Add Tax to Price
          </button>
          <button
            type="button"
            onClick={() => setMode('extract')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer ${
              taxMode === 'extract'
                ? 'bg-[#7045C6] text-white'
                : 'bg-[#F7F3FF] text-[#38205F] border border-[#E4D9FA]'
            }`}
          >
            Extract Tax from Total
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label={
              taxMode === 'extract'
                ? 'Total With Tax (Gross)'
                : 'Price Before Tax (Net)'
            }
            hint={
              taxMode === 'extract'
                ? 'Enter the final amount that already includes tax.'
                : 'Enter the base price before tax.'
            }
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 100"
          />
          <InputField
            label="Tax Rate (%)"
            hint="Enter the tax percentage (e.g. 8.5)."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="e.g. 8.5"
          />
        </div>
      </CalculatorShell>
    );
  }

  // 18. TIP CALCULATOR
  if (toolId === 'tip-calculator') {
    const output = calculateTip(a, b, c);
    return (
      <CalculatorShell
        intro="Calculate the tip amount, total bill, and each person's share when splitting a bill."
        example="Bill of 80 with 15% tip split between 4 people → Tip 12.00, Total 92.00, 23.00 each."
        hasAnyInput={a.trim() !== '' && b.trim() !== ''}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Bill Amount"
            hint="Enter the bill before tip."
            kind="positive-decimal"
            value={a}
            onChange={setA}
            placeholder="e.g. 80"
          />
          <InputField
            label="Tip Percentage (%)"
            hint="Enter tip % or tap a preset below."
            kind="positive-decimal"
            value={b}
            onChange={setB}
            placeholder="e.g. 15"
          />
          <InputField
            label="Number of People"
            hint="Leave blank for 1 person."
            kind="positive-integer"
            value={c}
            onChange={setC}
            placeholder="e.g. 2"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#5B4D7A]">Quick Tip:</span>
          {[10, 15, 18, 20, 25].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setB(String(pct))}
              className="min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F7F3FF] text-[#7045C6] border border-[#D6C6F7] hover:bg-[#EDE4FF] cursor-pointer"
            >
              {pct}%
            </button>
          ))}
        </div>
      </CalculatorShell>
    );
  }

  // 19. MARKSHEET PERCENTAGE CALCULATOR
  if (toolId === 'marksheet-percentage-calculator') {
    const output = calculateMarksheet(markRows);
    return (
      <CalculatorShell
        intro="Add your subjects, marks obtained, and maximum marks to calculate your overall percentage and grade."
        example="88/100 + 92/100 + 84/100 = 264 / 300 → 88.00% (Grade A)."
        hasAnyInput={markRows.length > 0}
        submitted={submitted}
        output={output}
        onCalculate={() => setSubmitted(true)}
        onReset={() => {
          setMarkRows([
            { subject: 'Mathematics', obtained: '88', max: '100' },
            { subject: 'Science', obtained: '92', max: '100' },
            { subject: 'English', obtained: '84', max: '100' },
          ]);
          setSubmitted(false);
        }}
      >
        <div className="space-y-3">
          {markRows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={row.subject}
                  placeholder={`Subject ${idx + 1}`}
                  onChange={(e) => {
                    const next = [...markRows];
                    next[idx].subject = e.target.value;
                    setMarkRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Marks Got
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={row.obtained}
                  placeholder="88"
                  onChange={(e) => {
                    const next = [...markRows];
                    next[idx].obtained = sanitizeDecimal(e.target.value, false);
                    setMarkRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-[#38205F] mb-1">
                  Out Of
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={row.max}
                  placeholder="100"
                  onChange={(e) => {
                    const next = [...markRows];
                    next[idx].max = sanitizeDecimal(e.target.value, false);
                    setMarkRows(next);
                  }}
                  className="w-full min-h-[46px] rounded-xl border border-[#D6C6F7] px-3 py-2 text-base sm:text-sm font-mono-tabular"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  disabled={markRows.length <= 1}
                  onClick={() => setMarkRows(markRows.filter((_, i) => i !== idx))}
                  aria-label="Remove subject"
                  className="p-2.5 text-[#5B4D7A] hover:text-red-600 disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setMarkRows([
              ...markRows,
              { subject: `Subject ${markRows.length + 1}`, obtained: '80', max: '100' },
            ])
          }
          className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F3FF] text-[#7045C6] border border-[#D6C6F7] hover:bg-[#EDE4FF] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Another Subject
        </button>
      </CalculatorShell>
    );
  }

  // 20. SCIENTIFIC CALCULATOR
  const runSciEval = (expression = sciExpr) => {
    setSciError(null);
    try {
      const val = evaluateMathExpression(expression, sciDeg);
      setSciResult(String(Number(val.toPrecision(12))));
    } catch (err) {
      setSciResult(null);
      setSciError(err instanceof Error ? err.message : 'Invalid expression');
    }
  };

  const appendSci = (token: string) => {
    setSciExpr((prev) => prev + token);
    setSciError(null);
  };

  const handleCopySci = async () => {
    if (sciResult === null) return;
    try {
      await navigator.clipboard.writeText(sciResult);
      setSciCopied(true);
      setTimeout(() => setSciCopied(false), 1800);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <p className="text-sm text-[#4A3B69] bg-[#F7F3FF] border border-[#E4D9FA] rounded-xl px-4 py-3">
        Type or tap a math expression with trigonometry, roots, powers, or logarithms, then tap{' '}
        <strong>=</strong>.
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-xl bg-[#F7F3FF] p-1 border border-[#E4D9FA]">
          <button
            type="button"
            onClick={() => setSciDeg(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              sciDeg ? 'bg-[#7045C6] text-white' : 'text-[#5B4D7A]'
            }`}
          >
            DEG (Degrees)
          </button>
          <button
            type="button"
            onClick={() => setSciDeg(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              !sciDeg ? 'bg-[#7045C6] text-white' : 'text-[#5B4D7A]'
            }`}
          >
            RAD (Radians)
          </button>
        </div>

        <div className="flex items-center gap-2">
          {sciResult !== null && (
            <button
              type="button"
              onClick={handleCopySci}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7045C6] bg-[#F7F3FF] border border-[#D6C6F7] cursor-pointer"
            >
              {sciCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {sciCopied ? 'Copied' : 'Copy'}
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-[#7045C6] hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#F7F3FF] border border-[#D6C6F7] p-4">
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={sciExpr}
          onChange={(e) => setSciExpr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              runSciEval();
            }
          }}
          placeholder="e.g. sin(30) + sqrt(144)"
          aria-label="Scientific expression"
          className="w-full bg-transparent text-right font-mono-tabular text-lg text-[#38205F] focus:outline-none"
        />
        <div className="mt-2 text-right font-mono-tabular text-2xl sm:text-3xl font-bold text-[#7045C6] min-h-9">
          {sciResult !== null ? `= ${sciResult}` : ''}
        </div>
      </div>

      {sciError && <ValidationAlert message={sciError} />}

      <div className="grid grid-cols-5 gap-2">
        {[
          'sin(', 'cos(', 'tan(', 'log(', 'ln(',
          'sqrt(', '(', ')', '^', '!',
          '7', '8', '9', '/', 'π',
          '4', '5', '6', '*', 'e',
          '1', '2', '3', '-', 'DEL',
          '0', '.', '=', '+', 'AC',
        ].map((btn) => (
          <button
            key={btn}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (btn === '=') runSciEval();
              else if (btn === 'AC') handleReset();
              else if (btn === 'DEL') setSciExpr((p) => p.slice(0, -1));
              else appendSci(btn);
            }}
            className={`min-h-[48px] py-3 rounded-xl font-mono-tabular text-sm font-semibold transition-colors cursor-pointer select-none ${
              btn === '='
                ? 'bg-[#7045C6] text-white hover:bg-[#5B34AB]'
                : btn === 'AC' || btn === 'DEL'
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-[#F7F3FF] text-[#38205F] hover:bg-[#EDE4FF] border border-[#E4D9FA]'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-[#E4D9FA] px-4 py-3 text-xs text-[#5B4D7A]">
        <strong className="text-[#38205F]">Example:</strong> Try{' '}
        <span className="font-mono-tabular text-[#38205F]">sin(30) + sqrt(144)</span> in DEG mode →{' '}
        <strong className="text-[#38205F]">12.5</strong>.
      </div>
    </div>
  );
};
