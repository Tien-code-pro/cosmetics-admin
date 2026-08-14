interface DashboardHeaderProps {
  onRefresh: () => void;
}

export default function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tổng quan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Chào mừng bạn quay trở lại. Đây là tổng quan hệ thống.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <span>↻</span>
          Làm mới
        </button>
      </div>
    </header>
  );
}
