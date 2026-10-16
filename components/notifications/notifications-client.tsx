"use client";

import { useState } from "react";
import {
  Bell,
  Clock,
  Award,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  message: string;
  type: "WHATSAPP" | "WARNING" | "SCHEME" | "SYSTEM";
  target?: string;
  isRead: boolean;
  createdAt: string | Date;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    type: "WHATSAPP",
    target: "WhatsApp (+91 98765 43210)",
    message: "Daily Sales Ledger dispatched to WhatsApp: Total ₹1,400 recorded (Cash: ₹800, UPI: ₹600, Udhaar: ₹450).",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: "notif_2",
    type: "WHATSAPP",
    target: "Customer (+91 98220 11223)",
    message: "Friendly Udhaar payment reminder dispatched via WhatsApp to Ramesh Ji for ₹450 pending grocery dues.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 mins ago
  },
  {
    id: "notif_3",
    type: "WARNING",
    message: "Low Stock Alert: Fortune Mustard Oil (1L) has only 4 units remaining. Restock recommended.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: "notif_4",
    type: "WHATSAPP",
    target: "CA Sharma (+91 98111 22334)",
    message: "Monthly GST-Ready Summary Report (0%, 5%, 12%, 18% tax slabs) dispatched to your Tax Consultant via WhatsApp.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    id: "notif_5",
    type: "SCHEME",
    message: "PM SVANidhi / Mudra Scheme window open: Zero-collateral working capital credit eligible for your enterprise.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "notif_6",
    type: "SYSTEM",
    message: "Digital cash-flow trajectory refreshed: 60-day operational working capital cushion maintained.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export function NotificationsClient({
  initialNotifications = DEFAULT_NOTIFICATIONS,
}: {
  initialNotifications?: NotificationItem[];
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="h-full flex flex-col pt-16 sm:pt-16 md:pt-16 lg:pt-8 p-4 md:p-6 lg:p-8 overflow-y-auto font-sans text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest dark:text-mint flex items-center gap-2.5">
            <Bell className="size-7 text-mint" /> Real-Time Alerts &amp; WhatsApp Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track automated WhatsApp delivery logs, customer udhaar reminders, low-stock warnings, and subsidy deadlines
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="bg-white dark:bg-card border border-sage/40 dark:border-border hover:bg-cream dark:hover:bg-muted text-foreground font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-card rounded-2xl border border-sage/30 dark:border-border shadow-xs divide-y divide-sage/20 dark:divide-border/50 flex-1 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="size-10 text-muted-foreground mx-auto mb-2" />
            <h4 className="font-bold text-foreground text-base">No notifications</h4>
            <p className="text-xs text-muted-foreground mt-1">
              You are all caught up with WhatsApp dispatches and scheme alerts.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkSingleRead(n.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                n.isRead
                  ? "bg-white dark:bg-card hover:bg-cream/20 dark:hover:bg-muted/20"
                  : "bg-mint-pale/40 dark:bg-mint/10 hover:bg-mint-pale/60 dark:hover:bg-mint/20"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  n.type === "WHATSAPP"
                    ? "bg-emerald-600 text-white font-bold"
                    : n.isRead
                      ? "bg-cream dark:bg-muted text-muted-foreground"
                      : "bg-mint text-forest dark:text-black font-bold"
                }`}
              >
                {n.type === "WHATSAPP" ? (
                  <MessageSquare className="size-5" />
                ) : n.type === "WARNING" ? (
                  <AlertCircle className="size-5" />
                ) : n.type === "SCHEME" ? (
                  <Award className="size-5" />
                ) : (
                  <Bell className="size-5" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        n.type === "WHATSAPP"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-forest dark:text-mint"
                      }`}
                    >
                      {n.type === "WHATSAPP"
                        ? "WhatsApp Dispatch"
                        : n.type === "WARNING"
                          ? "Stock / Inventory Alert"
                          : n.type === "SCHEME"
                            ? "Scheme Opportunity"
                            : "System Advisory"}
                    </span>
                    {n.target && (
                      <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-cream dark:bg-muted text-muted-foreground border border-sage/30 dark:border-border font-medium">
                        {n.target}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <span className="size-2 bg-orange rounded-full shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
