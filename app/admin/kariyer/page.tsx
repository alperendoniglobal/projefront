'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Loader2 } from 'lucide-react';
import { careersApi, type Career, type CreateCareerDto } from '@/lib/api';

export default function AdminKariyerPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'tam-zamanli' as 'tam-zamanli' | 'yari-zamanli' | 'staj',
    description: '',
    requirements: '',
    isActive: true,
  });

  const fetchCareers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await careersApi.getAll();
      setCareers(data);
    } catch (error) {
      console.error('Failed to fetch careers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  const filteredCareers = careers.filter(
    (career) =>
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (career?: Career) => {
    if (career) {
      setEditingCareer(career);
      setFormData({
        title: career.title,
        department: career.department,
        location: career.location,
        type: career.type,
        description: career.description,
        requirements: career.requirements.join('\n'),
        isActive: career.isActive,
      });
    } else {
      setEditingCareer(null);
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'tam-zamanli',
        description: '',
        requirements: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCareer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data: CreateCareerDto = {
        ...formData,
        requirements: formData.requirements.split('\n').filter((r) => r.trim()),
      };

      if (editingCareer) {
        await careersApi.update(editingCareer.id, data);
      } else {
        await careersApi.create(data);
      }
      await fetchCareers();
      closeModal();
    } catch (error) {
      console.error('Failed to save career:', error);
      alert('İlan kaydedilemedi!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return;

    try {
      await careersApi.delete(id);
      await fetchCareers();
    } catch (error) {
      console.error('Failed to delete career:', error);
      alert('İlan silinemedi!');
    }
  };

  const toggleActive = async (career: Career) => {
    try {
      await careersApi.toggleActive(career.id, !career.isActive);
      await fetchCareers();
    } catch (error) {
      console.error('Failed to toggle career status:', error);
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
          <h1 className="text-2xl font-bold text-dark">Kariyer İlanları</h1>
          <p className="text-gray-600">Tüm kariyer ilanlarını yönetin</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus size={18} />
          Yeni İlan Ekle
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="İlan ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12"
          />
        </div>
      </div>

      {/* Careers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Pozisyon</th>
                <th className="text-left p-4 font-medium text-gray-600">Departman</th>
                <th className="text-left p-4 font-medium text-gray-600">Lokasyon</th>
                <th className="text-left p-4 font-medium text-gray-600">Tip</th>
                <th className="text-left p-4 font-medium text-gray-600">Durum</th>
                <th className="text-right p-4 font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCareers.map((career) => (
                <motion.tr
                  key={career.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="p-4">
                    <p className="font-medium text-dark">{career.title}</p>
                  </td>
                  <td className="p-4 text-gray-600">{career.department}</td>
                  <td className="p-4 text-gray-600">{career.location}</td>
                  <td className="p-4">
                    <span className="badge badge-secondary">
                      {career.type === 'tam-zamanli'
                        ? 'Tam Zamanlı'
                        : career.type === 'yari-zamanli'
                        ? 'Yarı Zamanlı'
                        : 'Staj'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(career)}
                      className={`badge cursor-pointer ${
                        career.isActive ? 'badge-success' : 'badge-secondary'
                      }`}
                    >
                      {career.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(career)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(career.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">İlan bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-dark">
                {editingCareer ? 'İlan Düzenle' : 'Yeni İlan Ekle'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pozisyon</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departman</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasyon</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Tipi</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'tam-zamanli' | 'yari-zamanli' | 'staj',
                      })
                    }
                    className="w-full"
                  >
                    <option value="tam-zamanli">Tam Zamanlı</option>
                    <option value="yari-zamanli">Yarı Zamanlı</option>
                    <option value="staj">Staj</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif İlan</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gereksinimler (Her satıra bir madde)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  className="w-full"
                  placeholder="İnşaat Mühendisliği mezunu&#10;En az 5 yıl deneyim&#10;B sınıfı ehliyet"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : editingCareer ? (
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
