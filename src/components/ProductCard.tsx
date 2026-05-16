import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye, Zap, Battery, Bluetooth } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, useWishlistStore, type Product } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: 'Continue shopping or proceed to checkout',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_hsl(16_100%_55%_/_0.15)]">
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                inWishlist ? 'fill-primary text-primary' : ''
              }`}
            />
          </button>

          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-background p-8">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Quick Actions Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              className="absolute inset-x-4 bottom-4 flex gap-2"
            >
              <Button
                onClick={handleAddToCart}
                variant="glow"
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-5">
            {/* Brand */}
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
              {product.brand}
            </p>

            {/* Name */}
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Features */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Battery className="w-3.5 h-3.5 text-primary" />
                <span>{product.batteryLife}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bluetooth className="w-3.5 h-3.5 text-primary" />
                <span>v{product.bluetooth}</span>
              </div>
              {product.anc && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span>ANC</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-muted-foreground line-through text-sm mb-1">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
