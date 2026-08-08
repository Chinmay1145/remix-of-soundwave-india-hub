import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  count: number;
  index?: number;
  tagline?: string;
  startingAt?: number;
}

const CategoryCard = ({
  name,
  slug,
  image,
  count,
  index = 0,
  tagline,
  startingAt,
}: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link to={`/products?category=${slug}`} aria-label={`Shop ${name}`}>
        <div className="group relative h-full overflow-hidden rounded-3xl bg-card border border-border/50 hover:border-primary/60 transition-all duration-500 hover:shadow-[0_24px_60px_-24px_hsl(var(--primary)/0.5)]">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <motion.img
              src={image}
              alt={`${name} audio products`}
              loading="lazy"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/20 to-transparent" />

            {/* Index badge */}
            <span className="absolute top-4 left-4 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-md">
              {String(index + 1).padStart(2, '0')}
            </span>
            {typeof startingAt === 'number' && (
              <span className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                From ₹{startingAt.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {tagline && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary mb-2">
                {tagline}
              </p>
            )}
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {count} Products
                </p>
              </div>
              <motion.div
                className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <ArrowRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </motion.div>
            </div>

            {/* Hover reveal CTA */}
            <div className="mt-4 h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:h-7 group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Shop the range
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
