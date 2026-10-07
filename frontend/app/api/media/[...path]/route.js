// Next.js Server-Side Streaming & API Proxy to Backend with Smart Candidate Failover

const getBackendCandidates = () => {
  const list = [];
  if (process.env.BACKEND_URL) list.push(process.env.BACKEND_URL.replace(/\/+$/, ""));
  if (process.env.NEXT_PUBLIC_BACKEND_URL) list.push(process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, ""));
  list.push("http://127.0.0.1:5000");
  list.push("http://backend:5000");
  list.push("http://universal-backend:5000");
  list.push("http://localhost:5000");
  return [...new Set(list.filter(Boolean))];
};

async function fetchWithFallback(subPath, searchParamsStr, options = {}) {
  const candidates = getBackendCandidates();
  let lastError = null;

  for (const base of candidates) {
    const url = searchParamsStr ? `${base}/api/media/${subPath}?${searchParamsStr}` : `${base}/api/media/${subPath}`;
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(35000),
      });

      // If response is HTML error from wrong host/reverse proxy, continue to next candidate
      if (!res.ok && res.headers.get("content-type")?.includes("text/html")) {
        lastError = new Error(`Candidate ${base} returned HTTP ${res.status} HTML (Not Found / Proxy Error).`);
        continue;
      }

      return { res, url };
    } catch (err) {
      lastError = err;
      // Try next candidate
    }
  }

  throw new Error(
    `Cannot reach backend API. Tried candidates: [${candidates.join(", ")}]. Last error: ${lastError?.message || "Unknown error"}. Please verify backend container is running.`
  );
}

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const pathParts = (await params)?.path || [];
  const subPath = pathParts.join("/");

  try {
    const { res: backendRes } = await fetchWithFallback(subPath, searchParams.toString(), {
      method: "GET",
      headers: {
        Accept: request.headers.get("accept") || "*/*",
      },
    });

    // Stream response directly to browser
    return new Response(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": backendRes.headers.get("content-disposition") || "",
        "Content-Length": backendRes.headers.get("content-length") || "",
        "X-Estimated-Content-Length": backendRes.headers.get("x-estimated-content-length") || "",
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 502 }
    );
  }
}

export async function POST(request, { params }) {
  const pathParts = (await params)?.path || [];
  const subPath = pathParts.join("/");

  try {
    const body = await request.json().catch(() => ({}));

    const { res: backendRes } = await fetchWithFallback(subPath, "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = backendRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await backendRes.json();
      // Ensure JSON errors are passed cleanly to UI with status 200 so custom error messages render properly
      const outStatus = data.success === false ? 200 : backendRes.status;
      return Response.json(data, { status: outStatus });
    }

    const text = await backendRes.text();
    return Response.json(
      {
        success: false,
        error: `Backend returned non-JSON (${backendRes.status}).`,
        details: text.slice(0, 300),
      },
      { status: backendRes.status }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 502 }
    );
  }
}
