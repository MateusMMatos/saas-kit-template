export const metadata = { title: 'SaaS Kit' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-white text-slate-900">{children}</body>
    </html>
  );
}
