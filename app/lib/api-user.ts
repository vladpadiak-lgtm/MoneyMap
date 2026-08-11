import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { categories, users } from "../../db/schema";
import { getChatGPTUser } from "../chatgpt-auth";

const DEFAULT_CATEGORIES = [
  { name: "Зарплата", type: "income" as const, color: "#7BC96F", icon: "briefcase" },
  { name: "Фриланс", type: "income" as const, color: "#A7D8FF", icon: "spark" },
  { name: "Житло", type: "expense" as const, color: "#F5A782", icon: "home" },
  { name: "Продукти", type: "expense" as const, color: "#C7F34A", icon: "basket" },
  { name: "Транспорт", type: "expense" as const, color: "#A7D8FF", icon: "car" },
  { name: "Дозвілля", type: "expense" as const, color: "#B8A8E8", icon: "ticket" },
  { name: "Здоров’я", type: "expense" as const, color: "#F6C96B", icon: "heart" },
  { name: "Інше", type: "expense" as const, color: "#B8B8AE", icon: "dots" },
];

export async function requireApiUser() {
  const authUser = await getChatGPTUser();
  if (!authUser) return null;

  const db = getDb();
  await db
    .insert(users)
    .values({
      id: authUser.userId,
      email: authUser.email,
      displayName: authUser.displayName,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: authUser.email,
        displayName: authUser.displayName,
        updatedAt: new Date().toISOString(),
      },
    });

  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.userId, authUser.userId))
    .limit(1);

  if (existing.length === 0) {
    await db
      .insert(categories)
      .values(
        DEFAULT_CATEGORIES.map((category) => ({
          ...category,
          userId: authUser.userId,
        })),
      )
      .onConflictDoNothing();
  }

  return { authUser, db };
}

export async function userOwnsCategory(userId: string, categoryId: number) {
  const db = getDb();
  const row = await db
    .select({ id: categories.id, type: categories.type })
    .from(categories)
    .where(and(eq(categories.userId, userId), eq(categories.id, categoryId)))
    .limit(1);
  return row[0] ?? null;
}

export function unauthorized() {
  return Response.json({ error: "Потрібно увійти в акаунт." }, { status: 401 });
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export function serverError(error: unknown) {
  void error;
  return Response.json({ error: "Не вдалося обробити запит." }, { status: 500 });
}
