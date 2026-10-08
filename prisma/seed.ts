import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, OrderStatus } from "../generated/prisma/client";
import { hashPassword } from "../lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "postgresql://commerce:commerce@localhost:5432/commerce" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hashPassword("CommerceDemo!2026");
  const admin = await prisma.user.upsert({
    where: { email: "admin@commerce.local" },
    update: { passwordHash, active: true },
    create: { name: "Arjun Rao", email: "admin@commerce.local", passwordHash, role: Role.ADMIN },
  });
  const manager = await prisma.user.upsert({
    where: { email: "manager@commerce.local" },
    update: { passwordHash, active: true },
    create: { name: "Maya Chen", email: "manager@commerce.local", passwordHash, role: Role.MANAGER },
  });

  const products = await Promise.all([
    ["AUD-HDP-01", "Studio Wireless Headphones", "Audio", 149.9, 42],
    ["WRK-DSK-02", "Oak Standing Desk", "Workspace", 529, 8],
    ["LGT-LMP-03", "Halo Task Lamp", "Lighting", 79.5, 3],
  ].map(([sku, name, category, price, stock]) => prisma.product.upsert({
    where: { sku: String(sku) },
    update: {},
    create: { sku: String(sku), name: String(name), category: String(category), price: Number(price), stock: Number(stock), reorderAt: 6 },
  })));

  const customer = await prisma.customer.upsert({
    where: { email: "riley@example.com" },
    update: {},
    create: { name: "Riley Morgan", email: "riley@example.com", phone: "+1 555 0142" },
  });

  await prisma.order.upsert({
    where: { orderNumber: "ORD-1048" },
    update: {},
    create: {
      orderNumber: "ORD-1048", customerId: customer.id, createdById: manager.id,
      status: OrderStatus.PROCESSING, total: 299.8,
      items: { create: [{ productId: products[0].id, quantity: 2, unitPrice: 149.9 }] },
    },
  });
  console.log(`Seeded admin ${admin.email}`);
}

main().finally(() => prisma.$disconnect());
