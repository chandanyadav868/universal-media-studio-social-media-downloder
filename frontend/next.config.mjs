/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: `${backendUrl}/api/media/:path*`,
      },
      {
        source: "/api/image/:path*",
        destination: `${backendUrl}/api/image/:path*`,
      },
    ];
  },
};

export default nextConfig;
