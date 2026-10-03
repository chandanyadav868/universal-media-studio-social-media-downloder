export const FEATURE_MAP = {
  default: {
    slug: "default",
    hash: "",
    platform: "all",
    platformName: "Universal Media",
    title: "Universal HD Video Downloader",
    subtitle: "Download 1080p, 4K videos & 320kbps MP3 audio from YouTube, Reels, Facebook, TikTok, and Twitter with direct in-memory stream delivery.",
    badge: "Zero-Disk High-Speed Streamer",
    placeholder: "Paste YouTube, Instagram Reels, Facebook, or TikTok URL...",
    mode: "video",
    supportedTypes: "1080p/4K MP4 • 320kbps MP3 • Reels • Shorts • Stories"
  },
  youtubevideodownloader: {
    slug: "youtubevideodownloader",
    hash: "#youtubevideodownloader",
    platform: "youtube",
    platformName: "YouTube",
    title: "YouTube Video & Shorts Downloader",
    subtitle: "Download YouTube videos, Shorts, and audio in Full HD 1080p, 4K UHD, and 320kbps MP3 with crystal-clear audio synchronization.",
    badge: "YouTube 4K & 1080p Studio Muxer",
    placeholder: "Paste YouTube video or Shorts link (e.g. https://youtube.com/shorts/...)",
    mode: "video",
    supportedTypes: "YouTube 4K • 1080p 60fps • Shorts • 320kbps MP3"
  },
  youtubethumbnaildownloader: {
    slug: "youtubethumbnaildownloader",
    hash: "#youtubethumbnaildownloader",
    platform: "youtube",
    platformName: "YouTube",
    title: "YouTube HD Thumbnail Grabber",
    subtitle: "Extract and download Maximum Resolution (1080p / 4K) original video thumbnails and covers directly from YouTube.",
    badge: "YouTube MaxRes Thumbnail Extractor",
    placeholder: "Paste YouTube video URL to extract HD thumbnail (e.g. https://youtube.com/watch?v=...)",
    mode: "image",
    supportedTypes: "MaxRes 1080p HD • High Quality • Standard JPEG"
  },
  youtubepostdownloader: {
    slug: "youtubepostdownloader",
    hash: "#youtubepostdownloader",
    platform: "youtube",
    platformName: "YouTube",
    title: "YouTube Community Post Downloader",
    subtitle: "Download uncompressed, full-resolution photos, community post images, and artwork directly from YouTube creators.",
    badge: "YouTube Community Photo Grabber",
    placeholder: "Paste YouTube community post link (e.g. https://youtube.com/post/...)",
    mode: "image",
    supportedTypes: "Original Community Photos • Full-Resolution JPEG/WebP"
  },
  facebookvideodownloader: {
    slug: "facebookvideodownloader",
    hash: "#facebookvideodownloader",
    platform: "facebook",
    platformName: "Facebook",
    title: "Facebook Video & Reels Downloader",
    subtitle: "Save Facebook Watch videos, public Reels, and clips in crystal-clear High Definition (HD) and Standard Definition (SD) MP4.",
    badge: "Facebook HD & SD Streamer",
    placeholder: "Paste Facebook video or Reel link (e.g. https://facebook.com/watch/?v=...)",
    mode: "video",
    supportedTypes: "Facebook HD 1080p • SD 480p • Reels • Watch"
  },
  facebookimagedownloader: {
    slug: "facebookimagedownloader",
    hash: "#facebookimagedownloader",
    platform: "facebook",
    platformName: "Facebook",
    title: "Facebook Photo & Post Downloader",
    subtitle: "Download full-resolution photos, album images, and community posts from public Facebook pages without compression.",
    badge: "Facebook Original Photo Extractor",
    placeholder: "Paste Facebook post or photo link (e.g. https://facebook.com/photo/...)",
    mode: "image",
    supportedTypes: "Uncompressed Facebook Photos • Album Covers • Post Images"
  },
  instagramreelsdownloader: {
    slug: "instagramreelsdownloader",
    hash: "#instagramreelsdownloader",
    platform: "instagram",
    platformName: "Instagram",
    title: "Instagram Reels & Video Downloader",
    subtitle: "Download Instagram Reels, public videos, and Stories directly in high-definition MP4 with original stereo audio.",
    badge: "Instagram Direct Progressive Engine",
    placeholder: "Paste Instagram Reel or Video URL (e.g. https://instagram.com/reel/...)",
    mode: "video",
    supportedTypes: "Instagram Reels • Video Posts • Stories • MP4/MP3"
  },
  instagramphotodownloader: {
    slug: "instagramphotodownloader",
    hash: "#instagramphotodownloader",
    platform: "instagram",
    platformName: "Instagram",
    title: "Instagram Photo & Carousel Downloader",
    subtitle: "Save original 1440x1800 uncropped Instagram photos, multi-slide carousels, and single images with zero quality degradation.",
    badge: "Instagram High-Res Photo Extractor",
    placeholder: "Paste Instagram photo or carousel link (e.g. https://instagram.com/p/...)",
    mode: "image",
    supportedTypes: "1440px High-Res JPEG • Multi-Slide Carousels • Post Photos"
  },
  tiktokvideodownloader: {
    slug: "tiktokvideodownloader",
    hash: "#tiktokvideodownloader",
    platform: "tiktok",
    platformName: "TikTok",
    title: "TikTok Video Downloader (No Watermark)",
    subtitle: "Download clean, watermark-free TikTok videos in high-definition MP4 and extract original trending background audio to MP3.",
    badge: "TikTok Clean HD Streamer",
    placeholder: "Paste TikTok video URL (e.g. https://tiktok.com/@user/video/...)",
    mode: "video",
    supportedTypes: "TikTok HD (No Watermark) • Original Sound MP3"
  },
  twittervideodownloader: {
    slug: "twittervideodownloader",
    hash: "#twittervideodownloader",
    platform: "twitter",
    platformName: "Twitter / X",
    title: "Twitter / X Video & GIF Downloader",
    subtitle: "Save Twitter / X videos in 1080p 60fps high-bitrate progressive MP4 and animated GIFs with direct in-memory delivery.",
    badge: "Twitter / X Syndication Engine",
    placeholder: "Paste Twitter / X video post link (e.g. https://x.com/user/status/...)",
    mode: "video",
    supportedTypes: "Twitter 1080p 60fps • 720p HD • Animated GIFs • MP3"
  },
  twitterimagedownloader: {
    slug: "twitterimagedownloader",
    hash: "#twitterimagedownloader",
    platform: "twitter",
    platformName: "Twitter / X",
    title: "Twitter / X Photo & Post Downloader",
    subtitle: "Extract uncompressed, original-size photos, artwork, and multi-image galleries from public X / Twitter posts.",
    badge: "Twitter / X High-Res Photo Extractor",
    placeholder: "Paste Twitter / X post link (e.g. https://x.com/user/status/...)",
    mode: "image",
    supportedTypes: "Original Quality JPEG/PNG • 4K Gallery Photos"
  },
  redditvideodownloader: {
    slug: "redditvideodownloader",
    hash: "#redditvideodownloader",
    platform: "reddit",
    platformName: "Reddit",
    title: "Reddit Video & Audio Downloader",
    subtitle: "Download Reddit videos with synchronized audio tracks muxed in real-time into universal playable MP4.",
    badge: "Reddit In-Memory Remuxer",
    placeholder: "Paste Reddit video post URL (e.g. https://reddit.com/r/videos/...)",
    mode: "video",
    supportedTypes: "Reddit 1080p • 720p Muxed MP4 • Reddit Audio MP3"
  }
};

