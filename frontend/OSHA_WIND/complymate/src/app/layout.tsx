import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ComplyMate - AI-Powered OSHA Compliance Platform",
    template: "%s | ComplyMate",
  },
  description: "Enterprise-grade OSHA compliance platform powered by AI. Streamline safety management, automate compliance tracking, and protect your workforce with intelligent insights.",
  keywords: [
    "OSHA compliance",
    "safety management",
    "workplace safety",
    "compliance automation",
    "safety training",
    "incident reporting",
    "safety audits",
    "enterprise safety",
    "AI safety platform",
    "compliance tracking"
  ],
  authors: [{ name: "ComplyMate Team" }],
  creator: "ComplyMate",
  publisher: "ComplyMate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://complymate.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://complymate.com",
    title: "ComplyMate - AI-Powered OSHA Compliance Platform",
    description: "Enterprise-grade OSHA compliance platform powered by AI. Streamline safety management, automate compliance tracking, and protect your workforce.",
    siteName: "ComplyMate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ComplyMate - AI-Powered OSHA Compliance Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ComplyMate - AI-Powered OSHA Compliance Platform",
    description: "Enterprise-grade OSHA compliance platform powered by AI. Streamline safety management, automate compliance tracking, and protect your workforce.",
    images: ["/og-image.png"],
    creator: "@complymate",
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
    google: "your-google-verification-code",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "ComplyMate",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ComplyMate" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
