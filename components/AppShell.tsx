"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublicPage) {
    return <>{children}</>;
  }
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {" "}
      <Sidebar />{" "}
      <main style={{ flex: 1, marginLeft: 250, padding: 24 }}>
        {children}
      </main>{" "}
    </div>
  );
}
