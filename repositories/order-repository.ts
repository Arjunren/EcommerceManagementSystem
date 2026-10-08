import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { OrderRepository, ProductSnapshot, StoredOrder } from "@/types/domain";

export class PrismaOrderRepository implements OrderRepository {
  async findProducts(ids: string[]): Promise<ProductSnapshot[]> {
    const products = await db.product.findMany({ where: { id: { in: ids }, active: true } });
    return products.map((product) => ({ id: product.id, price: Number(product.price), stock: product.stock }));
  }

  async orderNumberExists(orderNumber: string): Promise<boolean> {
    return (await db.order.count({ where: { orderNumber } })) > 0;
  }

  async create(input: StoredOrder): Promise<{ id: string; orderNumber: string; total: number }> {
    const order = await db.$transaction(async (transaction) => {
      for (const item of input.items) {
        const updated = await transaction.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error("Stock changed while creating the order");
      }
      return transaction.order.create({
        data: {
          orderNumber: input.orderNumber,
          customerId: input.customerId,
          createdById: input.createdById,
          total: new Prisma.Decimal(input.total),
          items: { create: input.items.map((item) => ({ ...item, unitPrice: new Prisma.Decimal(item.unitPrice) })) },
        },
      });
    });
    return { id: order.id, orderNumber: order.orderNumber, total: Number(order.total) };
  }

  async listForUser(userId: string, canViewAll: boolean) {
    const orders = await db.order.findMany({
      where: canViewAll ? {} : { createdById: userId },
      include: { customer: { select: { name: true } }, items: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return orders.map((order) => ({
      id: order.id, orderNumber: order.orderNumber, customer: order.customer.name,
      status: order.status, total: Number(order.total), itemCount: order.items.length,
    }));
  }
}
