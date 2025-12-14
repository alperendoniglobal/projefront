'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { ArrowRight, Building2, HardHat, Landmark } from 'lucide-react';
import { useSettings } from '@/lib/context';
import { getFileUrl } from '@/lib/api';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const defaultSlides = [
  {
    id: '1',
    title: 'Güvenle İnşa Ediyoruz',
    subtitle: 'KURUMSAL',
    description: '2004 yılından bu yana kalite, dürüstlük ve titizlik ilkeleriyle çalışıyoruz.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80',
    ctaText: 'Hakkımızda',
    ctaLink: '/kurumsal',
  },
  {
    id: '2',
    title: 'Projelerimizle Fark Yaratıyoruz',
    subtitle: 'PROJELERİMİZ',
    description: 'Türkiye genelinde onlarca başarılı projeye imza attık.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
    ctaText: 'Projeleri İncele',
    ctaLink: '/projeler',
  },
  {
    id: '3',
    title: 'Ekibimize Katılın',
    subtitle: 'KARİYER',
    description: 'Dinamik ve yenilikçi ekibimizle büyümeye devam ediyoruz.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80',
    ctaText: 'Kariyer Fırsatları',
    ctaLink: '/kariyer',
  },
];

export default function Hero() {
  const { settings } = useSettings();
  const slides = settings.heroSlides?.length > 0 ? settings.heroSlides : defaultSlides;
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${getFileUrl(slide.image)})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/50" />
              </div>

              {/* Content */}
              <div className="relative h-full container flex items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-3xl text-white"
                >
                  {slide.subtitle && (
                    <span className="inline-block px-5 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
                      {slide.subtitle}
                    </span>
                  )}
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
                    {slide.description}
                  </p>
                  <Link href={slide.ctaLink} className="btn btn-primary text-base px-8 py-4">
                    {slide.ctaText}
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Quick Links - SADECE DESKTOP için floating design */}
      <div className="absolute bottom-0 left-0 right-0 z-10 hidden md:block">
        <div className="container">
          <div className="grid grid-cols-3 -mb-20">
            {/* Card 1: Bina Yapım İşleri */}
            <div className="bg-primary p-8 lg:p-10 flex items-center gap-5 hover:bg-primary-dark transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-dark/10 flex items-center justify-center group-hover:bg-dark/20 transition-colors flex-shrink-0">
                <Building2 className="text-dark w-8 h-8" />
              </div>
              <div>
                <h4 className="text-dark font-semibold text-xl">Bina Yapım İşleri</h4>
                <p className="text-dark/70 text-base">Anahtar teslim projeler</p>
              </div>
            </div>
            
            {/* Card 2: Altyapı İşleri */}
            <div className="bg-dark-light p-8 lg:p-10 flex items-center gap-5 hover:bg-dark-lighter transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                <HardHat className="text-primary w-8 h-8" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xl">Altyapı İşleri</h4>
                <p className="text-gray-400 text-base">Yol ve altyapı projeleri</p>
              </div>
            </div>
            
            {/* Card 3: Peyzaj İşleri */}
            <div className="bg-dark p-8 lg:p-10 flex items-center gap-5 hover:bg-dark-light transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                <Landmark className="text-primary w-8 h-8" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xl">Peyzaj İşleri</h4>
                <p className="text-gray-400 text-base">Çevre düzenleme</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBİL İÇİN AYRI SECTION
═══════════════════════════════════════════════════════════════════════════ */
export function MobileServicesSection() {
  const services = [
    { icon: Building2, title: 'Bina', desc: 'Anahtar teslim' },
    { icon: HardHat, title: 'Altyapı', desc: 'Yol projeleri' },
    { icon: Landmark, title: 'Peyzaj', desc: 'Çevre düzenleme' },
  ];

  return (
    <section className="md:hidden bg-dark py-5">
      <div className="px-4">
        {/* Grid - eşit boyutlu kartlar */}
        <div className="grid grid-cols-3 gap-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* SABİT YÜKSEKLIK - tüm kartlar aynı boyut */}
              <div className="bg-dark-light rounded-xl p-3 text-center border border-white/5 h-[120px] flex flex-col justify-center">
                <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                  <service.icon className="text-primary w-5 h-5" />
                </div>
                <h4 className="text-white font-medium text-sm">{service.title}</h4>
                <p className="text-gray-500 text-[10px] mt-0.5 leading-tight">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

