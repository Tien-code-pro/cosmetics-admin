"use client";

type CustomerStatsData = {
  total: number;
  active: number;
  locked: number;
};

interface CustomerStatsProps {
  stats: CustomerStatsData;
  loading: boolean;
}

export default function CustomerStats({ stats, loading }: CustomerStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* TOTAL */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Tổng khách hàng
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {loading ? "—" : stats.total}
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
            <p className="text-sm font-medium text-slate-500">Đang hoạt động</p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {loading ? "—" : stats.active}
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
              {loading ? "—" : stats.locked}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-lg">
            🔒
          </div>
        </div>
      </div>
    </div>
  );
}
