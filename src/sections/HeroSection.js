'use client';

import { useState, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';
import Image from "next/image";

const TYPING_WORDS = ["Alfayad", "Designer", "Developer"];

export default function HeroSection() {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [typedText, setTypedText] = useState(TYPING_WORDS[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
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

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];
    const isWordComplete = typedText === currentWord;
    const isWordEmpty = typedText.length === 0;

    let delay = isDeleting ? 70 : 140;

    if (isWordComplete && !isDeleting) {
      delay = 900;
    } else if (isWordEmpty && isDeleting) {
      delay = 250;
    }

    const timer = setTimeout(() => {
      if (isWordComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (isWordEmpty && isDeleting) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        return;
      }

      const nextText = isDeleting
        ? currentWord.slice(0, typedText.length - 1)
        : currentWord.slice(0, typedText.length + 1);

      setTypedText(nextText);
    }, delay);

    return () => clearTimeout(timer);
  }, [typedText, wordIndex, isDeleting]);

  return (
    <div className="relative min-h-screen bg-black flex flex-col" data-gsap="fade-up">
      {/* Background silhouette */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-800 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-end justify-center px-4 sm:px-6 md:px-16 pt-6 sm:pt-8 pb-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center justify-end gap-6 sm:gap-8">
            <div className="relative flex justify-center items-end w-full mt-24 sm:mt-28 md:mt-32">
              {/* Name text behind image */}
              <div className="absolute -top-24 sm:-top-28 md:-top-32 left-1/2 -translate-x-1/2 z-0 pointer-events-none">
                <h1 className="font-offbit text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-bold text-white/10 leading-none whitespace-nowrap">
                  {typedText}
                </h1>
              </div>

              <div className="relative">
                <div className="relative w-72 h-[420px] sm:w-80 sm:h-[470px] md:w-[420px] md:h-[540px] lg:w-[460px] lg:h-[590px] overflow-hidden flex items-end justify-center z-10">
                  <Image 
                    src="/hero2.png" 
                    alt="Profile" 
                    width={460} 
                    height={590}
                    className="w-full h-full object-contain"
                  />
                  {/* Black shade at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                </div>
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