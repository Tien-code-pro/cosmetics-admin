"use client";

interface CategoryFilterProps {
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function CategoryFilter({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* SEARCH */}

      <input
        type="text"
        placeholder="Tìm theo tên hoặc slug..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-10 min-w-[220px] flex-1 rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {/* STATUS */}

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
      >
        <option value="">Tất cả trạng thái</option>

        <option value="active">Hoạt động</option>

        <option value="inactive">Đã ẩn</option>
      </select>
    </div>
  );
}
