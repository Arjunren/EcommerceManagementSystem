import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
});

export const createOrderSchema = z.object({
  orderNumber: z.string().trim().regex(/^ORD-[0-9]{4,10}$/),
  customerId: z.string().min(10).max(64),
  items: z.array(z.object({
    productId: z.string().min(10).max(64),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50).refine((items) => new Set(items.map((item) => item.productId)).size === items.length, "Products must be unique"),
});
