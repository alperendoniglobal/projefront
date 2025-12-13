'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { referencesApi, type Reference, getFileUrl } from '@/lib/api';

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  // API'den gelen referanslar
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Referansları API'den çek
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        console.log('Referanslar yükleniyor...');
        const data = await referencesApi.getAll(false); // Sadece aktif olanlar
        console.log('Referanslar yüklendi:', data);
        setReferences(data);
        setError(null);
      } catch (err) {
        console.error('Referanslar yüklenemedi:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, []);

  // Yükleniyorsa veya hata varsa veya referans yoksa gösterme
  if (loading || error || references.length === 0) {
    return null;
  }

  return (
    <section className="section bg-light" ref={ref}>
      <div className="container">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-title">REFERANSLARIMIZ</span>
          <h2 className="section-heading">İş Ortaklarımız</h2>
        </motion.div>

        {/* Referans Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-10">
          {references.map((reference, index) => (
            <motion.div
              key={reference.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Eğer website varsa link olarak göster */}
              {reference.website ? (
                <a 
                  href={reference.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 min-h-[120px] flex items-center justify-center"
                  title={reference.name}
                >
                  <img 
                    src={getFileUrl(reference.logo)} 
                    alt={reference.name}
                    className="max-w-full max-h-16 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </a>
              ) : (
                <div 
                  className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow min-h-[120px] flex items-center justify-center"
                  title={reference.name}
                >
                  <img 
                    src={getFileUrl(reference.logo)} 
                    alt={reference.name}
                    className="max-w-full max-h-16 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
