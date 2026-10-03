export default function robots() {
  const baseUrl = "https://yourdomain.com";

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
