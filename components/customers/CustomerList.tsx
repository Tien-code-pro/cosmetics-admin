"use client";

import Pagination from "@/components/Pagination";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt?: string;
};

interface CustomerMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  meta: CustomerMeta;
  editingId: string | null;

  onEdit: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
  onPageChange: (page: number) => void;
}

export default function CustomerList({
  customers,
  loading,
  meta,
  editingId,
  onEdit,
  onToggleStatus,
  onPageChange,
}: CustomerListProps) {
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
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
                  {/* CUSTOMER */}
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

                  {/* EMAIL */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">
                      {customer.email}
                    </span>
                  </td>

                  {/* PHONE */}
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

                  {/* DATE */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">
                      {formatDate(customer.createdAt)}
                    </span>
                  </td>

                  {/* STATUS */}
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

                  {/* ACTION */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        title="Chỉnh sửa"
                        className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        ✏️
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(customer)}
                        title={
                          customer.isActive
                            ? "Khóa khách hàng"
                            : "Mở khóa khách hàng"
                        }
                        className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-2.5 text-xs font-medium transition ${
                          customer.isActive
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {customer.isActive ? "🔒" : "🔓"}

                        <span>{customer.isActive ? "Khóa" : "Mở khóa"}</span>
                      </button>
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
            onPageChange={onPageChange}
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
  );
}
