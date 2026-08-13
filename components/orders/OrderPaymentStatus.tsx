"use client";

import { Order } from "@/type/order";

interface Props {
  order: Order;
  onUpdate: (orderId: string, paymentStatus: "unpaid" | "paid") => void;
}

export default function OrderPaymentStatus({ order, onUpdate }: Props) {
  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Trạng thái thanh toán
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                  : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPaid ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />

              {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </span>
          </div>
        </div>

        {!isPaid && (
          <button
            onClick={() => onUpdate(order.id, "paid")}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 active:scale-[0.98]"
          >
            ✓ Xác nhận đã thanh toán
          </button>
        )}
      </div>
    </div>
  );
}
