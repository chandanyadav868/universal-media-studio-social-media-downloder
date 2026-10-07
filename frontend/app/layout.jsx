import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaMarquee from "../components/MediaMarquee";
import CookieConsent from "../components/CookieConsent";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://socialmediadownloader.humantalking.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Universal Media Studio — Zero-Disk 4K Video, Audio & Image Downloader",
    template: "%s | Universal Media Studio"
  },
  description: "Fast, secure, and free zero-disk media downloader. Download 1080p/4K YouTube videos with audio, YouTube community post photos, Instagram Reels, Facebook videos, and X.com photos with zero compression.",
  keywords: [
    "universal media downloader",
    "zero disk video downloader",
    "youtube 1080p downloader with audio",
    "youtube community post downloader",
    "youtube maxres thumbnail grabber",
    "instagram photo download",
    "instagram reels downloader",
    "facebook hd video downloader",
    "tiktok no watermark",
    "twitter x image downloader"
  ],
  authors: [{ name: "Universal Media Studio Team" }],
  creator: "Universal Media Studio",
  publisher: "Universal Media Studio",
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
    url: SITE_URL,
    siteName: "Universal Media Studio",
    title: "Universal Media Studio — Zero-Disk Media Downloader",
    description: "Stream and download 1080p/4K videos, audio, and high-res photos directly in your browser with 0% compression.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Media Studio — Zero-Disk Media Downloader",
    description: "Free high-speed 1080p video, audio, and photo downloader for YouTube, Instagram, Facebook, and TikTok.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport = {
  themeColor: "#080c15",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Universal Media Studio",
    "url": SITE_URL,
    "description": "Fast and free zero-disk media downloader for YouTube, Instagram Reels, Facebook, TikTok, X (Twitter), and High-Res Images.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />

        <meta name="google-adsense-account" content="ca-pub-1412205696232927" />

        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1412205696232927"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

                {/* Monetag In-Page Push (Non-blocking toast banners) */}
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(s){s.dataset.zone='11973493',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))"
          }}
        />

        {/* Monetag Web Push Notification */}
        <script
          src="https://5gvci.com/act/files/tag.min.js?z=11973521"
          data-cfasync="false"
          async
        />

<script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#080c15] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
        {/* Dynamic Route-Aware Navigation Bar */}
        <Navbar />

        {/* Main Page Content Centered with Balanced Margins */}
        <main className="w-full max-w-6xl mx-auto flex-1 px-4 sm:px-8 py-8 sm:py-12">
          {children}
        </main>

        {/* Seamless Running Media Loop Marquee */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-4">
          <MediaMarquee title="Supported High-Definition Networks (All Available in 1 Click)" />
        </div>

        {/* Comprehensive AdSense-Approved & SEO Compliant Footer */}
        <Footer />

        {/* Non-Intrusive GDPR & AdSense Compliant Cookie Consent */}
        <CookieConsent />
      </body>
    </html>
  );
}
