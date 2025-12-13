/**
 * API Client - Base HTTP wrapper
 * Tüm API istekleri için merkezi yapılandırma
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Token yönetimi
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
};

// API Hata sınıfı
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request options tipi
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

/**
 * Merkezi fetch wrapper
 * - Otomatik JSON serialization
 * - Token ekleme
 * - Error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = false, headers: customHeaders, ...restOptions } = options;

  // Headers oluştur
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Auth token ekle
  if (auth) {
    const token = getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // Request yap
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Response parse
  const data = await response.json().catch(() => ({}));

  // Hata kontrolü
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || data.message || 'Bir hata oluştu',
      data
    );
  }

  return data as T;
}

/**
 * FormData için özel fetch wrapper (dosya yükleme)
 * @param endpoint - API endpoint
 * @param formData - FormData objesi
 * @param method - HTTP method (varsayılan: POST)
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || data.message || 'Yükleme başarısız',
      data
    );
  }

  return data as T;
}

// Export API base URL for static file access
export const getFileUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

