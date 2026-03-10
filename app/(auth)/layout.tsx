export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="bg-[var(--background)] flex min-h-screen">
      {children}
    </main>
  )
}