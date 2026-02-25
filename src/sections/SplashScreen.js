'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const { t } = useLanguage();

  // Lock scroll and keep viewport at the top while the splash is visible
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.scrollTo(0, 0);
    };
  }, []);

  useEffect(() => {
    // Start intro animation
    const introTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Start outro animation
    const outroTimer = setTimeout(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }, 800);
    }, 2500);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(outroTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`text-center transition-all duration-1000 ${
        animateOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        
        {/* Top line and DESIGNER */}
        <div className="flex items-center justify-center mb-4">
          <div className={`h-px bg-white transition-all duration-1000 ease-out ${
            showContent ? 'w-16 sm:w-24 md:w-32' : 'w-0'
          }`}></div>
          <div className={`mx-6 text-xs sm:text-sm md:text-base font-light text-white uppercase tracking-widest transition-all duration-1000 delay-300 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {t('designer')}
          </div>
        </div>

        {/* Main title ALFAYAD */}
        <div className={`mb-4 transition-all duration-1000 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="font-offbit text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-wider">
            {t('heroTitle')}
          </h1>
        </div>

        {/* Bottom line and FULL STACK DEVELOPER */}
        <div className="flex items-center justify-center">
          <div className={`text-xs sm:text-sm md:text-base font-light text-white uppercase tracking-widest mr-6 transition-all duration-1000 delay-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {t('heroSubtitle')}
          </div>
          <div className={`h-px bg-white transition-all duration-1000 ease-out delay-500 ${
            showContent ? 'w-16 sm:w-24 md:w-32' : 'w-0'
          }`}></div>
        </div>
      </div>
    </div>
  );
}
