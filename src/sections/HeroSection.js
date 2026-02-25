'use client';

import { useState, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';
import Image from "next/image";

export default function HeroSection() {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let battery = null;
    let timeInterval = null;
    let batteryInterval = null;

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      });
      setCurrentTime(`${timeString}`);
    };

    const handleChargingChange = () => {
      if (battery) {
        setIsCharging(battery.charging);
      }
    };

    const handleLevelChange = () => {
      if (battery) {
        setBatteryLevel(Math.round(battery.level * 100));
      }
    };

    const updateBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          battery = await navigator.getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
          
          // Add event listeners for real-time charging state changes
          battery.addEventListener('chargingchange', handleChargingChange);
          battery.addEventListener('levelchange', handleLevelChange);
        } else {
          // Fallback for browsers that don't support battery API
          setBatteryLevel(85); // Default value
          setIsCharging(false); // Default to not charging
        }
      } catch (error) {
        setBatteryLevel(85); // Fallback value
        setIsCharging(false); // Default to not charging
      }
    };

    updateTime();
    updateBattery();
    
    timeInterval = setInterval(updateTime, 1000);
    batteryInterval = setInterval(updateBattery, 60000); // Update every minute (less frequent since we have event listeners)
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(batteryInterval);
      
      // Clean up battery event listeners
      if (battery) {
        battery.removeEventListener('chargingchange', handleChargingChange);
        battery.removeEventListener('levelchange', handleLevelChange);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex flex-col" data-gsap="fade-up">
      {/* Background silhouette */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-800 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center px-4 sm:px-6 md:px-16 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left side - Text content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Main heading */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="font-offbit text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight">
                  <span className="block">{t('HELLO')}</span>
                  <span className="block">I&apos;M</span>
                  <span className="block">{t('heroTitle')}</span>
                </h1>
              </div>

              {/* Descriptive tagline */}
              <div className="space-y-1 sm:space-y-2 max-w-lg mx-auto lg:mx-0">
                <p className="text-white text-sm sm:text-base md:text-lg font-light leading-relaxed">
                  {t('heroSubtitle')}
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg font-light leading-relaxed">
                  {t('heroDescription')}
                </p>
              </div>
            </div>

            {/* Right side - Portrait with red filter */}
            <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative">
                {/* Portrait container with red filter */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[400px] lg:w-96 lg:h-[500px] overflow-hidden">
                  {/* Portrait placeholder with red filter */}
                  <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center relative">
                    
                      <Image 
                        src="/black-fayad.png" 
                        alt="Profile" 
                        width={330} 
                        height={450}
                        className="w-52 md:w-80 object-cover"
                      />
                    
                    
                    {/* Red overlay filter */}
                    <div className="absolute inset-0 bg-red-600/40 mix-blend-multiply"></div>
                  </div>
                </div>

                {/* Layered frame effect */}
                <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-full h-full border-2 border-red-500/20 transform rotate-1"></div>
                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-full h-full border-2 border-red-500/30 transform -rotate-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 px-4 sm:px-6 md:px-16 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-white text-xs sm:text-sm font-light">
            {/* Left - Time */}
            <div className="tracking-wider">
              {currentTime}
            </div>

            {/* Center - Copyright (hidden on mobile) */}
            <div className="hidden sm:block text-xs text-gray-400">
              {t('copyright')} {t('heroTitle')}
            </div>

            {/* Right - Battery */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Power connection icon */}
                <div className="flex items-center">
                  {isCharging ? (
                    <Image src="/icons/charge.svg" alt="Charge" width={12} height={12} className="sm:w-[14px] sm:h-[14px]" />
                  ) : (
                    <Image src="/icons/not-charge.svg" alt="Not Charge" width={12} height={12} className="sm:w-[14px] sm:h-[14px]" />
                  )}
                </div>

                <div className="relative">
                  <svg className="w-10 h-6 sm:w-12 sm:h-8" viewBox="0 0 24 12" fill="none">
                    <rect x="1" y="3" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1"/>
                    <rect x="20" y="5" width="2" height="2" rx="1" fill="currentColor"/>
                    <rect 
                      x="2" 
                      y="4" 
                      width={`${(batteryLevel / 100) * 16}`} 
                      height="4" 
                      rx="1" 
                      fill={batteryLevel > 20 ? 'currentColor' : '#ef4444'}
                    />
                    {/* Charging indicator */}
                    {isCharging && (
                      <rect x="8" y="2" width="4" height="1" fill="#10b981" rx="0.5">
                        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                      </rect>
                    )}
                  </svg>
                </div>
                <span className="tracking-wider text-xs sm:text-sm">{batteryLevel}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}