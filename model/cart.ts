export type CartItem = { productId: number; quantity: number };

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
};