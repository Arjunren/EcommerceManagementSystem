import { HttpError } from "@/lib/http";
import type { OrderLineInput, OrderRepository } from "@/types/domain";

export async function createOrder(
  repository: OrderRepository,
  input: { orderNumber: string; customerId: string; items: OrderLineInput[] },
  actorId: string,
) {
  if (await repository.orderNumberExists(input.orderNumber)) throw new HttpError(409, "Order number already exists");
  const products = await repository.findProducts(input.items.map((item) => item.productId));
  if (products.length !== input.items.length) throw new HttpError(404, "One or more products were not found");
  const productsById = new Map(products.map((product) => [product.id, product]));
  const items = input.items.map((item) => {
    const product = productsById.get(item.productId)!;
    if (product.stock < item.quantity) throw new HttpError(422, `Insufficient stock for product ${item.productId}`);
    return { ...item, unitPrice: product.price };
  });
  const total = Number(items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2));
  return repository.create({ ...input, items, total, createdById: actorId });
}
