import { motion } from 'framer-motion';
import { Zap, Clock, Percent, Gift } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

const Deals = () => {
  const dealsProducts = products.filter((p) => p.discount >= 50);
  const flashDeals = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-bold mb-6">
                <Zap className="w-4 h-4" />
                Limited Time Offers
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Hot <span className="gradient-text">Deals</span> & Offers
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Grab the best audio gear at unbeatable prices. Limited stock available!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Flash Sale */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Flash Sale</h2>
                <p className="text-sm text-muted-foreground">Ends in 24 hours</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashDeals.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Big Discounts */}
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">50%+ Off</h2>
                <p className="text-sm text-muted-foreground">Massive discounts on top products</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealsProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
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
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12 text-center"
            >
              <Gift className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-3xl font-bold mb-3">
                Free Shipping on Orders Above ₹999
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Plus, get a surprise gift with every order above ₹2,999. Shop now and save big!
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Deals;
