export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialmediadownloader.humantalking.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/download-result/",
        "/tmp/",
        "/processing/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
