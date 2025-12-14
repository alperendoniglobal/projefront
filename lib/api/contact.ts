import { apiRequest } from './client';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  adminNotes: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: 'Genel Bilgi' | 'Teklif Talebi' | 'İş Birliği' | 'Şikayet / Öneri' | 'Diğer';
  message: string;
}

export interface UpdateContactDto {
  isRead?: boolean;
  isReplied?: boolean;
  adminNotes?: string;
}

export interface CreateContactResponse {
  success: true;
  message: string;
}

export interface UnreadCountResponse {
  count: number;
}

export const contactApi = {
  // Public - Yeni mesaj gönder
  async create(data: CreateContactDto): Promise<CreateContactResponse> {
    return apiRequest<CreateContactResponse>('/api/contact', {
      method: 'POST',
      body: data,
    });
  },

  // Admin - Tüm mesajları getir
  async getAll(filters?: { isRead?: boolean; isReplied?: boolean }): Promise<Contact[]> {
    let url = '/api/contact';
    const params = new URLSearchParams();
    
    if (filters?.isRead !== undefined) {
      params.append('isRead', String(filters.isRead));
    }
    if (filters?.isReplied !== undefined) {
      params.append('isReplied', String(filters.isReplied));
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return apiRequest<Contact[]>(url, { auth: true });
  },

  // Admin - Tek mesaj getir
  async getById(id: string): Promise<Contact> {
    return apiRequest<Contact>(`/api/contact/${id}`, { auth: true });
  },

  // Admin - Okunmamış mesaj sayısı
  async getUnreadCount(): Promise<number> {
    const response = await apiRequest<UnreadCountResponse>('/api/contact/unread-count', { auth: true });
    return response.count;
  },

  // Admin - Mesaj güncelle
  async update(id: string, data: UpdateContactDto): Promise<Contact> {
    return apiRequest<Contact>(`/api/contact/${id}`, {
      method: 'PUT',
      body: data,
      auth: true,
    });
  },

  // Admin - Mesaj sil
  async delete(id: string): Promise<void> {
    await apiRequest(`/api/contact/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  // Admin - Okundu olarak işaretle
  async markAsRead(id: string): Promise<Contact> {
    return this.update(id, { isRead: true });
  },

  // Admin - Yanıtlandı olarak işaretle
  async markAsReplied(id: string): Promise<Contact> {
    return this.update(id, { isReplied: true });
  },
};
