export default function sitemap() {
  const baseUrl = "https://yourdomain.com";
  const currentDate = new Date().toISOString();

  const routes = [
    // Core Homepage & Tool Layer
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/tools/video-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/tools/video-to-mp4`, lastModified: currentDate, changeFrequency: "daily", priority: 0.90 },

    // Platform Layer
    { url: `${baseUrl}/platforms/youtube`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/platforms/instagram`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/platforms/facebook`, lastModified: currentDate, changeFrequency: "daily", priority: 0.90 },
    { url: `${baseUrl}/platforms/tiktok`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/platforms/twitter`, lastModified: currentDate, changeFrequency: "daily", priority: 0.90 },

    // Existing Tool Routes
    { url: `${baseUrl}/youtube-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.90 },
    { url: `${baseUrl}/instagram-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.90 },
    { url: `${baseUrl}/tiktok-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.90 },
    { url: `${baseUrl}/facebook-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/twitter-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/thumbnail-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/image-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.85 },

    // Content Layer & Guides
    { url: `${baseUrl}/supported-platforms`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.80 },
    { url: `${baseUrl}/guides/video-download-guide`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.80 },
    { url: `${baseUrl}/guides/video-formats`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.80 },
    { url: `${baseUrl}/faq`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.75 },

    // Legal & Trust Layer
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.60 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.60 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.50 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.50 },
    { url: `${baseUrl}/dmca`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.50 },
  ];

  return routes;
}
