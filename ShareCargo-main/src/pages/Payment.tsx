import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard, Lock, CheckCircle, ArrowLeft, Ship, Shield,
  Package, MapPin, Calendar, ChevronRight, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface PaymentDetails {
  // Transportation
  freightRate: number;
  fuelSurcharge: number;
  portHandling: number;
  // Arrangement
  containerArrangementFee: number;
  documentationFee: number;
  customsClearanceFee: number;
  // Platform
  bookingFee: number;
  serviceFee: number;
  managementFee: number;
  // Meta
  currency: string;
  shipmentRef: string;
  route: string;
  departure: string;
  containerType: string;
  shippingLine: string;
  volume: number;
}

type PayStep = "review" | "card" | "processing" | "success";

function buildPaymentFromStorage(): PaymentDetails {
  // Try to load from last booking or use demo data
  try {
    const bookings = JSON.parse(localStorage.getItem("sc_bookings") || "[]");
    const last = bookings[bookings.length - 1];
    if (last) {
      return {
        freightRate: 580,
        fuelSurcharge: 140,
        portHandling: 95,
        containerArrangementFee: 220,
        documentationFee: 65,
        customsClearanceFee: 110,
        bookingFee: 45,
        serviceFee: 86,
        managementFee: 46,
        currency: "USD",
        shipmentRef: `SC${Date.now().toString().slice(-8)}-TL`,
        route: `${last.originPort || "Shanghai, CN"} → ${last.destinationPort || "Rotterdam, NL"}`,
        departure: last.preferredDeparture || "2025-01-22",
        containerType: "40ft Container",
        shippingLine: "COSCO Shipping",
        volume: parseFloat(last.volume) || 8.5,
      };
    }
  } catch {
    // fall through
  }
  // Demo defaults
  return {
    freightRate: 580,
    fuelSurcharge: 140,
    portHandling: 95,
    containerArrangementFee: 220,
    documentationFee: 65,
    customsClearanceFee: 110,
    bookingFee: 45,
    serviceFee: 86,
    managementFee: 46,
    currency: "USD",
    shipmentRef: "SC20250122-8821-TL",
    route: "Shanghai, China → Rotterdam, Netherlands",
    departure: "2025-01-22",
    containerType: "40ft Container",
    shippingLine: "COSCO Shipping",
    volume: 8.5,
  };
}

const CARD_BRANDS: Record<string, string> = {
  "4": "VISA",
  "5": "MC",
  "3": "AMEX",
  "6": "DISC",
};

function detectBrand(num: string) {
  return CARD_BRANDS[num[0]] || "";
}

