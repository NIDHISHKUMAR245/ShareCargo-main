import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending_match: "text-yellow-400 bg-yellow-400/10",
    matched: "text-blue-400 bg-blue-400/10",
    confirmed: "text-teal-400 bg-teal-400/10",
    in_transit: "text-primary bg-primary/10",
    arrived: "text-emerald-400 bg-emerald-400/10",
    delivered: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
  };
  return map[status] || "text-muted-foreground bg-muted";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_match: "Pending Match",
    matched: "Matched",
    confirmed: "Confirmed",
    in_transit: "In Transit",
    arrived: "Arrived",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status] || status;
}

export function getVerificationBadge(level: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    premium: { label: "Premium", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
    verified: { label: "Verified", color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
    basic: { label: "Basic", color: "text-muted-foreground bg-muted/50 border-border" },
  };
  return map[level] || { label: level, color: "text-muted-foreground bg-muted" };
}
