'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle, { CompactLanguageToggle } from './LanguageToggle';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --red: #e01c1c;
    --red-dim: rgba(224,28,28,0.12);
    --red-border: rgba(224,28,28,0.25);
    --white: #f5f5f0;
    --gray: #888;
    --black: #080808;
  }

  /* ── TOP BAR ── */
  .hdr-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 2rem;
    transition: padding 0.5s ease, background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
    font-family: 'DM Sans', sans-serif;
  }
  .hdr-bar.scrolled {
    background: rgba(8,8,8,0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--red-border);
    box-shadow: 0 4px 40px rgba(0,0,0,0.6);
  }
  .hdr-bar.top {
    background: transparent;
    border-bottom: 1px solid transparent;
  }

  .hdr-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 72px;
    transition: height 0.5s ease;
  }
  .hdr-bar.scrolled .hdr-inner { height: 58px; }

  /* ── LOGO ── */
  .hdr-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; letter-spacing: 0.08em;
    color: var(--white); text-decoration: none;
    display: flex; align-items: center; gap: 4px;
    transition: opacity 0.3s;
    flex-shrink: 0;
  }
  .hdr-logo:hover { opacity: 0.8; }
  .hdr-logo-dot { color: var(--red); font-size: 2rem; line-height: 1; }

  /* ── DESKTOP NAV ── */
  .hdr-nav {
    display: flex; align-items: center; gap: 0;
  }
  @media(max-width:768px){ .hdr-nav { display: none; } }

  .hdr-nav-link {
    position: relative; display: inline-flex; align-items: center;
    padding: 0.4rem 1.1rem;
    font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gray); text-decoration: none;
    transition: color 0.3s;
    font-weight: 400;
  }
  .hdr-nav-link::after {
    content: ''; position: absolute; bottom: -2px; left: 1.1rem; right: 1.1rem;
    height: 1px; background: var(--red);
    transform: scaleX(0); transform-origin: left; transition: transform 0.35s;
  }
  .hdr-nav-link:hover { color: var(--white); }
  .hdr-nav-link:hover::after { transform: scaleX(1); }

  .hdr-nav-cta {
    display: inline-flex; align-items: center; gap: 8px;
    margin-left: 1rem; padding: 0.55rem 1.4rem;
    border: 1px solid var(--red-border); color: var(--gray);
    font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;
    text-decoration: none; transition: all 0.3s; position: relative; overflow: hidden;
  }
  .hdr-nav-cta::before {
    content: ''; position: absolute; inset: 0; background: var(--red);
    transform: scaleX(0); transform-origin: left; transition: transform 0.35s; z-index: 0;
  }
  .hdr-nav-cta:hover::before { transform: scaleX(1); }
  .hdr-nav-cta:hover { color: var(--white); border-color: var(--red); }
  .hdr-nav-cta span { position: relative; z-index: 1; }

  /* separator dot between links */
  .hdr-sep {
    width: 3px; height: 3px; border-radius: 50%; background: rgba(224,28,28,0.35);
    flex-shrink: 0;
  }

  /* ── EMAIL ── */
  .hdr-email {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.72rem; letter-spacing: 0.05em; color: var(--gray);
    text-decoration: none; transition: color 0.3s;
    flex-shrink: 0;
  }
  @media(max-width:1024px){ .hdr-email { display: none; } }
  .hdr-email:hover { color: var(--white); }
  .hdr-email-icon {
    width: 28px; height: 28px; border: 1px solid var(--red-border);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.3s; flex-shrink: 0;
  }
  .hdr-email:hover .hdr-email-icon { border-color: var(--red); }

  /* progress bar */
  .hdr-progress {
    position: absolute; bottom: 0; left: 0; height: 1px;
    background: var(--red); transform-origin: left;
    transition: transform 0.1s linear;
  }

  /* ── MOBILE BURGER ── */
  .hdr-burger {
    display: none; flex-direction: column; justify-content: center; align-items: center;
    width: 40px; height: 40px; gap: 5px;
    background: transparent; border: 1px solid var(--red-border); cursor: pointer;
    transition: border-color 0.3s;
  }
  .hdr-burger:hover { border-color: var(--red); }
  @media(max-width:768px){ .hdr-burger { display: flex; } }

  .hdr-burger-line {
    width: 18px; height: 1px; background: var(--white);
    transition: all 0.35s; transform-origin: center;
  }
  .hdr-burger.open .hdr-burger-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .hdr-burger.open .hdr-burger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hdr-burger.open .hdr-burger-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

  /* ── MOBILE MENU ── */
  .hdr-mobile {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99;
    background: var(--black);
    display: flex; flex-direction: column;
    clip-path: inset(0 0 100% 0);
    transition: clip-path 0.5s cubic-bezier(0.77,0,0.175,1);
    pointer-events: none;
  }
  .hdr-mobile.open {
    clip-path: inset(0 0 0% 0);
    pointer-events: all;
  }

  .hdr-mobile-inner {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 2rem 2.5rem;
    position: relative;
  }

  /* decorative vertical red line */
  .hdr-mobile-inner::before {
    content: ''; position: absolute; left: 2.5rem; top: 20%; bottom: 20%;
    width: 1px; background: var(--red-border);
  }

  .hdr-mobile-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 0.85rem;
    color: rgba(224,28,28,0.35); letter-spacing: 0.1em; margin-bottom: 0.5rem;
    padding-left: 1.75rem;
  }

  .hdr-mobile-link {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 12vw, 5.5rem); line-height: 0.95;
    letter-spacing: 0.02em; color: var(--white); text-decoration: none;
    display: block; padding-left: 1.75rem;
    transition: color 0.3s, padding-left 0.3s;
    transform: translateY(20px); opacity: 0;
    transition: transform 0.5s, opacity 0.5s, color 0.3s, padding-left 0.3s;
  }
  .hdr-mobile.open .hdr-mobile-link {
    transform: translateY(0); opacity: 1;
  }
  .hdr-mobile.open .hdr-mobile-link:nth-child(2) { transition-delay: 0.08s; }
  .hdr-mobile.open .hdr-mobile-link:nth-child(4) { transition-delay: 0.14s; }
  .hdr-mobile.open .hdr-mobile-link:nth-child(6) { transition-delay: 0.20s; }
  .hdr-mobile.open .hdr-mobile-link:nth-child(8) { transition-delay: 0.26s; }
  .hdr-mobile-link:hover { color: var(--red); padding-left: 2.25rem; }

  .hdr-mobile-divider { height: 1px; background: var(--red-border); margin: 1.5rem 1.75rem; }

  .hdr-mobile-footer {
    padding: 1.5rem 2.5rem 3rem;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--red-border);
    opacity: 0; transform: translateY(10px);
    transition: opacity 0.5s 0.35s, transform 0.5s 0.35s;
  }
  .hdr-mobile.open .hdr-mobile-footer { opacity: 1; transform: translateY(0); }

  .hdr-mobile-email { font-size: 0.75rem; color: var(--gray); letter-spacing: 0.05em; }

  /* ── VERTICAL SIDE NAV (desktop scrolled) ── */
  .hdr-sidenav {
    position: fixed; left: 1.5rem; top: 50%; transform: translateY(-50%);
    z-index: 98; display: none;
    flex-direction: column; align-items: center; gap: 6px;
    padding: 1.25rem 0.6rem;
    background: rgba(8,8,8,0.85);
    border: 1px solid var(--red-border);
    backdrop-filter: blur(12px);
    transition: opacity 0.4s, transform 0.4s;
  }
  @media(min-width:769px){ .hdr-sidenav { display: flex; } }
  .hdr-sidenav.hidden-nav { opacity: 0; pointer-events: none; transform: translateY(-50%) translateX(-8px); }
  .hdr-sidenav.visible-nav { opacity: 1; pointer-events: all; transform: translateY(-50%) translateX(0); }

  .hdr-side-item {
    position: relative; display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; cursor: pointer;
  }
  .hdr-side-pip {
    width: 3px; height: 22px; background: rgba(245,245,240,0.2);
    transition: all 0.3s; border-radius: 2px;
  }
  .hdr-side-item:hover .hdr-side-pip,
  .hdr-side-item.active .hdr-side-pip {
    background: var(--red);
    box-shadow: 0 0 12px rgba(224,28,28,0.7);
    height: 28px;
  }
  .hdr-side-tooltip {
    position: absolute; left: calc(100% + 12px);
    background: rgba(8,8,8,0.95); border: 1px solid var(--red-border);
    padding: 0.3rem 0.8rem; font-size: 0.7rem; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--white); white-space: nowrap;
    opacity: 0; transform: translateX(-6px); pointer-events: none;
    transition: opacity 0.25s, transform 0.25s;
  }
  .hdr-side-item:hover .hdr-side-tooltip { opacity: 1; transform: translateX(0); }

  .hdr-side-divider { width: 12px; height: 1px; background: var(--red-border); margin: 2px 0; }
