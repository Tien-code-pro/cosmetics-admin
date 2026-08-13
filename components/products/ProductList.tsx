"use client";

import { Product, Category } from "@/type/product";
import Link from "next/link";
import Pagination from "@/components/Pagination";

type ProductMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

interface ProductListProps {
  products: Product[];
  categories: Category[];

  loading: boolean;

  search: string;
  categoryFilter: string;
  statusFilter: string;

  meta: ProductMeta;

  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onCategoryFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  onPageChange: (page: number) => void;

  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (product: Product) => void;
}

export default function ProductList({
  products,
  categories,
  loading,

  search,
  categoryFilter,
  statusFilter,

  meta,

  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onPageChange,

  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductListProps) {
  const formatPrice = (price: number) =>
    `${Number(price).toLocaleString("vi-VN")}đ`;

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Hết hàng",
        className: "bg-red-50 text-red-700",
        dotClassName: "bg-red-500",
      };
    }

    if (stock <= 10) {
      return {
        label: "Sắp hết",
        className: "bg-amber-50 text-amber-700",
        dotClassName: "bg-amber-500",
      };
    }

    return {
      label: "Còn hàng",
      className: "bg-emerald-50 text-emerald-700",
      dotClassName: "bg-emerald-500",
    };
  };

  const getStatus = (status?: string) => {
    if (status === "inactive") {
      return {
        label: "Ngừng hoạt động",
        shortLabel: "Tắt",
        className: "bg-slate-100 text-slate-600 border-slate-200",
        dotClassName: "bg-slate-400",
      };
    }

    return {
      label: "Đang hoạt động",
      shortLabel: "Hoạt động",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotClassName: "bg-emerald-500",
    };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Danh sách sản phẩm
              </h2>

              {!loading && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                  {meta.total}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Đang tải dữ liệu..."
                : `Hiển thị ${products.length} / ${meta.total} sản phẩm`}
            </p>
          </div>

          <Link
            href="/trash"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            🗑️
            <span>Thùng rác</span>
          </Link>
        </div>

        {/* ================= SEARCH / FILTER ================= */}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/* Search */}

          <div className="relative min-w-[240px] flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Tìm theo tên hoặc SKU..."
              value={search}
              onChange={onSearchChange}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="">Tất cả danh mục</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>

            <option value="active">Đang hiển thị</option>

            <option value="inactive">Đã ẩn</option>
          </select>
        </div>
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-4 px-6 py-5">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />

              <div className="h-8 w-28 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* ================= EMPTY ================= */

        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            🛍️
          </div>

          <h3 className="font-semibold text-slate-900">
            Không tìm thấy sản phẩm
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Thử thay đổi từ khóa hoặc bộ lọc.
          </p>
        </div>
      ) : (
        /* ================= TABLE ================= */

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1250px] table-fixed">
            <colgroup>
              <col className="w-[300px]" />
              <col className="w-[145px]" />
              <col className="w-[145px]" />
              <col className="w-[145px]" />
              <col className="w-[160px]" />
              <col className="w-[175px]" />
              <col className="w-[280px]" />
            </colgroup>

            {/* HEADER */}

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Sản phẩm
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  SKU
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Giá bán
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Tồn kho
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Danh mục
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>

                <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>

            {/* BODY */}

            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock);

                const status = getStatus(product.status);

                return (
                  <tr
                    key={product.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    {/* PRODUCT */}

                    <td className="px-6 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
                            📦
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p
                            title={product.name}
                            className="truncate text-sm font-semibold text-slate-900"
                          >
                            {product.name}
                          </p>

                          <p
                            title={product.slug}
                            className="mt-1 truncate text-xs text-slate-400"
                          >
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}

                    <td className="px-5 py-4">
                      <code
                        title={product.sku}
                        className="block max-w-full truncate rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {product.sku}
                      </code>
                    </td>

                    {/* PRICE */}

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm font-semibold text-slate-900">
                        {formatPrice(product.price)}
                      </span>
                    </td>

                    {/* STOCK */}

                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {product.stock}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${stockStatus.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${stockStatus.dotClassName}`}
                          />

                          {stockStatus.label}
                        </span>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="px-5 py-4">
                      {product.category ? (
                        <span
                          title={product.category.name}
                          className="inline-block max-w-[130px] truncate rounded-lg bg-purple-50 px-2.5 py-1.5 text-[11px] font-medium text-purple-700"
                        >
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Chưa phân loại
                        </span>
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        title={`Nhấn để ${
                          product.status === "active"
                            ? "ngừng hoạt động"
                            : "kích hoạt"
                        }`}
                        onClick={() => onToggleStatus(product)}
                        className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition hover:shadow-sm ${status.className}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${status.dotClassName}`}
                        />

                        <span>{status.shortLabel}</span>
                      </button>
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onView(product)}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          👁️
                          <span className="ml-1.5">Xem</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          ✏️
                          <span className="ml-1.5">Sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(product.id)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50"
                        >
                          🗑️
                          <span className="ml-1.5">Xóa</span>
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

      {/* ================= PAGINATION ================= */}

      {!loading && products.length > 0 && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* ================= FOOTER ================= */}

      {!loading && meta.total > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-6 py-3.5">
          <p className="text-xs text-slate-500">
            Tổng cộng{" "}
            <span className="font-semibold text-slate-700">{meta.total}</span>{" "}
            sản phẩm
          </p>

          <p className="text-xs text-slate-400">
            Trang {meta.page} / {meta.totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
