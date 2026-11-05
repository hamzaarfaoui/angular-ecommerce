export interface CreateOrderItem {
  book: number; // ID du livre
  quantity: number;
}

export interface CreateOrderRequest {
  city: string;
  zip_code: string;
  street: string;
  country: string;
  phone_no: string;
  order_Items: CreateOrderItem[];
}

export interface OrderItem {
  id: number;
  book: number | null;
  order: number;
  name: string;
  quantity: number;
  price: string | number;
}

export interface Order {
  id: number;
  code: string;
  city: string;
  zip_code: string;
  street: string;
  state?: string;
  country: string;
  phone_no: string;
  total_amount: number;
  payment_status: 'Paid' | 'Unpaid';
  payment_mode: 'COD' | 'CARD';
  status: 'Processing' | 'Shipped' | 'Delivered';
  user: number;
  createAt: string;
  orderItems: OrderItem[];
}