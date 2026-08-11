"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);

      const data = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(
        data.message ||
          "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi đến email.",
      );
    } catch (err: any) {
      setError(err?.message || "Không thể thực hiện yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-[430px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl shadow-lg shadow-blue-600/25">
              🔐
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Quên mật khẩu?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Nhập email tài khoản của bạn.
              <br />
              Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
            </p>
          </div>

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? "Đang xử lý..." : "Gửi hướng dẫn"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 w-full text-center text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>
    </main>
  );
}
