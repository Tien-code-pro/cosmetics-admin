"use client";

import {
  OrderStatusBadge,
  getPaymentLabel,
  getPaymentStyle,
} from "./OrderStatusBadge";
import OrderPaymentStatus from "./OrderPaymentStatus";
import { Order, OrderStatus } from "@/type/order";

interface Props {
  order: Order | null;
  onClose: () => void;

  onUpdateStatus: (orderId: string, status: OrderStatus) => void;

  onUpdatePaymentStatus: (
    orderId: string,
    paymentStatus: "unpaid" | "paid",
  ) => void;

  formatPrice: (price: number) => string;
  formatDate: (date?: string) => string;
}

export default function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
  formatPrice,
  formatDate,
}: Props) {
  if (!order) return null;

  const getNextStatuses = (status: OrderStatus): OrderStatus[] => {
    switch (status) {
      case "pending":
        return ["confirmed", "cancelled"];

      case "confirmed":
        return ["shipping", "cancelled"];

      case "shipping":
        return ["completed", "cancelled"];

      default:
        return [];
    }
  };

  const nextStatuses = getNextStatuses(order.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
              📦
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {order.orderNumber}
              </h2>

              <p className="text-xs text-slate-400">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
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

            {order.customer ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Họ và tên</p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Email</p>

                  <p className="mt-1 text-sm text-slate-700">
                    {order.customer.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Số điện thoại</p>

                  <p className="mt-1 text-sm text-slate-700">
                    {order.customer.phone || "Chưa cập nhật"}
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
              {order.items?.map((item, index) => (
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
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
              <span className="font-medium text-slate-600">Tổng cộng</span>

              <span className="text-lg font-bold text-blue-600">
                {formatPrice(order.totalAmount)}
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
                  {order.shippingAddress?.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Số điện thoại</p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingAddress?.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Địa chỉ</p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingAddress?.address}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Thành phố</p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingAddress?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-xs text-slate-400">Phương thức thanh toán</p>

              <div className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentStyle(
                    order.paymentMethod,
                  )}`}
                >
                  {getPaymentLabel(order.paymentMethod)}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-xs text-slate-400">Ngày đặt hàng</p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Payment status */}
          <OrderPaymentStatus order={order} onUpdate={onUpdatePaymentStatus} />

          {/* Note */}
          {order.note && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="mb-2 text-sm font-semibold text-amber-800">
                📝 Ghi chú
              </h3>

              <p className="text-sm text-amber-700">{order.note}</p>
            </div>
          )}

          {/* Order Status */}
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">
              📦 Trạng thái đơn hàng
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-slate-400">Trạng thái hiện tại</p>

                <div className="mt-2">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              {nextStatuses.length > 0 && (
                <div className="flex items-center gap-2">
                  {nextStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(order.id, status)}
                      className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                        status === "cancelled"
                          ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {status === "confirmed" && "Xác nhận đơn"}

                      {status === "shipping" && "Chuyển sang đang giao"}

                      {status === "completed" && "Hoàn thành"}

                      {status === "cancelled" && "Hủy đơn"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