`;



export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollY / docHeight : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: '/', label: t('home'), key: 'home' },
    { href: '/work', label: t('work'), key: 'work' },
    { href: '/services', label: t('services'), key: 'services' },
    { href: '/contact', label: t('contact'), key: 'contact' },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* ── TOP BAR ── */}
      <header className={`hdr-bar ${isScrolled ? 'scrolled' : 'top'}`}>
        {/* scroll progress */}
        {isScrolled && (
          <div
            className="hdr-progress"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        )}

        <div className="hdr-inner">
          {/* Logo */}
          <Link href="/" className="hdr-logo" onClick={closeMobileMenu}>
            FD<span className="hdr-logo-dot">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hdr-nav">
            {navLinks.map((link, i) => (
              <React.Fragment key={link.key}>
                {i > 0 && <div className="hdr-sep" />}
                <Link href={link.href} className="hdr-nav-link">
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
            <a href="mailto:alfayadshameer056@gmail.com" className="hdr-nav-cta">
              <span>Hire Me</span>
            </a>
          </nav>

          {/* Email (desktop wide) */}
          <a href="mailto:alfayadshameer056@gmail.com" className="hdr-email">
            <div className="hdr-email-icon">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" style={{color:'var(--red)'}}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            alfayadshameer056@gmail.com
          </a>

          {/* Mobile burger */}
          <button
            className={`hdr-burger ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <div className="hdr-burger-line" />
            <div className="hdr-burger-line" />
            <div className="hdr-burger-line" />
          </button>
        </div>
      </header>

      {/* ── MOBILE FULLSCREEN MENU ── */}
      <div className={`hdr-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* close button top-right */}
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'1.5rem 2rem 0' }}>
          <button
            onClick={closeMobileMenu}
            style={{ background:'transparent', border:'1px solid var(--red-border)', width:40, height:40, color:'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="hdr-mobile-inner">
          {navLinks.map((link, i) => (
            <div key={link.key}>
              <div className="hdr-mobile-num">0{i + 1}</div>
              <Link href={link.href} className="hdr-mobile-link" onClick={closeMobileMenu}>
                {link.label}
              </Link>
              {i < navLinks.length - 1 && <div className="hdr-mobile-divider" />}
            </div>
          ))}
        </div>

        <div className="hdr-mobile-footer">
          <span className="hdr-mobile-email">alfayadshameer056@gmail.com</span>
          <CompactLanguageToggle />
        </div>
      </div>

      {/* ── SIDE NAV (desktop, visible when scrolled) ── */}
      
    </>
  );
}