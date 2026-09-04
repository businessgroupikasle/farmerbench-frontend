import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateSubcategoryInput, UpdateSubcategoryInput } from '@formerbench/shared';
import { subcategoryService } from '../services/subcategory.service';
import { useUIStore } from '../store/uiStore';

export const useSubcategories = (categoryId?: string) => useQuery({
  queryKey: ['subcategories', categoryId],
  queryFn: async () => (await subcategoryService.getSubcategories(categoryId)).data || [],
  staleTime: 600_000,
});

export const useSubcategoryMutations = () => {
  const client = useQueryClient();
  const { addToast } = useUIStore();
  const done = (message: string) => {
    client.invalidateQueries({ queryKey: ['subcategories'] });
    client.invalidateQueries({ queryKey: ['categories'] });
    addToast({ type: 'success', message });
  };
  const create = useMutation({ mutationFn: (data: CreateSubcategoryInput) => subcategoryService.createSubcategory(data), onSuccess: () => done('Subcategory created') });
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateSubcategoryInput }) => subcategoryService.updateSubcategory(id, data), onSuccess: () => done('Subcategory updated') });
  const remove = useMutation({ mutationFn: subcategoryService.deleteSubcategory, onSuccess: () => done('Subcategory deactivated') });
  return { createSubcategory: create.mutateAsync, updateSubcategory: update.mutateAsync, deleteSubcategory: remove.mutateAsync };
};
