"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

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

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await api.get("/customers");

      setCustomers(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          phone: form.phone || undefined,
        };

        // Chỉ gửi password nếu người dùng nhập password mới
        if (form.password.trim()) {
          payload.password = form.password;
        }

        await api.patch(`/customers/${editingId}`, payload);
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        };

        await api.post("/customers", payload);
      }

      resetForm();
      await loadCustomers();
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

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      return;
    }

    try {
      await api.delete(`/customers/${id}`);

      if (editingId === id) {
        resetForm();
      }

      await loadCustomers();
    } catch (error) {
      console.error("Lỗi xóa khách hàng:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa khách hàng",
      );
    }
  };

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
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái khách hàng:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật trạng thái khách hàng",
      );
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-sm">
              👥
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Quản lý khách hàng
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Quản lý thông tin và tài khoản khách hàng
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Cập nhật thông tin khách hàng"
                  : "Nhập thông tin để tạo tài khoản khách hàng"}
              </p>
            </div>

            {editingId && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Đang chỉnh sửa
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Họ và tên
                </label>

                <input
                  name="name"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Row 2 */}

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>

                <input
                  name="phone"
                  type="tel"
                  placeholder="0987654321"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mật khẩu
                  {editingId && (
                    <span className="ml-2 font-normal text-slate-400">
                      (để trống nếu không đổi)
                    </span>
                  )}
                </label>

                <input
                  name="password"
                  type="password"
                  placeholder={
                    editingId
                      ? "Nhập mật khẩu mới nếu muốn đổi"
                      : "Tối thiểu 6 ký tự"
                  }
                  value={form.password}
                  onChange={handleChange}
                  required={!editingId}
                  minLength={6}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-6 flex justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Hủy
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang lưu...
                  </span>
                ) : editingId ? (
                  "Cập nhật khách hàng"
                ) : (
                  "Thêm khách hàng"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ================= LIST ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* List header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Danh sách khách hàng
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Đang tải dữ liệu..."
                  : `${customers.length} khách hàng`}
              </p>
            </div>

            {!loading && customers.length > 0 && (
              <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                {customers.length} khách hàng
              </div>
            )}
          </div>

          {/* Loading */}

          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-6 px-6 py-5">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-52 animate-pulse rounded bg-slate-200" />
                  </div>

                  <div className="ml-auto h-9 w-28 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            /* Empty */

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                👥
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                Chưa có khách hàng
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Hãy thêm khách hàng đầu tiên để bắt đầu quản lý.
              </p>
            </div>
          ) : (
            /* Table */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Khách hàng
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Số điện thoại
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Ngày tạo
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
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="group transition hover:bg-slate-50"
                    >
                      {/* Customer */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-600">
                            {customer.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              ID: {customer.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-700">
                          {customer.email}
                        </span>
                      </td>

                      {/* Phone */}

                      <td className="px-6 py-5">
                        {customer.phone ? (
                          <span className="text-sm text-slate-700">
                            {customer.phone}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Chưa cập nhật
                          </span>
                        )}
                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {formatDate(customer.createdAt)}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        {customer.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            ✏️
                            <span>Sửa</span>
                          </button>

                          {/* Khóa / Mở khóa */}
                          <button
                            onClick={() => handleToggleStatus(customer)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                              customer.isActive
                                ? "border-amber-100 bg-white text-amber-600 hover:bg-amber-50"
                                : "border-emerald-100 bg-white text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {customer.isActive ? "🔒" : "🔓"}

                            <span>
                              {customer.isActive ? "Khóa" : "Mở khóa"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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

          {!loading && customers.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <p className="text-sm text-slate-500">
                Tổng cộng{" "}
                <span className="font-semibold text-slate-700">
                  {customers.length}
                </span>{" "}
                khách hàng
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
