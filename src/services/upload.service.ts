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

const postSingleImage = async (file: File, folder: string): Promise<ApiResponse<UploadedImageData>> => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/upload/image', formData, {
    params: { folder },
    timeout: UPLOAD_TIMEOUT_MS,
    headers: { 'Content-Type': undefined },
  });
};

const normalizeUploadError = (error: unknown, multiple = false): never => {
  const message = error instanceof Error ? error.message : 'Image upload failed';
  if (/timeout|ECONNABORTED/i.test(message)) {
    throw new Error(`Image upload is taking too long. Check your connection and try again with smaller image${multiple ? 's' : ''}.`);
  }
  throw error;
};

export const uploadService = {
  async uploadImages(files: File[], folder = 'products/gallery'): Promise<ApiResponse<{ files: UploadedImageData[] }>> {
    try {
      // Production currently exposes the single-image route. Upload sequentially
      // to keep memory usage predictable while preserving the gallery API shape.
      const uploaded: UploadedImageData[] = [];
      for (const file of files) {
        const response = await postSingleImage(file, folder);
        if (!response.data) throw new Error(`Upload completed without file data for "${file.name}"`);
        uploaded.push(response.data);
      }
      return {
        success: true,
        message: `${uploaded.length} images uploaded successfully`,
        data: { files: uploaded },
      };
    } catch (error) {
      return normalizeUploadError(error, true);
    }
  },

  async uploadImage(file: File, folder = 'products/gallery'): Promise<ApiResponse<UploadedImageData>> {
    try {
      return await postSingleImage(file, folder);
    } catch (error) {
      return normalizeUploadError(error);
    }
  },
};
