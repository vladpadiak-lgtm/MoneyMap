import { desc, eq } from "drizzle-orm";
import { budgets, categories, goals, transactions, users } from "../../../db/schema";
import { requireApiUser, serverError, unauthorized } from "../../lib/api-user";

export async function GET() {
  try {
    const context = await requireApiUser();
    if (!context) return unauthorized();
    const { authUser, db } = context;

    const [profile, categoryRows, transactionRows, budgetRows, goalRows] =
      await Promise.all([
        db.select().from(users).where(eq(users.id, authUser.userId)).limit(1),
        db
          .select()
          .from(categories)
          .where(eq(categories.userId, authUser.userId))
          .orderBy(categories.type, categories.name),
        db
          .select()
          .from(transactions)
          .where(eq(transactions.userId, authUser.userId))
          .orderBy(desc(transactions.date), desc(transactions.id))
          .limit(500),
        db
          .select()
          .from(budgets)
          .where(eq(budgets.userId, authUser.userId))
          .orderBy(desc(budgets.month)),
        db
          .select()
          .from(goals)
          .where(eq(goals.userId, authUser.userId))
          .orderBy(goals.status, goals.deadline),
      ]);

    return Response.json({
      user: profile[0],
      categories: categoryRows,
      transactions: transactionRows,
      budgets: budgetRows,
      goals: goalRows,
    });
  } catch (error) {
    return serverError(error);
  }
}
