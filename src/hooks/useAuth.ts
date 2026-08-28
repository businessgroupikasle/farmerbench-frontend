import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { cartService } from '../services/cart.service';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput, User } from '@formerbench/shared';

export const AUTH_QUERY_KEY = ['auth', 'user'];

const getStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem('formerbench_auth_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { addToast, closeAuthModal } = useUIStore();
  const { guestItems, clearGuestCart } = useCartStore();

  const token = localStorage.getItem('formerbench_auth_token');

  const { data: user, isLoading, isError } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await authService.getMe();
        if (res.data) {
          localStorage.setItem('formerbench_auth_user', JSON.stringify(res.data));
          return res.data;
        }
        return null;
      } catch (err) {
        localStorage.removeItem('formerbench_auth_token');
        localStorage.removeItem('formerbench_auth_user');
        return null;
      }
    },
    initialData: getStoredUser,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const syncGuestCartIfAny = async () => {
    if (guestItems.length > 0) {
      try {
        await cartService.syncCart({
          items: guestItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            selectedAttributes: i.selectedAttributes,
          })),
        });
        clearGuestCart();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } catch (e) {
        console.error('Failed to sync guest cart', e);
      }
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await authService.login(data);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data) {
        localStorage.setItem('formerbench_auth_token', data.token);
        localStorage.setItem('formerbench_auth_user', JSON.stringify(data.user));
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
        addToast({ type: 'success', message: `Welcome back, ${data.user.name}!` });
        closeAuthModal();
        await syncGuestCartIfAny();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message || 'Login failed' });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await authService.register(data);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data) {
        localStorage.setItem('formerbench_auth_token', data.token);
        localStorage.setItem('formerbench_auth_user', JSON.stringify(data.user));
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
        addToast({ type: 'success', message: `Account created! Welcome, ${data.user.name}!` });
        closeAuthModal();
        await syncGuestCartIfAny();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message || 'Registration failed' });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const res = await authService.updateProfile(data);
      return res.data;
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        localStorage.setItem('formerbench_auth_user', JSON.stringify(updatedUser));
        queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
        addToast({ type: 'success', message: 'Profile updated successfully' });
      }
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const res = await authService.changePassword(data);
      return res.data;
    },
    onSuccess: () => {
      addToast({ type: 'success', message: 'Password changed successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const logout = () => {
    localStorage.removeItem('formerbench_auth_token');
    localStorage.removeItem('formerbench_auth_user');
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: ['cart'] });
    queryClient.removeQueries({ queryKey: ['orders'] });
    addToast({ type: 'info', message: 'Logged out successfully' });
  };

  return {
    user: user ?? null,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    logout,
  };
};
