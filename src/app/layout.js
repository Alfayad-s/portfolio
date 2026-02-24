import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClickSpark from "@/components/ClickSpark";
import { LanguageProvider } from "@/context/LanguageContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Alfayad | Full-Stack Developer & AI Specialist",
    template: "%s | Alfayad Portfolio"
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  description: "Professional Full-Stack Developer specializing in MERN stack, Next.js, and AI integration. Building modern web applications, e-commerce platforms, and intelligent solutions.",
  keywords: ["Full-Stack Developer", "MERN Stack", "React Developer", "Next.js", "AI Integration", "Web Development", "E-commerce", "Dubai Developer", "JavaScript", "Node.js", "MongoDB", "Express", "Tailwind CSS", "TypeScript", "Alfayad Shameer"],
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
    title: "Alfayad | Full-Stack Developer & AI Specialist",
    description: "Professional Full-Stack Developer specializing in MERN stack, Next.js, and AI integration. Building modern web applications, e-commerce platforms, and intelligent solutions.",
    url: "https://alfayad.vercel.app",
    siteName: "Alfayad Portfolio",
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
    title: "Alfayad | Full-Stack Developer & AI Specialist",
    description: "Professional Full-Stack Developer specializing in MERN stack, Next.js, and AI integration. Building modern web applications, e-commerce platforms, and intelligent solutions.",
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
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code here
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "technology",
  applicationName: "Alfayad Portfolio",
};

export default function RootLayout({ children }) {
  // Schema.org structured data for the website
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Alfayad Portfolio",
    url: "https://alfayad.vercel.app",
    description: "Professional portfolio showcasing full-stack development projects and AI integration expertise",
    author: {
      "@type": "Person",
      name: "Alfayad Shameer",
      jobTitle: "Full-Stack Developer & AI Specialist",
      email: "alfayadshameer056@gmail.com",
      url: "https://alfayad.vercel.app",
      sameAs: [
        "https://github.com/Alfayads",
        "https://linkedin.com/in/alfayad"
      ]
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alfayad Shameer",
    jobTitle: "Full-Stack Developer & AI Specialist",
    url: "https://alfayad.vercel.app",
    email: "alfayadshameer056@gmail.com",
    description: "Professional Full-Stack Developer specializing in MERN stack, Next.js, and AI integration.",
    knowsAbout: [
      "JavaScript",
      "React",
      "Node.js",
      "Next.js",
      "MongoDB",
      "Express",
      "AI Integration",
      "Web Development",
      "E-commerce",
      "MERN Stack",
      "Tailwind CSS"
    ],
    sameAs: [
      "https://github.com/Alfayads",
      "https://linkedin.com/in/alfayad"
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* Schema.org Structured Data */}
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* Google Analytics */}
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <Analytics />
        <LanguageProvider>
          <ClickSpark
            sparkColor='#fff'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <Header />
            {children}
          </ClickSpark>
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
