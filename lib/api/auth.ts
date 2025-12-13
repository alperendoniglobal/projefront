/**
 * Auth API
 * Kimlik doğrulama işlemleri
 */

import { apiRequest, setToken, removeToken, getToken } from './client';

// Response tipleri
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

interface AuthCheckResponse {
  authenticated: boolean;
  user?: {
    id: string;
    role: string;
  };
}

export const authApi = {
  /**
   * Admin girişi
   */
  login: async (password: string): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { password },
    });

    // Token'ı kaydet
    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  /**
   * Token geçerliliğini kontrol et
   */
  check: async (): Promise<AuthCheckResponse> => {
    return apiRequest<AuthCheckResponse>('/api/auth/check', {
      method: 'GET',
      auth: true,
    });
  },

  /**
   * Çıkış yap
   */
  logout: async (): Promise<void> => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  /**
   * Kullanıcı giriş yapmış mı?
   */
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

