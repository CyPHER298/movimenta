"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2,
    path: "/",
  });
}
export async function getAuthCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function deleteAuthCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name)
}

export async function getUserFromToken(): Promise<{ nome: string; role: string } | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie?.value) return null;

  try {
    const raw = tokenCookie.value.replace(/^Bearer\s+/i, "");
    const payload = raw.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return {
      nome: decoded.nome ?? decoded.name ?? decoded.sub ?? "",
      role: decoded.role ?? decoded.tipo ?? decoded.perfil ?? "",
    };
  } catch {
    return null;
  }
}
