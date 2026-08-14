"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/type/order";

import OrderStats from "@/components/orders/OrderStats";
import OrderTable from "@/components/orders/OrderTable";
import OrderDetailModal from "@/components/orders/OrderDetailModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // =========================
  // FILTER
  // =========================

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

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

  const loadStats = async () => {
    try {
      const result = await api.get("/orders/stats");

      setStats({
        totalOrders: Number(result.totalOrders || 0),
        totalRevenue: Number(result.totalRevenue || 0),
        totalCustomers: Number(result.totalCustomers || 0),
      });
    } catch (error) {
      console.error("Lỗi lấy thống kê đơn hàng:", error);
    }
  };

  // =========================
  // LOAD ORDERS
  // =========================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (paymentStatus) {
        params.set("paymentStatus", paymentStatus);
      }

      if (paymentMethod) {
        params.set("paymentMethod", paymentMethod);
      }

      const result = await api.get(`/orders?${params.toString()}`);

      setOrders(result.data || []);

      setPagination(
        result.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể lấy danh sách đơn hàng",
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([loadOrders(), loadStats()]);
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      const updatedOrder = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, ...updatedOrder } : order,
        ),
      );

      setSelectedOrder((prev) =>
        prev?.id === orderId ? { ...prev, ...updatedOrder } : prev,
      );

      // Cập nhật lại thống kê từ BE
      await loadStats();
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
    newPaymentStatus: PaymentStatus,
  ) => {
    try {
      const updatedOrder = await api.patch(
        `/orders/${orderId}/payment-status`,
        {
          paymentStatus: newPaymentStatus,
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

      // Cập nhật lại thống kê từ BE
      await loadStats();
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
  // FILTER CHANGE
  // =========================

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: OrderStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  const handlePaymentStatusChange = (value: PaymentStatus | "") => {
    setPaymentStatus(value);
    setPage(1);
  };

  const handlePaymentMethodChange = (value: PaymentMethod | "") => {
    setPaymentMethod(value);
    setPage(1);
  };

  // =========================
  // RESET FILTER
  // =========================

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    setPaymentMethod("");
    setPage(1);
  };

  // =========================
  // PAGINATION
  // =========================

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === page) {
      return;
    }

    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // =========================
  // INIT / FILTER / PAGINATION
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search, page, limit, status, paymentStatus, paymentMethod]);

  useEffect(() => {
    loadStats();
  }, []);

  // =========================
  // RENDER
  // =========================

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
        {!loading && <OrderStats stats={stats} formatPrice={formatPrice} />}

        {/* TABLE */}
        <OrderTable
          orders={orders}
          loading={loading}
          search={search}
          status={status}
          paymentStatus={paymentStatus}
          paymentMethod={paymentMethod}
          page={page}
          limit={limit}
          pagination={pagination}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onPaymentMethodChange={handlePaymentMethodChange}
          onResetFilters={handleResetFilters}
          onRefresh={handleRefresh}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
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
