import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@formerbench/shared';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product: Product) => {
        const { items } = get();
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
          return false;
        } else {
          set({ items: [...items, product] });
          return true;
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'farmerbench_wishlist',
    }
  )
);
