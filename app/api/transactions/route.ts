import { transactions } from "../../../db/schema";
import {
  badRequest,
  requireApiUser,
  serverError,
  unauthorized,
  userOwnsCategory,
} from "../../lib/api-user";

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

    if (!categoryId || !Number.isInteger(amountCents) || amountCents <= 0) {
      return badRequest("Вкажіть категорію та суму більше нуля.");
    }
    if (!description || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return badRequest("Вкажіть опис і коректну дату.");
    }

    const category = await userOwnsCategory(context.authUser.userId, categoryId);
    if (!category) return badRequest("Категорію не знайдено.");

    const [transaction] = await context.db
      .insert(transactions)
      .values({
        userId: context.authUser.userId,
        categoryId,
        type: payload.type === "income" ? "income" : category.type,
        amountCents,
        description,
        merchant: payload.merchant?.trim() ?? "",
        date,
        note: payload.note?.trim() ?? "",
      })
      .returning();

    return Response.json({ transaction }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
