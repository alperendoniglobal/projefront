/**
 * Careers API
 * Kariyer ilanı CRUD işlemleri
 */

import { apiRequest } from './client';

// Tipler
export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'tam-zamanli' | 'yari-zamanli' | 'staj';
  description: string;
  requirements: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateCareerDto = Omit<Career, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCareerDto = Partial<CreateCareerDto>;

export const careersApi = {
  /**
   * Aktif ilanları getir (public)
   */
  getActive: async (): Promise<Career[]> => {
    return apiRequest<Career[]>('/api/careers');
  },

  /**
   * Tüm ilanları getir (admin)
   */
  getAll: async (): Promise<Career[]> => {
    return apiRequest<Career[]>('/api/careers?all=true', {
      auth: true,
    });
  },

  /**
   * Tek ilan getir
   */
  getById: async (id: string): Promise<Career> => {
    return apiRequest<Career>(`/api/careers/${id}`);
  },

  /**
   * Yeni ilan oluştur
   */
  create: async (data: CreateCareerDto): Promise<Career> => {
    return apiRequest<Career>('/api/careers', {
      method: 'POST',
      body: data,
      auth: true,
    });
  },

  /**
   * İlan güncelle
   */
  update: async (id: string, data: UpdateCareerDto): Promise<Career> => {
    return apiRequest<Career>(`/api/careers/${id}`, {
      method: 'PUT',
      body: data,
      auth: true,
    });
  },

  /**
   * İlan sil
   */
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/careers/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  /**
   * İlan aktif/pasif durumunu değiştir
   */
  toggleActive: async (id: string, isActive: boolean): Promise<Career> => {
    return apiRequest<Career>(`/api/careers/${id}`, {
      method: 'PUT',
      body: { isActive },
      auth: true,
    });
  },
};

