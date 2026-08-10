import { ProtectedFinancePage } from "../components/protected-finance-page";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  return <ProtectedFinancePage view="transactions" returnTo="/transactions" />;
}
