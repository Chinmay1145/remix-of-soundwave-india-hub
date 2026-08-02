import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  PDF_COLORS,
  drawPdfHeader,
  drawPdfFooters,
  sanitizePdfText,
  tableTheme,
} from './pdf';

export interface ContactReceiptData {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export const buildReference = () =>
  `SW-MSG-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

export const formatReceiptDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Generates a professional, branded acknowledgement receipt for a contact enquiry. */
export const downloadContactReceipt = (data: ContactReceiptData) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  let y = drawPdfHeader(doc, {
    eyebrow: 'CUSTOMER SUPPORT DESK',
    title: 'MESSAGE RECEIPT',
    metaLines: [
      `Ref No: ${data.reference}`,
      `Received: ${formatReceiptDate(data.createdAt)}`,
      'Status: Acknowledged',
    ],
  });

  doc.setFillColor(...PDF_COLORS.successSoft);
  doc.roundedRect(14, y, pw - 28, 20, 3, 3, 'F');
  doc.setTextColor(...PDF_COLORS.success);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Your message has been received', 20, y + 8.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...PDF_COLORS.inkSoft);
  doc.text('A SoundWave support specialist will respond within 24 business hours.', 20, y + 15);
  y += 30;

  autoTable(doc, {
    startY: y,
    head: [['Sender Details', '']],
    body: [
      ['Full Name', sanitizePdfText(data.name)],
      ['Email Address', sanitizePdfText(data.email)],
      ['Phone Number', sanitizePdfText(data.phone || 'Not provided')],
      ['Subject', sanitizePdfText(data.subject)],
      ['Reference No', sanitizePdfText(data.reference)],
      ['Submitted On', sanitizePdfText(formatReceiptDate(data.createdAt))],
    ],
    ...tableTheme,
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', textColor: PDF_COLORS.muted },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.ink);
  doc.text('MESSAGE', 14, y);
  y += 4;

  const lines = doc.splitTextToSize(sanitizePdfText(data.message), pw - 40);
  const boxH = Math.max(24, lines.length * 5 + 12);
  doc.setFillColor(...PDF_COLORS.surface);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.roundedRect(14, y, pw - 28, boxH, 3, 3, 'FD');
  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(14, y, 1.6, boxH, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.inkSoft);
  doc.text(lines, 21, y + 9);
  y += boxH + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.ink);
  doc.text('WHAT HAPPENS NEXT', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...PDF_COLORS.muted);
  [
    '1.  Our support desk reviews your enquiry and assigns it to a specialist.',
    '2.  You receive a reply by email within 24 business hours.',
    '3.  Quote your reference number in any follow-up for faster service.',
  ].forEach((line, i) => {
    doc.text(line, 16, y + i * 5.5);
  });
  y += 22;

  doc.setDrawColor(...PDF_COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(14, y, pw - 14, y);
  y += 7;
  doc.setFontSize(7.5);
  doc.setTextColor(...PDF_COLORS.mutedLight);
  doc.text('This is a computer-generated acknowledgement receipt and does not require a signature.', 14, y);
  doc.text('SoundWave Audio Pvt. Ltd.  |  123 Audio Street, Tech Park, Mumbai 400001  |  support@soundwave.in  |  +91 98765 43210', 14, y + 5);

  drawPdfFooters(doc, 'SoundWave - Customer Support Acknowledgement');
  doc.save(`SoundWave-Receipt-${data.reference}.pdf`);
};