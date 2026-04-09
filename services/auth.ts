import { TokenPayload } from "@/app/types/AuthTypes";
import { decodeToken } from "@/app/utils/decodeToken";

export async function getUserRole() {
  const payload = await decodeToken<TokenPayload>();
  return payload?.role ?? null;
}

export async function hasRole(...roles: string[]) {
    const role = await getUserRole();
    return role ? roles.includes(role) : false
}