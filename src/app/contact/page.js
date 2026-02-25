'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function ContactPageContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: '',
    budget: '',
    timeline: '',
    projectType: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const sectionRef = useRef(null);
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const plans = [
    { value: 'basic', label: 'Basic Plan - $80 (Starter/Landing Page)' },
    { value: 'standard', label: 'Standard Plan - $150 (Multi-page Business Website)' },
    { value: 'premium', label: 'Premium Plan - $450 (Full-Stack Web Application)' },
    { value: 'custom', label: 'Custom Project' },
    { value: 'consultation', label: 'Free Consultation Only' }
  ];

  const projectTypes = [
    'Landing Page',
    'Business Website',
    'E-commerce Store',
    'Web Application',
    'Mobile App',
    'Portfolio Website',
    'Blog/Content Site',
    'Other'
  ];

  const budgets = [
    'Under $100',
    '$100 - $300',
    '$300 - $500',
    '$500 - $1000',
    '$1000 - $2000',
    '$2000+'
  ];

  const timelines = [
    'ASAP (Rush)',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    'Flexible'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Get selected plan from URL parameters
  useEffect(() => {
    const selectedPlan = searchParams.get('plan');
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, plan: selectedPlan }));
    }
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
      // Create email content
      const emailSubject = `New Project Inquiry - ${formData.plan || 'Custom Project'}`;
      const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Selected Plan: ${formData.plan || 'Not specified'}
Project Type: ${formData.projectType}
Budget: ${formData.budget}
Timeline: ${formData.timeline}

Project Description:
${formData.description}

---
This message was sent from your portfolio contact form.
      `;

      // Create mailto link
      const mailtoLink = `mailto:alfayadshameer056@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          plan: '',
          budget: '',
          timeline: '',
          projectType: '',
          description: ''
        });
        setSubmitStatus('');
      }, 3000);

    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-offbit text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wide">
              {t('contactTitle')}
            </h1>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              {t('contactDescription')}
            </p>
            
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 text-center"
              >
                ← Back to Home
              </Link>
              <Link 
                href="/services"
                className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 text-center"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-black/50 border-2 border-red-500/20 rounded-xl p-8 sm:p-12 shadow-2xl">
              
              {/* Form Header */}
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-offbit text-3xl sm:text-4xl font-bold text-white mb-4 tracking-wide">
                  {t('contactSubtitle')}
                </h2>
                <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Fill out the form below and I&apos;ll get back to you within 24 hours to discuss your project.
                </p>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-center">
                  ✅ Thank you! Your message has been prepared. Please check your email client.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-center">
                  ❌ There was an error. Please try again or contact me directly at alfayadshameer056@gmail.com
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 form-container" style={{ position: 'relative', zIndex: 5 }}>
                
                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('name')} *
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      required
                      autoComplete="name"
                      className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors text-base"
                      placeholder="Your full name"
                      style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('email')} *
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      required
                      autoComplete="email"
                      className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors text-base"
                      placeholder="your@email.com"
                      style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('phone')}
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    autoComplete="tel"
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors text-base"
                    placeholder="+1 (555) 123-4567"
                    style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                  />
                </div>

                {/* Project Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('plan')} *
                    </label>
                    <select 
                      name="plan"
                      value={formData.plan}
                      onChange={handleInputChange}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors text-base"
                      style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                    >
                      <option value="">Select a plan</option>
                      {plans.map((plan) => (
                        <option key={plan.value} value={plan.value}>
                          {plan.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('projectType')} *
                    </label>
                    <select 
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors text-base"
                      style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('budget')}
                    </label>
                    <select 
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors text-base"
                      style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                    >
                      <option value="">Select budget range</option>
                      {budgets.map((budget) => (
                        <option key={budget} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('timeline')}
                    </label>
                    <select 
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors text-base"
                      style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('description')} *
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    required
                    rows="6"
                    autoComplete="off"
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/20 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors resize-none text-base"
                    placeholder="Tell me about your project, goals, and any specific requirements..."
                    style={{ fontSize: '16px', position: 'relative', zIndex: 10 }}
                  />
                </div>
                
                <div className="text-center pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/20 ${
                      isSubmitting ? 'opacity-50' : ''
                    }`}
                  >
                    {isSubmitting ? t('preparingEmail') : t('sendMessage')}
                  </button>
                </div>
              </form>

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-red-500/20">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-6">Alternative Contact Methods</h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                    <a 
                      href="mailto:alfayadshameer056@gmail.com" 
                      className="flex items-center text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Mail className="w-6 h-6 mr-3 shrink-0 text-red-400" aria-hidden />
                      <span className="text-sm sm:text-base">alfayadshameer056@gmail.com</span>
                    </a>
                    <a 
                      href="tel:9074575374" 
                      className="flex items-center text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Phone className="w-6 h-6 mr-3 shrink-0 text-red-400" aria-hidden />
                      <span className="text-sm sm:text-base">+91 9074575374</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <ContactPageContent />
    </Suspense>
  );
}
