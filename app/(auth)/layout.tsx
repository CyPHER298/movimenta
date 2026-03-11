export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="bg-(--bg-default) flex min-h-screen">
      {children}
    </main>
  )
}