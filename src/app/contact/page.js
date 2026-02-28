'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, ArrowLeft, Send, ChevronRight } from 'lucide-react';

// ─── PASTE YOUR useLanguage IMPORT BACK ─────────────────────────────────────
// import { useLanguage } from '@/context/LanguageContext';

// Inline style block (add to your global CSS or a <style> tag)
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --red: #e01c1c;
    --red-dim: rgba(224,28,28,0.12);
    --red-border: rgba(224,28,28,0.25);
    --white: #f5f5f0;
    --gray: #888;
    --black: #080808;
  }

  .cp-root { background: var(--black); min-height: 100vh; , sans-serif; color: var(--white); overflow-x: hidden; }

  /* noise overlay */
  .cp-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px;
    opacity: 0.35;
  }

  /* animated scanline */
  .cp-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(224,28,28,0.015) 2px, rgba(224,28,28,0.015) 4px);
  }

  .cp-inner { position: relative; z-index: 1; }

  /* ── HERO ── */
  .cp-hero { padding: 7rem 2rem 4rem; max-width: 1100px; margin: 0 auto; }

  .cp-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--red); font-weight: 500; margin-bottom: 2rem;
    opacity: 0; animation: fadeUp 0.6s 0.1s forwards;
  }
  .cp-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }

  .cp-h1 {
    font-family: 'OffBit-DotBold', sans-serif;
    font-size: clamp(4rem, 10vw, 9rem);
    line-height: 0.92; letter-spacing: 0.02em;
    color: var(--white); margin: 0 0 2.5rem;
    opacity: 0; animation: fadeUp 0.8s 0.2s forwards;
  }
  .cp-h1 span { color: var(--red); display: block; }

  .cp-hero-sub {
    max-width: 520px; color: var(--gray); font-size: 1.05rem; line-height: 1.75;
    font-weight: 300; margin-bottom: 3rem;
    opacity: 0; animation: fadeUp 0.8s 0.35s forwards;
  }

  .cp-nav-links {
    display: flex; gap: 1rem; flex-wrap: wrap;
    opacity: 0; animation: fadeUp 0.8s 0.45s forwards;
  }
  .cp-nav-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 0.75rem 1.5rem; border: 1px solid var(--red-border);
    color: var(--gray); font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; transition: all 0.3s; font-family: 'OffBit-DotBold', sans-serif;
    position: relative; overflow: hidden;
  }
  .cp-nav-btn::before {
    content: ''; position: absolute; inset: 0; background: var(--red-dim);
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s;
  }
  .cp-nav-btn:hover::before { transform: scaleX(1); }
  .cp-nav-btn:hover { color: var(--white); border-color: var(--red); }

  /* ── DIVIDER ── */
  .cp-divider {
    max-width: 1100px; margin: 0 auto; padding: 0 2rem;
    display: flex; align-items: center; gap: 1.5rem;
    opacity: 0; animation: fadeUp 0.8s 0.5s forwards;
  }
  .cp-divider-line { flex: 1; height: 1px; background: var(--red-border); }
  .cp-divider-dot { width: 6px; height: 6px; background: var(--red); transform: rotate(45deg); flex-shrink: 0; }

  /* ── FORM SECTION ── */
  .cp-form-section { padding: 5rem 2rem 6rem; max-width: 1100px; margin: 0 auto; }

  .cp-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 5rem; align-items: start; }
  @media (max-width: 860px) { .cp-grid { grid-template-columns: 1fr; gap: 3rem; } }

  /* sidebar */
  .cp-sidebar { position: sticky; top: 6rem; opacity: 0; animation: fadeUp 0.8s 0.6s forwards; }
  .cp-sidebar-label { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; }
  .cp-sidebar-h2 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 3.8rem); line-height: 1; color: var(--white); margin: 0 0 2rem; }

  .cp-contact-alt { margin-top: 3rem; display: flex; flex-direction: column; gap: 1.25rem; }
  .cp-contact-link {
    display: flex; align-items: center; gap: 1rem;
    text-decoration: none; color: var(--gray); font-size: 0.88rem;
    transition: color 0.3s; padding: 1rem; border: 1px solid transparent;
    transition: all 0.3s;
  }
  .cp-contact-link:hover { color: var(--white); border-color: var(--red-border); background: var(--red-dim); }
  .cp-contact-icon { color: var(--red); flex-shrink: 0; }
  .cp-contact-meta { display: flex; flex-direction: column; gap: 2px; }
  .cp-contact-type { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); }

  .cp-response-badge {
    margin-top: 2.5rem; display: inline-flex; align-items: center; gap: 8px;
    padding: 0.6rem 1.2rem; border: 1px solid var(--red-border);
    font-size: 0.78rem; color: var(--gray); letter-spacing: 0.05em;
  }
  .cp-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

  /* form */
  .cp-form-wrap { opacity: 0; animation: fadeUp 0.8s 0.7s forwards; }

  .cp-form { display: flex; flex-direction: column; gap: 0; }

  .cp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  @media (max-width: 560px) { .cp-field-row { grid-template-columns: 1fr; } }

  .cp-field {
    position: relative; border: 1px solid var(--red-border);
    margin: -1px 0 0 -1px; /* collapse borders */
    transition: border-color 0.3s;
  }
  .cp-field:focus-within { border-color: var(--red); z-index: 2; }
  .cp-field:focus-within .cp-label { color: var(--red); }

  .cp-label {
    display: block; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gray); padding: 1rem 1.25rem 0; transition: color 0.3s;
  }
  .cp-req { color: var(--red); }

  .cp-input, .cp-select, .cp-textarea {
    display: block; width: 100%; background: transparent; border: none; outline: none;
    color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    padding: 0.4rem 1.25rem 1rem; resize: none; font-weight: 300;
    box-sizing: border-box;
  }
  .cp-select { cursor: pointer; appearance: none; -webkit-appearance: none; }
  .cp-select option { background: #111; color: var(--white); }
  .cp-input::placeholder, .cp-textarea::placeholder { color: #444; }

  .cp-select-arrow {
    position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%);
    pointer-events: none; color: var(--red); opacity: 0.7;
  }

  .cp-textarea-field { grid-column: 1 / -1; }
  .cp-textarea { min-height: 140px; padding-top: 0.4rem; }

  /* submit */
  .cp-submit-row { margin-top: 2px; display: flex; justify-content: flex-end; }
  .cp-submit {
    display: inline-flex; align-items: center; gap: 12px;
    background: var(--red); color: var(--white); border: none; cursor: pointer;
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.12em;
    padding: 1.2rem 2.5rem;
    position: relative; overflow: hidden; transition: background 0.3s;
  }
  .cp-submit::before {
    content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.1);
    transform: translateX(-100%); transition: transform 0.4s;
  }
  .cp-submit:hover::before { transform: translateX(0); }
  .cp-submit:hover { background: #c01818; }
  .cp-submit:disabled { background: #333; cursor: not-allowed; }

  /* status */
  .cp-status {
    grid-column: 1/-1; padding: 1rem 1.25rem;
    font-size: 0.85rem; letter-spacing: 0.05em;
  }
  .cp-status.success { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; }
  .cp-status.error { background: rgba(224,28,28,0.08); border: 1px solid var(--red-border); color: #f87171; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(24px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* bottom strip */
  .cp-strip {
    border-top: 1px solid var(--red-border);
    padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;
    font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: #333;
    max-width: 1100px; margin: 0 auto;
  }
`;

function ContactPageContent() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', plan: '',
    budget: '', timeline: '', projectType: '', description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const searchParams = useSearchParams();

  // Replace with your actual t() if needed
  const t = (key) => ({
    contactTitle: 'Let\'s Build\nSomething',
    contactDescription: 'Have a project in mind? Fill out the brief below and I\'ll get back to you within 24 hours.',
    contactSubtitle: 'Project Brief',
    name: 'Full Name', email: 'Email', phone: 'Phone',
    plan: 'Selected Plan', projectType: 'Project Type',
    budget: 'Budget', timeline: 'Timeline', description: 'Project Description',
    preparingEmail: 'Preparing...', sendMessage: 'Send Message'
  }[key] || key);

  const plans = [
    { value: 'basic', label: 'Basic — $80 (Starter / Landing Page)' },
    { value: 'standard', label: 'Standard — $150 (Multi-page Business Site)' },
    { value: 'premium', label: 'Premium — $450 (Full-Stack Web App)' },
    { value: 'custom', label: 'Custom Project' },
    { value: 'consultation', label: 'Free Consultation Only' }
  ];
  const projectTypes = ['Landing Page','Business Website','E-commerce Store','Web Application','Mobile App','Portfolio Website','Blog/Content Site','Other'];
  const budgets = ['Under $100','$100 – $300','$300 – $500','$500 – $1,000','$1,000 – $2,000','$2,000+'];
  const timelines = ['ASAP (Rush)','1–2 weeks','1 month','2–3 months','3–6 months','Flexible'];

  useEffect(() => {
    const selectedPlan = searchParams.get('plan');
    if (selectedPlan) setFormData(prev => ({ ...prev, plan: selectedPlan }));
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    try {
      const subject = `New Inquiry — ${formData.plan || 'Custom Project'}`;
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPlan: ${formData.plan}\nProject Type: ${formData.projectType}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\n${formData.description}\n\n— Sent from portfolio contact form`;
      window.location.href = `mailto:alfayadshameer056@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({ name:'',email:'',phone:'',plan:'',budget:'',timeline:'',projectType:'',description:'' });
        setSubmitStatus('');
      }, 3000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">
        <div className="cp-inner">

          {/* ── HERO ── */}
          <section className="cp-hero">
            <div className="cp-eyebrow">Contact</div>
            <h1 className="cp-h1 font-offbit">
              Let's Build
              <span>Something.</span>
            </h1>
            <p className="cp-hero-sub">
              Have a project in mind? I'd love to hear about it. Fill out the brief below and I'll get back to you within 24 hours.
            </p>
            <nav className="cp-nav-links">
              <Link href="/" className="cp-nav-btn">
                <ArrowLeft size={13} /> Home
              </Link>
              <Link href="/services" className="cp-nav-btn">
                View Services <ChevronRight size={13} />
              </Link>
            </nav>
          </section>

          {/* ── DIVIDER ── */}
          <div className="cp-divider">
            <div className="cp-divider-line" />
            <div className="cp-divider-dot" />
            <div className="cp-divider-line" />
          </div>

          {/* ── FORM SECTION ── */}
          <section className="cp-form-section">
            <div className="cp-grid">

              {/* Sidebar */}
              <aside className="cp-sidebar">
                <div className="cp-sidebar-label">Project Brief</div>
                <h2 className="cp-sidebar-h2">Start the Conversation</h2>

                <div className="cp-contact-alt">
                  <a href="mailto:alfayadshameer056@gmail.com" className="cp-contact-link">
                    <Mail size={16} className="cp-contact-icon" />
                    <div className="cp-contact-meta">
                      <span className="cp-contact-type">Email</span>
                      <span>alfayadshameer056@gmail.com</span>
                    </div>
                  </a>
                  <a href="tel:9074575374" className="cp-contact-link">
                    <Phone size={16} className="cp-contact-icon" />
                    <div className="cp-contact-meta">
                      <span className="cp-contact-type">Phone</span>
                      <span>+91 9074575374</span>
                    </div>
                  </a>
                </div>

                <div className="cp-response-badge">
                  <div className="cp-pulse" />
                  Responds within 24 hours
                </div>
              </aside>

              {/* Form */}
              <div className="cp-form-wrap">
                <form onSubmit={handleSubmit} className="cp-form">

                  {/* Status */}
                  {submitStatus === 'success' && (
                    <div className="cp-status success">✓ Message prepared — please check your email client.</div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="cp-status error">✕ Something went wrong. Email me directly at alfayadshameer056@gmail.com</div>
                  )}

                  {/* Row 1: Name + Email */}
                  <div className="cp-field-row">
                    <div className="cp-field">
                      <label className="cp-label">Full Name <span className="cp-req">*</span></label>
                      <input className="cp-input" type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your name" autoComplete="name" style={{fontSize:'16px'}} />
                    </div>
                    <div className="cp-field">
                      <label className="cp-label">Email <span className="cp-req">*</span></label>
                      <input className="cp-input" type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" autoComplete="email" style={{fontSize:'16px'}} />
                    </div>
                  </div>

                  {/* Row 2: Phone */}
                  <div className="cp-field">
                    <label className="cp-label">Phone</label>
                    <input className="cp-input" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 000 000 0000" autoComplete="tel" style={{fontSize:'16px'}} />
                  </div>

                  {/* Row 3: Plan + Project Type */}
                  <div className="cp-field-row">
                    <div className="cp-field" style={{position:'relative'}}>
                      <label className="cp-label">Plan <span className="cp-req">*</span></label>
                      <select className="cp-select" name="plan" value={formData.plan} onChange={handleInputChange} required style={{fontSize:'16px'}}>
                        <option value="">Select plan</option>
                        {plans.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                      <span className="cp-select-arrow"><ChevronRight size={14} style={{transform:'rotate(90deg)'}} /></span>
                    </div>
                    <div className="cp-field" style={{position:'relative'}}>
                      <label className="cp-label">Project Type <span className="cp-req">*</span></label>
                      <select className="cp-select" name="projectType" value={formData.projectType} onChange={handleInputChange} required style={{fontSize:'16px'}}>
                        <option value="">Select type</option>
                        {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className="cp-select-arrow"><ChevronRight size={14} style={{transform:'rotate(90deg)'}} /></span>
                    </div>
                  </div>

                  {/* Row 4: Budget + Timeline */}
                  <div className="cp-field-row">
                    <div className="cp-field" style={{position:'relative'}}>
                      <label className="cp-label">Budget</label>
                      <select className="cp-select" name="budget" value={formData.budget} onChange={handleInputChange} style={{fontSize:'16px'}}>
                        <option value="">Select range</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <span className="cp-select-arrow"><ChevronRight size={14} style={{transform:'rotate(90deg)'}} /></span>
                    </div>
                    <div className="cp-field" style={{position:'relative'}}>
                      <label className="cp-label">Timeline</label>
                      <select className="cp-select" name="timeline" value={formData.timeline} onChange={handleInputChange} style={{fontSize:'16px'}}>
                        <option value="">Select timeline</option>
                        {timelines.map(tl => <option key={tl} value={tl}>{tl}</option>)}
                      </select>
                      <span className="cp-select-arrow"><ChevronRight size={14} style={{transform:'rotate(90deg)'}} /></span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="cp-field cp-textarea-field">
                    <label className="cp-label">Project Description <span className="cp-req">*</span></label>
                    <textarea className="cp-textarea" name="description" value={formData.description} onChange={handleInputChange} required placeholder="Tell me about your project — goals, features, inspiration..." style={{fontSize:'16px'}} />
                  </div>

                  {/* Submit */}
                  <div className="cp-submit-row">
                    <button type="submit" disabled={isSubmitting} className="cp-submit">
                      {isSubmitting ? 'Preparing...' : 'Send Message'}
                      <Send size={15} />
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </section>

          {/* Strip */}
          <div className="cp-strip">
            <span>© 2025 — All rights reserved</span>
            <span>alfayadshameer056@gmail.com</span>
          </div>

        </div>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#080808',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontFamily:'monospace',fontSize:'12px',letterSpacing:'0.2em',textTransform:'uppercase'}}>Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}