import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Headphones, FileText, Shield, CreditCard, Hash, MapPin, Phone, Mail, Building2, Receipt, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  product_image?: string | null;
}

interface InvoiceData {
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

interface InvoiceGeneratorProps {
  data: InvoiceData;
  showPreview: boolean;
  onClose: () => void;
}

const GST_RATE = 0.18;

const InvoiceGenerator = ({ data, showPreview, onClose }: InvoiceGeneratorProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const gstAmount = Math.round(data.subtotal * GST_RATE / (1 + GST_RATE));
  const baseAmount = data.subtotal - gstAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const formattedDate = new Date(data.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const generatePDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();

    // --- Accent bar at top ---
    doc.setFillColor(232, 65, 24);
    doc.rect(0, 0, pw, 4, 'F');

    // --- Header section ---
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 4, pw, 42, 'F');

    // Brand
    doc.setTextColor(232, 65, 24);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SoundWave', 16, 24);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('PREMIUM AUDIO STORE', 16, 32);

    // Invoice title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pw - 16, 22, { align: 'right' });

    // Order number & date pills
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(data.orderNumber, pw - 16, 30, { align: 'right' });
    doc.text(formattedDate, pw - 16, 37, { align: 'right' });

    let y = 56;

    // --- Info cards ---
    const cardW = (pw - 40) / 2;

    // Billed To card
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, cardW, 44, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, cardW, 44, 3, 3, 'S');

    doc.setTextColor(232, 65, 24);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO', 20, y + 9);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(data.customerName, 20, y + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(data.shippingAddress, 20, y + 25);
    doc.text(`${data.city}, ${data.state} - ${data.pincode}`, 20, y + 31);
    doc.text(`${data.customerEmail}  |  ${data.customerPhone}`, 20, y + 37);

    // From card
    const fromX = 14 + cardW + 12;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(fromX, y, cardW, 44, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(fromX, y, cardW, 44, 3, 3, 'S');

    doc.setTextColor(232, 65, 24);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM', fromX + 6, y + 9);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text('SoundWave India Pvt. Ltd.', fromX + 6, y + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('123 Audio Street, Tech Park', fromX + 6, y + 25);
    doc.text('Mumbai, Maharashtra - 400001', fromX + 6, y + 31);
    doc.text('GSTIN: 27AABCS1234R1ZP', fromX + 6, y + 37);

    // Payment badge
    y += 50;
    doc.setFillColor(255, 237, 213);
    doc.roundedRect(14, y, 60, 8, 2, 2, 'F');
    doc.setTextColor(194, 65, 12);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`PAYMENT: ${data.paymentMethod.toUpperCase()}`, 18, y + 5.5);

