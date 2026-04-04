import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, ChevronDown, Search, Calendar, MapPin, ShoppingBag, Download, Eye, FileText, Loader2, CheckCircle2, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  items?: OrderItem[];
  tracking?: TrackingEvent[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string | null;
  created_at: string;
}

const statusConfig: Record<string, { color: string; icon: typeof Package; label: string }> = {
  confirmed: { color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: CheckCircle2, label: 'Confirmed' },
  processing: { color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-500/15 text-purple-400 border-purple-500/30', icon: Truck, label: 'Shipped' },
  'out_for_delivery': { color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: MapPin, label: 'Out for Delivery' },
  delivered: { color: 'bg-green-500/15 text-green-400 border-green-500/30', icon: Home, label: 'Delivered' },
  cancelled: { color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: Package, label: 'Cancelled' },
};

const statusSteps = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/my-orders');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        const ordersWithDetails = await Promise.all(
          (ordersData || []).map(async (order) => {
            const [itemsRes, trackingRes] = await Promise.all([
              supabase.from('order_items').select('*').eq('order_id', order.id),
              supabase.from('order_tracking').select('*').eq('order_id', order.id).order('created_at', { ascending: false }),
            ]);
            return { ...order, items: itemsRes.data || [], tracking: trackingRes.data || [] };
          })
        );
        setOrders(ordersWithDetails);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || order.order_status === activeTab;
    return matchesSearch && matchesTab;
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const getCurrentStepIndex = (status: string) => {
    const idx = statusSteps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const handleDownloadPDF = (order: Order) => {
    setInvoiceOrder(order);
    setTimeout(() => {
      const btn = document.querySelector('[data-download]') as HTMLButtonElement;
      btn?.click();
    }, 300);
  };

  const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  My <span className="gradient-text">Orders</span>
                </h1>
                <p className="text-muted-foreground text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card border-border rounded-xl"
              />
            </div>
          </motion.div>

          {/* Orders */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse border border-border">
                  <div className="h-6 bg-secondary rounded w-1/3 mb-4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try a different search term' : "You haven't placed any orders yet"}
              </p>
              <Link to="/products">
                <Button variant="glow">Start Shopping</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const config = statusConfig[order.order_status] || statusConfig.confirmed;
                const StatusIcon = config.icon;
                const isExpanded = expandedOrder === order.id;
                const stepIndex = getCurrentStepIndex(order.order_status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    {/* Order Header */}
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-display font-bold text-lg">#{order.order_number}</span>
                            <Badge variant="outline" className={`${config.color} border text-xs`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>

                          {/* Mini progress bar */}
                          <div className="flex items-center gap-1 mb-3">
                            {statusSteps.map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all ${
                                  i <= stepIndex ? 'bg-primary' : 'bg-secondary'
                                }`}
                              />
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(order.created_at)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {order.city}, {order.state}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5" />
                              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-display font-bold text-xl text-primary">₹{order.total.toLocaleString()}</p>
                          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-border overflow-hidden"
                        >
                          <div className="p-5 space-y-5">
                            {/* Items */}
                            <div>
                              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Order Items</h3>
                              <div className="space-y-2">
                                {order.items?.map((item) => (
                                  <div key={item.id} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-xl">
                                    {item.product_image ? (
                                      <img src={item.product_image} alt={item.product_name} className="w-14 h-14 object-cover rounded-lg" />
                                    ) : (
                                      <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{item.product_name}</p>
                                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <p className="font-semibold text-sm">₹{(item.quantity * item.price).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tracking Timeline */}
                            {order.tracking && order.tracking.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Tracking History</h3>
                                <div className="space-y-0">
                                  {order.tracking.map((event, i) => {
                                    const stepInfo = statusConfig[event.status];
                                    const StepIcon = stepInfo?.icon || Package;
                                    const isLatest = i === 0;
                                    return (
                                      <div key={event.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            isLatest ? 'bg-primary text-primary-foreground ring-2 ring-primary/20' : 'bg-secondary text-muted-foreground'
                                          }`}>
                                            <StepIcon className="w-4 h-4" />
                                          </div>
                                          {i < order.tracking!.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                                        </div>
                                        <div className="pb-4 flex-1">
                                          <p className={`font-medium text-sm capitalize ${isLatest ? 'text-primary' : ''}`}>
                                            {event.status.replace(/_/g, ' ')}
                                          </p>
                                          <p className="text-xs text-muted-foreground">{event.description}</p>
                                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            {event.location && (
                                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                                            )}
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {new Date(event.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Delivery Address */}
                            <div className="p-4 bg-secondary/30 rounded-xl">
                              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Delivery Address</p>
                              <p className="text-sm text-muted-foreground">
                                {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                              <Link to={`/track-order?order=${order.order_number}`} className="flex-1">
                                <Button variant="outline" className="w-full" size="sm">
                                  <Truck className="w-4 h-4 mr-2" />
                                  Track Order
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" onClick={() => setInvoiceOrder(order)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Invoice
                              </Button>
                              <Button variant="glow" size="sm" onClick={() => handleDownloadPDF(order)}>
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceGenerator
          data={{
            orderNumber: invoiceOrder.order_number,
            date: invoiceOrder.created_at,
            customerName: invoiceOrder.customer_name,
            customerEmail: invoiceOrder.customer_email,
            customerPhone: invoiceOrder.customer_phone,
            shippingAddress: invoiceOrder.shipping_address,
            city: invoiceOrder.city,
            state: invoiceOrder.state,
            pincode: invoiceOrder.pincode,
            paymentMethod: invoiceOrder.payment_method,
            items: invoiceOrder.items || [],
            subtotal: invoiceOrder.subtotal,
            shipping: invoiceOrder.shipping,
            discount: invoiceOrder.discount,
            total: invoiceOrder.total,
          }}
          showPreview={true}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

export default MyOrders;
