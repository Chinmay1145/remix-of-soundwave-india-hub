import jsPDF from 'jspdf';

// ---------------------------------------------------------------------------
// Shared PDF helpers for SoundWave (jsPDF + jspdf-autotable)
// IMPORTANT: jsPDF's standard fonts do not include the "₹" glyph. Always use
// "Rs." for currency in generated PDFs — never the rupee symbol.
// ---------------------------------------------------------------------------

export const PDF_COLORS = {
  ink: [15, 23, 42] as [number, number, number], // near-black navy
  inkSoft: [30, 41, 59] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  mutedLight: [148, 163, 184] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  surface: [248, 250, 252] as [number, number, number],
  primary: [232, 65, 24] as [number, number, number], // brand orange
  primarySoft: [255, 237, 213] as [number, number, number],
  primaryDeep: [194, 65, 12] as [number, number, number],
  success: [16, 122, 71] as [number, number, number],
  successSoft: [220, 245, 232] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  amber: [251, 191, 36] as [number, number, number],
  amberDeep: [120, 53, 15] as [number, number, number],
};

/** Strips characters that jsPDF's built-in fonts cannot render (non Latin-1),
 * preventing stray glyph/tofu artifacts (e.g. a lone "1" where "₹" was used). */
export const sanitizePdfText = (input: string | number | null | undefined): string => {
  if (input === null || input === undefined) return '';
  const str = String(input);
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\xFF]/g, '').replace(/\s+/g, ' ').trim();
};

/** Formats a number as "Rs. 1,23,456" using Indian digit grouping. Safe for jsPDF. */
export const formatCurrency = (value: number): string => {
  const n = Math.round(Number(value) || 0);
  return `Rs. ${n.toLocaleString('en-IN')}`;
};

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`;
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${h ? ONES[h] + ' Hundred' + (rest ? ' ' : '') : ''}${rest ? twoDigits(rest) : ''}`;
}

/** Converts a rupee amount into words, Indian numbering system (Lakh/Crore). */
export const amountInWords = (value: number): string => {
  let n = Math.round(Math.abs(Number(value) || 0));
  if (n === 0) return 'Zero Rupees Only';
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;
  const parts: string[] = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));
  return `${parts.join(' ')} Rupees Only`;
};

interface HeaderOptions {
  eyebrow?: string;
  title: string;
  metaLines?: string[];
}

/** Draws the shared brand header band (wordmark + tagline + right-aligned title/meta). */
export const drawPdfHeader = (doc: jsPDF, opts: HeaderOptions): number => {
  const pw = doc.internal.pageSize.getWidth();
  const bandH = 42;

  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(0, 0, pw, 3, 'F');

  doc.setFillColor(...PDF_COLORS.ink);
  doc.rect(0, 3, pw, bandH, 'F');

  doc.setTextColor(...PDF_COLORS.primary);
  doc.setFontSize(21);
  doc.setFont('helvetica', 'bold');
  doc.text('SoundWave', 16, 21);

  doc.setTextColor(...PDF_COLORS.mutedLight);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(sanitizePdfText(opts.eyebrow || 'PREMIUM AUDIO STORE'), 16, 28);
  doc.text('www.soundwave.example  |  support@soundwave.example', 16, 33.5);

  doc.setTextColor(...PDF_COLORS.white);
  doc.setFontSize(19);
  doc.setFont('helvetica', 'bold');
  doc.text(sanitizePdfText(opts.title), pw - 16, 20, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PDF_COLORS.mutedLight);
  (opts.metaLines || []).forEach((line, i) => {
    doc.text(sanitizePdfText(line), pw - 16, 27 + i * 5.5, { align: 'right' });
  });

  return bandH + 3 + 12;
};

/** Draws a thin decorative accent rule. */
export const drawAccentRule = (doc: jsPDF, x: number, y: number, w: number) => {
  doc.setDrawColor(...PDF_COLORS.primary);
  doc.setLineWidth(0.6);
  doc.line(x, y, x + w, y);
};

/** Draws the footer band (accent line, tagline, "Page X of Y", timestamp) on every page. */
export const drawPdfFooters = (doc: jsPDF, tagline = 'SoundWave - Confidential Document') => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();
  const timestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(...PDF_COLORS.ink);
    doc.rect(0, ph - 16, pw, 16, 'F');
    doc.setFillColor(...PDF_COLORS.primary);
    doc.rect(0, ph - 16, pw, 1.2, 'F');

    doc.setTextColor(...PDF_COLORS.mutedLight);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizePdfText(tagline), 14, ph - 6);
    doc.text(`Generated: ${timestamp}`, pw / 2, ph - 6, { align: 'center' });
    doc.text(`Page ${p} of ${pageCount}`, pw - 14, ph - 6, { align: 'right' });
  }
};

/** Shared table styling defaults used across invoice/report tables. */
export const tableTheme = {
  headStyles: {
    fillColor: PDF_COLORS.ink,
    textColor: PDF_COLORS.white,
    fontSize: 8,
    fontStyle: 'bold' as const,
    cellPadding: 4,
  },
  bodyStyles: {
    fontSize: 8.5,
    textColor: PDF_COLORS.inkSoft,
    cellPadding: 3.6,
  },
  alternateRowStyles: { fillColor: PDF_COLORS.surface },
  tableLineColor: PDF_COLORS.border,
  tableLineWidth: 0.15,
};
