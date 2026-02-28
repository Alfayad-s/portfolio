'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ScrollTriggerAnimations from '@/components/ScrollTriggerAnimations';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';

const WORK_PROJECTS = [
  {
    title: 'Fayad AI',
    subtitle: 'Personal AI Assistant',
    description: 'My AI counterpart—a conversational assistant built with Next.js and Gemini. Chat, get code help, and explore ideas. Fully responsive with streaming responses.',
    thumbnail: '/project-thumbnail/fayad-ai.jpg',
    href: 'https://fayad-ai.vercel.app',
    badge: 'LIVE',
    index: '01',
    tech: ['Next.js', 'Gemini API', 'Vercel', 'Tailwind'],
  },
  {
    title: 'FD-Postman-CLI',
    subtitle: 'NPM Package',
    description: 'Use Postman from the terminal. Send requests, manage collections, and test APIs without leaving the CLI. Install: npm i -g fd-postman-cli.',
    thumbnail: '/project-thumbnail/fd-postman-cli.jpg',
    href: 'https://www.npmjs.com/package/fd-postman-cli',
    badge: 'NPM',
    index: '02',
    tech: ['Node.js', 'CLI', 'NPM'],
  },
  {
    title: 'Redux Auto Slice',
    subtitle: 'NPM Package',
    description: 'Automatic Redux slice creation. Reduces boilerplate and speeds up state setup in Redux projects. Install from npm.',
    thumbnail: '/project-thumbnail/redux-auto-slice.jpg',
    href: 'https://www.npmjs.com/package/redux-auto-slice',
    badge: 'NPM',
    index: '03',
    tech: ['Redux', 'NPM', 'JavaScript'],
  },
  {
    title: 'TraceX',
    subtitle: 'Expense Tracking',
    description: 'Personal expense tracking app. Log spending, categorize transactions, and keep your finances in one place with a clean, simple interface.',
    thumbnail: '/project-thumbnail/tracex.jpg',
    href: 'https://tracexx.vercel.app',
    badge: 'LIVE',
    index: '04',
    tech: ['Next.js', 'Vercel', 'Full Stack'],
  },
  {
    title: 'Codeteak',
    subtitle: 'Company Website',
    description: 'Official company website for Codeteak. Showcases services, team, and brand with a professional, modern look.',
    thumbnail: '/project-thumbnail/codeteak.jpg',
    href: 'https://codeteak.com',
    badge: 'LIVE',
    index: '05',
    tech: ['Next.js', 'Tailwind', 'Vercel'],
  },
  {
    title: 'Yaadro',
    subtitle: 'Codeteak Product',
    description: 'Full application and website for Codeteak. Full-stack development and design—architecture, frontend, backend, and UI/UX. Live at yaadro.ae.',
    thumbnail: '/project-thumbnail/yaadro.jpg',
    href: 'https://yaadro.ae',
    badge: 'LIVE',
    index: '06',
    tech: ['Full Stack', 'Design', 'Codeteak'],
  },
  {
    title: 'QH Valet',
    subtitle: 'Freelance',
    description: 'Valet parking business website with booking, real-time availability, and a modern UI. Built for client delivery.',
    thumbnail: '/project-thumbnail/qhvalet.jpg',
    href: 'https://qhvalet.com',
    badge: 'LIVE',
    index: '07',
    tech: ['Next.js', 'Redux', 'Tailwind'],
  },
  {
    title: 'Chaise',
    subtitle: 'Restaurant & Cafe',
    description: 'Freelance website for a restaurant and cafe. Menu, ambiance, and contact in one place. Designed for the brand with focus on atmosphere.',
    thumbnail: '/project-thumbnail/chaise.jpg',
    href: 'https://chaise.vercel.app',
    badge: 'LIVE',
    index: '08',
    tech: ['Next.js', 'Vercel', 'Restaurant'],
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --red: #e01c1c;
    --red-dim: rgba(224,28,28,0.10);
    --red-border: rgba(224,28,28,0.22);
    --white: #f5f5f0;
    --gray: #888;
    --gray-light: #aaa;
    --black: #080808;
    --black2: #0f0f0f;
  }

  .wp-root {
    background: var(--black);
    min-height: 100vh;
    font-family: 'OffBit-DotBold', sans-serif;
    color: var(--white);
    overflow-x: hidden;
  }

  /* noise */
  .wp-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px; opacity: 0.35;
  }
  .wp-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(224,28,28,0.012) 2px, rgba(224,28,28,0.012) 4px);
  }

  .wp-inner { position: relative; z-index: 1; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(28px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes lineExpand {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  /* ── HERO ── */
  .wp-hero {
    padding: 7rem 2rem 5rem;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: end;
  }
  @media(max-width:760px){ .wp-hero { grid-template-columns:1fr; gap:2.5rem; padding:5rem 1.5rem 3rem; } }

  .wp-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--red); font-weight: 500; margin-bottom: 1.5rem;
    opacity: 0; animation: fadeUp 0.6s 0.1s forwards;
  }
  .wp-eyebrow::before { content:''; width:32px; height:1px; background:var(--red); }

  .wp-h1 {
    font-family: 'OffBit-DotBold', sans-serif;
    font-size: clamp(5rem, 12vw, 10rem);
    line-height: 0.88; letter-spacing: 0.02em; margin: 0;
    opacity: 0; animation: fadeUp 0.8s 0.2s forwards;
  }
  .wp-h1 span { color: var(--red); }

  .wp-hero-right {
    padding-bottom: 0.5rem;
    opacity: 0; animation: fadeUp 0.8s 0.35s forwards;
  }
  .wp-hero-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 5rem; line-height: 1; color: rgba(224,28,28,0.15);
    margin-bottom: 1rem; letter-spacing: 0.02em;
  }
  .wp-hero-desc { color: var(--gray); font-size: 1.05rem; line-height: 1.8; font-weight: 300; margin-bottom: 2rem; }

  .wp-nav-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 0.7rem 1.5rem; border: 1px solid var(--red-border);
    color: var(--gray); font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;
    text-decoration: none; transition: all 0.3s; font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden;
  }
  .wp-nav-btn::before {
    content:''; position:absolute; inset:0; background:var(--red-dim);
    transform:scaleX(0); transform-origin:left; transition:transform 0.3s;
  }
  .wp-nav-btn:hover::before { transform:scaleX(1); }
  .wp-nav-btn:hover { color:var(--white); border-color:var(--red); }

  /* ── DIVIDER ── */
  .wp-divider {
    max-width: 1100px; margin: 0 auto; padding: 0 2rem;
    display: flex; align-items: center; gap: 1.5rem;
  }
  .wp-divider-line { flex:1; height:1px; background:var(--red-border); }
  .wp-divider-dot { width:6px; height:6px; background:var(--red); transform:rotate(45deg); flex-shrink:0; }

  /* ── PROJECT GRID ── */
  .wp-list-section { max-width: 1100px; margin: 0 auto; padding: 5rem 2rem; }

  .wp-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px; background: var(--red-border);
  }
  @media(max-width:640px){ .wp-grid { grid-template-columns: 1fr; } }

  .wp-project-card {
    background: var(--black);
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
    opacity: 0; animation: fadeUp 0.65s forwards;
    transition: background 0.3s;
  }
  .wp-project-card:hover { background: var(--black2); }

  /* full-width image */
  .wp-card-img {
    position: relative;
    width: 100%; aspect-ratio: 16/9;
    overflow: hidden; flex-shrink: 0;
  }
  .wp-card-img-overlay {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.4s;
  }
  .wp-project-card:hover .wp-card-img-overlay { opacity: 1; }
  .wp-card-img img { transition: transform 0.6s ease !important; }
  .wp-project-card:hover .wp-card-img img { transform: scale(1.04) !important; }

  /* badge on image */
  .wp-card-badge {
    position: absolute; top: 1rem; left: 1rem; z-index: 2;
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--red); background: rgba(8,8,8,0.85);
    border: 1px solid var(--red-border); padding: 0.3rem 0.7rem;
    backdrop-filter: blur(4px);
  }
  .wp-card-num {
    position: absolute; top: 1rem; right: 1rem; z-index: 2;
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
    color: rgba(245,245,240,0.3); letter-spacing: 0.08em;
  }

  /* content below image */
  .wp-card-body {
    padding: 1.75rem 2rem 2rem;
    display: flex; flex-direction: column; flex: 1;
    border-top: 1px solid var(--red-border);
  }

  .wp-card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 0.04em; line-height: 1;
    margin-bottom: 0.3rem; transition: color 0.3s;
  }
  .wp-project-card:hover .wp-card-title { color: var(--red); }

  .wp-card-sub {
    font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--red); margin-bottom: 1rem; opacity: 0.8;
  }

  .wp-card-desc {
    color: var(--gray); font-size: 0.88rem; line-height: 1.7;
    font-weight: 300; margin-bottom: 1.5rem; flex: 1;
  }

  .wp-card-footer {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
  }
  .wp-card-tech { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .wp-tech-tag {
    font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gray); border: 1px solid var(--red-border); padding: 0.2rem 0.5rem;
    transition: all 0.3s;
  }
  .wp-project-card:hover .wp-tech-tag { border-color: rgba(224,28,28,0.4); color: var(--gray-light); }

  .wp-card-arrow {
    color: var(--gray); transition: all 0.35s; flex-shrink: 0;
  }
  .wp-project-card:hover .wp-card-arrow { color: var(--red); transform: translate(3px, -3px); }

  /* ── FEATURED PROJECT (large card at top) ── */
  .wp-featured {
    max-width: 1100px; margin: 0 auto; padding: 5rem 2rem 0;
  }
  .wp-featured-card {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
    background: var(--red-border);
    opacity: 0; animation: fadeUp 0.8s 0.5s forwards;
  }
  @media(max-width:760px){ .wp-featured-card { grid-template-columns: 1fr; } }

  .wp-featured-img {
    position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--black2);
  }
  .wp-featured-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(224,28,28,0.15) 0%, transparent 60%);
    z-index: 1; pointer-events: none;
  }

  .wp-featured-content {
    background: var(--black); padding: 3.5rem 3rem;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  @media(max-width:760px){ .wp-featured-content { padding: 2.5rem 2rem; } }

  .wp-featured-label {
    font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--red); margin-bottom: 1rem;
  }
  .wp-featured-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4rem); line-height: 0.95; letter-spacing: 0.03em;
    margin-bottom: 1rem;
  }
  .wp-featured-sub { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; }
  .wp-featured-desc { color: var(--gray); font-size: 0.92rem; line-height: 1.75; font-weight: 300; flex: 1; margin-bottom: 2rem; }

  .wp-featured-tech { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 2.5rem; }
  .wp-featured-tag {
    font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gray); border: 1px solid var(--red-border); padding: 0.25rem 0.6rem;
  }

  .wp-featured-link {
    display: inline-flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.5rem; border: 1px solid var(--red-border);
    color: var(--white); font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem; letter-spacing: 0.1em; text-decoration: none;
    transition: all 0.3s; position: relative; overflow: hidden;
  }
  .wp-featured-link::before {
    content:''; position:absolute; inset:0; background:var(--red);
    transform:scaleX(0); transform-origin:left; transition:transform 0.35s; z-index:0;
  }
  .wp-featured-link:hover::before { transform:scaleX(1); }
  .wp-featured-link span, .wp-featured-link svg { position:relative; z-index:1; }
  .wp-featured-link:hover { border-color: var(--red); }

  /* ── CTA ── */
  .wp-cta { padding: 6rem 2rem; text-align: center; }
  .wp-cta-inner { max-width: 700px; margin: 0 auto; }
  .wp-cta-h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 0.95; letter-spacing: 0.02em; margin: 0 0 1.5rem;
  }
  .wp-cta-h2 span { color: var(--red); }
  .wp-cta-sub { color: var(--gray); font-size: 1rem; font-weight: 300; line-height: 1.8; margin-bottom: 3rem; }

  .wp-cta-btns { display: flex; gap: 1px; justify-content: center; flex-wrap: wrap; }
  .wp-cta-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 1.1rem 2.5rem; background: var(--red); color: var(--white);
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.12em;
    text-decoration: none; transition: background 0.3s; position: relative; overflow: hidden;
  }
  .wp-cta-primary::before {
    content:''; position:absolute; inset:0; background:rgba(255,255,255,0.1);
    transform:translateX(-100%); transition:transform 0.4s;
  }
  .wp-cta-primary:hover::before { transform:translateX(0); }
  .wp-cta-primary:hover { background: #c01818; }
  .wp-cta-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 1.1rem 2.5rem; background: transparent;
    border: 1px solid var(--red-border); color: var(--gray);
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.12em;
    text-decoration: none; transition: all 0.3s;
  }
  .wp-cta-secondary:hover { color: var(--white); border-color: var(--red); background: var(--red-dim); }

  /* strip */
  .wp-strip {
    border-top: 1px solid var(--red-border);
    padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;
    font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: #333;
    max-width: 1100px; margin: 0 auto;
  }
