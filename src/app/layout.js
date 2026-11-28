import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import TapSound from "@/components/TapSound";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e6e6e6",
};

export const metadata = {
  title: {
    default: "Alfayad Shameer (Fayad) | Full-Stack & Mobile App Developer in Bengaluru",
    template: "%s | Alfayad Shameer"
  },
  description: "Alfayad Shameer (Fayad / Alfayad S) is a full-stack and mobile app developer in Bengaluru at Codeteak Technologies, from Alappuzha, Kerala. Hire for web development, React Native apps, UI/UX, APIs, AI integration, and budget-friendly product builds.",
  keywords: [
    "Alfayad Shameer",
    "Alfayad",
    "Alfayad S",
    "Alfayad-s",
    "Fayad",
    "Full-Stack Developer",
    "Full-Stack Developer Bengaluru",
    "Full-Stack Developer Bangalore",
    "Full-Stack Developer Kerala",
    "Mobile App Developer",
    "Mobile App Developer Bengaluru",
    "React Native Developer",
    "React Developer",
    "Next.js Developer",
    "MERN Developer",
    "MERN Developer Bengaluru",
    "UI/UX Designer",
    "Freelance Developer",
    "Freelance Developer Bengaluru",
    "Hire Developer Bengaluru",
    "Web Development",
    "Mobile App Development",
    "Budget Web Development",
    "Affordable App Development",
    "Custom Software Development",
    "API Development",
    "AI Integration",
    "Codeteak Technologies",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Alappuzha Developer",
    "Kerala Developer",
  ],
  authors: [{ name: "Alfayad Shameer", url: "https://alfayad.clawdage.com" }],
  creator: "Alfayad Shameer",
  publisher: "Alfayad Shameer",
  applicationName: "Alfayad Shameer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://alfayad.clawdage.com"),
  alternates: {
    canonical: "https://alfayad.clawdage.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "Alfayad Shameer (Fayad) | Full-Stack & Mobile App Developer in Bengaluru",
    description: "Alfayad Shameer (Fayad / Alfayad S) builds web apps, mobile apps, and AI products in Bengaluru. Hire for MERN, React Native, UI/UX, APIs, and budget-friendly development.",
    url: "https://alfayad.clawdage.com",
    siteName: "Alfayad Shameer · alfayad.clawdage.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alfayad Shameer (Fayad), full-stack and mobile app developer in Bengaluru",
        type: "image/png",
      },
      {
        url: "/profile.png",
        width: 1024,
        height: 1536,
        alt: "Portrait of Alfayad Shameer",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfayad Shameer (Fayad) | Full-Stack & Mobile App Developer in Bengaluru",
    description: "Alfayad Shameer (Fayad / Alfayad S) builds web apps, mobile apps, and AI products in Bengaluru. Hire for MERN, React Native, UI/UX, APIs, and budget-friendly development.",
    images: ["/og-image.png"],
    creator: "@alfayad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://alfayad.clawdage.com/#website",
    name: "Alfayad Shameer",
    alternateName: [
      "alfayad.clawdage.com",
      "Alfayad",
      "Fayad",
      "Alfayad S",
      "Alfayad Shameer Portfolio",
    ],
    url: "https://alfayad.clawdage.com",
    description:
      "Portfolio of Alfayad Shameer (Fayad) — full-stack and mobile app developer in Bengaluru offering web development, React Native apps, UI/UX, APIs, and budget-friendly product builds.",
    inLanguage: "en",
    publisher: { "@id": "https://alfayad.clawdage.com/#person" },
    author: { "@id": "https://alfayad.clawdage.com/#person" },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://alfayad.clawdage.com/#person",
    name: "Alfayad Shameer",
    alternateName: ["Fayad", "Alfayad", "Alfayad S", "Alfayad-s", "alfayad"],
    jobTitle: "Full-Stack Developer & Mobile App Developer",
    worksFor: {
      "@type": "Organization",
      name: "Codeteak Technologies",
      url: "https://codeteak.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    url: "https://alfayad.clawdage.com",
    email: "mailto:alfayadshameer056@gmail.com",
    image: {
      "@type": "ImageObject",
      url: "https://alfayad.clawdage.com/profile.png",
      contentUrl: "https://alfayad.clawdage.com/profile.png",
      caption: "Alfayad Shameer",
    },
    description:
      "Alfayad Shameer (also known as Fayad and Alfayad S) is a full-stack and mobile app developer currently working in Bengaluru at Codeteak Technologies. From Alappuzha, Kerala. He builds web apps, React Native mobile apps, UI/UX, APIs, and AI-integrated products, including budget-friendly freelance development.",
    homeLocation: {
      "@type": "Place",
      name: "Alappuzha, Kerala, India",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Alappuzha",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
    },
    workLocation: {
      "@type": "Place",
      name: "Bengaluru, Karnataka, India",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    nationality: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "React Native",
      "Node.js",
      "Next.js",
      "MongoDB",
      "Express",
      "AI Integration",
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
      "MERN Stack",
      "Tailwind CSS",
      "API Development",
      "Freelance Web Development",
      "Budget Web Development",
      "Affordable App Development",
    ],
    knowsLanguage: ["English", "Malayalam"],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Full-stack web development",
          description: "Custom web apps with React, Next.js, Node.js, and the MERN stack.",
        },
        areaServed: ["Bengaluru", "Bangalore", "Kerala", "India", "Remote"],
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mobile app development",
          description: "Cross-platform mobile apps with React Native.",
        },
        areaServed: ["Bengaluru", "Bangalore", "Kerala", "India", "Remote"],
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "UI/UX design",
          description: "Interface and product design for web and mobile products.",
        },
        areaServed: ["Bengaluru", "Bangalore", "Kerala", "India", "Remote"],
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Budget-friendly product development",
          description: "Affordable web and mobile product builds for startups and small businesses.",
        },
        areaServed: ["Bengaluru", "Bangalore", "Kerala", "India", "Remote"],
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI-integrated software",
          description: "APIs and products with AI integration.",
        },
        areaServed: ["Bengaluru", "Bangalore", "Kerala", "India", "Remote"],
      },
    ],
    sameAs: [
      "https://github.com/Alfayad-s",
      "https://linkedin.com/in/alfayad",
      "https://www.upwork.com/freelancers/~01a7a783248f424c71",
      "https://x.com/alfayad",
      "https://instagram.com/alfayads",
      "https://facebook.com/alfayad",
      "https://hirefayad.vercel.app",
    ],
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://alfayad.clawdage.com/#services",
    name: "Alfayad Shameer — Web & Mobile Development",
    alternateName: ["Fayad developer Bengaluru", "Alfayad S freelance developer"],
    url: "https://alfayad.clawdage.com",
    description:
      "Professional web development, mobile app development, UI/UX, API, and AI integration services from Alfayad Shameer (Fayad) in Bengaluru — including budget-friendly product builds.",
    provider: { "@id": "https://alfayad.clawdage.com/#person" },
    areaServed: [
      { "@type": "City", name: "Bengaluru" },
      { "@type": "City", name: "Bangalore" },
      { "@type": "State", name: "Karnataka" },
      { "@type": "State", name: "Kerala" },
      { "@type": "Country", name: "India" },
    ],
    serviceType: [
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
      "API Development",
      "AI Integration",
      "Freelance Software Development",
    ],
  };

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://alfayad.clawdage.com/#profile",
    url: "https://alfayad.clawdage.com",
    name: "Alfayad Shameer · alfayad.clawdage.com",
    isPartOf: { "@id": "https://alfayad.clawdage.com/#website" },
    mainEntity: { "@id": "https://alfayad.clawdage.com/#person" },
    about: { "@id": "https://alfayad.clawdage.com/#person" },
  };

  return (
    <html lang="en">
      <head>
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <Script
          id="profile-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profileSchema),
          }}
        />
        <Script
          id="services-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(servicesSchema),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <Analytics />
        <TapSound />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
