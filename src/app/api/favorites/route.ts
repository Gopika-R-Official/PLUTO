import type { ContentItem, FavoriteRecord } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

// In-memory server-side storage for saved favorites (synchronized with client requests)
let serverFavorites: FavoriteRecord[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: serverFavorites.length,
    items: serverFavorites,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = body.item as ContentItem | undefined;

    if (!item || !item.id) {
      return NextResponse.json(
        { success: false, error: "Invalid item payload: 'id' is required" },
        { status: 400 },
      );
    }

    const existingIndex = serverFavorites.findIndex((f) => f.id === item.id);

    if (existingIndex >= 0) {
      // Toggle off / remove if already present
      serverFavorites.splice(existingIndex, 1);
      return NextResponse.json({
        success: true,
        action: "removed",
        saved: false,
        count: serverFavorites.length,
        message: `Removed '${item.title}' from server watchlist/favorites`,
      });
    }

    // Add to server favorites
    const newRecord: FavoriteRecord = {
      id: item.id,
      savedAt: new Date().toISOString(),
      item,
    };
    serverFavorites.unshift(newRecord);

    return NextResponse.json({
      success: true,
      action: "added",
      saved: true,
      count: serverFavorites.length,
      item: newRecord,
      message: `Saved '${item.title}' to server watchlist/favorites`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process favorite request" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Query parameter 'id' is required" },
      { status: 400 },
    );
  }

  const initialLength = serverFavorites.length;
  serverFavorites = serverFavorites.filter((f) => f.id !== id);

  return NextResponse.json({
    success: true,
    removed: initialLength > serverFavorites.length,
    count: serverFavorites.length,
    message: `Item '${id}' removed from server watchlist/favorites`,
  });
}
