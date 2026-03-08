'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import {
  FileDown,
  Mail,
  Phone,
  Link2,
  Briefcase,
  Rocket,
  GraduationCap,
  Zap,
} from 'lucide-react';

// Reusable section header for resume blocks (large = no icon, bigger title) with hover animation
function SectionHeader({ title, icon: Icon, large }) {
  return (
    <header className={`section-title-wrap group ${large ? 'mb-8 sm:mb-12' : 'mb-6 sm:mb-8'}`}>
      <div className={`flex items-center gap-3 mb-2 ${large ? 'mb-4' : ''}`}>
        {Icon && (
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="w-5 h-5" />
          </span>
        )}
        <h2 className={`section-title-text inline-block ${
          large
            ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight'
            : 'text-xl sm:text-2xl font-bold text-white tracking-tight'
        }`}>
          {title}
        </h2>
      </div>
      <div className={`section-title-line bg-red-500 rounded-full ${large ? 'w-20 h-1' : 'w-12 h-0.5'}`} />
    </header>
  );
}

// Function to calculate experience duration
const calculateExperienceDuration = (startDate, endDate = null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  let duration = '';
  if (years > 0) {
    duration += `${years} year${years > 1 ? 's' : ''}`;
    if (months > 0) duration += ` ${months} month${months > 1 ? 's' : ''}`;
  } else if (months > 0) {
    duration += `${months} month${months > 1 ? 's' : ''}`;
  }
  return duration || 'Just started';
};

