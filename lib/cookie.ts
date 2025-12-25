import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "fs_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24;

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", { path: "/", maxAge: 0 });
}