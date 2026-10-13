import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, scryptSync, timingSafeEqual } from "crypto";

const COOKIE_NAME = "nww_session";
const SESSION_DAYS = 14;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

export function verifyCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const salt = process.env.ADMIN_PASSWORD_SALT ?? "";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!expectedUser || !salt || !expectedHash) return false;
  if (username !== expectedUser) return false;
  const gotHash = hashPassword(password, salt);
  const a = Buffer.from(gotHash, "hex");
  const b = Buffer.from(expectedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession(username: string) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_DAYS * 86400_000 });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = sign(encoded);
  const store = await cookies();
  store.set(COOKIE_NAME, `${encoded}.${sig}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function requireAdmin(): Promise<{ u: string; exp: number }> {
  const session = await getSession();
  if (!session) redirect("/admin");
  return session;
}

export async function getSession(): Promise<{ u: string; exp: number } | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const [encoded, sig] = raw.split(".");
  if (!encoded || !sig) return null;
  if (sign(encoded) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
