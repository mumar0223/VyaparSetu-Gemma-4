import { AppShell } from "@/components/layout/app-shell";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return (
    <AppShell activeView="notifications">
      <NotificationsClient />
    </AppShell>
  );
}
