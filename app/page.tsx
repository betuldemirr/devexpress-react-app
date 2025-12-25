import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/cookie";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token) redirect("/users");
  redirect("/login");
}