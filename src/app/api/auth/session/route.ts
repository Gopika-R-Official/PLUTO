import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const user = await getUserFromSession(sessionCookie);

    return NextResponse.json({
      authenticated: Boolean(user),
      user: user || null,
    });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
