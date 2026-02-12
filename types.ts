
export type MetalType = 'silver' | 'gold' | 'platinum';

export interface MetalPrice {
  metal: MetalType;
  purity: string;
  pricePerGram: number;
  updatedAt: string;
}

export interface ProductCharges {
  makingCharge: number;
  wastagePercent: number;
  packagingCharge: number;
  gstPercent: number;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  _id?: string; // Added to resolve MongoDB compatibility issues
  name: string;
  description: string;
  category: string;
  metal: MetalType;
  purity: string;
  totalGrams: number;
  stock: number; // Added stock field
  images: ProductImage[];
  charges: ProductCharges;
  isActive: boolean;
  createdAt: string;
}

export interface CalculatedPrice {
  basePrice: number;
  wastage: number;
  subtotal: number;
  gst: number;
  finalPrice: number;
}

export interface ProductWithPrice extends Product {
  pricing: CalculatedPrice;
}

export interface CartItem extends ProductWithPrice {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Packed' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}