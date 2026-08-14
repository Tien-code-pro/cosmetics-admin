"use client";

import { useEffect, useState } from "react";

import { api } from "../lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt?: string;
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const [activeFilter, setActiveFilter] = useState("");

  const [page, setPage] = useState(1);

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
  // PAGINATION
  // =========================

  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

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

      setMeta(
        res.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      );
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
  // HANDLE INPUT
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

  // const handleDelete = async (id: string) => {
  //   if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
  //     return;
  //   }

  //   try {
  //     await api.delete(`/customers/${id}`);

  //     if (editingId === id) {
  //       resetForm();
  //     }

  //     await loadCustomers();
  //   } catch (error) {
  //     console.error("Lỗi xóa khách hàng:", error);

  //     alert(
  //       error instanceof Error
  //         ? error.message
  //         : "Có lỗi xảy ra khi xóa khách hàng",
  //     );
  //   }
  // };
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

      // Cập nhật thống kê ngay lập tức
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
  // DATE
  // =========================

  const formatDate = (date?: string) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
              onClick={() => {
                resetForm();

                document.getElementById("customer-form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-lg leading-none">+</span>
              Thêm khách hàng
            </button>
          )}
        </div>

        {/* STATISTICS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* TOTAL */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Tổng khách hàng
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {statsLoading ? "—" : stats.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                👥
              </div>
            </div>
          </div>

          {/* ACTIVE */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Đang hoạt động
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {statsLoading ? "—" : stats.active}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* LOCKED */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Đã khóa</p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {statsLoading ? "—" : stats.locked}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-lg">
                🔒
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div
          id="customer-form"
          className={`mb-6 overflow-hidden rounded-xl border bg-white shadow-sm ${
            editingId ? "border-amber-300" : "border-slate-200"
          }`}
        >
          <div
            className={`flex items-center justify-between border-b px-5 py-4 ${
              editingId ? "border-amber-200 bg-amber-50/60" : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${
                  editingId ? "bg-amber-100" : "bg-blue-50"
                }`}
              >
                {editingId ? "✏️" : "+"}
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editingId ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingId
                    ? "Cập nhật thông tin tài khoản khách hàng"
                    : "Tạo tài khoản khách hàng mới"}
                </p>
              </div>
            </div>

            {editingId && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Đang chỉnh sửa
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {/* NAME */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Họ và tên
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>

                <input
                  name="phone"
                  type="tel"
                  placeholder="0987654321"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mật khẩu
                  <span className="ml-1 text-red-500">*</span>
                  {editingId && (
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      (không đổi thì để trống)
                    </span>
                  )}
                </label>

                <input
                  name="password"
                  type="password"
                  placeholder={editingId ? "Mật khẩu mới" : "Tối thiểu 6 ký tự"}
                  value={form.password}
                  onChange={handleChange}
                  required={!editingId}
                  minLength={6}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* BUTTON */}

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Hủy
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang lưu...
                  </>
                ) : editingId ? (
                  <>
                    <span>✓</span>
                    Cập nhật
                  </>
                ) : (
                  <>
                    <span>+</span>
                    Thêm khách hàng
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* SEARCH */}

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Tìm theo tên, email hoặc số điện thoại..."
                value={search}
                onChange={handleSearchChange}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
              />
            </div>

            <select
              value={activeFilter}
              onChange={handleActiveFilterChange}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
            >
              <option value="">Tất cả trạng thái</option>

              <option value="true">Đang hoạt động</option>

              <option value="false">Đã khóa</option>
            </select>

            {(search || activeFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("");
                  setPage(1);
                }}
                className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Danh sách khách hàng
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {loading
                  ? "Đang tải dữ liệu..."
                  : `Hiển thị ${customers.length} khách hàng`}
              </p>
            </div>

            {!loading && customers.length > 0 && (
              <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                Trang {meta.page} / {meta.totalPages}
              </span>
            )}
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

                    <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                  </div>

                  <div className="ml-auto h-8 w-28 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            /* EMPTY */

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                👥
              </div>

              <h3 className="text-sm font-semibold text-slate-900">
                Không tìm thấy khách hàng
              </h3>

              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái.
              </p>
            </div>
          ) : (
            /* TABLE */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Khách hàng
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Số điện thoại
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Ngày tạo
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Trạng thái
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className={`group transition ${
                        editingId === customer.id
                          ? "bg-amber-50/50"
                          : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold uppercase text-blue-600">
                            {customer.name?.charAt(0) || "?"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {customer.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              ID: {customer.id.slice(0, 8)}
                              ...
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {customer.email}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {customer.phone ? (
                          <span className="text-sm text-slate-600">
                            {customer.phone}
                          </span>
                        ) : (
                          <span className="text-xs italic text-slate-400">
                            Chưa cập nhật
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {formatDate(customer.createdAt)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {customer.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Đã khóa
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(customer)}
                            title="Chỉnh sửa"
                            className="cursor-pointer flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            ✏️
                            <span>Sửa</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(customer)}
                            title={
                              customer.isActive
                                ? "Khóa khách hàng"
                                : "Mở khóa khách hàng"
                            }
                            className={`cursor-pointer flex h-8 items-center gap-1.5 rounded-lg border bg-white px-2.5 text-xs font-medium transition ${
                              customer.isActive
                                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {customer.isActive ? "🔒" : "🔓"}

                            <span>
                              {customer.isActive ? "Khóa" : "Mở khóa"}
                            </span>
                          </button>
                          {/* <button
                            onClick={() => handleDelete(customer.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            🗑️
                            <span>Xóa</span>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}

          {!loading && meta.totalPages > 1 && (
            <div className="border-t border-slate-200">
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {/* FOOTER */}

          {!loading && customers.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <p className="text-xs text-slate-500">
                Trang {meta.page} / {meta.totalPages}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
