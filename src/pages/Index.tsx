import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, Headphones, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import HeroSlider from '@/components/HeroSlider';
import { products, categories, brands, getProductsByCategory } from '@/lib/products';
import { collections, getCollectionProducts } from '@/lib/collections';
import heroImage from '@/assets/hero-earbuds.jpg';

const categoryTaglines: Record<string, string> = {
  tws: 'Pocket-sized freedom',
  neckband: 'All-day companions',
  headphones: 'Studio-grade cans',
  gaming: 'Low-latency battle gear',
};

const Index = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Sound Wave Animation */}
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <div className="sound-wave">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span className="text-sm font-medium text-primary uppercase tracking-widest">
                  Made in India
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block">Wireless</span>
                <span className="block gradient-text">Freedom,</span>
                <span className="block">Pure Sound</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Discover India's finest audio gear. Premium earbuds, headphones, and neckbands 
                from top brands at unbeatable prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products">
                  <Button variant="hero" size="xl">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="hero-outline" size="xl">
                    Explore Collection
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 mt-12">
                {[
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '100+', label: 'Products' },
                  { value: '8+', label: 'Top Brands' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10"
              >
                <img
                  src={heroImage}
                  alt="Premium wireless earbuds with orange glow"
                  className="w-full max-w-2xl mx-auto rounded-3xl"
                />
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-10 right-10 bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Fast Charging</div>
                    <div className="text-xs text-muted-foreground">10 mins = 2 hours</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-0 bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Active ANC</div>
                    <div className="text-xs text-muted-foreground">-35dB Noise Reduction</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="relative py-28 bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 -left-32 w-[520px] h-[420px] bg-primary/10 blur-[140px] rounded-full" />
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">
                  Browse the range
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-4">
                Shop by<br /><span className="gradient-text">Category</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Four curated lanes of sound — from pocket-sized buds to studio-grade cans.
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <div className="font-display text-4xl font-bold">
                  {categories.reduce((s, c) => s + (c.count || 0), 0)}+
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">Products</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <Link to="/products">
                <Button variant="outline" size="lg">
                  Browse all
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const inCategory = getProductsByCategory(category.slug);
              const startingAt =
                inCategory.length > 0
                  ? Math.min(...inCategory.map((p) => p.price))
                  : undefined;
              return (
                <CategoryCard
                  key={category.slug}
                  {...category}
                  index={index}
                  tagline={categoryTaglines[category.slug]}
                  startingAt={startingAt}
                />
              );
            })}
          </div>

          {/* Quick shop rails */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Quick shop
            </span>
            {[
              { label: 'Under ₹1,499', to: '/products?max=1499' },
              { label: 'ANC enabled', to: '/products?anc=true' },
              { label: 'Top rated', to: '/products?sort=rating' },
              { label: 'Big discounts', to: '/deals' },
            ].map((chip) => (
              <Link
                key={chip.label}
                to={chip.to}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-16"
          >
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
                Trending <span className="gradient-text">Now</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Our most popular picks this season
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Slider Section */}
      <section className="relative py-24 bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 right-0 w-[560px] h-[420px] bg-[hsl(35_100%_55%)]/10 blur-[150px] rounded-full" />
        </div>
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">
                  Curated by our audio team
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-4">
                Featured<br /><span className="gradient-text">Collections</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Handpicked drops, refreshed every week — tested, ranked and approved before they land here.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  to={`/collections/${c.slug}`}
                  className="px-4 py-2 rounded-full border border-border text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Collection cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {collections.map((c, index) => {
              const items = getCollectionProducts(c, 3);
              return (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    to={`/collections/${c.slug}`}
                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${c.accent} via-card to-card p-6 transition-all duration-500 hover:border-primary/60 hover:shadow-[0_24px_60px_-24px_hsl(var(--primary)/0.45)]`}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                        {c.tagline}
                      </p>
                      <h3 className="font-display text-2xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex -space-x-3">
                        {items.map((p) => (
                          <img
                            key={p.id}
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="h-10 w-10 rounded-full border-2 border-card object-cover"
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                        Open
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
        <HeroSlider />
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-background overflow-hidden border-y border-border">
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Top <span className="gradient-text">Indian Brands</span>
            </h2>
            <p className="text-muted-foreground">
              Shop from India's most loved audio brands
            </p>
          </motion.div>
        </div>

        {/* Scrolling Brand Strip */}
        <div className="relative">
          <div className="flex animate-marquee">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-12 text-3xl md:text-4xl font-display font-bold text-foreground/30 hover:text-primary transition-colors cursor-pointer"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="gradient-text">Customers Say</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of happy customers who love our products
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rahul M.',
                location: 'Mumbai',
                rating: 5,
                text: 'Amazing sound quality! The bass is incredible and battery lasts forever. Best purchase I made this year.',
                product: 'Airdopes 441 Pro',
              },
              {
                name: 'Priya S.',
                location: 'Bangalore',
                rating: 5,
                text: 'Super fast delivery and genuine products. The ANC on my headphones is a game-changer for WFH.',
                product: 'Nirvana 751 ANC',
              },
              {
                name: 'Amit K.',
                location: 'Delhi',
                rating: 5,
                text: 'Great value for money. Customer support helped me choose the perfect earbuds for my needs.',
                product: 'ColorBuds 2 Pro',
              },
            ].map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-primary">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.location}</div>
                  </div>
                  <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {review.product}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                description: 'Free delivery on orders above ₹999',
              },
              {
                icon: Shield,
                title: '1 Year Warranty',
                description: 'Manufacturer warranty on all products',
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                description: 'Round the clock customer support',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience
              <br />
              <span className="gradient-text">Premium Audio?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of satisfied customers who've made the switch to better sound.
            </p>
            <Link to="/products">
              <Button variant="hero" size="xl" className="animate-pulse-glow">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
