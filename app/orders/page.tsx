"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

type OrderItem = {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
};

type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
  city: string;
};

type Order = {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customer?: Customer | null;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string | null;
  shippingAddress: ShippingAddress;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await api.get("/orders");

      setOrders(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể lấy danh sách đơn hàng",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      return;
    }

    try {
      await api.delete(`/orders/${id}`);

      setSelectedOrder(null);

      await loadOrders();
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);

      alert(error instanceof Error ? error.message : "Không thể xóa đơn hàng");
    }
  };

  const formatPrice = (price: number) => {
    return `${Number(price).toLocaleString("vi-VN")}đ`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentLabel = (paymentMethod?: string | null) => {
    switch (paymentMethod) {
      case "COD":
        return "COD";

      case "VNPay":
        return "VNPay";

      case "Momo":
        return "MoMo";

      default:
        return "Chưa chọn";
    }
  };

  const getPaymentStyle = (paymentMethod?: string | null) => {
    switch (paymentMethod) {
      case "COD":
        return "bg-amber-50 text-amber-700";

      case "VNPay":
        return "bg-blue-50 text-blue-700";

      case "Momo":
        return "bg-pink-50 text-pink-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-sm">
              🛒
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Quản lý đơn hàng
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Theo dõi và quản lý các đơn hàng của khách hàng
              </p>
            </div>
          </div>
        </div>

        {/* ================= STATISTICS ================= */}

        {!loading && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Total orders */}

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

            {/* Total revenue */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Tổng giá trị đơn hàng
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatPrice(
                      orders.reduce(
                        (total, order) =>
                          total + Number(order.totalAmount || 0),
                        0,
                      ),
                    )}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  💰
                </div>
              </div>
            </div>

            {/* Customers */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Khách hàng đã đặt</p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {
                      new Set(
                        orders.map((order) => order.customerId).filter(Boolean),
                      ).size
                    }
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  👥
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ORDER TABLE ================= */}

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
                onClick={loadOrders}
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
            /* Empty */

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
            /* Table */

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
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {order.items?.length || 0} sản phẩm
                          </span>
                        </div>

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

                      {/* Payment */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentStyle(
                            order.paymentMethod,
                          )}`}
                        >
                          {getPaymentLabel(order.paymentMethod)}
                        </span>
                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            👁️
                            <span>Xem</span>
                          </button>

                          <button
                            onClick={() => handleDelete(order.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            🗑️
                            <span>Xóa</span>
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
      </div>

      {/* ================================================= */}
      {/* DETAIL MODAL */}
      {/* ================================================= */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                    📦
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedOrder.orderNumber}
                    </h2>

                    <p className="text-xs text-slate-400">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Customer */}

              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  👤 Thông tin khách hàng
                </h3>

                {selectedOrder.customer ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-400">Họ và tên</p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {selectedOrder.customer.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Email</p>

                      <p className="mt-1 text-sm text-slate-700">
                        {selectedOrder.customer.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Số điện thoại</p>

                      <p className="mt-1 text-sm text-slate-700">
                        {selectedOrder.customer.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Đơn hàng của khách vãng lai
                  </p>
                )}
              </div>

              {/* Products */}

              <div className="rounded-xl border border-slate-200">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    🛍️ Sản phẩm
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          📦
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold text-slate-900">
                        {formatPrice(
                          Number(item.price) * Number(item.quantity),
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}

                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
                  <span className="font-medium text-slate-600">Tổng cộng</span>

                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Shipping */}

              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  📍 Địa chỉ giao hàng
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400">Người nhận</p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {selectedOrder.shippingAddress?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Số điện thoại</p>

                    <p className="mt-1 text-sm text-slate-700">
                      {selectedOrder.shippingAddress?.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Địa chỉ</p>

                    <p className="mt-1 text-sm text-slate-700">
                      {selectedOrder.shippingAddress?.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Thành phố</p>

                    <p className="mt-1 text-sm text-slate-700">
                      {selectedOrder.shippingAddress?.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5">
                  <p className="text-xs text-slate-400">
                    Phương thức thanh toán
                  </p>

                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentStyle(
                        selectedOrder.paymentMethod,
                      )}`}
                    >
                      {getPaymentLabel(selectedOrder.paymentMethod)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <p className="text-xs text-slate-400">Ngày đặt hàng</p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              {/* Note */}

              {selectedOrder.note && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-amber-800">
                    📝 Ghi chú
                  </h3>

                  <p className="text-sm text-amber-700">{selectedOrder.note}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => handleDelete(selectedOrder.id)}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                🗑️ Xóa đơn hàng
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
