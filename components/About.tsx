'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/lib/context';



export default function About() {
  const { settings } = useSettings();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section pt-40" ref={ref}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="İnşaat projesi"
                className="w-full h-[550px] object-cover rounded-2xl shadow-xl"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-10 -right-10 bg-primary p-10 rounded-2xl shadow-xl hidden md:block">
                <div className="text-dark">
                  <span className="text-7xl font-bold block">{settings.stats.experience}+</span>
                  <span className="text-lg font-medium mt-2 block">Yıllık Deneyim</span>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -z-10 -top-6 -left-6 w-full h-full border-2 border-primary rounded-2xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <span className="section-title">KURUMSAL</span>
              <h2 className="section-heading text-4xl lg:text-5xl">
                Sizler için<br />
                <span className="text-primary">güvenle</span> inşa ediyoruz...
              </h2>
            </div>
            <p className="text-gray-600 leading-loose text-md ">
              {settings.aboutText}
            </p>
   
            <div className="pt-4">
              <Link href="/kurumsal" className="btn btn-primary text-base px-10 py-4">
                Hakkımızda
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
