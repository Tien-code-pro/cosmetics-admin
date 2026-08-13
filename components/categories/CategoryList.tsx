"use client";

import Link from "next/link";
import Pagination from "../Pagination";

type Category = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
};

type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  meta: Meta;

  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (category: Category) => void;

  onPageChange: (page: number) => void;
}

export default function CategoryList({
  categories,
  loading,
  meta,
  onEdit,
  onDelete,
  onToggleStatus,
  onPageChange,
}: CategoryListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sách danh mục
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Đang tải dữ liệu..." : `${meta.total} danh mục`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/trash"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            🗑️
            <span>Thùng rác</span>
          </Link>

          {!loading && categories.length > 0 && (
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
              {categories.length} / {meta.total}
            </div>
          )}
        </div>
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-6 px-6 py-5">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />

              <div className="h-9 w-28 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        /* ================= EMPTY ================= */

        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
            📂
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            Chưa có danh mục
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {meta.total === 0
              ? "Hãy thêm danh mục đầu tiên để bắt đầu quản lý sản phẩm."
              : "Không tìm thấy danh mục phù hợp với điều kiện tìm kiếm."}
          </p>
        </div>
      ) : (
        /* ================= TABLE ================= */

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tên danh mục
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Slug
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="group transition hover:bg-slate-50"
                >
                  {/* NAME */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                        📁
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {category.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          ID: {category.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SLUG */}

                  <td className="px-6 py-5">
                    <code className="rounded-md bg-slate-100 px-2.5 py-1.5 text-sm text-slate-600">
                      {category.slug}
                    </code>
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(category)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        category.status === "active"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          category.status === "active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />

                      {category.status === "active" ? "Hoạt động" : "Đã ẩn"}
                    </button>
                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        ✏️
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(category.id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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

      {/* ================= PAGINATION ================= */}

      {!loading && categories.length > 0 && (
        <div className="border-t border-slate-200">
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* ================= FOOTER ================= */}

      {!loading && categories.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-semibold text-slate-700">
              {(meta.page - 1) * meta.limit + 1}
            </span>
            {" - "}
            <span className="font-semibold text-slate-700">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>
            {" / "}
            <span className="font-semibold text-slate-700">
              {meta.total}
            </span>{" "}
            danh mục
          </p>

          <p className="text-xs text-slate-400">
            Trang {meta.page} / {meta.totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
