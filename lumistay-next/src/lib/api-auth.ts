import { cookies } from "next/headers";
import { verifySession } from "./auth";

export async function getApiSession() {
  const token = (await cookies()).get("hotel_session")?.value;
  return verifySession(token);
}
