import { FinanceApp, type ViewName } from "../components/finance-app";

const VIEWS = new Set<ViewName>(["dashboard", "transactions", "budgets", "goals"]);

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams;
  const requested = params.view as ViewName;
  const view = VIEWS.has(requested) ? requested : "dashboard";
  return <FinanceApp activeView={view} user={{ displayName: "Влад", email: "demo@moneymap.app" }} demo />;
}
