'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { useProjects } from '@/lib/context';
import { getFileUrl } from '@/lib/api';

type FilterType = 'all' | 'devam-eden' | 'tamamlanan';

export default function ProjelerPage() {
  const { projects } = useProjects();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'devam-eden', label: 'Devam Eden' },
    { key: 'tamamlanan', label: 'Tamamlanan' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Projelerimiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl text-gray-300"
          >
            Tamamladığımız ve devam eden projelerimiz
          </motion.p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section">
        <div className="container">
          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center gap-4 mb-16"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                layout
              >
                <Link href={`/projeler/${project.id}`} className="block group">
                  <div className="card overflow-hidden rounded-xl hover:shadow-lg transition-shadow">
                    <div className="image-overlay aspect-[16/10]">
                      <img
                        src={getFileUrl(project.image) || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <span className="px-4 py-2 bg-primary text-dark font-medium rounded-lg text-sm">
                          İncele
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            project.category === 'devam-eden' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {project.category === 'devam-eden' ? 'Devam Eden' : 'Tamamlanan'}
                        </span>
                        <span className="text-xs text-gray-400">{project.year}</span>
                      </div>
                      <h3 className="text-base font-semibold text-dark group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 pt-2">
                        <MapPin size={12} />
                        <span className="truncate">{project.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">Bu kategoride proje bulunamadı.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
