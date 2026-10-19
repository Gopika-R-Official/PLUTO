import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

export interface SessionRecord {
  sessionId: string;
  userId: string;
  expiresAt: number; // timestamp
}

const SESSION_COOKIE_NAME = "pluto_session";
const SESSION_MAX_AGE_SEC = 7 * 24 * 60 * 60; // 7 days
const AUTH_SECRET = process.env.AUTH_SECRET || "pluto-secret-auth-key-2026-editorial-culture";

// In-memory caches with persistent disk backing
let usersCache: Map<string, UserRecord> | null = null;
const sessionsCache: Map<string, SessionRecord> = new Map();

const USERS_FILE_PATH = path.join(process.cwd(), "src", "lib", "server", "users.json");

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function signSession(sessionId: string): string {
  const hmac = crypto.createHmac("sha256", AUTH_SECRET);
  hmac.update(sessionId);
  const signature = hmac.digest("hex");
  return `${sessionId}.${signature}`;
}

function verifySessionSignature(signedSession: string): string | null {
  const [sessionId, signature] = signedSession.split(".");
  if (!sessionId || !signature) return null;
  const hmac = crypto.createHmac("sha256", AUTH_SECRET);
  hmac.update(sessionId);
  const expected = hmac.digest("hex");
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return sessionId;
  }
  return null;
}

function initUsers(): Map<string, UserRecord> {
  if (usersCache) return usersCache;
  usersCache = new Map();

  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, "utf-8");
      const list: UserRecord[] = JSON.parse(data);
      for (const u of list) {
        usersCache.set(u.email.toLowerCase(), u);
      }
    }
  } catch {
    // fallback to initial seed
  }

  // Pre-seed default demo account if not exists
  const demoEmail = "alex@pluto.culture";
  if (!usersCache.has(demoEmail)) {
    const salt = generateSalt();
    const demoUser: UserRecord = {
      id: "user-alex-rao-01",
      email: demoEmail,
      name: "Alex Rao",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Exploring cinema, sonic architectures, and cultural curiosities.",
      salt,
      passwordHash: hashPassword("PlutoCulture2026!", salt),
      createdAt: new Date().toISOString(),
    };
    usersCache.set(demoEmail, demoUser);
    saveUsers();
  }

  return usersCache;
}

function saveUsers() {
  if (!usersCache) return;
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const list = Array.from(usersCache.values());
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist users to disk:", err);
  }
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
  };
}

export async function authenticateUser(email: string, password: string): Promise<PublicUser | null> {
  const users = initUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.get(normalizedEmail);
  if (!user) return null;

  const computedHash = hashPassword(password, user.salt);
  if (computedHash === user.passwordHash) {
    return toPublicUser(user);
  }
  return null;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<{ user: PublicUser | null; error?: string }> {
  const users = initUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.has(normalizedEmail)) {
    return { user: null, error: "An account with this email address already exists." };
  }

  const salt = generateSalt();
  const newUser: UserRecord = {
    id: `user-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    email: normalizedEmail,
    name: name.trim() || "Culture Curator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Member of Pluto Editorial & Cultural Hub.",
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, newUser);
  saveUsers();
  return { user: toPublicUser(newUser) };
}

export async function updateUserProfile(
  userId: string,
  updates: { name?: string; bio?: string; avatar?: string },
): Promise<PublicUser | null> {
  const users = initUsers();
  let targetUser: UserRecord | null = null;
  for (const u of users.values()) {
    if (u.id === userId) {
      targetUser = u;
      break;
    }
  }

  if (!targetUser) return null;

  if (updates.name && updates.name.trim()) {
    targetUser.name = updates.name.trim();
  }
  if (typeof updates.bio === "string") {
    targetUser.bio = updates.bio.trim();
  }
  if (updates.avatar && updates.avatar.trim()) {
    targetUser.avatar = updates.avatar.trim();
  }

  users.set(targetUser.email.toLowerCase(), targetUser);
  saveUsers();
  return toPublicUser(targetUser);
}

export function createSession(userId: string): { cookieValue: string; maxAge: number } {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  sessionsCache.set(sessionId, {
    sessionId,
    userId,
    expiresAt,
  });

  const cookieValue = signSession(sessionId);
  return {
    cookieValue,
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export async function getUserFromSession(signedCookie: string | undefined): Promise<PublicUser | null> {
  if (!signedCookie) return null;
  const sessionId = verifySessionSignature(signedCookie);
  if (!sessionId) return null;

  const session = sessionsCache.get(sessionId);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessionsCache.delete(sessionId);
    return null;
  }

  const users = initUsers();
  for (const u of users.values()) {
    if (u.id === session.userId) {
      return toPublicUser(u);
    }
  }

  return null;
}

export function destroySession(signedCookie: string | undefined) {
  if (!signedCookie) return;
  const sessionId = verifySessionSignature(signedCookie);
  if (sessionId) {
    sessionsCache.delete(sessionId);
  }
}

export { SESSION_COOKIE_NAME };
