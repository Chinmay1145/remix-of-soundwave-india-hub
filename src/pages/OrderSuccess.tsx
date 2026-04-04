import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Package, Truck, MapPin, Mail, Phone, Copy, ExternalLink, 
  Sparkles, PartyPopper, FileText, Download, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  created_at: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  product_image?: string | null;
}

const GST_RATE = 0.18;
const confettiColors = ['#FF6B35', '#FFD23F', '#4ECDC4', '#FF6F91', '#845EC2'];

const OrderSuccess = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .maybeSingle();

      if (!error && data) {
        setOrder(data);

        const { data: items } = await supabase
          .from('order_items')
          .select('product_name, quantity, price, product_image')
          .eq('order_id', data.id);

        setOrderItems(items || []);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderNumber]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber || '');
    toast.success('Order number copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const gstAmount = order ? Math.round(order.subtotal * GST_RATE / (1 + GST_RATE)) : 0;
  const baseAmount = order ? order.subtotal - gstAmount : 0;

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      <main className="pt-24 pb-16 relative">
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), opacity: 0, rotate: 0 }}
              animate={{ y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100, opacity: [0, 1, 1, 0], rotate: 360 }}
              transition={{ duration: Math.random() * 3 + 2, delay: Math.random() * 2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
              className="absolute w-4 h-4"
              style={{ backgroundColor: confettiColors[i % confettiColors.length], borderRadius: Math.random() > 0.5 ? '50%' : '0' }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Success Animation */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }} className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative inline-block mb-6"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-16 h-16 text-primary-foreground" />
              </div>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                >
                  <Sparkles className="w-6 h-6 text-primary absolute -top-2" style={{ left: '50%', transform: 'translateX(-50%)' }} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <PartyPopper className="w-8 h-8 text-primary" />
                <h1 className="font-display text-4xl md:text-5xl font-bold">
                  Order <span className="gradient-text">Confirmed!</span>
                </h1>
                <PartyPopper className="w-8 h-8 text-primary transform -scale-x-100" />
              </div>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Thank you for your purchase! Your order is being prepared with care.
              </p>
            </motion.div>
          </motion.div>

          {/* Order Details Card */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="max-w-2xl mx-auto">
            <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
              {/* Order Number */}
              <div className="text-center mb-8 pb-8 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-2xl font-bold text-primary">{orderNumber}</span>
                  <button onClick={copyOrderNumber} className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Copy order number">
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {order && (
                <>
                  {/* Order Info Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{order.customer_email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{order.customer_phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Shipping Address</p>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                          <p className="font-medium">
                            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                              weekday: 'long', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GST Breakdown */}
                  <div className="bg-secondary/50 rounded-xl p-5 mb-8">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Price Breakdown (incl. GST)
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Base Amount</span>
                        <span>₹{baseAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>CGST (9%)</span>
                        <span>₹{Math.round(gstAmount / 2).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>SGST (9%)</span>
                        <span>₹{(gstAmount - Math.round(gstAmount / 2)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? <span className="text-primary">FREE</span> : `₹${order.shipping}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link to={`/track-order?order=${orderNumber}`} className="col-span-2 sm:col-span-1">
                  <Button variant="hero" className="w-full" size="sm">
                    <Truck className="w-4 h-4 mr-1" />
                    Track
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setShowInvoice(true)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowInvoice(true);
                    setTimeout(() => {
                      const downloadBtn = document.querySelector('[data-download]') as HTMLButtonElement;
                      downloadBtn?.click();
                    }, 300);
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Link to="/products">
                  <Button variant="outline" className="w-full" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Shop More
                  </Button>
                </Link>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-8 text-muted-foreground text-sm">
              <p>A confirmation email has been sent to your email address.</p>
              <p className="mt-2">
                Questions? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Invoice Modal */}
      {order && (
        <InvoiceGenerator
          showPreview={showInvoice}
          onClose={() => setShowInvoice(false)}
          data={{
            orderNumber: order.order_number,
            date: order.created_at,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            customerPhone: order.customer_phone,
            shippingAddress: order.shipping_address,
            city: order.city,
            state: order.state,
            pincode: order.pincode,
            paymentMethod: order.payment_method,
            items: orderItems,
            subtotal: order.subtotal,
            shipping: order.shipping,
            discount: order.discount,
            total: order.total,
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default OrderSuccess;
