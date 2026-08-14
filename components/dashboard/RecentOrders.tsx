import Link from "next/link";

interface RecentOrdersProps {
  orders: any[];
  loading: boolean;
}

export default function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h3 className="font-semibold text-slate-900">Đơn hàng gần đây</h3>

          <p className="mt-1 text-xs text-slate-500">
            Các đơn hàng mới nhất trong hệ thống
          </p>
        </div>

        <Link
          href="/orders"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Xem tất cả →
        </Link>
      </div>

      {loading ? (
        <div className="p-6">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ) : orders.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="text-3xl">🛒</div>

          <p className="mt-3 text-sm font-medium text-slate-700">
            Chưa có đơn hàng
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Đơn hàng mới sẽ xuất hiện ở đây
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {orders.slice(0, 5).map((order) => (
            <Link
              href="/orders"
              key={order.id}
              className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  📦
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.orderNumber}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {order.customer?.name || "Khách vãng lai"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {formatPrice(Number(order.totalAmount || 0))}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {order.paymentMethod || "Chưa chọn"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
