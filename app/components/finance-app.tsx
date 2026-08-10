"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export type ViewName = "dashboard" | "transactions" | "budgets" | "goals";

type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
};

type Transaction = {
  id: number;
  categoryId: number;
  type: "income" | "expense";
  amountCents: number;
  description: string;
  merchant: string;
  date: string;
  note: string;
};

type Budget = {
  id: number;
  categoryId: number;
  month: string;
  limitCents: number;
};

type Goal = {
  id: number;
  name: string;
  targetCents: number;
  currentCents: number;
  deadline: string;
  color: string;
  icon: string;
  status: "active" | "completed" | "paused";
};

type FinanceData = {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
};

type UserSummary = {
  displayName: string;
  email: string;
};

const CURRENT_MONTH = "2026-08";

const DEMO_DATA: FinanceData = {
  categories: [
    { id: 1, name: "Зарплата", type: "income", color: "#7BC96F", icon: "briefcase" },
    { id: 2, name: "Фриланс", type: "income", color: "#A7D8FF", icon: "spark" },
    { id: 3, name: "Житло", type: "expense", color: "#F5A782", icon: "home" },
    { id: 4, name: "Продукти", type: "expense", color: "#C7F34A", icon: "basket" },
    { id: 5, name: "Транспорт", type: "expense", color: "#A7D8FF", icon: "car" },
    { id: 6, name: "Дозвілля", type: "expense", color: "#B8A8E8", icon: "ticket" },
    { id: 7, name: "Здоров’я", type: "expense", color: "#F6C96B", icon: "heart" },
    { id: 8, name: "Інше", type: "expense", color: "#B8B8AE", icon: "dots" },
  ],
  transactions: [
    { id: 101, categoryId: 1, type: "income", amountCents: 320000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-08-05", note: "" },
    { id: 102, categoryId: 4, type: "expense", amountCents: 8640, description: "Продукти на тиждень", merchant: "Yeme", date: "2026-08-09", note: "" },
    { id: 103, categoryId: 3, type: "expense", amountCents: 89000, description: "Оренда квартири", merchant: "Оренда", date: "2026-08-02", note: "" },
    { id: 104, categoryId: 5, type: "expense", amountCents: 4560, description: "Проїзний", merchant: "IDS BK", date: "2026-08-03", note: "" },
    { id: 105, categoryId: 6, type: "expense", amountCents: 2890, description: "Кіно", merchant: "Cinema City", date: "2026-08-08", note: "" },
    { id: 106, categoryId: 2, type: "income", amountCents: 78000, description: "Дизайн лендингу", merchant: "Freelance", date: "2026-07-28", note: "" },
    { id: 107, categoryId: 4, type: "expense", amountCents: 25830, description: "Продукти", merchant: "Billa", date: "2026-07-22", note: "" },
    { id: 108, categoryId: 3, type: "expense", amountCents: 89000, description: "Оренда квартири", merchant: "Оренда", date: "2026-07-02", note: "" },
    { id: 109, categoryId: 1, type: "income", amountCents: 320000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-07-05", note: "" },
    { id: 110, categoryId: 1, type: "income", amountCents: 310000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-06-05", note: "" },
    { id: 111, categoryId: 3, type: "expense", amountCents: 89000, description: "Оренда квартири", merchant: "Оренда", date: "2026-06-02", note: "" },
    { id: 112, categoryId: 4, type: "expense", amountCents: 34200, description: "Продукти", merchant: "Tesco", date: "2026-06-18", note: "" },
    { id: 113, categoryId: 1, type: "income", amountCents: 300000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-05-05", note: "" },
    { id: 114, categoryId: 3, type: "expense", amountCents: 87000, description: "Оренда квартири", merchant: "Оренда", date: "2026-05-02", note: "" },
    { id: 115, categoryId: 1, type: "income", amountCents: 300000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-04-05", note: "" },
    { id: 116, categoryId: 4, type: "expense", amountCents: 31800, description: "Продукти", merchant: "Kaufland", date: "2026-04-16", note: "" },
    { id: 117, categoryId: 1, type: "income", amountCents: 290000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-03-05", note: "" },
    { id: 118, categoryId: 3, type: "expense", amountCents: 87000, description: "Оренда квартири", merchant: "Оренда", date: "2026-03-02", note: "" },
  ],
  budgets: [
    { id: 201, categoryId: 4, month: CURRENT_MONTH, limitCents: 45000 },
    { id: 202, categoryId: 5, month: CURRENT_MONTH, limitCents: 15000 },
    { id: 203, categoryId: 6, month: CURRENT_MONTH, limitCents: 20000 },
    { id: 204, categoryId: 7, month: CURRENT_MONTH, limitCents: 12000 },
  ],
  goals: [
    { id: 301, name: "Подушка безпеки", targetCents: 600000, currentCents: 378000, deadline: "2027-02-01", color: "#C7F34A", icon: "shield", status: "active" },
    { id: 302, name: "Подорож до Ісландії", targetCents: 280000, currentCents: 154000, deadline: "2027-06-15", color: "#A7D8FF", icon: "plane", status: "active" },
    { id: 303, name: "Новий ноутбук", targetCents: 180000, currentCents: 162000, deadline: "2026-11-30", color: "#F5A782", icon: "laptop", status: "active" },
  ],
};

const NAV_ITEMS: Array<{ view: ViewName; label: string; symbol: string }> = [
  { view: "dashboard", label: "Головна", symbol: "⌂" },
  { view: "transactions", label: "Транзакції", symbol: "↕" },
  { view: "budgets", label: "Бюджети", symbol: "◫" },
  { view: "goals", label: "Цілі", symbol: "◎" },
];

const VIEW_META: Record<ViewName, { title: string; kicker: string }> = {
  dashboard: { title: "Фінансова картина", kicker: "Огляд за серпень" },
  transactions: { title: "Транзакції", kicker: "Усі рухи коштів" },
  budgets: { title: "Бюджети", kicker: "Ліміти на серпень" },
  goals: { title: "Фінансові цілі", kicker: "Майбутнє у цифрах" },
};

function money(cents: number, compact = false) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: compact ? 0 : 2,
    minimumFractionDigits: compact ? 0 : 2,
  }).format(cents / 100);
}

function readableDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "short" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function monthLabel(value: string) {
  const formatted = new Intl.DateTimeFormat("uk-UA", { month: "short" }).format(
    new Date(`${value}-01T12:00:00`),
  );
  return formatted.replace(".", "");
}

function categoryIcon(icon: string) {
  const icons: Record<string, string> = {
    briefcase: "▣",
    spark: "✦",
    home: "⌂",
    basket: "◇",
    car: "→",
    ticket: "✣",
    heart: "+",
    dots: "•••",
    shield: "◆",
    plane: "↗",
    laptop: "▰",
    target: "◎",
  };
  return icons[icon] ?? "•";
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "Сталася помилка.");
  return payload;
}

export function FinanceApp({
  activeView,
  user,
  demo = false,
}: {
  activeView: ViewName;
  user: UserSummary;
  demo?: boolean;
}) {
  const [data, setData] = useState<FinanceData>(DEMO_DATA);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState("");
  const [transactionModal, setTransactionModal] = useState<Transaction | "new" | null>(null);
  const [budgetModal, setBudgetModal] = useState<Budget | "new" | null>(null);
  const [goalModal, setGoalModal] = useState(false);
  const [toast, setToast] = useState("");

  const loadData = async () => {
    if (demo) return;
    setLoading(true);
    setError("");
    try {
      const payload = await apiRequest<FinanceData>("/api/bootstrap");
      setData(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не вдалося завантажити дані.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (demo) return;
    let cancelled = false;
    apiRequest<FinanceData>("/api/bootstrap")
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Не вдалося завантажити дані.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [demo]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const onSavedTransaction = (transaction: Transaction, isNew: boolean) => {
    setData((current) => ({
      ...current,
      transactions: isNew
        ? [transaction, ...current.transactions]
        : current.transactions.map((item) => (item.id === transaction.id ? transaction : item)),
    }));
    setTransactionModal(null);
    setToast(isNew ? "Транзакцію додано" : "Зміни збережено");
  };

  const onSavedBudget = (budget: Budget) => {
    setData((current) => ({
      ...current,
      budgets: [
        budget,
        ...current.budgets.filter(
          (item) => !(item.categoryId === budget.categoryId && item.month === budget.month),
        ),
      ],
    }));
    setBudgetModal(null);
    setToast("Бюджет оновлено");
  };

  const onSavedGoal = (goal: Goal) => {
    setData((current) => ({ ...current, goals: [goal, ...current.goals] }));
    setGoalModal(false);
    setToast("Нову ціль створено");
  };

  if (loading) return <AppLoading activeView={activeView} user={user} />;

  return (
    <div className="app-frame">
      <Sidebar activeView={activeView} user={user} demo={demo} />
      <main className="app-main">
        {demo && (
          <div className="demo-banner">
            <span><strong>Демо-режим.</strong> Тут можна безпечно випробувати всі дії.</span>
            <a href="/register">Створити свій простір <span aria-hidden="true">→</span></a>
          </div>
        )}
        <AppHeader
          activeView={activeView}
          onAdd={() => setTransactionModal("new")}
          user={user}
        />
        {error ? (
          <EmptyState
            title="Не вдалося відкрити фінансовий простір"
            text={error}
            action="Спробувати ще раз"
            onAction={() => void loadData()}
          />
        ) : (
          <>
            {activeView === "dashboard" && (
              <DashboardView data={data} onAdd={() => setTransactionModal("new")} />
            )}
            {activeView === "transactions" && (
              <TransactionsView
                data={data}
                demo={demo}
                onAdd={() => setTransactionModal("new")}
                onEdit={setTransactionModal}
                onImported={(transactions) => {
                  setData((current) => ({
                    ...current,
                    transactions: [...transactions, ...current.transactions],
                  }));
                  setToast(`Імпортовано: ${transactions.length}`);
                }}
              />
            )}
            {activeView === "budgets" && (
              <BudgetsView
                data={data}
                onAdd={() => setBudgetModal("new")}
                onEdit={setBudgetModal}
              />
            )}
            {activeView === "goals" && (
              <GoalsView
                data={data}
                demo={demo}
                onAdd={() => setGoalModal(true)}
                onUpdate={(goal) =>
                  setData((current) => ({
                    ...current,
                    goals: current.goals.map((item) => (item.id === goal.id ? goal : item)),
                  }))
                }
                onToast={setToast}
              />
            )}
          </>
        )}
      </main>
      <MobileNav activeView={activeView} demo={demo} />
      {transactionModal && (
        <TransactionModal
          value={transactionModal}
          categories={data.categories}
          demo={demo}
          nextId={Math.max(0, ...data.transactions.map((item) => item.id)) + 1}
          onClose={() => setTransactionModal(null)}
          onSave={onSavedTransaction}
        />
      )}
      {budgetModal && (
        <BudgetModal
          value={budgetModal}
          categories={data.categories}
          demo={demo}
          nextId={Math.max(0, ...data.budgets.map((item) => item.id)) + 1}
          onClose={() => setBudgetModal(null)}
          onSave={onSavedBudget}
        />
      )}
      {goalModal && (
        <GoalModal
          demo={demo}
          nextId={Math.max(0, ...data.goals.map((item) => item.id)) + 1}
          onClose={() => setGoalModal(false)}
          onSave={onSavedGoal}
        />
      )}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? "brand-compact" : ""}`} href="/" aria-label="MoneyMap — на головну">
      <span className="brand-mark" aria-hidden="true"><i />M</span>
      {!compact && <span>MoneyMap</span>}
    </Link>
  );
}

function Sidebar({ activeView, user, demo }: { activeView: ViewName; user: UserSummary; demo: boolean }) {
  const base = demo ? "/demo" : "";
  const route = (view: ViewName) => (demo ? `${base}?view=${view}` : view === "dashboard" ? "/dashboard" : `/${view}`);
  return (
    <aside className="sidebar">
      <Logo />
      <nav className="side-nav" aria-label="Основна навігація">
        <p>Мій простір</p>
        {NAV_ITEMS.map((item) => (
          <a key={item.view} className={activeView === item.view ? "active" : ""} href={route(item.view)}>
            <span aria-hidden="true">{item.symbol}</span>{item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="money-note">
        <span>Порада дня</span>
        <p>Спочатку заплати собі — відкладай щонайменше 10% доходу.</p>
      </div>
      <div className="profile-chip">
        <span className="avatar">{user.displayName.slice(0, 1).toUpperCase()}</span>
        <span><strong>{user.displayName}</strong><small>{demo ? "Демо-профіль" : user.email}</small></span>
        {!demo && <a href="/signout-with-chatgpt?return_to=%2F" aria-label="Вийти">↗</a>}
      </div>
    </aside>
  );
}

function MobileNav({ activeView, demo }: { activeView: ViewName; demo: boolean }) {
  const route = (view: ViewName) => (demo ? `/demo?view=${view}` : view === "dashboard" ? "/dashboard" : `/${view}`);
  return (
    <nav className="mobile-nav" aria-label="Мобільна навігація">
      {NAV_ITEMS.map((item) => (
        <a key={item.view} href={route(item.view)} className={activeView === item.view ? "active" : ""}>
          <span aria-hidden="true">{item.symbol}</span><small>{item.label}</small>
        </a>
      ))}
    </nav>
  );
}

function AppHeader({ activeView, onAdd, user }: { activeView: ViewName; onAdd: () => void; user: UserSummary }) {
  return (
    <header className="app-header">
      <div className="mobile-brand"><Logo compact /></div>
      <div>
        <span className="eyebrow">{VIEW_META[activeView].kicker}</span>
        <h1>{VIEW_META[activeView].title}</h1>
      </div>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Сповіщення">•<i /></button>
        <span className="header-avatar" title={user.displayName}>{user.displayName.slice(0, 1).toUpperCase()}</span>
        <button className="button button-dark header-add" type="button" onClick={onAdd}>
          <span aria-hidden="true">＋</span> Додати транзакцію
        </button>
      </div>
    </header>
  );
}

function DashboardView({ data, onAdd }: { data: FinanceData; onAdd: () => void }) {
  const monthTransactions = data.transactions.filter((item) => item.date.startsWith(CURRENT_MONTH));
  const income = monthTransactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amountCents, 0);
  const expense = monthTransactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amountCents, 0);
  const allBalance = data.transactions.reduce((sum, item) => sum + (item.type === "income" ? item.amountCents : -item.amountCents), 0);
  const savedRate = income ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;
  const sums = new Map<number, number>();
  monthTransactions.filter((item) => item.type === "expense").forEach((item) => sums.set(item.categoryId, (sums.get(item.categoryId) ?? 0) + item.amountCents));
  const categoryRows = [...sums.entries()]
    .map(([categoryId, amount]) => ({ category: data.categories.find((item) => item.id === categoryId)!, amount }))
    .filter((item) => item.category)
    .sort((a, b) => b.amount - a.amount);
  const chart = buildMonthlyChart(data.transactions);
  const gradient = buildDonutGradient(categoryRows, expense);
  const recent = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="page-stack dashboard-page">
      <section className="balance-hero">
        <div>
          <span className="eyebrow light">Доступний баланс</span>
          <strong>{money(allBalance)}</strong>
          <p><span className="positive-pill">↑ {savedRate}%</span> ви зберігаєте цього місяця</p>
        </div>
        <div className="balance-orbit" aria-hidden="true"><i /><i /><i /></div>
        <button type="button" onClick={onAdd}>Швидкий запис <span>＋</span></button>
      </section>

      <section className="stat-grid">
        <MetricCard label="Доходи" value={money(income)} delta="+4,8%" tone="green" symbol="↙" />
        <MetricCard label="Витрати" value={money(expense)} delta="−8,2%" tone="clay" symbol="↗" />
        <MetricCard label="У цілях" value={money(data.goals.reduce((sum, goal) => sum + goal.currentCents, 0))} delta={`${data.goals.length} активні`} tone="blue" symbol="◎" />
      </section>

      <section className="dashboard-grid">
        <article className="panel cashflow-panel">
          <PanelHeading title="Грошовий потік" subtitle="Останні 6 місяців" action={<span className="legend"><i className="income-dot" />Доходи <i className="expense-dot" />Витрати</span>} />
          <div className="bar-chart" aria-label="Графік доходів і витрат за шість місяців">
            {chart.map((item) => (
              <div className="bar-column" key={item.month}>
                <div className="bar-pair">
                  <i className="bar income-bar" style={{ height: `${item.incomeHeight}%` }} title={`Доходи: ${money(item.income)}`} />
                  <i className="bar expense-bar" style={{ height: `${item.expenseHeight}%` }} title={`Витрати: ${money(item.expense)}`} />
                </div>
                <small>{monthLabel(item.month)}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel category-panel">
          <PanelHeading title="За категоріями" subtitle="Витрати у серпні" />
          {categoryRows.length ? (
            <div className="donut-wrap">
              <div className="donut" style={{ background: gradient }} aria-label={`Усього витрат ${money(expense)}`}>
                <span><small>Всього</small><strong>{money(expense, true)}</strong></span>
              </div>
              <div className="donut-list">
                {categoryRows.slice(0, 4).map(({ category, amount }) => (
                  <div key={category.id}><i style={{ background: category.color }} /><span>{category.name}</span><strong>{Math.round((amount / expense) * 100)}%</strong></div>
                ))}
              </div>
            </div>
          ) : <EmptyInline text="Додайте витрати, щоб побачити структуру." />}
        </article>
      </section>

      <section className="panel recent-panel">
        <PanelHeading title="Останні транзакції" subtitle="Свіжі рухи коштів" action={<a href="/transactions">Переглянути всі <span>→</span></a>} />
        {recent.length ? (
          <div className="recent-list">
            {recent.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} category={data.categories.find((item) => item.id === transaction.categoryId)} />
            ))}
          </div>
        ) : <EmptyInline text="Поки що немає транзакцій." />}
      </section>
    </div>
  );
}

function MetricCard({ label, value, delta, tone, symbol }: { label: string; value: string; delta: string; tone: string; symbol: string }) {
  return (
    <article className="metric-card">
      <div className={`metric-symbol ${tone}`}>{symbol}</div>
      <div><span>{label}</span><strong>{value}</strong></div>
      <small className={tone === "clay" ? "muted-delta" : "positive-delta"}>{delta}</small>
    </article>
  );
}

function PanelHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="panel-heading">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      {action && <div className="panel-action">{action}</div>}
    </div>
  );
}

function TransactionRow({ transaction, category, onEdit }: { transaction: Transaction; category?: Category; onEdit?: () => void }) {
  return (
    <div className="transaction-row">
      <span className="category-icon" style={{ background: category?.color ?? "#ddd" }}>{categoryIcon(category?.icon ?? "dots")}</span>
      <span className="transaction-main"><strong>{transaction.description}</strong><small>{transaction.merchant || category?.name}</small></span>
      <span className="transaction-category">{category?.name ?? "Без категорії"}</span>
      <span className="transaction-date">{readableDate(transaction.date)}</span>
      <strong className={transaction.type === "income" ? "amount income" : "amount"}>{transaction.type === "income" ? "+" : "−"}{money(transaction.amountCents)}</strong>
      {onEdit && <button className="row-action" onClick={onEdit} type="button" aria-label={`Редагувати ${transaction.description}`}>•••</button>}
    </div>
  );
}

function TransactionsView({ data, demo, onAdd, onEdit, onImported }: { data: FinanceData; demo: boolean; onAdd: () => void; onEdit: (value: Transaction) => void; onImported: (rows: Transaction[]) => void }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [month, setMonth] = useState("all");
  const [importError, setImportError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const availableMonths = [...new Set(data.transactions.map((item) => item.date.slice(0, 7)))].sort().reverse();
  const filtered = data.transactions.filter((transaction) => {
    const haystack = `${transaction.description} ${transaction.merchant} ${transaction.note}`.toLocaleLowerCase("uk");
    return (
      haystack.includes(search.toLocaleLowerCase("uk")) &&
      (type === "all" || transaction.type === type) &&
      (categoryId === "all" || transaction.categoryId === Number(categoryId)) &&
      (month === "all" || transaction.date.startsWith(month))
    );
  }).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const exportCsv = () => {
    const rows = [
      ["date", "type", "category", "description", "merchant", "amount", "note"],
      ...filtered.map((transaction) => [
        transaction.date,
        transaction.type,
        data.categories.find((item) => item.id === transaction.categoryId)?.name ?? "",
        transaction.description,
        transaction.merchant,
        (transaction.amountCents / 100).toFixed(2),
        transaction.note,
      ]),
    ];
    const csv = `\ufeff${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `moneymap-transactions-${CURRENT_MONTH}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportError("");
    try {
      const parsed = parseCsv(await file.text());
      const rows = parsed.map((row, index) => {
        const category = data.categories.find((item) => item.name.toLocaleLowerCase("uk") === row.category?.toLocaleLowerCase("uk") && item.type === row.type);
        const amount = Number(String(row.amount ?? "").replace(",", "."));
        if (!category || !row.date || !row.description || !Number.isFinite(amount) || amount <= 0) {
          throw new Error(`Помилка у рядку ${index + 2}: перевірте дату, тип, категорію, опис і суму.`);
        }
        return {
          id: Date.now() + index,
          categoryId: category.id,
          type: row.type === "income" ? "income" as const : "expense" as const,
          amountCents: Math.round(amount * 100),
          description: row.description,
          merchant: row.merchant ?? "",
          date: row.date,
          note: row.note ?? "",
        };
      });
      if (!rows.length) throw new Error("У файлі немає рядків для імпорту.");
      if (demo) {
        onImported(rows);
      } else {
        const response = await apiRequest<{ transactions: Transaction[] }>("/api/transactions/import", {
          method: "POST",
          body: JSON.stringify({
            transactions: rows.map((row) => ({
              categoryId: row.categoryId,
              type: row.type,
              amountCents: row.amountCents,
              description: row.description,
              merchant: row.merchant,
              date: row.date,
              note: row.note,
            })),
          }),
        });
        onImported(response.transactions);
      }
    } catch (csvError) {
      setImportError(csvError instanceof Error ? csvError.message : "Не вдалося прочитати CSV.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="page-stack">
      <section className="toolbar-card">
        <label className="search-field"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Пошук за описом або магазином" aria-label="Пошук транзакцій" /></label>
        <div className="toolbar-buttons">
          <input ref={inputRef} hidden type="file" accept=".csv,text/csv" onChange={importCsv} />
          <button className="button button-ghost" type="button" onClick={() => inputRef.current?.click()}>↑ Імпорт CSV</button>
          <button className="button button-ghost" type="button" onClick={exportCsv}>↓ Експорт CSV</button>
          <button className="button button-dark" type="button" onClick={onAdd}>＋ Додати</button>
        </div>
      </section>
      {importError && <div className="inline-error" role="alert">{importError}</div>}
      <section className="filter-row" aria-label="Фільтри транзакцій">
        <label><span>Тип</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">Усі</option><option value="income">Доходи</option><option value="expense">Витрати</option></select></label>
        <label><span>Категорія</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="all">Усі категорії</option>{data.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label><span>Період</span><select value={month} onChange={(event) => setMonth(event.target.value)}><option value="all">За весь час</option>{availableMonths.map((item) => <option key={item} value={item}>{monthLabel(item)} {item.slice(0, 4)}</option>)}</select></label>
        <span className="filter-count">Знайдено: <strong>{filtered.length}</strong></span>
      </section>
      <section className="panel transaction-table-panel">
        <div className="table-head"><span>Операція</span><span>Категорія</span><span>Дата</span><span>Сума</span><span /></div>
        <div className="table-body">
          {filtered.length ? filtered.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} category={data.categories.find((item) => item.id === transaction.categoryId)} onEdit={() => onEdit(transaction)} />
          )) : <EmptyInline text="За цими фільтрами нічого не знайдено." />}
        </div>
      </section>
    </div>
  );
}

function BudgetsView({ data, onAdd, onEdit }: { data: FinanceData; onAdd: () => void; onEdit: (value: Budget) => void }) {
  const budgets = data.budgets.filter((item) => item.month === CURRENT_MONTH);
  const expenses = data.transactions.filter((item) => item.type === "expense" && item.date.startsWith(CURRENT_MONTH));
  const totalLimit = budgets.reduce((sum, item) => sum + item.limitCents, 0);
  const totalSpent = expenses.reduce((sum, item) => sum + item.amountCents, 0);
  const remaining = Math.max(0, totalLimit - totalSpent);
  return (
    <div className="page-stack">
      <section className="budget-overview">
        <div><span className="eyebrow light">Загальний бюджет</span><strong>{money(totalLimit)}</strong><p>на серпень 2026</p></div>
        <div className="budget-overview-stat"><span>Витрачено</span><strong>{money(totalSpent)}</strong><small>{totalLimit ? Math.round((totalSpent / totalLimit) * 100) : 0}% ліміту</small></div>
        <div className="budget-overview-stat"><span>Залишилось</span><strong className="lime-text">{money(remaining)}</strong><small>до кінця місяця</small></div>
        <button className="button button-lime" type="button" onClick={onAdd}>＋ Новий бюджет</button>
      </section>
      <section className="budget-grid">
        {budgets.length ? budgets.map((budget) => {
          const category = data.categories.find((item) => item.id === budget.categoryId);
          const spent = expenses.filter((item) => item.categoryId === budget.categoryId).reduce((sum, item) => sum + item.amountCents, 0);
          const percentage = Math.round((spent / budget.limitCents) * 100);
          const danger = percentage >= 85;
          return (
            <article className="budget-card" key={budget.id}>
              <div className="budget-card-top"><span className="category-icon large" style={{ background: category?.color }}>{categoryIcon(category?.icon ?? "dots")}</span><button type="button" onClick={() => onEdit(budget)}>Змінити</button></div>
              <h2>{category?.name ?? "Категорія"}</h2>
              <div className="budget-values"><strong>{money(spent)}</strong><span>з {money(budget.limitCents)}</span></div>
              <div className="progress-track"><i className={danger ? "danger" : ""} style={{ width: `${Math.min(100, percentage)}%`, background: danger ? undefined : category?.color }} /></div>
              <div className="budget-footer"><span>{percentage}% використано</span><strong>{money(Math.max(0, budget.limitCents - spent))} лишилось</strong></div>
            </article>
          );
        }) : (
          <div className="empty-card-wide"><EmptyInline text="Створіть перший бюджет і задайте межі витрат." /><button className="button button-dark" type="button" onClick={onAdd}>Створити бюджет</button></div>
        )}
        <button className="budget-add-card" type="button" onClick={onAdd}><span>＋</span><strong>Додати категорію</strong><small>Створіть окремий ліміт</small></button>
      </section>
      <section className="panel budget-insight">
        <div className="insight-mark">↘</div>
        <div><span className="eyebrow">Прогноз MoneyMap</span><h2>{totalLimit && totalSpent < totalLimit ? "Ви вкладаєтесь у план" : "Час переглянути ліміти"}</h2><p>За поточним темпом витрат наприкінці місяця у вас залишиться близько <strong>{money(remaining)}</strong>.</p></div>
      </section>
    </div>
  );
}

function GoalsView({ data, demo, onAdd, onUpdate, onToast }: { data: FinanceData; demo: boolean; onAdd: () => void; onUpdate: (goal: Goal) => void; onToast: (message: string) => void }) {
  const totalTarget = data.goals.reduce((sum, item) => sum + item.targetCents, 0);
  const totalCurrent = data.goals.reduce((sum, item) => sum + item.currentCents, 0);
  const contribute = async (goal: Goal) => {
    const value = window.prompt(`Скільки додати до цілі «${goal.name}»?`, "100");
    if (value === null) return;
    const amountCents = Math.round(Number(value.replace(",", ".")) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) return;
    const nextCurrent = Math.min(goal.targetCents, goal.currentCents + amountCents);
    const nextGoal = { ...goal, currentCents: nextCurrent, status: nextCurrent >= goal.targetCents ? "completed" as const : goal.status };
    try {
      if (!demo) {
        const response = await apiRequest<{ goal: Goal }>(`/api/goals/${goal.id}`, { method: "PATCH", body: JSON.stringify({ currentCents: nextCurrent, status: nextGoal.status }) });
        onUpdate(response.goal);
      } else onUpdate(nextGoal);
      onToast("Прогрес цілі оновлено");
    } catch (updateError) {
      onToast(updateError instanceof Error ? updateError.message : "Помилка оновлення");
    }
  };
  return (
    <div className="page-stack">
      <section className="goal-summary">
        <div><span className="eyebrow light">Накопичено на всі цілі</span><strong>{money(totalCurrent)}</strong><p>із запланованих {money(totalTarget)}</p></div>
        <div className="goal-summary-progress"><span><strong>{totalTarget ? Math.round((totalCurrent / totalTarget) * 100) : 0}%</strong> загального шляху</span><div className="progress-track dark"><i style={{ width: `${totalTarget ? Math.round((totalCurrent / totalTarget) * 100) : 0}%` }} /></div></div>
        <button className="button button-lime" type="button" onClick={onAdd}>＋ Нова ціль</button>
      </section>
      <section className="goals-grid">
        {data.goals.length ? data.goals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.currentCents / goal.targetCents) * 100));
          const days = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - new Date("2026-08-10").getTime()) / 86400000));
          return (
            <article className="goal-card" key={goal.id}>
              <div className="goal-icon" style={{ background: goal.color }}>{categoryIcon(goal.icon)}</div>
              <div className="goal-status"><i className={goal.status === "completed" ? "done" : ""} />{goal.status === "completed" ? "Завершено" : "Активна"}</div>
              <h2>{goal.name}</h2>
              <div className="goal-amount"><strong>{money(goal.currentCents)}</strong><span>/ {money(goal.targetCents)}</span></div>
              <div className="progress-track"><i style={{ width: `${percentage}%`, background: goal.color }} /></div>
              <div className="goal-meta"><span><strong>{percentage}%</strong> зібрано</span><span><strong>{days}</strong> днів</span></div>
              <button className="button button-soft" type="button" onClick={() => void contribute(goal)}>{goal.status === "completed" ? "Ціль досягнуто ✓" : "Поповнити ціль →"}</button>
            </article>
          );
        }) : <div className="empty-card-wide"><EmptyInline text="Додайте фінансову ціль, щоб бачити прогрес." /><button className="button button-dark" type="button" onClick={onAdd}>Створити ціль</button></div>}
        <button className="goal-add-card" type="button" onClick={onAdd}><span>◎</span><strong>Нова мрія — новий план</strong><small>Вкажіть суму й дедлайн, а MoneyMap допоможе тримати темп.</small></button>
      </section>
    </div>
  );
}

function TransactionModal({ value, categories, demo, nextId, onClose, onSave }: { value: Transaction | "new"; categories: Category[]; demo: boolean; nextId: number; onClose: () => void; onSave: (value: Transaction, isNew: boolean) => void }) {
  const editing = value !== "new";
  const initialType = editing ? value.type : "expense";
  const [type, setType] = useState<"income" | "expense">(initialType);
  const matchingCategories = categories.filter((item) => item.type === type);
  const [form, setForm] = useState({
    description: editing ? value.description : "",
    merchant: editing ? value.merchant : "",
    categoryId: String(editing ? value.categoryId : matchingCategories[0]?.id ?? ""),
    amount: editing ? String(value.amountCents / 100) : "",
    date: editing ? value.date : "2026-08-10",
    note: editing ? value.note : "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const amountCents = Math.round(Number(form.amount.replace(",", ".")) * 100);
    if (!form.description.trim() || !form.categoryId || !Number.isFinite(amountCents) || amountCents <= 0) {
      setError("Заповніть опис, категорію та коректну суму.");
      return;
    }
    const transaction: Transaction = {
      id: editing ? value.id : nextId,
      type,
      categoryId: Number(form.categoryId),
      amountCents,
      description: form.description.trim(),
      merchant: form.merchant.trim(),
      date: form.date,
      note: form.note.trim(),
    };
    setSaving(true);
    setError("");
    try {
      if (demo) onSave(transaction, !editing);
      else {
        const response = await apiRequest<{ transaction: Transaction }>(editing ? `/api/transactions/${value.id}` : "/api/transactions", {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify(transaction),
        });
        onSave(response.transaction, !editing);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не вдалося зберегти.");
    } finally { setSaving(false); }
  };

  return (
    <Modal title={editing ? "Редагувати транзакцію" : "Нова транзакція"} subtitle="Дані одразу потраплять у звіти й бюджети" onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <div className="segmented-control" role="group" aria-label="Тип транзакції"><button type="button" className={type === "expense" ? "active" : ""} onClick={() => { setType("expense"); setForm((current) => ({ ...current, categoryId: String(categories.find((item) => item.type === "expense")?.id ?? "") })); }}>Витрата</button><button type="button" className={type === "income" ? "active" : ""} onClick={() => { setType("income"); setForm((current) => ({ ...current, categoryId: String(categories.find((item) => item.type === "income")?.id ?? "") })); }}>Дохід</button></div>
        <label className="full"><span>Опис *</span><input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Наприклад, продукти на тиждень" /></label>
        <label><span>Сума, € *</span><input required inputMode="decimal" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0,00" /></label>
        <label><span>Дата *</span><input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
        <label><span>Категорія *</span><select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>{matchingCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label><span>Магазин / джерело</span><input value={form.merchant} onChange={(event) => setForm({ ...form, merchant: event.target.value })} placeholder="Необов’язково" /></label>
        <label className="full"><span>Нотатка</span><textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Додайте деталі" rows={3} /></label>
        {error && <p className="form-error full" role="alert">{error}</p>}
        <div className="form-actions full"><button className="button button-ghost" type="button" onClick={onClose}>Скасувати</button><button className="button button-dark" type="submit" disabled={saving}>{saving ? "Зберігаємо…" : editing ? "Зберегти зміни" : "Додати транзакцію"}</button></div>
      </form>
    </Modal>
  );
}

function BudgetModal({ value, categories, demo, nextId, onClose, onSave }: { value: Budget | "new"; categories: Category[]; demo: boolean; nextId: number; onClose: () => void; onSave: (value: Budget) => void }) {
  const editing = value !== "new";
  const expenseCategories = categories.filter((item) => item.type === "expense");
  const [categoryId, setCategoryId] = useState(String(editing ? value.categoryId : expenseCategories[0]?.id ?? ""));
  const [month, setMonth] = useState(editing ? value.month : CURRENT_MONTH);
  const [limit, setLimit] = useState(editing ? String(value.limitCents / 100) : "");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const limitCents = Math.round(Number(limit.replace(",", ".")) * 100);
    if (!categoryId || !Number.isFinite(limitCents) || limitCents <= 0) return setError("Вкажіть коректний ліміт.");
    const budget = { id: editing ? value.id : nextId, categoryId: Number(categoryId), month, limitCents };
    try {
      if (demo) onSave(budget);
      else {
        const response = await apiRequest<{ budget: Budget }>("/api/budgets", { method: "POST", body: JSON.stringify(budget) });
        onSave(response.budget);
      }
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Не вдалося зберегти."); }
  };
  return (
    <Modal title={editing ? "Змінити бюджет" : "Новий бюджет"} subtitle="Окремий ліміт для однієї категорії" onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <label className="full"><span>Категорія</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{expenseCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label><span>Місяць</span><input type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>
        <label><span>Ліміт, €</span><input inputMode="decimal" value={limit} onChange={(event) => setLimit(event.target.value)} placeholder="500" /></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="form-actions full"><button className="button button-ghost" type="button" onClick={onClose}>Скасувати</button><button className="button button-dark" type="submit">Зберегти бюджет</button></div>
      </form>
    </Modal>
  );
}

function GoalModal({ demo, nextId, onClose, onSave }: { demo: boolean; nextId: number; onClose: () => void; onSave: (value: Goal) => void }) {
  const [form, setForm] = useState({ name: "", target: "", current: "", deadline: "2027-06-01", color: "#C7F34A", icon: "target" });
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const targetCents = Math.round(Number(form.target.replace(",", ".")) * 100);
    const currentCents = Math.round(Number((form.current || "0").replace(",", ".")) * 100);
    if (!form.name.trim() || targetCents <= 0 || currentCents < 0 || currentCents > targetCents) return setError("Перевірте назву та суми цілі.");
    const goal: Goal = { id: nextId, name: form.name.trim(), targetCents, currentCents, deadline: form.deadline, color: form.color, icon: form.icon, status: currentCents >= targetCents ? "completed" : "active" };
    try {
      if (demo) onSave(goal);
      else {
        const response = await apiRequest<{ goal: Goal }>("/api/goals", { method: "POST", body: JSON.stringify(goal) });
        onSave(response.goal);
      }
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Не вдалося зберегти."); }
  };
  return (
    <Modal title="Нова фінансова ціль" subtitle="Перетворіть мрію на зрозумілий план" onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <label className="full"><span>Назва цілі</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Наприклад, подорож до Японії" /></label>
        <label><span>Потрібна сума, €</span><input inputMode="decimal" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} placeholder="3000" /></label>
        <label><span>Вже накопичено, €</span><input inputMode="decimal" value={form.current} onChange={(event) => setForm({ ...form, current: event.target.value })} placeholder="0" /></label>
        <label><span>Дедлайн</span><input type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} /></label>
        <label><span>Колір</span><select value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })}><option value="#C7F34A">Лайм</option><option value="#A7D8FF">Блакитний</option><option value="#F5A782">Кораловий</option><option value="#B8A8E8">Лавандовий</option></select></label>
        {error && <p className="form-error full">{error}</p>}
        <div className="form-actions full"><button className="button button-ghost" type="button" onClick={onClose}>Скасувати</button><button className="button button-dark" type="submit">Створити ціль</button></div>
      </form>
    </Modal>
  );
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><span className="eyebrow">MoneyMap</span><h2 id="modal-title">{title}</h2><p>{subtitle}</p></div><button type="button" onClick={onClose} aria-label="Закрити">×</button></div>
        {children}
      </section>
    </div>
  );
}

function AppLoading({ activeView, user }: { activeView: ViewName; user: UserSummary }) {
  return (
    <div className="app-frame app-loading">
      <Sidebar activeView={activeView} user={user} demo={false} />
      <main className="app-main"><AppHeader activeView={activeView} user={user} onAdd={() => {}} /><div className="loading-grid" role="status" aria-label="Завантаження"><i /><i /><i /><i /></div></main>
    </div>
  );
}

function EmptyState({ title, text, action, onAction }: { title: string; text: string; action: string; onAction: () => void }) {
  return <section className="empty-state"><span>!</span><h2>{title}</h2><p>{text}</p><button className="button button-dark" type="button" onClick={onAction}>{action}</button></section>;
}

function EmptyInline({ text }: { text: string }) {
  return <div className="empty-inline"><span>○</span><p>{text}</p></div>;
}

function buildMonthlyChart(transactions: Transaction[]) {
  const months = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];
  const values = months.map((month) => {
    const rows = transactions.filter((item) => item.date.startsWith(month));
    return {
      month,
      income: rows.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amountCents, 0),
      expense: rows.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amountCents, 0),
    };
  });
  const max = Math.max(1, ...values.flatMap((item) => [item.income, item.expense]));
  return values.map((item) => ({ ...item, incomeHeight: Math.max(4, (item.income / max) * 100), expenseHeight: Math.max(4, (item.expense / max) * 100) }));
}

function buildDonutGradient(rows: Array<{ category: Category; amount: number }>, total: number) {
  if (!total || !rows.length) return "#ECEBE4";
  let cursor = 0;
  const stops = rows.map(({ category, amount }) => {
    const start = cursor;
    cursor += (amount / total) * 100;
    return `${category.color} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function csvEscape(value: string) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsv(text: string) {
  const lines: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { field += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field); field = "";
      if (row.some((item) => item.trim())) lines.push(row);
      row = [];
    } else field += char;
  }
  row.push(field);
  if (row.some((item) => item.trim())) lines.push(row);
  const headers = (lines.shift() ?? []).map((item) => item.trim().replace(/^\ufeff/, "").toLowerCase());
  const required = ["date", "type", "category", "description", "amount"];
  if (!required.every((item) => headers.includes(item))) throw new Error("CSV повинен містити колонки date, type, category, description та amount.");
  return lines.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""])) as Record<string, string>);
}
