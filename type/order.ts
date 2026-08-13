export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export type PaymentMethod = "COD" | "VNPay" | "Momo";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

export type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
  city: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customer?: Customer | null;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod | null;
  paymentStatus: PaymentStatus;
  shippingAddress?: ShippingAddress | null;
  note?: string | null;
  createdAt?: string;
};
