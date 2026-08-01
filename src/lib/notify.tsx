import { toast } from 'sonner';
import { ShoppingCart, Heart, HeartOff, Trash2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductLike {
  id: string;
  name: string;
  image: string;
  price: number;
}

const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

interface ToastShellProps {
  icon: React.ReactNode;
  title: string;
  product: ProductLike;
  actionLabel?: string;
  actionHref?: string;
  tone?: 'success' | 'muted';
}

const ToastShell = ({ icon, title, product, actionLabel, actionHref, tone = 'success' }: ToastShellProps) => (
  <div className="flex items-center gap-3 w-full">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        tone === 'success' ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
      }`}
    >
      {icon}
    </div>
    <div className="w-11 h-11 rounded-lg bg-secondary overflow-hidden flex-shrink-0 border border-border">
      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold leading-tight">{title}</p>
      <p className="text-xs text-muted-foreground truncate">{product.name}</p>
      <p className="text-xs font-medium text-primary">{formatPrice(product.price)}</p>
    </div>
    {actionLabel && actionHref && (
      <Link
        to={actionHref}
        onClick={() => toast.dismiss()}
        className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        {actionLabel}
      </Link>
    )}
  </div>
);

export const notifyAddToCart = (product: ProductLike) => {
  toast.custom(
    () => (
      <ToastShell
        icon={<ShoppingCart className="w-5 h-5" />}
        title="Added to cart"
        product={product}
        actionLabel="View cart"
        actionHref="/cart"
      />
    ),
    { id: `cart-add-${product.id}`, duration: 3000 }
  );
};

export const notifyAddToWishlist = (product: ProductLike) => {
  toast.custom(
    () => (
      <ToastShell
        icon={<Heart className="w-5 h-5 fill-current" />}
        title="Added to wishlist"
        product={product}
        actionLabel="View wishlist"
        actionHref="/wishlist"
      />
    ),
    { id: `wishlist-add-${product.id}`, duration: 3000 }
  );
};

export const notifyRemoveFromWishlist = (product: ProductLike) => {
  toast.custom(
    () => (
      <ToastShell
        icon={<HeartOff className="w-5 h-5" />}
        title="Removed from wishlist"
        product={product}
        tone="muted"
      />
    ),
    { id: `wishlist-remove-${product.id}`, duration: 2500 }
  );
};

export const notifyRemoveFromCart = (product: ProductLike) => {
  toast.custom(
    () => (
      <ToastShell
        icon={<Trash2 className="w-5 h-5" />}
        title="Removed from cart"
        product={product}
        tone="muted"
      />
    ),
    { id: `cart-remove-${product.id}`, duration: 2500 }
  );
};

export const notifyMovedToCart = (product: ProductLike) => {
  toast.custom(
    () => (
      <ToastShell
        icon={<CheckCircle2 className="w-5 h-5" />}
        title="Moved to cart"
        product={product}
        actionLabel="View cart"
        actionHref="/cart"
      />
    ),
    { id: `cart-add-${product.id}`, duration: 3000 }
  );
};
