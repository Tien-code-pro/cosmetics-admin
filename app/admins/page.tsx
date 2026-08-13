"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { isAdmin } from "../lib/auth";
import { useRouter } from "next/navigation";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  isActive: boolean;
};

const initialForm = { name: "", email: "", password: "", role: "STAFF" };

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      router.replace("/");
      return;
    }

    setChecking(false);
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await api.get("/admins");
      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitting(true);
      await api.post("/admins", form);
      setForm(initialForm);
      await loadAdmins();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (admin: Admin) => {
    const newIsActive = !admin.isActive;

    // Cập nhật ngay trên UI
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === admin.id ? { ...a, isActive: newIsActive } : a,
      ),
    );

    try {
      await api.patch(`/admins/${admin.id}`, { isActive: newIsActive });
    } catch (err: any) {
      // Lỗi thì trả lại trạng thái cũ
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === admin.id ? { ...a, isActive: admin.isActive } : a,
        ),
      );
      alert(err.message || "Không thể cập nhật");
    }
  };

  const changeRole = async (admin: Admin, role: "ADMIN" | "STAFF") => {
    const oldRole = admin.role;

    setAdmins((prev) =>
      prev.map((a) => (a.id === admin.id ? { ...a, role } : a)),
    );

    try {
      await api.patch(`/admins/${admin.id}`, { role });
    } catch (err: any) {
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, role: oldRole } : a)),
      );
      alert(err.message || "Không thể cập nhật");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa tài khoản này?")) return;
    try {
      await api.delete(`/admins/${id}`);
      await loadAdmins();
    } catch (err: any) {
      alert(err.message || "Không thể xóa");
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Quản trị viên
        </h1>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Thêm tài khoản mới
          </h2>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-5"
          >
            <input
              name="name"
              placeholder="Họ tên"
              value={form.name}
              onChange={handleChange}
              required
              className="h-11 rounded-lg border border-slate-300 px-4 text-sm"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="h-11 rounded-lg border border-slate-300 px-4 text-sm"
            />
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="h-11 rounded-lg border border-slate-300 px-4 text-sm"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="h-11 rounded-lg border border-slate-300 px-4 text-sm cursor-pointer"
            >
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Đang thêm..." : "Thêm"}
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Đang tải...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={admin.role}
                        onChange={(e) =>
                          changeRole(admin, e.target.value as "ADMIN" | "STAFF")
                        }
                        className="rounded-lg border border-slate-300 px-2 py-1 text-sm cursor-pointer"
                      >
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(admin)}
                        className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${
                          admin.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {admin.isActive ? "Đang hoạt động" : "Đã khóa"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
