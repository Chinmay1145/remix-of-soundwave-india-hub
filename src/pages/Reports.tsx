import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, subDays, differenceInMilliseconds, eachDayOfInterval } from 'date-fns';
import {
  Calendar as CalendarIcon, Download, BarChart3, TrendingUp, TrendingDown, Package, IndianRupee, ShoppingBag,
  Loader2, ChevronLeft, PieChart, Filter, Sparkles, FileSpreadsheet, Trophy, CreditCard, Tag, Clock, Flame, Users,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RePieChart, Pie, Cell,
  BarChart, Bar, Legend,
} from 'recharts';
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
import { PDF_COLORS, drawPdfHeader, drawPdfFooters, drawAccentRule, sanitizePdfText, formatCurrency, tableTheme } from '@/lib/pdf';
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
  payment_method?: string;
  customer_email?: string;
  created_at: string;
  items?: { product_id: string; product_name: string; quantity: number; price: number }[];
}

const CHART_COLORS = ['#f97316', '#3b82f6', '#a855f7', '#10b981', '#eab308', '#ef4444', '#06b6d4', '#8b5cf6'];

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

  // Previous equivalent period (same duration, immediately preceding)
  const { prevStart, prevEnd } = useMemo(() => {
    const durationMs = differenceInMilliseconds(rangeEnd, rangeStart) + 1;
    const pe = new Date(rangeStart.getTime() - 1);
    const ps = new Date(pe.getTime() - durationMs + 1);
    return { prevStart: ps, prevEnd: pe };
  }, [rangeStart, rangeEnd]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.created_at);
      return d >= rangeStart && d <= rangeEnd;
    });
  }, [orders, rangeStart, rangeEnd]);

  const prevOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.created_at);
      return d >= prevStart && d <= prevEnd;
    });
  }, [orders, prevStart, prevEnd]);

  // Stats
  const computeStats = (list: OrderRow[]) => {
    const totalRevenue = list.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = list.length;
    const totalItems = list.reduce((sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) || 0), 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalRevenue, totalOrders, totalItems, avgOrder };
  };

  const stats = useMemo(() => computeStats(filteredOrders), [filteredOrders]);
  const prevStats = useMemo(() => computeStats(prevOrders), [prevOrders]);

  const pctDelta = (curr: number, prev: number): number | null => {
    if (prev === 0) return curr === 0 ? 0 : null; // no baseline -> hide
    return ((curr - prev) / prev) * 100;
  };

  const kpiDeltas = useMemo(() => ({
    totalRevenue: pctDelta(stats.totalRevenue, prevStats.totalRevenue),
    totalOrders: pctDelta(stats.totalOrders, prevStats.totalOrders),
    totalItems: pctDelta(stats.totalItems, prevStats.totalItems),
    avgOrder: pctDelta(stats.avgOrder, prevStats.avgOrder),
  }), [stats, prevStats]);

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
      .map(([cat, v]) => ({ category: cat, quantity: v.qty, revenue: v.revenue, orderCount: v.orders.size }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const totalCatRevenue = categoryStats.reduce((s, c) => s + c.revenue, 0);

  // Brand-wise breakdown
  const brandStats = useMemo(() => {
    const map = new Map<string, { qty: number; revenue: number; orders: Set<string> }>();
    filteredOrders.forEach((o) => {
      o.items?.forEach((it) => {
        const product = productCatalog.find((p) => p.id === it.product_id);
        const brand = product?.brand || 'Other';
        if (!map.has(brand)) map.set(brand, { qty: 0, revenue: 0, orders: new Set() });
        const entry = map.get(brand)!;
        entry.qty += it.quantity;
        entry.revenue += Number(it.price) * it.quantity;
        entry.orders.add(o.id);
      });
    });
    return Array.from(map.entries())
      .map(([brand, v]) => ({ brand, quantity: v.qty, revenue: v.revenue, orderCount: v.orders.size }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const totalBrandRevenue = brandStats.reduce((s, c) => s + c.revenue, 0);

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

  const STATUS_COLORS: Record<string, string> = {
    pending: '#eab308', confirmed: '#3b82f6', shipped: '#a855f7', delivered: '#10b981', cancelled: '#ef4444',
  };

  // Payment method split
  const paymentStats = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      const key = o.payment_method || 'Unknown';
      if (!map[key]) map[key] = { count: 0, revenue: 0 };
      map[key].count += 1;
      map[key].revenue += Number(o.total);
    });
    return Object.entries(map).map(([method, v]) => ({ method, ...v }));
  }, [filteredOrders]);

  // Revenue & orders trend over the period (grouped by day)
  const trendData = useMemo(() => {
    if (filteredOrders.length === 0) return [];
    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
    const dayKey = (d: Date) => format(d, 'yyyy-MM-dd');
    const map = new Map<string, { revenue: number; orders: number }>();
    days.forEach((d) => map.set(dayKey(d), { revenue: 0, orders: 0 }));
    filteredOrders.forEach((o) => {
      const key = dayKey(new Date(o.created_at));
      if (!map.has(key)) map.set(key, { revenue: 0, orders: 0 });
      const entry = map.get(key)!;
      entry.revenue += Number(o.total);
      entry.orders += 1;
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, v]) => ({
        date: format(new Date(key), days.length > 45 ? 'dd MMM' : 'dd MMM'),
        revenue: Math.round(v.revenue),
        orders: v.orders,
      }));
  }, [filteredOrders, rangeStart, rangeEnd]);

  // Peak day / peak hour insight
  const peakInsights = useMemo(() => {
    if (filteredOrders.length === 0) return null;
    const dayMap = new Map<string, number>();
    const hourMap = new Map<number, number>();
    filteredOrders.forEach((o) => {
      const d = new Date(o.created_at);
      const dayKey = format(d, 'dd MMM yyyy');
      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + Number(o.total));
      const hour = d.getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });
    const bestDay = Array.from(dayMap.entries()).sort((a, b) => b[1] - a[1])[0];
    const bestHour = Array.from(hourMap.entries()).sort((a, b) => b[1] - a[1])[0];
    const hourLabel = (h: number) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:00 ${period} - ${h12}:00 ${period === 'AM' ? 'AM' : 'PM'}`;
    };
    return {
      bestDay: bestDay ? { label: bestDay[0], revenue: bestDay[1] } : null,
      bestHour: bestHour ? { label: hourLabel(bestHour[0]), orders: bestHour[1] } : null,
    };
  }, [filteredOrders]);

  const bestCategory = categoryStats[0] || null;
  const bestProduct = topProducts[0] || null;

  // Repeat vs new customers (derivable via customer_email across ALL orders, not just filtered)
  const customerInsight = useMemo(() => {
    if (filteredOrders.length === 0) return null;
    const hasEmails = filteredOrders.every((o) => !!o.customer_email);
    if (!hasEmails) return null;
    let repeat = 0, fresh = 0;
    const seenBefore = new Set(
      orders.filter((o) => new Date(o.created_at) < rangeStart).map((o) => o.customer_email)
    );
    const inPeriodEmails = new Set<string>();
    filteredOrders.forEach((o) => {
      if (!o.customer_email) return;
      if (inPeriodEmails.has(o.customer_email)) return;
      inPeriodEmails.add(o.customer_email);
      if (seenBefore.has(o.customer_email)) repeat += 1; else fresh += 1;
    });
    if (repeat + fresh === 0) return null;
    return { repeat, fresh };
  }, [filteredOrders, orders, rangeStart]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const S = sanitizePdfText;
    const money = formatCurrency;

    let y = drawPdfHeader(doc, {
      eyebrow: 'ANALYTICS & BUSINESS INTELLIGENCE',
      title: 'SALES REPORT',
      metaLines: [S(rangeLabel.replace(/\u2014/g, '-')), `${filteredOrders.length} orders in period`],
    });

    const deltaText = (d: number | null) => (d === null ? '' : ` (${d >= 0 ? '+' : ''}${d.toFixed(1)}% vs prev)`);

    // --- KPI summary cards ---
    const cards = [
      { label: 'TOTAL REVENUE', value: money(stats.totalRevenue) + deltaText(kpiDeltas.totalRevenue), accent: PDF_COLORS.primary },
      { label: 'TOTAL ORDERS', value: stats.totalOrders.toString() + deltaText(kpiDeltas.totalOrders), accent: PDF_COLORS.ink },
      { label: 'AVG ORDER VALUE', value: money(Math.round(stats.avgOrder)) + deltaText(kpiDeltas.avgOrder), accent: PDF_COLORS.ink },
      { label: 'UNITS SOLD', value: stats.totalItems.toString() + deltaText(kpiDeltas.totalItems), accent: PDF_COLORS.ink },
    ];
    const gap = 4;
    const cardW = (pw - 28 - gap * 3) / 4;
    const cardH = 30;
    cards.forEach((c, i) => {
      const x = 14 + i * (cardW + gap);
      doc.setFillColor(...PDF_COLORS.surface);
      doc.roundedRect(x, y, cardW, cardH, 2.5, 2.5, 'F');
      doc.setDrawColor(...PDF_COLORS.border);
      doc.roundedRect(x, y, cardW, cardH, 2.5, 2.5, 'S');
      doc.setFillColor(...c.accent);
      doc.rect(x, y, 2, cardH, 'F');
      doc.setTextColor(...PDF_COLORS.primary);
      doc.setFontSize(6.2);
      doc.setFont('helvetica', 'bold');
      doc.text(c.label, x + 6, y + 9);
      doc.setTextColor(...PDF_COLORS.ink);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      const valFit = doc.splitTextToSize(c.value, cardW - 10);
      valFit.slice(0, 2).forEach((line: string, li: number) => doc.text(line, x + 6, y + 18 + li * 5));
    });

    y += cardH + 12;

    const ensureSpace = (needed: number) => {
      if (y > ph - needed) { doc.addPage(); y = 22; }
    };

    const sectionTitle = (title: string, ruleW: number) => {
      ensureSpace(60);
      doc.setTextColor(...PDF_COLORS.ink);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, y);
      drawAccentRule(doc, 14, y + 2, ruleW);
      y += 6;
    };

    // --- Peak insights / best performers ---
    sectionTitle('Key Insights', 34);
    const insightLines = [
      peakInsights?.bestDay ? `Peak Sales Day: ${S(peakInsights.bestDay.label)} (${money(peakInsights.bestDay.revenue)})` : null,
      peakInsights?.bestHour ? `Peak Sales Hour: ${S(peakInsights.bestHour.label)} (${peakInsights.bestHour.orders} orders)` : null,
      bestCategory ? `Best Category: ${S(bestCategory.category)} (${money(bestCategory.revenue)})` : null,
      bestProduct ? `Best Product: ${S(bestProduct.name)} (${bestProduct.qty} units)` : null,
      customerInsight ? `Customers: ${customerInsight.fresh} new, ${customerInsight.repeat} repeat` : null,
    ].filter(Boolean) as string[];
    autoTable(doc, {
      startY: y,
      body: insightLines.length > 0 ? insightLines.map((l) => [l]) : [['No insights available for this period']],
      theme: 'plain',
      styles: { fontSize: 8.5, textColor: PDF_COLORS.inkSoft, cellPadding: 1.6 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // --- Category-wise breakdown ---
    sectionTitle('Category-wise Sales Breakdown', 46);
    autoTable(doc, {
      startY: y,
      head: [['Category', 'Orders', 'Units Sold', 'Revenue', 'Share']],
      body: categoryStats.length > 0 ? categoryStats.map((c) => [
        S(c.category), c.orderCount.toString(), c.quantity.toString(), money(c.revenue),
        `${totalCatRevenue > 0 ? ((c.revenue / totalCatRevenue) * 100).toFixed(1) : '0.0'}%`,
      ]) : [['No data', '-', '-', '-', '-']],
      ...tableTheme,
      columnStyles: {
        1: { halign: 'center', cellWidth: 24 }, 2: { halign: 'center', cellWidth: 28 },
        3: { halign: 'right', cellWidth: 40, fontStyle: 'bold' }, 4: { halign: 'right', cellWidth: 24 },
      },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // --- Brand-wise breakdown ---
    sectionTitle('Brand-wise Sales Breakdown', 42);
    autoTable(doc, {
      startY: y,
      head: [['Brand', 'Orders', 'Units Sold', 'Revenue', 'Share']],
      body: brandStats.length > 0 ? brandStats.map((b) => [
        S(b.brand), b.orderCount.toString(), b.quantity.toString(), money(b.revenue),
        `${totalBrandRevenue > 0 ? ((b.revenue / totalBrandRevenue) * 100).toFixed(1) : '0.0'}%`,
      ]) : [['No data', '-', '-', '-', '-']],
      ...tableTheme,
      columnStyles: {
        1: { halign: 'center', cellWidth: 24 }, 2: { halign: 'center', cellWidth: 28 },
        3: { halign: 'right', cellWidth: 40, fontStyle: 'bold' }, 4: { halign: 'right', cellWidth: 24 },
      },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // --- Top products ---
    sectionTitle('Top Selling Products', 40);
    autoTable(doc, {
      startY: y,
      head: [['Rank', 'Product', 'Units Sold', 'Revenue']],
      body: topProducts.length > 0 ? topProducts.map((p, i) => [`#${i + 1}`, S(p.name), p.qty.toString(), money(p.revenue)]) : [['-', 'No data', '-', '-']],
      ...tableTheme,
      columnStyles: { 0: { halign: 'center', cellWidth: 16 }, 2: { halign: 'center', cellWidth: 28 }, 3: { halign: 'right', cellWidth: 40, fontStyle: 'bold' } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // --- Order status breakdown ---
    sectionTitle('Order Status Breakdown', 44);
    autoTable(doc, {
      startY: y,
      head: [['Status', 'Count']],
      body: statusStats.length > 0 ? statusStats.map((s) => [s.status.replace(/_/g, ' ').toUpperCase(), s.count.toString()]) : [['No data', '-']],
      ...tableTheme,
      columnStyles: { 1: { halign: 'center', cellWidth: 30 } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // --- Payment method split ---
    sectionTitle('Payment Method Split', 44);
    autoTable(doc, {
      startY: y,
      head: [['Payment Method', 'Orders', 'Revenue']],
      body: paymentStats.length > 0 ? paymentStats.map((p) => [S(p.method.replace(/_/g, ' ').toUpperCase()), p.count.toString(), money(p.revenue)]) : [['No data', '-', '-']],
      ...tableTheme,
      columnStyles: { 1: { halign: 'center', cellWidth: 26 }, 2: { halign: 'right', cellWidth: 40, fontStyle: 'bold' } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // --- Orders detail ---
    sectionTitle('Orders Detail', 30);
    autoTable(doc, {
      startY: y,
      head: [['Order #', 'Date', 'Status', 'Items', 'Amount']],
      body: filteredOrders.length > 0 ? filteredOrders.map((o) => [
        S(o.order_number), format(new Date(o.created_at), 'dd MMM yyyy'), S(o.order_status.replace(/_/g, ' ')),
        (o.items?.reduce((s, i) => s + i.quantity, 0) || 0).toString(), money(Number(o.total)),
      ]) : [['No orders in this period', '-', '-', '-', '-']],
      ...tableTheme,
      showHead: 'everyPage',
      columnStyles: { 1: { cellWidth: 30 }, 2: { cellWidth: 28 }, 3: { halign: 'center', cellWidth: 18 }, 4: { halign: 'right', cellWidth: 36, fontStyle: 'bold' } },
      margin: { left: 14, right: 14 },
    });

    drawPdfFooters(doc, 'SoundWave Analytics - Confidential Business Report');

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
    const deltaCsv = (d: number | null) => (d === null ? 'N/A' : `${d >= 0 ? '+' : ''}${d.toFixed(1)}%`);
    rows.push(`Total Revenue,INR ${stats.totalRevenue},vs prev period,${deltaCsv(kpiDeltas.totalRevenue)}`);
    rows.push(`Total Orders,${stats.totalOrders},vs prev period,${deltaCsv(kpiDeltas.totalOrders)}`);
    rows.push(`Items Sold,${stats.totalItems},vs prev period,${deltaCsv(kpiDeltas.totalItems)}`);
    rows.push(`Avg Order Value,INR ${Math.round(stats.avgOrder)},vs prev period,${deltaCsv(kpiDeltas.avgOrder)}`);
    rows.push('');
    rows.push('KEY INSIGHTS');
    if (peakInsights?.bestDay) rows.push(`Peak Sales Day,${peakInsights.bestDay.label},INR ${Math.round(peakInsights.bestDay.revenue)}`);
    if (peakInsights?.bestHour) rows.push(`Peak Sales Hour,${peakInsights.bestHour.label},${peakInsights.bestHour.orders} orders`);
    if (bestCategory) rows.push(`Best Category,${bestCategory.category},INR ${bestCategory.revenue}`);
    if (bestProduct) rows.push(`Best Product,${bestProduct.name},${bestProduct.qty} units`);
    if (customerInsight) rows.push(`Customers,New ${customerInsight.fresh},Repeat ${customerInsight.repeat}`);
    rows.push('');
    rows.push('REVENUE & ORDERS TREND');
    rows.push('Date,Revenue (INR),Orders');
    trendData.forEach((t) => rows.push(`${t.date},${t.revenue},${t.orders}`));
    rows.push('');
    rows.push('CATEGORY-WISE');
    rows.push('Category,Orders,Units,Revenue,Share %');
    categoryStats.forEach((c) => {
      const share = totalCatRevenue > 0 ? ((c.revenue / totalCatRevenue) * 100).toFixed(1) : '0.0';
      rows.push(`${c.category},${c.orderCount},${c.quantity},${c.revenue},${share}`);
    });
    rows.push('');
    rows.push('BRAND-WISE');
    rows.push('Brand,Orders,Units,Revenue,Share %');
    brandStats.forEach((b) => {
      const share = totalBrandRevenue > 0 ? ((b.revenue / totalBrandRevenue) * 100).toFixed(1) : '0.0';
      rows.push(`${b.brand},${b.orderCount},${b.quantity},${b.revenue},${share}`);
    });
    rows.push('');
    rows.push('ORDER STATUS');
    rows.push('Status,Count');
    statusStats.forEach((s) => rows.push(`${s.status},${s.count}`));
    rows.push('');
    rows.push('PAYMENT METHOD SPLIT');
    rows.push('Method,Orders,Revenue');
    paymentStats.forEach((p) => rows.push(`${p.method},${p.count},${p.revenue}`));
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

  const DeltaBadge = ({ value }: { value: number | null }) => {
    if (value === null) return null;
    const isUp = value >= 0;
    return (
      <span className={cn('inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
        isUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-destructive bg-destructive/10')}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

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
              <div className="flex gap-2">
                <Button variant="outline" size="lg" onClick={generateCSV} className="gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV
                </Button>
                <Button variant="glow" size="lg" onClick={generatePDF} className="gap-2">
                  <Download className="w-4 h-4" />
                  PDF Report
                </Button>
              </div>
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
                  { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-emerald-500 to-teal-600', delta: kpiDeltas.totalRevenue },
                  { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'from-blue-500 to-indigo-600', delta: kpiDeltas.totalOrders },
                  { label: 'Items Sold', value: stats.totalItems.toString(), icon: Package, color: 'from-purple-500 to-pink-600', delta: kpiDeltas.totalItems },
                  { label: 'Avg Order Value', value: `₹${Math.round(stats.avgOrder).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'from-orange-500 to-red-600', delta: kpiDeltas.avgOrder },
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
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <DeltaBadge value={s.delta} />
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{s.label}</p>
                      <p className="font-display text-2xl font-bold">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">vs previous period</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Revenue & Orders Trend */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6 mb-6">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Revenue & Orders Trend
                </h3>
                {trendData.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No sales data in this period</p>
                  </div>
                ) : (
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                          labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                          formatter={(value: number, name: string) => [name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                        />
                        <Area yAxisId="revenue" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revenueFill)" strokeWidth={2} name="revenue" />
                        <Area yAxisId="orders" type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} strokeDasharray="4 3" name="orders" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>

              {/* Insight Cards */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Peak Sales Insight
                  </h3>
                  {peakInsights ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Peak Sales Day</p>
                          <p className="text-sm font-semibold">{peakInsights.bestDay?.label} — ₹{Math.round(peakInsights.bestDay?.revenue || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Peak Sales Hour</p>
                          <p className="text-sm font-semibold">{peakInsights.bestHour?.label} — {peakInsights.bestHour?.orders} orders</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm">No data available</div>
                  )}
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Best Performers
                  </h3>
                  {bestCategory || bestProduct ? (
                    <div className="space-y-3">
                      {bestCategory && (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Top Category</p>
                            <p className="text-sm font-semibold">{bestCategory.category} — ₹{bestCategory.revenue.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      )}
                      {bestProduct && (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Package className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Top Product</p>
                            <p className="text-sm font-semibold truncate">{bestProduct.name} — {bestProduct.qty} units</p>
                          </div>
                        </div>
                      )}
                      {customerInsight && (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Customers</p>
                            <p className="text-sm font-semibold">{customerInsight.fresh} new, {customerInsight.repeat} repeat</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm">No data available</div>
                  )}
                </div>
              </motion.div>

              {/* Status & Payment breakdown */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Order Status Breakdown
                  </h3>
                  {statusStats.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No orders in this period</p>
                    </div>
                  ) : (
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie data={statusStats} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={2}>
                            {statusStats.map((entry, i) => (
                              <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                            formatter={(value: number, name: string) => [value, name.replace(/_/g, ' ')]}
                          />
                          <Legend formatter={(value: string) => <span className="text-xs capitalize">{value.replace(/_/g, ' ')}</span>} />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Method Split
                  </h3>
                  {paymentStats.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No orders in this period</p>
                    </div>
                  ) : (
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={paymentStats} layout="vertical" margin={{ left: 10, right: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis type="category" dataKey="method" width={90} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v: string) => v.replace(/_/g, ' ')} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                            formatter={(value: number, name: string) => [name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                          />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} name="count" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
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

              {/* Brand-wise Reports */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }} className="bg-card rounded-2xl border border-border p-6 mb-6">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Brand-wise Sales
                </h3>
                {brandStats.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Tag className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No sales data in this period</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {brandStats.map((b, i) => {
                      const pct = totalBrandRevenue > 0 ? (b.revenue / totalBrandRevenue) * 100 : 0;
                      const colors = ['from-orange-500 to-red-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-emerald-500 to-teal-500', 'from-yellow-500 to-amber-500'];
                      return (
                        <div key={b.brand} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${colors[i % colors.length]}`} />
                              {b.brand}
                            </span>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{b.quantity} units</span>
                              <span className="font-bold text-foreground">₹{b.revenue.toLocaleString('en-IN')}</span>
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
                {topProducts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Top Selling Products
                    </h3>
                    <div className="space-y-2">
                      {topProducts.map((p, i) => (
                        <div key={p.name + i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                            i === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                            i === 1 ? 'bg-slate-400/20 text-slate-500' :
                            i === 2 ? 'bg-orange-500/20 text-orange-600' :
                            'bg-muted text-muted-foreground'
                          )}>
                            #{i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                          </div>
                          <p className="font-bold font-mono text-sm">₹{p.revenue.toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
