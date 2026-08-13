import { OrderStatus, PaymentMethod } from "@/type/order";

export function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";

    case "confirmed":
      return "Đã xác nhận";

    case "shipping":
      return "Đang giao";

    case "completed":
      return "Hoàn thành";

    case "cancelled":
      return "Đã hủy";

    default:
      return status;
  }
}

export function getStatusStyle(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";

    case "confirmed":
      return "bg-blue-50 text-blue-700";

    case "shipping":
      return "bg-purple-50 text-purple-700";

    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function getPaymentLabel(paymentMethod?: PaymentMethod | null) {
  switch (paymentMethod) {
    case "COD":
      return "COD";

    case "VNPay":
      return "VNPay";

    case "Momo":
      return "MoMo";

    default:
      return "Chưa chọn";
  }
}

export function getPaymentStyle(paymentMethod?: PaymentMethod | null) {
  switch (paymentMethod) {
    case "COD":
      return "bg-amber-50 text-amber-700";

    case "VNPay":
      return "bg-blue-50 text-blue-700";

    case "Momo":
      return "bg-pink-50 text-pink-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

interface StatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getStatusStyle(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
