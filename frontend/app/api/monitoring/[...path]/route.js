// Next.js Server-Side Proxy to Backend for Monitoring Endpoints & SSE Streaming

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const getBackendCandidates = () => {
  const list = [];
  if (process.env.BACKEND_URL) list.push(process.env.BACKEND_URL.replace(/\/+$/, ""));
  if (process.env.NEXT_PUBLIC_BACKEND_URL) list.push(process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, ""));
  // Prioritize local loopback ports for instant dev response
  list.push("http://127.0.0.1:5000");
  list.push("http://localhost:5000");
  list.push("http://backend:5000");
  list.push("http://universal-backend:5000");
  list.push("http://46.202.167.245:5000");
  return [...new Set(list.filter(Boolean))];
};

async function fetchWithFallback(subPath, searchParamsStr, options = {}, isSSE = false, clientSignal = null) {
  const candidates = getBackendCandidates();
  let lastError = null;

  for (const base of candidates) {
    const url = searchParamsStr ? `${base}/api/monitoring/${subPath}?${searchParamsStr}` : `${base}/api/monitoring/${subPath}`;
    try {
      const fetchOptions = { ...options };
      // SSE streams must NOT have a short abort timeout, but forward the client disconnect signal
      if (isSSE) {
        if (clientSignal) fetchOptions.signal = clientSignal;
      } else {
        fetchOptions.signal = AbortSignal.timeout(4000); // 4s fast timeout for standard API calls
      }

      const res = await fetch(url, fetchOptions);

      if (!res.ok && res.headers.get("content-type")?.includes("text/html")) {
        lastError = new Error(`Candidate ${base} returned HTTP ${res.status} HTML.`);
        continue;
      }

      return { res, url };
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`Cannot reach backend monitoring API. Last error: ${lastError?.message || "Unknown error"}`);
}

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const pathParts = (await params)?.path || [];
  const subPath = pathParts.join("/");

  try {
    const isSSE = subPath === "stream";
    const headers = {
      Accept: isSSE ? "text/event-stream" : "application/json",
    };
    const adminKey = request.headers.get("x-admin-key") || searchParams.get("key");
    if (adminKey) headers["x-admin-key"] = adminKey;

    const { res: backendRes } = await fetchWithFallback(
      subPath, 
      searchParams.toString(), 
      {
        method: "GET",
        headers,
      },
      isSSE,
      request.signal
    );

    const resHeaders = {
      "Content-Type": backendRes.headers.get("content-type") || (isSSE ? "text/event-stream" : "application/json"),
      "Cache-Control": isSSE ? "no-cache, no-transform" : (backendRes.headers.get("cache-control") || "no-cache"),
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    };

    return new Response(backendRes.body, {
      status: backendRes.status,
      headers: resHeaders,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 502 });
  }
}

export async function POST(request, { params }) {
  const pathParts = (await params)?.path || [];
  const subPath = pathParts.join("/");

  try {
    const body = await request.json().catch(() => ({}));
    const headers = { "Content-Type": "application/json" };
    const adminKey = request.headers.get("x-admin-key");
    if (adminKey) headers["x-admin-key"] = adminKey;

    const { res: backendRes } = await fetchWithFallback(subPath, "", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => ({ success: backendRes.ok }));
    return Response.json(data, { status: backendRes.status });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 502 });
  }
}

export async function DELETE(request, { params }) {
  const { searchParams } = new URL(request.url);
  const pathParts = (await params)?.path || [];
  const subPath = pathParts.join("/");

  try {
    const headers = {};
    const adminKey = request.headers.get("x-admin-key") || searchParams.get("key");
    if (adminKey) headers["x-admin-key"] = adminKey;

    const { res: backendRes } = await fetchWithFallback(subPath, searchParams.toString(), {
      method: "DELETE",
      headers,
    });

    const data = await backendRes.json().catch(() => ({ success: backendRes.ok }));
    return Response.json(data, { status: backendRes.status });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 502 });
  }
}
