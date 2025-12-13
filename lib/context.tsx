'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  projectsApi, 
  newsApi, 
  careersApi, 
  settingsApi,
  galleryApi,
  type Project, 
  type News, 
  type Career, 
  type Settings,
  type GalleryItem 
} from '@/lib/api';

// Default settings
const defaultSettings: Settings = {
  id: 1,
  companyName: 'Özpolat İnşaat',
  phone: '+90 312 000 00 00',
  email: 'info@ozpolatinsaat.com',
  address: 'Ankara, Türkiye',
  workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
  socialMedia: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  stats: {
    experience: 20,
    ongoingProjects: 5,
    completedProjects: 150,
  },
  aboutText: 'Özpolat İnşaat olarak 2004 yılından bu yana, dinamik kadromuzla kalite, dürüstlük, titizlik ve doğruluk kavramlarını temel prensip edinerek çalışıyoruz.',
  missionText: 'Müşterilerimize en kaliteli inşaat hizmetini sunmak.',
  visionText: 'Türkiye\'nin en güvenilir inşaat şirketi olmak.',
  heroSlides: [],
};

// Context tipi
interface SiteContextType {
  // Data
  projects: Project[];
  news: News[];
  careers: Career[];
  settings: Settings;
  gallery: GalleryItem[];
  
  // State
  loading: boolean;
  error: string | null;
  
  // Actions
  refetch: () => Promise<void>;
  refetchProjects: () => Promise<void>;
  refetchNews: () => Promise<void>;
  refetchCareers: () => Promise<void>;
  refetchSettings: () => Promise<void>;
  refetchGallery: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Provider component
export function SiteProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch functions
  const refetchProjects = useCallback(async () => {
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  }, []);

  const refetchNews = useCallback(async () => {
    try {
      const data = await newsApi.getAll();
      setNews(data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    }
  }, []);

  const refetchCareers = useCallback(async () => {
    try {
      const data = await careersApi.getActive();
      setCareers(data);
    } catch (err) {
      console.error('Failed to fetch careers:', err);
    }
  }, []);

  const refetchSettings = useCallback(async () => {
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }, []);

  const refetchGallery = useCallback(async () => {
    try {
      const data = await galleryApi.getAll();
      setGallery(data);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        refetchProjects(),
        refetchNews(),
        refetchCareers(),
        refetchSettings(),
        refetchGallery(),
      ]);
    } catch (err) {
      console.error('Failed to fetch site data:', err);
      setError('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [refetchProjects, refetchNews, refetchCareers, refetchSettings, refetchGallery]);

  // Initial fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <SiteContext.Provider
      value={{
        projects,
        news,
        careers,
        settings,
        gallery,
        loading,
        error,
        refetch,
        refetchProjects,
        refetchNews,
        refetchCareers,
        refetchSettings,
        refetchGallery,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

// Custom hooks
export function useSiteData() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteData must be used within SiteProvider');
  }
  return context;
}

export function useSettings() {
  const context = useContext(SiteContext);
  if (!context) {
    // Return default settings if not in provider (for SSR compatibility)
    return { settings: defaultSettings, loading: false };
  }
  return { settings: context.settings, loading: context.loading };
}

export function useProjects() {
  const context = useContext(SiteContext);
  if (!context) {
    return { projects: [], loading: false };
  }
  return { projects: context.projects, loading: context.loading, refetch: context.refetchProjects };
}

export function useNews() {
  const context = useContext(SiteContext);
  if (!context) {
    return { news: [], loading: false };
  }
  return { news: context.news, loading: context.loading, refetch: context.refetchNews };
}

export function useCareers() {
  const context = useContext(SiteContext);
  if (!context) {
    return { careers: [], loading: false };
  }
  return { careers: context.careers, loading: context.loading, refetch: context.refetchCareers };
}

export function useGallery() {
  const context = useContext(SiteContext);
  if (!context) {
    return { gallery: [], loading: false };
  }
  return { gallery: context.gallery, loading: context.loading, refetch: context.refetchGallery };
}
