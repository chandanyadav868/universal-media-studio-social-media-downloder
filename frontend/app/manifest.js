export default function manifest() {
  return {
    name: "Universal Media Studio",
    short_name: "UniversalMedia",
    description: "Fast, secure, and free zero-disk 1080p/4K video, audio, and high-resolution photo downloader.",
    start_url: "/",
    display: "standalone",
    background_color: "#080c15",
    theme_color: "#080c15",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
