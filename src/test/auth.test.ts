import { describe, expect, it } from "vitest";
import {
  authenticateUser,
  createUser,
  createSession,
  getUserFromSession,
  destroySession,
} from "@/lib/server/auth";
import authReducer, {
  setAuthUser,
  updateAuthUser,
  logoutAuth,
} from "@/store/slices/authSlice";

describe("Pluto Server Authentication Engine", () => {
  it("authenticates seeded demo user with valid credentials", async () => {
    const user = await authenticateUser("alex@pluto.culture", "PlutoCulture2026!");
    expect(user).not.toBeNull();
    expect(user?.email).toBe("alex@pluto.culture");
    expect(user?.name).toBe("Alex Rao");
  });

  it("rejects authentication with incorrect password", async () => {
    const user = await authenticateUser("alex@pluto.culture", "WrongPassword123!");
    expect(user).toBeNull();
  });

  it("creates a new member account with salted PBKDF2 hash and rejects duplicates", async () => {
    const uniqueEmail = `curator.${Date.now()}@pluto.culture`;
    const { user, error } = await createUser(uniqueEmail, "ValidPass2026#", "Elena Rostova");

    expect(error).toBeUndefined();
    expect(user).not.toBeNull();
    expect(user?.email).toBe(uniqueEmail);
    expect(user?.name).toBe("Elena Rostova");

    // Attempting to create duplicate email should be rejected
    const duplicate = await createUser(uniqueEmail, "AnotherPass2026#", "Duplicate User");
    expect(duplicate.user).toBeNull();
    expect(duplicate.error).toContain("already exists");
  });

  it("creates, signs, and retrieves session tokens correctly", async () => {
    const user = await authenticateUser("alex@pluto.culture", "PlutoCulture2026!");
    expect(user).not.toBeNull();

    const { cookieValue } = createSession(user!.id);
    expect(cookieValue).toContain(".");

    const sessionUser = await getUserFromSession(cookieValue);
    expect(sessionUser).not.toBeNull();
    expect(sessionUser?.id).toBe(user!.id);

    // Destroy session
    destroySession(cookieValue);
    const expiredUser = await getUserFromSession(cookieValue);
    expect(expiredUser).toBeNull();
  });
});

describe("Redux Auth Slice", () => {
  it("manages authenticated user state and profile updates", () => {
    const initialState = {
      user: null,
      isAuthenticated: false,
      status: "idle" as const,
      error: null,
    };

    const mockUser = {
      id: "u-1",
      email: "test@pluto.culture",
      name: "Test Curator",
      avatar: "https://example.com/avatar.jpg",
      bio: "Cinema explorer",
      createdAt: "2026-10-19T00:00:00Z",
    };

    // setAuthUser
    const state1 = authReducer(initialState, setAuthUser(mockUser));
    expect(state1.isAuthenticated).toBe(true);
    expect(state1.user?.name).toBe("Test Curator");

    // updateAuthUser
    const state2 = authReducer(state1, updateAuthUser({ name: "Elena Rostova" }));
    expect(state2.user?.name).toBe("Elena Rostova");

    // logoutAuth
    const state3 = authReducer(state2, logoutAuth());
    expect(state3.isAuthenticated).toBe(false);
    expect(state3.user).toBeNull();
  });
});
