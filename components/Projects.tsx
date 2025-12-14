'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '@/lib/context';
import { getFileUrl } from '@/lib/api';

type FilterType = 'all' | 'devam-eden' | 'tamamlanan';

export default function Projects() {
  const { projects } = useProjects();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Embla Carousel - autoplay ile birlikte
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: false,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
      dragFree: true,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  // Filtrelenmiş projeler
  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  const showCarousel = filteredProjects.length > 3;

  // Scroll state güncelle
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Filtre değişince carousel'i sıfırla
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [filter, emblaApi]);

  // Navigation
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'devam-eden', label: 'Devam Eden' },
    { key: 'tamamlanan', label: 'Tamamlanan' },
  ];

  // Proje Kartı
  const ProjectCard = ({ project }: { project: typeof filteredProjects[0] }) => (
    <Link href={`/projeler/${project.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-primary/20">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={getFileUrl(project.image) || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          


          {/* Title & Location on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {project.location}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span>{project.year}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-5">
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">
            {project.description}
          </p>
          <div className="flex items-center text-primary font-medium text-sm">
            <span>Detayları İncele</span>
            <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider rounded-full mb-4">
            Projelerimiz
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Başarılı Projelerimiz
          </h2>
        </div>

        {/* Filter & Navigation Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === f.key
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          {showCarousel && (
            <div className="flex items-center ">
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  canScrollPrev
                    ? 'bg-white text-gray-700 hover:bg-primary hover:text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Önceki"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  canScrollNext
                    ? 'bg-white text-gray-700 hover:bg-primary hover:text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Sonraki"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel / Grid */}
        {showCarousel ? (
          <div className="overflow-hidden p-5" ref={emblaRef}>
            <div className="flex -ml-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 min-w-0"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}



        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/projeler"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium "
          >
            Tüm Projeleri Görüntüle
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
