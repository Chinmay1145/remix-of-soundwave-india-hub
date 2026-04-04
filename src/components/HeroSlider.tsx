import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import slider1 from '@/assets/slider-1.jpg';
import slider2 from '@/assets/slider-2.jpg';
import slider3 from '@/assets/slider-3.jpg';

const slides = [
  {
    image: slider1,
    title: 'True Wireless Earbuds',
    subtitle: 'Crystal Clear Sound',
    description: 'Experience premium TWS with ANC, 40hr battery & ultra-low latency',
    cta: 'Shop Earbuds',
    link: '/products?category=tws',
    badge: 'Up to 62% OFF',
  },
  {
    image: slider2,
    title: 'Over-Ear Headphones',
    subtitle: 'Immersive Audio',
    description: 'Studio-grade sound with hybrid ANC and all-day comfort',
    cta: 'Shop Headphones',
    link: '/products?category=headphones',
    badge: 'New Arrivals',
  },
  {
    image: slider3,
    title: 'Wireless Neckbands',
    subtitle: 'Music On The Go',
    description: 'Fast charging, magnetic earbuds & 60hr playtime for your lifestyle',
    cta: 'Shop Neckbands',
    link: '/products?category=neckband',
    badge: 'Best Sellers',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden rounded-3xl mx-4 md:mx-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-8 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg"
            >
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-4">
                {slides[current].badge}
              </span>
              <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">
                {slides[current].subtitle}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {slides[current].title}
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                {slides[current].description}
              </p>
              <Link to={slides[current].link}>
                <Button variant="hero" size="lg">
                  {slides[current].cta}
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-primary' : 'w-2 bg-foreground/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
