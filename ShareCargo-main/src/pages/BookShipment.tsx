import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Package, MapPin, Calendar, Zap, CheckCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PORTS, CARGO_TYPES, MOCK_MATCHES } from "@/constants/mockData";
import ContainerFillBar from "@/components/features/ContainerFillBar";
import PricingBreakdown from "@/components/features/PricingBreakdown";
import CoShipperList from "@/components/features/CoShipperList";
import { formatDate } from "@/lib/utils";
import type { ContainerMatch } from "@/types";
import { cn } from "@/lib/utils";

type Step = "details" | "matching" | "review" | "confirmed";

const STEPS_META = [
  { key: "details", label: "Shipment Details", icon: Package },
  { key: "matching", label: "Container Matches", icon: Zap },
  { key: "review", label: "Review & Book", icon: CheckCircle },
];

export default function BookShipment() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [isMatching, setIsMatching] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<ContainerMatch | null>(null);

  // Date constraints
  const minDate = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const maxDate = useMemo(() => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    const yyyy = futureDate.getFullYear();
    const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
    const dd = String(futureDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);
  const [form, setForm] = useState({
    originPort: "",
    destinationPort: "",
    cargoType: "",
    cargoDescription: "",
    weight: "",
    volume: "",
    readyDate: "",
    preferredDeparture: "",
    flexibilityDays: "3",
    hazardous: false,
    temperatureControlled: false,
  });

  const updateForm = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFindMatches = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setStep("matching");
    }, 2200);
  };

  const handleSelectMatch = (match: ContainerMatch) => {
    setSelectedMatch(match);
    setStep("review");
  };

  const handleConfirmBooking = () => {
    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem("sc_bookings") || "[]");
    bookings.push({
      id: `shp-new-${Date.now()}`,
      matchId: selectedMatch?.id,
      ...form,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("sc_bookings", JSON.stringify(bookings));
    navigate("/payment");
  };

  const validateForm = () => {
    return (
      form.originPort.trim() !== "" &&
      form.destinationPort.trim() !== "" &&
      form.cargoType.trim() !== "" &&
      form.cargoDescription.trim() !== "" &&
      form.weight.trim() !== "" &&
      form.volume.trim() !== "" &&
      form.readyDate.trim() !== "" &&
      form.preferredDeparture.trim() !== ""
    );
  };

  const stepIndex = ["details", "matching", "review"].indexOf(step);



  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border bg-navy-mid/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-display font-700 text-foreground mb-5">Book a Shared Container</h1>
          {/* Step progress */}
          <div className="flex items-center gap-0">
            {STEPS_META.map((s, i) => {
              const Icon = s.icon;
              const active = i === stepIndex;
              const done = i < stepIndex;
              return (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-500 transition-all",
                    active ? "text-primary bg-primary/10" :
                    done ? "text-emerald-400 bg-emerald-400/10" :
                    "text-muted-foreground"
                  )}>
                    {done ? <CheckCircle size={15} /> : <Icon size={15} />}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </div>
                  {i < STEPS_META.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-2", done ? "bg-emerald-400/40" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STEP 1: Details */}
        {step === "details" && (
          <div className="animate-fade-in space-y-6">
            {/* Route */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-600 text-foreground mb-4 flex items-center gap-2">
                <MapPin size={17} className="text-primary" /> Route
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Origin Port</label>
                  <select
                    value={form.originPort}
                    onChange={(e) => updateForm("originPort", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  >
                    <option value="">Select origin port...</option>
                    {PORTS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Destination Port</label>
                  <select
                    value={form.destinationPort}
                    onChange={(e) => updateForm("destinationPort", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  >
                    <option value="">Select destination port...</option>
                    {PORTS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Cargo */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-600 text-foreground mb-4 flex items-center gap-2">
                <Package size={17} className="text-primary" /> Cargo Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Cargo Type</label>
                  <select
                    value={form.cargoType}
                    onChange={(e) => updateForm("cargoType", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="">Select cargo type...</option>
                    {CARGO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Description</label>
                  <input
                    type="text"
                    value={form.cargoDescription}
                    onChange={(e) => updateForm("cargoDescription", e.target.value)}
                    placeholder="Brief cargo description..."
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Weight (KG)</label>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => updateForm("weight", e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Volume (CBM)</label>
                  <input
                    type="number"
                    value={form.volume}
                    onChange={(e) => updateForm("volume", e.target.value)}
                    placeholder="e.g. 8.5"
                    step="0.5"
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.hazardous} onChange={(e) => updateForm("hazardous", e.target.checked)} className="w-4 h-4 accent-teal rounded" />
                  <span className="text-sm text-muted-foreground">Hazardous Materials</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.temperatureControlled} onChange={(e) => updateForm("temperatureControlled", e.target.checked)} className="w-4 h-4 accent-teal rounded" />
                  <span className="text-sm text-muted-foreground">Temperature Controlled</span>
                </label>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-600 text-foreground mb-4 flex items-center gap-2">
                <Calendar size={17} className="text-primary" /> Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Cargo Ready Date</label>
                  <input
                    type="date"
                    value={form.readyDate}
                    onChange={(e) => updateForm("readyDate", e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Preferred Departure</label>
                  <input
                    type="date"
                    value={form.preferredDeparture}
                    onChange={(e) => updateForm("preferredDeparture", e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-2">Flexibility (days ±)</label>
                  <select
                    value={form.flexibilityDays}
                    onChange={(e) => updateForm("flexibilityDays", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
                  >
                    {["1", "3", "5", "7", "10", "14"].map((d) => (
                      <option key={d} value={d}>±{d} days</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 flex-col sm:flex-row">
              {!validateForm() && (
                <div className="text-sm text-amber-400 flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
                  <span>ℹ️ Please fill in all shipment details</span>
                </div>
              )}
              <Button
                onClick={handleFindMatches}
                className="gradient-teal text-navy font-700 gap-2 teal-glow hover:opacity-90 px-6"
                disabled={isMatching || !validateForm()}
              >
                {isMatching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>Find Container Matches <Zap size={16} /></>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Matching */}
        {step === "matching" && (
          <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-display font-700 text-foreground">3 Container Matches Found</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Sorted by match score · Shanghai → Rotterdam</p>
              </div>
              <button onClick={() => setStep("details")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={15} /> Edit Details
              </button>
            </div>

            {MOCK_MATCHES.map((match) => (
              <div
                key={match.id}
                className="rounded-2xl border border-border hover:border-primary/40 bg-navy-mid/70 hover:bg-navy-mid transition-all duration-200 overflow-hidden"
              >
                {match.matchScore >= 90 && (
                  <div className="px-4 py-2 gradient-teal flex items-center gap-2">
                    <Zap size={13} className="text-navy" />
                    <span className="text-navy text-xs font-700">Best Match Recommended</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-5">
                    {/* Match info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-700 text-lg text-foreground">{match.containerType} Container</span>
                            <span className={cn(
                              "text-xs font-700 px-2.5 py-1 rounded-full",
                              match.matchScore >= 90 ? "bg-primary/15 text-primary" :
                              match.matchScore >= 80 ? "bg-yellow-400/15 text-yellow-400" :
                              "bg-white/10 text-muted-foreground"
                            )}>
                              {match.matchScore}% match
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{match.shippingLine}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: "Departure", value: formatDate(match.departureDate) },
                          { label: "Transit Time", value: `${match.estimatedTransitDays} days` },
                          { label: "Available Space", value: `${match.availableSpace} CBM` },
                          { label: "Co-shippers", value: `${match.currentShippers} active` },
                        ].map((item) => (
                          <div key={item.label} className="rounded-lg bg-white/3 px-3 py-2">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-sm font-600 text-foreground mt-0.5">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <ContainerFillBar
                        fillPercentage={Math.round(((67 - match.availableSpace) / 67) * 100)}
                        yourShare={parseFloat(form.volume) || 5}
                        totalCapacity={match.containerType === "20ft" ? 33 : match.containerType === "40ft HC" ? 76 : 67}
                        showLabels={false}
                      />

                      <CoShipperList coShippers={match.coShippers} compact />
                    </div>

                    {/* Pricing + CTA */}
                    <div className="w-full md:w-56 shrink-0 space-y-3">
                      <div className="rounded-xl border border-border bg-white/3 p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Your Total Cost</p>
                        <p className="text-2xl font-700 font-display text-primary">${match.pricing.totalCost}</p>
                        <div className="mt-2 px-2 py-1 rounded-full bg-emerald-400/10 text-xs text-emerald-400 font-600">
                          Save ${match.pricing.savings} ({match.pricing.savingsPercentage}%)
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSelectMatch(match)}
                        className="w-full gradient-teal text-navy font-700 hover:opacity-90 teal-glow"
                      >
                        Select This Match
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: Review */}
        {step === "review" && selectedMatch && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep("matching")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-xl font-display font-700 text-foreground">Review Your Booking</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                {/* Container summary */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-600 text-foreground mb-4">Container Details</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Container Type", value: selectedMatch.containerType },
                      { label: "Shipping Line", value: selectedMatch.shippingLine },
                      { label: "Route", value: `${selectedMatch.originPort.split("(")[0]} → ${selectedMatch.destinationPort.split("(")[0]}` },
                      { label: "Departure", value: formatDate(selectedMatch.departureDate) },
                      { label: "Est. Transit", value: `${selectedMatch.estimatedTransitDays} days` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-500 text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-border my-3" />
                  <ContainerFillBar
                    fillPercentage={Math.round(((67 - selectedMatch.availableSpace) / 67) * 100)}
                    yourShare={parseFloat(form.volume) || 5}
                    totalCapacity={67}
                  />
                </div>

                {/* Co-shippers */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-600 text-foreground mb-4">Your Co-Shippers</h3>
                  <CoShipperList coShippers={selectedMatch.coShippers} />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <PricingBreakdown pricing={selectedMatch.pricing} />

                {/* Terms */}
                <div className="glass-card rounded-xl p-4 border-yellow-400/20 bg-yellow-400/5">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By confirming this booking, you agree to ShareCargo's Terms of Service, Cargo Compatibility Policy, and the Container Sharing Agreement. Cancellations 72+ hours before departure receive a full base rate refund.
                  </p>
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  className="w-full gradient-teal text-navy font-700 text-base py-3 teal-glow hover:opacity-90 gap-2"
                >
                  <CreditCard size={18} />
                  Proceed to Payment — ${selectedMatch.pricing.totalCost}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
