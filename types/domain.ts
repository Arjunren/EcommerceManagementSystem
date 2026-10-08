export type OrderLineInput = { productId: string; quantity: number };
export type ProductSnapshot = { id: string; price: number; stock: number };
export type StoredOrder = {
  orderNumber: string;
  customerId: string;
  createdById: string;
  total: number;
  items: Array<OrderLineInput & { unitPrice: number }>;
};

export interface OrderRepository {
  findProducts(ids: string[]): Promise<ProductSnapshot[]>;
  orderNumberExists(orderNumber: string): Promise<boolean>;
  create(input: StoredOrder): Promise<{ id: string; orderNumber: string; total: number }>;
}
