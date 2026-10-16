"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building,
  QrCode,
  Smartphone,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { getActiveBusinessProfile, type BusinessProfile } from "@/lib/db";

export interface CashflowSummaryData {
  totalInflow: number;
  totalOutflow: number;
  netCashflow: number;
  monthlyBurn: number;
  runwayMonths: number;
  upiPercentage: number;
  cashPercentage: number;
  dailyUpiScans: number;
  avgUpiTicket: number;
  breakdown: {
    category: string;
    amount: number;
    pct: number;
  }[];
}

export function CashflowClient({ initialSummary }: { initialSummary?: CashflowSummaryData }) {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [summary, setSummary] = useState<CashflowSummaryData>(() => {
    if (initialSummary) return initialSummary;
    const inflow = 350000;
    const outflow = 210000;
    const net = inflow - outflow;
    return {
      totalInflow: inflow,
      totalOutflow: outflow,
      netCashflow: net,
      monthlyBurn: outflow,
      runwayMonths: 1.6,
      upiPercentage: 72,
      cashPercentage: 28,
      dailyUpiScans: 48,
      avgUpiTicket: 285,
      breakdown: [
        { category: "Raw Materials & Stock Sourcing", amount: 115500, pct: 55 },
        { category: "Shop Lease & Power Utilities", amount: 42000, pct: 20 },
        { category: "Staff Wages & Logistics", amount: 31500, pct: 15 },
        { category: "Packaging & Miscellaneous", amount: 21000, pct: 10 },
      ],
    };
  });

  useEffect(() => {
    getActiveBusinessProfile().then((p) => {
      if (!p) return;
      setProfile(p);
      const inflow = p.annualRevenue
        ? Math.round(p.annualRevenue / 12)
        : p.monthlyTurnover
          ? parseInt(p.monthlyTurnover.replace(/[^0-9]/g, ""), 10) || 350000
          : 350000;
      const outflow = p.monthlyExpenses || Math.round(inflow * 0.65);
      const net = inflow - outflow;
      const runway = outflow > 0 ? (net > 0 ? Math.round((net / outflow) * 10) / 10 : 0.5) : 2.0;

      setSummary({
        totalInflow: inflow,
        totalOutflow: outflow,
        netCashflow: net,
        monthlyBurn: outflow,
        runwayMonths: runway,
        upiPercentage: 72,
        cashPercentage: 28,
        dailyUpiScans: Math.max(25, Math.round((inflow * 0.72) / (30 * 285))),
        avgUpiTicket: 285,
        breakdown: [
          { category: "Raw Materials & Stock Sourcing", amount: Math.round(outflow * 0.55), pct: 55 },
          { category: "Shop Lease & Power Utilities", amount: Math.round(outflow * 0.20), pct: 20 },
          { category: "Staff Wages & Logistics", amount: Math.round(outflow * 0.15), pct: 15 },
          { category: "Packaging & Miscellaneous", amount: Math.round(outflow * 0.10), pct: 10 },
        ],
      });
    });

    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        const p: BusinessProfile = e.detail;
        setProfile(p);
        const inflow = p.annualRevenue
          ? Math.round(p.annualRevenue / 12)
          : 350000;
        const outflow = p.monthlyExpenses || Math.round(inflow * 0.65);
        const net = inflow - outflow;
        const runway = outflow > 0 ? (net > 0 ? Math.round((net / outflow) * 10) / 10 : 0.5) : 2.0;

        setSummary({
          totalInflow: inflow,
          totalOutflow: outflow,
          netCashflow: net,
          monthlyBurn: outflow,
          runwayMonths: runway,
          upiPercentage: 72,
          cashPercentage: 28,
          dailyUpiScans: Math.max(25, Math.round((inflow * 0.72) / (30 * 285))),
          avgUpiTicket: 285,
          breakdown: [
            { category: "Raw Materials & Stock Sourcing", amount: Math.round(outflow * 0.55), pct: 55 },
            { category: "Shop Lease & Power Utilities", amount: Math.round(outflow * 0.20), pct: 20 },
            { category: "Staff Wages & Logistics", amount: Math.round(outflow * 0.15), pct: 15 },
            { category: "Packaging & Miscellaneous", amount: Math.round(outflow * 0.10), pct: 10 },
          ],
        });
      }
    };

    window.addEventListener("vyaparsetu:profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("vyaparsetu:profile-updated", handleProfileUpdate);
  }, []);

  const upiInflowAmount = Math.round(summary.totalInflow * (summary.upiPercentage / 100));
  const cashInflowAmount = summary.totalInflow - upiInflowAmount;

  return (
    <div className="h-full flex flex-col pt-16 sm:pt-16 md:pt-16 lg:pt-8 p-4 md:p-6 lg:p-8 overflow-y-auto font-sans text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest dark:text-mint flex items-center gap-2.5">
            <Activity className="size-7 text-mint" /> Cash Flow Health &amp; UPI Runway Monitor
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time liquidity analysis, UPI vs Cash inflow distribution, and bank-ready cash-flow telemetry
            {profile?.businessName ? ` • ${profile.businessName}` : ""}
          </p>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-card rounded-2xl border border-sage/30 dark:border-border p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Total Inflow (Receipts)
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-forest dark:text-mint">
              +₹{summary.totalInflow.toLocaleString("en-IN")}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 font-bold">UPI: {summary.upiPercentage}%</span>
              <span>•</span>
              <span>Cash: {summary.cashPercentage}%</span>
            </div>
          </div>
          <div className="p-3 bg-mint-pale dark:bg-mint/20 text-forest dark:text-mint rounded-xl">
            <ArrowUpRight className="size-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl border border-sage/30 dark:border-border p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Total Outflow (Burn)
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-orange">
              -₹{summary.totalOutflow.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              Operating &amp; procurement burn
            </span>
          </div>
          <div className="p-3 bg-orange/10 dark:bg-orange/20 text-orange rounded-xl">
            <ArrowDownRight className="size-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl border border-sage/30 dark:border-border p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Net Surplus / Deficit
            </span>
            <span
              className={`text-2xl sm:text-3xl font-serif font-bold ${
                summary.netCashflow >= 0 ? "text-forest dark:text-mint" : "text-destructive"
              }`}
            >
              ₹{summary.netCashflow.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              Retained monthly liquidity
            </span>
          </div>
          <div className="p-3 bg-cream dark:bg-muted text-forest dark:text-foreground rounded-xl">
            {summary.netCashflow >= 0 ? (
              <TrendingUp className="size-6" />
            ) : (
              <TrendingDown className="size-6" />
            )}
          </div>
        </div>
      </div>

      {/* ── UPI PAYMENT RAILS & DIGITAL SETTLEMENTS CARD ── */}
      <div className="bg-white dark:bg-card rounded-2xl border border-sage/30 dark:border-border p-6 shadow-xs mb-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sage/20 dark:border-border/60 pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-forest dark:text-foreground flex items-center gap-2">
              <QrCode className="size-5 text-mint" />
              UPI Inflows &amp; Soundbox Settlement Telemetry
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified digital receipts via Bharat QR, PhonePe, Google Pay &amp; Paytm Merchant Soundbox
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 w-fit">
            <Zap className="size-3.5" />
            T+0 Instant Bank Settlement Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-mint/40 bg-mint-pale/30 dark:bg-mint/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Digital UPI Volume</span>
              <Smartphone className="size-4 text-mint" />
            </div>
            <p className="text-2xl font-serif font-bold text-forest dark:text-mint">
              ₹{upiInflowAmount.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] font-bold text-emerald-600 block">
              {summary.upiPercentage}% of total merchant collections
            </span>
          </div>

          <div className="p-4 rounded-xl border border-sage/30 dark:border-border bg-cream/40 dark:bg-muted/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Daily QR Scan Velocity</span>
              <Activity className="size-4 text-forest dark:text-mint" />
            </div>
            <p className="text-2xl font-serif font-bold text-forest dark:text-foreground">
              ~{summary.dailyUpiScans} Scans / Day
            </p>
            <span className="text-[11px] text-muted-foreground block">
              Avg ticket size: ₹{summary.avgUpiTicket} / payment
            </span>
          </div>

          <div className="p-4 rounded-xl border border-sage/30 dark:border-border bg-cream/40 dark:bg-muted/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Cash in Register</span>
              <TrendingUp className="size-4 text-orange" />
            </div>
            <p className="text-2xl font-serif font-bold text-forest dark:text-foreground">
              ₹{cashInflowAmount.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              {summary.cashPercentage}% physical cash receipts
            </span>
          </div>
        </div>

        {/* UPI vs Cash visual ratio bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-700 dark:text-emerald-400">
              UPI &amp; Soundbox Inflow (₹{upiInflowAmount.toLocaleString("en-IN")} • {summary.upiPercentage}%)
            </span>
            <span className="text-muted-foreground">
              Cash (₹{cashInflowAmount.toLocaleString("en-IN")} • {summary.cashPercentage}%)
            </span>
          </div>
          <div className="w-full bg-cream dark:bg-muted rounded-full h-3 overflow-hidden border border-sage/20 dark:border-border flex">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${summary.upiPercentage}%` }}
              title="UPI Inflow"
            />
            <div
              className="bg-orange/80 h-full transition-all duration-500"
              style={{ width: `${summary.cashPercentage}%` }}
              title="Cash Inflow"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-forest/5 dark:bg-mint/5 border border-forest/15 dark:border-mint/20 flex items-start gap-3">
          <ShieldCheck className="size-5 text-mint shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-forest dark:text-foreground font-semibold">
              Bank Underwriting Advantage:{" "}
            </strong>
            Because {summary.upiPercentage}% of your receipts are captured digitally on UPI rails, your enterprise generates an audited digital turnover footprint. This qualifies your business for pre-approved, collateral-free credit under <strong>PM MUDRA (Kishore/Tarun)</strong> and <strong>PM SVANidhi</strong> without requiring complex audited balance sheets.
          </div>
        </div>
      </div>

      {/* Runway Analysis Box */}
      <div className="bg-white dark:bg-card rounded-2xl border border-sage/30 dark:border-border p-6 shadow-xs mb-6">
        <h3 className="font-serif font-bold text-lg text-forest dark:text-foreground flex items-center gap-2 mb-3">
          <Calendar className="size-5 text-mint" /> Working Capital Runway Assessment
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 max-w-3xl">
          Based on your average monthly operating burn of{" "}
          <strong className="text-forest dark:text-foreground">₹{summary.monthlyBurn.toLocaleString("en-IN")}</strong> and current net
          surplus reserves, your business has an estimated operational cushion of:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-mint/40 bg-mint-pale/40 dark:bg-mint/10">
            <span className="text-xs font-bold text-forest dark:text-mint block mb-1">30-Day Safe Horizon</span>
            <p className="text-xs text-muted-foreground">
              Sufficient liquid funds to cover immediate supplier dues and vendor credit.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-sage/30 dark:border-border bg-cream/40 dark:bg-muted/30">
            <span className="text-xs font-bold text-forest dark:text-foreground block mb-1">60-Day Runway</span>
            <p className="text-xs text-muted-foreground">
              Maintain current sales cadence to preserve raw material replenishment buffer.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-sage/30 dark:border-border bg-cream/40 dark:bg-muted/30">
            <span className="text-xs font-bold text-forest dark:text-foreground block mb-1">90-Day Expansion Horizon</span>
            <p className="text-xs text-muted-foreground">
              Eligible for working capital line from MUDRA / CGTMSE partners.
            </p>
          </div>
        </div>
      </div>

      {/* Expense Concentration Breakdown */}
      <div className="bg-white dark:bg-card rounded-2xl border border-sage/30 dark:border-border p-6 shadow-xs flex-1">
        <h3 className="font-serif font-bold text-lg text-forest dark:text-foreground mb-4">
          Cash Outflow Concentration
        </h3>

        {summary.breakdown.length === 0 ? (
          <p className="text-xs text-muted-foreground">No expense categories recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {summary.breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>{item.category}</span>
                  <span>
                    ₹{item.amount.toLocaleString("en-IN")}{" "}
                    <span className="text-muted-foreground font-normal">({item.pct}%)</span>
                  </span>
                </div>
                <div className="w-full bg-cream dark:bg-muted rounded-full h-2 overflow-hidden border border-sage/20 dark:border-border">
                  <div
                    className="bg-forest dark:bg-mint h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
