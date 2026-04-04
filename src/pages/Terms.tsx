import { motion } from 'framer-motion';
import { FileText, Scale, ShoppingCart, CreditCard, Truck, AlertTriangle, Ban, Gavel } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  const sections = [
    {
      icon: Scale,
      title: 'Acceptance of Terms',
      content: `By accessing and using the SoundWave website ("Site") and services, you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you should not use our Site or services.

These Terms apply to all visitors, users, and others who access or use the Site. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Site following any changes constitutes acceptance of those changes.`,
    },
    {
      icon: ShoppingCart,
      title: 'Products & Orders',
      content: `All products displayed on our Site are subject to availability. We reserve the right to limit quantities and discontinue any product at any time.

Product images are for illustration purposes and may vary slightly from actual products. We make every effort to display colors and details accurately, but cannot guarantee your device's display accurately reflects actual colors.

Prices are in Indian Rupees (INR) and are subject to change without notice. Any promotional prices are valid only during the specified promotional period.

We reserve the right to refuse or cancel any order for reasons including but not limited to: product availability, pricing errors, suspected fraud, or if the order appears to be made by unauthorized resellers.`,
    },
    {
      icon: CreditCard,
      title: 'Payment Terms',
      content: `We accept various payment methods including UPI, credit/debit cards, net banking, digital wallets, and Cash on Delivery (where available).

By providing payment information, you represent that you are authorized to use the payment method and authorize us to charge your payment method for the total order amount, including taxes and shipping fees.

All payments are processed through secure, PCI-DSS compliant payment gateways. We do not store complete credit card information on our servers.

In case of payment failures, your order will not be processed. If your account is charged but the order fails, refunds will be initiated within 5-7 business days.`,
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      content: `We ship across India using trusted logistics partners. Delivery timelines are estimates and may vary based on location, weather conditions, and other factors beyond our control.

Risk of loss and title for products pass to you upon delivery to the carrier. We are not responsible for delays caused by shipping carriers, customs, or other circumstances beyond our control.

It is your responsibility to provide accurate shipping information. Additional charges may apply for re-delivery attempts due to incorrect addresses or failed delivery attempts.

For damaged or missing packages, claims must be filed within 48 hours of delivery for investigation.`,
    },
    {
      icon: AlertTriangle,
      title: 'Returns & Refunds',
      content: `Products may be returned within 7 days of delivery if they are unused, in original packaging, with all accessories and tags intact. Some products may not be eligible for return due to hygiene reasons (e.g., in-ear products that have been used).

Return shipping costs may be applicable for non-defective returns. Refunds will be processed to the original payment method within 7-14 business days after we receive and verify the returned product.

We reserve the right to refuse returns that do not meet our return policy criteria or appear to show signs of use, damage, or tampering.

For defective products, please contact our support team for warranty service. Manufacturing defects are covered under the manufacturer's warranty.`,
    },
    {
      icon: Ban,
      title: 'Prohibited Activities',
      content: `You agree not to:

• Use the Site for any unlawful purpose or in violation of any laws
• Attempt to gain unauthorized access to our systems or user accounts
• Interfere with or disrupt the Site's operation or security measures
• Use automated systems, bots, or scrapers to access the Site
• Impersonate any person or entity or misrepresent your affiliation
• Submit false information or engage in fraudulent activities
• Reproduce, duplicate, or resell any part of our services without permission
• Use the Site to distribute malware, viruses, or harmful content
• Engage in any activity that could damage our reputation or business`,
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: `All content on this Site, including text, graphics, logos, images, product descriptions, and software, is the property of SoundWave or its content suppliers and is protected by Indian and international copyright, trademark, and other intellectual property laws.

You may not use, reproduce, modify, distribute, or display any content from the Site without our prior written permission.

The SoundWave name, logo, and all related names, logos, product and service names are trademarks of SoundWave. You may not use these marks without our prior written permission.`,
    },
    {
      icon: Gavel,
      title: 'Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOUNDWAVE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE OR PRODUCTS.

Our total liability for any claims arising from your use of the Site or products shall not exceed the amount you paid for the specific product giving rise to the claim.

We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. The Site and products are provided "as is" without warranties of any kind.

These limitations apply regardless of the legal theory on which the claim is based, even if we have been advised of the possibility of such damages.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
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
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our website and services.
              By using SoundWave, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 1, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}

            {/* Governing Law */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold">Governing Law & Disputes</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, 
                  without regard to its conflict of law provisions.
                </p>
                <p>
                  Any dispute arising from these Terms or your use of the Site shall be subject to 
                  the exclusive jurisdiction of the courts of Mumbai, Maharashtra, India.
                </p>
                <p>
                  Before initiating any legal proceedings, you agree to first attempt to resolve 
                  any dispute informally by contacting us. Most concerns can be resolved quickly 
                  through our customer support team.
                </p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center"
            >
              <h2 className="font-display text-2xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: <a href="mailto:legal@soundwave.in" className="text-primary hover:underline">legal@soundwave.in</a></p>
                <p>Address: 123 Audio Street, Tech Park, Mumbai, Maharashtra 400001</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
