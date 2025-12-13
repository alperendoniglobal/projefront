'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Hammer, Route, Trees, Wrench, Palette } from 'lucide-react';

const services = [
  {
    icon: Building2,
    title: 'Bina Tasarımı ve Projelendirme',
    description: 'Modern mimari yaklaşımlarla estetik ve fonksiyonel yapılar tasarlıyoruz.',
  },
  {
    icon: Hammer,
    title: 'Anahtar Teslim Bina Yapım İşleri',
    description: 'Konut, ticari ve endüstriyel yapıları anahtar teslim olarak inşa ediyoruz.',
  },
  {
    icon: Route,
    title: 'Altyapı ve Yol Yapım İşleri',
    description: 'Karayolu, köprü ve altyapı projelerini başarıyla tamamlıyoruz.',
  },
  {
    icon: Trees,
    title: 'Peyzaj ve Saha Düzenleme İşleri',
    description: 'Çevre düzenleme ve peyzaj projeleriyle yaşam alanları oluşturuyoruz.',
  },
  {
    icon: Wrench,
    title: 'Restorasyon ve Tadilat',
    description: 'Tarihi ve modern yapıların restorasyon ve tadilat işlerini gerçekleştiriyoruz.',
  },
  {
    icon: Palette,
    title: 'İç Mimari ve Dekorasyon',
    description: 'Fonksiyonel ve estetik iç mekan tasarımları sunuyoruz.',
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section bg-light" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="section-title">FAALİYET ALANLARIMIZ</span>
          <h2 className="section-heading">
            Uzmanlık alanlarımızda gerçekleştirdiğimiz faaliyetleri inceleyebilirsiniz.
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <service.icon className="text-primary group-hover:text-dark transition-colors" size={40} />
              </div>
              <h3 className="text-2xl font-semibold text-dark mb-5">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
