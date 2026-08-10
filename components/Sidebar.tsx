"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Tổng quan",
    href: "/",
    icon: "📊",
  },
  {
    name: "Danh mục",
    href: "/categories",
    icon: "📁",
  },
  {
    name: "Sản phẩm",
    href: "/products",
    icon: "📦",
  },
  {
    name: "Khách hàng",
    href: "/customers",
    icon: "👥",
  },
  {
    name: "Đơn hàng",
    href: "/orders",
    icon: "🛒",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col bg-[#171725] text-white">
      {/* Logo */}

      <div className="flex h-[72px] items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-lg shadow-blue-600/20">
            🛍️
          </div>

          <div>
            <h1 className="text-[16px] font-bold tracking-wide">Shop Admin</h1>

            <p className="text-[11px] text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <div className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Quản lý
        </p>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${
                    isActive
                      ? "bg-white/15"
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.name}</span>

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold">
            A
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              Administrator
            </p>

            <p className="truncate text-xs text-slate-500">Quản trị viên</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
