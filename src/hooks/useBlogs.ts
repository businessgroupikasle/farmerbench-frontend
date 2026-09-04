import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/blog.service';
import { BlogQueryParams, CreateBlogInput, UpdateBlogInput, BlogStatus } from '../types/blog';
import { useUIStore } from '../store/uiStore';

export const useBlogs = (params?: BlogQueryParams) => {
  const statusKey = params?.status || 'DEFAULT';
  const categoryKey = params?.category || 'ALL';
  const searchKey = params?.search || '';
  const tagKey = params?.tag || '';
  const pageKey = params?.page || 1;
  const sortKey = params?.sortBy || 'newest';

  return useQuery({
    queryKey: ['blogs', statusKey, categoryKey, searchKey, tagKey, pageKey, sortKey],
    queryFn: async () => {
      const res = await blogService.getBlogs(params);
      return res.data || { blogs: [], total: 0, page: 1, totalPages: 1 };
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: false,
  });
};

export const useBlog = (idOrSlug: string | undefined) => {
  return useQuery({
    queryKey: ['blog', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const res = await blogService.getBlog(idOrSlug);
      return res.data || null;
    },
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useRelatedBlogs = (idOrSlug: string | undefined, category?: string, limit = 3) => {
  return useQuery({
    queryKey: ['blogs', 'related', idOrSlug, category, limit],
    queryFn: async () => {
      if (!idOrSlug) return [];
      const res = await blogService.getRelatedBlogs(idOrSlug, category, limit);
      return res.data || [];
    },
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blogs', 'categories'],
    queryFn: async () => {
      const res = await blogService.getCategories();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useBlogMutations = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
    queryClient.invalidateQueries({ queryKey: ['blog'] });
  };

  const createBlog = useMutation({
    mutationFn: (data: CreateBlogInput) => blogService.createBlog(data),
    onSuccess: (res) => {
      invalidateAll();
      addToast({
        type: 'success',
        message: `Blog post "${res.data?.title || 'Article'}" created successfully!`,
      });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message || 'Failed to create blog post' });
    },
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogInput }) =>
      blogService.updateBlog(id, data),
    onSuccess: (res) => {
      invalidateAll();
      addToast({
        type: 'success',
        message: `Blog post "${res.data?.title || 'Article'}" updated successfully!`,
      });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message || 'Failed to update blog post' });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      invalidateAll();
      addToast({ type: 'info', message: 'Blog article removed.' });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message || 'Failed to delete blog post' });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BlogStatus }) =>
      blogService.toggleBlogStatus(id, status),
    onSuccess: (res) => {
      invalidateAll();
      const isPub = res.data?.status === 'PUBLISHED';
      addToast({
        type: 'success',
        message: `Article is now ${isPub ? 'Published live' : 'Saved as Draft'}.`,
      });
    },
    onError: (error: Error) => {
      addToast({ type: 'error', message: error.message || 'Failed to update status' });
    },
  });

  return {
    createBlog: createBlog.mutateAsync,
    isCreating: createBlog.isPending,
    updateBlog: updateBlog.mutateAsync,
    isUpdating: updateBlog.isPending,
    deleteBlog: deleteBlog.mutateAsync,
    isDeleting: deleteBlog.isPending,
    toggleStatus: toggleStatus.mutateAsync,
    isToggling: toggleStatus.isPending,
  };
};