    // --- Items Table ---
    y += 14;
    autoTable(doc, {
      startY: y,
      head: [['#', 'Product', 'Qty', 'Unit Price', 'Amount']],
      body: data.items.map((item, i) => [
        (i + 1).toString(),
        item.product_name,
        item.quantity.toString(),
        `Rs.${item.price.toLocaleString()}`,
        `Rs.${(item.price * item.quantity).toLocaleString()}`,
      ]),
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [30, 41, 59],
        cellPadding: 4,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        2: { halign: 'center', cellWidth: 16 },
        3: { halign: 'right', cellWidth: 32 },
        4: { halign: 'right', cellWidth: 32, fontStyle: 'bold' },
      },
      margin: { left: 14, right: 14 },
      tableLineColor: [226, 232, 240],
      tableLineWidth: 0.2,
    });

    // --- Summary ---
    const finalY = (doc as any).lastAutoTable.finalY + 12;
    const summaryW = 82;
    const summaryX = pw - 14 - summaryW;

    // Summary card background
    doc.setFillColor(248, 250, 252);
    const summaryLines = [
      ['Subtotal (excl. GST)', `Rs.${baseAmount.toLocaleString()}`],
      ['CGST (9%)', `Rs.${cgst.toLocaleString()}`],
      ['SGST (9%)', `Rs.${sgst.toLocaleString()}`],
      ['Shipping', data.shipping === 0 ? 'FREE' : `Rs.${data.shipping}`],
    ];
    if (data.discount > 0) {
      summaryLines.push(['Discount', `-Rs.${data.discount.toLocaleString()}`]);
    }
    const summaryH = summaryLines.length * 8 + 24;
    doc.roundedRect(summaryX - 6, finalY - 4, summaryW + 12, summaryH, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(summaryX - 6, finalY - 4, summaryW + 12, summaryH, 3, 3, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    summaryLines.forEach((line, i) => {
      const ly = finalY + 4 + i * 8;
      doc.text(line[0], summaryX, ly);
      if (line[1] === 'FREE') {
        doc.setTextColor(232, 65, 24);
        doc.setFont('helvetica', 'bold');
      }
      doc.text(line[1], pw - 14, ly, { align: 'right' });
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
    });

    // Total
    const totalY = finalY + 4 + summaryLines.length * 8 + 2;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(summaryX, totalY, pw - 14, totalY);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', summaryX, totalY + 8);
    doc.setFontSize(14);
    doc.text(`Rs.${data.total.toLocaleString()}`, pw - 14, totalY + 8, { align: 'right' });

    // --- GST Summary banner ---
    const gstY = finalY + summaryH + 16;
    doc.setFillColor(255, 237, 213);
    doc.roundedRect(14, gstY, pw - 28, 14, 3, 3, 'F');
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(14, gstY, pw - 28, 14, 3, 3, 'S');
    doc.setFontSize(7);
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.text('GST SUMMARY', 20, gstY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 53, 15);
    doc.text(
      `Total GST Rs.${gstAmount.toLocaleString()} (CGST: Rs.${cgst.toLocaleString()} + SGST: Rs.${sgst.toLocaleString()}) | GSTIN: 27AABCS1234R1ZP`,
      20,
      gstY + 11
    );

    // --- Footer ---
    doc.setFillColor(15, 23, 42);
    doc.rect(0, ph - 22, pw, 22, 'F');
    doc.setFillColor(232, 65, 24);
    doc.rect(0, ph - 22, pw, 2, 'F');

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for shopping with SoundWave!', pw / 2, ph - 12, { align: 'center' });
    doc.setFontSize(6);
    doc.text('This is a computer-generated invoice and does not require a signature.', pw / 2, ph - 7, { align: 'center' });

    doc.save(`Invoice_${data.orderNumber}.pdf`);
  };

  if (!showPreview) {
    return (
      <button data-download-pdf onClick={generatePDF} style={{ display: 'none' }} aria-hidden="true">
        Download
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-card rounded-2xl border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-primary" />
          <div className="bg-card/95 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Receipt className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  Invoice
                  <Sparkles className="w-4 h-4 text-primary" />
                </h2>
                <p className="text-xs text-muted-foreground font-mono">{data.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="glow" size="sm" onClick={generatePDF} className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8 space-y-6">
          {/* Brand Header */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-primary/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl ring-4 ring-primary/10">
                <Headphones className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">
                  Sound<span className="text-primary">Wave</span>
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[4px] mt-0.5">Premium Audio Store</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-wider">INVOICE</h1>
              <p className="text-sm font-mono font-semibold mt-1.5">{data.orderNumber}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formattedDate}</p>
            </div>
          </div>

          {/* Billing Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-5 bg-secondary/60 border border-border/60 hover:border-primary/30 transition-colors">
              <h4 className="text-[9px] uppercase tracking-[3px] text-primary font-bold mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Billed To
              </h4>
              <p className="font-bold text-sm">{data.customerName}</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{data.shippingAddress}</p>
              <p className="text-xs text-muted-foreground">{data.city}, {data.state} - {data.pincode}</p>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-primary/60" />
                  {data.customerEmail}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-primary/60" />
                  {data.customerPhone}
                </p>
              </div>
            </div>
            <div className="rounded-xl p-5 bg-secondary/60 border border-border/60 hover:border-primary/30 transition-colors">
              <h4 className="text-[9px] uppercase tracking-[3px] text-primary font-bold mb-3 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" />
                From
              </h4>
              <p className="font-bold text-sm">SoundWave India Pvt. Ltd.</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">123 Audio Street, Tech Park</p>
              <p className="text-xs text-muted-foreground">Mumbai, Maharashtra - 400001</p>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-primary/60" />
                GSTIN: 27AABCS1234R1ZP
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full font-bold border border-primary/20">
                  <CreditCard className="w-3 h-3" />
                  {data.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="text-center p-3.5 text-[9px] uppercase tracking-[2px] font-bold w-12">#</th>
                  <th className="text-left p-3.5 text-[9px] uppercase tracking-[2px] font-bold">Product</th>
                  <th className="text-center p-3.5 text-[9px] uppercase tracking-[2px] font-bold w-16">Qty</th>
                  <th className="text-right p-3.5 text-[9px] uppercase tracking-[2px] font-bold w-28">Price</th>
                  <th className="text-right p-3.5 text-[9px] uppercase tracking-[2px] font-bold w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0 even:bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <td className="p-3.5 text-xs text-center text-muted-foreground font-mono">{String(i + 1).padStart(2, '0')}</td>
                    <td className="p-3.5 text-sm font-semibold">{item.product_name}</td>
                    <td className="p-3.5 text-sm text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-secondary text-xs font-bold">{item.quantity}</span>
                    </td>
                    <td className="p-3.5 text-sm text-right text-muted-foreground font-mono">₹{item.price.toLocaleString()}</td>
                    <td className="p-3.5 text-sm text-right font-bold font-mono">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Card */}
          <div className="flex justify-end">
            <div className="w-80 rounded-xl overflow-hidden border border-border shadow-sm">
              <div className="bg-secondary/60 p-5 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (excl. GST)</span>
                  <span className="font-mono">₹{baseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CGST (9%)</span>
                  <span className="font-mono">₹{cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SGST (9%)</span>
                  <span className="font-mono">₹{sgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{data.shipping === 0 ? <span className="text-primary font-bold">FREE</span> : <span className="font-mono">₹{data.shipping}</span>}</span>
                </div>
                {data.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-primary">Discount</span>
                    <span className="text-primary font-bold font-mono">-₹{data.discount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="bg-foreground text-background p-4 flex justify-between items-center">
                <span className="font-bold text-sm uppercase tracking-wider">Total</span>
                <span className="font-display text-2xl font-bold">₹{data.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* GST Banner */}
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground mb-0.5">GST Summary</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Total GST ₹{gstAmount.toLocaleString()} (CGST: ₹{cgst.toLocaleString()} + SGST: ₹{sgst.toLocaleString()}) included in total. GSTIN: 27AABCS1234R1ZP
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-border/50">
            <div className="inline-flex items-center gap-2 mb-2">
              <Headphones className="w-4 h-4 text-primary" />
              <p className="font-display text-sm font-bold">
                Sound<span className="text-primary">Wave</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Thank you for shopping with SoundWave! 🎵</p>
            <p className="text-[10px] text-muted-foreground mt-1 opacity-60">Computer-generated invoice — no signature required</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceGenerator;
