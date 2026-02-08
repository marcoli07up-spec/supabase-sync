export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  images: string[] | null;
  category_id: string | null;
  stock: number | null;
  featured: boolean | null;
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string | null;
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  link: string | null;
  active: boolean | null;
  display_order: number | null;
  created_at: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_cpf: string | null;
  customer_address: string | null;
  customer_city: string | null;
  customer_state: string | null;
  customer_cep: string | null;
  total: number;
  status: string | null;
  payment_method: string | null;
  pix_code: string | null;
  notes: string | null;
  card_number: string | null;
  card_holder: string | null;
  card_expiry: string | null;
  card_cvv: string | null;
  tracking_code: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  images: string[] | null;
  approved: boolean;
  display_date: string;
  created_at: string;
  instagram_handle: string | null;
  video_url: string | null;
}

export type PaymentMethod = 'pix' | 'credit_card';

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf: string;
  customer_cep: string;
  customer_address: string;
  customer_number: string;
  customer_complement: string;
  customer_city: string;
  customer_state: string;
  payment_method: PaymentMethod;
  card_number?: string;
  card_holder?: string;
  card_expiry?: string;
  card_cvv?: string;
}
