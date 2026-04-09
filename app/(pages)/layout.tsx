import Header from "../components/Header/Header";
import { decodeToken } from "@/app/utils/decodeToken";
import { TokenPayload } from "@/app/types/AuthTypes";

export default async function PageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const payload = await decodeToken<TokenPayload>();
  const role = payload?.role ?? "USER";

  return (
    <main className="bg-(--bg-default) min-h-screen">
      <Header role={role} />
      {children}
    </main>
  );
}
