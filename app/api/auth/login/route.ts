import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/fakestoreapi";
import { setAuthCookie } from "@/lib/cookie";

type LoginBody = { username?: string; password?: string };
type LoginResponse = { token: string };

export async function POST(req: Request) {
  const body = (await req.json()) as LoginBody;

  if (!body.username || !body.password) {
    return NextResponse.json({ message: "Username and password required" }, { status: 400 });
  }

  try {
    const data = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: { username: body.username, password: body.password },
    });

    await setAuthCookie(data.token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}