import { motion } from 'framer-motion';
import { Headphones, Users, Award, Target, Heart, Zap, Shield, Globe } from 'lucide-react';
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
              <div className="sound-wave">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-widest">
                Our Story
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Redefining <span className="gradient-text">Audio</span> in India
            </h1>
            <p className="text-lg text-muted-foreground">
              SoundWave was born from a simple idea: everyone deserves access to premium audio 
              without breaking the bank. Since 2020, we've been on a mission to bring the best 
              wireless audio gear to India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary uppercase tracking-widest">
                  Our Mission
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold mb-6">
                Making Premium Audio <span className="gradient-text">Accessible</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                We believe that great sound shouldn't be a luxury. Our mission is to democratize 
                premium audio by curating the best products from top Indian and international brands, 
                making them available at competitive prices.
              </p>
              <p className="text-muted-foreground">
                From the bustling streets of Mumbai to the serene hills of Shimla, we're bringing 
                the joy of wireless freedom to every corner of India. Whether you're a music lover, 
                gamer, or fitness enthusiast, we have the perfect audio companion for you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Headphones className="w-48 h-48 text-primary/50" />
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 bg-card rounded-2xl p-6 border border-border shadow-lg"
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

      {/* Values Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These core principles guide everything we do at SoundWave
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate people behind SoundWave
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-4 rounded-2xl overflow-hidden aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Store Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Visit Our <span className="gradient-text">Store</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Come experience our products in person at our flagship store
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden border border-border h-[400px]">
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
            <div className="flex flex-col justify-center space-y-6">
              <div className="p-6 rounded-2xl bg-background border border-border">
                <h3 className="font-semibold text-lg mb-2 text-primary">Flagship Store - Mumbai</h3>
                <p className="text-muted-foreground">123 Audio Street, Tech Park</p>
                <p className="text-muted-foreground">Mumbai, Maharashtra 400001</p>
                <p className="text-muted-foreground mt-2">📞 +91 98765 43210</p>
                <p className="text-muted-foreground">📧 store@soundwave.in</p>
              </div>
              <div className="p-6 rounded-2xl bg-background border border-border">
                <h3 className="font-semibold text-lg mb-2 text-primary">Store Hours</h3>
                <p className="text-muted-foreground">Mon - Sat: 10:00 AM - 8:00 PM</p>
                <p className="text-muted-foreground">Sunday: 11:00 AM - 6:00 PM</p>
              </div>
              <div className="p-6 rounded-2xl bg-background border border-border">
                <h3 className="font-semibold text-lg mb-2 text-primary">Corporate Office</h3>
                <p className="text-muted-foreground">SoundWave India Pvt. Ltd.</p>
                <p className="text-muted-foreground">Bandra Kurla Complex, Mumbai</p>
                <p className="text-muted-foreground">Maharashtra 400051</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;