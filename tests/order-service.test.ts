import { describe, expect, it } from "vitest";
import { HttpError } from "@/lib/http";
import { createOrder } from "@/services/order-service";
import type { OrderRepository, StoredOrder } from "@/types/domain";

function repository(overrides: Partial<OrderRepository> = {}): OrderRepository {
  return {
    orderNumberExists: async () => false,
    findProducts: async () => [{ id: "product-123", price: 12.5, stock: 10 }],
    create: async (input: StoredOrder) => ({ id: "order-123", orderNumber: input.orderNumber, total: input.total }),
    ...overrides,
  };
}

describe("createOrder", () => {
  it("calculates a trusted total from stored product prices", async () => {
    const result = await createOrder(repository(), { orderNumber: "ORD-2000", customerId: "customer-123", items: [{ productId: "product-123", quantity: 3 }] }, "user-123");
    expect(result.total).toBe(37.5);
  });

  it("rejects duplicate order numbers", async () => {
    const action = createOrder(repository({ orderNumberExists: async () => true }), { orderNumber: "ORD-2000", customerId: "customer-123", items: [{ productId: "product-123", quantity: 1 }] }, "user-123");
    await expect(action).rejects.toMatchObject<Partial<HttpError>>({ status: 409 });
  });

  it("rejects quantities greater than available stock", async () => {
    const action = createOrder(repository(), { orderNumber: "ORD-2000", customerId: "customer-123", items: [{ productId: "product-123", quantity: 11 }] }, "user-123");
    await expect(action).rejects.toMatchObject<Partial<HttpError>>({ status: 422 });
  });
});
