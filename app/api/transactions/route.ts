import { transactions } from "../../../db/schema";
import {
  badRequest,
  requireApiUser,
  serverError,
  unauthorized,
  userOwnsCategory,
} from "../../lib/api-user";
import {
  isIsoDate,
  isOptionalTextWithin,
  isPositiveMoney,
  isTextWithin,
} from "../../lib/validation";

type TransactionPayload = {
  categoryId?: number;
  type?: "income" | "expense";
  amountCents?: number;
  description?: string;
  merchant?: string;
  date?: string;
  note?: string;
};

export async function POST(request: Request) {
  try {
    const context = await requireApiUser();
    if (!context) return unauthorized();
    const payload = (await request.json()) as TransactionPayload;
    const categoryId = Number(payload.categoryId);
    const amountCents = Math.round(Number(payload.amountCents));
    const description = payload.description?.trim() ?? "";
    const date = payload.date?.trim() ?? "";
    const merchant = payload.merchant?.trim() ?? "";
    const note = payload.note?.trim() ?? "";

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0 || !isPositiveMoney(amountCents)) {
      return badRequest("Вкажіть категорію та суму більше нуля.");
    }
    if (
      !isTextWithin(description, 160) ||
      !isIsoDate(date) ||
      !isOptionalTextWithin(merchant, 120) ||
      !isOptionalTextWithin(note, 500)
    ) {
      return badRequest("Вкажіть опис і коректну дату.");
    }

    const category = await userOwnsCategory(context.authUser.userId, categoryId);
    if (!category) return badRequest("Категорію не знайдено.");
    if (payload.type && payload.type !== category.type) {
      return badRequest("Тип транзакції не відповідає категорії.");
    }

    const [transaction] = await context.db
      .insert(transactions)
      .values({
        userId: context.authUser.userId,
        categoryId,
        type: category.type,
        amountCents,
        description,
        merchant,
        date,
        note,
      })
      .returning();

    return Response.json({ transaction }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
