import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateHeroBannerInput, HeroPage, UpdateHeroBannerInput } from '@formerbench/shared';
import { heroBannerService } from '../services/heroBanner.service';

export const useHeroBanners = (page: HeroPage) => useQuery({
  queryKey: ['hero-banners', page],
  queryFn: async () => (await heroBannerService.list(page)).data || [],
  staleTime: 300_000,
});

export const useAdminHeroBanners = (page?: HeroPage) => useQuery({
  queryKey: ['hero-banners', 'admin', page],
  queryFn: async () => (await heroBannerService.listAdmin(page)).data || [],
});

export const useHeroBannerMutations = () => {
  const client = useQueryClient();
  const invalidate = () => client.invalidateQueries({ queryKey: ['hero-banners'] });
  const create = useMutation({ mutationFn: (data: CreateHeroBannerInput) => heroBannerService.create(data), onSuccess: invalidate });
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateHeroBannerInput }) => heroBannerService.update(id, data), onSuccess: invalidate });
  const remove = useMutation({ mutationFn: heroBannerService.remove, onSuccess: invalidate });
  const reorder = useMutation({ mutationFn: heroBannerService.reorder, onSuccess: invalidate });
  return { createBanner: create.mutateAsync, updateBanner: update.mutateAsync, deleteBanner: remove.mutateAsync, reorderBanners: reorder.mutateAsync };
};
