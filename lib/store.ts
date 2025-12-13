/**
 * Zustand Store - Global State Management
 * 
 * Uygulama genelinde kullanılan global state yönetimi.
 * API'den çekilen verileri cache'ler ve bileşenler arası paylaşır.
 */

import { create } from 'zustand';
import { News, newsApi } from './api/news';

// Store tipi tanımı
interface StoreState {
  // Haberler state'i
  news: News[];
  newsLoading: boolean;
  newsError: string | null;
  
  // Haberler aksiyonları
  fetchNews: () => Promise<void>;
  getNewsBySlug: (slug: string) => News | undefined;
}

/**
 * Global Zustand Store
 * - news: Tüm haberler listesi
 * - fetchNews: API'den haberleri çeker
 * - getNewsBySlug: Slug'a göre haber bulur
 */
export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  news: [],
  newsLoading: false,
  newsError: null,
  
  /**
   * API'den haberleri çeker ve store'a kaydeder
   */
  fetchNews: async () => {
    // Zaten yüklenmiş mi kontrol et
    if (get().news.length > 0) return;
    
    set({ newsLoading: true, newsError: null });
    
    try {
      const data = await newsApi.getAll();
      set({ news: data, newsLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Haberler yüklenemedi';
      set({ newsError: message, newsLoading: false });
      console.error('Haberler yüklenirken hata:', error);
    }
  },
  
  /**
   * Slug'a göre haber bulur
   * @param slug - Haber slug'ı
   * @returns Haber objesi veya undefined
   */
  getNewsBySlug: (slug: string) => {
    return get().news.find(n => n.slug === slug);
  },
}));


