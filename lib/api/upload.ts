/**
 * Upload API
 * Dosya yükleme işlemleri
 */

import { apiUpload } from './client';

// Tipler
export interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
}

export interface MultiUploadResponse {
  success: boolean;
  files: Array<{
    url: string;
    filename: string;
  }>;
}

export type UploadFolder = 'projects' | 'news' | 'hero' | 'gallery' | 'general';

export const uploadApi = {
  /**
   * Tek dosya yükle
   */
  single: async (file: File, folder: UploadFolder = 'general'): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return apiUpload<UploadResponse>('/api/upload', formData);
  },

  /**
   * Çoklu dosya yükle
   */
  multiple: async (files: File[], folder: UploadFolder = 'general'): Promise<MultiUploadResponse> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);

    return apiUpload<MultiUploadResponse>('/api/upload/multiple', formData);
  },
};

