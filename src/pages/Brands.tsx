import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Package, TrendingUp, Award, Users, Headphones, Shield, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, brands } from '@/lib/products';

import boatLogo from '@/assets/brands/boat-logo.jpg';
import noiseLogo from '@/assets/brands/noise-logo.jpg';
import boultLogo from '@/assets/brands/boult-logo.jpg';
import miviLogo from '@/assets/brands/mivi-logo.jpg';
import zebronicsLogo from '@/assets/brands/zebronics-logo.jpg';
import ptronLogo from '@/assets/brands/ptron-logo.jpg';
import realmeLogo from '@/assets/brands/realme-logo.jpg';
import oneplusLogo from '@/assets/brands/oneplus-logo.jpg';

interface BrandData {
  description: string;
  founded: string;
  specialty: string[];
  tagline: string;
  logo: string;
  accent: string;
  stats: { customers: string; rating: string };
}

const brandInfo: Record<string, BrandData> = {
  'boAt': {
    description: "India's #1 audio and wearables brand. Known for trendy designs, powerful bass, and affordable pricing.",
    founded: '2016', specialty: ['TWS Earbuds', 'Neckbands', 'Smartwatches', 'Speakers'],
    tagline: 'Plug Into Nirvana', logo: boatLogo, accent: 'from-orange-500 to-amber-500',
    stats: { customers: '20M+', rating: '4.5' },
  },
  'Noise': {
    description: 'Premium audio and wearables brand known for innovation, sleek designs, and feature-rich products.',
    founded: '2018', specialty: ['ANC Earbuds', 'Smartwatches', 'Premium Audio'],
    tagline: 'Make Some Noise', logo: noiseLogo, accent: 'from-violet-500 to-purple-500',
    stats: { customers: '10M+', rating: '4.4' },
  },
  'Boult': {
    description: 'Budget-friendly audio brand delivering bass-heavy sound, gaming-focused products.',
    founded: '2017', specialty: ['Gaming Audio', 'Bass Earbuds', 'Budget TWS'],
    tagline: 'Designed for Life', logo: boultLogo, accent: 'from-rose-500 to-red-500',
    stats: { customers: '8M+', rating: '4.3' },
  },
  'Mivi': {
    description: "Proudly Made in India brand offering quality audio products manufactured locally.",
    founded: '2015', specialty: ['Made in India', 'TWS', 'Speakers', 'Power Banks'],
    tagline: 'Made in India, Made for You', logo: miviLogo, accent: 'from-blue-500 to-cyan-500',
    stats: { customers: '5M+', rating: '4.2' },
  },
  'Zebronics': {
    description: "One of India's oldest and most trusted tech brands for audio and peripherals.",
    founded: '1997', specialty: ['Headphones', 'Speakers', 'PC Accessories'],
    tagline: 'Smart is an Attitude', logo: zebronicsLogo, accent: 'from-slate-500 to-zinc-500',
    stats: { customers: '15M+', rating: '4.0' },
  },
  'pTron': {
    description: 'Ultra-affordable audio brand perfect for budget-conscious buyers.',
    founded: '2014', specialty: ['Budget TWS', 'Neckbands', 'Cables'],
    tagline: 'Designed in California', logo: ptronLogo, accent: 'from-emerald-500 to-green-500',
    stats: { customers: '12M+', rating: '4.1' },
  },
  'Realme': {
    description: 'Tech giant delivering premium audio with Hi-Res certification and seamless integration.',
    founded: '2018', specialty: ['Hi-Res Audio', 'Fast Pairing', 'Premium TWS'],
    tagline: 'Dare to Leap', logo: realmeLogo, accent: 'from-yellow-500 to-amber-400',
    stats: { customers: '25M+', rating: '4.5' },
  },
  'OnePlus': {
    description: 'Premium flagship brand with industry-leading ANC and premium build quality.',
    founded: '2013', specialty: ['Premium ANC', 'Flagship TWS', 'Hi-Fi Audio'],
    tagline: 'Never Settle', logo: oneplusLogo, accent: 'from-red-500 to-rose-500',
    stats: { customers: '30M+', rating: '4.6' },
  },
};

