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

// Each admin account is a trio of env vars: ADMIN_USERNAME/SALT/HASH for the
// first account, ADMIN2_USERNAME/SALT/HASH for the second, and so on. All
// accounts have identical access — there's no role distinction.
function adminAccounts() {
  const accounts: { user: string; salt: string; hash: string }[] = [];
  for (const suffix of ["", "2", "3", "4"]) {
    const user = process.env[`ADMIN${suffix}_USERNAME`];
    const salt = process.env[`ADMIN${suffix}_PASSWORD_SALT`];
    const hash = process.env[`ADMIN${suffix}_PASSWORD_HASH`];
    if (user && salt && hash) accounts.push({ user, salt, hash });
  }
  return accounts;
}

export function verifyCredentials(username: string, password: string) {
  const account = adminAccounts().find((a) => a.user === username);
  if (!account) return false;
  const gotHash = hashPassword(password, account.salt);
  const a = Buffer.from(gotHash, "hex");
  const b = Buffer.from(account.hash, "hex");
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
