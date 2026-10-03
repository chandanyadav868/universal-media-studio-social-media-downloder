/**
 * Universal Media Studio API Client
 * Robust handling for production Coolify deployments and local development
 */

export function getApiBase() {
  // In the browser, ALWAYS use same-origin relative paths to route via Next.js server proxy.
  // This guarantees zero CORS errors, zero DNS resolution failures, and zero mixed-content blocks!
  if (typeof window !== "undefined") {
    return "";
  }

  // Server-side fallback
  const customBackend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (customBackend && typeof customBackend === "string" && customBackend.trim().startsWith("http")) {
    return customBackend.trim().replace(/\/$/, "");
  }
  return "";
}

/**
 * Safely fetch JSON from an endpoint without crashing on HTML error responses.
 * Prevents "Unexpected token '<', '<!DOCTYPE '... is not valid JSON".
 */
export async function safeFetchJson(endpoint, options = {}) {
  const base = getApiBase();
  const targetUrl = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  let res;
  try {
    res = await fetch(targetUrl, {
      ...options,
      headers: {
        Accept: "application/json, text/plain, */*",
        ...(options.headers || {}),
      },
    });
  } catch (networkErr) {
    throw new Error(
      `Network connection failed (${networkErr.message}). Ensure backend service is online.`
    );
  }

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Server responded with status ${res.status}`);
    }
    return data;
  }

  // Catch HTML responses (e.g. 502 Bad Gateway or 404 from reverse proxy) cleanly
  const rawText = await res.text();
  if (rawText.includes("<!DOCTYPE") || rawText.includes("<html")) {
    throw new Error(
      `Backend service returned HTML (Status ${res.status}). Verify your backend is running and NEXT_PUBLIC_BACKEND_URL is set in Coolify.`
    );
  }

  throw new Error(rawText.slice(0, 200) || `Server error (Status ${res.status})`);
}

/**
 * Builds streaming media URL
 */
export function buildStreamUrl(params) {
  const base = getApiBase();
  const searchParams = new URLSearchParams(params);
  return `${base}/api/media/stream?${searchParams.toString()}`;
}

/**
 * Builds image proxy download URL
 */
export function buildImageDownloadUrl(params) {
  const base = getApiBase();
  const searchParams = new URLSearchParams(params);
  return `${base}/api/image/download?${searchParams.toString()}`;
}
