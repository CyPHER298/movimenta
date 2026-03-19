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
