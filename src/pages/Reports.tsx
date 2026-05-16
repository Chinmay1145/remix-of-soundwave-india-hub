import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, subDays } from 'date-fns';
import { Calendar as CalendarIcon, Download, BarChart3, TrendingUp, Package, IndianRupee, ShoppingBag, Loader2, ChevronLeft, PieChart, Filter, Sparkles, FileSpreadsheet, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { products as productCatalog } from '@/lib/products';

type ReportPreset = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';

interface OrderRow {
  id: string;
  order_number: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  order_status: string;
  created_at: string;
  items?: { product_id: string; product_name: string; quantity: number; price: number }[];
}

const Reports = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<ReportPreset>('monthly');
  const [singleDate, setSingleDate] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date>(subDays(new Date(), 30));
  const [toDate, setToDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?redirect=/reports');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;
      setLoading(true);
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        toast.error('Failed to load reports data');
        setLoading(false);
        return;
      }
      const enriched = await Promise.all(
        (ordersData || []).map(async (o) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('product_id, product_name, quantity, price')
            .eq('order_id', o.id);
          return { ...o, items: items || [] };
        })
      );
      setOrders(enriched);
      setLoading(false);
    };
    fetchAll();
  }, [user]);

  const { rangeStart, rangeEnd, rangeLabel } = useMemo(() => {
    let s: Date, e: Date, label: string;
    const now = new Date();
    switch (preset) {
      case 'daily':
        s = startOfDay(singleDate);
        e = endOfDay(singleDate);
        label = `Daily Report — ${format(singleDate, 'PPP')}`;
        break;
      case 'weekly':
        s = startOfWeek(singleDate, { weekStartsOn: 1 });
        e = endOfWeek(singleDate, { weekStartsOn: 1 });
        label = `Weekly Report — ${format(s, 'dd MMM')} to ${format(e, 'dd MMM yyyy')}`;
        break;
      case 'monthly':
        s = startOfMonth(singleDate);
        e = endOfMonth(singleDate);
        label = `Monthly Report — ${format(singleDate, 'MMMM yyyy')}`;
        break;
      case 'quarterly':
        s = startOfQuarter(singleDate);
        e = endOfQuarter(singleDate);
        label = `Quarterly Report — Q${Math.floor(singleDate.getMonth() / 3) + 1} ${format(singleDate, 'yyyy')}`;
        break;
      case 'custom':
      default:
        s = startOfDay(fromDate);
        e = endOfDay(toDate);
        label = `Custom Report — ${format(s, 'dd MMM yyyy')} to ${format(e, 'dd MMM yyyy')}`;
    }
    return { rangeStart: s, rangeEnd: e, rangeLabel: label };
  }, [preset, singleDate, fromDate, toDate]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.created_at);
      return d >= rangeStart && d <= rangeEnd;
    });
  }, [orders, rangeStart, rangeEnd]);

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = filteredOrders.length;
    const totalItems = filteredOrders.reduce(
      (sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) || 0),
      0
    );
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalRevenue, totalOrders, totalItems, avgOrder };
  }, [filteredOrders]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, { qty: number; revenue: number; orders: Set<string> }>();
    filteredOrders.forEach((o) => {
      o.items?.forEach((it) => {
        const product = productCatalog.find((p) => p.id === it.product_id);
        const cat = product?.category || 'Other';
        if (!map.has(cat)) map.set(cat, { qty: 0, revenue: 0, orders: new Set() });
        const entry = map.get(cat)!;
        entry.qty += it.quantity;
        entry.revenue += Number(it.price) * it.quantity;
        entry.orders.add(o.id);
      });
    });
    return Array.from(map.entries())
      .map(([cat, v]) => ({
        category: cat,
        quantity: v.qty,
        revenue: v.revenue,
        orderCount: v.orders.size,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const totalCatRevenue = categoryStats.reduce((s, c) => s + c.revenue, 0);

  // Top selling products
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>();
    filteredOrders.forEach((o) => {
      o.items?.forEach((it) => {
        const key = it.product_id;
        if (!map.has(key)) map.set(key, { name: it.product_name, qty: 0, revenue: 0 });
        const e = map.get(key)!;
        e.qty += it.quantity;
        e.revenue += Number(it.price) * it.quantity;
      });
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [filteredOrders]);

  // Status breakdown
  const statusStats = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      map[o.order_status] = (map[o.order_status] || 0) + 1;
    });
    return Object.entries(map).map(([k, v]) => ({ status: k, count: v }));
  }, [filteredOrders]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();

    // Top accent
    doc.setFillColor(232, 65, 24);
    doc.rect(0, 0, pw, 4, 'F');

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 4, pw, 46, 'F');

    doc.setTextColor(232, 65, 24);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SoundWave', 16, 24);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('ANALYTICS & REPORTS', 16, 32);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT', pw - 16, 22, { align: 'right' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(rangeLabel.replace(/—/g, '-'), pw - 16, 30, { align: 'right' });
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, pw - 16, 37, { align: 'right' });

    let y = 60;

    // Summary cards
    const cards = [
      { label: 'TOTAL REVENUE', value: `INR ${stats.totalRevenue.toLocaleString('en-IN')}` },
      { label: 'TOTAL ORDERS', value: stats.totalOrders.toString() },
      { label: 'ITEMS SOLD', value: stats.totalItems.toString() },
      { label: 'AVG ORDER VALUE', value: `INR ${Math.round(stats.avgOrder).toLocaleString('en-IN')}` },
    ];
    const cardW = (pw - 28 - 9) / 4;
    cards.forEach((c, i) => {
      const x = 14 + i * (cardW + 3);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, cardW, 26, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, y, cardW, 26, 2, 2, 'S');
      doc.setTextColor(232, 65, 24);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text(c.label, x + 4, y + 8);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(c.value, x + 4, y + 19);
    });

    y += 36;

    // Category-wise table
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Category-wise Sales', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Category', 'Orders', 'Units Sold', 'Revenue', 'Share']],
      body: categoryStats.length > 0 ? categoryStats.map((c) => [
        c.category,
        c.orderCount.toString(),
        c.quantity.toString(),
        `INR ${c.revenue.toLocaleString('en-IN')}`,
        `${totalCatRevenue > 0 ? ((c.revenue / totalCatRevenue) * 100).toFixed(1) : '0.0'}%`,
      ]) : [['No data', '-', '-', '-', '-']],
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', cellPadding: 4 },
      bodyStyles: { fontSize: 9, textColor: [30, 41, 59], cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        1: { halign: 'center', cellWidth: 24 },
        2: { halign: 'center', cellWidth: 28 },
        3: { halign: 'right', cellWidth: 40, fontStyle: 'bold' },
        4: { halign: 'right', cellWidth: 24 },
      },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Order status table
    if (y > ph - 60) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Order Status Breakdown', 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Status', 'Count']],
      body: statusStats.length > 0 ? statusStats.map((s) => [s.status.replace(/_/g, ' ').toUpperCase(), s.count.toString()]) : [['No data', '-']],
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', cellPadding: 4 },
      bodyStyles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 1: { halign: 'center', cellWidth: 30 } },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Orders detail
    if (y > ph - 60) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Orders Detail', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Order #', 'Date', 'Status', 'Items', 'Amount']],
      body: filteredOrders.length > 0 ? filteredOrders.map((o) => [
        o.order_number,
        format(new Date(o.created_at), 'dd MMM yyyy'),
        o.order_status.replace(/_/g, ' '),
        (o.items?.reduce((s, i) => s + i.quantity, 0) || 0).toString(),
        `INR ${Number(o.total).toLocaleString('en-IN')}`,
      ]) : [['No orders in this period', '-', '-', '-', '-']],
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', cellPadding: 4 },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59], cellPadding: 3.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        1: { cellWidth: 30 },
        2: { cellWidth: 28 },
        3: { halign: 'center', cellWidth: 18 },
        4: { halign: 'right', cellWidth: 36, fontStyle: 'bold' },
      },
      margin: { left: 14, right: 14 },
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFillColor(15, 23, 42);
      doc.rect(0, ph - 18, pw, 18, 'F');
      doc.setFillColor(232, 65, 24);
      doc.rect(0, ph - 18, pw, 2, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('SoundWave Analytics - Confidential Business Report', pw / 2, ph - 10, { align: 'center' });
      doc.text(`Page ${p} of ${pageCount}`, pw - 14, ph - 5, { align: 'right' });
      doc.text(format(new Date(), 'dd MMM yyyy'), 14, ph - 5);
    }

    const filename = `SoundWave_Report_${preset}_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
    doc.save(filename);
    toast.success('Report downloaded successfully!');
  };

  const generateCSV = () => {
    const rows: string[] = [];
    rows.push(`SoundWave Report,${rangeLabel.replace(/,/g, ' ')}`);
    rows.push(`Generated,${format(new Date(), 'dd MMM yyyy HH:mm')}`);
    rows.push('');
    rows.push('SUMMARY');
    rows.push(`Total Revenue,INR ${stats.totalRevenue}`);
    rows.push(`Total Orders,${stats.totalOrders}`);
    rows.push(`Items Sold,${stats.totalItems}`);
    rows.push(`Avg Order Value,INR ${Math.round(stats.avgOrder)}`);
    rows.push('');
    rows.push('CATEGORY-WISE');
    rows.push('Category,Orders,Units,Revenue,Share %');
    categoryStats.forEach((c) => {
      const share = totalCatRevenue > 0 ? ((c.revenue / totalCatRevenue) * 100).toFixed(1) : '0.0';
      rows.push(`${c.category},${c.orderCount},${c.quantity},${c.revenue},${share}`);
    });
    rows.push('');
    rows.push('ORDERS');
    rows.push('Order #,Date,Status,Items,Amount (INR)');
    filteredOrders.forEach((o) => {
      const items = o.items?.reduce((s, i) => s + i.quantity, 0) || 0;
      rows.push(`${o.order_number},${format(new Date(o.created_at), 'dd MMM yyyy')},${o.order_status},${items},${o.total}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SoundWave_Report_${preset}_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const presets: { key: ReportPreset; label: string; icon: typeof BarChart3 }[] = [
    { key: 'daily', label: 'Daily', icon: CalendarIcon },
    { key: 'weekly', label: 'Weekly', icon: TrendingUp },
    { key: 'monthly', label: 'Monthly', icon: BarChart3 },
    { key: 'quarterly', label: 'Quarterly', icon: PieChart },
    { key: 'custom', label: 'Custom Range', icon: Filter },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </motion.button>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                  <BarChart3 className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
                    Reports & <span className="gradient-text">Analytics</span>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </h1>
                  <p className="text-muted-foreground text-sm mt-0.5">{rangeLabel}</p>
                </div>
              </div>
              <Button variant="glow" size="lg" onClick={generatePDF} className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF Report
              </Button>
            </div>
          </motion.div>

          {/* Preset Tabs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {presets.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPreset(p.key)}
                    className={cn(
                      'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
                      preset === p.key
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Date Pickers */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 bg-card rounded-2xl border border-border p-5">
            {preset !== 'custom' ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground">Select date:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('justify-start text-left font-normal', !singleDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {singleDate ? format(singleDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={singleDate}
                      onSelect={(d) => d && setSingleDate(d)}
                      initialFocus
                      className={cn('p-3 pointer-events-auto')}
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-muted-foreground ml-auto">Click any date to view its {preset} report</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground">From:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(fromDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} initialFocus className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
                <span className="text-sm text-muted-foreground">To:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(toDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} disabled={(d) => d < fromDate} initialFocus className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </motion.div>

          {/* Stats Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-emerald-500 to-teal-600' },
                  { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'from-blue-500 to-indigo-600' },
                  { label: 'Items Sold', value: stats.totalItems.toString(), icon: Package, color: 'from-purple-500 to-pink-600' },
                  { label: 'Avg Order Value', value: `₹${Math.round(stats.avgOrder).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'from-orange-500 to-red-600' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{s.label}</p>
                      <p className="font-display text-2xl font-bold">{s.value}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Category-wise Reports */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border p-6 mb-6">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Category-wise Sales
                </h3>
                {categoryStats.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No sales data in this period</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categoryStats.map((c, i) => {
                      const pct = totalCatRevenue > 0 ? (c.revenue / totalCatRevenue) * 100 : 0;
                      const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-emerald-500 to-teal-500', 'from-orange-500 to-red-500', 'from-yellow-500 to-amber-500'];
                      return (
                        <div key={c.category} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${colors[i % colors.length]}`} />
                              {c.category}
                            </span>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{c.quantity} units</span>
                              <span className="font-bold text-foreground">₹{c.revenue.toLocaleString('en-IN')}</span>
                              <span className="w-12 text-right font-semibold text-primary">{pct.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
                              className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Orders in period */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Orders in this period ({filteredOrders.length})
                </h3>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No orders found in this period</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                          <th className="text-left py-3 px-2 font-semibold">Order #</th>
                          <th className="text-left py-3 px-2 font-semibold">Date</th>
                          <th className="text-left py-3 px-2 font-semibold">Status</th>
                          <th className="text-center py-3 px-2 font-semibold">Items</th>
                          <th className="text-right py-3 px-2 font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.slice(0, 20).map((o) => (
                          <tr key={o.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                            <td className="py-3 px-2 font-mono text-xs font-semibold">#{o.order_number}</td>
                            <td className="py-3 px-2 text-muted-foreground">{format(new Date(o.created_at), 'dd MMM yyyy')}</td>
                            <td className="py-3 px-2 capitalize">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-xs">
                                {o.order_status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">{o.items?.reduce((s, i) => s + i.quantity, 0) || 0}</td>
                            <td className="py-3 px-2 text-right font-bold font-mono">₹{Number(o.total).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredOrders.length > 20 && (
                      <p className="text-xs text-muted-foreground text-center mt-3">Showing 20 of {filteredOrders.length} orders. Download PDF for full report.</p>
                    )}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
