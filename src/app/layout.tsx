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
  applicationName: "ZEDX Copilot",
  appleWebApp: {
    title: "ZEDX Copilot",
    statusBarStyle: "default",
    capable: true,
  },
  title: {
    default: "ZEDX Copilot - Live Meeting & Accessibility Assistant",
    template: "%s | ZEDX Copilot"
  },
  description: "ZEDX Copilot is a real-time AI meeting assistant providing live transcriptions, contextual summaries, and cognitive accessibility during professional meetings.",
  keywords: [
    "ZEDX", "ZEDX AI", "ZEDX Copilot", "Meeting Assistant", "Live Transcription",
    "Accessibility Tool", "Meeting Copilot", "AI Meeting Notes", "Real-time AI Assistant",
    "Hearing Impaired Assistant", "Zoom Copilot", "Teams Assistant", "Google Meet Copilot",
    "مساعد اجتماعات", "تفريغ صوتي مباشر", "ذكاء اصطناعي", "مساعد ذوي الهمم"
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
    siteName: "ZEDX Copilot",
    title: "ZEDX Copilot - Live Meeting Assistant",
    description: "Your live meeting transcription and cognitive accessibility assistant.",
    images: [
      {
        url: "/zedx-cyberpunk-banner.png",
        width: 1200,
        height: 630,
        alt: "ZEDX Copilot - Meeting Assistant",
      },
      {
        url: "/zedx-logo.png",
        width: 512,
        height: 512,
        alt: "ZEDX Copilot Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEDX Copilot - Live Meeting Assistant",
    description: "Real-time AI meeting transcription and accessibility insights.",
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
        <meta name="name" content="ZEDX Copilot" />
        <meta name="author" content="Ziad Emad" />
        <meta property="og:site_name" content="ZEDX Copilot" />
        <meta name="apple-mobile-web-app-title" content="ZEDX Copilot" />
        <meta name="msvalidate.01" content="410978477B68DFFC4D1109011EAF121F" />
        <script
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ZEDX Copilot",
              "alternateName": ["ZEDX", "ZEDX Copilot", "ZedX AI Assistant"],
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ZEDX Copilot",
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png",
              "sameAs": [
                "https://github.com/ziademad02153/ZEDX-AI-Assistant"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ZEDX Copilot",
              "alternateName": ["ZEDX Copilot", "ZEDX"],
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "description": "ZEDX Copilot is a real-time AI meeting assistant providing live transcriptions and accessibility features.",
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
                "name": "ZEDX Copilot",
                "url": "https://zedx-ai-assistant-1.vercel.app",
                "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png"
              },
              "brand": {
                "@type": "Brand",
                "name": "ZEDX Copilot",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ZEDX Copilot",
              "alternateName": ["ZEDX", "ZEDX Copilot"],
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png",
              "description": "ZEDX Copilot - Free Real-Time Meeting & Accessibility Assistant.",
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

