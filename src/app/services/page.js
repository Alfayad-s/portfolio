'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Monitor, Server, Rocket, Code, Database, Palette, FileCode, Zap, Cloud, Box, CreditCard, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const sectionRef = useRef(null);
  const { t } = useLanguage();

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

  const packages = [
    {
      id: 'basic',
      name: t('basicPlan'),
      subtitle: t('basicSubtitle'),
      price: '$80',
      delivery: t('tenDayDelivery'),
      revisions: t('twoRevisions'),
      popular: false,
      features: [
        t('functionalWebsite'),
        t('onePage'),
        t('contentUpload'),
        t('onePlugin'),
        t('speedOptimization'),
        t('hostingSetup'),
        t('socialMediaIcons')
      ],
      description: t('basicDescription'),
      color: 'from-blue-600/20 to-blue-800/20',
      borderColor: 'border-blue-500/20',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      badgeColor: 'bg-blue-600'
    },
    {
      id: 'standard',
      name: t('standardPlan'),
      subtitle: t('standardSubtitle'),
      price: '$150',
      delivery: t('sixtyDayDelivery'),
      revisions: t('threeRevisions'),
      popular: true,
      features: [
        t('functionalWebsite'),
        t('fivePages'),
        t('contentUpload'),
        t('twoPlugins'),
        t('speedOptimization'),
        t('hostingSetup'),
        t('socialMediaIcons'),
        t('optInForm')
      ],
      description: t('standardDescription'),
      color: 'from-red-600/20 to-red-800/20',
      borderColor: 'border-red-500/20',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      badgeColor: 'bg-red-600'
    },
    {
      id: 'premium',
      name: t('premiumPlan'),
      subtitle: t('premiumSubtitle'),
      price: '$450',
      delivery: t('ninetyDayDelivery'),
      revisions: t('fiveRevisions'),
      popular: false,
      features: [
        t('functionalWebsite'),
        t('tenPages'),
        t('contentUpload'),
        t('threePlugins'),
        t('ecommerceFunctionality'),
        t('twentyProducts'),
        t('paymentIntegration'),
        t('optInForm'),
        t('autoresponderIntegration'),
        t('speedOptimization'),
        t('hostingSetup'),
        t('socialMediaIcons')
      ],
      description: t('premiumDescription'),
      color: 'from-purple-600/20 to-purple-800/20',
      borderColor: 'border-purple-500/20',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      badgeColor: 'bg-purple-600'
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

  const handleContactClick = (planId) => {
    // Navigate to contact page with selected plan
    window.location.href = `/contact?plan=${planId}`;
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-offbit text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wide">
              {t('servicesTitle')}
            </h1>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              {t('servicesDescription')}
            </p>
            
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 text-center"
              >
                ← {t('backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-16 sm:py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-offbit text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
              WHAT I <span className="text-red-500">OFFER</span>
            </h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Comprehensive development solutions using modern technologies and best practices.
            </p>
          </div>

          {/* Service Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20 text-red-400">
                <Monitor className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend Development</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Modern, responsive user interfaces built with React, Next.js, and Tailwind CSS for optimal user experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 text-red-400">
                <Server className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Backend Development</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Robust server-side applications with Node.js, Express.js, and database integration for scalable solutions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20 text-red-400">
                <Rocket className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Full-Stack Solutions</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Complete web applications with database management, authentication, and payment processing integration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-offbit text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
              {t('technologyStack')}
            </h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t('technologyDescription')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {technologies.map((tech, index) => (
              <div 
                key={tech.name}
                className={`bg-black/50 border border-red-500/20 rounded-lg p-4 text-center hover:border-red-500/40 transition-all duration-300 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-center mb-2 text-red-400">
                  {(() => {
                    const Icon = tech.icon;
                    return <Icon className="w-8 h-8 sm:w-10 sm:h-10" />;
                  })()}
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1">{tech.name}</h4>
                <p className="text-gray-400 text-xs">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Packages */}
      <div className="py-16 sm:py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-offbit text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
              SERVICE <span className="text-red-500">PACKAGES</span>
            </h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t('choosePerfectPackage')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-stretch">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id}
                className={`relative bg-black/50 border-2 ${pkg.borderColor} rounded-xl p-6 sm:p-8 hover:border-red-500/40 transition-all duration-500 group flex flex-col ${
                  pkg.popular ? 'scale-105 shadow-2xl shadow-red-500/20 border-red-500/40' : ''
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Popular Badge */}
               

                {/* Package Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-red-400 text-sm sm:text-base font-semibold mb-4">{pkg.subtitle}</p>
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{pkg.price}</div>
                  <p className="text-gray-400 text-sm">{pkg.delivery}</p>
                  <p className="text-gray-400 text-sm">{pkg.revisions}</p>
                </div>

                {/* Package Description */}
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 text-center flex-grow">
                  {pkg.description}
                </p>

                {/* Features List */}
                <div className="mb-8 flex-grow">
                  <h4 className="text-white font-semibold text-lg mb-4">{t('whatsIncluded')}:</h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✓</span>
                        <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleContactClick(pkg.id)}
                  className={`w-full ${pkg.buttonColor} text-white px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/20 mt-auto`}
                >
{t('getStarted')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-offbit text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
              {t('developmentProcess')}
            </h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t('developmentDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: t('step1'), description: t('step1Desc') },
              { step: '02', title: t('step2'), description: t('step2Desc') },
              { step: '03', title: t('step3'), description: t('step3Desc') },
              { step: '04', title: t('step4'), description: t('step4Desc') }
            ].map((process, index) => (
              <div 
                key={index}
                className={`text-center ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                  <span className="text-red-500 font-bold text-xl">{process.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{process.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 sm:py-20 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-offbit text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
            {t('readyToStart')}
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:alfayadshameer056@gmail.com"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/20"
            >
              {t('getFreeConsultation')}
            </a>
            <Link 
              href="/work"
              className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
            >
              {t('viewAllServices')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
