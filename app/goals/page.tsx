import { ProtectedFinancePage } from "../components/protected-finance-page";

export const dynamic = "force-dynamic";

export default function GoalsPage() {
  return <ProtectedFinancePage view="goals" returnTo="/goals" />;
}