// Aliases for common user typos or shorter hash targets
export const HASH_ALIASES = {
  facebook: "facebookvideodownloader",
  fb: "facebookvideodownloader",
  youtube: "youtubevideodownloader",
  yt: "youtubevideodownloader",
  instagram: "instagramreelsdownloader",
  ig: "instagramreelsdownloader",
  tiktok: "tiktokvideodownloader",
  twitter: "twittervideodownloader",
  x: "twittervideodownloader",
  reddit: "redditvideodownloader",
  thumbnail: "youtubethumbnaildownloader",
  post: "youtubepostdownloader",
};

export const SUPPORTED_PLATFORMS = [
  { id: "all", name: "All Platforms", defaultHash: "", color: "#3b82f6" },
  { id: "youtube", name: "YouTube", defaultHash: "#youtubevideodownloader", color: "#ef4444" },
  { id: "instagram", name: "Instagram", defaultHash: "#instagramreelsdownloader", color: "#ec4899" },
  { id: "facebook", name: "Facebook", defaultHash: "#facebookvideodownloader", color: "#3b82f6" },
  { id: "tiktok", name: "TikTok", defaultHash: "#tiktokvideodownloader", color: "#06b6d4" },
  { id: "twitter", name: "Twitter / X", defaultHash: "#twittervideodownloader", color: "#94a3b8" },
  { id: "reddit", name: "Reddit", defaultHash: "#redditvideodownloader", color: "#f97316" },
];

export const SUB_FEATURES_BY_PLATFORM = {
  all: [
    { label: "Universal Video & Audio", hash: "" },
    { label: "HD Thumbnail Grabber", hash: "#youtubethumbnaildownloader" },
    { label: "Social Photos & Posts", hash: "#instagramphotodownloader" },
  ],
  youtube: [
    { label: "🎬 Video & Shorts (4K/1080p)", hash: "#youtubevideodownloader" },
    { label: "🖼️ HD Thumbnail Grabber", hash: "#youtubethumbnaildownloader" },
    { label: "💬 Community Post Photos", hash: "#youtubepostdownloader" },
  ],
  facebook: [
    { label: "🎥 Facebook Video & Reels", hash: "#facebookvideodownloader" },
    { label: "📸 Photos & Album Posts", hash: "#facebookimagedownloader" },
  ],
  instagram: [
    { label: "🎞️ Reels & Video (MP4)", hash: "#instagramreelsdownloader" },
    { label: "📷 Photos & Carousels", hash: "#instagramphotodownloader" },
  ],
  tiktok: [
    { label: "🎵 TikTok (No Watermark)", hash: "#tiktokvideodownloader" },
  ],
  twitter: [
    { label: "🐦 Video & GIF (1080p 60fps)", hash: "#twittervideodownloader" },
    { label: "🖼️ Photos & Gallery", hash: "#twitterimagedownloader" },
  ],
  reddit: [
    { label: "🤖 Video & Audio Muxed", hash: "#redditvideodownloader" },
  ]
};

export function getFeatureConfig(hash) {
  if (!hash) return FEATURE_MAP.default;
  const clean = hash.replace(/^#/, "").toLowerCase().trim();
  const canonicalSlug = HASH_ALIASES[clean] || clean;
  return FEATURE_MAP[canonicalSlug] || FEATURE_MAP.default;
}
