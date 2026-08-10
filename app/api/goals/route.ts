import { goals } from "../../../db/schema";
import { badRequest, requireApiUser, serverError, unauthorized } from "../../lib/api-user";

export async function POST(request: Request) {
  try {
    const context = await requireApiUser();
    if (!context) return unauthorized();
    const payload = (await request.json()) as {
      name?: string;
      targetCents?: number;
      currentCents?: number;
      deadline?: string;
      color?: string;
      icon?: string;
    };
    const name = payload.name?.trim() ?? "";
    const targetCents = Math.round(Number(payload.targetCents));
    const currentCents = Math.max(0, Math.round(Number(payload.currentCents ?? 0)));
    const deadline = payload.deadline?.trim() ?? "";
    if (!name || targetCents <= 0 || currentCents > targetCents || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      return badRequest("Перевірте назву, суму та дедлайн цілі.");
    }

    const [goal] = await context.db
      .insert(goals)
      .values({
        userId: context.authUser.userId,
        name,
        targetCents,
        currentCents,
        deadline,
        color: payload.color ?? "#C7F34A",
        icon: payload.icon ?? "target",
      })
      .returning();
    return Response.json({ goal }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
