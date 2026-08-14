"use client";

import { useEffect, useState } from "react";

import { api } from "../lib/api";
import { useDebounce } from "@/hooks/useDebounce";

import CustomerStats from "@/components/customers/CustomerStats";
import CustomerForm from "@/components/customers/CustomerForm";
import CustomerFilter from "@/components/customers/CustomerFilter";
import CustomerList, { Customer } from "@/components/customers/CustomerList";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const initialMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export default function CustomersPage() {
  // =========================
  // DATA
  // =========================

  const [customers, setCustomers] = useState<Customer[]>([]);

  // =========================
  // FORM
  // =========================

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  // =========================
  // UI
  // =========================

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // =========================
  // SEARCH / FILTER
  // =========================

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const [activeFilter, setActiveFilter] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState(initialMeta);

  // =========================
  // STATS
  // =========================

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    locked: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  // =========================
  // LOAD STATS
  // =========================

  const loadStats = async () => {
    try {
      setStatsLoading(true);

      const res = await api.get("/customers/stats");

      setStats({
        total: Number(res.total || 0),
        active: Number(res.active || 0),
        locked: Number(res.locked || 0),
      });
    } catch (error) {
      console.error("Lỗi lấy thống kê khách hàng:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // =========================
  // LOAD CUSTOMERS
  // =========================

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "10");

      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim());
      }

      if (activeFilter) {
        params.set("isActive", activeFilter);
      }

      const res = await api.get(`/customers?${params.toString()}`);

      setCustomers(res.data || []);

      setMeta(res.meta || initialMeta);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadStats();
  }, []);

  // =========================
  // LOAD LIST
  // =========================

  useEffect(() => {
    loadCustomers();
  }, [page, debouncedSearch, activeFilter]);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  // =========================
  // INPUT
  // =========================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingId) {
        const payload: {
          name: string;
          email: string;
          phone?: string;
          password?: string;
        } = {
          name: form.name,
          email: form.email,
          phone: form.phone.trim() || undefined,
        };

        if (form.password.trim()) {
          payload.password = form.password;
        }

        await api.patch(`/customers/${editingId}`, payload);
      } else {
        await api.post("/customers", {
          name: form.name,
          email: form.email,
          phone: form.phone.trim() || undefined,
          password: form.password,
        });
      }

      resetForm();

      await Promise.all([loadCustomers(), loadStats()]);
    } catch (error) {
      console.error("Lỗi lưu khách hàng:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lưu khách hàng",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);

    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      password: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const handleToggleStatus = async (customer: Customer) => {
    const nextStatus = !customer.isActive;

    const message = nextStatus
      ? "Bạn có chắc muốn mở khóa khách hàng này?"
      : "Bạn có chắc muốn khóa khách hàng này?";

    if (!confirm(message)) {
      return;
    }

    try {
      const updatedCustomer = await api.patch(
        `/customers/${customer.id}/status`,
        {
          isActive: nextStatus,
        },
      );

      setCustomers((prev) =>
        prev.map((item) =>
          item.id === customer.id
            ? {
                ...item,
                isActive: updatedCustomer.isActive,
              }
            : item,
        ),
      );

      setStats((prev) => ({
        total: prev.total,
        active: nextStatus ? prev.active + 1 : prev.active - 1,
        locked: nextStatus ? prev.locked - 1 : prev.locked + 1,
      }));
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái khách hàng:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật trạng thái khách hàng",
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // =========================
  // FILTER
  // =========================

  const handleActiveFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setActiveFilter(e.target.value);
    setPage(1);
  };

  // =========================
  // CLEAR FILTER
  // =========================

  const handleClearFilter = () => {
    setSearch("");
    setActiveFilter("");
    setPage(1);
  };

  // =========================
  // ADD CUSTOMER
  // =========================

  const handleAddCustomer = () => {
    resetForm();

    document.getElementById("customer-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Quản lý</span>
              <span>/</span>
              <span className="font-medium text-slate-700">Khách hàng</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Khách hàng
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Quản lý thông tin, tài khoản và trạng thái khách hàng.
            </p>
          </div>

          {!editingId && (
            <button
              type="button"
              onClick={handleAddCustomer}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-lg leading-none">+</span>
              Thêm khách hàng
            </button>
          )}
        </div>

        {/* STATS */}

        <CustomerStats stats={stats} loading={statsLoading} />

        {/* FORM */}

        <CustomerForm
          form={form}
          editingId={editingId}
          submitting={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />

        {/* FILTER */}

        <CustomerFilter
          search={search}
          activeFilter={activeFilter}
          onSearchChange={handleSearchChange}
          onActiveFilterChange={handleActiveFilterChange}
          onClear={handleClearFilter}
        />

        {/* LIST */}

        <CustomerList
          customers={customers}
          loading={loading}
          meta={meta}
          editingId={editingId}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
