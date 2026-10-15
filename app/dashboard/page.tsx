import { AppMobileShell } from "@/components/app-mobile-shell";
import { ChatWorkspace } from "@/components/chat/chat-workspace";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <AppMobileShell>
      <ChatWorkspace />
    </AppMobileShell>
  );
}
