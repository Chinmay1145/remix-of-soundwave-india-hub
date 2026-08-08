import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send, Headphones, Sparkles, ArrowUpRight,
  Instagram, Twitter, Facebook, Youtube, ShieldCheck, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface FormData {
  name: string;
  email: string;
  phone: string;
  topic: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    topic: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Please tell us your name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.topic) newErrors.topic = 'Select a topic so we can route your message.';
    if (!formData.subject.trim()) newErrors.subject = 'Give us a short subject line.';
    if (!formData.message.trim()) {
      newErrors.message = 'Message can\'t be empty.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    toast({
      title: 'Message sent',
      description: `Thanks, ${formData.name}! We'll get back to you within 24 hours.`,
    });

    setFormData({ name: '', email: '', phone: '', topic: '', subject: '', message: '' });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormData]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleTopicChange = (value: string) => {
    setFormData({ ...formData, topic: value });
    if (errors.topic) setErrors({ ...errors, topic: undefined });
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

  const supportTopics = [
    { value: 'order', label: 'Order & Shipping' },
    { value: 'returns', label: 'Returns & Warranty' },
    { value: 'product', label: 'Product Question' },
    { value: 'partnership', label: 'Partnership / Press' },
    { value: 'other', label: 'Something Else' },
  ];

  const officeHours = [
    { day: 'Monday – Friday', hours: '10:00 AM – 8:00 PM' },
    { day: 'Saturday', hours: '10:00 AM – 6:00 PM' },
    { day: 'Sunday', hours: '11:00 AM – 6:00 PM' },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter / X', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
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
    {
      question: 'Do you deliver across all of India?',
      answer: 'Yes, we deliver to over 500 pincodes nationwide, from major metros to smaller towns.',
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

      {/* Response Assurance Strip */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3 text-center">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
              We respond to every message within 24 hours — guaranteed
            </span>
          </div>
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

              <form onSubmit={handleSubmit} noValidate className="space-y-6 p-8 rounded-3xl bg-card border border-border">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Your Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className="bg-background border-border focus:border-primary h-12"
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Email Address</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className="bg-background border-border focus:border-primary h-12"
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Phone Number</label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="bg-background border-border focus:border-primary h-12"
                    />
                  </div>
                  <div>
                    <label htmlFor="topic" className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Support Topic</label>
                    <Select value={formData.topic} onValueChange={handleTopicChange}>
                      <SelectTrigger
                        id="topic"
                        aria-invalid={!!errors.topic}
                        className="bg-background border-border focus:border-primary h-12"
                      >
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportTopics.map((topic) => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.topic && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.topic}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className="bg-background border-border focus:border-primary h-12"
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-muted-foreground">Your Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                    </p>
                  )}
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
              {/* Map Placeholder (styled, no external iframe) */}
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-card border-2 border-primary/30 shadow-xl relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                    <MapPin className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold">SoundWave HQ</div>
                    <p className="text-muted-foreground text-sm">123 Audio Street, Tech Park</p>
                    <p className="text-muted-foreground text-sm">Mumbai, Maharashtra 400001</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                    Tap to open in Maps
                  </span>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="p-6 rounded-3xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-lg font-bold">Office Hours</h3>
                </div>
                <div className="space-y-2">
                  {officeHours.map((row) => (
                    <div key={row.day} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{row.day}</span>
                      <span className="font-semibold">{row.hours}</span>
                    </div>
                  ))}
                </div>
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

              {/* Social Links */}
              <div className="p-6 rounded-3xl bg-card border border-border">
                <h3 className="font-display text-lg font-bold mb-4">Follow the Frequency</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
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
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Quick Answers</span>
              </div>
              <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
                You ask.<br /><span className="gradient-text">We answer.</span>
              </h2>
            </div>
            <Link
              to="/faq"
              className="text-sm font-bold uppercase tracking-[0.2em] text-primary hover:underline underline-offset-4 shrink-0"
            >
              View full FAQ →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Accordion type="single" collapsible className="rounded-3xl bg-background border border-border px-6 md:px-8">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="font-display text-left text-base md:text-lg font-bold hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