`;

export default function WorkPage() {
  const { t } = useLanguage();
  const [visibleRows, setVisibleRows] = useState({});
  const rowRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = entry.target.dataset.rowIndex;
            setVisibleRows(prev => ({ ...prev, [idx]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    rowRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featured = WORK_PROJECTS[0];
  const rest = WORK_PROJECTS.slice(1);

  return (
    <ScrollTriggerAnimations isActive={true}>
      <style>{styles}</style>
      <div className="wp-root">
        <div className="wp-inner">

          {/* ── HERO ── */}
          <section className="wp-hero">
            <div>
              <div className="wp-eyebrow">Portfolio</div>
              <h1 className="wp-h1">
                My<br /><span>Work.</span>
              </h1>
            </div>
            <div className="wp-hero-right">
              <div className="wp-hero-count">0{WORK_PROJECTS.length}</div>
              <p className="wp-hero-desc">
                Selected projects spanning AI apps, npm packages, company sites, and freelance work. Each built with a modern stack and meticulous attention to detail.
              </p>
              <Link href="/" className="wp-nav-btn">
                <ArrowLeft size={13} /> Back to Home
              </Link>
            </div>
          </section>

          <div className="wp-divider">
            <div className="wp-divider-line" />
            <div className="wp-divider-dot" />
            <div className="wp-divider-line" />
          </div>

          {/* ── FEATURED PROJECT ── */}
          <div className="wp-featured">
            <div style={{ marginBottom: '1rem' }}>
              <div className="wp-eyebrow" style={{ opacity: 1, animation: 'none' }}>Featured Project</div>
            </div>
            <div className="wp-featured-card">
              <div className="wp-featured-img">
                <Image src={featured.thumbnail} alt={featured.title} fill className="object-cover" sizes="(max-width:760px) 100vw, 50vw" />
                <div className="wp-featured-overlay" />
              </div>
              <div className="wp-featured-content">
                <div>
                  <div className="wp-featured-label">Project {featured.index} · {featured.badge}</div>
                  <div className="wp-featured-title">{featured.title}</div>
                  <div className="wp-featured-sub">{featured.subtitle}</div>
                  <p className="wp-featured-desc">{featured.description}</p>
                  <div className="wp-featured-tech">
                    {featured.tech.map(t => <span key={t} className="wp-featured-tag">{t}</span>)}
                  </div>
                </div>
                <a href={featured.href} target="_blank" rel="noopener noreferrer" className="wp-featured-link">
                  <span>View Project</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* ── PROJECT GRID ── */}
          <section className="wp-list-section">
            <div className="wp-grid">
              {rest.map((project, i) => (
                <a
                  key={project.title}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wp-project-card"
                  ref={el => rowRefs.current[i] = el}
                  data-row-index={i}
                  style={visibleRows[i] ? { animationDelay: `${i * 0.08}s` } : { opacity: 0, animationPlayState: 'paused' }}
                >
                  {/* Big image */}
                  <div className="wp-card-img">
                    <Image src={project.thumbnail} alt={project.title} fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" />
                    <div className="wp-card-img-overlay" />
                    <span className="wp-card-badge">{project.badge}</span>
                    <span className="wp-card-num">{project.index}</span>
                  </div>

                  {/* Content */}
                  <div className="wp-card-body">
                    <div className="wp-card-title">{project.title}</div>
                    <div className="wp-card-sub">{project.subtitle}</div>
                    <p className="wp-card-desc">{project.description}</p>
                    <div className="wp-card-footer">
                      <div className="wp-card-tech">
                        {project.tech.map(t => <span key={t} className="wp-tech-tag">{t}</span>)}
                      </div>
                      <ArrowUpRight size={18} className="wp-card-arrow" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <div className="wp-divider">
            <div className="wp-divider-line" />
            <div className="wp-divider-dot" />
            <div className="wp-divider-line" />
          </div>

          {/* ── CTA ── */}
          <section className="wp-cta">
            <div className="wp-cta-inner">
              <h2 className="wp-cta-h2">Start a<br /><span>Project.</span></h2>
              <p className="wp-cta-sub">Have an idea? Let&apos;s build it together with a modern stack and a clear, honest process.</p>
              <div className="wp-cta-btns">
                <a href="mailto:alfayadshameer056@gmail.com" className="wp-cta-primary">
                  Get in Touch <ArrowUpRight size={15} />
                </a>
                <Link href="/" className="wp-cta-secondary">
                  Back to Home <ArrowLeft size={14} />
                </Link>
              </div>
            </div>
          </section>

          <div className="wp-strip">
            <span>© 2025 — All rights reserved</span>
            <span>{WORK_PROJECTS.length} Projects</span>
          </div>

        </div>
      </div>
    </ScrollTriggerAnimations>
  );
}