import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accentColor?: "teal" | "amber" | "emerald" | "red";
  className?: string;
}

const ACCENT_STYLES = {
  teal: { icon: "bg-primary/15 text-primary", border: "border-primary/20" },
  amber: { icon: "bg-yellow-400/15 text-yellow-400", border: "border-yellow-400/20" },
  emerald: { icon: "bg-emerald-400/15 text-emerald-400", border: "border-emerald-400/20" },
  red: { icon: "bg-red-400/15 text-red-400", border: "border-red-400/20" },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "teal",
  className,
}: StatCardProps) {
  const styles = ACCENT_STYLES[accentColor];

  return (
    <div className={cn(
      "rounded-xl border bg-navy-mid/80 p-5 space-y-3 hover:bg-navy-mid transition-all duration-200",
      styles.border,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", styles.icon)}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-600 px-2 py-1 rounded-full",
            trend.positive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
          )}>
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-700 font-display text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
