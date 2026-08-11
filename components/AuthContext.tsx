"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/app/lib/api";

type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  isActive: boolean;
};

type AuthContextType = {
  user: CurrentUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        if (!isPublicPath) router.replace("/login");
        return;
      }

      try {
        const me = await api.get("/auth/me");
        setUser(me);
        localStorage.setItem("user", JSON.stringify(me)); // đồng bộ lại dữ liệu mới nhất
        if (isPublicPath) router.replace("/"); // đã đăng nhập mà cố vào /login thì đá về trang chủ
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        if (!isPublicPath) router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
