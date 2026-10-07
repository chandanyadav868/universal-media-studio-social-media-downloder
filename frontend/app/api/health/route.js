// Next.js Health & Diagnostics Endpoint
// Checks frontend, backend connectivity, and Docker POT provider status

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

export async function GET() {
  const candidates = getBackendCandidates();
  let backendData = null;
  let activeBackendUrl = null;
  let backendError = null;

  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/health`, {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        backendData = await res.json().catch(() => null);
        activeBackendUrl = base;
        break;
      }
    } catch (e) {
      backendError = e.message;
    }
  }

  const isBackendOnline = !!backendData;
  const potStatus = backendData?.potProvider?.status || "offline";

  return Response.json({
    status: isBackendOnline ? "ok" : "degraded",
    frontend: "online",
    backend: isBackendOnline ? "online" : "offline",
    connectedBackendUrl: activeBackendUrl,
    triedCandidates: candidates,
    dockerPotProvider: {
      status: potStatus,
      description: potStatus === "online" 
        ? "Docker Token Generator is active (bypassing YouTube bot detection)" 
        : "Docker Token Generator is not responding on port 4416",
    },
    system: backendData?.system || null,
    backendError: isBackendOnline ? null : backendError,
    time: new Date().toISOString(),
  });
}
