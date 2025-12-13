'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Newspaper, Briefcase, Eye, TrendingUp, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { projectsApi, newsApi, careersApi, type Project, type News, type Career, getFileUrl } from '@/lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState({
    projects: 0,
    news: 0,
    careers: 0,
    activeProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsData, newsData, careersData] = await Promise.all([
          projectsApi.getAll(),
          newsApi.getAll(),
          careersApi.getAll(),
        ]);

        setStats({
          projects: projectsData.length,
          news: newsData.length,
          careers: careersData.filter((c: Career) => c.isActive).length,
          activeProjects: projectsData.filter((p: Project) => p.category === 'devam-eden').length,
        });

        setRecentProjects(projectsData.slice(0, 3));
        setRecentNews(newsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    { label: 'Toplam Proje', value: stats.projects, icon: Building2, color: 'bg-blue-500', link: '/admin/projeler' },
    { label: 'Aktif Proje', value: stats.activeProjects, icon: TrendingUp, color: 'bg-green-500', link: '/admin/projeler' },
    { label: 'Haberler', value: stats.news, icon: Newspaper, color: 'bg-purple-500', link: '/admin/haberler' },
    { label: 'Kariyer İlanı', value: stats.careers, icon: Briefcase, color: 'bg-orange-500', link: '/admin/kariyer' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz! Site yönetim panelinize genel bakış.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.link} className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-dark mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-dark">Son Projeler</h2>
            <Link href="/admin/projeler" className="text-primary hover:underline text-sm flex items-center gap-1">
              Tümünü Gör <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <img
                  src={getFileUrl(project.image) || 'https://via.placeholder.com/80'}
                  alt={project.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark truncate">{project.title}</p>
                  <p className="text-sm text-gray-500">{project.location}</p>
                </div>
                <span
                  className={`badge ${
                    project.category === 'devam-eden' ? 'badge-primary' : 'badge-success'
                  }`}
                >
                  {project.category === 'devam-eden' ? 'Devam' : 'Tamamlandı'}
                </span>
              </div>
            ))}
            {recentProjects.length === 0 && (
              <p className="text-center text-gray-500 py-4">Henüz proje eklenmemiş.</p>
            )}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-dark">Son Haberler</h2>
            <Link href="/admin/haberler" className="text-primary hover:underline text-sm flex items-center gap-1">
              Tümünü Gör <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentNews.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <img
                  src={getFileUrl(item.image) || 'https://via.placeholder.com/80'}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark truncate">{item.title}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
            {recentNews.length === 0 && (
              <p className="text-center text-gray-500 py-4">Henüz haber eklenmemiş.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/projeler"
          className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
        >
          <Building2 size={28} className="mb-3" />
          <h3 className="font-semibold text-lg">Yeni Proje Ekle</h3>
          <p className="text-white/80 text-sm mt-1">Projelerinizi yönetin</p>
        </Link>
        <Link
          href="/admin/haberler"
          className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
        >
          <Newspaper size={28} className="mb-3" />
          <h3 className="font-semibold text-lg">Haber Yayınla</h3>
          <p className="text-white/80 text-sm mt-1">Güncel haberleri paylaşın</p>
        </Link>
        <Link
          href="/admin/ayarlar"
          className="bg-gradient-to-br from-gray-700 to-gray-900 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
        >
          <Eye size={28} className="mb-3" />
          <h3 className="font-semibold text-lg">Site Ayarları</h3>
          <p className="text-white/80 text-sm mt-1">Genel ayarları düzenleyin</p>
        </Link>
      </div>
    </div>
  );
}
