'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Search, X, Loader2, Pencil, 
  GripVertical, ExternalLink, Eye, EyeOff, Upload, Image as ImageIcon
} from 'lucide-react';
import { referencesApi, type Reference, galleryApi, type GalleryItem, getFileUrl } from '@/lib/api';

export default function AdminReferanslarPage() {
  // State tanımlamaları
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<Reference | null>(null);
  
  // Gallery items for logo selection
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    description: '',
    order: 0,
    isActive: true,
  });

  // Referansları getir
  const fetchReferences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await referencesApi.getAll(true); // Admin için tümünü getir
      setReferences(data);
    } catch (error) {
      console.error('Referanslar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  // Galeri öğelerini getir
  const fetchGalleryItems = async () => {
    try {
      setGalleryLoading(true);
      const data = await galleryApi.getAll({ type: 'image' });
      setGalleryItems(data);
    } catch (error) {
      console.error('Galeri yüklenemedi:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Filtrelenmiş referanslar
  const filteredReferences = references.filter((ref) =>
    ref.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal aç - Yeni ekleme
  const openNewModal = () => {
    setEditingRef(null);
    setFormData({
      name: '',
      logo: '',
      website: '',
      description: '',
      order: references.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Modal aç - Düzenleme
  const openEditModal = (ref: Reference) => {
    setEditingRef(ref);
    setFormData({
      name: ref.name,
      logo: ref.logo,
      website: ref.website || '',
      description: ref.description || '',
      order: ref.order,
      isActive: ref.isActive,
    });
    setIsModalOpen(true);
  };

  // Modal kapat
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRef(null);
  };

  // Galeri modal aç
  const openGalleryModal = () => {
    fetchGalleryItems();
    setIsGalleryOpen(true);
  };

  // Logo seç
  const selectLogo = (url: string) => {
    setFormData({ ...formData, logo: url });
    setIsGalleryOpen(false);
  };

  // Bilgisayardan logo yükle
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Sadece resim dosyalarını kabul et
    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin!');
      return;
    }

    try {
      setUploading(true);
      // Galeri API'si ile yükle
      const uploadedItem = await galleryApi.upload(file, 'Referans logosu', 'referans');
      // Yüklenen dosyanın URL'ini form'a ekle
      setFormData({ ...formData, logo: uploadedItem.url });
    } catch (error) {
      console.error('Logo yükleme hatası:', error);
      alert('Logo yüklenemedi!');
    } finally {
      setUploading(false);
      // Input'u sıfırla
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Kaydet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.logo.trim()) {
      alert('Firma adı ve logo zorunludur!');
      return;
    }

    try {
      setSaving(true);
      
      if (editingRef) {
        // Güncelle
        await referencesApi.update(editingRef.id, formData);
      } else {
        // Yeni oluştur
        await referencesApi.create(formData);
      }
      
      await fetchReferences();
      closeModal();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kaydetme başarısız!');
    } finally {
      setSaving(false);
    }
  };

  // Sil
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu referansı silmek istediğinizden emin misiniz?')) return;

    try {
      await referencesApi.delete(id);
      await fetchReferences();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme başarısız!');
    }
  };

  // Aktif/Pasif toggle
  const toggleActive = async (ref: Reference) => {
    try {
      await referencesApi.update(ref.id, { isActive: !ref.isActive });
      await fetchReferences();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Referanslar</h1>
          <p className="text-slate-500">İş ortaklarınızın logolarını yönetin ({references.length} referans)</p>
        </div>
        <button onClick={openNewModal} className="btn btn-primary">
          <Plus size={18} />
          Yeni Referans
        </button>
      </div>

      {/* Arama */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Referans ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* Referans Listesi */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredReferences.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 mb-4">Henüz referans eklenmemiş.</p>
          <button onClick={openNewModal} className="btn btn-primary">
            <Plus size={18} />
            İlk Referansı Ekle
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid gap-0 divide-y divide-slate-100">
            <AnimatePresence>
              {filteredReferences.map((ref) => (
                <motion.div
                  key={ref.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Sıralama tutacağı */}
                  <div className="text-slate-300 cursor-grab">
                    <GripVertical size={20} />
                  </div>
                  
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src={getFileUrl(ref.logo)} 
                      alt={ref.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  
                  {/* Bilgiler */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{ref.name}</h3>
                    {ref.website && (
                      <a 
                        href={ref.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        {ref.website}
                      </a>
                    )}
                  </div>
                  
                  {/* Durum badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ref.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {ref.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  
                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(ref)}
                      className={`p-2 rounded-lg transition-colors ${
                        ref.isActive 
                          ? 'text-slate-400 hover:bg-slate-100' 
                          : 'text-green-500 hover:bg-green-50'
                      }`}
                      title={ref.isActive ? 'Pasife Al' : 'Aktife Al'}
                    >
                      {ref.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => openEditModal(ref)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(ref.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Referans Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingRef ? 'Referans Düzenle' : 'Yeni Referans'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Logo Seçimi */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Logo *</label>
                <div className="flex items-center gap-4">
                  {/* Logo önizleme */}
                  {formData.logo ? (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden relative group">
                      <img 
                        src={getFileUrl(formData.logo)} 
                        alt="Seçilen logo"
                        className="w-full h-full object-contain p-2"
                      />
                      {/* Logo silme butonu */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X size={20} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center">
                      {uploading ? (
                        <Loader2 size={24} className="text-primary animate-spin" />
                      ) : (
                        <ImageIcon size={24} className="text-slate-400" />
                      )}
                    </div>
                  )}
                  
                  {/* Butonlar */}
                  <div className="flex flex-col gap-2">
                    {/* Bilgisayardan yükle */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-primary"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                    </button>
                    
                    {/* Galeriden seç */}
                    <button
                      type="button"
                      onClick={openGalleryModal}
                      className="btn btn-outline"
                      disabled={uploading}
                    >
                      <ImageIcon size={16} />
                      Galeriden Seç
                    </button>
                  </div>
                  
                  {/* Gizli file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Firma Adı */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Firma Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                  placeholder="Örn: ABC İnşaat"
                  required
                />
              </div>

              {/* Web Sitesi */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Web Sitesi</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full"
                  placeholder="https://example.com"
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full"
                  rows={3}
                  placeholder="Firma hakkında kısa bilgi..."
                />
              </div>

              {/* Aktif/Pasif */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Sitede göster
                </label>
              </div>

              {/* Butonlar */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                  {editingRef ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Galeri Seçim Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">Logo Seç</h2>
              <button onClick={() => setIsGalleryOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {galleryLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : galleryItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-500">Galeriye henüz görsel eklenmemiş.</p>
                  <p className="text-sm text-slate-400 mt-2">Önce Galeri sayfasından görsel yükleyin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {galleryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectLogo(item.url)}
                      className={`aspect-square rounded-xl bg-slate-100 overflow-hidden border-2 transition-all hover:border-primary ${
                        formData.logo === item.url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={getFileUrl(item.url)} 
                        alt=""
                        className="w-full h-full object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

