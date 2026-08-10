import { ProtectedFinancePage } from "../components/protected-finance-page";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <ProtectedFinancePage view="dashboard" returnTo="/dashboard" />;
}
