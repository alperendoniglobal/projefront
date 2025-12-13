'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useSettings } from '@/lib/context';

const navigation = [
  { name: 'Anasayfa', href: '/' },
  { name: 'Kurumsal', href: '/kurumsal' },
  { name: 'Projelerimiz', href: '/projeler' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Kariyer', href: '/kariyer' },
  { name: 'Haberler', href: '/haberler' },
  { name: 'Bize Ulaşın', href: '/iletisim' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark text-white py-2 hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Phone size={14} />
              {settings.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin size={16} />
            </a>
            <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Facebook size={16} />
            </a>
            <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Instagram size={16} />
            </a>
            <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm py-5'
        }`}
      >
        <div className="container">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt={settings.companyName}
                className="h-16 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-base font-medium transition-colors ${
                    isActive(item.href) ? 'text-primary' : 'text-dark hover:text-primary'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-dark"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <img 
                    src="/logo.png" 
                    alt={settings.companyName}
                    className="h-12 w-auto"
                  />
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg font-medium py-2 border-b border-gray-100 ${
                        isActive(item.href) ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-dark mb-4">
                    <Phone size={18} />
                    {settings.phone}
                  </a>
                  <div className="flex gap-4">
                    <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary">
                      <Linkedin size={20} />
                    </a>
                    <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary">
                      <Facebook size={20} />
                    </a>
                    <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary">
                      <Instagram size={20} />
                    </a>
                    <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary">
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

