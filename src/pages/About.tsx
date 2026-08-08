import { motion } from 'framer-motion';
import {
  Headphones, Award, Target, Heart, Zap, Shield, Globe, ArrowRight, Sparkles, Play,
  BadgeCheck, RotateCcw, Users, Truck, Lock, Leaf, Recycle, PackageCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '100+', label: 'Products' },
    { value: '8+', label: 'Top Brands' },
    { value: '24/7', label: 'Support' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Sound',
      description: 'We live and breathe audio. Every product we curate reflects our commitment to exceptional sound quality.',
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We partner with brands that push boundaries, bringing you the latest in wireless audio technology.',
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product goes through rigorous testing to ensure it meets our high standards before reaching you.',
    },
    {
      icon: Globe,
      title: 'Made in India',
      description: 'We proudly support Indian brands and manufacture, contributing to the growth of local audio industry.',
    },
  ];

  const team = [
    { name: 'Arjun Sharma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
    { name: 'Priya Patel', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
    { name: 'Rahul Verma', role: 'Lead Engineer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop' },
    { name: 'Ananya Singh', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' },
  ];

  const differentiators = [
    { icon: BadgeCheck, title: '100% Authentic', description: 'Every product sourced directly from authorized brand partners — no grey market, ever.' },
    { icon: Shield, title: '1-Year Warranty', description: 'Manufacturer warranty on all products, with easy claims support from our team.' },
    { icon: RotateCcw, title: 'Easy 7-Day Returns', description: 'Changed your mind? Hassle-free returns and exchanges within 7 days of delivery.' },
    { icon: Users, title: 'Expert Curation', description: 'Our audio nerds test every product before it earns a spot in the SoundWave catalog.' },
    { icon: Truck, title: 'Pan-India Delivery', description: 'From metros to small towns — we ship to every pincode across the country.' },
    { icon: Lock, title: 'Secure Payments', description: 'Bank-grade encryption on every transaction. Your money and data stay protected.' },
  ];

  const pressLogos = ['FORBES INDIA', 'YOURSTORY', 'ECONOMIC TIMES', 'GADGETS NOW', 'MINT', 'INC42'];

  const sustainability = [
    { icon: Leaf, title: 'Eco-friendly Packaging', description: 'Recyclable, minimal-waste packaging on every single order we ship.' },
    { icon: Recycle, title: 'E-Waste Buyback', description: 'Trade in your old audio gear for credit — we recycle it responsibly.' },
    { icon: PackageCheck, title: 'Quality Promise', description: 'Every unit is quality-checked twice before it leaves our warehouse.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — Bold Editorial */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/20 blur-[140px] rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                Est. 2020 · Mumbai, India
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.9] tracking-tighter mb-8">
              WE MAKE<br />
              <span className="gradient-text">SOUND</span> LOUDER<br />
              THAN <span className="italic font-serif text-primary">life.</span>
            </h1>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="md:col-span-2">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground/80">
                  SoundWave isn't just a store — it's a movement. We hunt down the boldest audio
                  gear on the planet and drop it in the hands of every Indian who refuses to
                  settle for silence.
                </p>
              </div>
              <div className="flex flex-col justify-end gap-4">
                <Button variant="glow" size="lg" asChild>
                  <Link to="/products">
                    Shop the Sound <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">
                    <Play className="w-4 h-4 mr-2 fill-current" /> Our Story
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats — Marquee band */}
      <section className="relative py-12 border-y-2 border-primary/40 bg-gradient-to-r from-primary/15 via-background to-primary/15 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary/20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center px-4"
              >
                <div className="font-display text-5xl md:text-7xl font-bold gradient-text mb-2 leading-none">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">
                  Our Mission
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-8 leading-[1] tracking-tight">
                Premium sound.<br /><span className="gradient-text">Zero compromise.</span>
              </h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                We believe that great sound shouldn't be a luxury. Our mission is to democratize 
                premium audio by curating the best products from top Indian and international brands, 
                making them available at competitive prices.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From the bustling streets of Mumbai to the serene hills of Shimla, we're bringing 
                the joy of wireless freedom to every corner of India. Whether you're a music lover, 
                gamer, or fitness enthusiast, we have the perfect audio companion for you.
              </p>

              <div className="mt-10 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">Curated. Tested. Trusted.</div>
                  <div className="text-sm text-muted-foreground">Every product hand-picked by audio nerds.</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="aspect-square rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-[0_30px_120px_-20px_hsl(16_100%_55%/0.5)]"
                style={{ background: 'linear-gradient(135deg, hsl(16 100% 55%) 0%, hsl(35 100% 55%) 100%)' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Headphones className="w-60 h-60 text-white/90" strokeWidth={1.2} />
                </motion.div>
                <div className="absolute top-6 left-6 text-white/80 text-xs uppercase tracking-[0.3em] font-bold">
                  Signal · 2020→∞
                </div>
                <div className="absolute bottom-6 right-6 text-white/80 text-xs uppercase tracking-[0.3em] font-bold">
                  Volume Max
                </div>
              </div>
              <motion.div
                className="absolute -bottom-8 -left-8 bg-background rounded-2xl p-6 border-2 border-primary/50 shadow-2xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Best Audio Store</div>
                    <div className="text-sm text-muted-foreground">India 2024</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* In Numbers — Impact Band */}
      <section className="relative py-24 bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 blur-[130px] rounded-full" />
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">In Numbers</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              The <span className="gradient-text">impact</span>, quantified.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '4.8/5', label: 'Average Rating' },
              { value: '500+', label: 'Pincodes Served' },
              { value: '99.2%', label: 'On-Time Delivery' },
              { value: '<24h', label: 'Support Response' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-8 rounded-3xl bg-card border border-border text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-card relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">What We Stand For</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              Four rules.<br /><span className="gradient-text">Zero exceptions.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-background border border-border hover:border-primary hover:shadow-[0_20px_60px_-15px_hsl(16_100%_55%/0.4)] transition-all group relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 font-display text-8xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                  0{index + 1}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <value.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SoundWave */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">The Difference</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              Why choose <span className="gradient-text">SoundWave.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press / As Seen In */}
      <section className="py-16 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-10">
            As Seen In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
            {pressLogos.map((name) => (
              <span
                key={name}
                className="font-display text-xl md:text-2xl font-bold tracking-tight text-muted-foreground/50 hover:text-primary transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="relative py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-0 w-[520px] h-[420px] bg-primary/10 blur-[140px] rounded-full" />
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">The Journey</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              From garage<br />to <span className="gradient-text">nationwide.</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-8 h-px bg-border hidden lg:block" />
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                { year: '2020', title: 'The first drop', text: 'Two friends, one Mumbai garage and 40 pairs of earbuds sold in a week.' },
                { year: '2022', title: 'Brand partnerships', text: 'Signed 8 homegrown audio brands and launched our curation lab.' },
                { year: '2024', title: '50,000 customers', text: 'Nationwide delivery, 24/7 support desk and a 4.8 average rating.' },
                { year: '2026', title: 'Studio-grade for all', text: 'Expanding into pro audio while keeping prices honestly Indian.' },
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="w-4 h-4 rounded-full bg-primary ring-8 ring-background mb-6 hidden lg:block" />
                  <div className="p-7 rounded-3xl bg-card border border-border hover:border-primary/60 transition-colors">
                    <div className="font-display text-3xl font-bold text-primary mb-2">{item.year}</div>
                    <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-background">
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
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">The Crew</span>
              </div>
              <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
                Humans behind<br />the <span className="gradient-text">frequency.</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-sm">
              A tight-knit team of engineers, designers, and audiophiles obsessed with one thing — sound done right.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group cursor-pointer"
              >
                <div className="relative mb-4 rounded-3xl overflow-hidden aspect-[3/4]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">
                      0{index + 1}
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-muted-foreground text-sm">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Store Section */}
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
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Come Say Hi</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              Feel the <span className="gradient-text">bass</span> in person.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-3xl overflow-hidden border-2 border-primary/30 h-[500px] shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.854!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1703956789012"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SoundWave Store Location"
              />
            </div>
            <div className="flex flex-col justify-center space-y-5">
              <div className="p-8 rounded-3xl bg-background border border-border hover:border-primary/50 transition-colors">
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Flagship · Mumbai</div>
                <h3 className="font-display text-2xl font-bold mb-3">The Audio HQ</h3>
                <p className="text-muted-foreground">123 Audio Street, Tech Park</p>
                <p className="text-muted-foreground">Mumbai, Maharashtra 400001</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-6 text-sm">
                  <span className="text-foreground">+91 98765 43210</span>
                  <span className="text-muted-foreground">store@soundwave.in</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-background border border-border">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] mb-2">Hours</div>
                  <p className="text-sm">Mon–Sat<br /><span className="font-bold">10AM – 8PM</span></p>
                  <p className="text-sm mt-2 text-muted-foreground">Sun 11AM – 6PM</p>
                </div>
                <div className="p-6 rounded-2xl bg-primary text-primary-foreground">
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2 opacity-80">Corporate</div>
                  <p className="text-sm">Bandra Kurla Complex</p>
                  <p className="text-sm">Mumbai, 400051</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability & Quality Promise */}
      <section className="py-32 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-primary/10 blur-[130px] rounded-full" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Sustainability</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              Good sound.<br /><span className="gradient-text">Good conscience.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sustainability.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-8 rounded-3xl bg-background border border-border"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-28 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, hsl(16 100% 55%) 0%, hsl(35 100% 55%) 100%)' }}
        />
        <Headphones className="absolute -bottom-10 -right-10 w-72 h-72 text-white/10 rotate-12" strokeWidth={1} />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-[1] tracking-tight mb-6">
              Ready to hear<br />the difference?
            </h2>
            <p className="text-white/85 text-lg mb-10 max-w-xl">
              Browse our curated catalog or get in touch — either way, your ears are about to thank you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-10"
                asChild
              >
                <Link to="/products">
                  Shop the Sound <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 font-bold h-14 px-10"
                asChild
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;