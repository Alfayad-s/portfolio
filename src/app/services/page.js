'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Monitor, Server, Rocket, Code, Database, Palette, FileCode, Zap, Cloud, Box, CreditCard, Flame, ArrowLeft, Check, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import TechStackMarquee from '@/components/TechStackMarquee';

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

  .sp-root {
    background: var(--black);
    min-height: 100vh;
    font-family: 'OffBit-DotBold', sans-serif;
    color: var(--white);
    overflow-x: hidden;
  }

  /* noise */
  .sp-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px; opacity: 0.35;
  }
  .sp-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(224,28,28,0.012) 2px, rgba(224,28,28,0.012) 4px);
  }

  .sp-inner { position: relative; z-index: 1; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(28px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity:0; transform: translateX(-20px); }
    to   { opacity:1; transform: translateX(0); }
  }
  .anim { opacity: 0; }
  .anim.visible { animation: fadeUp 0.75s forwards; }

  /* ── HERO ── */
  .sp-hero {
    padding: 7rem 2rem 5rem;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end;
  }
  @media(max-width:760px){ .sp-hero { grid-template-columns:1fr; gap:2.5rem; padding:5rem 1.5rem 3rem; } }

  .sp-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--red); font-weight: 500; margin-bottom: 1.5rem;
    opacity: 0; animation: fadeUp 0.6s 0.1s forwards;
  }
  .sp-eyebrow::before { content:''; width:32px; height:1px; background:var(--red); }

  .sp-h1 {
    font-family: 'OffBit-DotBold', sans-serif;
    font-size: clamp(4.5rem, 10vw, 9rem);
    line-height: 0.9; letter-spacing: 0.02em;
    margin: 0;
    opacity: 0; animation: fadeUp 0.8s 0.2s forwards;
  }
  .sp-h1 span { color: var(--red); }

  .sp-hero-right {
    padding-bottom: 0.5rem;
    opacity: 0; animation: fadeUp 0.8s 0.35s forwards;
  }
  .sp-hero-desc { color: var(--gray); font-size: 1.05rem; line-height: 1.8; font-weight: 300; margin-bottom: 2rem; }

  .sp-nav-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 0.7rem 1.5rem; border: 1px solid var(--red-border);
    color: var(--gray); font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;
    text-decoration: none; transition: all 0.3s; font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden;
  }
  .sp-nav-btn::before {
    content:''; position:absolute; inset:0; background:var(--red-dim);
    transform:scaleX(0); transform-origin:left; transition:transform 0.3s;
  }
  .sp-nav-btn:hover::before { transform:scaleX(1); }
  .sp-nav-btn:hover { color:var(--white); border-color:var(--red); }

  /* ── DIVIDER ── */
  .sp-divider {
    max-width: 1100px; margin: 0 auto; padding: 0 2rem;
    display: flex; align-items: center; gap: 1.5rem;
  }
  .sp-divider-line { flex:1; height:1px; background:var(--red-border); }
  .sp-divider-dot { width:6px; height:6px; background:var(--red); transform:rotate(45deg); flex-shrink:0; }

  /* ── SECTION WRAPPER ── */
  .sp-section { max-width: 1100px; margin: 0 auto; padding: 5rem 2rem; }
  .sp-section-sm { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; }

  /* section header */
  .sp-sec-header { margin-bottom: 4rem; font-family: 'OffBit-DotBold', sans-serif; }
  .sp-sec-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--red); margin-bottom: 1rem;
  }
  .sp-sec-eyebrow::before { content:''; width:24px; height:1px; background:var(--red); }
  .sp-sec-h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.8rem, 6vw, 5rem);
    line-height: 0.95; letter-spacing: 0.02em; margin: 0;
  }
  .sp-sec-sub { color: var(--gray); font-size: 1rem; font-weight: 300; max-width: 480px; margin-top: 1rem; line-height: 1.75; }

  /* ── SERVICE CATEGORIES ── */
  .sp-categories { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--red-border); }
  @media(max-width:640px){ .sp-categories { grid-template-columns: 1fr; } }

  .sp-cat-card {
    background: var(--black); padding: 3rem 2.5rem;
    position: relative; overflow: hidden;
    transition: background 0.4s;
  }
  .sp-cat-card::before {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 100%; height: 2px; background: var(--red);
    transform: scaleX(0); transform-origin: left; transition: transform 0.4s;
  }
  .sp-cat-card:hover { background: var(--black2); }
  .sp-cat-card:hover::before { transform: scaleX(1); }

  .sp-cat-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 4rem; line-height: 1;
    color: rgba(224,28,28,0.12); margin-bottom: 1.5rem; display: block;
    transition: color 0.4s;
  }
  .sp-cat-card:hover .sp-cat-num { color: rgba(224,28,28,0.25); }
  .sp-cat-icon { color: var(--red); margin-bottom: 1.25rem; }
  .sp-cat-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
  .sp-cat-desc { color: var(--gray); font-size: 0.9rem; line-height: 1.7; font-weight: 300; }

  /* ── TECH STACK ── */
  .sp-tech-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr); gap: 1px; background: var(--red-border);
  }
  @media(max-width:900px){ .sp-tech-grid { grid-template-columns: repeat(4, 1fr); } }
  @media(max-width:560px){ .sp-tech-grid { grid-template-columns: repeat(3, 1fr); } }

  .sp-tech-item {
    background: var(--black); padding: 1.75rem 1rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    transition: background 0.3s; cursor: default;
  }
  .sp-tech-item:hover { background: var(--black2); }
  .sp-tech-icon { color: var(--red); opacity: 0.75; transition: opacity 0.3s; }
  .sp-tech-item:hover .sp-tech-icon { opacity: 1; }
  .sp-tech-name { font-size: 0.82rem; font-weight: 500; letter-spacing: 0.04em; }
  .sp-tech-cat { font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gray); }

  /* ── PRICING ── */
  .sp-pricing-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--red-border);
  }
  @media(max-width:760px){ .sp-pricing-grid { grid-template-columns: 1fr; } }

  .sp-pkg {
    background: var(--black); padding: 3rem 2.5rem;
    display: flex; flex-direction: column; position: relative; overflow: hidden;
    transition: background 0.3s;
  }
  .sp-pkg:hover { background: var(--black2); }

  .sp-pkg-popular {
    background: var(--black2);
    border-top: 2px solid var(--red);
  }

  .sp-pkg-badge {
    position: absolute; top: 0; right: 0;
    background: var(--red); color: var(--white);
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 0.4rem 1rem; font-weight: 500;
  }

  .sp-pkg-label {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--red); margin-bottom: 0.75rem;
  }
  .sp-pkg-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; letter-spacing: 0.04em;
    margin-bottom: 0.25rem; line-height: 1;
  }
  .sp-pkg-subtitle { color: var(--gray); font-size: 0.85rem; font-weight: 300; margin-bottom: 2rem; }

  .sp-pkg-price {
    font-family: 'Bebas Neue', sans-serif; font-size: 5rem; line-height: 1;
    letter-spacing: -0.02em; margin-bottom: 0.25rem; color: var(--white);
  }
  .sp-pkg-meta { color: var(--gray); font-size: 0.78rem; letter-spacing: 0.05em; margin-bottom: 2rem; }
  .sp-pkg-divider { height: 1px; background: var(--red-border); margin-bottom: 2rem; }

  .sp-pkg-features { list-style: none; padding: 0; margin: 0 0 2.5rem; display: flex; flex-direction: column; gap: 0.8rem; flex: 1; }
  .sp-pkg-feature { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.88rem; color: var(--gray-light); font-weight: 300; line-height: 1.5; }
  .sp-pkg-check { color: var(--red); flex-shrink: 0; margin-top: 1px; }

  .sp-pkg-btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.5rem; background: transparent; border: 1px solid var(--red-border);
    color: var(--white); font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; transition: all 0.3s; width: 100%;
    position: relative; overflow: hidden;
  }
  .sp-pkg-btn::before {
    content:''; position:absolute; inset:0; background:var(--red);
    transform:scaleX(0); transform-origin:left; transition:transform 0.35s;
    z-index:0;
  }
  .sp-pkg-btn:hover::before { transform:scaleX(1); }
  .sp-pkg-btn span, .sp-pkg-btn svg { position: relative; z-index:1; }
  .sp-pkg-btn:hover { border-color: var(--red); }

  .sp-pkg-popular .sp-pkg-btn {
    background: var(--red); border-color: var(--red);
  }
  .sp-pkg-popular .sp-pkg-btn::before { background: #c01818; }

  /* ── PROCESS ── */
  .sp-process { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--red-border); }
  @media(max-width:760px){ .sp-process { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:420px){ .sp-process { grid-template-columns: 1fr; } }

  .sp-step {
    background: var(--black); padding: 3rem 2rem;
    position: relative; overflow: hidden; transition: background 0.3s;
  }
  .sp-step:hover { background: var(--black2); }
  .sp-step-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 5rem; line-height: 1;
    color: rgba(224,28,28,0.1); margin-bottom: 1.5rem; display: block; transition: color 0.4s;
  }
  .sp-step:hover .sp-step-num { color: rgba(224,28,28,0.2); }
  .sp-step-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
  .sp-step-desc { color: var(--gray); font-size: 0.88rem; line-height: 1.7; font-weight: 300; }
  .sp-step-line { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: var(--red); transform:scaleX(0); transform-origin:left; transition:transform 0.4s; }
  .sp-step:hover .sp-step-line { transform:scaleX(1); }

  /* ── CTA ── */
  .sp-cta { padding: 6rem 2rem; text-align: center; position: relative; }
  .sp-cta-inner { max-width: 700px; margin: 0 auto; }
  .sp-cta-h2 {
    font-family: 'OffBit-DotBold', sans-serif;
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 0.95; letter-spacing: 0.02em; margin: 0 0 1.5rem;
  }
  .sp-cta-h2 span { color: var(--red); }
  .sp-cta-sub { color: var(--gray); font-size: 1rem; font-weight: 300; line-height: 1.8; margin-bottom: 3rem; }

  .sp-cta-btns { display: flex; gap: 1px; justify-content: center; flex-wrap: wrap; }
  .sp-cta-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 1.1rem 2.5rem; background: var(--red); color: var(--white);
    font-family: 'OffBit-DotBold', sans-serif; font-size: 1.1rem; letter-spacing: 0.12em;
    text-decoration: none; transition: background 0.3s; position: relative; overflow: hidden;
  }
  .sp-cta-primary::before {
    content:''; position:absolute; inset:0; background:rgba(255,255,255,0.1);
    transform:translateX(-100%); transition:transform 0.4s;
  }
  .sp-cta-primary:hover::before { transform:translateX(0); }
  .sp-cta-primary:hover { background: #c01818; }

  .sp-cta-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 1.1rem 2.5rem; background: transparent;
    border: 1px solid var(--red-border); color: var(--gray);
    font-family: 'OffBit-DotBold', sans-serif; font-size: 1.1rem; letter-spacing: 0.12em;
    text-decoration: none; transition: all 0.3s;
  }
  .sp-cta-secondary:hover { color: var(--white); border-color: var(--red); background: var(--red-dim); }

  /* ── FOOTER STRIP ── */
  .sp-strip {
    border-top: 1px solid var(--red-border);
    padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;
    font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: #333;
    max-width: 1100px; margin: 0 auto;
  }
