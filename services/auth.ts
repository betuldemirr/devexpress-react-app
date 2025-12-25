export async function login(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Login failed");
  }

  return true;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}