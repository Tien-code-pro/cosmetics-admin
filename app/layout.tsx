import "./globals.css";

import Sidebar from "../components/Sidebar";
import { AuthProvider } from "@/components/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: 250, padding: 24 }}>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
