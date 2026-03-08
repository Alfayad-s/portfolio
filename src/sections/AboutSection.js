'use client';

import { useState, useEffect, useRef } from "react";
import { useLanguage } from '@/context/LanguageContext';
import Image from "next/image";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} id="about" className="min-h-screen bg-black py-16 sm:py-20 px-4 sm:px-6 md:px-16 scroll-mt-20" data-gsap="fade-up">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-offbit text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wider">
            {t('aboutTitle')}
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-red-500 mx-auto"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center mb-16 sm:mb-20">
          
          {/* Left - Profile Image */}
          <div className={`relative transition-all duration-1000 delay-200 order-2 lg:order-1 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative flex justify-center lg:justify-start">
              {/* Decorative frames - behind image (same as hero) */}
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-full h-full border-2 border-red-500/20 transform rotate-1 z-0"></div>
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-full h-full border-2 border-red-500/30 transform -rotate-1 z-0"></div>

              {/* Main image container */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[400px] lg:w-full lg:h-[500px] overflow-hidden flex items-center justify-center z-10">
                <Image 
                  src="/about1.png" 
                  alt="Fayad Profile" 
                  width={350} 
                  height={400}
                  className="object-cover w-52 md:w-80 mt-28"
                />
                {/* Black shade at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Right - About Content */}
          <div className={`space-y-6 sm:space-y-8 transition-all duration-1000 delay-400 order-1 lg:order-2 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            
            {/* Introduction */}
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wider">
                {t('aboutSubtitle')}
              </h3>
              
              <div className="space-y-3 sm:space-y-4 text-gray-300 leading-relaxed">
                <p className="text-base sm:text-lg">
                  {t('aboutDescription')}
                </p>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-lg sm:text-xl font-bold text-white tracking-wider border-l-4 border-red-500 pl-3 sm:pl-4">
                EXPERTISE
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold text-sm sm:text-base">Frontend</div>
                  <div className="text-gray-400 text-xs sm:text-sm">React, Next.js, TypeScript</div>
                </div>
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold text-sm sm:text-base">Backend</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Node.js, MongoDB, APIs</div>
                </div>
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold text-sm sm:text-base">Design</div>
                  <div className="text-gray-400 text-xs sm:text-sm">UI/UX, Figma, Prototyping</div>
                </div>
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold text-sm sm:text-base">Tools</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Git, Docker, AWS</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-6 sm:pt-8 text-center lg:text-left">
              <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-red-500 text-red-500 font-semibold tracking-wider transition-all duration-300 hover:bg-red-500 hover:text-black overflow-hidden text-sm sm:text-base">
                <span className="relative z-10">{t('aboutCta')}</span>
                <div className="absolute inset-0 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">35+</div>
            <div className="text-gray-400 text-xs sm:text-sm tracking-wider">PROJECTS</div>
          </div>
          <div className="text-center space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">3+</div>
            <div className="text-gray-400 text-xs sm:text-sm tracking-wider">YEARS</div>
          </div>
          <div className="text-center space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">100%</div>
            <div className="text-gray-400 text-xs sm:text-sm tracking-wider">SATISFACTION</div>
          </div>
          <div className="text-center space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">24/7</div>
            <div className="text-gray-400 text-xs sm:text-sm tracking-wider">AVAILABLE</div>
          </div>
        </div>

        {/* Quote Section */}
        <div className={`mt-12 sm:mt-16 md:mt-20 text-center transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-300 italic leading-relaxed max-w-4xl mx-auto px-4">
            &ldquo;Every line of code is a brushstroke in the canvas of digital innovation, 
            where creativity meets functionality to create extraordinary experiences.&rdquo;
          </blockquote>
          <div className="mt-4 sm:mt-6 text-red-500 font-semibold tracking-wider text-sm sm:text-base">
            — ALFAYAD
          </div>
        </div>
      </div>
    </div>
  );
}