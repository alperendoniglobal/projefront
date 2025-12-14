/**
 * Gallery API
 * Galeri (Fotoğraf & Video) işlemleri - Toplu yükleme destekli
 */

import { apiRequest, getToken } from './client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

// Tipler
export interface GalleryItem {
  id: string;
  url: string;
  alt?: string;
  category?: string;
  type: 'image' | 'video';
  thumbnail?: string;  // Video için küçük resim
  createdAt: string;
}

export interface UploadResult {
  success: boolean;
  items: GalleryItem[];
}

export const galleryApi = {
  /**
   * Tüm galeri öğelerini getir
   */
  getAll: async (options?: { type?: 'image' | 'video'; category?: string }): Promise<GalleryItem[]> => {
    const params = new URLSearchParams();
    if (options?.type) params.append('type', options.type);
    if (options?.category) params.append('category', options.category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<GalleryItem[]>(`/api/gallery${query}`);
  },

  /**
   * Tek öğe getir
   */
  getById: async (id: string): Promise<GalleryItem> => {
    return apiRequest<GalleryItem>(`/api/gallery/${id}`);
  },

  /**
   * Tek dosya yükle
   */
  upload: async (file: File, alt?: string, category?: string): Promise<GalleryItem> => {
    const formData = new FormData();
    formData.append('file', file);
    if (alt) formData.append('alt', alt);
    if (category) formData.append('category', category);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Dosya yüklenemedi');
    }

    return response.json();
  },

  /**
   * Toplu dosya yükle - 20 dosyaya kadar
   */
  uploadMultiple: async (files: File[], category?: string): Promise<GalleryItem[]> => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (category) formData.append('category', category);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/gallery/upload/multiple`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Dosyalar yüklenemedi');
    }

    const result = await response.json();
    return result.items || result;
  },

  /**
   * Bilgileri güncelle
   */
  update: async (id: string, data: { alt?: string; category?: string }): Promise<GalleryItem> => {
    return apiRequest<GalleryItem>(`/api/gallery/${id}`, {
      method: 'PUT',
      auth: true,
      body: data,
    });
  },

  /**
   * Tek öğe sil
   */
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/gallery/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  /**
   * Toplu sil
   */
  deleteMultiple: async (ids: string[]): Promise<{ success: boolean; deleted: number }> => {
    return apiRequest<{ success: boolean; deleted: number }>(`/api/gallery/bulk`, {
      method: 'DELETE',
      auth: true,
      body: { ids },
    });
  },
};
