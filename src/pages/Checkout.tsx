import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  Smartphone, 
  ChevronLeft, 
  Lock, 
  Shield, 
  Truck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const checkoutSchema = z.object({
  name: z.string().trim()
    .min(2, 'Name must be at least 2 characters').max(100)
    .regex(/^[A-Za-z\s.'-]+$/, 'Name can only contain letters'),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  address: z.string().trim().min(10, 'Please enter a complete address').max(500),
  city: z.string().trim().min(2, 'City is required').max(100)
    .regex(/^[A-Za-z\s.'-]+$/, 'City can only contain letters'),
  state: z.string().trim().min(2, 'State is required').max(100)
    .regex(/^[A-Za-z\s.'-]+$/, 'State can only contain letters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
});

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using UPI apps' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
  { id: 'wallet', name: 'Wallets', icon: Wallet, description: 'Paytm, PhonePe, etc.' },
  { id: 'cod', name: 'Cash on Delivery', icon: Truck, description: '₹49 extra charge' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCartStore();
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Auto-fill from profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user || profileLoaded) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, address, city, state, pincode')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setFormData(prev => ({
          name: data.full_name || prev.name,
          email: user.email || prev.email,
          phone: data.phone || prev.phone,
          address: data.address || prev.address,
          city: data.city || prev.city,
          state: data.state || prev.state,
          pincode: data.pincode || prev.pincode,
        }));
      }
      setProfileLoaded(true);
    };
    loadProfile();
  }, [user, profileLoaded]);

  // Load coupon applied in cart
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('soundwave-coupon');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.code && typeof parsed?.discount === 'number' && parsed.discount > 0) {
          setCoupon(parsed);
        }
      }
    } catch {}
  }, []);

  const subtotal = getTotal();
  const discountAmount = coupon ? Math.round((subtotal * coupon.discount) / 100) : 0;
  const shippingFree = subtotal > 999 || coupon?.code === 'FREESHIP';
  const shipping = shippingFree ? 0 : 99;
  const codCharge = selectedPayment === 'cod' ? 49 : 0;
  const total = subtotal - discountAmount + shipping + codCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let value = e.target.value;
    // Field-specific filtering
    if (name === 'name' || name === 'city' || name === 'state') {
      value = value.replace(/[^A-Za-z\s.'-]/g, '');
    } else if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'pincode') {
      value = value.replace(/\D/g, '').slice(0, 6);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generateOrderNumber = () => {
    const prefix = 'SW';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      checkoutSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = generateOrderNumber();

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user?.id || null,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          payment_method: selectedPayment,
          payment_status: selectedPayment === 'cod' ? 'pending' : 'completed',
          order_status: 'confirmed',
          subtotal,
          shipping,
          discount: discountAmount,
          total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await supabase
        .from('order_tracking')
        .insert({
          order_id: order.id,
          status: 'confirmed',
          description: 'Order has been confirmed and is being processed',
          location: 'Warehouse',
        });

      // Clear cart after successful order
      clearCart();
      sessionStorage.removeItem('soundwave-coupon');
      
      // Also sync cleared cart to database
      if (user) {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      }

      navigate(`/order-success/${orderNumber}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <Link to="/products">
              <Button variant="hero">Continue Shopping</Button>
            </Link>
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/cart"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Cart
            </Link>
            <h1 className="font-display text-4xl font-bold">
              <span className="gradient-text">Checkout</span>
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Shipping Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`h-11 ${errors.name ? 'border-destructive' : ''}`}
                      />
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={`h-11 ${errors.email ? 'border-destructive' : ''}`}
                      />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        className={`h-11 ${errors.phone ? 'border-destructive' : ''}`}
                      />
                      {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House/Flat No., Street, Locality"
                        className={`h-11 ${errors.address ? 'border-destructive' : ''}`}
                      />
                      {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className={`h-11 ${errors.city ? 'border-destructive' : ''}`}
                      />
                      {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className={`h-11 ${errors.state ? 'border-destructive' : ''}`}
                      />
                      {errors.state && <p className="text-destructive text-sm mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className={`h-11 ${errors.pincode ? 'border-destructive' : ''}`}
                      />
                      {errors.pincode && <p className="text-destructive text-sm mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedPayment === method.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        {selectedPayment === method.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </label>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-28">
                  <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 border-t border-border pt-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {coupon && discountAmount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Coupon ({coupon.code}) -{coupon.discount}%</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? <span className="text-primary">FREE</span> : `₹${shipping}`}</span>
                    </div>
                    {codCharge > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>COD Charge</span>
                        <span>₹{codCharge}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-display text-2xl font-bold">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="flex flex-col gap-2 mt-6 text-muted-foreground text-xs">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>100% Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span>SSL Encrypted Checkout</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
