export type BlogStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  category: string;
  tags: string[];
  status: BlogStatus;
  readingTime: string;
  views?: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author?: string;
  authorAvatar?: string;
  authorBio?: string;
  category: string;
  tags?: string[];
  status?: BlogStatus;
  readingTime?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {
  id?: string;
}

export interface BlogQueryParams {
  category?: string;
  search?: string;
  tag?: string;
  status?: BlogStatus | 'ALL';
  sortBy?: 'newest' | 'popular' | 'oldest';
  page?: number;
  limit?: number;
}

export interface BlogCategory {
  slug: string;
  name: string;
  count: number;
}
