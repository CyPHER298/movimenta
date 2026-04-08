"use server";

import { jwtDecode } from "jwt-decode";
import { getAuthCookie } from "@/services/cookies";

export async function decodeToken<
  T = Record<string, unknown>,
>(): Promise<T | null> {
  const cookie = await getAuthCookie("token");

  if (!cookie?.value) return null;

  const token = cookie.value.startsWith("Bearer ")
    ? cookie.value.slice(7)
    : cookie.value;

  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}
