'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { Bot, Plane, Flower2, Headphones, Glasses, FolderOpen, Receipt, Car, Package } from 'lucide-react';
import { getProjectById } from '@/data/projectsData';
import { useLanguage } from '@/context/LanguageContext';

const PROJECT_ICONS = { Bot, Plane, Flower2, Headphones, Glasses, FolderOpen, Receipt, Car, Package };

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [project, setProject] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const projectData = getProjectById(params.id);
    if (projectData) {
      setProject(projectData);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [params.id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <Link 
            href="/work"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Schema.org structured data for the project
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: {
      "@type": "Person",
      name: "Alfayad Shameer",
      url: "https://alfayad.vercel.app"
    },
    dateCreated: project.year,
    url: project.link !== "#" ? project.link : `https://alfayad.vercel.app/work/${project.id}`,
    keywords: project.technologies.join(", "),
    image: `https://alfayad.vercel.app${project.image}`,
    inLanguage: "en"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://alfayad.vercel.app"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: "https://alfayad.vercel.app/work"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://alfayad.vercel.app/work/${project.id}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Schema.org Structured Data */}
      <Script
        id="project-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* Hero Section */}
      <div className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Back Button */}
            <Link 
              href="/work"
              className="inline-flex items-center text-red-400 hover:text-red-300 mb-8 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>

            {/* Project Header */}
            <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
              <div>
                <div className={`inline-block ${project.badgeColor} text-white px-4 py-1 rounded-full text-sm font-semibold mb-4`}>
                  {project.badge}
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wide">
                  {project.title}
                </h1>
                <p className="text-red-400 text-xl sm:text-2xl font-semibold mb-4">{project.subtitle}</p>
                <p className="text-gray-300 text-lg max-w-3xl">{project.description}</p>
              </div>
              
              {project.link !== "#" && (
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/20 flex items-center gap-2"
                >
                  View Live Project
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Project Meta */}
            <div className="flex flex-wrap gap-6 text-gray-300">
              <div>
                <span className="text-red-400 font-semibold">Role:</span> {project.role}
              </div>
              <div>
                <span className="text-red-400 font-semibold">Duration:</span> {project.duration}
              </div>
              <div>
                <span className="text-red-400 font-semibold">Year:</span> {project.year}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Image */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative rounded-2xl overflow-hidden border border-red-500/20 shadow-2xl shadow-red-500/10">
              <div className={`w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                <Image 
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className={`w-full h-full bg-gradient-to-br ${project.gradient} flex items-center justify-center absolute inset-0`} style={{display: 'none'}}>
                  {project.fallbackIcon && (() => {
                    const Icon = PROJECT_ICONS[project.fallbackIcon];
                    return Icon ? <Icon className="w-32 h-32 sm:w-40 sm:h-40 text-white/90" aria-hidden /> : null;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="py-12 sm:py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
            Technologies Used
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {project.technologies.map((tech, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${project.gradient} border border-red-500/20 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-110 hover:border-red-500/40 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${400 + index * 50}ms` }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`bg-black/50 border border-red-500/20 rounded-2xl p-8 sm:p-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Project Overview
            </h2>
            <div className="w-20 h-1 bg-red-500 mb-8"></div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {project.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-black/50 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${600 + index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-red-600/20 rounded-lg p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-lg">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges & Solutions */}
      <div className="py-12 sm:py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Challenges */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                Challenges
              </h2>
              <div className="space-y-6">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-orange-600/20 rounded-lg p-2 flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-lg">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                Solutions
              </h2>
              <div className="space-y-6">
                {project.solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-green-600/20 rounded-lg p-2 flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-lg">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
            Results & Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.results.map((result, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${project.gradient} border border-red-500/20 rounded-xl p-8 transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${900 + index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 rounded-lg p-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-white text-lg font-semibold">{result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 sm:py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
            INTERESTED IN A <span className="text-red-500">SIMILAR PROJECT?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Let&apos;s discuss how I can help bring your ideas to life with cutting-edge technology and creative solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:alfayadshameer056@gmail.com"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/20"
            >
              GET IN TOUCH
            </a>
            <Link 
              href="/work"
              className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
            >
              VIEW ALL PROJECTS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

