import { NextResponse } from "next/server";

import { serviceWorkerScript } from "@/lib/service-worker-script";

export async function GET() {
  return new NextResponse(serviceWorkerScript, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
