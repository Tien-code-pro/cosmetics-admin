"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Order, OrderStatus } from "@/type/order";
import OrderStats from "@/components/orders/OrderStats";
import OrderTable from "@/components/orders/OrderTable";
import OrderDetailModal from "@/components/orders/OrderDetailModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // =========================
  // FORMAT
  // =========================

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

  // =========================
  // LOAD ORDERS
  // =========================

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

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await api.patch(`/orders/${orderId}/status`, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, ...updatedOrder } : order,
        ),
      );

      setSelectedOrder((prev) =>
        prev?.id === orderId ? { ...prev, ...updatedOrder } : prev,
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái đơn hàng",
      );
    }
  };

  // =========================
  // UPDATE PAYMENT STATUS
  // =========================

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: "unpaid" | "paid",
  ) => {
    try {
      const updatedOrder = await api.patch(
        `/orders/${orderId}/payment-status`,
        {
          paymentStatus,
        },
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, ...updatedOrder } : order,
        ),
      );

      setSelectedOrder((prev) =>
        prev?.id === orderId ? { ...prev, ...updatedOrder } : prev,
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thanh toán:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái thanh toán",
      );
    }
  };

  // =========================
  // INIT
  // =========================

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
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

        {/* STATS */}
        {!loading && <OrderStats orders={orders} formatPrice={formatPrice} />}

        {/* TABLE */}
        <OrderTable
          orders={orders}
          loading={loading}
          onRefresh={loadOrders}
          onSelectOrder={setSelectedOrder}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      </div>

      {/* DETAIL */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />
    </div>
  );
}
