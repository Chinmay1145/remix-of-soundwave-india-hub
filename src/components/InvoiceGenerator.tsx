import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Headphones, FileText, Shield, Calendar, CreditCard, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${data.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #fff; color: #1a1a2e; padding: 40px; }
          .invoice { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #e84118; }
          .logo { display: flex; align-items: center; gap: 12px; }
          .logo-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #e84118, #ff9f43); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; }
          .logo-text { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
          .logo-text span { color: #e84118; }
          .logo-sub { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px; }
          .invoice-title { text-align: right; }
          .invoice-title h1 { font-size: 40px; font-weight: 900; color: #e84118; letter-spacing: 3px; line-height: 1; }
          .invoice-title .meta { margin-top: 8px; }
          .invoice-title .meta p { font-size: 13px; color: #666; line-height: 1.6; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
          .meta-card { background: #f8f9fa; border-radius: 12px; padding: 20px; border: 1px solid #eee; }
          .meta-card h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #e84118; margin-bottom: 10px; font-weight: 700; }
          .meta-card p { font-size: 13px; line-height: 1.7; color: #444; }
          .meta-card p strong { color: #1a1a2e; }
          .payment-badge { display: inline-block; background: #e84118; color: white; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          table { width: 100%; border-collapse: collapse; margin: 24px 0; border-radius: 12px; overflow: hidden; }
          thead th { background: linear-gradient(135deg, #1a1a2e, #2d2d4e); color: white; padding: 14px 18px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
          thead th:last-child, thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
          tbody td { padding: 16px 18px; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #333; }
          tbody td:last-child, tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; }
          tbody td:last-child { font-weight: 700; color: #1a1a2e; }
          tbody tr:last-child td { border-bottom: none; }
          tbody tr:nth-child(even) { background: #fafafa; }
          .summary-section { display: flex; justify-content: flex-end; margin-top: 8px; }
          .summary-table { width: 320px; background: #f8f9fa; border-radius: 12px; padding: 20px; border: 1px solid #eee; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #666; }
          .summary-row.discount { color: #e84118; }
          .summary-row.total { border-top: 2px solid #1a1a2e; margin-top: 10px; padding-top: 14px; font-size: 22px; font-weight: 900; color: #1a1a2e; }
          .gst-banner { background: linear-gradient(135deg, #fff5f0, #fff0e8); border: 1px solid #fdd; border-radius: 12px; padding: 16px 20px; margin-top: 24px; display: flex; align-items: center; gap: 12px; }
          .gst-icon { width: 36px; height: 36px; background: #e84118; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; flex-shrink: 0; }
          .gst-text { font-size: 12px; color: #666; line-height: 1.5; }
          .gst-text strong { color: #333; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; }
          .footer p { font-size: 11px; color: #999; line-height: 1.8; }
          .footer .brand { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
          .footer .brand span { color: #e84118; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="logo">
              <div class="logo-icon">🎧</div>
              <div>
                <div class="logo-text">Sound<span>Wave</span></div>
                <div class="logo-sub">Premium Audio Store</div>
              </div>
            </div>
            <div class="invoice-title">
              <h1>INVOICE</h1>
              <div class="meta">
                <p><strong>${data.orderNumber}</strong></p>
                <p>${formattedDate}</p>
              </div>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-card">
              <h3>Billed To</h3>
              <p><strong>${data.customerName}</strong></p>
              <p>${data.shippingAddress}</p>
              <p>${data.city}, ${data.state} - ${data.pincode}</p>
              <p>${data.customerEmail}</p>
              <p>${data.customerPhone}</p>
            </div>
            <div class="meta-card">
              <h3>From</h3>
              <p><strong>SoundWave India Pvt. Ltd.</strong></p>
              <p>123 Audio Street, Tech Park</p>
              <p>Mumbai, Maharashtra - 400001</p>
              <p>GSTIN: 27AABCS1234R1ZP</p>
              <p>support@soundwave.in</p>
              <p style="margin-top: 8px;"><span class="payment-badge">${data.paymentMethod.toUpperCase()}</span></p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${item.product_name}</strong></td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toLocaleString()}</td>
                  <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-section">
            <div class="summary-table">
              <div class="summary-row"><span>Subtotal (excl. GST)</span><span>₹${baseAmount.toLocaleString()}</span></div>
              <div class="summary-row"><span>CGST (9%)</span><span>₹${cgst.toLocaleString()}</span></div>
              <div class="summary-row"><span>SGST (9%)</span><span>₹${sgst.toLocaleString()}</span></div>
              <div class="summary-row"><span>Shipping</span><span>${data.shipping === 0 ? 'FREE' : '₹' + data.shipping}</span></div>
              ${data.discount > 0 ? `<div class="summary-row discount"><span>Discount</span><span>-₹${data.discount.toLocaleString()}</span></div>` : ''}
              <div class="summary-row total"><span>Total</span><span>₹${data.total.toLocaleString()}</span></div>
            </div>
          </div>

          <div class="gst-banner">
            <div class="gst-icon">🛡</div>
            <div class="gst-text">
              <strong>GST Summary:</strong> Total GST ₹${gstAmount.toLocaleString()} (CGST: ₹${cgst.toLocaleString()} + SGST: ₹${sgst.toLocaleString()}) included in total. GSTIN: 27AABCS1234R1ZP
            </div>
          </div>

          <div class="footer">
            <p class="brand">Sound<span>Wave</span></p>
            <p>Thank you for shopping with SoundWave! 🎵</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!showPreview) return null;

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
            <Button variant="glow" size="sm" onClick={handleDownload} data-download>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8">
          {/* Invoice Header */}
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

          {/* Info Cards */}
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

          {/* Items Table */}
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

          {/* Summary */}
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

          {/* GST Info */}
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">GST Summary:</strong> Total GST ₹{gstAmount.toLocaleString()} (CGST: ₹{cgst.toLocaleString()} + SGST: ₹{sgst.toLocaleString()}) included in total amount. GSTIN: 27AABCS1234R1ZP
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-1">
            <p className="font-display text-sm font-bold">
              Sound<span className="text-primary">Wave</span>
            </p>
            <p className="text-xs text-muted-foreground">Thank you for shopping with SoundWave! 🎵</p>
            <p className="text-[10px] text-muted-foreground/60">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceGenerator;
