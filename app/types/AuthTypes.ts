export interface TokenPayload {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  exp: number;
  iat: number;
}
