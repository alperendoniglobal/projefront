/**
 * Settings API
 * Site ayarları işlemleri
 */

import { apiRequest, apiUpload, getToken } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

// Tipler
export interface HeroSlide {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  order?: number;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

export interface Stats {
  experience: number;
  ongoingProjects: number;
  completedProjects: number;
}

export interface Settings {
  id: number;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  socialMedia: SocialMedia;
  stats: Stats;
  aboutText: string;
  missionText: string;
  visionText: string;
  heroSlides: HeroSlide[];
}

export type UpdateSettingsDto = Partial<Omit<Settings, 'id' | 'heroSlides'>>;

// Hero slide oluşturma/güncelleme için input tipi
export interface HeroSlideInput {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: File | string; // File veya mevcut URL
  order?: number;
}

export const settingsApi = {
  /**
   * Ayarları getir
   */
  get: async (): Promise<Settings> => {
    return apiRequest<Settings>('/api/settings');
  },

  /**
   * Ayarları güncelle (FormData ile)
   */
  update: async (data: UpdateSettingsDto): Promise<Settings> => {
    const formData = new FormData();
    
    // Basit alanları ekle
    if (data.companyName) formData.append('companyName', data.companyName);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.address) formData.append('address', data.address);
    if (data.workingHours) formData.append('workingHours', data.workingHours);
    if (data.aboutText) formData.append('aboutText', data.aboutText);
    if (data.missionText) formData.append('missionText', data.missionText);
    if (data.visionText) formData.append('visionText', data.visionText);
    
    // JSON alanları string olarak gönder
    if (data.socialMedia) formData.append('socialMedia', JSON.stringify(data.socialMedia));
    if (data.stats) formData.append('stats', JSON.stringify(data.stats));
    
    return apiUpload<Settings>('/api/settings', formData, 'PUT');
  },

  /**
   * Hero slides'ları görsellerle birlikte güncelle
   */
  updateHeroSlides: async (
    slides: HeroSlideInput[],
    images?: (File | null)[]
  ): Promise<Settings> => {
    const formData = new FormData();
    
    // Slide verilerini JSON string olarak ekle (image alanı hariç)
    const slidesData = slides.map(({ image, ...rest }) => rest);
    formData.append('heroSlides', JSON.stringify(slidesData));
    
    // Görselleri sırayla ekle
    if (images) {
      images.forEach((file) => {
        if (file) {
          formData.append('heroImages', file);
        }
      });
    }
    
    return apiUpload<Settings>('/api/settings', formData, 'PUT');
  },

  /**
   * Yeni hero slide ekle
   */
  addHeroSlide: async (slide: HeroSlideInput): Promise<Settings> => {
    const formData = new FormData();
    
    formData.append('title', slide.title);
    if (slide.subtitle) formData.append('subtitle', slide.subtitle);
    if (slide.description) formData.append('description', slide.description);
    if (slide.ctaText) formData.append('ctaText', slide.ctaText);
    if (slide.ctaLink) formData.append('ctaLink', slide.ctaLink);
    
    // Görsel dosya ise FormData'ya ekle
    if (slide.image && slide.image instanceof File) {
      formData.append('image', slide.image);
    }
    
    return apiUpload<Settings>('/api/settings/hero-slide', formData, 'POST');
  },

  /**
   * Hero slide güncelle
   */
  updateHeroSlide: async (id: string, slide: Partial<HeroSlideInput>): Promise<Settings> => {
    const formData = new FormData();
    
    if (slide.title) formData.append('title', slide.title);
    if (slide.subtitle !== undefined) formData.append('subtitle', slide.subtitle);
    if (slide.description !== undefined) formData.append('description', slide.description);
    if (slide.ctaText !== undefined) formData.append('ctaText', slide.ctaText);
    if (slide.ctaLink !== undefined) formData.append('ctaLink', slide.ctaLink);
    if (slide.order !== undefined) formData.append('order', String(slide.order));
    
    // Görsel dosya ise FormData'ya ekle
    if (slide.image && slide.image instanceof File) {
      formData.append('image', slide.image);
    }
    
    return apiUpload<Settings>(`/api/settings/hero-slide/${id}`, formData, 'PUT');
  },

  /**
   * Hero slide sil
   */
  deleteHeroSlide: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/settings/hero-slide/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  /**
   * İstatistikleri güncelle
   */
  updateStats: async (stats: Stats): Promise<Settings> => {
    const formData = new FormData();
    formData.append('stats', JSON.stringify(stats));
    return apiUpload<Settings>('/api/settings', formData, 'PUT');
  },

  /**
   * Sosyal medya linklerini güncelle
   */
  updateSocialMedia: async (socialMedia: SocialMedia): Promise<Settings> => {
    const formData = new FormData();
    formData.append('socialMedia', JSON.stringify(socialMedia));
    return apiUpload<Settings>('/api/settings', formData, 'PUT');
  },
};

