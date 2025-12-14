'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Loader2, Upload } from 'lucide-react';
import { newsApi, type News, type CreateNewsDto, getFileUrl, getToken } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

export default function AdminHaberlerPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateNewsDto>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    date: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await newsApi.getAll();
      setNews(data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item?: News) => {
    if (item) {
      setEditingNews(item);
      setFormData({
        title: item.title,
        content: item.content,
        excerpt: item.excerpt,
        image: item.image,
        date: item.date,
      });
      setImagePreview(item.image ? getFileUrl(item.image) : '');
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
      });
      setImagePreview('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = formData.image;

      // Yeni görsel yüklenmişse önce upload et
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('folder', 'news');

        const token = getToken();
        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.url;
        }
      }

      // Image boşsa placeholder kullan
      const dataToSend = {
        ...formData,
        image: imageUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      };

      if (editingNews) {
        await newsApi.update(editingNews.id, dataToSend);
      } else {
        await newsApi.create(dataToSend);
      }
      await fetchNews();
      closeModal();
    } catch (error) {
      console.error('Failed to save news:', error);
      alert('Haber kaydedilemedi!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) return;

    try {
      await newsApi.delete(id);
      await fetchNews();
    } catch (error) {
      console.error('Failed to delete news:', error);
      alert('Haber silinemedi!');
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
          <h1 className="text-2xl font-bold text-slate-800">Haberler</h1>
          <p className="text-slate-500">Tüm haberleri yönetin</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus size={18} />
          Yeni Haber Ekle
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Haber ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left p-4 font-medium text-slate-600">Haber</th>
                <th className="text-left p-4 font-medium text-slate-600">Tarih</th>
                <th className="text-right p-4 font-medium text-slate-600">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNews.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getFileUrl(item.image) || 'https://via.placeholder.com/100'}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{item.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">{item.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Haber bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Görsel */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Haber Görseli
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
                        onClick={() => { setImageFile(null); setImagePreview(''); setFormData({ ...formData, image: '' }); }}
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full"
                  placeholder="Haber başlığı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Özet</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  rows={2}
                  className="w-full"
                  placeholder="Kısa özet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">İçerik</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={6}
                  className="w-full"
                  placeholder="Haber içeriği..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : editingNews ? (
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