export default function ResumeSection() {
  const sectionRef = useRef(null);
  const { t } = useLanguage();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume/resume.pdf';
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      ref={sectionRef}
      id="resume"
      className="py-16 sm:py-24 bg-black min-h-screen scroll-mt-20"
      data-gsap="fade-up"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Page title + CTA */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="section-title-wrap inline-block">
            <h1 className="section-title-text text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Resume
            </h1>
            <div className="section-title-line section-title-line-center w-16 h-0.5 bg-red-500 rounded-full mx-auto" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xl mx-auto mt-6">
            Experience, projects, education & skills at a glance.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <FileDown className="w-5 h-5" aria-hidden />
            Download PDF
          </button>
        </div>

        <div className="space-y-12 sm:space-y-16" data-gsap="stagger">
          {/* ——— Contact ——— */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8" data-gsap-item>
            <SectionHeader title={t('contact')} icon={Mail} />
            <div className="space-y-4">
              <p className="text-white font-semibold text-lg">ALFAYAD S</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-red-400" aria-hidden />
                  <a href="mailto:alfayadshameer056@gmail.com" className="hover:text-white transition-colors break-all">
                    alfayadshameer056@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-red-400" aria-hidden />
                  <span>9074575374</span>
                </li>
                <li className="flex items-center gap-3">
                  <Link2 className="w-4 h-4 shrink-0 text-red-400" aria-hidden />
                  <span>Github / LinkedIn: Alfayad S</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ——— Experience ——— */}
          <div className="rounded-2xl bg-black overflow-hidden" data-gsap-item>
            <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6">
              <SectionHeader title={t('experience')} large />
            </div>
            <div className="space-y-0">
              {[
                {
                  company: 'CODETEAK PRIVATE LIMITED',
                  period: 'Apr 2025 – Present · Remote',
                  duration: calculateExperienceDuration('2025-04-10'),
                  durationColor: 'text-green-400',
                  description: t('codeTeakDescription'),
                  bullets: null,
                  logo: '/codeteak-logo.jpg',
                  logoBg: 'bg-blue-600/20 border-blue-500/20',
                  fallback: 'CT',
                  fallbackBg: 'bg-blue-600',
                },
                {
                  company: 'BROTOTYPE',
                  period: 'Jan 2024 – Dec 2025 · Offline',
                  duration: calculateExperienceDuration('2024-04-01', '2025-04-09'),
                  durationColor: 'text-amber-400',
                  description: null,
                  bullets: [t('brototypeDescription'), t('brototypeDescription2')],
                  logo: '/brototype-logo.png',
                  logoBg: 'bg-orange-600/20 border-orange-500/20',
                  fallback: 'BT',
                  fallbackBg: 'bg-orange-600',
                },
                {
                  company: 'FREELANCER',
                  period: 'Jan 2024 – Present · Remote',
                  duration: calculateExperienceDuration('2024-01-01'),
                  durationColor: 'text-purple-400',
                  description: null,
                  bullets: [t('freelancerDescription'), t('freelancerDescription2')],
                  logo: '/freelance-logo.png',
                  logoBg: 'bg-purple-600/20 border-purple-500/20',
                  fallback: 'FL',
                  fallbackBg: 'bg-purple-600',
                },
              ].map((job, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <article
                    key={job.company}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 sm:py-14 px-6 sm:px-8 md:px-10 border-t border-zinc-800/80 first:border-t-0 transition-colors hover:bg-zinc-900/30"
                  >
                    {/* Content block — left on even index, right on odd */}
                    <div className={isLeft ? 'lg:order-1' : 'lg:order-2'}>
                      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                          {job.company}
                        </h3>
                        <span className={`text-sm sm:text-base font-semibold ${job.durationColor}`}>
                          {job.duration}
                        </span>
                      </div>
                      <p className="text-red-400/90 text-base sm:text-lg font-medium mb-5 sm:mb-6">
                        {job.period}
                      </p>
                      {job.description && (
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                          {job.description}
                        </p>
                      )}
                      {job.bullets && (
                        <ul className="text-gray-400 text-base sm:text-lg leading-relaxed space-y-2 list-disc list-inside">
                          {job.bullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Logo / visual block — right on even index, left on odd (no bg) */}
                    <div className={`flex justify-center ${isLeft ? 'lg:order-2 lg:justify-end' : 'lg:order-1 lg:justify-start'}`}>
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center shrink-0 ${job.company === 'CODETEAK PRIVATE LIMITED' ? 'bg-white rounded-xl p-4 sm:p-5 md:p-6' : 'overflow-hidden'}`}>
                        <Image
                          src={job.logo}
                          alt={job.company}
                          width={192}
                          height={192}
                          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <span className="hidden w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                          {job.fallback}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ——— Projects ——— */}
          <div className="rounded-2xl bg-black overflow-hidden" data-gsap-item>
            <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6">
              <SectionHeader title={t('projects')} large />
            </div>
            <div className="space-y-0">
              {[
                {
                  title: 'Fayad AI',
                  tag: 'LIVE',
                  href: 'https://fayad-ai.vercel.app',
                  desc: 'My AI counterpart—a conversational assistant built with Next.js and powered by Gemini. Chat, get code help, and explore ideas. Fully responsive with streaming responses and modern UI.',
                  tech: ['Next.js', 'Gemini API', 'Vercel', 'Tailwind'],
                  thumbnail: '/project-thumbnail/fayad-ai.jpg',
                },
                {
                  title: 'FD-Postman-CLI',
                  tag: 'NPM',
                  href: 'https://www.npmjs.com/package/fd-postman-cli',
                  npmHref: 'https://www.npmjs.com/package/fd-postman-cli',
                  desc: 'Use Postman from the terminal. Send requests, manage collections, and test APIs without leaving the CLI. Install globally with npm i -g fd-postman-cli. Published and live on npm.',
                  tech: ['Node.js', 'CLI', 'NPM'],
                  thumbnail: '/project-thumbnail/fd-postman-cli.jpg',
                },
                {
                  title: 'Redux Auto Slice',
                  tag: 'NPM',
                  href: 'https://www.npmjs.com/package/redux-auto-slice',
                  desc: 'NPM package for automatic Redux slice creation. Reduces boilerplate and speeds up state setup in Redux projects. Install from npm and integrate into your Redux toolkit workflow.',
                  tech: ['Redux', 'NPM', 'JavaScript'],
                  thumbnail: '/project-thumbnail/redux-auto-slice.jpg',
                },
                {
                  title: 'TraceX',
                  tag: 'LIVE',
                  href: 'https://tracexx.vercel.app',
                  desc: 'Personal expense tracking app. Log spending, categorize transactions, and keep your finances in one place. Built for daily use with a clean, simple interface.',
                  tech: ['Next.js', 'Vercel', 'Full Stack'],
                  thumbnail: '/project-thumbnail/tracex.jpg',
                },
                {
                  title: 'Codeteak',
                  tag: 'LIVE',
                  href: 'https://codeteak.com',
                  desc: 'Official company website for Codeteak. Showcases services, team, and brand. Built and designed for the company with a professional, modern look.',
                  tech: ['Next.js', 'Tailwind', 'Vercel'],
                  thumbnail: '/project-thumbnail/codeteak.jpg',
                },
                {
                  title: 'Yaadro',
                  tag: 'LIVE',
                  href: 'https://yaadro.ae',
                  desc: "Codeteak's product—a full application and website. I led as full-stack developer and designer: architecture, frontend, backend, and UI/UX. Live at yaadro.ae.",
                  tech: ['Full Stack', 'Design', 'Codeteak'],
                  thumbnail: '/project-thumbnail/yaadro.jpg',
                },
                {
                  title: 'QH Valet',
                  tag: 'FREELANCE',
                  href: 'https://qhvalet.com',
                  desc: 'Freelance project for a valet parking business. Website with booking, real-time availability, and a modern UI. Built for client delivery and long-term use.',
                  tech: ['Next.js', 'Redux', 'Tailwind'],
                  thumbnail: '/project-thumbnail/qhvalet.jpg',
                },
                {
                  title: 'Chaise',
                  tag: 'FREELANCE',
                  href: 'https://chaise.vercel.app',
                  desc: 'Freelance website for a restaurant and cafe. Menu, ambiance, and contact in one place. Designed and built for the brand with a focus on atmosphere and usability.',
                  tech: ['Next.js', 'Vercel', 'Restaurant'],
                  thumbnail: '/project-thumbnail/chaise.jpg',
                },
              ].map((p, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <article
                    key={p.title}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 sm:py-14 px-6 sm:px-8 md:px-10 border-t border-zinc-800/80 first:border-t-0 transition-colors hover:bg-zinc-900/30"
                  >
                    <div className={isLeft ? 'lg:order-1' : 'lg:order-2'}>
                      <div className="flex flex-wrap items-baseline gap-3 mb-3">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                          {p.title}
                        </h3>
                        <span className="text-sm sm:text-base font-semibold text-red-400">
                          {p.tag}
                        </span>
                      </div>
                      <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
                        {p.tech.map((techName) => (
                          <span key={techName} className="text-xs sm:text-sm px-3 py-1 rounded-md bg-zinc-800/80 text-gray-400">
                            {techName}
                          </span>
                        ))}
                      </div>
                      {p.href ? (
                        <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 text-base sm:text-lg font-semibold transition-colors inline-flex items-center gap-1">
                          View project →
                        </a>
                      ) : (
                        <span className="text-gray-500 text-base sm:text-lg">Portfolio / Private</span>
                      )}
                    </div>
                    <div className={`flex justify-center ${isLeft ? 'lg:order-2 lg:justify-end' : 'lg:order-1 lg:justify-start'}`}>
                      <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-zinc-900/50">
                        <Image
                          src={p.thumbnail}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 448px"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ——— Education ——— */}
          <div className="rounded-2xl bg-black overflow-hidden" data-gsap-item>
            <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6">
              <SectionHeader title={t('education')} large />
            </div>
            <div className="space-y-0">
              {[
                {
                  school: 'BROTOTYPE ACADEMY',
                  subtitle: t('brototypeEdu'),
                  desc: t('brototypeEduDesc'),
                  tags: ['MERN', 'Full Stack'],
                  date: 'Graduated Dec 2024',
                  accent: 'orange',
                  image: '/brototype-logo.png',
                },
                {
                  school: 'TD HIGHER SECONDARY',
                  subtitle: t('tdEdu'),
                  desc: t('tdEduDesc'),
                  tags: ['Computer Science'],
                  date: 'Jul 2022 – Mar 2024',
                  accent: 'green',
                  image: '/td-school.png',
                },
                {
                  school: 'LEO XIII HIGHER SECONDARY',
                  subtitle: t('leoEdu'),
                  desc: t('leoEduDesc'),
                  tags: ['10th Grade'],
                  date: 'May 2021 – Mar 2022',
                  accent: 'blue',
                  image: '/leo-school.png',
                },
              ].map((edu, index) => {
                const isLeft = index % 2 === 0;
                const accentBg = edu.accent === 'orange' ? 'text-orange-400' : edu.accent === 'green' ? 'text-green-400' : 'text-blue-400';
                return (
                  <article
                    key={edu.school}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 sm:py-14 px-6 sm:px-8 md:px-10 border-t border-zinc-800/80 first:border-t-0 transition-colors hover:bg-zinc-900/30"
                  >
                    <div className={isLeft ? 'lg:order-1' : 'lg:order-2'}>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        {edu.school}
                      </h3>
                      <p className="text-red-400/90 text-base sm:text-lg font-medium mb-4">
                        {edu.subtitle}
                      </p>
                      <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
                        {edu.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                        {edu.tags.map((tag) => (
                          <span key={tag} className="text-xs sm:text-sm px-3 py-1 rounded-md bg-zinc-800/80 text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className={`text-sm sm:text-base font-semibold ${accentBg}`}>
                        {edu.date}
                      </p>
                    </div>
                    <div className={`flex justify-center ${isLeft ? 'lg:order-2 lg:justify-end' : 'lg:order-1 lg:justify-start'}`}>
                      <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900/50">
                        <Image
                          src={edu.image}
                          alt={edu.school}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 448px"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <span className={`hidden absolute inset-0 flex items-center justify-center ${accentBg} opacity-90`} aria-hidden>
                          <GraduationCap className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ——— Skills ——— */}
          <div className="rounded-2xl bg-black overflow-hidden" data-gsap-item>
            <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6">
              <SectionHeader title={t('skills')} large />
            </div>
            <div className="space-y-0">
              {[
                {
                  title: t('programming'),
                  items: [
                    { label: t('years3plus'), text: 'JavaScript · Node.js · Express · React' },
                    { label: t('years2plus'), text: 'TypeScript · MongoDB · Python · Java · HTML · CSS' },
                    { label: t('year1plus'), text: 'Tailwind · Bootstrap · MySQL · PostgreSQL' },
                    { label: t('familiarWith'), text: 'React Native · Electron · Angular · Firebase' },
                  ],
                },
                {
                  title: t('technologies'),
                  items: null,
                  text: 'Git · GitHub · GitLab · Docker · Kubernetes · CI/CD · AWS · Firebase',
                },
                {
                  title: t('additionalSkills'),
                  items: null,
                  text: `${t('uiUx')} · ${t('performance')}`,
                },
                {
                  title: t('coursework'),
                  items: [
                    { label: t('webDev'), text: `${t('backendDev')} · ${t('frontendDesign')} · ${t('dbManagement')}` },
                    { label: t('softwareEng'), text: `${t('oop')} · ${t('agile')} · ${t('versionControl')}` },
                    { label: t('databases'), text: `${t('relationalDb')} · ${t('nosqlDb')}` },
                  ],
                },
              ].map((block, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <article
                    key={block.title}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 sm:py-14 px-6 sm:px-8 md:px-10 border-t border-zinc-800/80 first:border-t-0 transition-colors hover:bg-zinc-900/30"
                  >
                    <div className={isLeft ? 'lg:order-1' : 'lg:order-2'}>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-5 sm:mb-6">
                        {block.title}
                      </h3>
                      {block.items ? (
                        <ul className="space-y-2 sm:space-y-3">
                          {block.items.map((item) => (
                            <li key={item.label} className="text-gray-400 text-base sm:text-lg leading-relaxed">
                              <span className="text-red-400/90 font-medium">{item.label}:</span> {item.text}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                          {block.text}
                        </p>
                      )}
                    </div>
                    <div className={`flex justify-center ${isLeft ? 'lg:order-2 lg:justify-end' : 'lg:order-1 lg:justify-start'}`}>
                      <span className="flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-red-400/90" aria-hidden>
                        <Zap className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
