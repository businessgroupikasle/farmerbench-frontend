import { create } from 'zustand';

export interface GuestCartItem {
  id?: string;
  productId: string;
  quantity: number;
  selectedAttributes?: Record<string, any> | null;
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
  updateGuestItemQuantity: (itemKey: string, quantity: number) => void;
  removeGuestItem: (itemKey: string) => void;
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
    const newPackSize = newItem.selectedAttributes?.packSize || '';
    const existingIndex = current.findIndex(
      (i) => i.productId === newItem.productId && (i.selectedAttributes?.packSize || '') === newPackSize
    );
    let updated: GuestCartItem[];

    if (existingIndex > -1) {
      updated = current.map((item, idx) =>
        idx === existingIndex
          ? {
              ...item,
              quantity: item.quantity + newItem.quantity,
              productSnapshot: newItem.productSnapshot,
            }
          : item
      );
    } else {
      updated = [...current, newItem];
    }

    saveGuestCart(updated);
    set({ guestItems: updated });
  },

  updateGuestItemQuantity: (itemKey, quantity) => {
    const current = get().guestItems;
    let updated: GuestCartItem[];

    if (quantity <= 0) {
      updated = current.filter((i) => {
        const key = `${i.productId}-${i.selectedAttributes?.packSize || 'default'}`;
        return key !== itemKey && i.productId !== itemKey;
      });
    } else {
      updated = current.map((i) => {
        const key = `${i.productId}-${i.selectedAttributes?.packSize || 'default'}`;
        return key === itemKey || i.productId === itemKey ? { ...i, quantity } : i;
      });
    }

    saveGuestCart(updated);
    set({ guestItems: updated });
  },

  removeGuestItem: (itemKey) => {
    const updated = get().guestItems.filter((i) => {
      const key = `${i.productId}-${i.selectedAttributes?.packSize || 'default'}`;
      return key !== itemKey && i.productId !== itemKey;
    });
    saveGuestCart(updated);
    set({ guestItems: updated });
  },

  clearGuestCart: () => {
    localStorage.removeItem('formerbench_guest_cart');
    set({ guestItems: [] });
  },
}));
