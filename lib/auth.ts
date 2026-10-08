import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { Role } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { HttpError } from "@/lib/http";

const COOKIE_NAME = "commerce_session";

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const hours = Number(process.env.SESSION_TTL_HOURS ?? 12);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  await db.session.create({ data: { tokenHash: tokenHash(token), userId, expiresAt } });
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: tokenHash(token) } });
  store.delete(COOKIE_NAME);
}

export async function requireUser(allowedRoles?: Role[]) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) throw new HttpError(401, "Authentication required");
  const session = await db.session.findUnique({
    where: { tokenHash: tokenHash(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date() || !session.user.active) {
    throw new HttpError(401, "Session is invalid or expired");
  }
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new HttpError(403, "You do not have permission for this action");
  }
  return session.user;
}
