'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// API URL - Backend sunucusu
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

// Referans tipi
interface Reference {
  id: string;
  name: string;
  logo: string;
  website?: string | null;
  description?: string | null;
  order: number;
  isActive: boolean;
}

/**
 * Partners/References Section
 * Ana sayfada iş ortaklarını/referansları gösterir
 */
export default function Partners() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);

  // API'den referansları çek
  useEffect(() => {
    fetch(`${API_URL}/api/references`)
      .then(res => res.json())
      .then(data => {
        const activeRefs = data
          .filter((ref: Reference) => ref.isActive)
          .sort((a: Reference, b: Reference) => a.order - b.order);
        setReferences(activeRefs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Yükleniyor veya veri yoksa gösterme
  if (loading || references.length === 0) {
    return null;
  }

  // Logo URL oluştur
  const getLogoUrl = (logo: string) => {
    if (!logo) return '';
    if (logo.startsWith('http')) return logo;
    return `${API_URL}${logo}`;
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Başlık */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold text-sm uppercase tracking-widest rounded-full mb-4">
            Referanslarımız
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Güvenilir İş Ortaklarımız
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Türkiye&apos;nin önde gelen kurum ve kuruluşlarıyla başarılı projeler gerçekleştirdik
          </p>
        </motion.div>

        {/* Referans Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {references.map((ref, index) => {
            const logoUrl = getLogoUrl(ref.logo);
            
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary/20"
              >
                {/* Hover efekti için arka plan */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Logo container */}
                <div className="relative h-20 flex items-center justify-center">
                  <Image
                    src={logoUrl}
                    alt={ref.name}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    unoptimized
                  />
                </div>
                
                {/* İsim - hover'da görünür */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium text-center truncate">
                    {ref.name}
                  </p>
                </div>
              </motion.div>
            );

            return ref.website ? (
              <a
                key={ref.id}
                href={ref.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {CardContent}
              </a>
            ) : (
              <div key={ref.id}>
                {CardContent}
              </div>
            );
          })}
        </div>

        {/* Alt bilgi */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm">
            20+ yılı aşkın deneyimimizle güvenilir iş ortaklıkları kuruyoruz
          </p>
        </motion.div>

      </div>
    </section>
  );
}
