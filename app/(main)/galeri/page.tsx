'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2, Play } from 'lucide-react';
import { galleryApi, type GalleryItem, getFileUrl } from '@/lib/api';

// Varsayılan kategoriler
const categories = [
  { id: 'tumu', name: 'Tümü' },
  { id: 'proje', name: 'Projeler' },
  { id: 'santiye', name: 'Şantiye' },
  { id: 'ekip', name: 'Ekibimiz' },
  { id: 'etkinlik', name: 'Etkinlikler' },
];

// Fallback demo images - API'den veri gelmezse kullanılır
const demoImages: GalleryItem[] = [
  { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', alt: 'Modern Konut Projesi', category: 'proje', createdAt: '' },
  { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', alt: 'Şantiye Çalışması', category: 'santiye', createdAt: '' },
  { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', alt: 'Ekip Toplantısı', category: 'ekip', createdAt: '' },
  { id: '4', type: 'image', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', alt: 'Ticaret Merkezi', category: 'proje', createdAt: '' },
  { id: '5', type: 'image', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80', alt: 'İnşaat Alanı', category: 'santiye', createdAt: '' },
  { id: '6', type: 'image', url: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800&q=80', alt: 'Temel Atma Töreni', category: 'etkinlik', createdAt: '' },
  { id: '7', type: 'image', url: 'https://images.unsplash.com/photo-1590725121839-892b458a74fe?w=800&q=80', alt: 'Villa Projesi', category: 'proje', createdAt: '' },
  { id: '8', type: 'image', url: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=800&q=80', alt: 'Mühendislik Ekibi', category: 'ekip', createdAt: '' },
  { id: '9', type: 'image', url: 'https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?w=800&q=80', alt: 'Beton Dökümü', category: 'santiye', createdAt: '' },
  { id: '10', type: 'image', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', alt: 'Rezidans Projesi', category: 'proje', createdAt: '' },
  { id: '11', type: 'image', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', alt: 'Teslim Töreni', category: 'etkinlik', createdAt: '' },
  { id: '12', type: 'image', url: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&q=80', alt: 'Kaba İnşaat', category: 'santiye', createdAt: '' },
];

export default function GaleriPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('tumu');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const data = await galleryApi.getAll();
        setGalleryItems(data.length > 0 ? data : demoImages);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
        setGalleryItems(demoImages);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const filteredItems = activeCategory === 'tumu'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setSelectedIndex(null);
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedIndex, filteredItems.length]);

  return (
    <>
      {/* Page Header */}
      <section className="relative py-24 bg-dark">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80)' }}
        />
        <div className="relative container text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4"
          >
            GALERİ
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Fotoğraf Galerisi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Projelerimizden, şantiyelerimizden ve etkinliklerimizden kareler
          </motion.p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="section bg-gray-50">
        <div className="container">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary text-dark shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-lg"
                      onClick={() => setSelectedIndex(index)}
                    >
                      {item.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <img
                            src={getFileUrl(item.thumbnail || item.url)}
                            alt={item.alt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                              <Play className="text-dark ml-1" size={28} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={getFileUrl(item.url)}
                          alt={item.alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white font-semibold text-lg">{item.alt}</p>
                          <p className="text-gray-300 text-sm capitalize">
                            {categories.find((c) => c.id === item.category)?.name || item.category}
                          </p>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                            <ZoomIn className="text-dark" size={24} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredItems.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">Bu kategoride henüz içerik bulunmuyor.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && filteredItems[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Previous Button */}
            {selectedIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Next Button */}
            {selectedIndex < filteredItems.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Content */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredItems[selectedIndex].type === 'video' ? (
                <video
                  src={getFileUrl(filteredItems[selectedIndex].url)}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] rounded-lg"
                />
              ) : (
                <img
                  src={getFileUrl(filteredItems[selectedIndex].url).replace('w=800', 'w=1600')}
                  alt={filteredItems[selectedIndex].alt}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <p className="text-white font-semibold text-xl">{filteredItems[selectedIndex].alt}</p>
                <p className="text-gray-300 capitalize">
                  {categories.find((c) => c.id === filteredItems[selectedIndex].category)?.name || filteredItems[selectedIndex].category}
                </p>
              </div>
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
              {selectedIndex + 1} / {filteredItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
