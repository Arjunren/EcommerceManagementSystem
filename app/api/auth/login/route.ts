import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, HttpError } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: input.email } });
    if (!user || !user.active || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password");
    }
    await createSession(user.id);
    return Response.json({ user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    return errorResponse(error);
  }
}
