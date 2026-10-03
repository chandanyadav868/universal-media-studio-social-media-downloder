// Next.js Server-Side Streaming & API Proxy to Backend
const getBackendBase = () => {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://127.0.0.1:5000"
  ).replace(/\/$/, "");
};

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const pathParts = (await params)?.path || [];
  const subPath = pathParts.join("/");
  const targetUrl = `${getBackendBase()}/api/media/${subPath}?${searchParams.toString()}`;

  try {
    const backendRes = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: request.headers.get("accept") || "*/*",
      },
    });

    if (!backendRes.ok && backendRes.headers.get("content-type")?.includes("text/html")) {
      return Response.json(
        {
          success: false,
          error: `Backend at ${getBackendBase()} returned HTTP ${backendRes.status} HTML. Verify backend is running.`,
        },
        { status: backendRes.status }
      );
    }

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
        error: `Failed to proxy GET request to backend: ${error.message}. Target: ${targetUrl}`,
      },
      { status: 502 }
    );
  }
}

export async function POST(request, { params }) {
  const pathParts = (await params)?.path || [];
  const subPath = pathParts.join("/");
  const targetUrl = `${getBackendBase()}/api/media/${subPath}`;

  try {
    const body = await request.json().catch(() => ({}));

    const backendRes = await fetch(targetUrl, {
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
        error: `Backend at ${getBackendBase()} returned non-JSON (${backendRes.status}). Verify backend deployment.`,
        details: text.slice(0, 300),
      },
      { status: backendRes.status }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: `Cannot connect to backend at ${getBackendBase()}: ${error.message}. Please configure NEXT_PUBLIC_BACKEND_URL in Coolify.`,
      },
      { status: 502 }
    );
  }
}
