export type CouponType = 'percent' | 'flat' | 'shipping';

export interface Coupon {
  code: string;
  label: string;
  type: CouponType;
  value: number; // percent (0-100) or flat rupee amount
  minCart?: number;
  maxDiscount?: number;
  description: string;
}

export const COUPONS: Coupon[] = [
  {
    code: 'SAVE10',
    label: '10% Off',
    type: 'percent',
    value: 10,
    description: 'Get 10% off on your order',
  },
  {
    code: 'SAVE20',
    label: '20% Off',
    type: 'percent',
    value: 20,
    description: 'Get 20% off on your order',
  },
  {
    code: 'FREESHIP',
    label: 'Free Shipping',
    type: 'shipping',
    value: 0,
    description: 'Free shipping on your order',
  },
  {
    code: 'BASS25',
    label: '25% Off',
    type: 'percent',
    value: 25,
    minCart: 4999,
    description: '25% off on carts above ₹4,999',
  },
  {
    code: 'FIRST15',
    label: '15% Off (max ₹1,500)',
    type: 'percent',
    value: 15,
    maxDiscount: 1500,
    description: '15% off, capped at ₹1,500 — great for first-time buyers',
  },
  {
    code: 'AUDIO500',
    label: '₹500 Off',
    type: 'flat',
    value: 500,
    minCart: 2999,
    description: 'Flat ₹500 off on carts above ₹2,999',
  },
  {
    code: 'MEGA30',
    label: '30% Off',
    type: 'percent',
    value: 30,
    minCart: 9999,
    description: '30% off on carts above ₹9,999',
  },
];

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  minCart?: number;
  maxDiscount?: number;
}

export interface ValidateResult {
  ok: boolean;
  coupon?: Coupon;
  discountAmount: number;
  freeShipping: boolean;
  error?: string;
}

export const findCoupon = (code: string): Coupon | undefined =>
  COUPONS.find((c) => c.code === code.trim().toUpperCase());

export const validateCoupon = (code: string, subtotal: number): ValidateResult => {
  const coupon = findCoupon(code);
  if (!coupon) {
    return { ok: false, discountAmount: 0, freeShipping: false, error: 'Invalid coupon code' };
  }
  if (coupon.minCart && subtotal < coupon.minCart) {
    return {
      ok: false,
      discountAmount: 0,
      freeShipping: false,
      error: `Add ₹${(coupon.minCart - subtotal).toLocaleString()} more to use ${coupon.code}`,
    };
  }

  let discountAmount = 0;
  let freeShipping = false;

  if (coupon.type === 'percent') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
  } else if (coupon.type === 'flat') {
    discountAmount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === 'shipping') {
    freeShipping = true;
  }

  return { ok: true, coupon, discountAmount, freeShipping };
};

// Recompute discount/shipping from a persisted coupon code + current subtotal.
// Used by Checkout to make sure totals always match Cart.
export const recomputeCoupon = (code: string | null | undefined, subtotal: number): ValidateResult => {
  if (!code) return { ok: false, discountAmount: 0, freeShipping: false };
  return validateCoupon(code, subtotal);
};
