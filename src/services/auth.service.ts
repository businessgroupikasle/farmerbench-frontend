import { apiClient } from './api';
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
  User,
  AuthResponse,
  ApiResponse,
} from '@formerbench/shared';

export const authService = {
  async register(data: RegisterInput): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/auth/register', data);
  },

  async login(data: LoginInput): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/auth/login', data);
  },

  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  },

  async updateProfile(data: UpdateProfileInput): Promise<ApiResponse<User>> {
    return apiClient.put('/auth/profile', data);
  },

  async changePassword(data: ChangePasswordInput): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put('/auth/change-password', data);
  },

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/auth/refresh-token');
  },
};
