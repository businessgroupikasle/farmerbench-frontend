import { apiClient } from './api';
import { ApiResponse } from '@formerbench/shared';

export interface UploadedImageData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export const uploadService = {
  async uploadImage(file: File, folder = 'products/gallery'): Promise<ApiResponse<UploadedImageData>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/upload/image', formData, {
      params: { folder },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
