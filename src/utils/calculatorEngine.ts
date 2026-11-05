export interface CalcResultItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface CalcOutput {
  error?: string;
  items: CalcResultItem[];
  steps: string[];
  copyText: string;
}

export function sanitizeDecimal(raw: string, allowNegative = true): string {
  let v = raw.replace(/,/g, '.');
  v = v.replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, '');
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

export function sanitizeInteger(raw: string, allowNegative = false): string {
  let v = raw.replace(allowNegative ? /[^0-9-]/g : /[^0-9]/g, '');
  if (allowNegative) {
    const hasMinus = v.startsWith('-');
    v = v.replace(/-/g, '');
    if (hasMinus) v = '-' + v;
  }
  return v;
}

export function parseStrictNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '.');
  if (!trimmed || trimmed === '-' || trimmed === '.' || trimmed === '-.') return null;
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function formatNum(n: number, maxDecimals = 4): string {
  if (!Number.isFinite(n)) return '0';
  const rounded = Number(n.toFixed(maxDecimals));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function parseValidDateUTC(yyyyMmDd: string): Date | null {
  const match = yyyyMmDd.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function countWeekdaysO1(startUTC: Date, endUTC: Date): number {
  const totalDays = Math.round(
    (endUTC.getTime() - startUTC.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (totalDays <= 0) return 0;
  const fullWeeks = Math.floor(totalDays / 7);
  const rem = totalDays % 7;
  let weekdays = fullWeeks * 5;
  const startDay = startUTC.getUTCDay(); // 0=Sun..6=Sat
  for (let i = 0; i < rem; i++) {
    const d = (startDay + i) % 7;
    if (d !== 0 && d !== 6) weekdays++;
  }
  return weekdays;
}

// 1. PERCENTAGE CALCULATOR
export function calculatePercentage(
  mode: 'mode1' | 'mode2' | 'mode3',
  rawA: string,
  rawB: string
): CalcOutput {
  const numA = parseStrictNumber(rawA);
  const numB = parseStrictNumber(rawB);
  if (numA === null || numB === null) {
    return {
      error: 'Please enter valid numbers in both fields.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  if (mode === 'mode1') {
    const res = (numA / 100) * numB;
    if (!Number.isFinite(res)) {
      return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
    }
    const resStr = formatNum(res, 6);
    return {
      items: [{ label: `${numA}% of ${numB}`, value: resStr, highlight: true }],
      steps: [
        `Divide the percentage (${numA}) by 100 to get ${formatNum(numA / 100, 6)}.`,
        `Multiply ${formatNum(numA / 100, 6)} by ${numB} to get ${resStr}.`,
      ],
      copyText: `${numA}% of ${numB} = ${resStr}`,
    };
  }

  if (mode === 'mode2') {
    if (numB === 0) {
      return {
        error: 'Total Number cannot be 0 (cannot divide by zero).',
        items: [],
        steps: [],
        copyText: '',
      };
    }
    const pct = (numA / numB) * 100;
    if (!Number.isFinite(pct)) {
      return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
    }
    const pctStr = `${formatNum(pct, 4)}%`;
    return {
      items: [{ label: 'Percentage', value: pctStr, highlight: true }],
      steps: [
        `Divide the part (${numA}) by the total (${numB}) to get ${formatNum(numA / numB, 6)}.`,
        `Multiply by 100 to convert to a percentage: ${pctStr}.`,
      ],
      copyText: `${numA} is ${pctStr} of ${numB}`,
    };
  }

  // mode3: Percentage increase or decrease
  if (numA === 0) {
    return {
      error: 'Starting Value cannot be 0 when calculating percentage change.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  const diff = numB - numA;
  const pctChange = (diff / Math.abs(numA)) * 100;
  if (!Number.isFinite(pctChange)) {
    return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
  }
  const direction = diff > 0 ? 'Increase' : diff < 0 ? 'Decrease' : 'No Change';
  const sign = diff > 0 ? '+' : '';
  const pctStr = `${sign}${formatNum(pctChange, 4)}% (${direction})`;
  return {
    items: [
      { label: 'Percentage Change', value: pctStr, highlight: true },
      { label: 'Difference', value: `${sign}${formatNum(diff, 4)}` },
    ],
    steps: [
      `Subtract the starting value (${numA}) from the new value (${numB}): ${numB} − ${numA} = ${formatNum(diff, 4)}.`,
      `Divide ${formatNum(diff, 4)} by |${numA}| and multiply by 100: ${pctStr}.`,
    ],
    copyText: `Change from ${numA} to ${numB}: ${pctStr}`,
  };
}

// 2. AGE CALCULATOR
export function calculateAge(dobStr: string, targetStr: string): CalcOutput {
  const dob = parseValidDateUTC(dobStr);
  const target = parseValidDateUTC(targetStr);
  if (!dob || !target) {
    return {
      error: 'Please enter valid calendar dates for both Date of Birth and Age at Date.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (target < dob) {
    return {
      error: 'The "Age at Date" must be on or after the Date of Birth.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  let years = target.getUTCFullYear() - dob.getUTCFullYear();
  let months = target.getUTCMonth() - dob.getUTCMonth();
  let days = target.getUTCDate() - dob.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(
      Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), 0)
    ).getUTCDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((target.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;
  const ageText = `${years} yrs, ${months} mos, ${days} days`;

  return {
    items: [
      { label: 'Exact Age', value: ageText, highlight: true },
      { label: 'Total Months', value: `${totalMonths.toLocaleString()} months` },
      { label: 'Total Days', value: `${totalDays.toLocaleString()} days` },
    ],
    steps: [
      `Count full years from ${dobStr} to ${targetStr}: ${years} years.`,
      `Count remaining full months (${months}) and days (${days}), totaling ${totalDays.toLocaleString()} days.`,
    ],
    copyText: `Age: ${ageText} (${totalDays.toLocaleString()} days)`,
  };
}

// 3. GPA CALCULATOR
export const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0.0,
};

export function calculateGpa(
  rows: { name: string; credits: string; grade: string }[]
): CalcOutput {
  let totalCredits = 0;
  let totalPoints = 0;
  for (let i = 0; i < rows.length; i++) {
    const cr = parseStrictNumber(rows[i].credits);
    if (cr === null || cr <= 0) {
      return {
        error: `Please enter valid credits greater than 0 for "${rows[i].name || `Course ${i + 1}`}".`,
        items: [],
        steps: [],
        copyText: '',
      };
    }
    const pts = GRADE_POINTS[rows[i].grade] ?? 0;
    totalCredits += cr;
    totalPoints += cr * pts;
  }

  if (totalCredits <= 0) {
    return {
      error: 'Total credits must be greater than 0.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const gpa = totalPoints / totalCredits;
  return {
    items: [
      { label: 'Semester GPA', value: `${gpa.toFixed(2)} / 4.00`, highlight: true },
      { label: 'Total Credits', value: formatNum(totalCredits, 2) },
      { label: 'Total Grade Points', value: totalPoints.toFixed(2) },
    ],
    steps: [
      `Multiply each course's credits by its grade points and add them up: ${totalPoints.toFixed(2)} points.`,
      `Divide total points (${totalPoints.toFixed(2)}) by total credits (${formatNum(totalCredits, 2)}) = ${gpa.toFixed(2)}.`,
    ],
    copyText: `Semester GPA: ${gpa.toFixed(2)} / 4.00 (${formatNum(totalCredits, 2)} credits)`,
  };
}

// 4. CGPA CALCULATOR
export function calculateCgpa(
  rows: { semester: string; gpa: string; credits: string }[]
): CalcOutput {
  let totalCredits = 0;
  let totalPoints = 0;
  for (let i = 0; i < rows.length; i++) {
    const g = parseStrictNumber(rows[i].gpa);
    const cr = parseStrictNumber(rows[i].credits);
    const label = rows[i].semester || `Semester ${i + 1}`;
    if (g === null || g < 0 || g > 4) {
      return {
        error: `GPA for "${label}" must be between 0.00 and 4.00.`,
        items: [],
        steps: [],
        copyText: '',
      };
    }
    if (cr === null || cr <= 0) {
      return {
        error: `Credits for "${label}" must be greater than 0.`,
        items: [],
        steps: [],
        copyText: '',
      };
    }
    totalCredits += cr;
    totalPoints += g * cr;
  }

  const cgpa = totalPoints / totalCredits;
  return {
    items: [
      { label: 'Cumulative CGPA', value: `${cgpa.toFixed(2)} / 4.00`, highlight: true },
      { label: 'Total Credits', value: formatNum(totalCredits, 2) },
      { label: '4.0 Scale Percentage', value: `${((cgpa / 4) * 100).toFixed(1)}%` },
    ],
    steps: [
      `Multiply each semester's GPA by its credits and sum them: ${totalPoints.toFixed(2)}.`,
      `Divide by total credits (${formatNum(totalCredits, 2)}) to get ${cgpa.toFixed(2)}.`,
    ],
    copyText: `Cumulative CGPA: ${cgpa.toFixed(2)} / 4.00`,
  };
}

// 5. DISCOUNT CALCULATOR
export function calculateDiscount(
  rawPrice: string,
  rawDisc: string,
  rawTax: string
): CalcOutput {
  const price = parseStrictNumber(rawPrice);
  const disc = parseStrictNumber(rawDisc);
  const tax = rawTax.trim() === '' ? 0 : parseStrictNumber(rawTax);

  if (price === null || price < 0) {
    return {
      error: 'Please enter a valid Original Price (0 or higher).',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (disc === null || disc < 0 || disc > 100) {
    return {
      error: 'Discount percentage must be between 0% and 100%.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (tax === null || tax < 0 || tax > 100) {
    return {
      error: 'Sales tax percentage must be between 0% and 100%.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const saved = (price * disc) / 100;
  const afterDisc = price - saved;
  const taxAmt = (afterDisc * tax) / 100;
  const finalPrice = afterDisc + taxAmt;

  if (!Number.isFinite(finalPrice)) {
    return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
  }

  const steps = [
    `Calculate discount: ${formatNum(price, 2)} × ${disc}% = ${saved.toFixed(2)} saved.`,
    `Subtract discount from original price: ${formatNum(price, 2)} − ${saved.toFixed(2)} = ${afterDisc.toFixed(2)}.`,
  ];
  if (tax > 0) {
    steps.push(
      `Add ${tax}% sales tax (${taxAmt.toFixed(2)}) to get the final price: ${finalPrice.toFixed(2)}.`
    );
  }

  return {
    items: [
      { label: 'Final Price', value: finalPrice.toFixed(2), highlight: true },
      { label: 'You Save', value: saved.toFixed(2) },
      { label: 'Tax Amount', value: taxAmt.toFixed(2) },
    ],
    steps,
    copyText: `Final Price: ${finalPrice.toFixed(2)} (Saved: ${saved.toFixed(2)})`,
  };
}

// 6. PROFIT AND LOSS CALCULATOR
export function calculateProfitLoss(rawCp: string, rawSp: string): CalcOutput {
  const cp = parseStrictNumber(rawCp);
  const sp = parseStrictNumber(rawSp);

  if (cp === null || cp <= 0) {
    return {
      error: 'Cost Price must be greater than 0.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (sp === null || sp < 0) {
    return {
      error: 'Selling Price must be 0 or higher.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const diff = sp - cp;
  const pct = (Math.abs(diff) / cp) * 100;
  if (!Number.isFinite(pct)) {
    return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
  }

  const status = diff > 0 ? 'Net Profit' : diff < 0 ? 'Net Loss' : 'Break-Even (No Profit/Loss)';
  const pctLabel = diff > 0 ? 'Profit Percentage' : diff < 0 ? 'Loss Percentage' : 'Percentage';

  return {
    items: [
      { label: status, value: Math.abs(diff).toFixed(2), highlight: true },
      { label: pctLabel, value: `${pct.toFixed(2)}%` },
    ],
    steps: [
      `Compare Selling Price (${sp.toFixed(2)}) and Cost Price (${cp.toFixed(2)}): difference is ${Math.abs(diff).toFixed(2)} (${diff > 0 ? 'profit' : diff < 0 ? 'loss' : 'break-even'}).`,
      `Divide ${Math.abs(diff).toFixed(2)} by Cost Price (${cp.toFixed(2)}) and multiply by 100 = ${pct.toFixed(2)}%.`,
    ],
    copyText: `${status}: ${Math.abs(diff).toFixed(2)} (${pct.toFixed(2)}%)`,
  };
}

// 7. SIMPLE INTEREST CALCULATOR
export function calculateSimpleInterest(
  rawP: string,
  rawR: string,
  rawT: string,
  unit: 'years' | 'months'
): CalcOutput {
  const p = parseStrictNumber(rawP);
  const r = parseStrictNumber(rawR);
  const t = parseStrictNumber(rawT);

  if (p === null || p < 0) {
    return { error: 'Principal amount must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (r === null || r < 0) {
    return { error: 'Annual interest rate must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (t === null || t < 0) {
    return { error: 'Time period must be 0 or higher.', items: [], steps: [], copyText: '' };
  }

  const years = unit === 'months' ? t / 12 : t;
  const si = (p * r * years) / 100;
  const total = p + si;

  if (!Number.isFinite(total)) {
    return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
  }

  return {
    items: [
      { label: 'Simple Interest', value: si.toFixed(2), highlight: true },
      { label: 'Total Amount', value: total.toFixed(2) },
    ],
    steps: [
      unit === 'months'
        ? `Convert ${t} months to years: ${t} ÷ 12 = ${formatNum(years, 4)} years.`
        : `Use time period of ${years} years.`,
      `Multiply Principal (${p.toFixed(2)}) × Rate (${r}%) × Years (${formatNum(years, 4)}) ÷ 100 = ${si.toFixed(2)}.`,
      `Add interest to principal: ${p.toFixed(2)} + ${si.toFixed(2)} = ${total.toFixed(2)}.`,
    ],
    copyText: `Simple Interest: ${si.toFixed(2)}, Total: ${total.toFixed(2)}`,
  };
}

// 8. COMPOUND INTEREST CALCULATOR
export function calculateCompoundInterest(
  rawP: string,
  rawR: string,
  rawT: string,
  freqPerYear: number
): CalcOutput {
  const p = parseStrictNumber(rawP);
  const rPct = parseStrictNumber(rawR);
  const t = parseStrictNumber(rawT);

  if (p === null || p < 0) {
    return { error: 'Starting amount must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (rPct === null || rPct < 0) {
    return { error: 'Annual interest rate must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (t === null || t < 0) {
    return { error: 'Time in years must be 0 or higher.', items: [], steps: [], copyText: '' };
  }

  const n = freqPerYear > 0 ? freqPerYear : 12;
  const r = rPct / 100;
  const amount = p * Math.pow(1 + r / n, n * t);
  if (!Number.isFinite(amount)) {
    return {
      error: 'The time period or rate is too large and exceeds number limits.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  const interest = amount - p;

  return {
    items: [
      { label: 'Final Balance', value: amount.toFixed(2), highlight: true },
      { label: 'Compound Interest', value: interest.toFixed(2) },
      { label: 'Starting Amount', value: p.toFixed(2) },
    ],
    steps: [
      `Divide annual rate (${rPct}%) by ${n} compounding periods per year.`,
      `Compound over ${formatNum(n * t, 2)} total periods to reach ${amount.toFixed(2)}.`,
      `Subtract starting amount (${p.toFixed(2)}) to find interest earned: ${interest.toFixed(2)}.`,
    ],
    copyText: `Final Balance: ${amount.toFixed(2)} (Interest: ${interest.toFixed(2)})`,
  };
}

// 9. BMI CALCULATOR
export function calculateBmi(
  unit: 'metric' | 'imperial',
  rawA: string,
  rawB: string,
  rawC: string
): CalcOutput {
  let bmi = 0;
  let healthyMin = 0;
  let healthyMax = 0;
  let weightUnit = 'kg';

  if (unit === 'metric') {
    const kg = parseStrictNumber(rawA);
    const cm = parseStrictNumber(rawB);
    if (kg === null || kg <= 0 || cm === null || cm <= 0) {
      return {
        error: 'Weight (kg) and Height (cm) must both be greater than 0.',
        items: [],
        steps: [],
        copyText: '',
      };
    }
    const m = cm / 100;
    bmi = kg / (m * m);
    healthyMin = 18.5 * m * m;
    healthyMax = 24.9 * m * m;
  } else {
    const lbs = parseStrictNumber(rawA);
    const ft = rawB.trim() === '' ? 0 : parseStrictNumber(rawB);
    const inch = rawC.trim() === '' ? 0 : parseStrictNumber(rawC);
    if (lbs === null || lbs <= 0 || ft === null || ft < 0 || inch === null || inch < 0) {
      return {
        error: 'Please enter a valid weight and height greater than 0.',
        items: [],
        steps: [],
        copyText: '',
      };
    }
    const totalIn = ft * 12 + inch;
    if (totalIn <= 0) {
      return {
        error: 'Total height must be greater than 0 inches.',
        items: [],
        steps: [],
        copyText: '',
      };
    }
    bmi = (lbs / (totalIn * totalIn)) * 703;
    healthyMin = (18.5 * totalIn * totalIn) / 703;
    healthyMax = (24.9 * totalIn * totalIn) / 703;
    weightUnit = 'lbs';
  }

  if (!Number.isFinite(bmi)) {
    return { error: 'Invalid height or weight values.', items: [], steps: [], copyText: '' };
  }

  const category =
    bmi < 18.5
      ? 'Underweight'
      : bmi < 25
      ? 'Normal Weight'
      : bmi < 30
      ? 'Overweight'
      : 'Obesity';

  return {
    items: [
      { label: 'Your BMI', value: bmi.toFixed(1), highlight: true },
      { label: 'Category', value: category },
      {
        label: 'Healthy Weight Range',
        value: `${healthyMin.toFixed(1)}–${healthyMax.toFixed(1)} ${weightUnit}`,
      },
    ],
    steps: [
      unit === 'metric'
        ? `Convert height to meters (${(Number(rawB) / 100).toFixed(2)} m) and divide weight by height squared.`
        : `Convert height to total inches and compute (weight ÷ inches²) × 703.`,
      `A BMI of ${bmi.toFixed(1)} falls in the "${category}" range (Normal is 18.5–24.9).`,
    ],
    copyText: `BMI: ${bmi.toFixed(1)} (${category})`,
  };
}

// 10. AVERAGE CALCULATOR
export function calculateAverage(rawList: string): CalcOutput {
  const tokens = rawList
    .split(/[\s,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return {
      error: 'Please enter at least one number (separated by commas or spaces).',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const nums: number[] = [];
  for (const tok of tokens) {
    const n = parseStrictNumber(tok);
    if (n === null) {
      return {
        error: `"${tok}" is not a valid number. Please enter numbers only.`,
        items: [],
        steps: [],
        copyText: '',
      };
    }
    nums.push(n);
  }

  const count = nums.length;
  const sum = nums.reduce((acc, v) => acc + v, 0);
  if (!Number.isFinite(sum)) {
    return { error: 'Sum is too large to calculate.', items: [], steps: [], copyText: '' };
  }

  const mean = sum / count;
  const sorted = [...nums].sort((x, y) => x - y);
  const median =
    count % 2 === 1
      ? sorted[Math.floor(count / 2)]
      : (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
  const min = sorted[0];
  const max = sorted[count - 1];

  return {
    items: [
      { label: 'Average (Mean)', value: formatNum(mean, 4), highlight: true },
      { label: 'Median (Middle)', value: formatNum(median, 4) },
      { label: 'Total Sum', value: formatNum(sum, 4) },
      { label: 'Count', value: `${count} numbers` },
      { label: 'Smallest / Largest', value: `${formatNum(min, 4)} / ${formatNum(max, 4)}` },
      { label: 'Range', value: formatNum(max - min, 4) },
    ],
    steps: [
      `Add all ${count} numbers together to get the sum: ${formatNum(sum, 4)}.`,
      `Divide the sum (${formatNum(sum, 4)}) by ${count} to get the average: ${formatNum(mean, 4)}.`,
    ],
    copyText: `Average: ${formatNum(mean, 4)} (Sum: ${formatNum(sum, 4)}, Count: ${count})`,
  };
}

// 11. RATIO CALCULATOR
export function calculateRatio(rawA: string, rawB: string, rawC: string): CalcOutput {
  const n1 = parseStrictNumber(rawA);
  const n2 = parseStrictNumber(rawB);
  if (n1 === null || n2 === null || n1 === 0 || n2 === 0) {
    return {
      error: 'Both First Value (A) and Second Value (B) must be non-zero numbers.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  // Scale decimals to integers so decimal ratios like 1.5 : 3 simplify to 1 : 2
  const decA = (rawA.trim().split('.')[1] || '').length;
  const decB = (rawB.trim().split('.')[1] || '').length;
  const scale = Math.pow(10, Math.min(6, Math.max(decA, decB)));
  const intA = Math.round(n1 * scale);
  const intB = Math.round(n2 * scale);
  const divisor = gcd(intA, intB);
  const simpA = intA / divisor;
  const simpB = intB / divisor;

  let solvedD: number | null = null;
  if (rawC.trim() !== '') {
    const n3 = parseStrictNumber(rawC);
    if (n3 === null) {
      return {
        error: 'Third Value (C) must be a valid number, or leave it blank.',
        items: [],
        steps: [],
        copyText: '',
      };
    }
    solvedD = (n2 * n3) / n1;
    if (!Number.isFinite(solvedD)) {
      return { error: 'Solved value is too large.', items: [], steps: [], copyText: '' };
    }
  }

  const simplifiedStr = `${simpA} : ${simpB}`;
  const steps = [
    `Divide both ${n1} and ${n2} by their greatest common factor to simplify the ratio to ${simplifiedStr}.`,
  ];
  if (solvedD !== null) {
    steps.push(
      `To keep the same proportion (${n1} : ${n2} = ${rawC} : D), multiply ${n2} × ${rawC} and divide by ${n1} = ${formatNum(solvedD, 4)}.`
    );
  }

  return {
    items: [
      { label: 'Simplified Ratio', value: simplifiedStr, highlight: true },
      ...(solvedD !== null
        ? [{ label: 'Matching Fourth Value (D)', value: formatNum(solvedD, 4) }]
        : []),
    ],
    steps,
    copyText:
      solvedD !== null
        ? `Ratio: ${simplifiedStr} (${rawC} : ${formatNum(solvedD, 4)})`
        : `Simplified Ratio: ${simplifiedStr}`,
  };
}

// 12. FRACTION CALCULATOR
export function calculateFraction(
  rawN1: string,
  rawD1: string,
  op: '+' | '-' | '*' | '/',
  rawN2: string,
  rawD2: string
): CalcOutput {
  const n1 = parseStrictNumber(rawN1);
  const d1 = parseStrictNumber(rawD1);
  const n2 = parseStrictNumber(rawN2);
  const d2 = parseStrictNumber(rawD2);

  if (
    n1 === null ||
    d1 === null ||
    n2 === null ||
    d2 === null ||
    !Number.isInteger(n1) ||
    !Number.isInteger(d1) ||
    !Number.isInteger(n2) ||
    !Number.isInteger(d2)
  ) {
    return {
      error: 'All numerators and denominators must be whole numbers (integers).',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (d1 === 0 || d2 === 0) {
    return {
      error: 'Bottom numbers (denominators) cannot be 0.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (op === '/' && n2 === 0) {
    return {
      error: 'Cannot divide by zero (second fraction numerator is 0).',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  let resNum = 0;
  let resDen = 1;
  if (op === '+') {
    resNum = n1 * d2 + n2 * d1;
    resDen = d1 * d2;
  } else if (op === '-') {
    resNum = n1 * d2 - n2 * d1;
    resDen = d1 * d2;
  } else if (op === '*') {
    resNum = n1 * n2;
    resDen = d1 * d2;
  } else {
    resNum = n1 * d2;
    resDen = d1 * n2;
  }

  if (resDen < 0) {
    resNum = -resNum;
    resDen = -resDen;
  }
  const g = gcd(resNum, resDen);
  resNum /= g;
  resDen /= g;

  const fracStr = resDen === 1 ? `${resNum}` : `${resNum} / ${resDen}`;
  const decStr = formatNum(resNum / resDen, 6);

  return {
    items: [
      { label: 'Simplified Fraction', value: fracStr, highlight: true },
      { label: 'Decimal Value', value: decStr },
    ],
    steps: [
      op === '+' || op === '-'
        ? `Find a common bottom number (${d1 * d2}) and ${op === '+' ? 'add' : 'subtract'} the top numbers.`
        : op === '*'
        ? `Multiply top numbers (${n1} × ${n2}) and bottom numbers (${d1} × ${d2}).`
        : `Flip the second fraction (${d2}/${n2}) and multiply.`,
      `Simplify the fraction to lowest terms: ${fracStr} (or ${decStr} as a decimal).`,
    ],
    copyText: `${n1}/${d1} ${op} ${n2}/${d2} = ${fracStr} (${decStr})`,
  };
}

// 13. DATE DIFFERENCE CALCULATOR
export function calculateDateDifference(date1Str: string, date2Str: string): CalcOutput {
  const start = parseValidDateUTC(date1Str);
  const end = parseValidDateUTC(date2Str);
  if (!start || !end) {
    return {
      error: 'Please enter valid calendar dates for both Start Date and End Date.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const [dStart, dEnd] = start <= end ? [start, end] : [end, start];
  const totalDays = Math.round((dEnd.getTime() - dStart.getTime()) / (1000 * 60 * 60 * 24));
  const weekdays = countWeekdaysO1(dStart, dEnd);
  const weeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;

  return {
    items: [
      { label: 'Total Calendar Days', value: `${totalDays.toLocaleString()} days`, highlight: true },
      { label: 'Weeks & Days', value: `${weeks} wks, ${remDays} days` },
      { label: 'Weekdays (Mon–Fri)', value: `${weekdays.toLocaleString()} days` },
    ],
    steps: [
      `Count all calendar days between ${date1Str} and ${date2Str}: ${totalDays.toLocaleString()} days.`,
      `Divide by 7 to get ${weeks} full weeks and ${remDays} extra days (${weekdays.toLocaleString()} weekdays).`,
    ],
    copyText: `${totalDays.toLocaleString()} days (${weeks} wks, ${remDays} days)`,
  };
}

// 14. TIME DURATION CALCULATOR
export function calculateTimeDuration(
  time1: string,
  time2: string,
  overnight: boolean
): CalcOutput {
  const m1Match = time1.trim().match(/^(\d{1,2}):(\d{2})$/);
  const m2Match = time2.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m1Match || !m2Match) {
    return {
      error: 'Please enter valid start and end times (HH:MM).',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const h1 = Number(m1Match[1]);
  const m1 = Number(m1Match[2]);
  const h2 = Number(m2Match[1]);
  const m2 = Number(m2Match[2]);

  if (h1 > 23 || m1 > 59 || h2 > 23 || m2 > 59) {
    return {
      error: 'Hours must be 0–23 and minutes must be 0–59.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  let diffMins = h2 * 60 + m2 - (h1 * 60 + m1);
  if (overnight && diffMins <= 0) {
    diffMins += 24 * 60;
  }
  const absMins = Math.abs(diffMins);
  const hrs = Math.floor(absMins / 60);
  const mins = absMins % 60;
  const decHrs = (absMins / 60).toFixed(2);

  return {
    items: [
      { label: 'Total Time', value: `${hrs}h ${mins}m`, highlight: true },
      { label: 'Total Minutes', value: `${absMins.toLocaleString()} minutes` },
      { label: 'Decimal Hours', value: `${decHrs} hours` },
    ],
    steps: [
      `Convert both times into minutes from midnight and find the difference: ${absMins} minutes.`,
      `Divide ${absMins} minutes by 60 to get ${hrs} hours and ${mins} minutes (${decHrs} decimal hours).`,
    ],
    copyText: `Duration: ${hrs}h ${mins}m (${absMins} mins)`,
  };
}

// 15. LOAN EMI CALCULATOR
export function calculateLoanEmi(
  rawP: string,
  rawRate: string,
  rawTenure: string,
  unit: 'years' | 'months'
): CalcOutput {
  const p = parseStrictNumber(rawP);
  const annualR = parseStrictNumber(rawRate);
  const tenure = parseStrictNumber(rawTenure);

  if (p === null || p <= 0) {
    return { error: 'Loan Amount must be greater than 0.', items: [], steps: [], copyText: '' };
  }
  if (annualR === null || annualR < 0) {
    return {
      error: 'Annual Interest Rate must be 0 or higher.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (tenure === null || tenure <= 0) {
    return { error: 'Loan Tenure must be greater than 0.', items: [], steps: [], copyText: '' };
  }

  const months = unit === 'months' ? tenure : tenure * 12;
  const r = annualR / 12 / 100;
  const emi =
    r === 0
      ? p / months
      : (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

  if (!Number.isFinite(emi)) {
    return {
      error: 'Loan tenure or interest rate is too large to calculate.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const totalPay = emi * months;
  const totalInt = totalPay - p;

  return {
    items: [
      { label: 'Monthly Payment (EMI)', value: emi.toFixed(2), highlight: true },
      { label: 'Total Interest', value: totalInt.toFixed(2) },
      { label: 'Total Repayment', value: totalPay.toFixed(2) },
    ],
    steps: [
      `Convert ${tenure} ${unit} into ${formatNum(months, 1)} monthly payments at ${annualR}% annual interest.`,
      `Each monthly payment is ${emi.toFixed(2)}, totaling ${totalPay.toFixed(2)} (${totalInt.toFixed(2)} in interest).`,
    ],
    copyText: `Monthly EMI: ${emi.toFixed(2)} | Total Interest: ${totalInt.toFixed(2)}`,
  };
}

// 16. SALARY CALCULATOR
export function calculateSalary(
  rawPay: string,
  freq: 'hourly' | 'weekly' | 'monthly' | 'annual',
  rawHrs: string,
  rawWeeks: string
): CalcOutput {
  const pay = parseStrictNumber(rawPay);
  const hrsPerWeek = rawHrs.trim() === '' ? 40 : parseStrictNumber(rawHrs);
  const weeksPerYear = rawWeeks.trim() === '' ? 52 : parseStrictNumber(rawWeeks);

  if (pay === null || pay < 0) {
    return { error: 'Pay Amount must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (hrsPerWeek === null || hrsPerWeek <= 0 || hrsPerWeek > 168) {
    return {
      error: 'Hours per week must be between 1 and 168.',
      items: [],
      steps: [],
      copyText: '',
    };
  }
  if (weeksPerYear === null || weeksPerYear <= 0 || weeksPerYear > 52.2) {
    return {
      error: 'Weeks per year must be between 1 and 52.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  let annual = 0;
  if (freq === 'hourly') annual = pay * hrsPerWeek * weeksPerYear;
  else if (freq === 'weekly') annual = pay * weeksPerYear;
  else if (freq === 'monthly') annual = pay * 12;
  else annual = pay;

  if (!Number.isFinite(annual)) {
    return { error: 'Salary amount is too large.', items: [], steps: [], copyText: '' };
  }

  const monthly = annual / 12;
  const weekly = annual / weeksPerYear;
  const hourly = annual / (weeksPerYear * hrsPerWeek);

  return {
    items: [
      { label: 'Annual Salary', value: annual.toFixed(2), highlight: true },
      { label: 'Monthly Pay', value: monthly.toFixed(2) },
      { label: 'Weekly Pay', value: weekly.toFixed(2) },
      { label: 'Hourly Rate', value: hourly.toFixed(2) },
    ],
    steps: [
      `Convert your ${freq} pay of ${pay.toFixed(2)} into a yearly total (${annual.toFixed(2)}) using ${hrsPerWeek} hrs/week and ${weeksPerYear} weeks/year.`,
      `Divide yearly pay by 12 for monthly (${monthly.toFixed(2)}) and by ${weeksPerYear} for weekly (${weekly.toFixed(2)}).`,
    ],
    copyText: `Annual: ${annual.toFixed(2)} | Monthly: ${monthly.toFixed(2)} | Hourly: ${hourly.toFixed(2)}`,
  };
}

// 17. TAX PERCENTAGE CALCULATOR
export function calculateTax(
  mode: 'add' | 'extract',
  rawAmt: string,
  rawRate: string
): CalcOutput {
  const amt = parseStrictNumber(rawAmt);
  const rate = parseStrictNumber(rawRate);

  if (amt === null || amt < 0) {
    return { error: 'Amount must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (rate === null || rate < 0) {
    return { error: 'Tax Rate (%) must be 0 or higher.', items: [], steps: [], copyText: '' };
  }

  const net = mode === 'extract' ? amt / (1 + rate / 100) : amt;
  const tax = mode === 'extract' ? amt - net : (amt * rate) / 100;
  const gross = net + tax;

  if (!Number.isFinite(gross)) {
    return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
  }

  return {
    items: [
      {
        label: mode === 'extract' ? 'Price Before Tax (Net)' : 'Total With Tax (Gross)',
        value: (mode === 'extract' ? net : gross).toFixed(2),
        highlight: true,
      },
      { label: 'Tax Amount', value: tax.toFixed(2) },
      {
        label: mode === 'extract' ? 'Total With Tax (Gross)' : 'Price Before Tax (Net)',
        value: (mode === 'extract' ? gross : net).toFixed(2),
      },
    ],
    steps:
      mode === 'extract'
        ? [
            `Divide the total (${amt.toFixed(2)}) by ${formatNum(1 + rate / 100, 4)} to find the pre-tax price: ${net.toFixed(2)}.`,
            `Subtract ${net.toFixed(2)} from ${amt.toFixed(2)} to find the tax amount: ${tax.toFixed(2)}.`,
          ]
        : [
            `Multiply the price (${amt.toFixed(2)}) by ${rate}% to find the tax: ${tax.toFixed(2)}.`,
            `Add the tax (${tax.toFixed(2)}) to ${amt.toFixed(2)} for a total of ${gross.toFixed(2)}.`,
          ],
    copyText: `Total: ${gross.toFixed(2)} | Tax: ${tax.toFixed(2)} | Net: ${net.toFixed(2)}`,
  };
}

// 18. TIP CALCULATOR
export function calculateTip(
  rawBill: string,
  rawTipPct: string,
  rawPeople: string
): CalcOutput {
  const bill = parseStrictNumber(rawBill);
  const tipPct = parseStrictNumber(rawTipPct);
  const people = rawPeople.trim() === '' ? 1 : parseStrictNumber(rawPeople);

  if (bill === null || bill < 0) {
    return { error: 'Bill Subtotal must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (tipPct === null || tipPct < 0) {
    return { error: 'Tip Percentage must be 0 or higher.', items: [], steps: [], copyText: '' };
  }
  if (people === null || !Number.isInteger(people) || people < 1) {
    return {
      error: 'Number of people must be a whole number of at least 1.',
      items: [],
      steps: [],
      copyText: '',
    };
  }

  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  const perPerson = total / people;

  if (!Number.isFinite(total)) {
    return { error: 'Result is too large to display.', items: [], steps: [], copyText: '' };
  }

  return {
    items: [
      { label: 'Total Bill', value: total.toFixed(2), highlight: true },
      { label: 'Tip Amount', value: tip.toFixed(2) },
      { label: 'Per Person', value: perPerson.toFixed(2) },
    ],
    steps: [
      `Calculate ${tipPct}% tip on ${bill.toFixed(2)}: ${tip.toFixed(2)}.`,
      `Add tip to subtotal (${bill.toFixed(2)} + ${tip.toFixed(2)} = ${total.toFixed(2)}) and divide by ${people} ${people === 1 ? 'person' : 'people'} = ${perPerson.toFixed(2)} each.`,
    ],
    copyText: `Total: ${total.toFixed(2)} | Tip: ${tip.toFixed(2)} | Per Person: ${perPerson.toFixed(2)}`,
  };
}

// 19. MARKSHEET PERCENTAGE CALCULATOR
export function calculateMarksheet(
  rows: { subject: string; obtained: string; max: string }[]
): CalcOutput {
  let totalObt = 0;
  let totalMax = 0;

  for (let i = 0; i < rows.length; i++) {
    const o = parseStrictNumber(rows[i].obtained);
    const m = parseStrictNumber(rows[i].max);
    const label = rows[i].subject || `Subject ${i + 1}`;
    if (m === null || m <= 0) {
      return {
        error: `Max Marks for "${label}" must be greater than 0.`,
        items: [],
        steps: [],
        copyText: '',
      };
    }
    if (o === null || o < 0) {
      return {
        error: `Obtained Marks for "${label}" must be 0 or higher.`,
        items: [],
        steps: [],
        copyText: '',
      };
    }
    if (o > m) {
      return {
        error: `Obtained Marks (${o}) cannot exceed Max Marks (${m}) for "${label}".`,
        items: [],
        steps: [],
        copyText: '',
      };
    }
    totalObt += o;
    totalMax += m;
  }

  const pct = (totalObt / totalMax) * 100;
  const grade =
    pct >= 90
      ? 'A+'
      : pct >= 80
      ? 'A'
      : pct >= 70
      ? 'B'
      : pct >= 60
      ? 'C'
      : pct >= 50
      ? 'D'
      : 'F';

  return {
    items: [
      { label: 'Overall Percentage', value: `${pct.toFixed(2)}%`, highlight: true },
      { label: 'Total Marks', value: `${formatNum(totalObt, 2)} / ${formatNum(totalMax, 2)}` },
      { label: 'Grade', value: grade },
    ],
    steps: [
      `Add all obtained marks (${formatNum(totalObt, 2)}) and all maximum marks (${formatNum(totalMax, 2)}).`,
      `Divide ${formatNum(totalObt, 2)} by ${formatNum(totalMax, 2)} and multiply by 100 = ${pct.toFixed(2)}% (Grade ${grade}).`,
    ],
    copyText: `Marks: ${formatNum(totalObt, 2)}/${formatNum(totalMax, 2)} (${pct.toFixed(2)}%, Grade ${grade})`,
  };
}

// 20. SCIENTIFIC CALCULATOR EXPRESSION EVALUATOR
export function evaluateMathExpression(expr: string, isDeg: boolean): number {
  const cleaned = expr
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');
  if (!cleaned) throw new Error('Please enter a math expression.');

  let pos = 0;

  const parseExpr = (): number => {
    let left = parseTerm();
    while (pos < cleaned.length && (cleaned[pos] === '+' || cleaned[pos] === '-')) {
      const op = cleaned[pos++];
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  };

  const parseTerm = (): number => {
    let left = parsePower();
    while (pos < cleaned.length && (cleaned[pos] === '*' || cleaned[pos] === '/')) {
      const op = cleaned[pos++];
      const right = parsePower();
      if (op === '/') {
        if (right === 0) throw new Error('Cannot divide by zero.');
        left /= right;
      } else {
        left *= right;
      }
    }
    return left;
  };

  const parsePower = (): number => {
    let base = parseUnary();
    if (pos < cleaned.length && cleaned[pos] === '^') {
      pos++;
      const exp = parsePower();
      base = Math.pow(base, exp);
    }
    return base;
  };

  const parseUnary = (): number => {
    if (cleaned[pos] === '-') {
      pos++;
      return -parseUnary();
    }
    if (cleaned[pos] === '+') {
      pos++;
      return parseUnary();
    }
    return parsePostfix();
  };

  const parsePostfix = (): number => {
    let val = parsePrimary();
    while (pos < cleaned.length && cleaned[pos] === '!') {
      pos++;
      if (val < 0 || !Number.isInteger(val) || val > 170) {
        throw new Error('Factorial (!) requires a whole number from 0 to 170.');
      }
      let f = 1;
      for (let i = 2; i <= val; i++) f *= i;
      val = f;
    }
    return val;
  };

  const parsePrimary = (): number => {
    if (cleaned[pos] === '(') {
      pos++;
      const val = parseExpr();
      if (cleaned[pos] !== ')') throw new Error('Missing closing parenthesis ")".');
      pos++;
      return val;
    }

    if (cleaned.startsWith('pi', pos) || cleaned[pos] === 'π') {
      pos += cleaned[pos] === 'π' ? 1 : 2;
      return Math.PI;
    }
    if (cleaned[pos] === 'e' && !/[a-z]/i.test(cleaned[pos + 1] || '')) {
      pos++;
      return Math.E;
    }

    const funcs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'ln', 'abs'];
    for (const fn of funcs) {
      if (cleaned.startsWith(fn + '(', pos)) {
        pos += fn.length + 1;
        const arg = parseExpr();
        if (cleaned[pos] !== ')') throw new Error(`Missing closing ")" for ${fn}().`);
        pos++;
        const rad = isDeg ? (arg * Math.PI) / 180 : arg;
        switch (fn) {
          case 'sin': {
            const s = Math.sin(rad);
            return Math.abs(s) < 1e-15 ? 0 : s;
          }
          case 'cos': {
            const c = Math.cos(rad);
            return Math.abs(c) < 1e-15 ? 0 : c;
          }
          case 'tan': {
            if (Math.abs(Math.cos(rad)) < 1e-15) {
              throw new Error('Tangent is undefined at 90° (and odd multiples of 90°).');
            }
            const t = Math.tan(rad);
            return Math.abs(t) < 1e-15 ? 0 : t;
          }
          case 'asin':
            if (arg < -1 || arg > 1) {
              throw new Error('asin() input must be between -1 and 1.');
            }
            return isDeg ? (Math.asin(arg) * 180) / Math.PI : Math.asin(arg);
          case 'acos':
            if (arg < -1 || arg > 1) {
              throw new Error('acos() input must be between -1 and 1.');
            }
            return isDeg ? (Math.acos(arg) * 180) / Math.PI : Math.acos(arg);
          case 'atan':
            return isDeg ? (Math.atan(arg) * 180) / Math.PI : Math.atan(arg);
          case 'sqrt':
            if (arg < 0) throw new Error('Cannot take square root of a negative number.');
            return Math.sqrt(arg);
          case 'log':
            if (arg <= 0) throw new Error('log() requires a positive number greater than 0.');
            return Math.log10(arg);
          case 'ln':
            if (arg <= 0) throw new Error('ln() requires a positive number greater than 0.');
            return Math.log(arg);
          case 'abs':
            return Math.abs(arg);
        }
      }
    }

    const numMatch = cleaned.slice(pos).match(/^(\d+\.?\d*|\.\d+)/);
    if (!numMatch) {
      throw new Error(`Unexpected input near "${cleaned.slice(pos, pos + 6)}".`);
    }
    pos += numMatch[0].length;
    return parseFloat(numMatch[0]);
  };

  const result = parseExpr();
  if (pos < cleaned.length) {
    throw new Error(`Unexpected character "${cleaned[pos]}".`);
  }
  if (!Number.isFinite(result)) {
    throw new Error('Result is undefined or too large.');
  }
  return result;
}
