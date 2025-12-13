'use client';

import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-dark rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors z-40"
      aria-label="Yukarı çık"
    >
      <ArrowUp size={24} />
    </button>
  );
}

