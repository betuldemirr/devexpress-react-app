import { Cart } from "@/model/cart";

export async function getCarts(params?: { userId?: number | string; startdate?: string; enddate?: string }) {
  const qs = new URLSearchParams();
  if (params?.userId) qs.set("userId", String(params.userId));
  if (params?.startdate) qs.set("startdate", params.startdate);
  if (params?.enddate) qs.set("enddate", params.enddate);

  const res = await fetch(`/api/carts${qs.toString() ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to load carts");
  return (await res.json()) as Cart[];
}

export async function updateCart(id: number | string, payload: Partial<Cart>) {
  const res = await fetch(`/api/carts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update cart");
  return res.json();
}

export async function deleteCart(id: number | string) {
  const res = await fetch(`/api/carts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete cart");
  return res.json();
}

export async function createCart(payload: Partial<Cart>) {
  const res = await fetch("/api/carts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create cart");
  return res.json();
}