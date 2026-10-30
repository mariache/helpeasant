import { NextResponse } from "next/server";
import { getStats } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Stats unavailable" }, { status: 500 });
  }
}
