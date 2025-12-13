'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Building2, Loader2 } from 'lucide-react';
import { projectsApi, type Project, getFileUrl } from '@/lib/api';

export default function ProjeDetayPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await projectsApi.getById(params.id as string);
        setProject(data);
      } catch (error) {
        console.error('Project not found:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getFileUrl(project.image)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>
        <div className="relative container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/projeler"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={18} />
              Tüm Projeler
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`badge ${
                  project.category === 'devam-eden' ? 'badge-primary' : 'badge-success'
                }`}
              >
                {project.category === 'devam-eden' ? 'Devam Eden' : 'Tamamlanan'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <MapPin size={18} />
                {project.location}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {project.year}
              </span>
              <span className="flex items-center gap-2">
                <Building2 size={18} />
                {project.category === 'devam-eden' ? 'Devam Eden Proje' : 'Tamamlanan Proje'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-dark mb-6">Proje Hakkında</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{project.description}</p>
              {project.details && (
                <p className="text-gray-600 leading-relaxed mb-8">{project.details}</p>
              )}

              {/* Project Details */}
              <div className="bg-light p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-dark mb-6">Proje Detayları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-500 text-sm">Lokasyon</span>
                    <p className="text-dark font-medium">{project.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Yıl</span>
                    <p className="text-dark font-medium">{project.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Durum</span>
                    <p className="text-dark font-medium">
                      {project.category === 'devam-eden' ? 'Devam Eden' : 'Tamamlanan'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Kategori</span>
                    <p className="text-dark font-medium">İnşaat Projesi</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="section bg-light">
          <div className="container">
            <h2 className="text-2xl font-semibold text-dark mb-8">Proje Galerisi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img
                    src={getFileUrl(image)}
                    alt={`${project.title} - ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
