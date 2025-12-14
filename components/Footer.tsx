'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import { useSettings } from '@/lib/context';

export default function Footer() {
  const { settings } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white relative">
      {/* Main Footer */}
      <div className="max-w-[1800px] mx-auto px-8 lg:px-16 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Company Info - Takes more space */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.png" 
                alt={settings.companyName}
                width={180}
                height={80}
                className="h-auto w-[180px] brightness-0 invert"
              />
            </Link>
            
            <p className="text-[#9ca3af] text-[15px] leading-[1.8] max-w-[320px]">
              {settings.aboutText.substring(0, 180)}...
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-[#333] flex items-center justify-center text-[#9ca3af] hover:bg-primary hover:border-primary hover:text-dark transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={settings.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-[#333] flex items-center justify-center text-[#9ca3af] hover:bg-primary hover:border-primary hover:text-dark transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
              <a
                href={settings.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-[#333] flex items-center justify-center text-[#9ca3af] hover:bg-primary hover:border-primary hover:text-dark transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-[#333] flex items-center justify-center text-[#9ca3af] hover:bg-primary hover:border-primary hover:text-dark transition-all duration-300"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:pl-8">
            <h4 className="text-white font-semibold text-lg mb-6 relative">
              Kurumsal
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-4 mt-8">
              <li>
                <Link href="/kurumsal" className="text-[#9ca3af] hover:text-primary hover:pl-1 transition-all duration-300 text-[15px]">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/projeler" className="text-[#9ca3af] hover:text-primary hover:pl-1 transition-all duration-300 text-[15px]">
                  Projelerimiz
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-[#9ca3af] hover:text-primary hover:pl-1 transition-all duration-300 text-[15px]">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/kariyer" className="text-[#9ca3af] hover:text-primary hover:pl-1 transition-all duration-300 text-[15px]">
                  Kariyer
                </Link>
              </li>
              <li>
                <Link href="/haberler" className="text-[#9ca3af] hover:text-primary hover:pl-1 transition-all duration-300 text-[15px]">
                  Haberler
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-[#9ca3af] hover:text-primary hover:pl-1 transition-all duration-300 text-[15px]">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-lg mb-6 relative">
              Hizmetlerimiz
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-4 mt-8">
              <li className="text-[#9ca3af] text-[15px]">Bina Tasarımı ve Projelendirme</li>
              <li className="text-[#9ca3af] text-[15px]">Anahtar Teslim Bina Yapım</li>
              <li className="text-[#9ca3af] text-[15px]">Altyapı ve Yol Yapım İşleri</li>
              <li className="text-[#9ca3af] text-[15px]">Peyzaj ve Çevre Düzenleme</li>
              <li className="text-[#9ca3af] text-[15px]">Restorasyon ve Tadilat</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-lg mb-6 relative">
              İletişim
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-5 mt-8">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <span className="text-[#9ca3af] text-[15px] leading-relaxed pt-2">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <a href={`tel:${settings.phone}`} className="text-[#9ca3af] hover:text-primary transition-colors text-[15px]">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <a href={`mailto:${settings.email}`} className="text-[#9ca3af] hover:text-primary transition-colors text-[15px]">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-primary" />
                </div>
                <span className="text-[#9ca3af] text-[15px]">{settings.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {/* Bottom Bar - Gizlilik Politikası ve KVKK kaldırıldı */}
      <div className="border-t border-[#222]">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-16 py-6">
          <div className="flex justify-center items-center">
            <p className="text-[#666] text-sm text-center">
              © {new Date().getFullYear()} {settings.companyName}. Tüm Hakları Saklıdır.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-dark rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-dark hover:scale-110 transition-all duration-300 z-40"
        aria-label="Yukarı çık"
      >
        <ArrowUp size={24} strokeWidth={2.5} />
      </button>
    </footer>
  );
}
