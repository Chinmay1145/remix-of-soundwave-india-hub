import { Link } from 'react-router-dom';
import {
  Headphones,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
  ArrowUp,
} from 'lucide-react';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { collections } from '@/lib/collections';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

      {/* Trust strip */}
      <div className="relative border-b border-border">
        <div className="container mx-auto grid grid-cols-2 gap-px bg-border px-0 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Free shipping', sub: 'On orders above ₹999' },
            { icon: ShieldCheck, title: '1-year warranty', sub: 'Brand authorised' },
            { icon: RotateCcw, title: '7-day returns', sub: 'No questions asked' },
            { icon: Lock, title: 'Secure payments', sub: 'UPI · Cards · COD' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 bg-card px-4 py-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">
                Stay in the <span className="text-primary">Loop</span>
              </h3>
              <p className="text-muted-foreground">
                Drop alerts, launch-day discounts and audio guides — one email a week, no spam.
              </p>
            </div>
            <NewsletterSubscribe />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Headphones className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                Sound<span className="text-primary">Wave</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              India's leading destination for premium audio gear. Experience wireless freedom with cutting-edge technology.
            </p>
            <div className="flex gap-3 mb-6">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center hover:-translate-y-0.5"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                We accept
              </div>
              <div className="flex flex-wrap gap-2">
                {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'COD'].map((m) => (
                  <span
                    key={m}
                    className="rounded-md border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-6">Shop</h4>
            <ul className="space-y-3">
              {[
                { name: 'All Products', path: '/products' },
                { name: 'True Wireless', path: '/products?category=tws' },
                { name: 'Neckbands', path: '/products?category=neckband' },
                { name: 'Headphones', path: '/products?category=headphones' },
                { name: 'Gaming', path: '/products?category=gaming' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h4 className="font-semibold mb-6">Account</h4>
            <ul className="space-y-3">
              {[
                { name: 'My Orders', path: '/my-orders' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'Wishlist', path: '/wishlist' },
                { name: 'Cart', path: '/cart' },
                { name: 'Sign In', path: '/auth' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                { name: 'FAQ', path: '/faq' },
                { name: 'Shipping & Returns', path: '/shipping-returns' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'About Us', path: '/about' },
                { name: 'Brands', path: '/brands' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-semibold mb-6">Collections</h4>
            <ul className="space-y-3">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/collections/${c.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/deals"
                  className="text-primary hover:underline transition-colors text-sm font-semibold"
                >
                  Today's Deals
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground text-sm">
                123 Audio Street, Tech Park,
                <br />
                Mumbai, Maharashtra 400001
              </span>
            </div>
            <a href="tel:+919876543210" className="flex items-center gap-3 group">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                +91 98765 43210 · Mon–Sat, 9am–8pm
              </span>
            </a>
            <a href="mailto:support@soundwave.in" className="flex items-center gap-3 group">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                support@soundwave.in
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {year} SoundWave Retail Pvt. Ltd. · GSTIN 27AABCS1429B1ZX · Made with ❤️ in India
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
