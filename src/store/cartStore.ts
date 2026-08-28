import { create } from 'zustand';

export interface GuestCartItem {
  productId: string;
  quantity: number;
  selectedAttributes?: Record<string, string> | null;
  productSnapshot: {
    title: string;
    price: number;
    discountPrice?: number | null;
    image: string;
  };
}

interface CartUIState {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  guestItems: GuestCartItem[];
  addGuestItem: (item: GuestCartItem) => void;
  updateGuestItemQuantity: (productId: string, quantity: number) => void;
  removeGuestItem: (productId: string) => void;
  clearGuestCart: () => void;
}

const loadGuestCart = (): GuestCartItem[] => {
  try {
    const data = localStorage.getItem('formerbench_guest_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items: GuestCartItem[]) => {
  try {
    localStorage.setItem('formerbench_guest_cart', JSON.stringify(items));
  } catch {
    // Ignore localStorage write error
  }
};

export const useCartStore = create<CartUIState>((set, get) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  guestItems: loadGuestCart(),

  addGuestItem: (newItem) => {
    const current = get().guestItems;
    const existingIndex = current.findIndex((i) => i.productId === newItem.productId);
    let updated: GuestCartItem[];

    if (existingIndex > -1) {
      updated = current.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item
      );
    } else {
      updated = [...current, newItem];
    }

    saveGuestCart(updated);
    set({ guestItems: updated, isDrawerOpen: true });
  },

  updateGuestItemQuantity: (productId, quantity) => {
    const current = get().guestItems;
    let updated: GuestCartItem[];

    if (quantity <= 0) {
      updated = current.filter((i) => i.productId !== productId);
    } else {
      updated = current.map((i) => (i.productId === productId ? { ...i, quantity } : i));
    }

    saveGuestCart(updated);
    set({ guestItems: updated });
  },

  removeGuestItem: (productId) => {
    const updated = get().guestItems.filter((i) => i.productId !== productId);
    saveGuestCart(updated);
    set({ guestItems: updated });
  },

  clearGuestCart: () => {
    localStorage.removeItem('formerbench_guest_cart');
    set({ guestItems: [] });
  },
}));
