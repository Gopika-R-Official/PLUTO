import { fetchNews } from "@/lib/news";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const payload = await fetchNews({
    topics: searchParams.get("topics"),
    query: searchParams.get("q") ?? undefined,
  });
  return NextResponse.json(payload);
}
