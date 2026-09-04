import { apiClient } from './api';
import {
  Product,
  ProductQueryInput,
  CreateProductInput,
  UpdateProductInput,
  CreateReviewInput,
  Review,
  ApiResponse,
  PaginatedResponse,
} from '@formerbench/shared';

export interface ProductReviewsSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
}

export interface ProductReviewsResponse {
  productId: string;
  productTitle: string;
  reviews: Review[];
  summary: ProductReviewsSummary;
}

export interface AdminReviewsResponse {
  reviews: Array<Review & {
    product?: { id: string; title: string; slug: string; images: string[] };
    user?: Review['user'] & { email?: string };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productService = {
  async getProducts(params?: ProductQueryInput): Promise<PaginatedResponse<Product>> {
    return apiClient.get('/products', { params });
  },

  async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    return apiClient.get('/products/featured', { params: { limit } });
  },

  async getProduct(idOrSlug: string): Promise<ApiResponse<Product>> {
    return apiClient.get(`/products/${idOrSlug}`);
  },

  async getProductReviews(idOrSlug: string): Promise<ApiResponse<ProductReviewsResponse>> {
    return apiClient.get(`/products/${idOrSlug}/reviews`);
  },

  async getAllReviews(page = 1, limit = 100): Promise<ApiResponse<AdminReviewsResponse>> {
    // Build the moderation list from the same public product-review records shown
    // on product pages. This also works for the dashboard's local/demo admin mode,
    // where calling the protected /reviews endpoint would return 401 and clear the
    // local session before its fallback could render.
    const productResponse = await apiClient.get('/products', {
      params: { page: 1, limit: 100 },
    }) as PaginatedResponse<Product>;
    const products = productResponse.data || [];
    const reviewResponses = await Promise.all(products.map(async (product) => {
      try {
        const response = await apiClient.get(`/products/${product.id}/reviews`) as ApiResponse<ProductReviewsResponse>;
        return (response.data?.reviews || []).map((review) => ({
          ...review,
          product: {
            id: product.id,
            title: product.title,
            slug: product.slug,
            images: product.images,
          },
        }));
      } catch {
        // One unavailable product must not hide reviews loaded from other products.
        return [];
      }
    }));
    const allReviews = reviewResponses
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const offset = Math.max(0, (page - 1) * limit);
    const reviews = allReviews.slice(offset, offset + limit);

    return {
      success: true,
      data: {
        reviews,
        total: allReviews.length,
        page,
        limit,
        totalPages: Math.ceil(allReviews.length / limit),
      },
    };
  },

  async createProduct(data: CreateProductInput): Promise<ApiResponse<Product>> {
    return apiClient.post('/products', data);
  },

  async updateProduct(id: string, data: UpdateProductInput): Promise<ApiResponse<Product>> {
    return apiClient.put(`/products/${id}`, data);
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/products/${id}`);
  },

  async addReview(data: CreateReviewInput): Promise<ApiResponse<Review>> {
    return apiClient.post('/products/reviews', data);
  },

  async updateReview(
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): Promise<ApiResponse<Review>> {
    return apiClient.put(`/reviews/${reviewId}`, data);
  },

  async deleteReview(reviewId: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/reviews/${reviewId}`);
  },
};
