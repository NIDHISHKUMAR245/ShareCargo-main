import { cn } from "@/lib/utils";

interface ContainerFillBarProps {
  fillPercentage: number;
  yourShare: number;
  totalCapacity: number;
  className?: string;
  showLabels?: boolean;
}

export default function ContainerFillBar({
  fillPercentage,
  yourShare,
  totalCapacity,
  className,
  showLabels = true,
}: ContainerFillBarProps) {
  const yourSharePercent = (yourShare / totalCapacity) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Container Fill</span>
          <span className="font-600 text-foreground">{fillPercentage}% full</span>
        </div>
      )}
      <div className="h-3 rounded-full bg-navy-light overflow-hidden relative">
        {/* Total filled */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/10 transition-all duration-500"
          style={{ width: `${fillPercentage}%` }}
        />
        {/* Your share */}
        <div
          className="absolute inset-y-0 left-0 rounded-full gradient-teal transition-all duration-500"
          style={{ width: `${yourSharePercent}%` }}
        />
      </div>
      {showLabels && (
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm gradient-teal inline-block" />
            <span className="text-muted-foreground">Your space ({yourShare} CBM)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-white/15 inline-block" />
            <span className="text-muted-foreground">Others ({totalCapacity - yourShare} CBM)</span>
          </div>
        </div>
      )}
    </div>
  );
}
