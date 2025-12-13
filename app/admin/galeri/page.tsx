'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Search, X, Loader2, Upload, Image as ImageIcon, 
  Check, Filter, Pencil, Video, FolderPlus
} from 'lucide-react';
import { galleryApi, type GalleryItem, getFileUrl } from '@/lib/api';

const CATEGORIES = [
  { value: 'proje', label: 'Proje' },
  { value: 'haber', label: 'Haber' },
  { value: 'ekip', label: 'Ekip' },
  { value: 'genel', label: 'Genel' },
];

export default function AdminGaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState<'image' | 'video' | ''>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploadCategory, setUploadCategory] = useState('genel');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await galleryApi.getAll({
        type: filterType || undefined,
        category: filterCategory || undefined,
      });
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterType]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter((item) =>
    item.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleUpload(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await handleUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    // Filter valid files
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length === 0) {
      alert('Geçersiz dosya formatı! Sadece resim ve video yükleyebilirsiniz.');
      return;
    }

    if (validFiles.length > 20) {
      alert('Tek seferde maksimum 20 dosya yükleyebilirsiniz!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await galleryApi.uploadMultiple(validFiles, uploadCategory);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      await fetchItems();
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Yükleme başarısız! ' + (error instanceof Error ? error.message : ''));
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedItems.size === 0) return;
    
    if (!window.confirm(`${selectedItems.size} öğeyi silmek istediğinizden emin misiniz?`)) return;

    try {
      await galleryApi.deleteMultiple(Array.from(selectedItems));
      setSelectedItems(new Set());
      await fetchItems();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Silme başarısız!');
    }
  };

  const deleteSingle = async (id: string) => {
    if (!window.confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;

    try {
      await galleryApi.delete(id);
      await fetchItems();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Silme başarısız!');
    }
  };

  // Edit modal
  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await galleryApi.update(editingItem.id, {
        alt: editingItem.alt,
        category: editingItem.category,
      });
      await fetchItems();
      closeEditModal();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Güncelleme başarısız!');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Galeri</h1>
          <p className="text-slate-500">Fotoğraf ve videoları yönetin ({items.length} öğe)</p>
        </div>
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <button onClick={deleteSelected} className="btn btn-danger">
              <Trash2 size={18} />
              {selectedItems.size} Öğeyi Sil
            </button>
          )}
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary">
            <Plus size={18} />
            Yükle
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 mb-6 text-center transition-all
          ${isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-slate-300 hover:border-primary/50 bg-white'
          }
        `}
      >
        {uploading ? (
          <div className="space-y-4">
            <Loader2 size={40} className="mx-auto text-primary animate-spin" />
            <p className="text-slate-600">Yükleniyor... %{uploadProgress}</p>
            <div className="w-full max-w-xs mx-auto bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <Upload size={40} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-2">
              Dosyaları sürükle bırak veya{' '}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-primary font-medium hover:underline"
              >
                seç
              </button>
            </p>
            <p className="text-sm text-slate-400">PNG, JPG, WEBP, GIF, MP4, WEBM - Maks 20 dosya, 50MB</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <label className="text-sm text-slate-500">Kategori:</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="text-sm border-slate-200 rounded-lg py-1 px-2"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border-slate-200 rounded-xl bg-slate-50"
          >
            <option value="">Tüm Kategoriler</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'image' | 'video' | '')}
            className="border-slate-200 rounded-xl bg-slate-50"
          >
            <option value="">Tümü</option>
            <option value="image">Fotoğraflar</option>
            <option value="video">Videolar</option>
          </select>
        </div>
        {filteredItems.length > 0 && (
          <button 
            onClick={selectAll}
            className="text-sm text-primary hover:underline"
          >
            {selectedItems.size === filteredItems.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Galeri boş. Yüklemek için yukarıdaki alana dosya sürükleyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`
                  relative aspect-square rounded-xl overflow-hidden group cursor-pointer
                  border-2 transition-colors
                  ${selectedItems.has(item.id) ? 'border-primary' : 'border-transparent'}
                `}
                onClick={() => toggleSelect(item.id)}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <Video size={32} className="text-white" />
                  </div>
                ) : (
                  <img
                    src={getFileUrl(item.url)}
                    alt={item.alt || ''}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Selection indicator */}
                <div className={`
                  absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${selectedItems.has(item.id) 
                    ? 'bg-primary border-primary' 
                    : 'bg-white/80 border-slate-300 opacity-0 group-hover:opacity-100'
                  }
                `}>
                  {selectedItems.has(item.id) && <Check size={14} className="text-white" />}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                    className="p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Pencil size={16} className="text-slate-700" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSingle(item.id); }}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>

                {/* Category badge */}
                {item.category && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 rounded text-white text-xs">
                    {item.category}
                  </div>
                )}

                {/* Type indicator */}
                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 p-1 bg-black/70 rounded">
                    <Video size={14} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">Düzenle</h2>
              <button onClick={closeEditModal} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateItem} className="p-6 space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                {editingItem.type === 'video' ? (
                  <video src={getFileUrl(editingItem.url)} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={getFileUrl(editingItem.url)} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama (Alt)</label>
                <input
                  type="text"
                  value={editingItem.alt || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, alt: e.target.value })}
                  className="w-full"
                  placeholder="Görsel açıklaması..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                <select
                  value={editingItem.category || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full"
                >
                  <option value="">Kategori Yok</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeEditModal} className="btn btn-outline">
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kaydet
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
