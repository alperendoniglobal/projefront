'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Newspaper, 
  Briefcase, 
  ArrowRight, 
  ArrowUpRight,
  Loader2, 
  Plus,
  Users,
  ImageIcon,
  Settings,
  Clock,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Palette,
  Globe,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { projectsApi, newsApi, careersApi, type Project, type News, type Career, getFileUrl } from '@/lib/api';

export default function AdminPage() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsData, newsData] = await Promise.all([
          projectsApi.getAll(),
          newsApi.getAll(),
        ]);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Kullanım kılavuzu kartları
  const guideCards = [
    {
      icon: Building2,
      title: 'Proje Yönetimi',
      description: 'Yeni proje ekleyin, mevcut projeleri düzenleyin veya silin.',
      steps: [
        'Sol menüden "Projeler" seçin',
        '"Yeni Proje" butonuna tıklayın',
        'Proje bilgilerini ve görsellerini ekleyin',
        'Kaydet butonuna basın'
      ],
      link: '/admin/projeler',
      color: 'blue'
    },
    {
      icon: Newspaper,
      title: 'Haber Yayınlama',
      description: 'Şirket haberlerini ve duyurularını yayınlayın.',
      steps: [
        'Sol menüden "Haberler" seçin',
        '"Yeni Haber" butonuna tıklayın',
        'Başlık, içerik ve görsel ekleyin',
        'Yayınla butonuna basın'
      ],
      link: '/admin/haberler',
      color: 'purple'
    },
    {
      icon: ImageIcon,
      title: 'Galeri Yönetimi',
      description: 'Fotoğrafları yükleyin ve kategorilere ayırın.',
      steps: [
        'Sol menüden "Galeri" seçin',
        'Dosya yükleme alanını kullanın',
        'Birden fazla görsel seçebilirsiniz',
        'Görselleri düzenleyin veya silin'
      ],
      link: '/admin/galeri',
      color: 'pink'
    },
    {
      icon: Users,
      title: 'Referans Ekleme',
      description: 'İş ortaklarınızı ve referanslarınızı ekleyin.',
      steps: [
        'Sol menüden "Referanslar" seçin',
        '"Yeni Referans" butonuna tıklayın',
        'Logo ve firma bilgilerini girin',
        'Sıralamayı ayarlayın'
      ],
      link: '/admin/referanslar',
      color: 'amber'
    },
    {
      icon: Briefcase,
      title: 'Kariyer İlanları',
      description: 'İş ilanlarını oluşturun ve yönetin.',
      steps: [
        'Sol menüden "Kariyer" seçin',
        '"Yeni İlan" butonuna tıklayın',
        'Pozisyon detaylarını girin',
        'Aktif/Pasif durumunu ayarlayın'
      ],
      link: '/admin/kariyer',
      color: 'orange'
    },
    {
      icon: Settings,
      title: 'Site Ayarları',
      description: 'Genel ayarları ve iletişim bilgilerini düzenleyin.',
      steps: [
        'Sol menüden "Ayarlar" seçin',
        'Şirket bilgilerini güncelleyin',
        'Sosyal medya linklerini ekleyin',
        'Hero slider\'ı düzenleyin'
      ],
      link: '/admin/ayarlar',
      color: 'gray'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hoş Geldiniz 👋</h1>
          <p className="text-gray-500 text-sm">Admin paneli kullanım kılavuzu</p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/projeler" 
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={16} />
            Yeni Proje
          </Link>
          <Link 
            href="/" 
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg font-medium transition-colors"
          >
            Siteyi Gör
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Bilgi Kutusu */}
      <div className="bg-gradient-to-r from-primary/10 to-amber-50 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Hızlı Başlangıç</h3>
            <p className="text-gray-600 text-sm mt-1">
              Aşağıdaki kartlara tıklayarak ilgili bölüme gidebilir ve adım adım yönergeleri takip edebilirsiniz. 
              Her kart size o bölümün nasıl kullanılacağını gösterir.
            </p>
          </div>
        </div>
      </div>

      {/* Kullanım Kılavuzu Grid */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={18} />
          Nasıl Kullanılır?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guideCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.link} className="block group h-full">
                <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-primary/30 hover:shadow-md transition-all h-full">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${card.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${card.color}-500 transition-colors`}>
                      <card.icon className={`text-${card.color}-600 group-hover:text-white transition-colors`} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
                      <p className="text-gray-500 text-xs">{card.description}</p>
                    </div>
                  </div>
                  
                  {/* Steps */}
                  <div className="space-y-2 mt-4">
                    {card.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500 font-medium">
                          {stepIndex + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-primary text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Bölüme Git <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alt Grid - Son Aktiviteler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Son Eklenen Projeler</h2>
            <Link href="/admin/projeler" className="text-primary text-xs font-medium flex items-center gap-1">
              Tümü <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProjects.length > 0 ? recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getFileUrl(project.image) || 'https://via.placeholder.com/80'}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{project.title}</p>
                  <p className="text-xs text-gray-500">{project.location}</p>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center">
                <Building2 className="mx-auto text-gray-300 mb-2" size={24} />
                <p className="text-gray-500 text-sm">Henüz proje eklenmemiş</p>
                <Link href="/admin/projeler" className="text-primary text-xs font-medium mt-2 inline-block">
                  İlk projeyi ekle →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Son Eklenen Haberler</h2>
            <Link href="/admin/haberler" className="text-primary text-xs font-medium flex items-center gap-1">
              Tümü <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentNews.length > 0 ? recentNews.map((item) => (
              <div key={item.id} className="p-3 hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Clock size={10} />
                  {new Date(item.date).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )) : (
              <div className="p-6 text-center">
                <Newspaper className="mx-auto text-gray-300 mb-2" size={24} />
                <p className="text-gray-500 text-sm">Henüz haber eklenmemiş</p>
                <Link href="/admin/haberler" className="text-primary text-xs font-medium mt-2 inline-block">
                  İlk haberi ekle →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* İpuçları */}
      <div className="bg-gray-900 rounded-xl p-5 text-white">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-400" />
          Faydalı İpuçları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Palette size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Görselleri yüklemeden önce optimize edin (max 2MB)</p>
          </div>
          <div className="flex items-start gap-2">
            <Globe size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">SEO için proje açıklamalarını detaylı yazın</p>
          </div>
          <div className="flex items-start gap-2">
            <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">İletişim bilgilerini güncel tutun</p>
          </div>
        </div>
      </div>
    </div>
  );
}
