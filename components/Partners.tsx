'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const partners = [
  { name: 'AFAD', logo: 'AFAD' },
  { name: 'TOKİ', logo: 'TOKİ' },
  { name: 'İLBANK', logo: 'İLBANK' },
  { name: 'ZİRAAT BANKASI', logo: 'ZİRAAT' },
  { name: 'GENÇLİK VE SPOR BAKANLIĞI', logo: 'GSB' },
  { name: 'ÇEVRE ŞEHİRCİLİK BAKANLIĞI', logo: 'ÇŞB' },
];

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section bg-light" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-title">REFERANSLARIMIZ</span>
          <h2 className="section-heading">İş Ortaklarımız</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-10">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm hover:shadow-lg transition-shadow flex items-center justify-center min-h-[120px]"
            >
              <span className="text-dark font-bold text-lg text-center">{partner.logo}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
