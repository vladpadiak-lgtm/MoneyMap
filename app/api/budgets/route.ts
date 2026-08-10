import { budgets } from "../../../db/schema";
import {
  badRequest,
  requireApiUser,
  serverError,
  unauthorized,
  userOwnsCategory,
} from "../../lib/api-user";

export async function POST(request: Request) {
  try {
    const context = await requireApiUser();
    if (!context) return unauthorized();
    const payload = (await request.json()) as {
      categoryId?: number;
      month?: string;
      limitCents?: number;
    };
    const categoryId = Number(payload.categoryId);
    const limitCents = Math.round(Number(payload.limitCents));
    const month = payload.month?.trim() ?? "";
    const category = await userOwnsCategory(context.authUser.userId, categoryId);

    if (!category || category.type !== "expense" || limitCents <= 0 || !/^\d{4}-\d{2}$/.test(month)) {
      return badRequest("Перевірте категорію, місяць і ліміт бюджету.");
    }

    const [budget] = await context.db
      .insert(budgets)
      .values({
        userId: context.authUser.userId,
        categoryId,
        month,
        limitCents,
      })
      .onConflictDoUpdate({
        target: [budgets.userId, budgets.categoryId, budgets.month],
        set: { limitCents, updatedAt: new Date().toISOString() },
      })
      .returning();
    return Response.json({ budget }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
