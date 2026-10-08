import { describe, expect, it } from "vitest";
import { createOrderSchema, loginSchema } from "@/lib/validation";

describe("request validation", () => {
  it("normalizes login emails", () => {
    expect(loginSchema.parse({ email: "ADMIN@Commerce.Local", password: "CommerceDemo!2026" }).email).toBe("admin@commerce.local");
  });

  it("rejects duplicate product lines", () => {
    const result = createOrderSchema.safeParse({ orderNumber: "ORD-2026", customerId: "customer-123", items: [{ productId: "product-123", quantity: 1 }, { productId: "product-123", quantity: 2 }] });
    expect(result.success).toBe(false);
  });
});
