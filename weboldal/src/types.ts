export interface Ingredient {
  item: string;
  quantity: number;
  unit?: string;
}

export interface Product {
  id: number;
  name: string;
  type: number;
  price: number;
  note: string;
  image: string;
  ingredients: Ingredient[];
}

export interface OrderProduct {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: number | string;
  transaction?: { cashier?: string; tip?: number; amount?: number } | null;
  products?: OrderProduct[];
}
