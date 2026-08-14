"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "../lib/api";
import { toast } from "sonner";

type TrashType = "product" | "category";

type TrashItem = {
  id: string;
  type: TrashType;
  name: string;
  deletedAt: string | null;
  image?: string;
  sku?: string;
  price?: number;
};

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | TrashType>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadTrash = async () => {
    try {
      setLoading(true);

      const [products, categories] = await Promise.all([
        api.get("/products/trash"),
        api.get("/categories/trash"),
      ]);

      const productItems: TrashItem[] = products.map((product: any) => ({
        id: product.id,
        type: "product",
        name: product.name,
        deletedAt: product.deletedAt,
        image: product.images?.[0],
        sku: product.sku,
        price: product.price,
      }));

      const categoryItems: TrashItem[] = categories.map((category: any) => ({
        id: category.id,
        type: "category",
        name: category.name,
        deletedAt: category.deletedAt,
      }));

      const allItems = [...productItems, ...categoryItems];

      allItems.sort((a, b) => {
        const dateA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;

        const dateB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;

        return dateB - dateA;
      });

      setItems(allItems);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        return;
      }

      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") {
      return items;
    }

    return items.filter((item) => item.type === activeTab);
  }, [items, activeTab]);

  const productCount = items.filter((item) => item.type === "product").length;

  const categoryCount = items.filter((item) => item.type === "category").length;

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "—";

    return `${price.toLocaleString("vi-VN")}đ`;
  };

  const formatDeletedAt = (deletedAt: string | null) => {
    if (!deletedAt) return "—";

    return new Date(deletedAt).toLocaleString("vi-VN");
  };

  const handleRestore = async (item: TrashItem) => {
    const typeName = item.type === "product" ? "sản phẩm" : "danh mục";

    if (!confirm(`Khôi phục ${typeName} "${item.name}"?`)) {
      return;
    }

    try {
      setProcessingId(item.id);

      if (item.type === "product") {
        await api.patch(`/products/${item.id}/restore`, {});
      } else {
        await api.patch(`/categories/${item.id}/restore`, {});
      }

      await loadTrash();
    } catch (error: any) {
      alert(error?.message || `Không thể khôi phục ${typeName}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (item: TrashItem) => {
    const typeName = item.type === "product" ? "sản phẩm" : "danh mục";

    if (
      !confirm(
        `⚠️ XÓA VĨNH VIỄN ${typeName} "${item.name}"?\n\nHành động này KHÔNG THỂ hoàn tác!`,
      )
    ) {
      return;
    }

    try {
      setProcessingId(item.id);

      if (item.type === "product") {
        await api.delete(`/products/${item.id}/permanent`);
      } else {
        await api.delete(`/categories/${item.id}/permanent`);
      }

      await loadTrash();
    } catch (error: any) {
      alert(error?.message || `Không thể xóa vĩnh viễn ${typeName}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl shadow-sm">
              🗑️
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Thùng rác</h1>

              <p className="mt-1 text-sm text-slate-500">
                Quản lý các dữ liệu đã xóa trong hệ thống
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Quay lại
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tổng dữ liệu đã xóa</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {items.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Sản phẩm</p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {productCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Danh mục</p>

            <p className="mt-2 text-2xl font-bold text-purple-600">
              {categoryCount}
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TABS */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6">
            <div className="flex gap-1">
              <TabButton
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
                <TabCount active={activeTab === "all"}>{items.length}</TabCount>
              </TabButton>

              <TabButton
                active={activeTab === "product"}
                onClick={() => setActiveTab("product")}
              >
                🛍️ Sản phẩm
                <TabCount active={activeTab === "product"}>
                  {productCount}
                </TabCount>
              </TabButton>

              <TabButton
                active={activeTab === "category"}
                onClick={() => setActiveTab("category")}
              >
                📁 Danh mục
                <TabCount active={activeTab === "category"}>
                  {categoryCount}
                </TabCount>
              </TabButton>
            </div>

            <div className="text-sm text-slate-500">
              {loading ? "Đang tải..." : `${filteredItems.length} mục`}
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4 px-6 py-5">
                  <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-200" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            /* EMPTY */
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🗑️
              </div>

              <h3 className="font-semibold text-slate-900">
                {activeTab === "all"
                  ? "Thùng rác trống"
                  : activeTab === "product"
                    ? "Không có sản phẩm trong thùng rác"
                    : "Không có danh mục trong thùng rác"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Các dữ liệu bạn xóa sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            /* TABLE */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Loại
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Nội dung
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Thông tin
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ngày xóa
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => {
                    const isProcessing = processingId === item.id;

                    return (
                      <tr
                        key={`${item.type}-${item.id}`}
                        className="transition hover:bg-slate-50"
                      >
                        {/* TYPE */}
                        <td className="px-6 py-4">
                          {item.type === "product" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                              🛍️ Sản phẩm
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                              📁 Danh mục
                            </span>
                          )}
                        </td>

                        {/* CONTENT */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.type === "product" ? (
                              item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-11 w-11 rounded-lg border border-slate-200 object-cover opacity-70"
                                />
                              ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                                  📦
                                </div>
                              )
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50">
                                📁
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-slate-800">
                                {item.name}
                              </p>

                              {item.type === "product" && item.sku && (
                                <p className="mt-1 text-xs text-slate-400">
                                  SKU: {item.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* INFO */}
                        <td className="px-6 py-4">
                          {item.type === "product" ? (
                            <span className="text-sm font-medium text-slate-700">
                              {formatPrice(item.price)}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Danh mục
                            </span>
                          )}
                        </td>

                        {/* DATE */}
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDeletedAt(item.deletedAt)}
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleRestore(item)}
                              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ↩️ {isProcessing ? "Đang xử lý..." : "Khôi phục"}
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handlePermanentDelete(item)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              🗑️ Xóa vĩnh viễn
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-4 text-sm font-medium transition ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function TabCount({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <span
      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
        active ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      {children}
    </span>
  );
}
