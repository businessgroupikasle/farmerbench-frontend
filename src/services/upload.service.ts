import { apiClient } from './api';
import { ApiResponse } from '@formerbench/shared';

export interface UploadedImageData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

const UPLOAD_TIMEOUT_MS = 120_000;

export const uploadService = {
  async uploadImages(files: File[], folder = 'products/gallery'): Promise<ApiResponse<{ files: UploadedImageData[] }>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      return await apiClient.post('/upload/images', formData, {
        params: { folder },
        timeout: UPLOAD_TIMEOUT_MS,
        headers: { 'Content-Type': undefined },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Image upload failed';
      if (/timeout|ECONNABORTED/i.test(message)) {
        throw new Error('Image upload is taking too long. Check your connection and try again with smaller images.');
      }
      throw error;
    }
  },

  async uploadImage(file: File, folder = 'products/gallery'): Promise<ApiResponse<UploadedImageData>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      return await apiClient.post('/upload/image', formData, {
        params: { folder },
        timeout: UPLOAD_TIMEOUT_MS,
        headers: { 'Content-Type': undefined },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Image upload failed';
      if (/timeout|ECONNABORTED/i.test(message)) {
        throw new Error('Image upload is taking too long. Check your connection and try again with a smaller image.');
      }
      throw error;
    }
  },
};