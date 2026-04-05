import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Headphones, FileText, Shield, Calendar, CreditCard, Hash } from 'lucide-react';
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
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(232, 65, 24);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SoundWave', 14, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Audio Store', 14, 30);
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 14, 22, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(data.orderNumber, pageWidth - 14, 30, { align: 'right' });

    // Order info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    let y = 52;
    doc.text(`Date: ${formattedDate}`, 14, y);
    doc.text(`Payment: ${data.paymentMethod.toUpperCase()}`, pageWidth - 14, y, { align: 'right' });

    // Billed To / From
    y = 65;
    doc.setTextColor(232, 65, 24);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO', 14, y);
    doc.text('FROM', pageWidth / 2 + 10, y);

    y = 73;
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(data.customerName, 14, y);
    doc.text('SoundWave India Pvt. Ltd.', pageWidth / 2 + 10, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const leftLines = [
      data.shippingAddress,
      `${data.city}, ${data.state} - ${data.pincode}`,
      data.customerEmail,
      data.customerPhone,
    ];
    const rightLines = [
      '123 Audio Street, Tech Park',
      'Mumbai, Maharashtra - 400001',
      'GSTIN: 27AABCS1234R1ZP',
      'support@soundwave.in',
    ];
    leftLines.forEach((line, i) => doc.text(line, 14, y + 7 + i * 5));
    rightLines.forEach((line, i) => doc.text(line, pageWidth / 2 + 10, y + 7 + i * 5));

    // Items table
    y = 108;
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
        fillColor: [26, 26, 46],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      columnStyles: {
        0: { cellWidth: 12 },
        2: { halign: 'center', cellWidth: 16 },
        3: { halign: 'right', cellWidth: 30 },
        4: { halign: 'right', cellWidth: 30, fontStyle: 'bold' },
      },
      margin: { left: 14, right: 14 },
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const summaryX = pageWidth - 90;
    const summaryLines = [
      ['Subtotal (excl. GST)', `Rs.${baseAmount.toLocaleString()}`],
      ['CGST (9%)', `Rs.${cgst.toLocaleString()}`],
      ['SGST (9%)', `Rs.${sgst.toLocaleString()}`],
      ['Shipping', data.shipping === 0 ? 'FREE' : `Rs.${data.shipping}`],
    ];
    if (data.discount > 0) {
      summaryLines.push(['Discount', `-Rs.${data.discount.toLocaleString()}`]);
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    summaryLines.forEach((line, i) => {
      doc.text(line[0], summaryX, finalY + i * 7);
      doc.text(line[1], pageWidth - 14, finalY + i * 7, { align: 'right' });
    });

    const totalY = finalY + summaryLines.length * 7 + 4;
    doc.setDrawColor(26, 26, 46);
    doc.line(summaryX, totalY - 3, pageWidth - 14, totalY - 3);
    doc.setTextColor(26, 26, 46);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total', summaryX, totalY + 4);
    doc.text(`Rs.${data.total.toLocaleString()}`, pageWidth - 14, totalY + 4, { align: 'right' });

    // GST Banner
    const gstY = totalY + 18;
    doc.setFillColor(255, 245, 240);
    doc.roundedRect(14, gstY, pageWidth - 28, 14, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `GST Summary: Total GST Rs.${gstAmount.toLocaleString()} (CGST: Rs.${cgst.toLocaleString()} + SGST: Rs.${sgst.toLocaleString()}) | GSTIN: 27AABCS1234R1ZP`,
      pageWidth / 2,
      gstY + 9,
      { align: 'center' }
    );

    // Footer
    const footerY = gstY + 26;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text('Thank you for shopping with SoundWave!', pageWidth / 2, footerY, { align: 'center' });
    doc.setFontSize(7);
    doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, footerY + 6, { align: 'center' });

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
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Invoice</h2>
              <p className="text-xs text-muted-foreground">{data.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="glow" size="sm" onClick={generatePDF} data-download>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Invoice Content Preview */}
        <div ref={invoiceRef} className="p-8">
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-primary">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Headphones className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">
                  Sound<span className="text-primary">Wave</span>
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[3px]">Premium Audio Store</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="font-display text-4xl font-bold text-primary tracking-wider">INVOICE</h1>
              <p className="text-sm font-semibold mt-1">{data.orderNumber}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-secondary/50 rounded-xl p-5 border border-border/50">
              <h4 className="text-[10px] uppercase tracking-[2px] text-primary font-bold mb-3 flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                Billed To
              </h4>
              <p className="font-semibold text-sm">{data.customerName}</p>
              <p className="text-xs text-muted-foreground mt-1">{data.shippingAddress}</p>
              <p className="text-xs text-muted-foreground">{data.city}, {data.state} - {data.pincode}</p>
              <p className="text-xs text-muted-foreground mt-1">{data.customerEmail}</p>
              <p className="text-xs text-muted-foreground">{data.customerPhone}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-5 border border-border/50">
              <h4 className="text-[10px] uppercase tracking-[2px] text-primary font-bold mb-3 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                From
              </h4>
              <p className="font-semibold text-sm">SoundWave India Pvt. Ltd.</p>
              <p className="text-xs text-muted-foreground mt-1">123 Audio Street, Tech Park</p>
              <p className="text-xs text-muted-foreground">Mumbai, Maharashtra - 400001</p>
              <p className="text-xs text-muted-foreground mt-1">GSTIN: 27AABCS1234R1ZP</p>
              <div className="mt-3 flex items-center gap-2">
                <CreditCard className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  {data.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="text-left p-3.5 text-[10px] uppercase tracking-[2px] font-semibold w-10">#</th>
                  <th className="text-left p-3.5 text-[10px] uppercase tracking-[2px] font-semibold">Product</th>
                  <th className="text-center p-3.5 text-[10px] uppercase tracking-[2px] font-semibold">Qty</th>
                  <th className="text-right p-3.5 text-[10px] uppercase tracking-[2px] font-semibold">Price</th>
                  <th className="text-right p-3.5 text-[10px] uppercase tracking-[2px] font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 even:bg-secondary/30">
                    <td className="p-3.5 text-xs text-muted-foreground">{i + 1}</td>
                    <td className="p-3.5 text-sm font-medium">{item.product_name}</td>
                    <td className="p-3.5 text-sm text-center">{item.quantity}</td>
                    <td className="p-3.5 text-sm text-right text-muted-foreground">₹{item.price.toLocaleString()}</td>
                    <td className="p-3.5 text-sm text-right font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-80 bg-secondary/50 rounded-xl p-5 border border-border/50 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal (excl. GST)</span>
                <span>₹{baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>CGST (9%)</span>
                <span>₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>SGST (9%)</span>
                <span>₹{sgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{data.shipping === 0 ? <span className="text-primary font-medium">FREE</span> : `₹${data.shipping}`}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Discount</span>
                  <span>-₹{data.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t-2 border-foreground">
                <span className="font-bold text-lg">Total</span>
                <span className="font-display text-2xl font-bold">₹{data.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">GST Summary:</strong> Total GST ₹{gstAmount.toLocaleString()} (CGST: ₹{cgst.toLocaleString()} + SGST: ₹{sgst.toLocaleString()}) included in total amount. GSTIN: 27AABCS1234R1ZP
            </p>
          </div>

          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="font-display text-sm font-bold">
              Sound<span className="text-primary">Wave</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Thank you for shopping with SoundWave! 🎵</p>
            <p className="text-[10px] text-muted-foreground mt-1">Computer-generated invoice — no signature required</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceGenerator;
