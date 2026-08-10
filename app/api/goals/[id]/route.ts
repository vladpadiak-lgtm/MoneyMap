import { and, eq } from "drizzle-orm";
import { goals } from "../../../../db/schema";
import { badRequest, requireApiUser, serverError, unauthorized } from "../../../lib/api-user";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await requireApiUser();
    if (!context) return unauthorized();
    const { id } = await params;
    const goalId = Number(id);
    const payload = (await request.json()) as {
      currentCents?: number;
      status?: "active" | "completed" | "paused";
    };
    const currentCents = Math.max(0, Math.round(Number(payload.currentCents)));
    if (!goalId || !Number.isFinite(currentCents)) {
      return badRequest("Некоректна сума поповнення.");
    }

    const [goal] = await context.db
      .update(goals)
      .set({
        currentCents,
        status: payload.status,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(goals.id, goalId), eq(goals.userId, context.authUser.userId)))
      .returning();
    if (!goal) return Response.json({ error: "Не знайдено." }, { status: 404 });
    return Response.json({ goal });
  } catch (error) {
    return serverError(error);
  }
}
