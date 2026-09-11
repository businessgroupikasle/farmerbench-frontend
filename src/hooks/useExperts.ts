import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AgronomyExpert, CreateExpertPayload, expertService } from '../services/expert.service';
export const useExperts = () => useQuery<AgronomyExpert[]>({
  queryKey: ['agronomy-experts'],
  queryFn: async () => { const response: any = await expertService.list(); return response.data || response || []; },
  staleTime: 30_000,
  refetchOnWindowFocus: true,
});
export const useExpertMutations = () => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (payload: CreateExpertPayload) => expertService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agronomy-experts'] }),
  });
  return { createExpert: createMutation.mutateAsync, isCreatingExpert: createMutation.isPending };
};