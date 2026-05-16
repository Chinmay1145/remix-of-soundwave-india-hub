import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Restore any previously applied coupon (e.g. user returned from checkout)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('soundwave-coupon');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.code && typeof parsed?.discount === 'number') {
          setCouponCode(parsed.code);
          setDiscount(parsed.discount);
        }
      }
    } catch {}
  }, []);

  const persistCoupon = (code: string, pct: number) => {
    if (pct > 0) {
      sessionStorage.setItem('soundwave-coupon', JSON.stringify({ code, discount: pct }));
    } else {
      sessionStorage.removeItem('soundwave-coupon');
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }
    if (code === 'SAVE10') {
      setDiscount(10);
      persistCoupon(code, 10);
      toast.success('Coupon applied! 10% discount');
    } else if (code === 'SAVE20') {
      setDiscount(20);
      persistCoupon(code, 20);
      toast.success('Coupon applied! 20% discount');
    } else if (code === 'FREESHIP') {
      setDiscount(5);
      persistCoupon(code, 5);
      toast.success('Coupon applied! 5% discount + free shipping');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    persistCoupon('', 0);
    toast.success('Coupon removed');
  };

  const subtotal = getTotal();
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discountAmount + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products">
                <Button variant="hero" size="xl">
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/products"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Continue Shopping
            </Link>
            <h1 className="font-display text-4xl font-bold">
              Your <span className="gradient-text">Cart</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-4 md:p-6"
                  >
                    <div className="flex gap-4 md:gap-6">
                      {/* Product Image */}
                      <Link to={`/product/${item.id}`}>
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-xs text-primary font-medium uppercase tracking-wider">
                              {item.brand}
                            </p>
                            <Link to={`/product/${item.id}`}>
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              Color: {item.colors[0]}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success('Item removed from cart');
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 bg-background rounded-lg border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, item.quantity - 1))
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">
                                ₹{item.price.toLocaleString()} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart */}
              <motion.div layout className="flex justify-end pt-4">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-28">
                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Coupon Code</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={discount > 0}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      />
                    </div>
                    {discount > 0 ? (
                      <Button onClick={handleRemoveCoupon} variant="secondary" type="button">
                        Remove
                      </Button>
                    ) : (
                      <Button onClick={handleApplyCoupon} variant="secondary" type="button">
                        Apply
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: SAVE10, SAVE20 or FREESHIP
                  </p>
                </div>

                {/* Summary Lines */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-primary">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  {subtotal < 999 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-display text-2xl font-bold">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button variant="hero" className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="flex justify-center gap-4 mt-6 text-muted-foreground text-xs">
                  <span>🔒 Secure Payment</span>
                  <span>📦 Free Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
