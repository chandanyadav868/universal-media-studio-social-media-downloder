import MediaStudio from "../components/MediaStudio";
import AdsterraBanner from "../components/AdsterraBanner";
import OwnProductPromo from "../components/OwnProductPromo";
import { 
  Copy, Sparkles, Download, HelpCircle, ShieldCheck, Zap, 
  Film, Music, Layers, CheckCircle2, Lock, Smartphone, Globe
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://socialmediadownloader.humantalking.com";

// Server-Side Rendered SEO Metadata for Google #1 Ranking (<580 pixels title)
export const metadata = {
  title: "Universal Video Downloader — 1080p, 4K & MP3",
  description: "Fast, free zero-disk video downloader for YouTube, Instagram, Facebook & TikTok. Download 1080p, 4K & MP3 instantly without registration.",
  keywords: [
    "universal video downloader",
    "youtube downloader 1080p with audio",
    "instagram reels downloader",
    "facebook hd video saver",
    "tiktok no watermark",
    "mp3 320kbps converter",
    "zero disk media studio",
    "twitter x image downloader"
  ],
  openGraph: {
    title: "Universal Video Downloader — 1080p, 4K & MP3",
    description: "Download Full HD 1080p videos with crystal-clear audio directly in your browser. Fast, safe, and zero-disk streaming.",
    url: SITE_URL,
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
    canonical: `${SITE_URL}/`,
  },
};

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Universal Media Studio 100% free with no hidden fees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our zero-disk media downloader is 100% free to use with unlimited video and image downloads. There are no registration forms, no subscriptions, and no desktop applications required."
        }
      },
      {
        "@type": "Question",
        "name": "How does this tool download 1080p and 4K YouTube videos with audio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Modern video streaming platforms split high-resolution 1080p and 4K video feeds from audio streams. Our zero-disk streaming pipeline utilizes in-memory multiplexing to combine the visual and audio streams into a seamless MP4 container in real-time."
        }
      },
      {
        "@type": "Question",
        "name": "Are any personal files or videos stored on your servers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Never. We maintain a strict zero-disk policy. Media bytes are streamed directly through RAM memory buffers from content delivery networks straight to your local device without ever writing to temporary server disks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert video files into 320kbps MP3 audio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every supported video URL includes high-fidelity audio options, allowing you to extract studio-grade 320kbps and 256kbps MP3 files for offline listening."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe and legal to download social media content for personal use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Downloading public media for private personal archiving, research, and non-commercial fair use is widely permitted. Users must respect original creator copyright terms and avoid unauthorized commercial redistribution."
        }
      }
    ]
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Schema.org FAQ Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Main Interactive Downloader Studio Component */}
      <MediaStudio />

      {/* High-CTR Native Recommendation Grid (Placed directly below input, above Effortless Workflow) */}
      <div className="w-full max-w-5xl mx-auto my-8">
        <AdsterraBanner type="native3x1" />
      </div>

      {/* Featured Sister Tool: Own Product Cross-Promotion */}
      <div className="w-full max-w-5xl mx-auto mb-8">
        <OwnProductPromo targetUrl="https://www.polishai.in/" />
      </div>

      {/* Crawlable High-Authority Content Layer (800+ Words for SEO Indexing) */}
      <article className="w-full max-w-4xl mx-auto mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-slate-800/80">
        
        {/* Section 1: How It Works */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2 block">
              Effortless Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              How to Download High-Definition Media in 3 Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-lg mb-4 border border-blue-500/20">
                  01
                </div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Copy size={18} className="text-blue-400" />
                  <span>Copy Any Media Link</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Navigate to YouTube, Instagram, Facebook, TikTok, or X. Copy the direct share URL of any public video, Reel, Short, or photo post to your clipboard.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-lg mb-4 border border-indigo-500/20">
                  02
                </div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-400" />
                  <span>Inspect Available Formats</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Paste the link into the search console above and tap <strong>Fetch Video</strong>. Our inspection engine instantly lists all available resolutions from 720p up to 4K UHD.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg mb-4 border border-emerald-500/20">
                  03
                </div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Download size={18} className="text-emerald-400" />
                  <span>Direct In-Memory Download</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Select your desired file format. The zero-disk stream initiates instantly, piping high-speed chunked data straight to your browser without server disk delays.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Platform Capabilities Matrix Table */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2 block">
              Complete Compatibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Supported Networks, Bitrates & Resolution Capabilities
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
              We continually optimize our platform handlers to ensure seamless compatibility with modern video encodings including H.264, AV1, VP9, and AAC audio.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300">
                  <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">Platform</th>
                  <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">Max Resolution</th>
                  <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">Audio Extraction</th>
                  <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">Special Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> YouTube
                  </td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">4K UHD & 1080p 60fps</td>
                  <td className="py-3.5 px-5">320kbps MP3 & AAC</td>
                  <td className="py-3.5 px-5 text-slate-400">Shorts, Live streams, Community posts & Thumbnails</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Instagram
                  </td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">1080p Full HD</td>
                  <td className="py-3.5 px-5">Stereo Audio Track</td>
                  <td className="py-3.5 px-5 text-slate-400">Reels, Carousels, Uncropped Photos & Stories</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Facebook
                  </td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">1080p HD Quality</td>
                  <td className="py-3.5 px-5">256kbps MP3</td>
                  <td className="py-3.5 px-5 text-slate-400">Watch videos, Reels & Public timeline clips</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> TikTok
                  </td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">1080p HD (No Watermark)</td>
                  <td className="py-3.5 px-5">Original Audio Sound</td>
                  <td className="py-3.5 px-5 text-slate-400">Clean video streams without watermarks</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Twitter / X
                  </td>
                  <td className="py-3.5 px-5 text-emerald-400 font-semibold">1080p MP4</td>
                  <td className="py-3.5 px-5">AAC Audio Track</td>
                  <td className="py-3.5 px-5 text-slate-400">Full-resolution original photos & GIFs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Privacy & Zero-Disk Architecture */}
        <section className="mb-16">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-2xl">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2 block">
              Architectural Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
              Why Zero-Disk Streaming is Faster, Safer & Privacy-Centric
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Traditional online converters download large video files to their server hard drives, convert them over several minutes, and then serve a static link. This legacy approach exposes your download history, consumes massive disk storage, and creates high server bottlenecks.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <ShieldCheck className="text-blue-400 mb-2" size={20} />
                <h3 className="font-bold text-white text-sm mb-1">0% Server Storage</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Bytes are transferred dynamically in volatile memory buffers. No user media is ever saved or archived on disk.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <Zap className="text-indigo-400 mb-2" size={20} />
                <h3 className="font-bold text-white text-sm mb-1">Zero Wait Time</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Downloads initiate the exact millisecond you click your preferred quality tier, utilizing maximum client bandwidth.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <Lock className="text-emerald-400 mb-2" size={20} />
                <h3 className="font-bold text-white text-sm mb-1">Total Privacy</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Zero logging of personal IP addresses or downloaded filenames. Direct, encrypted SSL streaming from end to end.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* Section 4: Comprehensive FAQ */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2 block">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Common Questions About Downloading Media
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-400 shrink-0" />
                <span>Is Universal Media Studio 100% free with no hidden fees?</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Yes, our zero-disk media downloader is 100% free to use with unlimited video and image downloads. There are no registration forms, no subscriptions, and no desktop applications required.
              </p>
            </div>

            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Zap size={18} className="text-indigo-400 shrink-0" />
                <span>How does this tool download 1080p and 4K YouTube videos with audio?</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Modern video streaming platforms split high-resolution 1080p and 4K video feeds from audio streams. Our zero-disk streaming pipeline utilizes in-memory multiplexing to combine the visual and audio streams into a seamless MP4 container in real-time.
              </p>
            </div>

            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                <span>Are any personal files or videos stored on your servers?</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Never. We maintain a strict zero-disk policy. Media bytes are streamed directly through RAM memory buffers from content delivery networks straight to your local device without ever writing to temporary server disks.
              </p>
            </div>

            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Music size={18} className="text-purple-400 shrink-0" />
                <span>Can I convert video files into 320kbps MP3 audio?</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Yes. Every supported video URL includes high-fidelity audio options, allowing you to extract studio-grade 320kbps and 256kbps MP3 files for offline listening.
              </p>
            </div>

            <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Globe size={18} className="text-sky-400 shrink-0" />
                <span>Is it safe and legal to download social media content for personal use?</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-6">
                Downloading public media for private personal archiving, research, and non-commercial fair use is widely permitted. Users must respect original creator copyright terms and avoid unauthorized commercial redistribution.
              </p>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
}
