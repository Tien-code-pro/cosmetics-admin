"use client";

import { useEffect, useState } from "react";
import { api } from "./lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCards from "@/components/dashboard/StatsCards";
import RevenueCard from "@/components/dashboard/RevenueCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentOrders from "@/components/dashboard/RecentOrders";

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

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader onRefresh={loadDashboard} />

      <div className="p-8">
        <WelcomeBanner />

        <StatsCards
          categoriesTotal={data.categoriesTotal}
          productsTotal={data.productsTotal}
          totalStock={totalStock}
          customerStats={customerStats}
          totalOrders={orderStats.totalOrders}
          loading={loading}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RevenueCard
            totalRevenue={orderStats.totalRevenue}
            totalOrders={orderStats.totalOrders}
            totalStock={totalStock}
            loading={loading}
          />

          <QuickActions />
        </div>

        <RecentOrders orders={data.orders} loading={loading} />
      </div>
    </div>
  );
}
