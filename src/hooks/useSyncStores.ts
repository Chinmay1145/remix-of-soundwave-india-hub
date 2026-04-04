import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useCartStore, useWishlistStore } from '@/lib/store';

export const useSyncStores = () => {
  const { user } = useAuth();
  const { syncWithDatabase: syncCart, loadFromDatabase: loadCart } = useCartStore();
  const { syncWithDatabase: syncWishlist, loadFromDatabase: loadWishlist } = useWishlistStore();

  // Load data from database when user logs in
  useEffect(() => {
    if (user) {
      loadCart(user.id);
      loadWishlist(user.id);
    }
  }, [user, loadCart, loadWishlist]);

  // Sync cart changes to database
  const cartItems = useCartStore((state) => state.items);
  useEffect(() => {
    if (user && cartItems.length >= 0) {
      // Debounce the sync to avoid too many requests
      const timeoutId = setTimeout(() => {
        syncCart(user.id);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [user, cartItems, syncCart]);

  // Sync wishlist changes to database
  const wishlistItems = useWishlistStore((state) => state.items);
  useEffect(() => {
    if (user && wishlistItems.length >= 0) {
      // Debounce the sync to avoid too many requests
      const timeoutId = setTimeout(() => {
        syncWishlist(user.id);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [user, wishlistItems, syncWishlist]);
};