'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useCareers } from '@/lib/context';

export default function KariyerPage() {
  const { careers } = useCareers();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeCareers = careers.filter((career) => career.isActive);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tam-zamanli':
        return 'Tam Zamanlı';
      case 'yari-zamanli':
        return 'Yarı Zamanlı';
      case 'staj':
        return 'Staj';
      default:
        return type;
    }
  };

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
            Kariyer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Ekibimize katılın, birlikte büyüyelim
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="section-title">AÇIK POZİSYONLAR</span>
              <h2 className="section-heading">İş Fırsatları</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dinamik ve yenilikçi ekibimize katılmak için aşağıdaki pozisyonları inceleyebilirsiniz.
                Uygun pozisyon bulamadıysanız, özgeçmişinizi bize gönderebilirsiniz.
              </p>
            </motion.div>

            {/* Job Listings */}
            <div className="space-y-4">
              {activeCareers.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(career.id)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-dark">{career.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {career.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {career.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {getTypeLabel(career.type)}
                        </span>
                      </div>
                    </div>
                    {expandedId === career.id ? (
                      <ChevronUp className="text-primary" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={24} />
                    )}
                  </button>
                  {expandedId === career.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 border-t border-gray-100"
                    >
                      <div className="pt-6">
                        <h4 className="font-medium text-dark mb-2">İş Tanımı</h4>
                        <p className="text-gray-600 mb-4">{career.description}</p>
                        <h4 className="font-medium text-dark mb-2">Aranan Nitelikler</h4>
                        <ul className="list-disc list-inside text-gray-600 mb-6">
                          {career.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                        <a
                          href={`mailto:kariyer@ozpolatinsaat.com?subject=${encodeURIComponent(
                            career.title + ' Başvurusu'
                          )}`}
                          className="btn btn-primary"
                        >
                          <Send size={16} />
                          Başvur
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {activeCareers.length === 0 && (
              <div className="text-center py-12 bg-light rounded-lg">
                <p className="text-gray-600 mb-4">
                  Şu anda açık pozisyon bulunmamaktadır.
                </p>
                <p className="text-gray-500 text-sm">
                  Özgeçmişinizi{' '}
                  <a href="mailto:kariyer@ozpolatinsaat.com" className="text-primary hover:underline">
                    kariyer@ozpolatinsaat.com
                  </a>{' '}
                  adresine gönderebilirsiniz.
                </p>
              </div>
            )}

            {/* General Application */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 bg-primary/10 rounded-lg p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-dark mb-4">
                Aradığınız pozisyonu bulamadınız mı?
              </h3>
              <p className="text-gray-600 mb-6">
                Özgeçmişinizi bize gönderin, uygun pozisyon açıldığında sizinle iletişime geçelim.
              </p>
              <a href="mailto:kariyer@ozpolatinsaat.com" className="btn btn-primary">
                <Send size={16} />
                Genel Başvuru Gönder
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

