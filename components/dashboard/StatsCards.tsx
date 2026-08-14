import Link from "next/link";

interface CustomerStats {
  total: number;
  active: number;
  locked: number;
}

interface StatsCardsProps {
  categoriesTotal: number;
  productsTotal: number;
  totalStock: number;
  customerStats: CustomerStats;
  totalOrders: number;
  loading: boolean;
}

export default function StatsCards({
  categoriesTotal,
  productsTotal,
  totalStock,
  customerStats,
  totalOrders,
  loading,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Danh mục",
      value: categoriesTotal,
      description: "Danh mục sản phẩm",
      icon: "📁",
      color: "blue",
      href: "/categories",
    },
    {
      title: "Sản phẩm",
      value: productsTotal,
      description: `${totalStock} sản phẩm trong kho`,
      icon: "📦",
      color: "violet",
      href: "/products",
    },
    {
      title: "Khách hàng",
      value: customerStats.total,
      description: `${customerStats.active} đang hoạt động`,
      icon: "👥",
      color: "emerald",
      href: "/customers",
    },
    {
      title: "Đơn hàng",
      value: totalOrders,
      description: "Đơn hàng trong hệ thống",
      icon: "🛒",
      color: "orange",
      href: "/orders",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Link
          href={stat.href}
          key={stat.title}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {loading ? (
                  <span className="inline-block h-8 w-14 animate-pulse rounded bg-slate-200" />
                ) : (
                  stat.value
                )}
              </p>

              <p className="mt-2 text-xs text-slate-400">{stat.description}</p>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colorMap[stat.color]}`}
            >
              {stat.icon}
            </div>
          </div>

          <div className="mt-5 flex items-center text-xs font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
            Xem chi tiết
            <span className="ml-1">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
