import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  batteryLife: string;
  bluetooth: string;
  anc: boolean;
  colors: string[];
  description: string;
  features: string[];
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  syncWithDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
}

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  syncWithDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
}

// Helper to get product by ID
import { products as allProducts } from './products';

const getProductById = (productId: string): Product | undefined => {
  return allProducts.find(p => p.id === productId);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      syncWithDatabase: async (userId: string) => {
        const state = get();
        
        // First, clear existing cart items for this user
        await supabase.from('cart_items').delete().eq('user_id', userId);
        
        // Then insert current cart items
        if (state.items.length > 0) {
          const cartData = state.items.map(item => ({
            user_id: userId,
            product_id: item.id,
            quantity: item.quantity,
          }));
          
          await supabase.from('cart_items').insert(cartData);
        }
      },
      loadFromDatabase: async (userId: string) => {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId);
        
        if (error || !data) return;
        
        const cartItems: CartItem[] = [];
        for (const item of data) {
          const product = getProductById(item.product_id);
          if (product) {
            cartItems.push({ ...product, quantity: item.quantity });
          }
        }
        
        set({ items: cartItems });
      },
    }),
    { name: 'soundwave-cart' }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) =>
        set((state) => {
          if (state.items.find((item) => item.id === product.id)) {
            return state;
          }
          return { items: [...state.items, product] };
        }),
      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      isInWishlist: (productId) => {
        const state = get();
        return state.items.some((item) => item.id === productId);
      },
      syncWithDatabase: async (userId: string) => {
        const state = get();
        
        // First, clear existing wishlist items for this user
        await supabase.from('wishlist_items').delete().eq('user_id', userId);
        
        // Then insert current wishlist items
        if (state.items.length > 0) {
          const wishlistData = state.items.map(item => ({
            user_id: userId,
            product_id: item.id,
          }));
          
          await supabase.from('wishlist_items').insert(wishlistData);
        }
      },
      loadFromDatabase: async (userId: string) => {
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('*')
          .eq('user_id', userId);
        
        if (error || !data) return;
        
        const wishlistItems: Product[] = [];
        for (const item of data) {
          const product = getProductById(item.product_id);
          if (product) {
            wishlistItems.push(product);
          }
        }
        
        set({ items: wishlistItems });
      },
    }),
    { name: 'soundwave-wishlist' }
  )
);