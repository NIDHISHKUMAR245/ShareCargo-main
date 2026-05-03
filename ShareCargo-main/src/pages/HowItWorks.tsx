import { ArrowRight, Package, Search, FileText, Truck, Shield, Clock, Globe, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthDialog } from "@/hooks/useAuthDialog";

const STEPS = [
  {
    icon: Package,
    step: "Step 1",
    title: "Enter Your Shipment Details",
    description: "Tell us about your cargo — type, weight, volume in CBM, and any special requirements like temperature control or hazmat classification.",
    details: [
      "Origin and destination port selection from 180+ global ports",
      "Preferred departure date and timeline flexibility (±1–14 days)",
      "Cargo type, weight in KG, and volume in Cubic Meters (CBM)",
      "Special requirements: hazardous, temperature-controlled, fragile",
    ],
    color: "teal",
  },
  {
    icon: Search,
    step: "Step 2",
    title: "AI Finds Compatible Matches",
    description: "Our matching engine analyzes active containers on your route, evaluating timeline alignment, cargo compatibility, and space availability.",
    details: [
      "Real-time scanning of 1,000+ active shared containers globally",
      "Cargo compatibility check — no conflicting goods in same container",
      "Match score based on timeline, space fit, and co-shipper trust levels",
      "Auto-match recommended + browse alternative containers option",
    ],
    color: "amber",
  },
  {
    icon: FileText,
    step: "Step 3",
    title: "Review Pricing & Book Securely",
    description: "View a fully transparent breakdown of your cost — base rate, booking fee, service fee, and management fee. No hidden charges.",
    details: [
      "Base cargo rate: your proportional share of the container lease",
      "Booking fee: flat processing and documentation fee",
      "Service fee: platform support, coordination and cargo value based",
      "Container sharing management fee: multi-shipper scheduling",
    ],
    color: "emerald",
  },
  {
    icon: Truck,
    step: "Step 4",
    title: "Track Your Cargo in Real-Time",
    description: "From port pickup to final delivery, track every milestone on your dashboard. Receive notifications at each stage.",
    details: [
      "Live vessel position updated every 4 hours",
      "Milestone alerts: departed, transshipment, arrived, delivered",
      "Estimated arrival windows updated dynamically",
      "Full tracking history saved to your account",
    ],
    color: "teal",
  },
];

const PRICING_ITEMS = [
  { label: "Base Cargo Rate", desc: "Calculated as your CBM volume ÷ total container CBM × full container market rate.", icon: Package },
  { label: "Booking Fee", desc: "Flat $35–$45 fee covering documentation, customs filing coordination, and processing.", icon: FileText },
  { label: "Service Fee", desc: "Platform coordination fee, calculated as a percentage of your base cargo cost (typically 8–12%).", icon: Shield },
  { label: "Container Sharing Management Fee", desc: "Covers scheduling coordination, container allocation, and multi-shipper logistics management.", icon: Globe },
];

const FAQS = [
  { q: "Is my cargo safe in a shared container?", a: "Yes. All co-shippers are KYC-verified. Our cargo compatibility algorithm ensures no conflicting goods are placed together. The container is sealed and professionally managed." },
  { q: "What if my cargo doesn't fill the matched space?", a: "You only pay for the exact CBM you declare. Your cost is calculated on your declared volume, not the available space in the container." },
  { q: "How long does matching take?", a: "Most shipments are matched within 2–24 hours for popular trade lanes. Less common routes may take up to 48 hours. You can also browse available containers manually." },
  { q: "What cargo types are not allowed?", a: "Standalone hazardous materials are allowed with proper declarations. Illegal goods, live animals, and certain perishables require pre-approval. Check our cargo guidelines during booking." },
  { q: "Can I cancel or change my booking?", a: "Yes. Cancellations made more than 72 hours before container departure receive a full refund of the base rate. Booking fees are non-refundable. Changes may incur a modification fee." },
];

