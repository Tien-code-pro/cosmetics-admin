"use client";

import { Category } from "@/hooks/useCategories";

interface CategoryFormProps {
  name: string;
  slug: string;
  editingId: string | null;
  submitting: boolean;

  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function CategoryForm({
  name,
  slug,
  editingId,
  submitting,
  onNameChange,
  onSlugChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  return (
    <div
      className={`mb-8 rounded-2xl border bg-white p-6 shadow-sm ${
        editingId
          ? "border-amber-300 ring-2 ring-amber-100"
          : "border-slate-200"
      }`}
    >
      {/* HEADER */}

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

      {/* FORM */}

      <form
        onSubmit={onSubmit}
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
            onChange={(e) => onNameChange(e.target.value)}
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
            onChange={(e) => onSlugChange(e.target.value)}
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
              onClick={onCancel}
              className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
