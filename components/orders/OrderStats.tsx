"use client";

import { Order } from "@/type/order";

interface Props {
  orders: Order[];
  formatPrice: (price: number) => string;
}

export default function OrderStats({ orders, formatPrice }: Props) {
  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0,
  );

  const totalCustomers = new Set(
    orders.map((order) => order.customerId).filter(Boolean),
  ).size;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Tổng đơn */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Tổng đơn hàng</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {orders.length}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
            🛒
          </div>
        </div>
      </div>

      {/* Tổng doanh thu */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Tổng giá trị đơn hàng</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatPrice(totalRevenue)}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
            💰
          </div>
        </div>
      </div>

      {/* Khách hàng */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Khách hàng đã đặt</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalCustomers}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
            👥
          </div>
        </div>
      </div>
    </div>
  );
}
