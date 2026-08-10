import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    currency: text("currency").notNull().default("EUR"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("idx_users_email").on(table.email)],
);

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    color: text("color").notNull().default("#C7F34A"),
    icon: text("icon").notNull().default("circle"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_categories_user_name_type").on(
      table.userId,
      table.name,
      table.type,
    ),
    index("idx_categories_user_type").on(table.userId, table.type),
  ],
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    amountCents: integer("amount_cents").notNull(),
    description: text("description").notNull(),
    merchant: text("merchant").notNull().default(""),
    date: text("date").notNull(),
    note: text("note").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_transactions_user_date").on(table.userId, table.date),
    index("idx_transactions_user_category_date").on(
      table.userId,
      table.categoryId,
      table.date,
    ),
  ],
);

export const budgets = sqliteTable(
  "budgets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    month: text("month").notNull(),
    limitCents: integer("limit_cents").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_budgets_user_category_month").on(
      table.userId,
      table.categoryId,
      table.month,
    ),
    index("idx_budgets_user_month").on(table.userId, table.month),
  ],
);

export const goals = sqliteTable(
  "goals",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    targetCents: integer("target_cents").notNull(),
    currentCents: integer("current_cents").notNull().default(0),
    deadline: text("deadline").notNull(),
    color: text("color").notNull().default("#C7F34A"),
    icon: text("icon").notNull().default("target"),
    status: text("status", { enum: ["active", "completed", "paused"] })
      .notNull()
      .default("active"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_goals_user_status_deadline").on(
      table.userId,
      table.status,
      table.deadline,
    ),
  ],
);
