import assert from "node:assert/strict";
import test from "node:test";

import { createEmptyState, migrateSavedState, STATE_VERSION } from "../pages-state.js";

const profile = {
  name: "",
  email: "",
  registered: false,
  passwordSalt: "",
  passwordHash: "",
};
const categories = [{ id: 1, name: "Зарплата", type: "income" }];
const transactionSeed = [{ id: 10, categoryId: 1, type: "income", amountCents: 10000, description: "Демо", merchant: "Demo", date: "2026-08-01", note: "" }];
const budgetSeed = [{ id: 20, categoryId: 1, month: "2026-08", limitCents: 50000 }];
const goalSeed = [{ id: 30, name: "Демо-ціль", targetCents: 100000, currentCents: 10000, deadline: "2027-01-01", color: "#ffffff", icon: "◎", status: "active" }];

function migrationOptions() {
  return {
    emptyState: createEmptyState(profile, categories),
    transactionSeed,
    budgetSeed,
    goalSeed,
  };
}

test("creates a completely empty financial account", () => {
  const state = createEmptyState({ ...profile, name: "Олена", registered: true }, categories);

  assert.equal(state.dataVersion, STATE_VERSION);
  assert.equal(state.profile.name, "Олена");
  assert.deepEqual(state.transactions, []);
  assert.deepEqual(state.budgets, []);
  assert.deepEqual(state.goals, []);
  assert.notEqual(state.categories, categories);
});

test("does not expose demo data to an unregistered visitor", () => {
  const migrated = migrateSavedState({
    profile,
    categories,
    transactions: transactionSeed,
    budgets: budgetSeed,
    goals: goalSeed,
  }, migrationOptions());

  assert.deepEqual(migrated.transactions, []);
  assert.deepEqual(migrated.budgets, []);
  assert.deepEqual(migrated.goals, []);
});

test("removes legacy demo rows while preserving real user entries", () => {
  const userTransaction = { ...transactionSeed[0], id: 11, description: "Моя зарплата" };
  const userBudget = { ...budgetSeed[0], id: 21, limitCents: 75000 };
  const userGoal = { ...goalSeed[0], id: 31, name: "Моя ціль" };
  const migrated = migrateSavedState({
    profile: { ...profile, name: "Олена", registered: true },
    categories,
    transactions: [...transactionSeed, userTransaction],
    budgets: [...budgetSeed, userBudget],
    goals: [...goalSeed, userGoal],
  }, migrationOptions());

  assert.deepEqual(migrated.transactions, [userTransaction]);
  assert.deepEqual(migrated.budgets, [userBudget]);
  assert.deepEqual(migrated.goals, [userGoal]);
  assert.equal(migrated.profile.name, "Олена");
});
