import { Product } from "@/model/product";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getProduct(id: number | string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}

export async function createProduct(payload: Partial<Product>) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: number | string, payload: Partial<Product>) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: number | string) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}