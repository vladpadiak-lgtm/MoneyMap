import { and, eq } from "drizzle-orm";
import { goals } from "../../../../db/schema";
import { badRequest, requireApiUser, serverError, unauthorized } from "../../../lib/api-user";
import { isNonNegativeMoney } from "../../../lib/validation";

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
    if (!Number.isSafeInteger(goalId) || goalId <= 0 || !isNonNegativeMoney(currentCents)) {
      return badRequest("Некоректна сума поповнення.");
    }

    const [existing] = await context.db
      .select({ targetCents: goals.targetCents })
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, context.authUser.userId)))
      .limit(1);
    if (!existing) return Response.json({ error: "Не знайдено." }, { status: 404 });
    if (currentCents > existing.targetCents) {
      return badRequest("Накопичена сума не може перевищувати ціль.");
    }
    const status = currentCents >= existing.targetCents
      ? "completed" as const
      : payload.status === "paused"
        ? "paused" as const
        : "active" as const;

    const [goal] = await context.db
      .update(goals)
      .set({
        currentCents,
        status,
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
