import { createFaviconIcon } from "@/lib/app-icon";

export async function GET() {
  return createFaviconIcon();
}
