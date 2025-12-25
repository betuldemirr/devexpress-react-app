import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/fakestoreapi";

export async function GET() {
  const data = await apiFetch<any[]>("/users", { method: "GET" });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await apiFetch("/users", { method: "POST", body });
  return NextResponse.json(created);
}