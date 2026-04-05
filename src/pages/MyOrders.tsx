import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, ChevronDown, Search, Calendar, MapPin, ShoppingBag, Download, Eye, FileText, Loader2, CheckCircle2, Home, Clock, XCircle, RefreshCw, IndianRupee, Play } from 'lucide-react';
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

const statusConfig: Record<string, { color: string; bgColor: string; icon: typeof Package; label: string }> = {
  confirmed: { color: 'text-blue-400', bgColor: 'bg-blue-500/15 border-blue-500/30', icon: CheckCircle2, label: 'Confirmed' },
  processing: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/15 border-yellow-500/30', icon: RefreshCw, label: 'Processing' },
  shipped: { color: 'text-purple-400', bgColor: 'bg-purple-500/15 border-purple-500/30', icon: Truck, label: 'Shipped' },
  out_for_delivery: { color: 'text-orange-400', bgColor: 'bg-orange-500/15 border-orange-500/30', icon: MapPin, label: 'Out for Delivery' },
  delivered: { color: 'text-green-400', bgColor: 'bg-green-500/15 border-green-500/30', icon: Home, label: 'Delivered' },
  cancelled: { color: 'text-red-400', bgColor: 'bg-red-500/15 border-red-500/30', icon: XCircle, label: 'Cancelled' },
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
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [simulatingOrderId, setSimulatingOrderId] = useState<string | null>(null);

  const simulationData = [
    { status: 'processing', description: 'Order is being packed at the warehouse', location: 'Mumbai Warehouse' },
    { status: 'shipped', description: 'Package has been handed to courier partner', location: 'Mumbai Hub' },
    { status: 'out_for_delivery', description: 'Package is out for delivery in your area', location: 'Local Delivery Hub' },
    { status: 'delivered', description: 'Package has been delivered successfully', location: 'Delivered' },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/my-orders');
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
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
            supabase.from('order_tracking').select('*').eq('order_id', order.id).order('created_at', { ascending: true }),
          ]);
          return { ...order, items: itemsRes.data || [], tracking: trackingRes.data || [] };
        })
      );
      setOrders(ordersWithDetails);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || order.order_status === activeTab;
    return matchesSearch && matchesTab;
  });

  const orderCounts = {
    all: orders.length,
    confirmed: orders.filter((o) => o.order_status === 'confirmed').length,
    processing: orders.filter((o) => o.order_status === 'processing').length,
    shipped: orders.filter((o) => o.order_status === 'shipped').length,
    delivered: orders.filter((o) => o.order_status === 'delivered').length,
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const getCurrentStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    const idx = statusSteps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const handleDownloadPDF = (order: Order) => {
    setInvoiceOrder(order);
    setShowInvoicePreview(false);
    // Trigger download after state update
    setTimeout(() => {
      const downloadBtn = document.querySelector('[data-download-pdf]') as HTMLButtonElement;
      downloadBtn?.click();
    }, 100);
  };

  const handleViewInvoice = (order: Order) => {
    setInvoiceOrder(order);
    setShowInvoicePreview(true);
  };

  const tabs = [
    { key: 'all', label: 'All Orders', count: orderCounts.all },
    { key: 'confirmed', label: 'Confirmed', count: orderCounts.confirmed },
    { key: 'processing', label: 'Processing', count: orderCounts.processing },
    { key: 'shipped', label: 'Shipped', count: orderCounts.shipped },
    { key: 'delivered', label: 'Delivered', count: orderCounts.delivered },
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
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                  <ShoppingBag className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold">
                    My <span className="gradient-text">Orders</span>
                  </h1>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={fetchOrders} className="hidden sm:flex">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Status Tabs with counts */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key ? 'bg-primary-foreground/20' : 'bg-secondary'
                    }`}>
                      {tab.count}
                    </span>
                  )}
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
                placeholder="Search by order number or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card border-border rounded-xl"
              />
            </div>
          </motion.div>

          {/* Orders List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse border border-border">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-secondary rounded w-1/3" />
                    <div className="h-6 bg-secondary rounded w-20" />
                  </div>
                  <div className="h-2 bg-secondary rounded w-full mb-4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {searchQuery ? 'No Matching Orders' : activeTab !== 'all' ? `No ${tabs.find(t => t.key === activeTab)?.label} Orders` : 'No Orders Yet'}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery
                  ? 'Try a different search term or clear your filters'
                  : activeTab !== 'all'
                  ? `You don't have any orders with "${tabs.find(t => t.key === activeTab)?.label}" status`
                  : "Start shopping to see your orders here"}
              </p>
              {!searchQuery && activeTab === 'all' && (
                <Link to="/products">
                  <Button variant="glow" size="lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              )}
              {(searchQuery || activeTab !== 'all') && (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveTab('all'); }}>
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const config = statusConfig[order.order_status] || statusConfig.confirmed;
                const StatusIcon = config.icon;
                const isExpanded = expandedOrder === order.id;
                const stepIndex = getCurrentStepIndex(order.order_status);
                const isCancelled = order.order_status === 'cancelled';

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Order Header */}
                    <div
                      className="p-5 cursor-pointer select-none"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="font-display font-bold text-lg">#{order.order_number}</span>
                            <Badge variant="outline" className={`${config.bgColor} border text-xs`}>
                              <StatusIcon className={`w-3 h-3 mr-1 ${config.color}`} />
                              <span className={config.color}>{config.label}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs border-border">
                              <IndianRupee className="w-3 h-3 mr-0.5" />
                              {order.payment_method.toUpperCase()}
                            </Badge>
                          </div>

                          {/* Progress Steps */}
                          {!isCancelled && (
                            <div className="flex items-center gap-1 mb-3">
                              {statusSteps.map((step, i) => (
                                <div key={step} className="flex-1 flex items-center gap-1">
                                  <div
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                      i <= stepIndex
                                        ? i === stepIndex
                                          ? 'bg-primary animate-pulse'
                                          : 'bg-primary'
                                        : 'bg-secondary'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {isCancelled && (
                            <div className="h-1.5 w-full rounded-full bg-red-500/30 mb-3" />
                          )}

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
                        <div className="text-right flex flex-col items-end gap-2 flex-shrink-0">
                          <p className="font-display font-bold text-xl text-primary">₹{order.total.toLocaleString()}</p>
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
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
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border p-5 space-y-6">
                            {/* Order Items */}
                            <div>
                              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Package className="w-3.5 h-3.5" />
                                Order Items ({order.items?.length || 0})
                              </h3>
                              <div className="space-y-2">
                                {order.items?.map((item) => (
                                  <div key={item.id} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors">
                                    {item.product_image ? (
                                      <img src={item.product_image} alt={item.product_name} className="w-14 h-14 object-cover rounded-lg border border-border" />
                                    ) : (
                                      <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center border border-border">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{item.product_name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                                      </p>
                                    </div>
                                    <p className="font-bold text-sm">₹{(item.quantity * item.price).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Progress - Visual Steps */}
                            {!isCancelled && (
                              <div>
                                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <Truck className="w-3.5 h-3.5" />
                                  Order Progress
                                </h3>
                                <div className="grid grid-cols-5 gap-0">
                                  {statusSteps.map((step, i) => {
                                    const stepConfig = statusConfig[step];
                                    const StepIcon = stepConfig.icon;
                                    const isCompleted = i <= stepIndex;
                                    const isCurrent = i === stepIndex;
                                    return (
                                      <div key={step} className="flex flex-col items-center text-center relative">
                                        {/* Connector line */}
                                        {i > 0 && (
                                          <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${
                                            i <= stepIndex ? 'bg-primary' : 'bg-secondary'
                                          }`} />
                                        )}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all ${
                                          isCurrent
                                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg shadow-primary/30'
                                            : isCompleted
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-muted-foreground'
                                        }`}>
                                          <StepIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <p className={`text-[10px] mt-2 font-medium leading-tight ${
                                          isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                        }`}>
                                          {stepConfig.label}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Tracking History Timeline */}
                            {order.tracking && order.tracking.length > 0 && (
                              <div>
                                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5" />
                                  Tracking History
                                </h3>
                                <div className="bg-secondary/20 rounded-xl p-4 border border-border/50">
                                  {order.tracking.map((event, i) => {
                                    const eventConfig = statusConfig[event.status];
                                    const EventIcon = eventConfig?.icon || Package;
                                    const isLatest = i === order.tracking!.length - 1;
                                    return (
                                      <div key={event.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            isLatest
                                              ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                                              : 'bg-card border border-border text-muted-foreground'
                                          }`}>
                                            <EventIcon className="w-3.5 h-3.5" />
                                          </div>
                                          {i < order.tracking!.length - 1 && (
                                            <div className="w-0.5 h-10 bg-border my-1" />
                                          )}
                                        </div>
                                        <div className="pb-4 flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className={`font-semibold text-sm capitalize ${isLatest ? 'text-primary' : 'text-foreground'}`}>
                                              {event.status.replace(/_/g, ' ')}
                                            </p>
                                            {isLatest && (
                                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Latest</span>
                                            )}
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                            {event.location && (
                                              <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {event.location}
                                              </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {formatDateTime(event.created_at)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* No tracking yet */}
                            {(!order.tracking || order.tracking.length === 0) && !isCancelled && (
                              <div className="bg-secondary/20 rounded-xl p-4 border border-border/50 text-center">
                                <Clock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Tracking updates will appear here once your order is processed
                                </p>
                              </div>
                            )}

                            {/* Price Summary */}
                            <div className="bg-secondary/20 rounded-xl p-4 border border-border/50">
                              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                <IndianRupee className="w-3.5 h-3.5" />
                                Price Summary
                              </h3>
                              <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Subtotal</span>
                                  <span>₹{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Shipping</span>
                                  <span>{order.shipping === 0 ? <span className="text-green-400">FREE</span> : `₹${order.shipping}`}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-green-400">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                                  <span>Total</span>
                                  <span className="text-primary">₹{order.total.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-secondary/20 rounded-xl p-4 border border-border/50">
                              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" />
                                Delivery Address
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {order.customer_name} • {order.customer_phone}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 pt-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                navigator.clipboard.writeText(order.order_number);
                                toast.success('Order number copied!');
                              }}>
                                <FileText className="w-4 h-4 mr-2" />
                                Copy Order #
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleViewInvoice(order)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Invoice
                              </Button>
                              <Button variant="glow" size="sm" onClick={() => handleDownloadPDF(order)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
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

      {/* Invoice Preview Modal */}
      {invoiceOrder && showInvoicePreview && (
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
          onClose={() => { setInvoiceOrder(null); setShowInvoicePreview(false); }}
        />
      )}

      {/* Hidden invoice for direct PDF download */}
      {invoiceOrder && !showInvoicePreview && (
        <div className="hidden">
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
            showPreview={false}
            onClose={() => setInvoiceOrder(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MyOrders;