export default function HowItWorks() {
  const { showDialog, handleStartShipment, handleLogin, handleSignup, handleClose } = useAuthDialog();

  return (
    <div className="min-h-screen pt-16">
      {/* Auth Dialog */}
      <AlertDialog open={showDialog} onOpenChange={handleClose}>
        <AlertDialogContent className="bg-navy-mid border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Start Your Shipment</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              To book a shared container, you need to create an account or log in. It takes just 2 minutes!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 mt-6">
            <AlertDialogCancel onClick={handleClose} className="flex-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogin} className="flex-1 bg-teal hover:bg-teal/90 text-navy">
              Login / Sign Up
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-600 mb-6">
          <Clock size={12} />
          Match in under 24 hours
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-700 text-foreground mb-5">
          How ShareCargo Works
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          From entering your cargo details to real-time delivery tracking — our platform makes container sharing as simple as booking a flight. Here's exactly how it works.
        </p>
      </section>

      {/* Steps */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="space-y-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 !== 0;
            return (
              <div
                key={step.step}
                className={`flex flex-col ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}
              >
                {/* Visual */}
                <div className="w-full lg:w-5/12 shrink-0">
                  <div className={`rounded-2xl border p-8 h-56 flex items-center justify-center relative overflow-hidden ${
                    step.color === "teal" ? "border-primary/25 bg-primary/5" :
                    step.color === "amber" ? "border-yellow-400/25 bg-yellow-400/5" :
                    "border-emerald-400/25 bg-emerald-400/5"
                  }`}>
                    <div className={`absolute top-4 right-4 text-7xl font-700 font-display opacity-5 ${
                      step.color === "teal" ? "text-primary" :
                      step.color === "amber" ? "text-yellow-400" :
                      "text-emerald-400"
                    }`}>
                      {step.step.split(" ")[1]}
                    </div>
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                      step.color === "teal" ? "bg-primary/15 text-primary" :
                      step.color === "amber" ? "bg-yellow-400/15 text-yellow-400" :
                      "bg-emerald-400/15 text-emerald-400"
                    }`}>
                      <Icon size={36} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-7/12">
                  <div className={`text-xs font-700 tracking-wider uppercase mb-2 ${
                    step.color === "teal" ? "text-primary" :
                    step.color === "amber" ? "text-yellow-400" :
                    "text-emerald-400"
                  }`}>
                    {step.step}
                  </div>
                  <h2 className="text-2xl font-display font-700 text-foreground mb-3">{step.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-5">{step.description}</p>
                  <ul className="space-y-2.5">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          step.color === "teal" ? "bg-primary" :
                          step.color === "amber" ? "bg-yellow-400" :
                          "bg-emerald-400"
                        }`} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Explained */}
      <section className="py-20 bg-navy-mid/40 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-600 tracking-wider uppercase mb-3">Transparent Pricing</p>
            <h2 className="text-3xl font-display font-700 text-foreground">No Hidden Fees. Ever.</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Every cost component is disclosed upfront before you confirm your booking.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRICING_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="glass-card rounded-xl p-5 flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Icon size={17} />
                  </div>
                  <div>
                    <h3 className="font-600 text-sm text-foreground mb-1">{item.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Savings illustration */}
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="text-emerald-400" size={22} />
              <h3 className="font-display font-600 text-foreground">Example Savings Calculation</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: "Full Container Cost", value: "$4,800", sub: "40ft Shanghai→Rotterdam" },
                { label: "Your Space (8.5 CBM)", value: "$610", sub: "Base proportional rate" },
                { label: "All Fees Combined", value: "$155", sub: "Booking + Service + Mgmt" },
                { label: "Your Total", value: "$765", sub: "84% less than full container" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-navy-mid/60 p-4">
                  <p className="text-xl font-700 font-display text-emerald-400">{item.value}</p>
                  <p className="text-xs font-600 text-foreground mt-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-700 text-foreground text-center mb-10">Common Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-border bg-navy-mid/60 p-5">
              <h3 className="font-600 text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 text-center px-4">
        <h2 className="text-2xl font-display font-700 text-foreground mb-4">Ready to book your first shared container?</h2>
        <Button
          onClick={handleStartShipment}
          size="lg"
          className="gradient-teal text-navy font-700 gap-2 hover:opacity-90 teal-glow"
        >
          Start a Shipment <ArrowRight size={18} />
        </Button>
      </section>
    </div>
  );
}
