// Next.js Server-Side Streaming & Image API Proxy to Backend with Smart Candidate Failover

const getBackendCandidates = () => {
  const list = [];
  if (process.env.BACKEND_URL) list.push(process.env.BACKEND_URL.replace(/\/+$/, ""));
  if (process.env.NEXT_PUBLIC_BACKEND_URL) list.push(process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, ""));
  list.push("http://backend:5000");
  list.push("http://universal-backend:5000");
  list.push("http://127.0.0.1:5000");
  list.push("http://localhost:5000");
  return [...new Set(list.filter(Boolean))];
};

async function fetchWithFallback(subPath, searchParamsStr, options = {}) {
  const candidates = getBackendCandidates();
  let lastError = null;

  for (const base of candidates) {
    const url = searchParamsStr ? `${base}/api/image/${subPath}?${searchParamsStr}` : `${base}/api/image/${subPath}`;
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(35000),
      });

      if (!res.ok && res.headers.get("content-type")?.includes("text/html")) {
        lastError = new Error(`Candidate ${base} returned HTTP ${res.status} HTML (Not Found / Proxy Error).`);
        continue;
      }

      return { res, url };
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    `Cannot reach backend image API. Tried candidates: [${candidates.join(", ")}]. Last error: ${lastError?.message || "Unknown error"}.`
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

    return new Response(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("content-type") || "image/jpeg",
        "Content-Disposition": backendRes.headers.get("content-disposition") || "",
        "Content-Length": backendRes.headers.get("content-length") || "",
        "Cache-Control": "public, max-age=86400",
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
      return Response.json(data, { status: backendRes.status });
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
