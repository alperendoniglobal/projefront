/**
 * News API
 * Haber CRUD işlemleri
 */

import { apiRequest } from './client';

// Tipler
export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateNewsDto = Omit<News, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;
export type UpdateNewsDto = Partial<CreateNewsDto>;

export const newsApi = {
  /**
   * Tüm haberleri getir
   */
  getAll: async (): Promise<News[]> => {
    return apiRequest<News[]>('/api/news');
  },

  /**
   * Tek haber getir (ID veya slug ile)
   */
  getById: async (idOrSlug: string): Promise<News> => {
    return apiRequest<News>(`/api/news/${idOrSlug}`);
  },

  /**
   * Yeni haber oluştur
   */
  create: async (data: CreateNewsDto): Promise<News> => {
    return apiRequest<News>('/api/news', {
      method: 'POST',
      body: data,
      auth: true,
    });
  },

  /**
   * Haber güncelle
   */
  update: async (id: string, data: UpdateNewsDto): Promise<News> => {
    return apiRequest<News>(`/api/news/${id}`, {
      method: 'PUT',
      body: data,
      auth: true,
    });
  },

  /**
   * Haber sil
   */
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/news/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};

