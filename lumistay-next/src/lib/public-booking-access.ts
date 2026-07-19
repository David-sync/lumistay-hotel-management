import { SignJWT, jwtVerify } from "jose";

function accessSecret() {
  const raw = process.env.JWT_SECRET;
  if (!raw && process.env.NODE_ENV === "production") throw new Error("JWT_SECRET is required in production");
  return new TextEncoder().encode(raw || "dev_secret_change_me");
}

export async function signBookingAccess(maSo: string) {
  return new SignJWT({ maSo, scope: "public-booking" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2d")
    .sign(accessSecret());
}

export async function verifyBookingAccess(token: string | undefined, maSo: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, accessSecret());
    return payload.scope === "public-booking" && payload.maSo === maSo;
  } catch {
    return false;
  }
}
