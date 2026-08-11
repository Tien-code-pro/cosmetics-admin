"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import AuthGuard from "./AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <AuthGuard>
      {isLoginPage ? (
        children
      ) : (
        <>
          <Sidebar />

          <main className="min-h-screen pl-[250px]">{children}</main>
        </>
      )}
    </AuthGuard>
  );
}
