import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cart.service';
import { useAuth } from './useAuth';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { AddToCartInput, Product } from '@formerbench/shared';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { addToast } = useUIStore();
  const {
    guestItems,
    addGuestItem,
    updateGuestItemQuantity,
    removeGuestItem,
    clearGuestCart,
  } = useCartStore();

  // Server cart query (only enabled if user is logged in)
  const { data: serverCart, isLoading: isServerCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartService.getCart();
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: AddToCartInput) => cartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({ type: 'success', message: 'Added to cart' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateCartItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const removeCartItemMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({ type: 'info', message: 'Item removed from cart' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Unified items list
  let items: any[] = [];
  let subtotal = 0;
  let totalItems = 0;

  if (isAuthenticated && serverCart) {
    items = serverCart.items || [];
    subtotal = serverCart.subtotal;
    totalItems = serverCart.totalItems;
  } else {
    items = guestItems.map((g) => ({
      id: g.productId,
      productId: g.productId,
      quantity: g.quantity,
      selectedAttributes: g.selectedAttributes,
      product: {
        id: g.productId,
        title: g.productSnapshot.title,
        price: g.productSnapshot.price,
        discountPrice: g.productSnapshot.discountPrice,
        images: [g.productSnapshot.image],
        stock: 99,
      },
    }));

    subtotal = Number(
      guestItems
        .reduce((sum, item) => {
          const price = item.productSnapshot.discountPrice ?? item.productSnapshot.price;
          return sum + price * item.quantity;
        }, 0)
        .toFixed(2)
    );

    totalItems = guestItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Unified Actions
  const addToCart = (product: Product, quantity = 1, selectedAttributes?: Record<string, string>) => {
    if (isAuthenticated) {
      addToCartMutation.mutate({
        productId: product.id,
        quantity,
        selectedAttributes,
      });
    } else {
      addGuestItem({
        productId: product.id,
        quantity,
        selectedAttributes,
        productSnapshot: {
          title: product.title,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.images[0] || '',
        },
      });
      addToast({ type: 'success', message: 'Added to bag' });
    }
  };

  const updateQuantity = (itemId: string, productId: string, quantity: number) => {
    if (isAuthenticated) {
      updateCartItemMutation.mutate({ itemId, quantity });
    } else {
      updateGuestItemQuantity(productId, quantity);
    }
  };

  const removeItem = (itemId: string, productId: string) => {
    if (isAuthenticated) {
      removeCartItemMutation.mutate(itemId);
    } else {
      removeGuestItem(productId);
      addToast({ type: 'info', message: 'Item removed from bag' });
    }
  };

  const clearCart = () => {
    if (isAuthenticated) {
      clearCartMutation.mutate();
    } else {
      clearGuestCart();
    }
  };

  return {
    items,
    subtotal,
    totalItems,
    isLoading: isAuthenticated ? isServerCartLoading : false,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
