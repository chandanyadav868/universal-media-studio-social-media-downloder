"use client";
import React from "react";
import Link from "next/link";
import { 
  Shield, Sparkles, FileText, HelpCircle, Mail, Info, CheckCircle2, Film, Layers, BookOpen,
  Youtube, Twitter, Instagram, Facebook, Linkedin, Github
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/90 text-slate-400 text-xs sm:text-sm mt-20 pt-14 pb-10 px-4 sm:px-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          {/* Column 1: Brand & Zero-Disk Architecture */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/30">
                <Sparkles size={17} />
              </div>
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                Universal<span className="text-blue-400">Media</span>
              </span>
            </div>

            <p className="leading-relaxed text-slate-400 text-xs sm:text-sm mb-4">
              High-speed, zero-disk media extraction utility. Download 1080p/4K videos with crystal-clear audio, YouTube community posts, and original social photos with 0% server disk storage.
            </p>

            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <CheckCircle2 size={13} /> Zero-Disk Stream Engine: Online
            </div>

            {/* Official Social Media Channels (Resolves External Link & Social SEO Audits) */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-2">
                Connect on Social Networks
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://www.youtube.com/@UniversalMediaStudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Official YouTube Channel"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                >
                  <Youtube size={15} />
                </a>
                <a
                  href="https://x.com/UniversalMediaHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Official X / Twitter Profile"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                >
                  <Twitter size={15} />
                </a>
                <a
                  href="https://www.instagram.com/UniversalMediaStudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Official Instagram Page"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://www.facebook.com/UniversalMediaStudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Official Facebook Page"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500/40 transition-colors"
                >
                  <Facebook size={15} />
                </a>
                <a
                  href="https://www.linkedin.com/company/universal-media-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Official LinkedIn Presence"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href="https://github.com/chandanyadav868/universal-media-studio-social-media-downloder"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Source Repository on GitHub"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Github size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Features (#hash Anchors) */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-3">
              Feature Deep-Links
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/#youtubevideodownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🎬 #youtubevideodownloader
                </Link>
              </li>
              <li>
                <Link href="/#youtubethumbnaildownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🖼️ #youtubethumbnaildownloader
                </Link>
              </li>
              <li>
                <Link href="/#youtubepostdownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  💬 #youtubepostdownloader
                </Link>
              </li>
              <li>
                <Link href="/#facebookvideodownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  📘 #facebookvideodownloader
                </Link>
              </li>
              <li>
                <Link href="/#facebookimagedownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  📸 #facebookimagedownloader
                </Link>
              </li>
              <li>
                <Link href="/#instagramreelsdownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  📱 #instagramreelsdownloader
                </Link>
              </li>
              <li>
                <Link href="/#instagramphotodownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  📷 #instagramphotodownloader
                </Link>
              </li>
              <li>
                <Link href="/#tiktokvideodownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🎵 #tiktokvideodownloader
                </Link>
              </li>
              <li>
                <Link href="/#twittervideodownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🐦 #twittervideodownloader
                </Link>
              </li>
              <li>
                <Link href="/#redditvideodownloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🤖 #redditvideodownloader
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Tools & Guides (SEO Layer) */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-3">
              Platforms & Guides
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/platforms/youtube" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🔴 YouTube Downloader Page
                </Link>
              </li>
              <li>
                <Link href="/platforms/instagram" className="text-slate-400 hover:text-blue-400 transition-colors">
                  📸 Instagram Downloader Page
                </Link>
              </li>
              <li>
                <Link href="/platforms/facebook" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🔵 Facebook Downloader Page
                </Link>
              </li>
              <li>
                <Link href="/platforms/tiktok" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🎵 TikTok Downloader Page
                </Link>
              </li>
              <li>
                <Link href="/platforms/twitter" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🐦 Twitter / X Downloader Page
                </Link>
              </li>
              <li>
                <Link href="/tools/video-downloader" className="text-slate-400 hover:text-blue-400 transition-colors">
                  ⚡ Video Downloader Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/video-to-mp4" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🎞️ Video to MP4 Converter
                </Link>
              </li>
              <li>
                <Link href="/supported-platforms" className="text-slate-400 hover:text-blue-400 transition-colors">
                  🌐 Supported Platforms Matrix
                </Link>
              </li>
              <li>
                <Link href="/guides/video-download-guide" className="text-slate-400 hover:text-blue-400 transition-colors">
                  📖 Video Download User Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/video-formats" className="text-slate-400 hover:text-blue-400 transition-colors">
                  📊 MP4 vs WebM vs AAC Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Transparency */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-3">
              Legal & Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  <Shield size={14} /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  <FileText size={14} /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  <Shield size={14} /> DMCA & Copyright Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  <HelpCircle size={14} /> FAQ & Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  <Info size={14} /> About Universal Media
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  <Mail size={14} /> Contact & DMCA Agent
                </Link>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Questions or issues? Reach our technical desk at <span className="text-blue-400">support@universalmediastudio.com</span>
            </div>
          </div>
        </div>

        {/* AdSense Legal & Fair Use Mandatory Disclaimer */}
        <div className="border-t border-slate-800 pt-6 mb-6 text-xs text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-400">Fair Use & Non-Hosting Disclaimer:</strong> Universal Media Studio is an independent media extraction utility. We operate under a 100% zero-disk architecture: our servers do not host, store, cache, archive, or duplicate any video, audio, or image files. All streaming data is piped directly in-memory from public content distribution networks (CDNs) upon personal request. Universal Media Studio does not claim ownership of any downloaded content. Users are strictly responsible for respecting copyright laws and fair use guidelines in their respective jurisdictions.
          </p>
          <p>
            <strong className="text-slate-400">Advertising & Third-Party Cookies Notice:</strong> This website is monetized through Google AdSense and reputable advertising networks. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this or other websites. You may opt out of personalized advertising by visiting Google Ads Settings or www.aboutads.info.
          </p>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {currentYear} Universal Media Studio. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/dmca" className="hover:text-slate-300 transition-colors">DMCA</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
