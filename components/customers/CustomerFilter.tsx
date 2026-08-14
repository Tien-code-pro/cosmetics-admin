"use client";

interface CustomerFilterProps {
  search: string;
  activeFilter: string;

  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onActiveFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  onClear: () => void;
}

export default function CustomerFilter({
  search,
  activeFilter,
  onSearchChange,
  onActiveFilterChange,
  onClear,
}: CustomerFilterProps) {
  return (
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
            onChange={onSearchChange}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          />
        </div>

        <select
          value={activeFilter}
          onChange={onActiveFilterChange}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
        >
          <option value="">Tất cả trạng thái</option>

          <option value="true">Đang hoạt động</option>

          <option value="false">Đã khóa</option>
        </select>

        {(search || activeFilter) && (
          <button
            type="button"
            onClick={onClear}
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
