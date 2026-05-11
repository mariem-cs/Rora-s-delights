export type Locale = "fr" | "ar";

export type Product = {
  id: string;
  slug: string;
  name: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  price: number; // in TND
  image: string; // /public path or remote
  category: string;
  tags?: string[];
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type WishlistItem = {
  productId: string;
  addedAt: string;
};

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  locale: Locale;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  totals: {
    items: number;
    grandTotal: number;
  };
};

