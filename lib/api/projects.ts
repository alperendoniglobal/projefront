/**
 * Projects API
 * Proje CRUD işlemleri - FormData ile dosya yükleme destekli
 */

import { apiRequest, apiUpload, getToken } from './client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

// Tipler
export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'devam-eden' | 'tamamlanan';
  image: string;
  location: string;
  year: string;
  details?: string;
  gallery?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  category: 'devam-eden' | 'tamamlanan';
  location: string;
  year: string;
  details?: string;
  image?: File | null;
  gallery?: File[];
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  category?: 'devam-eden' | 'tamamlanan';
  location?: string;
  year?: string;
  details?: string;
  image?: File | null;
  gallery?: File[];
  replaceGallery?: boolean;
}

export type CreateProjectDto = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectDto = Partial<CreateProjectDto>;

export const projectsApi = {
  /**
   * Tüm projeleri getir
   */
  getAll: async (category?: 'devam-eden' | 'tamamlanan'): Promise<Project[]> => {
    const query = category ? `?category=${category}` : '';
    return apiRequest<Project[]>(`/api/projects${query}`);
  },

  /**
   * Tek proje getir
   */
  getById: async (id: string): Promise<Project> => {
    return apiRequest<Project>(`/api/projects/${id}`);
  },

  /**
   * Yeni proje oluştur - FormData ile
   */
  create: async (data: CreateProjectData): Promise<Project> => {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('location', data.location);
    formData.append('year', data.year);
    
    if (data.details) {
      formData.append('details', data.details);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    if (data.gallery && data.gallery.length > 0) {
      data.gallery.forEach(file => {
        formData.append('gallery', file);
      });
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Proje oluşturulamadı');
    }

    return response.json();
  },

  /**
   * Proje güncelle - FormData ile
   */
  update: async (id: string, data: UpdateProjectData): Promise<Project> => {
    const formData = new FormData();
    
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.location) formData.append('location', data.location);
    if (data.year) formData.append('year', data.year);
    if (data.details !== undefined) formData.append('details', data.details || '');
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    if (data.gallery && data.gallery.length > 0) {
      data.gallery.forEach(file => {
        formData.append('gallery', file);
      });
    }

    if (data.replaceGallery !== undefined) {
      formData.append('replaceGallery', String(data.replaceGallery));
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Proje güncellenemedi');
    }

    return response.json();
  },

  /**
   * Proje sil
   */
  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/projects/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
