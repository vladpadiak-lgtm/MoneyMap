import { goals } from "../../../db/schema";
import { badRequest, requireApiUser, serverError, unauthorized } from "../../lib/api-user";
import {
  isHexColor,
  isIsoDate,
  isNonNegativeMoney,
  isPositiveMoney,
  isTextWithin,
} from "../../lib/validation";

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
    const color = payload.color?.trim() ?? "#C7F34A";
    const icon = payload.icon?.trim() ?? "target";
    if (
      !isTextWithin(name, 120) ||
      !isPositiveMoney(targetCents) ||
      !isNonNegativeMoney(currentCents) ||
      currentCents > targetCents ||
      !isIsoDate(deadline) ||
      !isHexColor(color) ||
      !isTextWithin(icon, 40)
    ) {
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
        color,
        icon,
        status: currentCents >= targetCents ? "completed" : "active",
      })
      .returning();
    return Response.json({ goal }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
