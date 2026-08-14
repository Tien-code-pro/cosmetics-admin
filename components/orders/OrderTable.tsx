"use client";

import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/type/order";

import {
  OrderStatusBadge,
  getPaymentLabel,
  getPaymentStyle,
} from "./OrderStatusBadge";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Props {
  orders: Order[];
  loading: boolean;

  search: string;
  status: OrderStatus | "";
  paymentStatus: PaymentStatus | "";
  paymentMethod: PaymentMethod | "";

  page: number;
  limit: number;
  pagination: Pagination;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "") => void;
  onPaymentStatusChange: (value: PaymentStatus | "") => void;
  onPaymentMethodChange: (value: PaymentMethod | "") => void;

  onResetFilters: () => void;
  onRefresh: () => void;

  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;

  onSelectOrder: (order: Order) => void;

  formatPrice: (price: number) => string;
  formatDate: (date?: string) => string;
}

export default function OrderTable({
  orders,
  loading,

  search,
  status,
  paymentStatus,
  paymentMethod,

  page,
  limit,
  pagination,

  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onPaymentMethodChange,

  onResetFilters,
  onRefresh,

  onPageChange,
  onLimitChange,

  onSelectOrder,

  formatPrice,
  formatDate,
}: Props) {
  const hasFilter = search || status || paymentStatus || paymentMethod;

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Danh sách đơn hàng
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Đang tải dữ liệu..." : `${pagination.total} đơn hàng`}
            </p>
          </div>

          {!loading && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              ↻ Làm mới
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* SEARCH */}
          <div className="relative xl:col-span-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm mã đơn, tên, email, SĐT..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* ORDER STATUS */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as OrderStatus | "")}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Tất cả trạng thái</option>

            <option value="pending">Chờ xác nhận</option>

            <option value="confirmed">Đã xác nhận</option>

            <option value="shipping">Đang giao</option>

            <option value="completed">Hoàn thành</option>

            <option value="cancelled">Đã hủy</option>
          </select>

          {/* PAYMENT STATUS */}
          <select
            value={paymentStatus}
            onChange={(e) =>
              onPaymentStatusChange(e.target.value as PaymentStatus | "")
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Tất cả thanh toán</option>

            <option value="unpaid">Chưa thanh toán</option>

            <option value="paid">Đã thanh toán</option>
          </select>

          {/* PAYMENT METHOD */}
          <select
            value={paymentMethod}
            onChange={(e) =>
              onPaymentMethodChange(e.target.value as PaymentMethod | "")
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Tất cả phương thức</option>

            <option value="COD">COD</option>

            <option value="VNPay">VNPay</option>

            <option value="Momo">Momo</option>
          </select>
        </div>

        {/* ACTIVE FILTER */}
        {hasFilter && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Đang áp dụng bộ lọc</p>

            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* LOADING */}
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
        /* EMPTY */
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            🛒
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            {hasFilter ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng"}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {hasFilter
              ? "Không có đơn hàng nào phù hợp với bộ lọc hiện tại."
              : "Hiện tại chưa có đơn hàng nào trong hệ thống."}
          </p>

          {hasFilter && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <>
          {/* TABLE */}
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
                    {/* ORDER */}
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

                    {/* CUSTOMER */}
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

                    {/* ITEMS */}
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

                    {/* TOTAL */}
                    <td className="px-6 py-5">
                      <span className="font-semibold text-slate-900">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* PAYMENT */}
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

                    {/* DATE */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
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

          {/* PAGINATION */}
          <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">
                Tổng cộng{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.total}
                </span>{" "}
                đơn hàng
              </p>

              <div className="hidden h-4 w-px bg-slate-300 sm:block" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Hiển thị</span>

                <select
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-blue-400"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* RIGHT */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                {/* PREVIOUS */}
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                  className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←<span className="ml-1 hidden sm:inline">Trước</span>
                </button>

                {/* PAGE NUMBERS */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNumber, index) => {
                    if (pageNumber === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                        >
                          ...
                        </span>
                      );
                    }

                    const number = pageNumber as number;

                    return (
                      <button
                        key={number}
                        type="button"
                        onClick={() => onPageChange(number)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                          page === number
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-transparent text-slate-600 hover:bg-white hover:text-blue-600"
                        }`}
                      >
                        {number}
                      </button>
                    );
                  })}
                </div>

                {/* NEXT */}
                <button
                  type="button"
                  disabled={page === pagination.totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="mr-1 hidden sm:inline">Sau</span>→
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
