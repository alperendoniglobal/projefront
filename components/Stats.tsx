'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSettings } from '@/lib/context';

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  const { settings } = useSettings();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: settings.stats.experience, label: 'YILLIK\nDENEYİM' },
    { value: settings.stats.ongoingProjects, label: 'DEVAM EDEN\nPROJE' },
    { value: settings.stats.completedProjects, label: 'TAMAMLANAN\nPROJE' },
  ];

  return (
    <section
      ref={ref}
      className="relative py-32 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80)',
      }}
    >
      <div className="absolute inset-0 bg-dark/85" />
      <div className="container relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="counter text-primary text-6xl lg:text-7xl">
                <Counter end={stat.value} />
              </div>
              <p className="text-white font-semibold whitespace-pre-line mt-4 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

