export async function GET() {
  return Response.json({
    status: "ok",
    service: "Universal Media Studio Next.js Frontend",
    time: new Date().toISOString(),
  });
}
