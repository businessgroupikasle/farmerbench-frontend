import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { useUIStore } from '../store/uiStore';
import {
  ProductQueryInput,
  CreateProductInput,
  UpdateProductInput,
  CreateReviewInput,
} from '@formerbench/shared';

export const useProducts = (params?: Partial<ProductQueryInput>) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await productService.getProducts(params as any);
      return res;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: async () => {
      const res = await productService.getFeaturedProducts(limit);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (idOrSlug: string | undefined) => {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const res = await productService.getProduct(idOrSlug);
      return res.data || null;
    },
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 2,
  });
};

export const useProductReviews = (idOrSlug: string | undefined) => {
  return useQuery({
    queryKey: ['product-reviews', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const res = await productService.getProductReviews(idOrSlug);
      return res.data || null;
    },
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 2,
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  const createProduct = useMutation({
    mutationFn: (data: CreateProductInput) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      addToast({ type: 'success', message: 'Product created successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      addToast({ type: 'success', message: 'Product updated successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      addToast({ type: 'success', message: 'Product deleted successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const addReview = useMutation({
    mutationFn: (data: CreateReviewInput) => productService.addReview(data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const updateReview = useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      productId: string;
      data: { rating?: number; comment?: string };
    }) => productService.updateReview(reviewId, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      addToast({ type: 'success', message: 'Review updated successfully!' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const deleteReview = useMutation({
    mutationFn: ({
      reviewId,
    }: {
      reviewId: string;
      productId: string;
    }) => productService.deleteReview(reviewId),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      addToast({ type: 'success', message: 'Review deleted successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  return {
    createProduct: createProduct.mutateAsync,
    isCreating: createProduct.isPending,
    updateProduct: updateProduct.mutateAsync,
    isUpdating: updateProduct.isPending,
    deleteProduct: deleteProduct.mutateAsync,
    isDeleting: deleteProduct.isPending,
    addReview: addReview.mutateAsync,
    isSubmittingReview: addReview.isPending,
    updateReview: updateReview.mutateAsync,
    isUpdatingReview: updateReview.isPending,
    deleteReview: deleteReview.mutateAsync,
    isDeletingReview: deleteReview.isPending,
  };
};
