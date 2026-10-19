import { NextRequest, NextResponse } from "next/server";

interface ShareLog {
  id: string;
  itemId: string;
  title: string;
  url: string;
  platform?: string;
  sharedAt: string;
}

const serverShares: ShareLog[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    totalShares: serverShares.length,
    recentShares: serverShares.slice(0, 10),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, title, url, platform } = body;

    const shareEvent: ShareLog = {
      id: `share-${Date.now()}`,
      itemId: itemId || "unknown",
      title: title || "Pluto Discovery",
      url: url || "http://localhost:3000",
      platform: platform || "clipboard",
      sharedAt: new Date().toISOString(),
    };

    serverShares.unshift(shareEvent);
    if (serverShares.length > 100) serverShares.pop();

    return NextResponse.json({
      success: true,
      shareId: shareEvent.id,
      shareUrl: shareEvent.url,
      totalShares: serverShares.length,
      message: `Content successfully shared via ${shareEvent.platform}`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process share request" },
      { status: 500 },
    );
  }
}
