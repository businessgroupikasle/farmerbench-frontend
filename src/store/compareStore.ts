import { create } from 'zustand';
import { Product } from '@formerbench/shared';

interface CompareState {
  items: Product[];
  isDrawerOpen: boolean;
  toggleCompare: (product: Product) => { added: boolean; limitReached: boolean };
  isInCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
}

const MAX_COMPARE_ITEMS = 4;

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],
  isDrawerOpen: false,

  toggleCompare: (product: Product) => {
    const { items } = get();
    const exists = items.some((item) => item.id === product.id);

    if (exists) {
      set({ items: items.filter((item) => item.id !== product.id) });
      return { added: false, limitReached: false };
    }

    if (items.length >= MAX_COMPARE_ITEMS) {
      return { added: false, limitReached: true };
    }

    set({ items: [...items, product], isDrawerOpen: true });
    return { added: true, limitReached: false };
  },

  isInCompare: (productId: string) => {
    return get().items.some((item) => item.id === productId);
  },

  removeFromCompare: (productId: string) => {
    set((state) => {
      const remaining = state.items.filter((item) => item.id !== productId);
      return {
        items: remaining,
        isDrawerOpen: remaining.length > 0 ? state.isDrawerOpen : false,
      };
    });
  },

  clearCompare: () => {
    set({ items: [], isDrawerOpen: false });
  },

  setDrawerOpen: (isOpen: boolean) => {
    set({ isDrawerOpen: isOpen });
  },
}));