function formatCardNum(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<PayStep>("review");
  const [progress, setProgress] = useState(0);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [saveCard, setSaveCard] = useState(false);

  const p = buildPaymentFromStorage();

  // Totals
  const transportationTotal = p.freightRate + p.fuelSurcharge + p.portHandling;
  const arrangementTotal = p.containerArrangementFee + p.documentationFee + p.customsClearanceFee;
  const platformTotal = p.bookingFee + p.serviceFee + p.managementFee;
  const grandTotal = transportationTotal + arrangementTotal + platformTotal;

  const fullContainerEstimate = Math.round(grandTotal / 0.19);
  const savings = fullContainerEstimate - grandTotal;
  const savingsPct = Math.round((savings / fullContainerEstimate) * 100);

  // Processing animation
  useEffect(() => {
    if (step !== "processing") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("success"), 400);
          return 100;
        }
        return prev + Math.random() * 18;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [step]);

  const validateCard = () => {
    const errs: Record<string, string> = {};
    const num = card.number.replace(/\s/g, "");
    if (num.length < 13) errs.number = "Enter a valid card number";
    if (!card.name.trim()) errs.name = "Cardholder name is required";
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = "Use MM/YY format";
    if (card.cvv.length < 3) errs.cvv = "Enter a valid CVV";
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = () => {
    if (!validateCard()) return;
    setStep("processing");
    setProgress(0);
  };

  // ── REVIEW ──────────────────────────────────────────────────────────────────
  const ReviewSection = ({
    title, icon: Icon, color, items, total,
  }: {
    title: string; icon: typeof Lock; color: string;
    items: { label: string; amount: number; desc?: string }[];
    total: number;
  }) => (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className={cn("px-5 py-3.5 flex items-center gap-2.5 border-b border-border", `bg-${color}/5`)}>
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", `bg-${color}/15`)}>
          <Icon size={15} className={`text-${color}`} />
        </div>
        <span className="font-display font-600 text-foreground text-sm">{title}</span>
        <span className={cn("ml-auto text-sm font-700 font-display", `text-${color}`)}>
          {formatCurrency(total, p.currency)}
        </span>
      </div>
      <div className="px-5 py-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-start justify-between">
            <div>
              <p className="text-sm text-foreground">{item.label}</p>
              {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
            </div>
            <span className="text-sm font-500 text-foreground shrink-0 ml-4">{formatCurrency(item.amount, p.currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (step === "success") {
    const txRef = `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-400/15 flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-400/20">
            <CheckCircle size={38} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-display font-700 text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">Your container share is fully booked and confirmed.</p>

          <div className="glass-card rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-xs font-600 text-primary">{txRef}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipment Ref</span>
              <span className="font-mono text-xs font-600 text-foreground">{p.shipmentRef}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-700 text-foreground">{formatCurrency(grandTotal, p.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Route</span>
              <span className="font-500 text-foreground text-right max-w-[200px]">{p.route}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Departure</span>
              <span className="font-500 text-foreground">{formatDate(p.departure)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between text-sm">
              <span className="text-muted-foreground">Total Saved</span>
              <span className="font-700 text-emerald-400">{formatCurrency(savings, p.currency)} ({savingsPct}%)</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/shipments")} className="gradient-teal text-navy font-700 gap-2">
              <Ship size={16} /> Track My Shipment
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-border hover:bg-white/5">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    const clampedProgress = Math.min(progress, 100);
    const stages = [
      { threshold: 0, label: "Verifying payment details..." },
      { threshold: 30, label: "Contacting payment gateway..." },
      { threshold: 60, label: "Authorizing transaction..." },
      { threshold: 85, label: "Confirming container booking..." },
    ];
    const currentStage = [...stages].reverse().find((s) => clampedProgress >= s.threshold) || stages[0];

    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center animate-fade-in">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div
              className="absolute inset-0 rounded-full border-4 border-primary border-r-transparent border-b-transparent transition-all duration-300"
              style={{ transform: `rotate(${(clampedProgress / 100) * 360}deg)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock size={22} className="text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-display font-700 text-foreground mb-2">Processing Payment</h2>
          <p className="text-sm text-muted-foreground mb-6">{currentStage.label}</p>

          <div className="w-full bg-border rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="h-2 gradient-teal rounded-full transition-all duration-300"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{Math.round(clampedProgress)}% complete</p>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock size={12} />
            Secured with 256-bit SSL encryption
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border bg-navy-mid/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-display font-700 text-foreground">Complete Payment</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Ref: {p.shipmentRef}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock size={13} className="text-primary" />
              Secure 256-bit SSL
            </div>
          </div>

          {/* Step pills */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { key: "review", label: "Review" },
              { key: "card", label: "Payment" },
              { key: "success", label: "Confirmed" },
            ].map((s, i, arr) => (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-600 transition-all",
                  step === s.key ? "bg-primary/15 text-primary" :
                  (step === "card" && i === 0) || step === "success" ? "text-emerald-400 bg-emerald-400/10" :
                  "text-muted-foreground"
                )}>
                  {((step === "card" && i === 0) || step === "success") ? <CheckCircle size={12} /> : null}
                  {s.label}
                </div>
                {i < arr.length - 1 && <ChevronRight size={14} className="text-border mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STEP: REVIEW */}
        {step === "review" && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Shipment info */}
              <div className="glass-card rounded-2xl p-5">
                <h2 className="font-display font-600 text-foreground mb-4 flex items-center gap-2">
                  <Ship size={16} className="text-primary" /> Shipment Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Route</p>
                      <p className="text-sm font-500 text-foreground leading-snug">{p.route}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar size={15} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Departure</p>
                      <p className="text-sm font-500 text-foreground">{formatDate(p.departure)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Package size={15} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Container</p>
                      <p className="text-sm font-500 text-foreground">{p.containerType}</p>
                      <p className="text-xs text-muted-foreground">{p.shippingLine}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Transportation */}
              <ReviewSection
                title="Container Transportation"
                icon={Ship}
                color="primary"
                total={transportationTotal}
                items={[
                  { label: "Sea freight rate (pro-rated)", amount: p.freightRate, desc: `Your ${p.volume} CBM share of container space` },
                  { label: "Fuel surcharge (BAF)", amount: p.fuelSurcharge, desc: "Bunker adjustment factor" },
                  { label: "Port handling & terminal fee", amount: p.portHandling, desc: "Origin + destination terminal charges" },
                ]}
              />

              {/* Section 2: Arrangement */}
              <ReviewSection
                title="Container Arrangement Fee"
                icon={Zap}
                color="yellow-400"
                total={arrangementTotal}
                items={[
                  { label: "Container arrangement & coordination", amount: p.containerArrangementFee, desc: "Multi-shipper logistics scheduling" },
                  { label: "Documentation & B/L issuance", amount: p.documentationFee, desc: "Bill of lading and cargo documentation" },
                  { label: "Customs clearance support", amount: p.customsClearanceFee, desc: "Destination customs processing" },
                ]}
              />

              {/* Section 3: Platform */}
              <ReviewSection
                title="Platform Fees"
                icon={Shield}
                color="emerald-400"
                total={platformTotal}
                items={[
                  { label: "Booking fee", amount: p.bookingFee, desc: "One-time processing fee" },
                  { label: "Service fee", amount: p.serviceFee, desc: "Platform coordination & support" },
                  { label: "Container sharing management fee", amount: p.managementFee, desc: "AI matching & co-shipper management" },
                ]}
              />
            </div>

            {/* Right: Summary sticky panel */}
            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-5 sticky top-20">
                <h3 className="font-display font-600 text-foreground mb-4">Payment Summary</h3>

                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transportation</span>
                    <span className="font-500 text-foreground">{formatCurrency(transportationTotal, p.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Arrangement fees</span>
                    <span className="font-500 text-foreground">{formatCurrency(arrangementTotal, p.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fees</span>
                    <span className="font-500 text-foreground">{formatCurrency(platformTotal, p.currency)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-600 text-foreground">Total Due</span>
                    <span className="text-2xl font-700 font-display text-primary">{formatCurrency(grandTotal, p.currency)}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-400/8 border border-emerald-400/20 p-3 mb-5">
                  <p className="text-xs text-emerald-400 font-600 mb-0.5">Your savings</p>
                  <p className="text-sm text-emerald-400">
                    <strong>{formatCurrency(savings, p.currency)}</strong> saved ({savingsPct}%) vs. booking a full container
                  </p>
                </div>

                <Button
                  onClick={() => setStep("card")}
                  className="w-full gradient-teal text-navy font-700 gap-2 teal-glow hover:opacity-90"
                >
                  Proceed to Payment <ChevronRight size={16} />
                </Button>

                <div className="mt-4 flex items-center justify-center gap-4">
                  {["VISA", "MC", "AMEX", "DISC"].map((b) => (
                    <span key={b} className="text-[10px] font-700 px-2 py-1 rounded border border-border text-muted-foreground">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP: CARD */}
        {step === "card" && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
              {/* Card form */}
              <div className="glass-card rounded-2xl p-6 space-y-5">
                <h2 className="font-display font-600 text-foreground flex items-center gap-2">
                  <CreditCard size={17} className="text-primary" /> Card Details
                </h2>

                {/* Visual card */}
                <div className={cn(
                  "relative h-44 rounded-2xl p-5 overflow-hidden",
                  "bg-gradient-to-br from-navy-mid via-navy-light to-navy-mid border border-border"
                )}>
                  <div className="absolute top-4 right-4 text-xs font-700 text-muted-foreground/60">
                    {detectBrand(card.number.replace(/\s/g, "")) || "CARD"}
                  </div>
                  <Ship size={22} className="text-primary/40 mb-4" />
                  <p className="font-mono text-lg font-600 text-foreground tracking-widest mb-3">
                    {card.number || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Cardholder</p>
                      <p className="text-sm font-500 text-foreground">{card.name || "YOUR NAME"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Expires</p>
                      <p className="text-sm font-500 text-foreground">{card.expiry || "MM/YY"}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                  </div>
                </div>

                {/* Fields */}
                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-1.5">Card Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) => setCard((c) => ({ ...c, number: formatCardNum(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm font-mono focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40 placeholder:font-sans",
                      cardErrors.number ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20" : "border-border focus:border-primary focus:ring-primary/20"
                    )}
                  />
                  {cardErrors.number && <p className="text-xs text-red-400 mt-1">{cardErrors.number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
                    placeholder="AS ON CARD"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40",
                      cardErrors.name ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20" : "border-border focus:border-primary focus:ring-primary/20"
                    )}
                  />
                  {cardErrors.name && <p className="text-xs text-red-400 mt-1">{cardErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-500 text-muted-foreground mb-1.5">Expiry</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm font-mono focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40 placeholder:font-sans",
                        cardErrors.expiry ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20" : "border-border focus:border-primary focus:ring-primary/20"
                      )}
                    />
                    {cardErrors.expiry && <p className="text-xs text-red-400 mt-1">{cardErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-500 text-muted-foreground mb-1.5">CVV</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      value={card.cvv}
                      onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="•••"
                      maxLength={4}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm font-mono focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40 placeholder:font-sans",
                        cardErrors.cvv ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20" : "border-border focus:border-primary focus:ring-primary/20"
                      )}
                    />
                    {cardErrors.cvv && <p className="text-xs text-red-400 mt-1">{cardErrors.cvv}</p>}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 accent-teal"
                  />
                  <span className="text-sm text-muted-foreground">Save card for future shipments</span>
                </label>
              </div>

              {/* Right summary */}
              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground mb-3">Paying for</p>
                  <p className="text-sm font-600 text-foreground mb-1">{p.containerType} Share</p>
                  <p className="text-xs text-muted-foreground">{p.route}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(p.departure)}</p>

                  <div className="border-t border-border my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transportation</span>
                      <span>{formatCurrency(transportationTotal, p.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Arrangement</span>
                      <span>{formatCurrency(arrangementTotal, p.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform</span>
                      <span>{formatCurrency(platformTotal, p.currency)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-600 text-foreground">Total</span>
                    <span className="text-xl font-700 font-display text-primary">{formatCurrency(grandTotal, p.currency)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePay}
                  className="w-full gradient-teal text-navy font-700 gap-2 teal-glow hover:opacity-90 py-3"
                >
                  <Lock size={15} />
                  Pay {formatCurrency(grandTotal, p.currency)}
                </Button>

                <button
                  onClick={() => setStep("review")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 py-2 transition-colors"
                >
                  <ArrowLeft size={13} /> Back to review
                </button>

                <div className="rounded-xl bg-white/3 border border-border p-3 flex items-start gap-2.5">
                  <Shield size={14} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your payment is encrypted and processed securely. ShareCargo never stores your full card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
