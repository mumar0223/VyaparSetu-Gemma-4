import { AppShell } from "@/components/layout/app-shell";
import { CashflowClient } from "@/components/cashflow/cashflow-client";

export const dynamic = "force-dynamic";

export default function CashflowPage() {
  return (
    <AppShell activeView="cashflow">
      <CashflowClient />
    </AppShell>
  );
}
