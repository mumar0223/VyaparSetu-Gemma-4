"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppBackground } from "@/components/app-background";

interface AppMobileShellProps {
  children: React.ReactNode;
}

export function AppMobileShell({ children }: AppMobileShellProps) {
  const pathname = usePathname();

  // On the landing page (/), allow natural scrolling without fixed height or background canvas
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 flex h-dvh w-full overflow-hidden bg-cream dark:bg-background font-sans antialiased text-foreground">
      {/* ── Fixed Animated Hexagonal Grid Background ── */}
      <AppBackground />

      {/* Main Content (Edge to Edge Full Viewport) */}
      <main className="flex-1 h-full w-full overflow-hidden bg-transparent text-foreground relative z-10 flex flex-col">
        {children}
      </main>
    </div>
  );
}

