import { Shield, Star, User } from "lucide-react";
import type { CoShipper } from "@/types";
import { getVerificationBadge } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CoShipperListProps {
  coShippers: CoShipper[];
  compact?: boolean;
}

const VERIFICATION_ICONS = {
  premium: Star,
  verified: Shield,
  basic: User,
};

export default function CoShipperList({ coShippers, compact = false }: CoShipperListProps) {
  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      {coShippers.map((shipper) => {
        const badge = getVerificationBadge(shipper.verificationLevel);
        const Icon = VERIFICATION_ICONS[shipper.verificationLevel];
        return (
          <div
            key={shipper.id}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/3 border border-white/6 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                shipper.verificationLevel === "premium" ? "bg-yellow-400/15" :
                shipper.verificationLevel === "verified" ? "bg-teal/15" :
                "bg-white/8"
              )}>
                <Icon size={13} className={
                  shipper.verificationLevel === "premium" ? "text-yellow-400" :
                  shipper.verificationLevel === "verified" ? "text-teal" :
                  "text-muted-foreground"
                } />
              </div>
              <div>
                <p className="text-sm font-500 text-foreground">{shipper.name}</p>
                {!compact && (
                  <p className="text-xs text-muted-foreground">{shipper.cargoType}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{shipper.volumeShare} CBM</span>
              <span className={cn("text-xs px-2 py-0.5 rounded-full border font-500", badge.color)}>
                {badge.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
