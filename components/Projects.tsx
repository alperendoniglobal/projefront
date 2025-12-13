'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useProjects } from '@/lib/context';
import { getFileUrl } from '@/lib/api';

type FilterType = 'all' | 'devam-eden' | 'tamamlanan';

export default function Projects() {
  const { projects } = useProjects();
  const [filter, setFilter] = useState<FilterType>('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    return project.category === filter;
  }).slice(0, 6);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'devam-eden', label: 'Devam Eden' },
    { key: 'tamamlanan', label: 'Tamamlanan' },
  ];

  return (
    <section className="section" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-title">PROJELERİMİZ</span>
          <h2 className="section-heading">Projelerimiz</h2>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.08 * index }}
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
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1.5 text-white text-sm">
                        <MapPin size={14} />
                        {project.location}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          project.category === 'devam-eden' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {project.category === 'devam-eden' ? 'Devam Eden' : 'Tamamlanan'}
                      </span>
                      <span className="text-sm text-gray-400">{project.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-dark group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/projeler" className="btn btn-outline text-base px-10 py-4">
            Tüm Projeleri Görüntüleyin
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