const Brands = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const getBrandProducts = (brand: string) =>
    products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());

  const getBrandStats = (brand: string) => {
    const bp = getBrandProducts(brand);
    const avgRating = bp.length > 0 ? bp.reduce((a, p) => a + p.rating, 0) / bp.length : 0;
    return { productCount: bp.length, avgRating: avgRating.toFixed(1), totalReviews: bp.reduce((a, p) => a + p.reviews, 0) };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
            <motion.div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-8"
              >
                <Crown className="w-4 h-4" />
                Authorized Retailer — 100% Genuine Products
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                India's <span className="gradient-text">Top Audio</span>
                <br />Brands
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                Shop 8+ trusted brands with manufacturer warranty and exclusive deals only at SoundWave.
              </p>

              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                {[
                  { icon: Package, value: '100+', label: 'Products' },
                  { icon: Users, value: '50K+', label: 'Customers' },
                  { icon: Shield, value: '100%', label: 'Genuine' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="font-display text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brands Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Explore Our <span className="gradient-text">Brand Partners</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Each brand hand-picked for quality, innovation, and value
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {brands.map((brand, index) => {
                const info = brandInfo[brand];
                const stats = getBrandStats(brand);
                if (!info) return null;

                return (
                  <motion.div
                    key={brand}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/products?brand=${brand.toLowerCase()}`}>
                      <div className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                        {/* Gradient top bar */}
                        <div className={`h-1.5 bg-gradient-to-r ${info.accent}`} />

                        {/* Logo */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                          <img
                            src={info.logo}
                            alt={`${brand} logo`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                          
                          {/* Floating badges */}
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full border border-border/50">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold">{stats.avgRating}</span>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className="text-xs bg-card/90 backdrop-blur-sm text-muted-foreground px-2.5 py-1 rounded-full border border-border/50">
                              Est. {info.founded}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{brand}</h3>
                            <motion.div
                              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ArrowRight className="w-4 h-4 text-primary" />
                            </motion.div>
                          </div>
                          <p className="text-xs text-primary/80 italic mb-2">"{info.tagline}"</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{info.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {info.specialty.slice(0, 3).map((spec) => (
                              <span key={spec} className="text-[10px] font-medium uppercase tracking-wider bg-secondary text-foreground/70 px-2 py-0.5 rounded-md">
                                {spec}
                              </span>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Package className="w-3.5 h-3.5 text-primary" />
                              {stats.productCount} Products
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-primary" />
                              {info.stats.customers}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Featured <span className="gradient-text">Brand Products</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Top-selling products from each brand
              </p>
            </motion.div>

            {brands.slice(0, 4).map((brand, brandIndex) => {
              const brandProducts = getBrandProducts(brand);
              const info = brandInfo[brand];
              if (brandProducts.length === 0 || !info) return null;

              return (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: brandIndex * 0.1 }}
                  className="mb-14 last:mb-0"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={info.logo} alt={brand} className="w-14 h-14 rounded-xl object-cover border-2 border-border" />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r ${info.accent} flex items-center justify-center`}>
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold">{brand}</h3>
                        <p className="text-sm text-muted-foreground">{info.tagline}</p>
                      </div>
                    </div>
                    <Link to={`/products?brand=${brand.toLowerCase()}`}>
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {brandProducts.slice(0, 4).map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/10 p-10 md:p-16"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />

              <div className="relative text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Can't Decide Which Brand?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Explore all products and use filters to find the perfect audio gear.
                </p>
                <Link to="/products">
                  <Button variant="glow" size="lg">
                    Browse All Products
                    <ArrowRight className="w-5 h-5 ml-2" />
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

export default Brands;
