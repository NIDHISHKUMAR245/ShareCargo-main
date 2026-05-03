import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, Package, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SHIPMENTS } from "@/constants/mockData";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import TrackingTimeline from "@/components/features/TrackingTimeline";
import PricingBreakdown from "@/components/features/PricingBreakdown";
import ContainerFillBar from "@/components/features/ContainerFillBar";
import CoShipperList from "@/components/features/CoShipperList";

export default function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shipment = MOCK_SHIPMENTS.find((s) => s.id === id);

  if (!shipment) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Package size={40} className="text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-foreground font-600">Shipment not found</p>
          <Button onClick={() => navigate("/shipments")} className="mt-4 gradient-teal text-navy">Back to Shipments</Button>
        </div>
      </div>
    );
  }

  const currentMilestone = shipment.milestones.find((m) => m.current);
  const completedCount = shipment.milestones.filter((m) => m.completed).length;

  const handleDownloadReport = () => {
    // Generate report content
    const reportContent = `
═══════════════════════════════════════════════════════════════════
                    SHIPMENT DETAILS REPORT
═══════════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}

───────────────────────────────────────────────────────────────────
SHIPMENT INFORMATION
───────────────────────────────────────────────────────────────────
Tracking Number:        ${shipment.trackingNumber}
Status:                 ${getStatusLabel(shipment.status)}
Route:                  ${shipment.origin} → ${shipment.destination}

Departure Date:         ${formatDate(shipment.departureDate)}
Estimated Arrival:      ${formatDate(shipment.estimatedArrival)}
Cargo Type:             ${shipment.cargoType}

Progress:               ${completedCount}/${shipment.milestones.length} milestones completed

───────────────────────────────────────────────────────────────────
CARGO DETAILS
───────────────────────────────────────────────────────────────────
Weight:                 ${shipment.weight} KG
Volume:                 ${shipment.volume} CBM

───────────────────────────────────────────────────────────────────
CONTAINER INFORMATION
───────────────────────────────────────────────────────────────────
Container Type:         ${shipment.containerShare.containerType} Container
Total Capacity:         ${shipment.containerShare.totalCapacity} CBM
Your Space:             ${shipment.containerShare.yourShare} CBM
Used Capacity:          ${shipment.containerShare.usedCapacity} CBM
Container Fill:         ${shipment.containerShare.fillPercentage}% full

───────────────────────────────────────────────────────────────────
COST BREAKDOWN
───────────────────────────────────────────────────────────────────
Base Cargo Rate:        ${formatCurrency(shipment.pricing.yourBaseCost)}
Booking Fee:            ${formatCurrency(shipment.pricing.bookingFee)}
Service Fee:            ${formatCurrency(shipment.pricing.serviceFee)}
Management Fee:         ${formatCurrency(shipment.pricing.managementFee)}
───────────────────────────────────────────────────────────────────
Total Cost:             ${formatCurrency(shipment.pricing.totalCost)}
Savings vs Full Container: ${formatCurrency(shipment.pricing.savings)} (${shipment.pricing.savingsPercentage}%)

───────────────────────────────────────────────────────────────────
TRACKING TIMELINE
───────────────────────────────────────────────────────────────────
${shipment.milestones.map((m, i) => `
${i + 1}. ${m.event}
   Location: ${m.location}
   Date: ${m.timestamp}
   Status: ${m.completed ? "✓ Completed" : m.current ? "● Current" : "○ Pending"}
`).join("")}

───────────────────────────────────────────────────────────────────
CO-SHIPPERS (${shipment.coShippers.length})
───────────────────────────────────────────────────────────────────
${shipment.coShippers.map((cs, i) => `
${i + 1}. ${cs.name}
   Cargo Type: ${cs.cargoType}
   Volume: ${cs.volumeShare} CBM
   Verification: ${cs.verificationLevel.toUpperCase()}
`).join("")}

═══════════════════════════════════════════════════════════════════
                  END OF REPORT
═══════════════════════════════════════════════════════════════════
    `;

    // Create blob and download
    const element = document.createElement("a");
    const file = new Blob([reportContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Shipment_${shipment.trackingNumber}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  return (
    <div className="min-h-screen pt-16 bg-navy">
      {/* Header */}
      <div className="border-b border-border bg-navy-mid/60 backdrop-blur-sm sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/shipments")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-700 text-foreground">{shipment.trackingNumber}</h1>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-600 ${getStatusColor(shipment.status)}`}>
                    {getStatusLabel(shipment.status)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {shipment.origin.split("(")[0].trim()} → {shipment.destination.split("(")[0].trim()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                <Share2 size={16} />
              </button>
              <button 
                onClick={handleDownloadReport}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                title="Download shipment report"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Banner */}
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Map size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-600 text-foreground">
                {currentMilestone ? currentMilestone.event : getStatusLabel(shipment.status)}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentMilestone ? `At ${currentMilestone.location}` : `Completed ${completedCount} of ${shipment.milestones.length} milestones`}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Departed</p>
              <p className="font-600 text-foreground text-sm mt-0.5">{formatDate(shipment.departureDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ETA</p>
              <p className="font-600 text-primary text-sm mt-0.5">{formatDate(shipment.estimatedArrival)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="font-600 text-foreground text-sm mt-0.5">{completedCount}/{shipment.milestones.length} steps</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 rounded-full bg-navy-light overflow-hidden">
            <div
              className="h-full gradient-teal rounded-full transition-all duration-700"
              style={{ width: `${(completedCount / shipment.milestones.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tracking */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-2xl border border-border bg-navy-mid/70 p-5">
              <h2 className="font-display font-600 text-foreground mb-5">Tracking Timeline</h2>
              <TrackingTimeline milestones={shipment.milestones} />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Cargo & Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-navy-mid/70 p-5">
                <h3 className="font-600 text-foreground mb-4">Cargo Details</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Cargo Type", value: shipment.cargoType },
                    { label: "Weight", value: `${shipment.weight.toLocaleString()} KG` },
                    { label: "Volume", value: `${shipment.volume} CBM` },
                    { label: "Booked On", value: formatDate(shipment.createdAt) },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-500 text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-navy-mid/70 p-5">
                <h3 className="font-600 text-foreground mb-4">Container Share</h3>
                <div className="space-y-2.5 mb-4">
                  {[
                    { label: "Container Type", value: shipment.containerShare.containerType },
                    { label: "Total Capacity", value: `${shipment.containerShare.totalCapacity} CBM` },
                    { label: "Your Space", value: `${shipment.containerShare.yourShare} CBM` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-500 text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
                <ContainerFillBar
                  fillPercentage={shipment.containerShare.fillPercentage}
                  yourShare={shipment.containerShare.yourShare}
                  totalCapacity={shipment.containerShare.totalCapacity}
                />
              </div>
            </div>

            {/* Pricing */}
            <PricingBreakdown pricing={shipment.pricing} />

            {/* Co-shippers */}
            <div className="rounded-2xl border border-border bg-navy-mid/70 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-600 text-foreground">Co-Shippers in This Container</h3>
                <span className="text-xs text-muted-foreground">{shipment.coShippers.length} shippers</span>
              </div>
              <CoShipperList coShippers={shipment.coShippers} />
            </div>

            {/* Key savings highlight */}
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">You saved on this shipment</p>
                <p className="text-3xl font-700 font-display text-emerald-400 mt-0.5">
                  {formatCurrency(shipment.pricing.savings)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">vs. full container</p>
                <p className="text-4xl font-700 font-display text-emerald-400/80 mt-0.5">
                  {shipment.pricing.savingsPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
