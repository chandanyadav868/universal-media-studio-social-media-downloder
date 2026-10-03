/**
 * Centralized Site Configuration & SEO Canonical Resolver
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 
  "https://socialmediadownloader.humantalking.com"
).replace(/\/$/, "");

export function getCanonicalUrl(path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}
