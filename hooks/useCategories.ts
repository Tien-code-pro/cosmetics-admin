"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";

export type Category = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
};

export type CategoryMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const initialMeta: CategoryMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export function useCategories() {
  // =========================
  // DATA
  // =========================

  const [categories, setCategories] = useState<Category[]>([]);

  const [meta, setMeta] = useState<CategoryMeta>(initialMeta);

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

  // =========================
  // LOAD DATA
  // =========================

  const loadCategories = useCallback(async () => {
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

      setCategories(res.data || []);
      setMeta(res.meta || initialMeta);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        return;
      }

      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditingId(null);
  };

  // =========================
  // SUBMIT
  // =========================

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

      // Nếu xóa item cuối cùng của page hiện tại
      // thì quay về page trước.
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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // =========================
  // STATUS FILTER
  // =========================

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return {
    // data
    categories,
    meta,

    // form
    name,
    slug,
    editingId,
    setName,
    setSlug,

    // ui
    loading,
    submitting,

    // search / filter / pagination
    search,
    statusFilter,
    page,
    setPage,

    // actions
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleStatus,
    resetForm,
    handleSearchChange,
    handleStatusFilterChange,
  };
}
