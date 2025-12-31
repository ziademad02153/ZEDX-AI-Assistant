import type { Metadata } from "next";
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
  applicationName: "ZEDX AI",
  appleWebApp: {
    title: "ZEDX AI",
    statusBarStyle: "default",
    capable: true,
  },
  themeColor: "#16a34a",
  title: {
    default: "ZEDX AI - Free AI Interview Assistant & Copilot",
    template: "%s | ZEDX AI"
  },
  description: "ZEDX AI is the best free AI interview assistant & copilot. Get real-time answers for coding, behavioral, and technical questions. Ace your Zoom, Teams, or Google Meet interviews.",
  keywords: [
    "ZEDX", "ZEDX AI", "ZEDX-AI", "zedx", "zedx ai", "zed x ai",
    "AI Interview Assistant", "AI for Interview", "Interview Copilot", "Interview AI",
    "Real-time Interview Helper", "AI Interview Cheat Sheet", "Coding Interview AI",
    "Free AI Interview Tool", "Live Interview Assistant", "Job Interview Copilot",
    "Technical Interview AI", "AI Resume Copilot",
    "مساعد المقابلات", "ذكاء اصطناعي للمقابلات", "حل اسئلة الانترفيو"
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
    siteName: "ZEDX AI",
    title: "ZEDX AI - Free AI Interview Assistant",
    description: "Your free AI-powered interview copilot. Get real-time answers and ace your next interview with ZEDX AI.",
    images: [
      {
        url: "/zedx-cyberpunk-banner.png",
        width: 1200,
        height: 630,
        alt: "ZEDX AI - AI Interview Assistant",
      },
      {
        url: "/zedx-logo.png",
        width: 512,
        height: 512,
        alt: "ZEDX AI Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEDX AI - Free AI Interview Assistant",
    description: "Your free AI-powered interview copilot. Get real-time answers and ace your next interview.",
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
      { url: "/zedx-logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ZEDX AI",
              "alternateName": ["ZEDX", "ZEDX-AI", "zedx ai"],
              "url": "https://zedx-ai-assistant-1.vercel.app"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ZEDX AI",
              "alternateName": ["ZEDX", "ZEDX-AI", "zedx ai", "zedx", "ZedX AI", "Zedx", "zed x ai"],
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "description": "ZEDX AI is your free AI-powered interview copilot. Get real-time AI answers during job interviews, practice with AI, and ace your next interview.",
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
                "name": "ZEDX AI",
                "url": "https://zedx-ai-assistant-1.vercel.app",
                "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png"
              },
              "brand": {
                "@type": "Brand",
                "name": "ZEDX AI",
                "alternateName": ["ZEDX", "zedx", "zedx ai"]
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
              "name": "ZEDX AI",
              "alternateName": ["ZEDX", "zedx", "zedx ai", "ZedX"],
              "url": "https://zedx-ai-assistant-1.vercel.app",
              "logo": "https://zedx-ai-assistant-1.vercel.app/zedx-logo.png",
              "description": "ZEDX AI - Free AI Interview Assistant & Copilot. Get real-time answers during job interviews.",
              "sameAs": [
                "https://www.producthunt.com/posts/zedx-ai"
              ]
            })
          }}
        />

      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <DesktopNavBar />
        <ErrorBoundary>
          <ConfirmDialogProvider>
            {children}
          </ConfirmDialogProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

