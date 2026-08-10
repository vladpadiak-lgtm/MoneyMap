import { transactions } from "../../../../db/schema";
import {
  badRequest,
  requireApiUser,
  serverError,
  unauthorized,
  userOwnsCategory,
} from "../../../lib/api-user";

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

    const values = [];
    for (const row of rows) {
      const category = await userOwnsCategory(context.authUser.userId, Number(row.categoryId));
      const amountCents = Math.round(Number(row.amountCents));
      if (
        !category ||
        amountCents <= 0 ||
        !row.description?.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(row.date)
      ) {
        return badRequest("Один або кілька рядків CSV мають некоректні дані.");
      }
      values.push({
        userId: context.authUser.userId,
        categoryId: Number(row.categoryId),
        type: row.type === "income" ? "income" as const : category.type,
        amountCents,
        description: row.description.trim(),
        merchant: row.merchant?.trim() ?? "",
        date: row.date,
        note: row.note?.trim() ?? "",
      });
    }

    const imported = await context.db.insert(transactions).values(values).returning();
    return Response.json({ transactions: imported }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
