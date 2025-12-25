import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/fakestoreapi";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const start = searchParams.get("startdate");
  const end = searchParams.get("enddate");

  let path = "/carts";
  if (userId) path = `/carts/user/${userId}`;

  const qs = new URLSearchParams();
  if (start) qs.set("startdate", start);
  if (end) qs.set("enddate", end);

  const url = qs.toString() ? `${path}?${qs.toString()}` : path;
  const data = await apiFetch<any[]>(url, { method: "GET" });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await apiFetch("/carts", { method: "POST", body });
  return NextResponse.json(created);
}