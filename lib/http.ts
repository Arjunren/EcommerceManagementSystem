import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Unhandled request error", error);
  return Response.json({ error: "Unexpected server error" }, { status: 500 });
}
