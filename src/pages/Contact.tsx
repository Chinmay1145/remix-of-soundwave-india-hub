import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Headphones, Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    toast({
      title: 'Message sent',
      description: `Thanks, ${formData.name}! We'll get back to you within 24 hours.`,
    });

    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Audio Street, Tech Park', 'Mumbai, Maharashtra 400001'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 98765 43211'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@soundwave.in', 'sales@soundwave.in'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Sat: 10:00 AM - 8:00 PM', 'Sunday: 11:00 AM - 6:00 PM'],
    },
  ];

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy on all products. Items must be in original packaging and unused condition.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping (available for select locations) delivers within 1-2 days.',
    },
    {
      question: 'Do you offer warranty on products?',
      answer: 'Yes! All products come with a 1-year manufacturer warranty. Extended warranty options are available at checkout.',
    },
    {
      question: 'Can I track my order?',
      answer: 'Absolutely! Once your order ships, you\'ll receive a tracking link via email and SMS to monitor your delivery.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — Bold */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-primary/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[hsl(35_100%_55%)]/15 blur-[130px] rounded-full" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                We reply within 24 hours
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.9] tracking-tighter mb-8">
              LET'S<br />
              <span className="gradient-text">TALK</span> <span className="italic font-serif text-primary">loud.</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl">
              Questions, feedback, wild ideas, warranty claims — drop it all here.
              Real humans read every message.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 border-y-2 border-primary/40 bg-gradient-to-r from-primary/10 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary hover:shadow-[0_15px_40px_-15px_hsl(16_100%_55%/0.4)] transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <info.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] mb-2">
                  0{index + 1}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-muted-foreground text-sm">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">
                  Send a Message
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-10 leading-[0.95] tracking-tight">
                Drop us a<br /><span className="gradient-text">line.</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl bg-card border border-border">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Your Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-background border-border focus:border-primary h-12"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="bg-background border-border focus:border-primary h-12"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Phone Number</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="bg-background border-border focus:border-primary h-12"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="bg-background border-border focus:border-primary h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Your Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={6}
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-10 text-base font-bold uppercase tracking-wider"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Map / Store Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 lg:col-span-2"
            >
              {/* Map Placeholder */}
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-card border-2 border-primary/30 shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1703956789012!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SoundWave Location"
                />
              </div>

              {/* Quick Support — bold callout */}
              <div
                className="p-8 rounded-3xl relative overflow-hidden text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, hsl(16 100% 55%) 0%, hsl(35 100% 55%) 100%)' }}
              >
                <Headphones className="absolute -bottom-6 -right-6 w-40 h-40 text-white/10" strokeWidth={1.2} />
                <div className="relative">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 opacity-90">
                    24/7 · Live Support
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 leading-tight">
                    Need help right now?
                  </h3>
                  <p className="text-white/85 text-sm mb-6 leading-relaxed">
                    Skip the queue. Talk to a real human on the phone in under a minute.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-bold"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    +91 98765 43210
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Quick Answers</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              You ask.<br /><span className="gradient-text">We answer.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -3 }}
                className="p-8 rounded-3xl bg-background border border-border hover:border-primary/60 transition-all group"
              >
                <div className="flex items-start gap-4 mb-3">
                  <span className="font-display text-3xl font-bold text-primary leading-none">
                    0{index + 1}
                  </span>
                  <h3 className="font-display text-lg font-bold pt-1">{faq.question}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed pl-12">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;