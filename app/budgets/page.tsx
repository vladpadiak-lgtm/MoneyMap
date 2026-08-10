import { ProtectedFinancePage } from "../components/protected-finance-page";

export const dynamic = "force-dynamic";

export default function BudgetsPage() {
  return <ProtectedFinancePage view="budgets" returnTo="/budgets" />;
}
