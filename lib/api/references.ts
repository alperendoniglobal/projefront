/**
 * References API
 * Referanslar/İş Ortakları işlemleri
 */

import { apiRequest, getToken } from './client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Tipler
export interface Reference {
  id: string;
  name: string;
  logo: string;
  website?: string | null;
  description?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferenceDto {
  name: string;
  logo: string;
  website?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateReferenceDto {
  name?: string;
  logo?: string;
  website?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export const referencesApi = {
  /**
   * Tüm referansları getir
   * @param all - true ise tüm referansları getirir (admin için), false ise sadece aktif olanları
   */
  getAll: async (all: boolean = false): Promise<Reference[]> => {
    const query = all ? '?all=true' : '';
    return apiRequest<Reference[]>(`/api/references${query}`);
  },

  /**
   * Tek referans getir
   */
  getById: async (id: string): Promise<Reference> => {
    return apiRequest<Reference>(`/api/references/${id}`);
  },

  /**
   * Yeni referans oluştur
   */
  create: async (data: CreateReferenceDto): Promise<Reference> => {
    return apiRequest<Reference>('/api/references', {
      method: 'POST',
      auth: true,
      body: data,
    });
  },

  /**
   * Referans güncelle
   */
  update: async (id: string, data: UpdateReferenceDto): Promise<Reference> => {
    return apiRequest<Reference>(`/api/references/${id}`, {
      method: 'PUT',
      auth: true,
      body: data,
    });
  },

  /**
   * Referansların sıralamasını güncelle
   */
  reorder: async (orders: Array<{ id: string; order: number }>): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>('/api/references/reorder', {
      method: 'PUT',
      auth: true,
      body: { orders },
    });
  },

  /**
   * Referans sil
   */
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/references/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};

