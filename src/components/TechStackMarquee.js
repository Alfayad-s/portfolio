'use client';

import { useMemo } from 'react';
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

function MarqueeRow({ images, direction }) {
  const duplicated = useMemo(() => [...images, ...images], [images]);
  const animateClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="overflow-hidden py-4 flex">
      <div className={`flex shrink-0 gap-12 items-center ${animateClass}`}>
        {duplicated.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg bg-white/5 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
            title={src.replace('.png', '')}
          >
            <Image
              src={`/languages/${src}`}
              alt={src.replace('.png', '')}
              width={80}
              height={80}
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechStackMarquee() {
  const { t } = useLanguage();
  const title = t('techStackTitle') || 'TECH STACK';

  return (
    <section className="py-16 sm:py-20 bg-black" data-gsap="fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

        {/* Row 1: scrolls left */}
        <div
          className="overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <MarqueeRow images={LANGUAGE_IMAGES} direction="left" />
        </div>

        {/* Row 2: scrolls right */}
        <div
          className="overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <MarqueeRow images={LANGUAGE_IMAGES} direction="right" />
        </div>
      </div>
    </section>
  );
}
