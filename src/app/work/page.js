'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ScrollTriggerAnimations from '@/components/ScrollTriggerAnimations';

const WORK_PROJECTS = [
  {
    title: 'Fayad AI',
    subtitle: 'Personal AI Assistant',
    description: 'My AI counterpart—a conversational assistant built with Next.js and Gemini. Chat, get code help, and explore ideas. Fully responsive with streaming responses.',
    thumbnail: '/project-thumbnail/fayad-ai.jpg',
    href: 'https://fayad-ai.vercel.app',
    badge: 'LIVE',
    badgeClass: 'bg-red-500/20 text-red-400',
    tech: ['Next.js', 'Gemini API', 'Vercel', 'Tailwind'],
  },
  {
    title: 'FD-Postman-CLI',
    subtitle: 'NPM Package',
    description: 'Use Postman from the terminal. Send requests, manage collections, and test APIs without leaving the CLI. Install: npm i -g fd-postman-cli.',
    thumbnail: '/project-thumbnail/fd-postman-cli.jpg',
    href: 'https://www.npmjs.com/package/fd-postman-cli',
    badge: 'NPM',
    badgeClass: 'bg-amber-500/20 text-amber-400',
    tech: ['Node.js', 'CLI', 'NPM'],
  },
  {
    title: 'Redux Auto Slice',
    subtitle: 'NPM Package',
    description: 'Automatic Redux slice creation. Reduces boilerplate and speeds up state setup in Redux projects. Install from npm.',
    thumbnail: '/project-thumbnail/redux-auto-slice.jpg',
    href: 'https://www.npmjs.com/package/redux-auto-slice',
    badge: 'NPM',
    badgeClass: 'bg-purple-500/20 text-purple-400',
    tech: ['Redux', 'NPM', 'JavaScript'],
  },
  {
    title: 'TraceX',
    subtitle: 'Expense Tracking',
    description: 'Personal expense tracking app. Log spending, categorize transactions, and keep your finances in one place with a clean, simple interface.',
    thumbnail: '/project-thumbnail/tracex.jpg',
    href: 'https://tracexx.vercel.app',
    badge: 'LIVE',
    badgeClass: 'bg-emerald-500/20 text-emerald-400',
    tech: ['Next.js', 'Vercel', 'Full Stack'],
  },
  {
    title: 'Codeteak',
    subtitle: 'Company Website',
    description: 'Official company website for Codeteak. Showcases services, team, and brand with a professional, modern look.',
    thumbnail: '/project-thumbnail/codeteak.jpg',
    href: 'https://codeteak.com',
    badge: 'LIVE',
    badgeClass: 'bg-blue-500/20 text-blue-400',
    tech: ['Next.js', 'Tailwind', 'Vercel'],
  },
  {
    title: 'Yaadro',
    subtitle: 'Codeteak Product',
    description: "Full application and website for Codeteak. Full-stack development and design—architecture, frontend, backend, and UI/UX. Live at yaadro.ae.",
    thumbnail: '/project-thumbnail/yaadro.jpg',
    href: 'https://yaadro.ae',
    badge: 'LIVE',
    badgeClass: 'bg-cyan-500/20 text-cyan-400',
    tech: ['Full Stack', 'Design', 'Codeteak'],
  },
  {
    title: 'QH Valet',
    subtitle: 'Freelance',
    description: 'Valet parking business website with booking, real-time availability, and a modern UI. Built for client delivery.',
    thumbnail: '/project-thumbnail/qhvalet.jpg',
    href: 'https://qhvalet.com',
    badge: 'LIVE',
    badgeClass: 'bg-green-500/20 text-green-400',
    tech: ['Next.js', 'Redux', 'Tailwind'],
  },
  {
    title: 'Chaise',
    subtitle: 'Restaurant & Cafe',
    description: 'Freelance website for a restaurant and cafe. Menu, ambiance, and contact in one place. Designed for the brand with focus on atmosphere.',
    thumbnail: '/project-thumbnail/chaise.jpg',
    href: 'https://chaise.vercel.app',
    badge: 'LIVE',
    badgeClass: 'bg-rose-500/20 text-rose-400',
    tech: ['Next.js', 'Vercel', 'Restaurant'],
  },
];

export default function WorkPage() {
  const sectionRef = useRef(null);
  const { t } = useLanguage();

  return (
    <ScrollTriggerAnimations isActive={true}>
      <div ref={sectionRef} className="min-h-screen bg-black">
        {/* Hero */}
        <header className="pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center" data-gsap="fade-up">
            <p className="text-red-400 text-sm sm:text-base font-semibold tracking-widest uppercase mb-4">
              Portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
              My <span className="text-red-500">Work</span>
            </h1>
            <div className="w-20 h-1 bg-red-500 rounded-full mx-auto mb-8" />
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Selected projects—from AI apps and npm packages to company sites and freelance work. Each built with modern stack and attention to detail.
            </p>
          </div>
        </header>

        {/* Projects grid */}
        <section className="pb-20 sm:pb-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" data-gsap="stagger">
              {WORK_PROJECTS.map((project, index) => (
                <article
                  key={project.title}
                  className="group rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-500"
                  data-gsap-item
                >
                  <Link href={project.href} target="_blank" rel="noopener noreferrer" className="block">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden bg-zinc-900">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${project.badgeClass}`}>
                        {project.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-red-400 transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-red-400/90 text-sm font-medium mb-4">
                        {project.subtitle}
                      </p>
                      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((techName) => (
                          <span key={techName} className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-gray-400 text-xs font-medium">
                            {techName}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 text-red-400 text-sm font-semibold group-hover:gap-3 transition-all">
                        View project
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24 border-t border-zinc-800/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center" data-gsap="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Start a project
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
              Have an idea? Let&apos;s build it with a modern stack and clear process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:alfayadshameer056@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                Get in touch
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-zinc-600 text-gray-300 hover:text-white hover:border-zinc-500 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ScrollTriggerAnimations>
  );
}
