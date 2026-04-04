import { motion } from 'framer-motion';
import { Truck, Package, Clock, MapPin, RefreshCw, CheckCircle, XCircle, AlertCircle, IndianRupee } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ShippingReturns = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: 'FREE',
      condition: 'Orders ₹999+',
      time: '3-5 business days',
      description: 'Free shipping across India on all orders above ₹999',
    },
    {
      name: 'Standard Shipping',
      price: '₹49',
      condition: 'Orders below ₹999',
      time: '3-5 business days',
      description: 'Flat rate shipping for smaller orders',
    },
    {
      name: 'Express Shipping',
      price: '₹99',
      condition: 'All orders',
      time: '1-2 business days',
      description: 'Priority shipping for select metro cities',
    },
  ];

  const deliveryTimes = [
    { location: 'Metro Cities', standard: '2-3 days', express: '1 day' },
    { location: 'Tier 2 Cities', standard: '3-4 days', express: '1-2 days' },
    { location: 'Tier 3 Cities', standard: '4-5 days', express: '2 days' },
    { location: 'Remote Areas', standard: '5-7 days', express: '3-4 days' },
  ];

  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log in to your account, go to "My Orders", and click "Return" on the item you wish to return.',
    },
    {
      step: 2,
      title: 'Schedule Pickup',
      description: 'Choose a convenient pickup date. Our logistics partner will collect the item from your doorstep.',
    },
    {
      step: 3,
      title: 'Quality Check',
      description: 'Once received, our team will inspect the product to ensure it meets return criteria.',
    },
    {
      step: 4,
      title: 'Refund Processed',
      description: 'Upon approval, refund is initiated within 3-5 business days to your original payment method.',
    },
  ];

  const eligibleItems = [
    'Product is unused and in original packaging',
    'All accessories, manuals, and tags are included',
    'Product is not damaged due to misuse',
    'Return initiated within 7 days of delivery',
    'Product is not a hygiene-sensitive item that has been used',
  ];

  const nonEligibleItems = [
    'Products with broken seals (for hygiene products)',
    'Customized or personalized products',
    'Products purchased during clearance sales (marked as non-returnable)',
    'Products damaged due to customer misuse',
    'Products returned after 7 days of delivery',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Shipping & <span className="gradient-text">Returns</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Fast, reliable shipping across India with hassle-free returns. 
              Your satisfaction is our priority.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-4xl font-bold mb-4">
              Shipping <span className="gradient-text">Options</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the shipping method that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">{option.price}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {option.condition}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{option.time}</span>
                </div>
                <p className="text-muted-foreground text-sm">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Times Table */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-4xl font-bold mb-4">
              Delivery <span className="gradient-text">Timeline</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estimated delivery times based on your location
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-border">
              <div className="grid grid-cols-3 bg-primary/10 p-4">
                <div className="font-semibold">Location</div>
                <div className="font-semibold text-center">Standard</div>
                <div className="font-semibold text-center">Express</div>
              </div>
              {deliveryTimes.map((item, index) => (
                <motion.div
                  key={item.location}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-3 p-4 border-t border-border bg-background"
                >
                  <div className="text-muted-foreground">{item.location}</div>
                  <div className="text-center">{item.standard}</div>
                  <div className="text-center text-primary font-medium">{item.express}</div>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              * Delivery times are estimates and may vary due to unforeseen circumstances
            </p>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-4xl font-bold mb-4">
              Easy <span className="gradient-text">Returns</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not satisfied? Return within 7 days for a full refund
            </p>
          </motion.div>

          {/* Return Steps */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {returnSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-card border border-border text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < returnSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Eligibility */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-display text-xl font-bold">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-display text-xl font-bold">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Refund Info */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-background border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold">Refund Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Refund Timeline</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Quality check: 1-2 business days</li>
                    <li>• Refund initiation: 3-5 business days</li>
                    <li>• Bank processing: 5-7 business days</li>
                    <li>• Total: Up to 14 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Refund Methods</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Original payment method (preferred)</li>
                    <li>• Bank transfer (if original method unavailable)</li>
                    <li>• Store credit (instant, with 10% bonus)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Shipping charges (if paid) are non-refundable 
                  unless the return is due to a defective product or incorrect item shipped.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Need <span className="gradient-text">Help?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Our support team is here to assist you with any shipping or return queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/faq"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                View FAQ
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShippingReturns;
