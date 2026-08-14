"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "./lib/api";

type DashboardData = {
  categoriesTotal: number;
  productsTotal: number;
  products: any[];
  orders: any[];
};

type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
};

type CustomerStats = {
  total: number;
  active: number;
  locked: number;
};

export default function Home() {
  const [data, setData] = useState<DashboardData>({
    categoriesTotal: 0,
    productsTotal: 0,
    products: [],
    orders: [],
  });

  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [customerStats, setCustomerStats] = useState<CustomerStats>({
    total: 0,
    active: 0,
    locked: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [categories, products, orders, stats, customerStats] =
        await Promise.all([
          api.get("/categories?page=1&limit=10"),
          api.get("/products?page=1&limit=10"),
          api.get("/orders?page=1&limit=5"),
          api.get("/orders/stats"),
          api.get("/customers/stats"),
        ]);

      setCustomerStats({
        total: Number(customerStats.total || 0),
        active: Number(customerStats.active || 0),
        locked: Number(customerStats.locked || 0),
      });

      setData({
        categoriesTotal: Array.isArray(categories)
          ? categories.length
          : Number(categories.meta?.total || 0),

        productsTotal: Array.isArray(products)
          ? products.length
          : Number(products.meta?.total || 0),

        products: Array.isArray(products) ? products : products.data || [],

        orders: Array.isArray(orders) ? orders : orders.data || [],
      });

      setOrderStats({
        totalOrders: Number(stats.totalOrders || 0),
        totalRevenue: Number(stats.totalRevenue || 0),
      });
    } catch (error) {
      console.error("Không thể tải dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalStock = data.products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  );

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  const stats = [
    {
      title: "Danh mục",
      value: data.categoriesTotal,
      description: "Danh mục sản phẩm",
      icon: "📁",
      color: "blue",
      href: "/categories",
    },
    {
      title: "Sản phẩm",
      value: data.productsTotal,
      description: `${totalStock} sản phẩm trong kho`,
      icon: "📦",
      color: "violet",
      href: "/products",
    },
    {
      title: "Khách hàng",
      value: customerStats.total,
      description: `${customerStats.active} đang hoạt động`,
      icon: "👥",
      color: "emerald",
      href: "/customers",
    },
    {
      title: "Đơn hàng",
      value: orderStats.totalOrders,
      description: "Đơn hàng trong hệ thống",
      icon: "🛒",
      color: "orange",
      href: "/orders",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-8 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tổng quan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Chào mừng bạn quay trở lại. Đây là tổng quan hệ thống.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span>↻</span>
            Làm mới
          </button>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <div className="p-8">
        {/* Welcome */}

        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-7 text-white shadow-lg shadow-blue-600/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-100">
                SHOP ADMIN
              </p>

              <h2 className="text-2xl font-bold">
                Chào mừng đến với hệ thống quản trị 👋
              </h2>

              <p className="mt-2 max-w-xl text-sm text-blue-100">
                Quản lý sản phẩm, danh mục, khách hàng và đơn hàng của cửa hàng
                tại một nơi.
              </p>
            </div>

            <div className="hidden text-[80px] opacity-20 md:block">🛍️</div>
          </div>
        </div>

        {/* ================= STAT CARDS ================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Link
              href={stat.href}
              key={stat.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {loading ? (
                      <span className="inline-block h-8 w-14 animate-pulse rounded bg-slate-200" />
                    ) : (
                      stat.value
                    )}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                    colorMap[stat.color]
                  }`}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="mt-5 flex items-center text-xs font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
                Xem chi tiết
                <span className="ml-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* ================= REVENUE + QUICK ACTION ================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue */}

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
                    formatPrice(orderStats.totalRevenue)
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
                    {loading ? "..." : orderStats.totalOrders}
                  </p>
                </div>

                <div>
                  <p className="text-right text-sm text-slate-500">
                    Tổng tồn kho
                  </p>

                  <p className="mt-1 text-right text-xl font-bold text-slate-900">
                    {loading ? "..." : totalStock}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Thao tác nhanh
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Truy cập nhanh các chức năng
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/products"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-blue-100 hover:bg-blue-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  📦
                </span>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Quản lý sản phẩm
                  </p>

                  <p className="text-xs text-slate-400">
                    Thêm hoặc chỉnh sửa sản phẩm
                  </p>
                </div>

                <span className="ml-auto text-slate-400">→</span>
              </Link>

              <Link
                href="/categories"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-blue-100 hover:bg-blue-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                  📁
                </span>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Quản lý danh mục
                  </p>

                  <p className="text-xs text-slate-400">Phân loại sản phẩm</p>
                </div>

                <span className="ml-auto text-slate-400">→</span>
              </Link>

              <Link
                href="/orders"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-blue-100 hover:bg-blue-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  🛒
                </span>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Quản lý đơn hàng
                  </p>

                  <p className="text-xs text-slate-400">Theo dõi đơn hàng</p>
                </div>

                <span className="ml-auto text-slate-400">→</span>
              </Link>

              <Link
                href="/customers"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-blue-100 hover:bg-blue-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  👥
                </span>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Khách hàng
                  </p>

                  <p className="text-xs text-slate-400">
                    Xem danh sách khách hàng
                  </p>
                </div>

                <span className="ml-auto text-slate-400">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ================= RECENT ORDERS ================= */}

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
          ) : data.orders.length === 0 ? (
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
              {data.orders.slice(0, 5).map((order) => (
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
      </div>
    </div>
  );
}
