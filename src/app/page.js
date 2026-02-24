'use client';

import { useState } from 'react';
import HeroSection from "@/sections/HeroSection";
import SplashScreen from "@/sections/SplashScreen";
import AboutSection from "@/sections/AboutSection";
import ResumeSection from "@/sections/ResumeSection";
import TechStackMarquee from "@/components/TechStackMarquee";
import ScrollTriggerAnimations from "@/components/ScrollTriggerAnimations";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="overflow-hidden font-sans">
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <ScrollTriggerAnimations isActive={true}>
          <HeroSection />
          <AboutSection />
          <TechStackMarquee />
          <ResumeSection />
        </ScrollTriggerAnimations>
      )}
    </div>
  );
}
