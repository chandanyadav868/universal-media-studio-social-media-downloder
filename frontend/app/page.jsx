import MediaStudio from "../components/MediaStudio";
import { Copy, Sparkles, Download, HelpCircle, ShieldCheck, Zap } from "lucide-react";

// Server-Side Rendered SEO Metadata for Google #1 Ranking
export const metadata = {
  title: "Universal Video Downloader — Download 1080p, 4K & MP3 Free",
  description: "Fast and free online video downloader for YouTube, Instagram Reels, Facebook, TikTok, and Twitter. High speed in-memory streaming with no registration required.",
  keywords: [
    "youtube downloader",
    "1080p video downloader",
    "instagram reel download",
    "facebook video saver",
    "tiktok no watermark downloader",
    "mp3 audio converter",
    "free online video downloader"
  ],
  openGraph: {
    title: "Universal Video Downloader — Fast & Free HD Media Saver",
    description: "Download Full HD 1080p videos with crystal-clear audio directly in your browser. Fast, safe, and zero-disk streaming.",
    url: "https://yourdomain.com",
    siteName: "Universal Media Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Video Downloader — 1080p, 4K & MP3",
    description: "Download high quality videos from YouTube, Instagram, Facebook, and TikTok for free.",
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Tool Component */}
      <MediaStudio />

      {/* How to Download Steps Section */}
      <section className="w-full max-w-4xl mx-auto mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-slate-800/80">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2 block">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How to Download Media in 3 Seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {/* Step 1 */}
          <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-105 transition-transform border border-blue-500/20">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Copy size={18} className="text-blue-400" />
                <span>Copy URL</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Copy the video, Reel, post, or photo URL from YouTube, Instagram, Facebook, TikTok, or X.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-105 transition-transform border border-indigo-500/20">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-400" />
                <span>Paste & Inspect</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Paste the URL into the search box above. Click <strong>Fetch Video</strong> to instantly reveal 1080p, 4K, and MP3 options.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-105 transition-transform border border-emerald-500/20">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Download size={18} className="text-emerald-400" />
                <span>Stream & Save</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Click your preferred quality tier. The high-speed zero-disk pipeline delivers your file directly into your device storage.
              </p>
            </div>
          </div>
        </div>

        {/* SEO FAQ Section */}
        <div className="w-full">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2 block">
              Clear & Transparent
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h4 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-400 shrink-0" />
                <span>Is Universal Media Studio 100% free?</span>
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Yes, our tool is 100% free with unlimited downloads. There is no software to install, no accounts to register, and no hidden subscriptions.
              </p>
            </div>

            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h4 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Zap size={18} className="text-indigo-400 shrink-0" />
                <span>Does this tool download 1080p Full HD with Audio?</span>
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Yes! Other download tools often produce silent 1080p files because modern video networks separate video and audio streams. Our zero-disk engine automatically muxes the high-definition video with full stereo AAC audio in real time.
              </p>
            </div>

            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h4 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                <span>Are any files stored on your servers?</span>
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Never. We operate on a strict zero-disk architecture. Media chunks flow directly from public CDNs through memory buffers straight into your browser, with 0% server-side disk writes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
