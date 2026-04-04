import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Package, Truck, CheckCircle2, MapPin, Clock, ChevronLeft, AlertCircle,
  PackageCheck, Home, Play, Eye, Download, FileText, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  order_status: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  payment_method: string;
  created_at: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string | null;
  created_at: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  product_image?: string | null;
}

const statusSteps = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const simulationData = [
  { status: 'processing', description: 'Order is being packed at the warehouse', location: 'Mumbai Warehouse' },
  { status: 'shipped', description: 'Package has been handed to courier partner', location: 'Mumbai Hub' },
  { status: 'out_for_delivery', description: 'Package is out for delivery in your area', location: 'Local Delivery Hub' },
  { status: 'delivered', description: 'Package has been delivered successfully', location: 'Delivery Address' },
];

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (searchParams.get('order')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim().toUpperCase())
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        setOrder(null);
        setTracking([]);
        setError('Order not found. Please check the order number and try again.');
        setLoading(false);
        return;
      }

      setOrder(orderData);

      const [trackingRes, itemsRes] = await Promise.all([
        supabase.from('order_tracking').select('*').eq('order_id', orderData.id).order('created_at', { ascending: false }),
        supabase.from('order_items').select('product_name, quantity, price, product_image').eq('order_id', orderData.id),
      ]);

      setTracking(trackingRes.data || []);
      setOrderItems(itemsRes.data || []);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNextStepLabel = () => {
    const currentIdx = getCurrentStepIndex();
    if (currentIdx >= statusSteps.length - 1) return null;
    return statusSteps[currentIdx + 1].label;
  };

  const simulateNextStep = async () => {
    if (!order || simulating) return;

    const currentIdx = getCurrentStepIndex();
    const nextSimIdx = currentIdx; // simulationData[0] = processing (index 1 in statusSteps), so currentIdx maps to simulationData offset

    if (currentIdx >= statusSteps.length - 1) {
      toast.info('Order is already delivered!');
      return;
    }

    // Find the next simulation step
    const nextStep = simulationData[currentIdx]; // currentIdx 0 (confirmed) -> simulationData[0] (processing)
    if (!nextStep) {
      toast.info('Order is already delivered!');
      return;
    }

    setSimulating(true);

    const { error: trackingError } = await supabase.from('order_tracking').insert({
      order_id: order.id,
      status: nextStep.status,
      description: nextStep.description,
      location: nextStep.location,
    });

    if (trackingError) {
      console.error('Tracking insert error:', trackingError);
      toast.error('Failed to update status');
      setSimulating(false);
      return;
    }

    // Refresh tracking
    const { data: newTracking } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: false });

    setTracking(newTracking || []);
    setOrder((prev) => (prev ? { ...prev, order_status: nextStep.status } : prev));
    toast.success(`Status updated: ${nextStep.status.replace(/_/g, ' ')}`);
    setSimulating(false);
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    const index = statusSteps.findIndex((step) => step.key === order.order_status);
    return index >= 0 ? index : 0;
  };

  const currentStep = getCurrentStepIndex();

  const handleDownloadInvoice = () => {
    setShowInvoice(true);
    setTimeout(() => {
      const btn = document.querySelector('[data-download]') as HTMLButtonElement;
      btn?.click();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="font-display text-4xl font-bold">
              Track Your <span className="gradient-text">Order</span>
            </h1>
            <p className="text-muted-foreground mt-2">Enter your order number to see real-time delivery status</p>
          </motion.div>

          {/* Search Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto mb-12">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter Order Number (e.g., SW1234ABC)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                <Button onClick={handleSearch} variant="hero" size="lg" disabled={loading}>
                  {loading ? 'Searching...' : 'Track'}
                </Button>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Order Details */}
          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              {/* Order Summary */}
              <div className="bg-card rounded-2xl border border-border p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-display text-xl font-bold text-primary">{order.order_number}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Order Total</p>
                      <p className="font-bold text-lg">₹{order.total.toLocaleString()}</p>
                    </div>
                    {/* Simulate Next Step Button */}
                    {order.order_status !== 'delivered' && (
                      <Button
                        onClick={simulateNextStep}
                        disabled={simulating}
                        variant="glow"
                        size="sm"
                        className="ml-2"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {simulating ? 'Updating...' : `→ ${getNextStepLabel()}`}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="relative">
                  <div className="flex justify-between items-center">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                              isCompleted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                            } ${isCurrent ? 'ring-4 ring-primary/30 shadow-lg shadow-primary/20' : ''}`}
                          >
                            <step.icon className="w-6 h-6" />
                          </motion.div>
                          <p className={`text-xs mt-2 text-center ${isCompleted ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-secondary -z-0">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                {/* Estimated Delivery + Actions */}
                <div className="mt-8 p-4 bg-secondary/50 rounded-xl flex flex-wrap items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-bold">
                      {order.order_status === 'delivered' ? (
                        <span className="text-primary">Delivered! ✅</span>
                      ) : (
                        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                          weekday: 'long', month: 'long', day: 'numeric'
                        })
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowInvoice(true)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Invoice
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-primary" />
                  Tracking History
                </h2>

                <div className="relative">
                  {tracking.length > 0 ? (
                    <div className="space-y-0">
                      {tracking.map((event, index) => {
                        const stepInfo = statusSteps.find(s => s.key === event.status);
                        const StepIcon = stepInfo?.icon || Package;
                        const isLatest = index === 0;

                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4"
                          >
                            <div className="relative flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isLatest 
                                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                                  : 'bg-secondary text-muted-foreground'
                              }`}>
                                <StepIcon className="w-5 h-5" />
                              </div>
                              {index < tracking.length - 1 && (
                                <div className="w-0.5 h-full min-h-[40px] bg-border my-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className={`p-4 rounded-xl border ${
                                isLatest 
                                  ? 'bg-primary/5 border-primary/20' 
                                  : 'bg-secondary/30 border-border/50'
                              }`}>
                                <p className={`font-semibold capitalize ${isLatest ? 'text-primary' : ''}`}>
                                  {event.status.replace(/_/g, ' ')}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {event.location}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(event.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No tracking updates yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">Click the simulate button above to see delivery progress.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-2xl border border-border p-6 mt-8">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Shipping Address
                </h2>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-muted-foreground">{order.shipping_address}, {order.city}, {order.state} - {order.pincode}</p>
              </div>
            </motion.div>
          )}

          {/* No Order Found */}
          {searched && !order && !loading && !error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4">Order Not Found</h2>
              <p className="text-muted-foreground mb-8">We couldn't find an order with that number.</p>
              <Link to="/contact"><Button variant="outline">Contact Support</Button></Link>
            </motion.div>
          )}

          {/* Initial State */}
          {!searched && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <Truck className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4">Track Your Package</h2>
              <p className="text-muted-foreground max-w-md mx-auto">Enter your order number above to get real-time updates.</p>
            </motion.div>
          )}
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

export default TrackOrder;
