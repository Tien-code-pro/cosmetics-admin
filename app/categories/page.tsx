"use client";

import CategoryFilter from "@/components/categories/CategoryFilter";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryList from "@/components/categories/CategoryList";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const {
    // DATA
    categories,
    meta,

    // FORM
    name,
    slug,
    editingId,
    setName,
    setSlug,

    // UI
    loading,
    submitting,

    // SEARCH / FILTER
    search,
    statusFilter,

    // ACTIONS
    setPage,
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleStatus,
    resetForm,
    handleSearchChange,
    handleStatusFilterChange,
  } = useCategories();

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

        <CategoryForm
          name={name}
          slug={slug}
          editingId={editingId}
          submitting={submitting}
          onNameChange={setName}
          onSlugChange={setSlug}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        {/* ================= SEARCH / FILTER ================= */}

        <CategoryFilter
          search={search}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusFilterChange}
        />

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
