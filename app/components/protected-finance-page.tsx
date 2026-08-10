import { requireChatGPTUser } from "../chatgpt-auth";
import { FinanceApp, type ViewName } from "./finance-app";

export async function ProtectedFinancePage({ view, returnTo }: { view: ViewName; returnTo: string }) {
  const user = await requireChatGPTUser(returnTo);
  return <FinanceApp activeView={view} user={{ displayName: user.displayName, email: user.email }} />;
}
