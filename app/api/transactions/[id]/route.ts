import { and, eq } from "drizzle-orm";
import { transactions } from "../../../../db/schema";
import {
  badRequest,
  requireApiUser,
  serverError,
  unauthorized,
  userOwnsCategory,
} from "../../../lib/api-user";

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

    if (!transactionId || !categoryId || amountCents <= 0 || !description) {
      return badRequest("Перевірте обов’язкові поля транзакції.");
    }
    const category = await userOwnsCategory(context.authUser.userId, categoryId);
    if (!category) return badRequest("Категорію не знайдено.");

    const [transaction] = await context.db
      .update(transactions)
      .set({
        categoryId,
        type: payload.type === "income" ? "income" : category.type,
        amountCents,
        description,
        merchant: payload.merchant?.trim() ?? "",
        date,
        note: payload.note?.trim() ?? "",
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
