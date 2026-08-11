"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Đang ở trang login
    if (pathname === "/login") {
      // Nếu đã login rồi thì không cần vào login nữa
      if (token) {
        router.replace("/");
        return;
      }

      setChecking(false);
      return;
    }

    // Các trang CMS khác bắt buộc phải có token
    if (!token) {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  // Trong lúc kiểm tra token
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm text-slate-500">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
