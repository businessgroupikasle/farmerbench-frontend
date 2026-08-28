import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { useUIStore } from '../store/uiStore';
import { CreateCategoryInput, UpdateCategoryInput } from '@formerbench/shared';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryService.getCategories();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCategory = (slugOrId: string | undefined) => {
  return useQuery({
    queryKey: ['category', slugOrId],
    queryFn: async () => {
      if (!slugOrId) return null;
      const res = await categoryService.getCategory(slugOrId);
      return res.data || null;
    },
    enabled: !!slugOrId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  const createCategory = useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ type: 'success', message: 'Category created successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ type: 'success', message: 'Category updated successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ type: 'success', message: 'Category deleted successfully' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message });
    },
  });

  return {
    createCategory: createCategory.mutateAsync,
    isCreating: createCategory.isPending,
    updateCategory: updateCategory.mutateAsync,
    isUpdating: updateCategory.isPending,
    deleteCategory: deleteCategory.mutateAsync,
    isDeleting: deleteCategory.isPending,
  };
};
