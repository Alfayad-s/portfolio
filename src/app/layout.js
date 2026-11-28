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
    default: "Alfayad Shameer | Full-Stack Developer in Bengaluru & Kerala",
    template: "%s | Alfayad Shameer"
  },
  description: "Alfayad Shameer is a full-stack developer working in Bengaluru at Codeteak Technologies, from Alappuzha, Kerala. He builds web, mobile, and AI products with the MERN stack and Next.js.",
  keywords: ["Alfayad Shameer", "Alfayad", "Full-Stack Developer", "Full-Stack Developer Bengaluru", "Full-Stack Developer Kerala", "Codeteak Technologies", "MERN Developer Bengaluru", "React Developer", "Next.js", "AI Integration", "Web Development", "JavaScript", "Node.js", "MongoDB", "TypeScript"],
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
    title: "Alfayad Shameer | Full-Stack Developer in Bengaluru & Kerala",
    description: "Alfayad Shameer is a full-stack developer working in Bengaluru at Codeteak Technologies, from Alappuzha, Kerala. He builds web, mobile, and AI products with the MERN stack and Next.js.",
    url: "https://alfayad.clawdage.com",
    siteName: "Alfayad Shameer · alfayad.clawdage.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alfayad Shameer, full-stack developer in Bengaluru and Kerala",
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
    title: "Alfayad Shameer | Full-Stack Developer in Bengaluru & Kerala",
    description: "Alfayad Shameer is a full-stack developer working in Bengaluru at Codeteak Technologies, from Alappuzha, Kerala. He builds web, mobile, and AI products with the MERN stack and Next.js.",
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
    alternateName: ["alfayad.clawdage.com", "Alfayad", "Alfayad Shameer Portfolio"],
    url: "https://alfayad.clawdage.com",
    description: "Portfolio of Alfayad Shameer, full-stack developer working in Bengaluru at Codeteak Technologies, from Alappuzha, Kerala.",
    inLanguage: "en",
    publisher: { "@id": "https://alfayad.clawdage.com/#person" },
    author: { "@id": "https://alfayad.clawdage.com/#person" },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://alfayad.clawdage.com/#person",
    name: "Alfayad Shameer",
    alternateName: ["Alfayad", "alfayad"],
    jobTitle: "Full-Stack Developer",
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
    description: "Alfayad Shameer is a full-stack developer currently working in Bengaluru at Codeteak Technologies. He is from Alappuzha, Kerala, and builds web, mobile, and AI products with the MERN stack and Next.js.",
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
      "Node.js",
      "Next.js",
      "MongoDB",
      "Express",
      "AI Integration",
      "Web Development",
      "MERN Stack",
      "Tailwind CSS",
    ],
    knowsLanguage: ["English", "Malayalam"],
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
