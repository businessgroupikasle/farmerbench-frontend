import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { cartService } from '../services/cart.service';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput, User } from '@formerbench/shared';

export const AUTH_QUERY_KEY = ['auth', 'user'];

export const getStoredUser = (): User | null => {
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

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('formerbench_auth_token'));

  useEffect(() => {
    const syncSession = () => {
      const nextToken = localStorage.getItem('formerbench_auth_token');
      setToken(nextToken);
      if (!nextToken) queryClient.setQueryData(AUTH_QUERY_KEY, null);
    };
    window.addEventListener('storage', syncSession);
    window.addEventListener('auth:unauthorized', syncSession);
    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('auth:unauthorized', syncSession);
    };
  }, [queryClient]);

  const { data: user, isLoading, isError } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const currentToken = localStorage.getItem('formerbench_auth_token');
      if (!currentToken) return null;
      try {
        const res = await authService.getMe();
        if (!res.data) throw new Error('Invalid authentication session');
        localStorage.setItem('formerbench_auth_user', JSON.stringify(res.data));
        return res.data;
      } catch {
        localStorage.removeItem('formerbench_auth_token');
        localStorage.removeItem('formerbench_auth_user');
        setToken(null);
        return null;
      }
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 1000 * 60 * 30,
  });

  const activeUser = user ?? null;

  const setAuthSession = (authUser: any, authToken: string) => {
    localStorage.setItem('formerbench_auth_token', authToken);
    localStorage.setItem('formerbench_auth_user', JSON.stringify(authUser));
    setToken(authToken);
    queryClient.setQueryData(AUTH_QUERY_KEY, authUser);
  };

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
        setAuthSession(data.user, data.token);
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
        setAuthSession(data.user, data.token);
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
    localStorage.removeItem('AgriEra_demo_admin');
    setToken(null);
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: ['cart'] });
    queryClient.removeQueries({ queryKey: ['orders'] });
    addToast({ type: 'info', message: 'Logged out successfully' });
  };

  return {
    user: activeUser ?? null,
    isAuthenticated: Boolean(activeUser && token),
    isAdmin: activeUser?.role === 'ADMIN',
    isLoading: Boolean(token) && isLoading,
    isError,
    setAuthSession,
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
