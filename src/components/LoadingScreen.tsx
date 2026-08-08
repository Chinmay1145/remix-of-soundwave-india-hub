import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, ShieldCheck, Truck, BadgeCheck } from 'lucide-react';

const phrases = [
  'Tuning your experience…',
  'Warming up the drivers…',
  'Calibrating the bass…',
  'Loading today’s best deals…',
];

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    const p = setInterval(() => {
      setProgress((v) => (v >= 100 ? 100 : Math.min(100, v + Math.random() * 12 + 4)));
    }, 120);
    const t = setInterval(() => setPhrase((i) => (i + 1) % phrases.length), 900);
    return () => {
      clearInterval(p);
      clearInterval(t);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[hsl(220_30%_5%)] flex flex-col items-center justify-center">
      {/* Layered gradient orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px]"
        animate={{ scale: [1, 1.3, 1], x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[hsl(35_100%_55%)]/25 blur-[120px]"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating conic sheen */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-2xl"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, hsl(16 100% 55%) 90deg, transparent 180deg, hsl(35 100% 55%) 270deg, transparent 360deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(16 100% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(16 100% 55%) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Concentric rings around logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full border border-primary/40"
              animate={{ scale: [0.6, 1.6], opacity: [0.8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-[0_0_60px_hsl(16_100%_55%/0.6)]"
            style={{ background: 'linear-gradient(135deg, hsl(16 100% 55%), hsl(35 100% 55%))' }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Headphones className="w-12 h-12 text-white" strokeWidth={2.4} />
            </motion.div>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white"
        >
          SOUND<span className="text-primary">WAVE</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-primary/80"
        >
          <span className="h-px w-8 bg-primary/40" />
          Premium Audio · India
          <span className="h-px w-8 bg-primary/40" />
        </motion.div>

        {/* Equalizer bars */}
        <div className="flex items-end gap-1.5 mt-8 h-10">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full"
              style={{ background: 'linear-gradient(to top, hsl(16 100% 55%), hsl(35 100% 65%))' }}
              animate={{ height: ['6px', '36px', '6px'] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-72">
          <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(16 100% 55%), hsl(35 100% 65%))' }}
              animate={{ width: `${Math.round(progress)}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] tracking-wider text-white/55">
            <AnimatePresence mode="wait">
              <motion.span
                key={phrase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {phrases[phrase]}
              </motion.span>
            </AnimatePresence>
            <span className="font-display font-bold text-primary tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            { icon: ShieldCheck, label: '1-Yr Warranty' },
            { icon: Truck, label: 'Free Shipping' },
            { icon: BadgeCheck, label: '100% Authentic' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm"
            >
              <Icon className="h-3 w-3 text-primary" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
