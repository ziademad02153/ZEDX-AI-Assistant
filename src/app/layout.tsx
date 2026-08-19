import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/error-boundary";
import { ConfirmDialogProvider } from "@/components/confirm-dialog";
import { DesktopNavBar } from "@/components/desktop-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zedx-ai-assistant-1.vercel.app"),
  applicationName: "ZEDX AI Interview Simulator",
  appleWebApp: {
    title: "ZEDX AI Interview Simulator",
    statusBarStyle: "default",
    capable: true,
  },
  title: {
    default: "ZEDX AI Interview Simulator",
    template: "%s | ZEDX AI Interview Simulator"
  },
  description: "ZEDX AI Interview Simulator is a real-time AI interview simulation coach providing live transcriptions, example answers, and feedback for job seekers and fresh graduates.",
  keywords: [
    "ZEDX", "ZEDX AI", "ZEDX AI Simulator", "Mock Interview Coach", "Live Transcription",
    "Interview Simulation", "Mock Interview Coach", "AI Interview Notes", "Real-time AI Coach",
    "Training Coach", "Interview Practice", "Job Seeker Coach", "AI Coach",
    "interview simulator", "live transcription", "interview training", "artificial intelligence", "personal coach"
  ],
  authors: [{ name: "ZEDX AI Team", url: "https://zedx-ai-assistant-1.vercel.app" }],
  creator: "ZEDX AI",
  publisher: "ZEDX AI",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zedx-ai-assistant-1.vercel.app",
    siteName: "ZEDX AI Interview Simulator",
    title: "ZEDX AI Interview Simulator",
    description: "Your live interview simulation and training coach.",
    images: [
      {
        url: "/zedx-cyberpunk-banner.png",
        width: 1200,
        height: 630,
        alt: "ZEDX AI Interview Simulator",
      },
      {
        url: "/zedx-logo.png",
        width: 512,
        height: 512,
        alt: "ZEDX AI Simulator Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEDX AI Interview Simulator",
    description: "Real-time AI interview simulation and verification insights.",
    images: ["/zedx-cyberpunk-banner.png"],
    creator: "@zedx_ai",
  },
  alternates: {
    canonical: "https://zedx-ai-assistant-1.vercel.app",
  },
  verification: {
    google: "googleac3039da11f6677e",
  },
  category: "Technology",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" }, // Favicon for Google Search
      { url: "/zedx-logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const xUrl = headersList.get("x-url") || "";

  // Robust detection: check for headers or URL patterns (fallback for dev mode issues)
  const isScanner = headersList.get("x-is-scanner") === "true" || xUrl.toLowerCase().includes("scanner-frame");
  const isOverlay = xUrl.toLowerCase().includes("isoverlay=true") || xUrl.toLowerCase().includes("overlay");
  const isHideNav = isScanner || isOverlay;

  return (
    <html lang="en" suppressHydrationWarning className={isScanner ? "bg-transparent" : ""}>
      <head>
        <meta name="name" content="ZEDX AI Interview Simulator" />
        <meta name="author" content="Ziad Emad" />
        <meta property="og:site_name" content="ZEDX AI Interview Simulator" />
        <meta name="apple-mobile-web-app-title" content="ZEDX AI Interview Simulator" />
        <meta name="msvalidate.01" content="410978477B68DFFC4D1109011EAF121F" />
        <script
          key="theme-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("theme");
                  if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data for SEO - Site Identity */}
        <script
          key="schema-site-identity"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ZEDX AI Interview Simulator",
              "alternateName": ["ZEDX", "ZEDX AI Simulator", "ZedX AI Coach"],
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png",
              "image": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://zedx-ai-assistant-1.vercel.app/dashboard?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Organization Schema for Logo recognition */}
        <script
          key="schema-org-logo"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ZEDX AI Interview Simulator",
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png",
              "sameAs": [
                "https://github.com/ziademad02153/ZEDX-AI-Assistant"
              ]
            })
          }}
        />
        <script
          key="schema-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ZEDX AI Interview Simulator",
              "alternateName": ["ZEDX AI Simulator", "ZEDX"],
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "description": "ZEDX AI Interview Simulator is a real-time AI interview simulation coach providing live transcriptions and answer verification.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "150"
              },
              "author": {
                "@type": "Organization",
                "name": "ZEDX AI Interview Simulator",
                "url": "https://zedx-ai-assistant-1.vercel.app",
                "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png"
              },
              "brand": {
                "@type": "Brand",
                "name": "ZEDX AI Interview Simulator",
                "alternateName": ["ZEDX", "zedx"]
              },
              "sameAs": [
                "https://www.producthunt.com/posts/zedx-ai"
              ]
            })
          }}
        />
        {/* Organization Schema for Brand Recognition */}
        <script
          key="schema-org-brand"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ZEDX AI Interview Simulator",
              "alternateName": ["ZEDX", "ZEDX AI Simulator"],
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png",
              "description": "ZEDX AI Interview Simulator - Free Real-Time Interview Simulation & Training Coach.",
              "sameAs": [
                "https://www.producthunt.com/posts/zedx-ai"
              ]
            })
          }}
        />

      </head>
      <body
        className={`${inter.variable} antialiased ${isScanner ? 'bg-transparent overflow-hidden' : ''}`}
        suppressHydrationWarning
      >
        {!isHideNav && <DesktopNavBar />}
        <ErrorBoundary>
          <ConfirmDialogProvider>
            {children}
          </ConfirmDialogProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

/ /   F o r c e   V e r c e l   R e d e p l o y  
 