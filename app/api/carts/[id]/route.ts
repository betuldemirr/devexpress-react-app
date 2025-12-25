import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/fakestoreapi";

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const data = await apiFetch(`/carts/${ctx.params.id}`, { method: "GET" });
  return NextResponse.json(data);
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const body = await req.json();
  const updated = await apiFetch(`/carts/${ctx.params.id}`, { method: "PUT", body });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  const deleted = await apiFetch(`/carts/${ctx.params.id}`, { method: "DELETE" });
  return NextResponse.json(deleted);
}