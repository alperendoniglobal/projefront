'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, Shield, Clock } from 'lucide-react';
import { useSettings } from '@/lib/context';

const values = [
  {
    icon: Shield,
    title: 'Güvenilirlik',
    description: 'Tüm projelerimizde güvenilirlik ve şeffaflık ilkelerini ön planda tutuyoruz.',
  },
  {
    icon: Award,
    title: 'Kalite',
    description: 'En yüksek kalite standartlarında malzeme ve işçilik kullanıyoruz.',
  },
  {
    icon: Clock,
    title: 'Zamanında Teslim',
    description: 'Projelerimizi belirlenen sürede tamamlayarak müşteri memnuniyetini sağlıyoruz.',
  },
  {
    icon: Users,
    title: 'Deneyimli Ekip',
    description: 'Alanında uzman mühendis ve teknisyenlerden oluşan güçlü bir ekibe sahibiz.',
  },
];

export default function KurumsalPage() {
  const { settings } = useSettings();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Kurumsal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            {settings.companyName} Hakkında
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-title">HAKKIMIZDA</span>
              <h2 className="section-heading">Güvenle İnşa Ediyoruz</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{settings.aboutText}</p>
              <p className="text-gray-600 leading-relaxed">
                Türkiye&apos;nin dört bir yanında gerçekleştirdiğimiz konut, ticari, sağlık, eğitim ve altyapı
                projeleriyle sektörde öncü konumdayız. Her projemizde kalite, güvenlik ve müşteri
                memnuniyetini ön planda tutarak çalışıyoruz.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
                alt="İnşaat projesi"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-lg shadow-xl">
                <span className="text-4xl font-bold text-dark block">{settings.stats.experience}+</span>
                <span className="text-dark/80 font-medium">Yıllık Deneyim</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-light">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-10 rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-dark mb-4">Misyonumuz</h3>
              <p className="text-gray-600 leading-relaxed">{settings.missionText}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-10 rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Eye className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-dark mb-4">Vizyonumuz</h3>
              <p className="text-gray-600 leading-relaxed">{settings.visionText}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="section-title">DEĞERLERİMİZ</span>
            <h2 className="section-heading">Temel İlkelerimiz</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-primary" size={36} />
                </div>
                <h4 className="text-xl font-semibold text-dark mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

