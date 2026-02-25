'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle, { CompactLanguageToggle } from './LanguageToggle';

function VerticalNavItem({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative flex items-center justify-center w-8"
    >
      {/* Slim vertical pill */}
      <span className="h-8 w-[3px] rounded-full bg-white/25 group-hover:bg-red-500 group-hover:shadow-[0_0_16px_rgba(239,68,68,0.9)] transition-all duration-300" />

      {/* Label that smoothly slides out on hover without increasing base width */}
      <span className="pointer-events-none absolute left-full ml-3 rounded-full bg-black/90 px-3 py-1 text-xs tracking-wide text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap transition-all duration-300">
        {label}
      </span>
    </Link>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'pt-2 px-4 sm:px-6 md:px-8' 
          : 'pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-8'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <nav 
          className={`flex items-center transition-all duration-500 ease-in-out ${
            isScrolled
              ? 'bg-black/20 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-xl mx-auto w-auto justify-center md:bg-transparent md:backdrop-blur-none md:shadow-none md:px-0 md:py-0 md:w-full md:mx-0 md:opacity-0 md:pointer-events-none'
              : 'bg-transparent justify-between w-full'
          }`}
        >
          {/* Left side - Email (hidden on mobile when scrolled) */}
          <div className={`hidden sm:flex items-center space-x-2 sm:space-x-3 transition-all duration-500 ${
            isScrolled ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}>
            <div className="w-6 h-6 sm:w-8 sm:h-8 border border-white rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <span className="text-white text-xs sm:text-sm hidden md:block">alfayadshameer056@gmail.com</span>
          </div>

          {/* Center - Navigation (hidden on mobile, fades out when scrolled because we show vertical nav) */}
          <div
            className={`hidden md:flex items-center space-x-6 lg:space-x-8 transition-opacity duration-300 ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <Link 
              href="/" 
              className={`text-sm transition-colors duration-300 ${
                isScrolled 
                  ? 'text-white hover:text-red-400' 
                  : 'text-white hover:text-gray-300'
              }`}
              onClick={closeMobileMenu}
            >
              {t('home')}
            </Link>
            <Link 
              href="/work" 
              className={`text-sm transition-colors duration-300 ${
                isScrolled 
                  ? 'text-white hover:text-red-400' 
                  : 'text-white hover:text-gray-300'
              }`}
              onClick={closeMobileMenu}
            >
              {t('work')}
            </Link>
            <a 
              href="/services" 
              className={`text-sm transition-colors duration-300 ${
                isScrolled 
                  ? 'text-white hover:text-red-400' 
                  : 'text-white hover:text-gray-300'
              }`}
              onClick={closeMobileMenu}
            >
              {t('services')}
            </a>
            <a 
              href="/contact" 
              className={`text-sm transition-colors duration-300 ${
                isScrolled 
                  ? 'text-white hover:text-red-400' 
                  : 'text-white hover:text-gray-300'
              }`}
              onClick={closeMobileMenu}
            >
              {t('contact')}
            </a>
          </div>

          {/* Language Toggle (desktop) – main icon will live in vertical navbar when scrolled */}
          <LanguageToggle className="hidden sm:block md:hidden" />

          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className={`md:hidden w-8 h-8 sm:w-10 sm:h-10 border border-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10 ${
              isScrolled ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
            }`}
          >
            <svg 
              className={`w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-black/90 backdrop-blur-md rounded-2xl mt-4 p-6 border border-white/10">
            <div className="flex flex-col space-y-4">
            <Link 
                href="/" 
                className="text-white hover:text-red-400 transition-colors duration-300 py-2 text-lg font-medium"
                onClick={closeMobileMenu}
              >
                {t('home')}
              </Link>
              <Link 
                href="/work" 
                className="text-white hover:text-red-400 transition-colors duration-300 py-2 text-lg font-medium"
                onClick={closeMobileMenu}
              >
                {t('work')}
              </Link>
              <a 
                href="/services" 
                className="text-white hover:text-red-400 transition-colors duration-300 py-2 text-lg font-medium"
                onClick={closeMobileMenu}
              >
                {t('services')}
              </a>
              <a 
                href="/contact" 
                className="text-white hover:text-red-400 transition-colors duration-300 py-2 text-lg font-medium"
                onClick={closeMobileMenu}
              >
                {t('contact')}
              </a>
              
              {/* Mobile language toggle and email */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm">alfayadshameer056@gmail.com</span>
                  </div>
                  <CompactLanguageToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical navbar on the left when scrolled (desktop only) */}
      {isScrolled && (
        <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col items-center gap-3 rounded-full bg-black/70/80 border border-white/10 px-2 py-4 shadow-2xl backdrop-blur-md">
            <VerticalNavItem href="/" label={t('home')} onClick={closeMobileMenu} />
            <VerticalNavItem href="/work" label={t('work')} onClick={closeMobileMenu} />
            <VerticalNavItem href="/services" label={t('services')} onClick={closeMobileMenu} />
            <VerticalNavItem href="/contact" label={t('contact')} onClick={closeMobileMenu} />

            <div className="h-px w-6 bg-white/15 my-1" />

            {/* Language icon / toggle lives only in this vertical navbar on desktop */}
            <div className="mt-1">
              <CompactLanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
