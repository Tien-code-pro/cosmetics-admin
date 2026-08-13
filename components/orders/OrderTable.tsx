"use client";

import { Order } from "@/type/order";
import {
  OrderStatusBadge,
  getPaymentLabel,
  getPaymentStyle,
} from "./OrderStatusBadge";

interface Props {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
  onSelectOrder: (order: Order) => void;
  formatPrice: (price: number) => string;
  formatDate: (date?: string) => string;
}

export default function OrderTable({
  orders,
  loading,
  onRefresh,
  onSelectOrder,
  formatPrice,
  formatDate,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách đơn hàng
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Đang tải dữ liệu..." : `${orders.length} đơn hàng`}
          </p>
        </div>

        {!loading && orders.length > 0 && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ↻ Làm mới
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-6 px-6 py-5">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />

              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

              <div className="ml-auto h-9 w-28 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            🛒
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            Chưa có đơn hàng
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Hiện tại chưa có đơn hàng nào trong hệ thống.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Đơn hàng
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Khách hàng
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sản phẩm
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tổng tiền
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Thanh toán
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ngày đặt
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="group transition hover:bg-slate-50"
                >
                  {/* Order */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                        📦
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {order.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-5">
                    {order.customer ? (
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.customer.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.customer.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Khách vãng lai
                      </span>
                    )}
                  </td>

                  {/* Items */}
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {order.items?.length || 0} sản phẩm
                    </span>

                    {order.items?.length > 0 && (
                      <p className="mt-2 max-w-[220px] truncate text-xs text-slate-400">
                        {order.items.map((item) => item.name).join(", ")}
                      </p>
                    )}
                  </td>

                  {/* Total */}
                  <td className="px-6 py-5">
                    <span className="font-semibold text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentStyle(
                          order.paymentMethod,
                        )}`}
                      >
                        {getPaymentLabel(order.paymentMethod)}
                      </span>

                      <p
                        className={`text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {order.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </p>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-600">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        👁️
                        <span>Xem</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!loading && orders.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-sm text-slate-500">
            Tổng cộng{" "}
            <span className="font-semibold text-slate-700">
              {orders.length}
            </span>{" "}
            đơn hàng
          </p>
        </div>
      )}
    </div>
  );
}
