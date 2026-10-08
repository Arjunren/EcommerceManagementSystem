import { Role } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { createOrderSchema } from "@/lib/validation";
import { PrismaOrderRepository } from "@/repositories/order-repository";
import { createOrder } from "@/services/order-service";

const repository = new PrismaOrderRepository();

export async function GET() {
  try {
    const user = await requireUser();
    const canViewAll = user.role === Role.ADMIN || user.role === Role.MANAGER;
    return Response.json({ orders: await repository.listForUser(user.id, canViewAll) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser([Role.ADMIN, Role.MANAGER, Role.STAFF]);
    const input = createOrderSchema.parse(await request.json());
    const order = await createOrder(repository, input, user.id);
    return Response.json({ order }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
