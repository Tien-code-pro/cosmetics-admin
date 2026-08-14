interface RevenueCardProps {
  totalRevenue: number;
  totalOrders: number;
  totalStock: number;
  loading: boolean;
}

export default function RevenueCard({
  totalRevenue,
  totalOrders,
  totalStock,
  loading,
}: RevenueCardProps) {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Tổng giá trị đơn hàng
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {loading ? (
              <span className="inline-block h-9 w-40 animate-pulse rounded bg-slate-200" />
            ) : (
              formatPrice(totalRevenue)
            )}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
          💰
        </div>
      </div>

      <div className="mt-7 rounded-xl bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Tổng số đơn hàng</p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {loading ? "..." : totalOrders}
            </p>
          </div>

          <div>
            <p className="text-right text-sm text-slate-500">Tổng tồn kho</p>

            <p className="mt-1 text-right text-xl font-bold text-slate-900">
              {loading ? "..." : totalStock}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
