import { eq } from "drizzle-orm";
import { categories, transactions } from "../../../../db/schema";
import {
  badRequest,
  requireApiUser,
  serverError,
  unauthorized,
} from "../../../lib/api-user";
import {
  isIsoDate,
  isOptionalTextWithin,
  isPositiveMoney,
  isTextWithin,
} from "../../../lib/validation";

export async function POST(request: Request) {
  try {
    const context = await requireApiUser();
    if (!context) return unauthorized();
    const payload = (await request.json()) as {
      transactions?: Array<{
        categoryId: number;
        type: "income" | "expense";
        amountCents: number;
        description: string;
        merchant?: string;
        date: string;
        note?: string;
      }>;
    };
    const rows = payload.transactions ?? [];
    if (rows.length === 0 || rows.length > 500) {
      return badRequest("CSV має містити від 1 до 500 рядків.");
    }

    const categoryRows = await context.db
      .select({ id: categories.id, type: categories.type })
      .from(categories)
      .where(eq(categories.userId, context.authUser.userId));
    const categoryMap = new Map(categoryRows.map((category) => [category.id, category]));
    const values = [];
    for (const row of rows) {
      const categoryId = Number(row.categoryId);
      const category = categoryMap.get(categoryId);
      const amountCents = Math.round(Number(row.amountCents));
      const description = row.description?.trim() ?? "";
      const merchant = row.merchant?.trim() ?? "";
      const note = row.note?.trim() ?? "";
      if (
        !category ||
        row.type !== category.type ||
        !isPositiveMoney(amountCents) ||
        !isTextWithin(description, 160) ||
        !isIsoDate(row.date) ||
        !isOptionalTextWithin(merchant, 120) ||
        !isOptionalTextWithin(note, 500)
      ) {
        return badRequest("Один або кілька рядків CSV мають некоректні дані.");
      }
      values.push({
        userId: context.authUser.userId,
        categoryId,
        type: category.type,
        amountCents,
        description,
        merchant,
        date: row.date,
        note,
      });
    }

    const imported = await context.db.insert(transactions).values(values).returning();
    return Response.json({ transactions: imported }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
