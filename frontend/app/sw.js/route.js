export async function GET() {
  const content = `self.options = {
    "domain": "5gvci.com",
    "zoneId": 11973521
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
