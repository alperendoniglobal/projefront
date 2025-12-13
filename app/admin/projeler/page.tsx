'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { projectsApi, type Project, type CreateProjectData, getFileUrl } from '@/lib/api';

export default function AdminProjelerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'devam-eden' as 'devam-eden' | 'tamamlanan',
    location: '',
    year: '',
    details: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'devam-eden',
      location: '',
      year: new Date().getFullYear().toString(),
      details: '',
    });
    setImageFile(null);
    setImagePreview('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        location: project.location,
        year: project.year,
        details: project.details || '',
      });
      setImagePreview(project.image ? getFileUrl(project.image) : '');
      setGalleryPreviews(project.gallery?.map(g => getFileUrl(g)) || []);
    } else {
      setEditingProject(null);
      resetForm();
      setFormData(prev => ({ ...prev, year: new Date().getFullYear().toString() }));
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    resetForm();
  };

  // Image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data: CreateProjectData = {
        ...formData,
        image: imageFile,
        gallery: galleryFiles.length > 0 ? galleryFiles : undefined,
      };

      if (editingProject) {
        await projectsApi.update(editingProject.id, {
          ...data,
          replaceGallery: galleryFiles.length > 0,
        });
      } else {
        await projectsApi.create(data);
      }
      
      await fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Proje kaydedilemedi! ' + (error instanceof Error ? error.message : ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;

    try {
      await projectsApi.delete(id);
      await fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Proje silinemedi!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projeler</h1>
          <p className="text-slate-500">Tüm projeleri yönetin</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus size={18} />
          Yeni Proje Ekle
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Proje ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 group hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={getFileUrl(project.image) || 'https://via.placeholder.com/400x200'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                  project.category === 'devam-eden'
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {project.category === 'devam-eden' ? 'Devam Eden' : 'Tamamlanan'}
              </span>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-semibold text-lg truncate">{project.title}</h3>
                <p className="text-white/80 text-sm">{project.location} • {project.year}</p>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="text-slate-500 text-sm line-clamp-1 flex-1">{project.description}</p>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => openModal(project)}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Proje bulunamadı.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingProject ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Ana Görsel */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ana Görsel
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-slate-800 rounded-lg text-sm font-medium"
                      >
                        Değiştir
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Upload size={28} className="text-slate-400" />
                    <span className="text-sm text-slate-500">Görsel Seç</span>
                    <span className="text-xs text-slate-400">PNG, JPG - Max 10MB</span>
                  </button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Proje Adı</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full"
                    placeholder="Örn: Ankara Konut Projesi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lokasyon</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full"
                    placeholder="Örn: Ankara, Çankaya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Yıl</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    className="w-full"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Durum</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'devam-eden' | 'tamamlanan' })}
                    className="w-full"
                  >
                    <option value="devam-eden">Devam Eden</option>
                    <option value="tamamlanan">Tamamlanan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kısa Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={2}
                  className="w-full"
                  placeholder="Proje hakkında kısa bir açıklama..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Detaylı Açıklama</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={4}
                  className="w-full"
                  placeholder="Proje detayları..."
                />
              </div>

              {/* Galeri */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Galeri Görselleri ({galleryPreviews.length} adet)
                </label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Plus size={24} className="text-slate-400" />
                    <span className="text-xs text-slate-400">Ekle</span>
                  </button>
                </div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGallerySelect}
                  className="hidden"
                />
                <p className="text-xs text-slate-400">Birden fazla görsel seçebilirsiniz. Maks 20 adet.</p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : editingProject ? (
                    'Güncelle'
                  ) : (
                    'Ekle'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
