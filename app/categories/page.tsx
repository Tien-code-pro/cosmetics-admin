"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import CategoryList from "@/components/categories/CategoryList";

type Category = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
};

const initialMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  // =========================
  // FORM
  // =========================

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // =========================
  // UI
  // =========================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // SEARCH / FILTER / PAGINATION
  // =========================

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState(initialMeta);

  // =========================
  // LOAD DATA
  // =========================

  const loadCategories = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "10");

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      const res = await api.get(`/categories?${params.toString()}`);

      setCategories(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, debouncedSearch, statusFilter]);

  // =========================
  // FORM
  // =========================

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
    } catch (error: any) {
      console.error("Lỗi lưu danh mục:", error);

      alert(error.message || "Không thể lưu danh mục");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);

      if (editingId === id) {
        resetForm();
      }

      /*
       * Nếu xóa item cuối cùng của page hiện tại
       * thì lùi về page trước.
       */
      if (categories.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
        return;
      }

      await loadCategories();
    } catch (error: any) {
      console.error("Lỗi xóa danh mục:", error);

      alert(error.message || "Không thể xóa danh mục");
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const toggleStatus = async (category: Category) => {
    const newStatus = category.status === "active" ? "inactive" : "active";

    // Optimistic update
    setCategories((prev) =>
      prev.map((item) =>
        item.id === category.id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );

    try {
      await api.patch(`/categories/${category.id}`, {
        status: newStatus,
      });
    } catch (error: any) {
      // Rollback
      setCategories((prev) =>
        prev.map((item) =>
          item.id === category.id
            ? {
                ...item,
                status: category.status,
              }
            : item,
        ),
      );

      alert(error.message || "Không thể cập nhật trạng thái");
    }
  };

  // =========================
  // SEARCH
  // =========================

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    // Search mới -> quay về page 1
    setPage(1);
  };

  // =========================
  // STATUS FILTER
  // =========================

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(e.target.value);

    // Filter mới -> quay về page 1
    setPage(1);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

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

        {/* ================= FORM ================= */}

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
            {/* NAME */}

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

            {/* SLUG */}

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

            {/* BUTTONS */}

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

        {/* ================= SEARCH / FILTER ================= */}

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc slug..."
            value={search}
            onChange={handleSearchChange}
            className="h-10 min-w-[220px] flex-1 rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>

            <option value="active">Hoạt động</option>

            <option value="inactive">Đã ẩn</option>
          </select>
        </div>

        {/* ================= LIST ================= */}

        <CategoryList
          categories={categories}
          loading={loading}
          meta={meta}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleStatus}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
