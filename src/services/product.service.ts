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
