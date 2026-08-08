import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { collections, getCollection, getCollectionProducts } from '@/lib/collections';

const sortOptions = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'discount', label: 'Biggest Discount' },
] as const;

const Collection = () => {
  const { slug = '' } = useParams();
  const collection = getCollection(slug);
  const [sort, setSort] = useState<(typeof sortOptions)[number]['key']>('featured');

  const items = useMemo(() => {
    if (!collection) return [];
    const list = [...getCollectionProducts(collection)];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => b.discount - a.discount);
      default:
        return list;
    }
  }, [collection, sort]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24 container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Collection not found</h1>
          <p className="text-muted-foreground mb-8">This curated drop is no longer live.</p>
          <Link to="/products">
            <Button variant="hero">Browse all products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating =
    items.length > 0
      ? (items.reduce((s, p) => s + p.rating, 0) / items.length).toFixed(1)
      : '—';
  const lowest = items.length > 0 ? Math.min(...items.map((p) => p.price)) : 0;
  const maxOff = items.length > 0 ? Math.max(...items.map((p) => p.discount)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${collection.accent} via-transparent to-transparent`}
          />
          <div className="absolute -top-24 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]" />
          <div className="container mx-auto px-4 py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">
                  {collection.tagline}
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-5">
                {collection.name}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">{collection.description}</p>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
                {[
                  { label: 'Products', value: String(items.length) },
                  { label: 'Avg rating', value: avgRating },
                  { label: 'Starting at', value: `₹${lowest.toLocaleString('en-IN')}` },
                  { label: 'Max off', value: `${maxOff}%` },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card/60 p-4">
                    <div className="font-display text-2xl font-bold">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sort bar */}
        <section className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
              Sort
            </span>
            {sortOptions.map((o) => (
              <button
                key={o.key}
                onClick={() => setSort(o.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors border ${
                  sort === o.key
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-4 py-12">
          {items.length === 0 ? (
            <div className="text-center py-24">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Nothing in this collection right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index % 8} />
              ))}
            </div>
          )}
        </section>

        {/* Other collections */}
        <section className="container mx-auto px-4 pb-4">
          <h2 className="font-display text-2xl font-bold mb-6">More collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {collections
              .filter((c) => c.slug !== collection.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to={`/collections/${c.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/60 transition-colors"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
                    {c.tagline}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold">{c.name}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;