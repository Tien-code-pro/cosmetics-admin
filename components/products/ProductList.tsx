"use client";

import { Product } from "@/type/product";
import Link from "next/link";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({
  products,
  loading,
  onView,
  onEdit,
  onDelete,
}: ProductListProps) {
  const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")}đ`;

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

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách sản phẩm
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Đang tải dữ liệu..." : `${products.length} sản phẩm`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* THÙNG RÁC */}
          <Link
            href="/trash"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            🗑️ Thùng rác
          </Link>

          {!loading && products.length > 0 && (
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
              {products.length} sản phẩm
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-6 px-6 py-5">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />

              <div className="space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 text-4xl">🛍️</div>

          <h3 className="font-semibold text-slate-900">Chưa có sản phẩm</h3>

          <p className="mt-1 text-sm text-slate-500">
            Hãy thêm sản phẩm đầu tiên.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Sản phẩm
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  SKU
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Giá bán
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Tồn kho
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Danh mục
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock);

                return (
                  <tr key={product.id} className="transition hover:bg-slate-50">
                    {/* SẢN PHẨM */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-11 w-11 rounded-lg border object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                            📦
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-slate-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-5">
                      <code className="rounded-md bg-slate-100 px-2 py-1 text-sm">
                        {product.sku}
                      </code>
                    </td>

                    {/* GIÁ */}
                    <td className="px-6 py-5">
                      <span className="font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    </td>

                    {/* TỒN KHO */}
                    <td className="px-6 py-5">
                      <p className="font-medium">{product.stock}</p>

                      <span
                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${stockStatus.dotClassName}`}
                        />

                        {stockStatus.label}
                      </span>
                    </td>

                    {/* DANH MỤC */}
                    <td className="px-6 py-5">
                      {product.category ? (
                        <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Chưa phân loại
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onView(product)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-blue-50"
                        >
                          👁️ Xem
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-blue-50"
                        >
                          ✏️ Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(product.id)}
                          className="rounded-lg border border-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          🗑️ Xóa
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

      {/* FOOTER */}
      {!loading && products.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-sm text-slate-500">
            Tổng cộng <span className="font-semibold">{products.length}</span>{" "}
            sản phẩm
          </p>
        </div>
      )}
    </div>
  );
}
