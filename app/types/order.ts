import { Rider } from "./user";

export type OrderItem = {
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  order_id: string;
  notes?: string;
  items: OrderItem[];
  items_total: number;
  status: string;
  created_at: string;
  created_at_human: string;

  // Additional fields
  rider: Rider | null;

  receipient_name?: string;
  phone_number?: string;
  address?: string;
  email?: string
};