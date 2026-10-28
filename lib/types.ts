// Tipos que reflejan los Resources de la API Laravel (ver Swagger: /api/documentation)

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  created_at: string | null;
};

export type AuthPayload = {
  user: User;
  token: string;
  token_type: "Bearer";
  expires_at: string | null;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  in_stock: boolean;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type Payment = {
  id: number;
  order_id: number;
  provider: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  failure_message: string | null;
  paid_at: string | null;
  created_at: string | null;
};

export type Order = {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  shipping_address: string | null;
  notes: string | null;
  items_count?: number;
  items?: OrderItem[];
  latest_payment?: Payment | null;
  paid_at: string | null;
  created_at: string | null;
};

export type PayResult = {
  payment: Payment;
  order: Order;
  client_secret: string | null;
  publishable_key: string | null;
  requires_action: boolean;
};

export type ProductFilters = {
  search?: string;
  category?: string;
  sort?: string;
  in_stock?: boolean;
  page?: number;
};

// Estado que devuelven las Server Actions a los formularios (useActionState)
export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  // Valores enviados (sin contraseñas) para repoblar el formulario tras un error
  fields?: Record<string, string>;
};
