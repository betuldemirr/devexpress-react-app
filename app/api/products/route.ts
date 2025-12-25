import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/fakestoreapi";

export async function GET() {
  const data = await apiFetch<any[]>("/products", { method: "GET" });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await apiFetch("/products", { method: "POST", body });
  return NextResponse.json(created);
}