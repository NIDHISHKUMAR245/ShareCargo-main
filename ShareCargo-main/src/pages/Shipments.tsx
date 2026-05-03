import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Package, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SHIPMENTS } from "@/constants/mockData";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import ContainerFillBar from "@/components/features/ContainerFillBar";
import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: ShipmentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "In Transit", value: "in_transit" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Delivered", value: "delivered" },
  { label: "Pending Match", value: "pending_match" },
];

export default function Shipments() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");

  const filtered = MOCK_SHIPMENTS.filter((s) => {
    const matchesSearch =
      !search ||
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.origin.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase()) ||
      s.cargoType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-16 bg-navy">
      {/* Header */}
      <div className="border-b border-border bg-navy-mid/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-700 text-foreground">My Shipments</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{MOCK_SHIPMENTS.length} total shipments</p>
            </div>
            <Button onClick={() => navigate("/book")} className="gradient-teal text-navy font-700 gap-1.5 hover:opacity-90 teal-glow">
              <Plus size={16} /> New Shipment
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tracking number, route, or cargo..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={14} className="text-muted-foreground shrink-0" />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-600 whitespace-nowrap transition-all",
                  statusFilter === f.value
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shipments list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={40} className="text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No shipments found matching your filters.</p>
            <Button onClick={() => navigate("/book")} className="mt-4 gradient-teal text-navy font-600">
              Book Your First Shipment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((shipment) => (
              <div
                key={shipment.id}
                onClick={() => navigate(`/shipments/${shipment.id}`)}
                className="rounded-2xl border border-border hover:border-primary/30 bg-navy-mid/70 hover:bg-navy-mid p-5 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  {/* Status & tracking */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("text-xs px-2.5 py-1 rounded-full font-600", getStatusColor(shipment.status))}>
                        {getStatusLabel(shipment.status)}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{shipment.trackingNumber}</span>
                    </div>

                    <h3 className="font-display font-700 text-foreground text-lg">
                      {shipment.origin.split("(")[0].trim()} → {shipment.destination.split("(")[0].trim()}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                      <span>{shipment.cargoType}</span>
                      <span>·</span>
                      <span>{shipment.weight.toLocaleString()} KG · {shipment.volume} CBM</span>
                      <span>·</span>
                      <span>Departs {formatDate(shipment.departureDate)}</span>
                      <span>·</span>
                      <span>ETA {formatDate(shipment.estimatedArrival)}</span>
                    </div>
                  </div>

                  {/* Container fill */}
                  <div className="w-40 shrink-0">
                    <p className="text-xs text-muted-foreground mb-1.5">{shipment.containerShare.containerType} Container</p>
                    <ContainerFillBar
                      fillPercentage={shipment.containerShare.fillPercentage}
                      yourShare={shipment.containerShare.yourShare}
                      totalCapacity={shipment.containerShare.totalCapacity}
                      showLabels={false}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{shipment.containerShare.fillPercentage}% filled</p>
                  </div>

                  {/* Cost & savings */}
                  <div className="text-right shrink-0">
                    <p className="text-xl font-700 font-display text-primary">{formatCurrency(shipment.pricing.totalCost)}</p>
                    <p className="text-xs text-emerald-400 mt-0.5">saved {formatCurrency(shipment.pricing.savings)} ({shipment.pricing.savingsPercentage}%)</p>
                    <p className="text-xs text-muted-foreground mt-1">{shipment.coShippers.length} co-shipper{shipment.coShippers.length !== 1 ? "s" : ""}</p>
                  </div>

                  <ArrowRight size={18} className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary footer */}
        {filtered.length > 0 && (
          <div className="rounded-xl border border-border bg-navy-mid/40 p-4 flex flex-wrap gap-6">
            {[
              { label: "Total paid", value: formatCurrency(filtered.reduce((s, sh) => s + sh.pricing.totalCost, 0)) },
              { label: "Total saved", value: formatCurrency(filtered.reduce((s, sh) => s + sh.pricing.savings, 0)), highlight: true },
              { label: "Total volume", value: `${filtered.reduce((s, sh) => s + sh.volume, 0)} CBM` },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={cn("font-700 font-display text-lg mt-0.5", item.highlight ? "text-emerald-400" : "text-foreground")}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
