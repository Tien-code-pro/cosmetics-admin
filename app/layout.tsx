import Sidebar from "@/components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Sidebar />

        <main className="min-h-screen pl-[250px]">{children}</main>
      </body>
    </html>
  );
}
