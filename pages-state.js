export const STATE_VERSION = 2;

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createEmptyState(profile, categories) {
  return {
    dataVersion: STATE_VERSION,
    profile: copy(profile),
    categories: copy(categories),
    transactions: [],
    budgets: [],
    goals: [],
  };
}

function matchesSeed(row, seed, fields) {
  return fields.every((field) => row?.[field] === seed?.[field]);
}

function removeSeedRows(rows, seeds, fields) {
  return rows.filter((row) => !seeds.some((seed) => matchesSeed(row, seed, fields)));
}

export function migrateSavedState(saved, options) {
  const {
    emptyState,
    transactionSeed,
    budgetSeed,
    goalSeed,
  } = options;

  if (
    !saved ||
    !Array.isArray(saved.transactions) ||
    !Array.isArray(saved.categories) ||
    !Array.isArray(saved.budgets) ||
    !Array.isArray(saved.goals)
  ) {
    return copy(emptyState);
  }

  const normalized = {
    ...copy(emptyState),
    ...saved,
    dataVersion: STATE_VERSION,
    profile: { ...emptyState.profile, ...saved.profile },
    categories: copy(saved.categories),
    transactions: copy(saved.transactions),
    budgets: copy(saved.budgets),
    goals: copy(saved.goals),
  };

  if (saved.dataVersion === STATE_VERSION) return normalized;
  if (!normalized.profile.registered) return copy(emptyState);

  normalized.transactions = removeSeedRows(
    normalized.transactions,
    transactionSeed,
    ["id", "categoryId", "type", "amountCents", "description", "merchant", "date", "note"],
  ).filter(
    (row) => !(row.merchant === "QA Store" && String(row.description).startsWith("Аудитова покупка")),
  );
  normalized.budgets = removeSeedRows(
    normalized.budgets,
    budgetSeed,
    ["id", "categoryId", "limitCents"],
  );
  normalized.goals = removeSeedRows(
    normalized.goals,
    goalSeed,
    ["id", "name", "targetCents", "currentCents", "deadline", "color", "icon", "status"],
  ).filter((row) => row.name !== "Аудитова ціль");

  return normalized;
}
