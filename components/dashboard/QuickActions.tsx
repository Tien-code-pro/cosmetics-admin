import Link from "next/link";

const actions = [
  {
    href: "/products",
    icon: "📦",
    iconClass: "bg-blue-50",
    title: "Quản lý sản phẩm",
    description: "Thêm hoặc chỉnh sửa sản phẩm",
  },
  {
    href: "/categories",
    icon: "📁",
    iconClass: "bg-violet-50",
    title: "Quản lý danh mục",
    description: "Phân loại sản phẩm",
  },
  {
    href: "/orders",
    icon: "🛒",
    iconClass: "bg-orange-50",
    title: "Quản lý đơn hàng",
    description: "Theo dõi đơn hàng",
  },
  {
    href: "/customers",
    icon: "👥",
    iconClass: "bg-emerald-50",
    title: "Khách hàng",
    description: "Xem danh sách khách hàng",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Thao tác nhanh</h3>

      <p className="mt-1 text-sm text-slate-500">
        Truy cập nhanh các chức năng
      </p>

      <div className="mt-5 space-y-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-blue-100 hover:bg-blue-50"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.iconClass}`}
            >
              {action.icon}
            </span>

            <div>
              <p className="text-sm font-medium text-slate-800">
                {action.title}
              </p>

              <p className="text-xs text-slate-400">{action.description}</p>
            </div>

            <span className="ml-auto text-slate-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
