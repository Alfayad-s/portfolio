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
};

export const metadata = {
  title: {
    default: "Alfayad Shameer | Full-Stack Developer in Kerala",
    template: "%s | Alfayad Shameer"
  },
  description: "Alfayad Shameer is a full-stack developer in Alappuzha, Kerala, India. He builds web, mobile, and AI products with the MERN stack and Next.js.",
  keywords: ["Alfayad Shameer", "Alfayad", "Full-Stack Developer", "Full-Stack Developer Kerala", "MERN Developer Kerala", "React Developer", "Next.js", "AI Integration", "Web Development", "JavaScript", "Node.js", "MongoDB", "TypeScript"],
  authors: [{ name: "Alfayad Shameer", url: "https://alfayad.vercel.app" }],
  creator: "Alfayad Shameer",
  publisher: "Alfayad Shameer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://alfayad.vercel.app"),
  alternates: {
    canonical: "https://alfayad.vercel.app",
  },
  openGraph: {
    title: "Alfayad Shameer | Full-Stack Developer in Kerala",
    description: "Alfayad Shameer is a full-stack developer in Alappuzha, Kerala, India. He builds web, mobile, and AI products with the MERN stack and Next.js.",
    url: "https://alfayad.vercel.app",
    siteName: "Alfayad Shameer",
    images: [
      {
        url: "https://alfayad.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alfayad - Full-Stack Developer & AI Specialist Portfolio",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfayad Shameer | Full-Stack Developer in Kerala",
    description: "Alfayad Shameer is a full-stack developer in Alappuzha, Kerala, India. He builds web, mobile, and AI products with the MERN stack and Next.js.",
    images: ["https://alfayad.vercel.app/og-image.png"],
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
  applicationName: "Alfayad Shameer",
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Alfayad Shameer",
    url: "https://alfayad.vercel.app",
    description: "Alfayad Shameer is a full-stack developer in Alappuzha, Kerala, India.",
    author: { "@id": "https://alfayad.vercel.app/#person" },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://alfayad.vercel.app/#person",
    name: "Alfayad Shameer",
    jobTitle: "Full-Stack Developer",
    url: "https://alfayad.vercel.app",
    email: "alfayadshameer056@gmail.com",
    description: "Alfayad Shameer is a full-stack developer in Alappuzha, Kerala, India. He builds web, mobile, and AI products with the MERN stack and Next.js.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Alappuzha",
      addressRegion: "Kerala",
      addressCountry: "IN",
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
      "Tailwind CSS"
    ],
    sameAs: [
      "https://github.com/Alfayad-s",
      "https://linkedin.com/in/alfayad",
      "https://www.upwork.com/freelancers/~01a7a783248f424c71",
      "https://x.com/alfayad",
      "https://instagram.com/alfayads",
      "https://facebook.com/alfayad"
    ]
  };

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: "https://alfayad.vercel.app",
    name: "Alfayad Shameer",
    mainEntity: { "@id": "https://alfayad.vercel.app/#person" },
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
