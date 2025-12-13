'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, CheckCircle, Loader2, Plus, Trash2, Upload, 
  Image as ImageIcon, ArrowUp, ArrowDown, GripVertical,
  AlertCircle, X, Link as LinkIcon
} from 'lucide-react';
import { settingsApi, type Settings, type HeroSlide } from '@/lib/api';
import { getFileUrl } from '@/lib/api';

// Sayfa linkleri listesi
const PAGE_LINKS = [
  { value: '/', label: 'Ana Sayfa' },
  { value: '/kurumsal', label: 'Hakkımızda / Kurumsal' },
  { value: '/projeler', label: 'Projeler' },
  { value: '/haberler', label: 'Haberler' },
  { value: '/kariyer', label: 'Kariyer' },
  { value: '/iletisim', label: 'İletişim' },
  { value: '/galeri', label: 'Galeri' },
];

// Local slide state with file support
interface LocalHeroSlide extends Omit<HeroSlide, 'image'> {
  image: string;
  imageFile?: File | null;
  isNew?: boolean;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export default function AdminAyarlarPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [heroSlides, setHeroSlides] = useState<LocalHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'stats' | 'social' | 'hero'>('general');
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Veriyi çek
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsApi.get();
      setSettings(data);
      // Hero slides'ı local state'e kopyala
      setHeroSlides(
        data.heroSlides.map(slide => ({ 
          ...slide, 
          imageFile: null, 
          isNew: false,
          isSaving: false,
          hasChanges: false
        }))
      );
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      setError('Ayarlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Genel ayarları kaydet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    try {
      // Hero slides hariç ayarları güncelle
      const { heroSlides: _, ...settingsWithoutHero } = settings;
      await settingsApi.update(settingsWithoutHero);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Ayarlar kaydedilemedi!');
    } finally {
      setSaving(false);
    }
  };

  // ==================== HERO SLIDE İŞLEMLERİ ====================

  // Yeni slide ekle (local state'e)
  const addHeroSlide = () => {
    const newSlide: LocalHeroSlide = {
      title: '',
      subtitle: '',
      description: '',
      image: '',
      ctaText: '',
      ctaLink: '/projeler',
      imageFile: null,
      isNew: true,
      isSaving: false,
      hasChanges: true,
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  // Yeni slide'ı API'ye kaydet
  const createHeroSlide = async (index: number) => {
    const slide = heroSlides[index];
    
    if (!slide.title.trim()) {
      setError('Lütfen bir başlık girin');
      return;
    }

    setHeroSlides(slides => 
      slides.map((s, i) => i === index ? { ...s, isSaving: true } : s)
    );
    setError(null);

    try {
      const updatedSettings = await settingsApi.addHeroSlide({
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
        image: slide.imageFile || undefined,
      });
      setSettings(updatedSettings);
      setHeroSlides(
        updatedSettings.heroSlides.map(s => ({ 
          ...s, 
          imageFile: null, 
          isNew: false,
          isSaving: false,
          hasChanges: false
        }))
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to create hero slide:', err);
      setError('Slide oluşturulamadı!');
      setHeroSlides(slides => 
        slides.map((s, i) => i === index ? { ...s, isSaving: false } : s)
      );
    }
  };

  // Slide sil
  const removeHeroSlide = async (index: number) => {
    const slide = heroSlides[index];
    
    // Yeni eklenen ama henüz kaydedilmemiş slide'ı direkt kaldır
    if (slide.isNew || !slide.id) {
      setHeroSlides(heroSlides.filter((_, i) => i !== index));
      return;
    }

    if (!confirm('Bu slide\'ı silmek istediğinizden emin misiniz?')) return;

    setHeroSlides(slides => 
      slides.map((s, i) => i === index ? { ...s, isSaving: true } : s)
    );

    try {
      await settingsApi.deleteHeroSlide(slide.id);
      await fetchSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to delete hero slide:', err);
      setError('Slide silinemedi!');
      setHeroSlides(slides => 
        slides.map((s, i) => i === index ? { ...s, isSaving: false } : s)
      );
    }
  };

  // Yeni slide eklemeyi iptal et
  const cancelNewSlide = (index: number) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== index));
  };

  // Slide alanını güncelle (local)
  const updateHeroSlide = (index: number, field: keyof LocalHeroSlide, value: string | File | null) => {
    setHeroSlides(slides => 
      slides.map((slide, i) =>
        i === index ? { ...slide, [field]: value, hasChanges: true } : slide
      )
    );
  };

  // Görsel seç
  const handleImageSelect = (index: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setHeroSlides(slides => 
      slides.map((slide, i) =>
        i === index ? { ...slide, image: previewUrl, imageFile: file, hasChanges: true } : slide
      )
    );
  };

  // Mevcut slide'ı güncelle
  const saveHeroSlide = async (index: number) => {
    const slide = heroSlides[index];
    if (!slide.id) return;

    if (!slide.title.trim()) {
      setError('Lütfen bir başlık girin');
      return;
    }

    setHeroSlides(slides => 
      slides.map((s, i) => i === index ? { ...s, isSaving: true } : s)
    );
    setError(null);

    try {
      await settingsApi.updateHeroSlide(slide.id, {
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
        order: slide.order,
        image: slide.imageFile || undefined,
      });
      await fetchSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to update hero slide:', err);
      setError('Slide güncellenemedi!');
      setHeroSlides(slides => 
        slides.map((s, i) => i === index ? { ...s, isSaving: false } : s)
      );
    }
  };

  // Slide sırasını değiştir (yukarı/aşağı)
  const moveHeroSlide = async (index: number, direction: 'up' | 'down') => {
    const slide = heroSlides[index];
    if (!slide.id || slide.isNew) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroSlides.length) return;

    setHeroSlides(slides => 
      slides.map((s, i) => i === index ? { ...s, isSaving: true } : s)
    );

    try {
      await settingsApi.updateHeroSlide(slide.id, { order: newIndex });
      await fetchSettings();
    } catch (err) {
      console.error('Failed to reorder slide:', err);
      setError('Sıralama değiştirilemedi!');
      setHeroSlides(slides => 
        slides.map((s, i) => i === index ? { ...s, isSaving: false } : s)
      );
    }
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="text-red-500" size={40} />
        <p className="text-gray-600">Ayarlar yüklenemedi</p>
        <button onClick={fetchSettings} className="btn btn-primary">
          Tekrar Dene
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler' },
    { id: 'about', label: 'Hakkımızda' },
    { id: 'stats', label: 'İstatistikler' },
    { id: 'social', label: 'Sosyal Medya' },
    { id: 'hero', label: 'Ana Sayfa Slider' },
  ];

  // Kaydedilmiş slide sayısı
  const savedSlidesCount = heroSlides.filter(s => !s.isNew).length;
  // Yeni slide var mı?
  const hasNewSlide = heroSlides.some(s => s.isNew);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Site Ayarları</h1>
        <p className="text-gray-600">Genel site ayarlarını düzenleyin</p>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
          >
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-700">Başarıyla kaydedildi!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Saatleri</label>
                <input
                  type="text"
                  value={settings.workingHours}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hakkımızda Metni</label>
              <textarea
                value={settings.aboutText}
                onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                rows={4}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Misyon</label>
              <textarea
                value={settings.missionText}
                onChange={(e) => setSettings({ ...settings, missionText: e.target.value })}
                rows={3}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vizyon</label>
              <textarea
                value={settings.visionText}
                onChange={(e) => setSettings({ ...settings, visionText: e.target.value })}
                rows={3}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Statistics */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yıllık Deneyim</label>
                <input
                  type="number"
                  value={settings.stats.experience}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stats: { ...settings.stats, experience: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Devam Eden Proje</label>
                <input
                  type="number"
                  value={settings.stats.ongoingProjects}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stats: { ...settings.stats, ongoingProjects: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamamlanan Proje</label>
                <input
                  type="number"
                  value={settings.stats.completedProjects}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stats: { ...settings.stats, completedProjects: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={settings.socialMedia.facebook}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                    })
                  }
                  className="w-full"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={settings.socialMedia.instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                    })
                  }
                  className="w-full"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={settings.socialMedia.linkedin}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, linkedin: e.target.value },
                    })
                  }
                  className="w-full"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={settings.socialMedia.twitter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, twitter: e.target.value },
                    })
                  }
                  className="w-full"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Hero Slides */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {/* Info banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Ana Sayfa Slider Yönetimi</h4>
                  <p className="text-sm text-blue-700">
                    Ana sayfada gösterilecek slider görsellerini buradan yönetebilirsiniz. 
                    {savedSlidesCount > 0 && ` Şu an ${savedSlidesCount} slide kayıtlı.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Mevcut Slide'lar */}
            {heroSlides.filter(s => !s.isNew).map((slide, index) => (
              <motion.div 
                key={slide.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${slide.isSaving ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <GripVertical className="text-gray-300" size={20} />
                    <span className="font-semibold text-dark">Slide {index + 1}</span>
                    {slide.hasChanges && !slide.isSaving && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        Kaydedilmedi
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Sıralama butonları */}
                    <button
                      type="button"
                      onClick={() => moveHeroSlide(index, 'up')}
                      disabled={index === 0 || slide.isSaving}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Yukarı taşı"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveHeroSlide(index, 'down')}
                      disabled={index === heroSlides.filter(s => !s.isNew).length - 1 || slide.isSaving}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Aşağı taşı"
                    >
                      <ArrowDown size={16} />
                    </button>
                    
                    <div className="w-px h-6 bg-gray-200 mx-2" />
                    
                    {/* Kaydet butonu */}
                    <button
                      type="button"
                      onClick={() => saveHeroSlide(index)}
                      disabled={slide.isSaving}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                        slide.hasChanges 
                          ? 'bg-primary text-dark hover:bg-primary/90 shadow-sm' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {slide.isSaving ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      Kaydet
                    </button>
                    
                    {/* Sil butonu */}
                    <button
                      type="button"
                      onClick={() => removeHeroSlide(index)}
                      disabled={slide.isSaving}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Görsel Yükleme */}
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arka Plan Görseli
                      </label>
                      <div className="space-y-3">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                          {slide.image ? (
                            <img 
                              src={slide.imageFile ? slide.image : getFileUrl(slide.image)} 
                              alt="Slide preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                              <ImageIcon size={32} />
                              <span className="text-xs">Görsel yok</span>
                            </div>
                          )}
                        </div>
                        <input
                          ref={el => { fileInputRefs.current[index] = el }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageSelect(index, file);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2 text-gray-600 text-sm font-medium"
                        >
                          <Upload size={16} />
                          {slide.image ? 'Değiştir' : 'Görsel Yükle'}
                        </button>
                        {slide.imageFile && (
                          <p className="text-xs text-green-600 text-center flex items-center justify-center gap-1">
                            <CheckCircle size={12} />
                            Yeni görsel seçildi
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Form alanları */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Üst Başlık <span className="text-gray-400 font-normal">(opsiyonel)</span>
                          </label>
                          <input
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                            className="w-full"
                            placeholder="KURUMSAL"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ana Başlık <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                            className="w-full"
                            placeholder="Güvenle İnşa Ediyoruz"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama
                        </label>
                        <textarea
                          value={slide.description}
                          onChange={(e) => updateHeroSlide(index, 'description', e.target.value)}
                          className="w-full"
                          rows={2}
                          placeholder="Slide açıklaması..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buton Metni
                          </label>
                          <input
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => updateHeroSlide(index, 'ctaText', e.target.value)}
                            className="w-full"
                            placeholder="Detaylı Bilgi"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center gap-1.5">
                              <LinkIcon size={14} />
                              Buton Linki
                            </span>
                          </label>
                          <select
                            value={slide.ctaLink}
                            onChange={(e) => updateHeroSlide(index, 'ctaLink', e.target.value)}
                            className="w-full"
                          >
                            <option value="">Link seçin...</option>
                            {PAGE_LINKS.map(link => (
                              <option key={link.value} value={link.value}>
                                {link.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Yeni Slide Form */}
            {heroSlides.filter(s => s.isNew).map((slide, i) => {
              const actualIndex = heroSlides.findIndex(s => s === slide);
              return (
                <motion.div 
                  key={`new-${i}`}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-primary/30"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-primary/10 border-b border-primary/20">
                    <div className="flex items-center gap-3">
                      <Plus className="text-primary" size={20} />
                      <span className="font-semibold text-dark">Yeni Slide Oluştur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => cancelNewSlide(actualIndex)}
                        disabled={slide.isSaving}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <X size={14} />
                        İptal
                      </button>
                      <button
                        type="button"
                        onClick={() => createHeroSlide(actualIndex)}
                        disabled={slide.isSaving || !slide.title.trim()}
                        className="px-4 py-2 bg-primary text-dark text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {slide.isSaving ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Save size={14} />
                        )}
                        Oluştur
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Görsel Yükleme */}
                      <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Arka Plan Görseli
                        </label>
                        <div className="space-y-3">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                            {slide.image ? (
                              <img 
                                src={slide.image} 
                                alt="Slide preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                <Upload size={32} />
                                <span className="text-xs">Görsel seçin</span>
                              </div>
                            )}
                          </div>
                          <input
                            ref={el => { fileInputRefs.current[actualIndex] = el }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageSelect(actualIndex, file);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[actualIndex]?.click()}
                            className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Upload size={16} />
                            {slide.image ? 'Değiştir' : 'Görsel Seç'}
                          </button>
                        </div>
                      </div>

                      {/* Form alanları */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Üst Başlık <span className="text-gray-400 font-normal">(opsiyonel)</span>
                            </label>
                            <input
                              type="text"
                              value={slide.subtitle}
                              onChange={(e) => updateHeroSlide(actualIndex, 'subtitle', e.target.value)}
                              className="w-full"
                              placeholder="KURUMSAL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ana Başlık <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => updateHeroSlide(actualIndex, 'title', e.target.value)}
                              className="w-full"
                              placeholder="Güvenle İnşa Ediyoruz"
                              autoFocus
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama
                          </label>
                          <textarea
                            value={slide.description}
                            onChange={(e) => updateHeroSlide(actualIndex, 'description', e.target.value)}
                            className="w-full"
                            rows={2}
                            placeholder="Slide açıklaması..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Buton Metni
                            </label>
                            <input
                              type="text"
                              value={slide.ctaText}
                              onChange={(e) => updateHeroSlide(actualIndex, 'ctaText', e.target.value)}
                              className="w-full"
                              placeholder="Detaylı Bilgi"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <span className="flex items-center gap-1.5">
                                <LinkIcon size={14} />
                                Buton Linki
                              </span>
                            </label>
                            <select
                              value={slide.ctaLink}
                              onChange={(e) => updateHeroSlide(actualIndex, 'ctaLink', e.target.value)}
                              className="w-full"
                            >
                              <option value="">Link seçin...</option>
                              {PAGE_LINKS.map(link => (
                                <option key={link.value} value={link.value}>
                                  {link.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Yeni Slide Ekle butonu */}
            {!hasNewSlide && (
              <motion.button
                type="button"
                onClick={addHeroSlide}
                disabled={saving}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Plus size={20} />
                </div>
                <span className="font-medium">Yeni Slide Ekle</span>
              </motion.button>
            )}

            {/* Boş state */}
            {heroSlides.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Henüz slide eklenmemiş</h3>
                <p className="text-gray-500 mb-6">Ana sayfada gösterilecek slider görsellerini ekleyin</p>
                <button
                  type="button"
                  onClick={addHeroSlide}
                  className="btn btn-primary"
                >
                  <Plus size={18} />
                  İlk Slide'ı Ekle
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit Button - Sadece hero tab'ında değilse göster */}
        {activeTab !== 'hero' && (
          <div className="flex justify-end mt-6">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Ayarları Kaydet
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
