import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Percent,
  Gift,
  Copy,
  Check,
  Flame,
  TicketPercent,
  ArrowRight,
  BadgeIndianRupee,
  ShieldCheck,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/lib/products';
import { toast } from 'sonner';

const coupons = [
  { code: 'SAVE10', desc: '10% off on orders above ₹1,499', tone: 'primary' },
  { code: 'SAVE20', desc: '20% off on orders above ₹2,999', tone: 'primary' },
  { code: 'BASS25', desc: '25% off on headphones & TWS', tone: 'accent' },
  { code: 'AUDIO500', desc: 'Flat ₹500 off above ₹2,499', tone: 'accent' },
  { code: 'MEGA30', desc: '30% off above ₹4,999', tone: 'accent' },
  { code: 'FREESHIP', desc: '5% off + free shipping', tone: 'primary' },
];

const useCountdown = () => {
  const target = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }, []);
  const [left, setLeft] = useState(target - Date.now());

  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);

  const total = Math.floor(left / 1000);
  return {
    hours: String(Math.floor(total / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    seconds: String(total % 60).padStart(2, '0'),
  };
};

const filters = [
  { key: 'all', label: 'All deals' },
  { key: '50', label: '50% + off' },
  { key: 'under1500', label: 'Under ₹1,499' },
  { key: 'anc', label: 'ANC deals' },
  { key: 'toprated', label: 'Top rated' },
] as const;

const Deals = () => {
  const { hours, minutes, seconds } = useCountdown();
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]['key']>('all');

  const discounted = useMemo(
    () => [...products].filter((p) => p.discount > 0).sort((a, b) => b.discount - a.discount),
    []
  );
  const flashDeals = discounted.slice(0, 4);

  const dealsProducts = useMemo(() => {
    switch (filter) {
      case '50':
        return discounted.filter((p) => p.discount >= 50);
      case 'under1500':
        return discounted.filter((p) => p.price <= 1499);
      case 'anc':
        return discounted.filter((p) => p.anc);
      case 'toprated':
        return [...discounted].sort((a, b) => b.rating - a.rating);
      default:
        return discounted;
    }
  }, [discounted, filter]);

  const totalSaving = discounted.reduce(
    (s, p) => s + Math.max(0, (p.originalPrice || p.price) - p.price),
    0
  );

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      toast.success(`Coupon ${code} copied`, { description: 'Apply it at cart or checkout.' });
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Could not copy the code');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/12 via-transparent to-transparent" />
          <div className="absolute -top-24 left-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[150px]" />
          <div className="container mx-auto px-4 py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full text-xs font-bold uppercase tracking-[0.18em] mb-6">
                <Zap className="w-4 h-4" />
                Limited time offers
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-5">
                Hot <span className="gradient-text">Deals</span>
                <br />& Offers
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Grab the best audio gear at unbeatable prices. Prices reset at midnight — stock is
                limited.
              </p>

              {/* Countdown + stats */}
              <div className="mt-10 flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-3">
                  {[
                    { v: hours, l: 'Hrs' },
                    { v: minutes, l: 'Min' },
                    { v: seconds, l: 'Sec' },
                  ].map((t) => (
                    <div
                      key={t.l}
                      className="w-20 rounded-2xl border border-border bg-card/70 py-3 text-center backdrop-blur"
                    >
                      <div className="font-display text-3xl font-bold text-primary tabular-nums">
                        {t.v}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t.l}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden lg:block w-px h-14 bg-border" />

                <div className="flex flex-wrap gap-8">
                  <div>
                    <div className="font-display text-3xl font-bold">{discounted.length}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      Products on sale
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-3xl font-bold text-primary">
                      ₹{totalSaving.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      Total savings live
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Coupons */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TicketPercent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Coupons you can stack today</h2>
                <p className="text-sm text-muted-foreground">
                  Tap a code to copy, then apply it in your cart
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c, i) => (
                <motion.button
                  key={c.code}
                  onClick={() => copyCode(c.code)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-card p-5 text-left transition-colors hover:border-primary"
                >
                  <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
                  <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
                  <div className="pl-3">
                    <div className="font-display text-xl font-bold tracking-wider">{c.code}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
                  </div>
                  <span className="mr-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {copied === c.code ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale */}
        <section className="py-12 border-y border-border bg-card/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Flash Sale</h2>
                  <p className="text-sm text-muted-foreground">
                    Ends in {hours}:{minutes}:{seconds} · deepest cuts of the day
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-destructive">
                <Flame className="h-4 w-4" />
                Selling fast
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashDeals.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* All deals with filters */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">All discounted gear</h2>
                  <p className="text-sm text-muted-foreground">
                    {dealsProducts.length} products match this filter
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                      filter === f.key
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {dealsProducts.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-16 text-center">
                <p className="text-muted-foreground">No deals match this filter right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dealsProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index % 8} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Category deals */}
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold mb-6">Deals by category</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((c) => {
                const inCat = discounted.filter(
                  (p) => p.category.toLowerCase() === c.slug.toLowerCase()
                );
                const best = inCat[0];
                return (
                  <Link
                    key={c.slug}
                    to={`/products?category=${c.slug}`}
                    className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {c.name}
                    </div>
                    <div className="mt-2 font-display text-2xl font-bold text-primary">
                      Up to {best ? best.discount : 0}% off
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      {inCat.length} deals
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Offer Banner */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12"
            >
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    icon: Gift,
                    title: 'Free shipping above ₹999',
                    desc: 'Pan-India delivery in 2–5 days, tracked end to end.',
                  },
                  {
                    icon: BadgeIndianRupee,
                    title: 'Surprise gift above ₹2,999',
                    desc: 'A curated accessory drops into every qualifying order.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Price-drop protection',
                    desc: 'Price falls within 7 days? We refund the difference.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold">{title}</div>
                      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/products">
                  <Button variant="hero" size="lg">
                    Shop all products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/collections/best-value">
                  <Button variant="outline" size="lg">
                    Best value picks
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Deals;
