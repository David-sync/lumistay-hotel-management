import { SignJWT, jwtVerify } from "jose";
import type { UserSession } from "./types";

function getSecret() {
  const raw = process.env.JWT_SECRET;
  if (!raw && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  return new TextEncoder().encode(raw || "dev_secret_change_me");
}

export async function signSession(user: UserSession) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getSecret());
}

export async function verifySession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}
