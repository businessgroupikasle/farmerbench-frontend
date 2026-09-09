import { apiClient } from './api';
import { ApiResponse } from '@formerbench/shared';
import { BlogPost, CreateBlogInput, UpdateBlogInput, BlogQueryParams, BlogCategory, BlogStatus } from '../types/blog';

const STORAGE_KEY = 'AgriEra_blogs_cms_data';

// Helper to get local stored blogs
const REMOVED_SEED_BLOG_IDS = new Set([
  'blog-1',
  'blog-2',
  'blog-3',
  'blog-4',
  'blog-5',
]);

const getStoredBlogs = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const blogs = parsed.filter((blog): blog is BlogPost =>
      Boolean(blog) && !REMOVED_SEED_BLOG_IDS.has(blog.id)
    );

    if (blogs.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    }

    return blogs;
  } catch {
    return [];
  }
};
const saveStoredBlogs = (blogs: BlogPost[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  } catch (err) {
    console.error('Failed to persist blogs in localStorage', err);
  }
};

export const blogService = {
  /**
   * Fetch all blogs with filtering, searching, and pagination
   */
  async getBlogs(params?: BlogQueryParams): Promise<ApiResponse<{ blogs: BlogPost[]; total: number; page: number; totalPages: number }>> {
    try {
      const res: any = await apiClient.get('/blogs', { params });
      if (res?.data && Array.isArray(res.data.blogs) && res.data.blogs.length > 0) {
        return res;
      }
    } catch {
      // Graceful fallback to client store
    }

    const all = getStoredBlogs();
    let filtered = [...all];

    // Filter status
    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((b) => b.status === params.status);
    } else if (!params?.status) {
      // Default public view only shows published
      filtered = filtered.filter((b) => b.status === 'PUBLISHED');
    }

    // Filter category
    if (params?.category && params.category !== 'all') {
      const catNorm = params.category.toLowerCase().replace(/[-_]/g, ' ');
      filtered = filtered.filter((b) => b.category.toLowerCase().replace(/[-_]/g, ' ') === catNorm || b.category.toLowerCase().includes(catNorm));
    }

    // Filter tag
    if (params?.tag) {
      filtered = filtered.filter((b) => b.tags?.some((t) => t.toLowerCase() === params.tag?.toLowerCase()));
    }

    // Search query
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (params?.sortBy === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (params?.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    }

    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 100;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: {
        blogs: paginated,
        total,
        page,
        totalPages,
      },
    };
  },

  /**
   * Fetch a single blog by slug or ID
   */
  async getBlog(idOrSlug: string): Promise<ApiResponse<BlogPost>> {
    try {
      const res: any = await apiClient.get(`/blogs/${idOrSlug}`);
      if (res?.data && res.data.id) {
        return res;
      }
    } catch {
      // Graceful fallback to client store
    }

    const all = getStoredBlogs();
    const cleanParam = idOrSlug.toLowerCase().trim();
    const found = all.find(
      (b) => b.id.toLowerCase() === cleanParam || b.slug.toLowerCase() === cleanParam
    );

    if (found) {
      // Increment views count locally
      found.views = (found.views || 0) + 1;
      saveStoredBlogs(all);

      return {
        success: true,
        data: found,
      };
    }

    throw new Error('Blog article not found');
  },

  /**
   * Fetch related blogs matching current article's category or tags
   */
  async getRelatedBlogs(idOrSlug: string, category?: string, limit = 3): Promise<ApiResponse<BlogPost[]>> {
    try {
      const res: any = await apiClient.get(`/blogs/${idOrSlug}/related`, { params: { limit } });
      if (res?.data && Array.isArray(res.data)) {
        return res;
      }
    } catch {
      // Fallback
    }

    const all = getStoredBlogs().filter((b) => b.status === 'PUBLISHED');
    const filtered = all.filter(
      (b) => b.id !== idOrSlug && b.slug !== idOrSlug && (!category || b.category.toLowerCase() === category.toLowerCase())
    );

    const related = filtered.slice(0, limit);
    // If not enough in category, fill with other published articles
    if (related.length < limit) {
      const remaining = all.filter((b) => b.id !== idOrSlug && b.slug !== idOrSlug && !related.some((r) => r.id === b.id));
      related.push(...remaining.slice(0, limit - related.length));
    }

    return {
      success: true,
      data: related,
    };
  },

  /**
   * Fetch category list with live blog counts
   */
  async getCategories(): Promise<ApiResponse<BlogCategory[]>> {
    try {
      const res: any = await apiClient.get('/blogs/categories');
      if (res?.data && Array.isArray(res.data) && res.data.length > 1) {
        return res;
      }
    } catch {
      // Fallback to local computation
    }

    const all = getStoredBlogs().filter((b) => b.status === 'PUBLISHED');
    const countMap: Record<string, { name: string; count: number }> = {};

    all.forEach((b) => {
      const cat = b.category || 'General';
      const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!countMap[slug]) {
        countMap[slug] = { name: cat, count: 0 };
      }
      countMap[slug].count += 1;
    });

    const list: BlogCategory[] = [
      { slug: 'all', name: 'All Articles', count: all.length },
      ...Object.entries(countMap).map(([slug, data]) => ({
        slug,
        name: data.name,
        count: data.count,
      })),
    ];

    return {
      success: true,
      data: list,
    };
  },

  /**
   * Create a new blog post
   */
  async createBlog(data: CreateBlogInput): Promise<ApiResponse<BlogPost>> {
    const now = new Date().toISOString();
    const slug =
      data.slug?.trim() ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newBlog: BlogPost = {
      id: 'blog-' + Date.now(),
      title: data.title,
      slug,
      excerpt: data.excerpt || data.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
      content: data.content,
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80',
      author: data.author || 'AgriEra Agri Expert',
      authorAvatar: data.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      authorBio: data.authorBio || 'Agricultural specialist at AgriEra.',
      category: data.category || 'General',
      tags: data.tags || ['Agriculture', 'Farming'],
      status: data.status || 'PUBLISHED',
      readingTime: data.readingTime || `${Math.max(1, Math.ceil(data.content.split(' ').length / 180))} min read`,
      views: 0,
      publishedAt: data.status === 'PUBLISHED' ? now : '',
      createdAt: now,
      updatedAt: now,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt,
    };

    try {
      const res = await apiClient.post<ApiResponse<BlogPost>>('/blogs', newBlog);
      if (res?.data) {
        return (res.data as any).data ? res.data : { success: true, data: (res.data as any) };
      }
    } catch {
      // Local fallback
    }

    const all = getStoredBlogs();
    const updated = [newBlog, ...all];
    saveStoredBlogs(updated);

    return {
      success: true,
      data: newBlog,
    };
  },

  /**
   * Update an existing blog post
   */
  async updateBlog(id: string, data: UpdateBlogInput): Promise<ApiResponse<BlogPost>> {
    try {
      const res = await apiClient.put<ApiResponse<BlogPost>>(`/blogs/${id}`, data);
      if (res?.data) {
        return (res.data as any).data ? res.data : { success: true, data: (res.data as any) };
      }
    } catch {
      // Local fallback
    }

    const all = getStoredBlogs();
    const idx = all.findIndex((b) => b.id === id || b.slug === id);
    if (idx === -1) {
      throw new Error('Blog not found');
    }

    const existing = all[idx];
    const now = new Date().toISOString();

    const updatedBlog: BlogPost = {
      ...existing,
      ...data,
      slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : existing.slug),
      updatedAt: now,
      publishedAt: data.status === 'PUBLISHED' && !existing.publishedAt ? now : existing.publishedAt,
    };

    all[idx] = updatedBlog;
    saveStoredBlogs(all);

    return {
      success: true,
      data: updatedBlog,
    };
  },

  /**
   * Delete a blog post
   */
  async deleteBlog(id: string): Promise<ApiResponse<null>> {
    try {
      await apiClient.delete(`/blogs/${id}`);
    } catch {
      // Local fallback
    }

    const all = getStoredBlogs();
    const filtered = all.filter((b) => b.id !== id && b.slug !== id);
    saveStoredBlogs(filtered);

    return {
      success: true,
      data: null,
    };
  },

  /**
   * Toggle Publish / Draft status
   */
  async toggleBlogStatus(id: string, status: BlogStatus): Promise<ApiResponse<BlogPost>> {
    return this.updateBlog(id, { status });
  },
};
