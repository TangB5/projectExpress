"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function createSession(data: { userId: string; role: string }) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);

   const cookieSession = await cookies()

  cookieSession.set("session", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
}
