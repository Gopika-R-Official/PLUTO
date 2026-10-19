import { getUserFromSession, updateUserProfile, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const currentUser = await getUserFromSession(sessionCookie);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, avatar } = body;

    const updatedUser = await updateUserProfile(currentUser.id, { name, bio, avatar });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found or update failed." }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
