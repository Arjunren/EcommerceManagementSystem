import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { commercePrisma?: PrismaClient };

function createClient() {
  // Prisma is instantiated while Next.js inspects route modules during builds.
  // The non-secret fallback is never queried and keeps environment-free builds deterministic.
  const connectionString = process.env.DATABASE_URL ?? "postgresql://invalid:invalid@127.0.0.1:5432/invalid";
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const db = globalForPrisma.commercePrisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.commercePrisma = db;
