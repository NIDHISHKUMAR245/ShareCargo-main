import { CheckCircle2, Circle, MapPin, Clock } from "lucide-react";
import type { TrackingMilestone } from "@/types";
import { cn } from "@/lib/utils";

interface TrackingTimelineProps {
  milestones: TrackingMilestone[];
}

export default function TrackingTimeline({ milestones }: TrackingTimelineProps) {
  return (
    <div className="space-y-0">
      {milestones.map((milestone, index) => {
        const isLast = index === milestones.length - 1;
        return (
          <div key={milestone.id} className="flex gap-4">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all",
                milestone.completed && !milestone.current ? "bg-emerald-400/15 text-emerald-400" :
                milestone.current ? "bg-primary/15 text-primary teal-glow" :
                "bg-navy-light text-muted-foreground"
              )}>
                {milestone.completed && !milestone.current ? (
                  <CheckCircle2 size={16} />
                ) : milestone.current ? (
                  <MapPin size={16} className="animate-pulse-slow" />
                ) : (
                  <Circle size={16} />
                )}
              </div>
              {!isLast && (
                <div className={cn(
                  "w-0.5 flex-1 my-1 min-h-[2rem]",
                  milestone.completed ? "bg-emerald-400/30" : "bg-border"
                )} />
              )}
            </div>

            {/* Content */}
            <div className={cn(
              "pb-6 flex-1",
              isLast && "pb-0"
            )}>
              <div className={cn(
                "font-600 text-sm transition-colors",
                milestone.current ? "text-primary" :
                milestone.completed ? "text-foreground" :
                "text-muted-foreground"
              )}>
                {milestone.event}
                {milestone.current && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-500">Current</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={11} />
                  {milestone.location}
                </div>
                {milestone.timestamp && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} />
                    {milestone.timestamp}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
