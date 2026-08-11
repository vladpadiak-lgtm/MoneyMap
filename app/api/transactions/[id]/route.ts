import { and, eq } from "drizzle-orm";
import { transactions } from "../../../../db/schema";
import {
  badRequest,
  requireApiUser,
  serverError,
  unauthorized,
  userOwnsCategory,
} from "../../../lib/api-user";
import {
  isIsoDate,
  isOptionalTextWithin,
  isPositiveMoney,
  isTextWithin,
} from "../../../lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await requireApiUser();
    if (!context) return unauthorized();
    const { id } = await params;
    const transactionId = Number(id);
    const payload = (await request.json()) as {
      categoryId?: number;
      type?: "income" | "expense";
      amountCents?: number;
      description?: string;
      merchant?: string;
      date?: string;
      note?: string;
    };
    const categoryId = Number(payload.categoryId);
    const amountCents = Math.round(Number(payload.amountCents));
    const description = payload.description?.trim() ?? "";
    const date = payload.date?.trim() ?? "";
    const merchant = payload.merchant?.trim() ?? "";
    const note = payload.note?.trim() ?? "";

    if (
      !Number.isSafeInteger(transactionId) ||
      transactionId <= 0 ||
      !Number.isSafeInteger(categoryId) ||
      categoryId <= 0 ||
      !isPositiveMoney(amountCents) ||
      !isTextWithin(description, 160) ||
      !isIsoDate(date) ||
      !isOptionalTextWithin(merchant, 120) ||
      !isOptionalTextWithin(note, 500)
    ) {
      return badRequest("Перевірте обов’язкові поля транзакції.");
    }
    const category = await userOwnsCategory(context.authUser.userId, categoryId);
    if (!category) return badRequest("Категорію не знайдено.");
    if (payload.type && payload.type !== category.type) {
      return badRequest("Тип транзакції не відповідає категорії.");
    }

    const [transaction] = await context.db
      .update(transactions)
      .set({
        categoryId,
        type: category.type,
        amountCents,
        description,
        merchant,
        date,
        note,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, context.authUser.userId),
        ),
      )
      .returning();

    if (!transaction) return Response.json({ error: "Не знайдено." }, { status: 404 });
    return Response.json({ transaction });
  } catch (error) {
    return serverError(error);
  }
}
