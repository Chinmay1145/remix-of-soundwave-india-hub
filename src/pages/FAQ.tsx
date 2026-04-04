import { motion } from 'framer-motion';
import { HelpCircle, Package, Truck, CreditCard, RefreshCw, Headphones, Shield, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqCategories = [
    {
      icon: Package,
      title: 'Orders & Products',
      faqs: [
        {
          question: 'How do I place an order?',
          answer: 'Simply browse our collection, add products to your cart, and proceed to checkout. You can pay using various methods including UPI, credit/debit cards, net banking, or COD.',
        },
        {
          question: 'Can I modify my order after placing it?',
          answer: 'Orders can be modified within 1 hour of placement. After that, please contact our support team immediately. Once shipped, modifications are not possible.',
        },
        {
          question: 'How do I check product availability?',
          answer: 'Product availability is shown on each product page. If an item is out of stock, you can sign up for notifications to be alerted when it\'s back.',
        },
        {
          question: 'Are all products on SoundWave original?',
          answer: 'Yes, we are authorized resellers for all brands on our platform. Every product comes with genuine manufacturer warranty and authenticity guarantee.',
        },
      ],
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      faqs: [
        {
          question: 'What are the shipping charges?',
          answer: 'We offer FREE shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹49 applies. Express shipping is available at ₹99 extra.',
        },
        {
          question: 'How long does delivery take?',
          answer: 'Standard delivery takes 3-5 business days across India. Metro cities receive orders in 2-3 days. Express shipping delivers within 1-2 business days for select locations.',
        },
        {
          question: 'Do you deliver to my location?',
          answer: 'We deliver across India with 25,000+ pin codes covered. Enter your pin code on the product page to check delivery availability and estimated time.',
        },
        {
          question: 'How can I track my order?',
          answer: 'Once shipped, you\'ll receive a tracking link via email and SMS. You can also track your order from the "My Orders" section after logging in.',
        },
      ],
    },
    {
      icon: CreditCard,
      title: 'Payments',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, wallets, and Cash on Delivery (COD).',
        },
        {
          question: 'Is Cash on Delivery available?',
          answer: 'COD is available for orders up to ₹10,000. A nominal COD fee of ₹29 may apply. Some pin codes may not be eligible for COD.',
        },
        {
          question: 'Are my payment details secure?',
          answer: 'Absolutely! We use 256-bit SSL encryption and are PCI-DSS compliant. Your card details are never stored on our servers.',
        },
        {
          question: 'Can I use multiple payment methods?',
          answer: 'Currently, we support single payment method per order. You can combine wallet balance with other payment methods on select orders.',
        },
      ],
    },
    {
      icon: RefreshCw,
      title: 'Returns & Refunds',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 7-day easy return policy on all products. Items must be unused, in original packaging with all accessories and tags intact.',
        },
        {
          question: 'How do I initiate a return?',
          answer: 'Log in to your account, go to "My Orders", select the order, and click "Return". Our pickup partner will collect the item within 2-3 business days.',
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 3-5 business days after we receive and verify the returned product. Bank transfers may take an additional 5-7 days.',
        },
        {
          question: 'Can I exchange a product?',
          answer: 'Yes! You can exchange for a different size, color, or even a different product. The price difference (if any) will be adjusted accordingly.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Warranty & Support',
      faqs: [
        {
          question: 'What warranty do products come with?',
          answer: 'All products come with a minimum 1-year manufacturer warranty. Extended warranty options are available for select products at checkout.',
        },
        {
          question: 'How do I claim warranty?',
          answer: 'Contact our support team with your order ID and issue description. We\'ll guide you through the warranty claim process and arrange pickup if needed.',
        },
        {
          question: 'Is warranty valid for online purchases?',
          answer: 'Yes, warranty is fully valid for all online purchases. Keep your invoice (sent via email) as proof of purchase for warranty claims.',
        },
        {
          question: 'What is not covered under warranty?',
          answer: 'Physical damage, water damage (unless product is waterproof rated), misuse, and normal wear and tear are not covered under standard warranty.',
        },
      ],
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      faqs: [
        {
          question: 'How do I pair my Bluetooth earbuds?',
          answer: 'Take earbuds out of the case, enable Bluetooth on your device, look for the product name in available devices, and tap to connect. First-time pairing usually happens automatically.',
        },
        {
          question: 'Why is my audio quality poor?',
          answer: 'Ensure firmware is updated, check for obstructions between device and earbuds, clean ear tips, and try resetting the earbuds. Contact support if issues persist.',
        },
        {
          question: 'How do I update firmware?',
          answer: 'Download the brand\'s companion app (boAt, Noise, etc.), connect your device, and check for updates in settings. Most updates improve performance and add features.',
        },
        {
          question: 'One earbud is not working, what should I do?',
          answer: 'Reset both earbuds by placing them in the case for 30 seconds, then re-pair. If the issue persists, it may be a warranty claim situation - contact our support.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
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
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about orders, shipping, returns, and more. 
              Can't find what you're looking for? Contact our support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Truck, label: 'Free Shipping', value: 'Orders ₹999+' },
              { icon: RefreshCw, label: 'Easy Returns', value: '7 Days' },
              { icon: Shield, label: 'Warranty', value: '1 Year' },
              { icon: Zap, label: 'Support', value: '24/7' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">{category.title}</h2>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Still Have <span className="gradient-text">Questions?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Our support team is available 24/7 to help you with any queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Call: +91 98765 43210
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
