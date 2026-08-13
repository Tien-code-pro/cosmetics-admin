"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await api.get("/categories");

      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`/categories/${editingId}`, {
          name,
          slug,
        });
      } else {
        await api.post("/categories", {
          name,
          slug,
        });
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      console.error("Lỗi lưu danh mục:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);

    // Cuộn lên đầu để sửa
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await api.delete(`/categories/${id}`);

      if (editingId === id) {
        resetForm();
      }

      await loadCategories();
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
    }
  };

  const toggleStatus = async (category: Category) => {
    const newStatus = category.status === "active" ? "inactive" : "active";

    // Cập nhật ngay trên giao diện — không cần chờ API, không có cảm giác load lại
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, status: newStatus } : c)),
    );

    try {
      await api.patch(`/categories/${category.id}`, { status: newStatus });
    } catch (error: any) {
      // Nếu API lỗi, tự động trả lại trạng thái cũ
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id ? { ...c, status: category.status } : c,
        ),
      );
      alert(error.message || "Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-sm">
              📁
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Quản lý danh mục
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Quản lý các danh mục sản phẩm trong hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          className={`mb-8 rounded-2xl border bg-white p-6 shadow-sm ${
            editingId
              ? "border-amber-300 ring-2 ring-amber-100"
              : "border-slate-200"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Cập nhật thông tin danh mục"
                  : "Nhập thông tin để tạo một danh mục mới"}
              </p>
            </div>

            {editingId && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Đang chỉnh sửa
              </span>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_auto]"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tên danh mục
              </label>

              <input
                type="text"
                placeholder="Ví dụ: Chăm sóc da"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>

              <input
                type="text"
                placeholder="Ví dụ: cham-soc-da"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang lưu...
                  </span>
                ) : editingId ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Danh sách danh mục
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Đang tải dữ liệu..."
                  : `${categories.length} danh mục`}
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
                  {categories.length} danh mục
                </div>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-6 px-6 py-5">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                  <div className="ml-auto h-9 w-28 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            /* Empty */
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                📂
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                Chưa có danh mục
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Hãy thêm danh mục đầu tiên để bắt đầu quản lý sản phẩm.
              </p>
            </div>
          ) : (
            /* Table */
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
                      {/* Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                            📁
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {category.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              ID: {category.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-5">
                        <code className="rounded-md bg-slate-100 px-2.5 py-1.5 text-sm text-slate-600">
                          {category.slug}
                        </code>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() => toggleStatus(category)}
                          className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                            category.status === "active"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${category.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {category.status === "active" ? "Hoạt động" : "Đã ẩn"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            ✏️
                            <span>Sửa</span>
                          </button>

                          <button
                            onClick={() => handleDelete(category.id)}
                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
          {!loading && categories.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <p className="text-sm text-slate-500">
                Tổng cộng{" "}
                <span className="font-semibold text-slate-700">
                  {categories.length}
                </span>{" "}
                danh mục
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
