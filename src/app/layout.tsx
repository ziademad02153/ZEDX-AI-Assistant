import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZEDX-AI | Free AI Interview Assistant & Copilot",
  description: "ZEDX-AI is your free AI-powered interview copilot. Get real-time answers during interviews with AI assistance. Practice interviews, upload resumes, and ace your next job interview.",
  keywords: ["ZEDX", "ZEDX-AI", "ZEDX AI", "AI Interview", "Interview Assistant", "AI Copilot", "Interview Helper", "Job Interview", "AI Interview Practice", "Free Interview Tool"],
  authors: [{ name: "ZEDX-AI Team" }],
  creator: "ZEDX-AI",
  publisher: "ZEDX-AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zedx-ai-assistant-1.vercel.app",
    siteName: "ZEDX-AI",
    title: "ZEDX-AI | Free AI Interview Assistant",
    description: "Your free AI-powered interview copilot. Get real-time answers and ace your next interview.",
    images: [{ url: "/zedx-logo.png", width: 512, height: 512, alt: "ZEDX-AI Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEDX-AI | Free AI Interview Assistant",
    description: "Your free AI-powered interview copilot. Get real-time answers and ace your next interview.",
    images: ["/zedx-logo.png"],
  },
  alternates: {
    canonical: "https://zedx-ai-assistant-1.vercel.app",
  },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                } catch (e) {}
              })();
            `,
          }}
        />

      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

