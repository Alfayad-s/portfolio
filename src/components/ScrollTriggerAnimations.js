'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const defaultFrom = { y: 60, opacity: 0 };
const defaultTo = {
  y: 0,
  opacity: 1,
  duration: 0.9,
  ease: 'power3.out',
  overwrite: 'auto',
};

/**
 * Sets up GSAP ScrollTrigger animations for elements with data-gsap attributes.
 * - data-gsap="fade-up" — fade in and slide up when entering viewport
 * - data-gsap="fade-up stagger" — same, with staggered children (use data-gsap-stagger on parent)
 * - data-gsap-delay="0.2" — optional delay in seconds
 */
export function useScrollTriggerAnimations(isActive = true) {
  const ctx = useRef(null);

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    ctx.current = gsap.context(() => {
      // Single elements: fade-up
      gsap.utils.toArray('[data-gsap="fade-up"]').forEach((el) => {
        const delay = parseFloat(el.dataset.gsapDelay || '0');
        gsap.fromTo(
          el,
          { ...defaultFrom },
          {
            ...defaultTo,
            delay,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'bottom 12%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Stagger containers: animate children with stagger
      gsap.utils.toArray('[data-gsap="stagger"]').forEach((container) => {
        const children = container.querySelectorAll('[data-gsap-item]');
        const delay = parseFloat(container.dataset.gsapDelay || '0');
        if (children.length) {
          gsap.fromTo(
            children,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.12,
              delay,
              overwrite: 'auto',
              scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });

      // Scale-in (subtle zoom) for hero-style sections
      gsap.utils.toArray('[data-gsap="scale-in"]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.98, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => {
      ctx.current?.revert();
    };
  }, [isActive]);
}

export default function ScrollTriggerAnimations({ children, isActive = true }) {
  useScrollTriggerAnimations(isActive);
  return children;
}
