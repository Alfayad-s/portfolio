'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

// All tech stack images from public/languages (excluding .DS_Store)
const LANGUAGE_IMAGES = [
  'angular.png', 'aws.png', 'bootstrap.png', 'cloud.png', 'css.png',
  'debian.png', 'docker.png', 'figma.png', 'flutter.png', 'git.png',
  'github.png', 'gitlab.png', 'googlecloud.png', 'html.png', 'javascript.png',
  'kotlin.png', 'kubernetes.png', 'linux.png', 'mongodb.png', 'mysql.png',
  'nestjs.png', 'nextjs.png', 'nodejs.png', 'npm.png', 'postgresql.png',
  'python.png', 'react.png', 'redis.png', 'redux.png', 'slack.png',
  'svelte.png', 'swift.png', 'typescript.png', 'ubuntu.png', 'vscode.png',
  'xcode.png',
];

const MARQUEE_STYLES = `
  @keyframes tsm-marquee-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes tsm-marquee-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .tsm-animate-left {
    animation: tsm-marquee-left 45s linear infinite;
  }
  .tsm-animate-right {
    animation: tsm-marquee-right 45s linear infinite;
  }
  .tsm-animate-reverse {
    animation-direction: reverse;
  }
  .tsm-row-outer {
    overflow: hidden;
    padding: 1rem 0;
    min-height: 88px;
    display: flex;
    width: 100%;
  }
  .tsm-row-inner {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 3rem;
  }
  .tsm-logo-box {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(224,28,28,0.25);
    transition: transform 0.3s, filter 0.3s;
  }
  /* Mobile: always coloured (no hover) */
  @media (max-width: 767px) {
    .tsm-logo-box { filter: grayscale(0); }
  }
  /* Desktop: grayscale, coloured on hover */
  @media (min-width: 768px) {
    .tsm-logo-box { filter: grayscale(1); }
    .tsm-logo-box:hover {
      filter: grayscale(0);
      transform: scale(1.1);
    }
  }
  .tsm-logo-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  @media (min-width: 640px) {
    .tsm-logo-box { width: 64px; height: 64px; min-width: 64px; min-height: 64px; }
  }
  @media (min-width: 768px) {
    .tsm-logo-box { width: 80px; height: 80px; min-width: 80px; min-height: 80px; }
  }
`;

function MarqueeRow({ images, direction, useImg = false, reverse = false }) {
  const duplicated = useMemo(() => [...images, ...images], [images]);
  const animateClass = direction === 'left' ? 'tsm-animate-left' : 'tsm-animate-right';

  return (
    <div className="tsm-row-outer">
      <div className={`tsm-row-inner ${animateClass} ${reverse ? 'tsm-animate-reverse' : ''}`}>
        {duplicated.map((src, i) => (
          <div key={`${src}-${i}`} className="tsm-logo-box" title={src.replace('.png', '')}>
            {useImg ? (
              <img src={`/languages/${src}`} alt={src.replace('.png', '')} />
            ) : (
              <Image
                src={`/languages/${src}`}
                alt={src.replace('.png', '')}
                width={80}
                height={80}
                className="object-contain w-full h-full"
                unoptimized
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechStackMarquee({ showTitle = true, id = 'tech-stack', className = '' }) {
  const { t } = useLanguage();
  const title = t('techStackTitle') || 'TECH STACK';
  const [scrollDirection, setScrollDirection] = useState('down'); // 'down' | 'up'

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      if (scrollY !== lastScrollY) {
        setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
        lastScrollY = scrollY;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // When scrolling down: row1 left, row2 right. When scrolling up: reverse both.
  const reversed = scrollDirection === 'up';

  const maskStyle = {
    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
  };

  const isEmbedded = !showTitle;

  return (
    <section
      id={id}
      className={showTitle ? 'py-16 sm:py-20 bg-black scroll-mt-20' : `py-6 sm:py-8 ${className}`.trim()}
      data-gsap="fade-up"
      style={
        isEmbedded
          ? { position: 'relative', zIndex: 1, width: '100%', minHeight: 200 }
          : undefined
      }
    >
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_STYLES }} />
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6"
        style={{ width: '100%', maxWidth: isEmbedded ? '100%' : undefined }}
      >
        {showTitle && (
          <div className="text-center mb-12 sm:mb-14">
            <div className="section-title-wrap inline-block">
              <h2 className="section-title-text text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
                {title}
              </h2>
              <div className="section-title-line section-title-line-center w-20 h-1 bg-red-500 mx-auto mb-6 rounded-full" />
            </div>
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Technologies & tools I work with
            </p>
          </div>
        )}

        {/* Row 1: direction follows scroll (down = left, up = right) */}
        <div
          style={{
            overflow: 'hidden',
            minHeight: 88,
            width: '100%',
            ...(isEmbedded ? {} : maskStyle),
          }}
        >
          <MarqueeRow images={LANGUAGE_IMAGES} direction="left" reverse={reversed} useImg={isEmbedded} />
        </div>

        {/* Row 2: scrolls right (reverses when scroll up) */}
        <div
          style={{
            overflow: 'hidden',
            minHeight: 88,
            width: '100%',
            ...(isEmbedded ? {} : maskStyle),
          }}
        >
          <MarqueeRow images={LANGUAGE_IMAGES} direction="right" reverse={reversed} useImg={isEmbedded} />
        </div>
      </div>
    </section>
  );
}
