import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Users, Bell, Mail, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you create an account or place an order, we collect your name, email address, phone number, shipping address, and billing information. This helps us process your orders and provide customer support.',
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our website, including pages viewed, products browsed, time spent on pages, and click patterns. This helps us improve your shopping experience.',
        },
        {
          subtitle: 'Device Information',
          text: 'We collect device-specific information such as your IP address, browser type, operating system, and unique device identifiers to ensure security and optimize our services for your device.',
        },
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Order Processing',
          text: 'Your personal information is used to process orders, arrange shipping, handle payments, and provide order updates via email and SMS notifications.',
        },
        {
          subtitle: 'Customer Service',
          text: 'We use your contact information to respond to inquiries, handle returns and refunds, process warranty claims, and provide technical support for products.',
        },
        {
          subtitle: 'Marketing Communications',
          text: 'With your consent, we may send promotional emails about new products, exclusive deals, and offers. You can opt-out of marketing communications at any time.',
        },
        {
          subtitle: 'Service Improvement',
          text: 'Usage data helps us understand customer preferences, improve website functionality, personalize your experience, and develop new features.',
        },
      ],
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We share necessary information with trusted third-party service providers who assist in payment processing, shipping, email delivery, and analytics. These partners are contractually bound to protect your data.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law, court order, or government regulations, or to protect our rights, privacy, safety, or property.',
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you of any such change and your choices regarding your data.',
        },
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Encryption',
          text: 'We use 256-bit SSL/TLS encryption for all data transmission. Your payment information is processed through PCI-DSS compliant payment gateways.',
        },
        {
          subtitle: 'Access Controls',
          text: 'Access to personal data is strictly limited to authorized employees who need it for legitimate business purposes. All access is logged and monitored.',
        },
        {
          subtitle: 'Regular Audits',
          text: 'We conduct regular security assessments and penetration testing to identify and address potential vulnerabilities in our systems.',
        },
      ],
    },
    {
      icon: Bell,
      title: 'Your Rights & Choices',
      content: [
        {
          subtitle: 'Access & Correction',
          text: 'You can access, update, or correct your personal information through your account settings or by contacting our support team.',
        },
        {
          subtitle: 'Data Deletion',
          text: 'You have the right to request deletion of your personal data. Note that some information may be retained for legal or legitimate business purposes.',
        },
        {
          subtitle: 'Marketing Opt-Out',
          text: 'You can unsubscribe from marketing emails by clicking the "unsubscribe" link in any promotional email or updating your notification preferences.',
        },
        {
          subtitle: 'Cookie Preferences',
          text: 'You can manage cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.',
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
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
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
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your privacy is important to us. This policy explains how we collect, use, 
              and protect your personal information when you use SoundWave.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 1, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground">
              SoundWave ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy describes how we collect, use, disclose, and safeguard your 
              information when you visit our website or make a purchase. Please read this policy 
              carefully to understand our views and practices regarding your personal data.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {sections.map((section, sIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl font-bold">{section.title}</h2>
                </div>

                <div className="space-y-6 pl-0 md:pl-16">
                  {section.content.map((item, index) => (
                    <div key={index} className="p-6 rounded-xl bg-card border border-border">
                      <h3 className="font-semibold text-lg mb-2">{item.subtitle}</h3>
                      <p className="text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Additional Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold">Additional Information</h2>
              </div>

              <div className="space-y-6 pl-0 md:pl-16">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold text-lg mb-2">Children's Privacy</h3>
                  <p className="text-muted-foreground">
                    Our services are not directed to individuals under 18 years of age. We do not 
                    knowingly collect personal information from children. If we become aware that 
                    we have collected data from a child, we will take steps to delete such information.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold text-lg mb-2">Changes to This Policy</h3>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of 
                    significant changes by posting the new policy on this page and updating the 
                    "Last updated" date. We encourage you to review this policy periodically.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold text-lg mb-2">Third-Party Links</h3>
                  <p className="text-muted-foreground">
                    Our website may contain links to third-party websites. We are not responsible 
                    for the privacy practices or content of these external sites. We encourage you 
                    to review the privacy policies of any third-party sites you visit.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">
              Questions About <span className="gradient-text">Privacy?</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact our Data Protection Officer.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: <a href="mailto:privacy@soundwave.in" className="text-primary hover:underline">privacy@soundwave.in</a></p>
              <p>Address: 123 Audio Street, Tech Park, Mumbai, Maharashtra 400001</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
