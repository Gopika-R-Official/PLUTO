import { createUser, createSession, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide your name (at least 2 characters)." },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    const { user, error } = await createUser(email, password, name);

    if (error || !user) {
      return NextResponse.json(
        { error: error || "Failed to create account." },
        { status: 400 },
      );
    }

    const { cookieValue, maxAge } = createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during account creation." },
      { status: 500 },
    );
  }
}