`;

export default function ServicesPage() {
  const [visibleSections, setVisibleSections] = useState({});
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const packages = [
    {
      id: 'basic',
      name: t('basicPlan'),
      subtitle: t('basicSubtitle'),
      price: '$80',
      delivery: t('tenDayDelivery'),
      revisions: t('twoRevisions'),
      popular: false,
      features: [t('functionalWebsite'), t('onePage'), t('contentUpload'), t('onePlugin'), t('speedOptimization'), t('hostingSetup'), t('socialMediaIcons')],
      description: t('basicDescription'),
    },
    {
      id: 'standard',
      name: t('standardPlan'),
      subtitle: t('standardSubtitle'),
      price: '$150',
      delivery: t('sixtyDayDelivery'),
      revisions: t('threeRevisions'),
      popular: true,
      features: [t('functionalWebsite'), t('fivePages'), t('contentUpload'), t('twoPlugins'), t('speedOptimization'), t('hostingSetup'), t('socialMediaIcons'), t('optInForm')],
      description: t('standardDescription'),
    },
    {
      id: 'premium',
      name: t('premiumPlan'),
      subtitle: t('premiumSubtitle'),
      price: '$450',
      delivery: t('ninetyDayDelivery'),
      revisions: t('fiveRevisions'),
      popular: false,
      features: [t('functionalWebsite'), t('tenPages'), t('contentUpload'), t('threePlugins'), t('ecommerceFunctionality'), t('twentyProducts'), t('paymentIntegration'), t('optInForm'), t('autoresponderIntegration'), t('speedOptimization'), t('hostingSetup'), t('socialMediaIcons')],
      description: t('premiumDescription'),
    }
  ];

  const technologies = [
    { name: 'React', category: 'Frontend', icon: Code },
    { name: 'Next.js', category: 'Framework', icon: Zap },
    { name: 'Node.js', category: 'Backend', icon: Server },
    { name: 'MongoDB', category: 'Database', icon: Database },
    { name: 'Tailwind CSS', category: 'Styling', icon: Palette },
    { name: 'TypeScript', category: 'Language', icon: FileCode },
    { name: 'Express.js', category: 'Backend', icon: Server },
    { name: 'PostgreSQL', category: 'Database', icon: Database },
    { name: 'AWS', category: 'Cloud', icon: Cloud },
    { name: 'Docker', category: 'DevOps', icon: Box },
    { name: 'Stripe', category: 'Payments', icon: CreditCard },
    { name: 'Firebase', category: 'Backend', icon: Flame }
  ];

  const categories = [
    { num: '01', Icon: Monitor, title: 'Frontend Development', desc: 'Modern, responsive interfaces built with React and Next.js. Pixel-perfect layouts with smooth interactions.' },
    { num: '02', Icon: Server, title: 'Backend Development', desc: 'Robust APIs and server-side logic with Node.js. Scalable, secure, and production-ready architectures.' },
    { num: '03', Icon: Rocket, title: 'Full-Stack Solutions', desc: 'End-to-end applications — auth, payments, databases, and deployment all handled under one roof.' }
  ];

  const steps = [
    { step: '01', title: t('step1'), desc: t('step1Desc') },
    { step: '02', title: t('step2'), desc: t('step2Desc') },
    { step: '03', title: t('step3'), desc: t('step3Desc') },
    { step: '04', title: t('step4'), desc: t('step4Desc') },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="sp-root">
        <div className="sp-inner">

          {/* ── HERO ── */}
          <section className="sp-hero">
            <div>
              <div className="sp-eyebrow">Services</div>
              <h1 className="sp-h1">
                What I<br /><span>Offer.</span>
              </h1>
            </div>
            <div className="sp-hero-right">
              <p className="sp-hero-desc">
                Comprehensive development solutions built with modern technologies. From landing pages to full-stack applications — delivered clean, fast, and on time.
              </p>
              <Link href="/" className="sp-nav-btn">
                <ArrowLeft size={13} /> Back to Home
              </Link>
            </div>
          </section>

          <div className="sp-divider">
            <div className="sp-divider-line" />
            <div className="sp-divider-dot" />
            <div className="sp-divider-line" />
          </div>

          {/* ── CATEGORIES ── */}
          <section className="sp-section" data-section="cats">
            <div className="sp-sec-header anim" style={visibleSections.cats ? {animation:'fadeUp 0.75s forwards'} : {}}>
              <div className="sp-sec-eyebrow">Disciplines</div>
              <h2 className="sp-sec-h2">What I <span style={{color:'var(--red)'}}>Build</span></h2>
              <p className="sp-sec-sub">Full-service development across the entire stack — design to deployment.</p>
            </div>
            <div className="sp-categories">
              {categories.map(({ num, Icon, title, desc }, i) => (
                <div
                  className="sp-cat-card anim"
                  key={num}
                  style={visibleSections.cats ? { animation: `fadeUp 0.75s ${i * 0.12}s forwards` } : {}}
                >
                  <span className="sp-cat-num">{num}</span>
                  <div className="sp-cat-icon"><Icon size={28} /></div>
                  <div className="sp-cat-title">{title}</div>
                  <p className="sp-cat-desc">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="sp-divider">
            <div className="sp-divider-line" />
            <div className="sp-divider-dot" />
            <div className="sp-divider-line" />
          </div>

          {/* ── TECH STACK ── */}
          <section className="sp-section" data-section="tech">
            <div className="sp-sec-header anim" style={visibleSections.tech ? {animation:'fadeUp 0.75s forwards'} : {}}>
              <div className="sp-sec-eyebrow">Tools & Technologies</div>
              <h2 className="sp-sec-h2">The <span style={{color:'var(--red)'}}>Stack</span></h2>
              <p className="sp-sec-sub">{t('technologyDescription')}</p>
            </div>
            <TechStackMarquee showTitle={false} className="mb-10" />
            <div className="sp-tech-grid">
              {technologies.map(({ name, category, icon: Icon }, i) => (
                <div
                  className="sp-tech-item anim"
                  key={name}
                  style={visibleSections.tech ? { animation: `fadeUp 0.5s ${i * 0.05}s forwards` } : {}}
                >
                  <div className="sp-tech-icon"><Icon size={26} /></div>
                  <span className="sp-tech-name">{name}</span>
                  <span className="sp-tech-cat">{category}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="sp-divider">
            <div className="sp-divider-line" />
            <div className="sp-divider-dot" />
            <div className="sp-divider-line" />
          </div>

          {/* ── PRICING ── */}
          <section className="sp-section" data-section="pricing">
            <div className="sp-sec-header anim" style={visibleSections.pricing ? {animation:'fadeUp 0.75s forwards'} : {}}>
              <div className="sp-sec-eyebrow">Packages</div>
              <h2 className="sp-sec-h2">Service <span style={{color:'var(--red)'}}>Plans</span></h2>
              <p className="sp-sec-sub">{t('choosePerfectPackage')}</p>
            </div>
            <div className="sp-pricing-grid">
              {packages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`sp-pkg anim ${pkg.popular ? 'sp-pkg-popular' : ''}`}
                  style={visibleSections.pricing ? { animation: `fadeUp 0.75s ${i * 0.15}s forwards` } : {}}
                >
                  {pkg.popular && <div className="sp-pkg-badge">Most Popular</div>}
                  <div className="sp-pkg-label">Plan 0{i + 1}</div>
                  <div className="sp-pkg-name">{pkg.name}</div>
                  <div className="sp-pkg-subtitle">{pkg.subtitle}</div>
                  <div className="sp-pkg-price">{pkg.price}</div>
                  <div className="sp-pkg-meta">{pkg.delivery} · {pkg.revisions}</div>
                  <div className="sp-pkg-divider" />
                  <ul className="sp-pkg-features">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="sp-pkg-feature">
                        <Check size={13} className="sp-pkg-check" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="sp-pkg-btn"
                    onClick={() => window.location.href = `/contact?plan=${pkg.id}`}
                  >
                    <span>Get Started</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="sp-divider">
            <div className="sp-divider-line" />
            <div className="sp-divider-dot" />
            <div className="sp-divider-line" />
          </div>

          {/* ── PROCESS ── */}
          <section className="sp-section" data-section="process">
            <div className="sp-sec-header anim" style={visibleSections.process ? {animation:'fadeUp 0.75s forwards'} : {}}>
              <div className="sp-sec-eyebrow">How It Works</div>
              <h2 className="sp-sec-h2">The <span style={{color:'var(--red)'}}>Process</span></h2>
              <p className="sp-sec-sub">{t('developmentDescription')}</p>
            </div>
            <div className="sp-process">
              {steps.map(({ step, title, desc }, i) => (
                <div
                  key={step}
                  className="sp-step anim"
                  style={visibleSections.process ? { animation: `fadeUp 0.75s ${i * 0.12}s forwards` } : {}}
                >
                  <div className="sp-step-line" />
                  <span className="sp-step-num">{step}</span>
                  <div className="sp-step-title">{title}</div>
                  <p className="sp-step-desc">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <div className="sp-divider">
            <div className="sp-divider-line" />
            <div className="sp-divider-dot" />
            <div className="sp-divider-line" />
          </div>

          <section className="sp-cta" data-section="cta">
            <div className="sp-cta-inner anim" style={visibleSections.cta ? {animation:'fadeUp 0.75s forwards'} : {}}>
              <h2 className="sp-cta-h2">Ready to<br /><span>Start Building?</span></h2>
              <p className="sp-cta-sub">{t('ctaDescription')}</p>
              <div className="sp-cta-btns">
                <a href="mailto:alfayadshameer056@gmail.com" className="sp-cta-primary">
                  {t('getFreeConsultation')} <ArrowRight size={15} />
                </a>
                <Link href="/work" className="sp-cta-secondary">
                  {t('viewAllServices')} <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          <div className="sp-strip">
            <span>© 2025 — All rights reserved</span>
            <span>alfayadshameer056@gmail.com</span>
          </div>

        </div>
      </div>
    </>
  );
}