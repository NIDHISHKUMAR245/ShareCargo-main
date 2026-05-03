import { Info, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PricingBreakdown as PricingData } from "@/types";

interface PricingBreakdownProps {
  pricing: PricingData;
  compact?: boolean;
}

export default function PricingBreakdown({ pricing, compact = false }: PricingBreakdownProps) {
  const lineItems = [
    { label: "Base cargo rate (pro-rated)", amount: pricing.yourBaseCost, tooltip: "Your proportional share of the container lease cost" },
    { label: "Booking fee", amount: pricing.bookingFee, tooltip: "One-time processing and documentation fee" },
    { label: "Service fee", amount: pricing.serviceFee, tooltip: "Platform coordination and support fee (based on cargo value)" },
    { label: "Container sharing management fee", amount: pricing.managementFee, tooltip: "Fee for coordinating multi-shipper logistics and scheduling" },
  ];

  return (
    <div className="rounded-xl border border-border bg-navy-mid/60 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-white/3 flex items-center justify-between">
        <span className="text-sm font-600 font-display text-foreground">Cost Breakdown</span>
        {!compact && (
          <span className="text-xs text-muted-foreground">
            vs. {formatCurrency(pricing.fullContainerCost, pricing.currency)} full container
          </span>
        )}
      </div>

      {/* Line items */}
      <div className="px-4 py-3 space-y-2.5">
        {lineItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              {!compact && (
                <div className="relative group">
                  <Info size={12} className="text-muted-foreground/50 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 px-2.5 py-2 rounded-lg bg-card border border-border text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    {item.tooltip}
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm font-500 text-foreground">{formatCurrency(item.amount, pricing.currency)}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="px-4 py-3 border-t border-border bg-white/3 flex items-center justify-between">
        <span className="font-600 text-foreground">Total</span>
        <span className="text-xl font-700 font-display text-primary">{formatCurrency(pricing.totalCost, pricing.currency)}</span>
      </div>

      {/* Savings banner */}
      <div className="px-4 py-3 bg-emerald-400/8 border-t border-emerald-400/20 flex items-center gap-2">
        <TrendingDown size={16} className="text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-400">
          You save <strong>{formatCurrency(pricing.savings, pricing.currency)}</strong>
          {" "}({pricing.savingsPercentage}%) vs. booking a full container
        </p>
      </div>
    </div>
  );
}
