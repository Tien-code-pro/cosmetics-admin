"use client";

type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

interface CustomerFormProps {
  form: CustomerFormData;
  editingId: string | null;
  submitting: boolean;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export default function CustomerForm({
  form,
  editingId,
  submitting,
  onChange,
  onSubmit,
  onReset,
}: CustomerFormProps) {
  return (
    <div
      id="customer-form"
      className={`mb-6 overflow-hidden rounded-xl border bg-white shadow-sm ${
        editingId ? "border-amber-300" : "border-slate-200"
      }`}
    >
      {/* HEADER */}
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

      {/* FORM */}
      <form onSubmit={onSubmit} className="p-5">
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onClick={onReset}
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
  );
}
