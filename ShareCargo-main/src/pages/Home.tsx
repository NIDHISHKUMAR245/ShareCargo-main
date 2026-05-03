import { ArrowRight, Shield, Zap, TrendingDown, Globe, Users, BarChart3, CheckCircle, Star } from "lucide-react";
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
import heroImg from "@/assets/hero-port.jpg";
import cargoShipImg from "@/assets/cargo-ship.jpg";

const STATS = [
  { value: "84%", label: "Average Cost Savings" },
  { value: "1,200+", label: "Verified Shippers" },
  { value: "180+", label: "Trade Routes" },
  { value: "98.7%", label: "On-Time Delivery" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Enter Shipment Details", desc: "Provide cargo type, weight, volume, origin, destination, and your preferred timeline." },
  { step: "02", title: "AI Matches Your Container", desc: "Our algorithm finds verified shippers heading the same way with compatible cargo and timelines." },
  { step: "03", title: "Review & Book", desc: "See a transparent pricing breakdown. Choose your best match and confirm your booking securely." },
  { step: "04", title: "Track in Real-Time", desc: "Follow your cargo every step of the way from port to delivery on your live dashboard." },
];

const FEATURES = [
  { icon: Zap, title: "Instant Smart Matching", desc: "Our AI analyzes thousands of routes, timelines, and cargo types to find the most compatible container partners for you.", color: "teal" },
  { icon: TrendingDown, title: "Fair Cost Distribution", desc: "Pay only for the space you use. Our algorithm splits costs proportionally across all co-shippers in a container.", color: "emerald" },
  { icon: Globe, title: "180+ Global Routes", desc: "From major hubs to emerging markets. We cover the world's busiest trade lanes with reliable shipping partners.", color: "amber" },
  { icon: Shield, title: "Verified Users Only", desc: "All shippers are KYC-verified with background checks. Ship with confidence knowing who shares your container.", color: "teal" },
  { icon: BarChart3, title: "Real-Time Tracking", desc: "GPS-enabled milestone tracking with live vessel position updates. Know exactly where your cargo is at all times.", color: "emerald" },
  { icon: Users, title: "Community of Traders", desc: "Join a growing network of 1,200+ businesses and individuals who ship smarter and save more together.", color: "amber" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "E-commerce Owner, Toronto", text: "ShareCargo cut my shipping costs by 76%. What used to cost me $3,800 now costs $900. Total game-changer for my small business.", rating: 5 },
  { name: "Marcus Osei", role: "Import Trader, Accra", text: "The matching is incredibly fast. Within hours I had a confirmed container share from Shenzhen to Tema port. The tracking dashboard is excellent.", rating: 5 },
  { name: "Elena Popescu", role: "Furniture Importer, Bucharest", text: "I was skeptical about sharing containers, but the verified shipper system gave me real confidence. Third shipment in and zero issues.", rating: 5 },
];

export default function Home() {
  const { showDialog, handleStartShipment, handleLogin, handleSignup, handleClose } = useAuthDialog();

  return (
    <div className="min-h-screen">
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroImg} alt="Port" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
        </div>

        {/* Animated route SVG */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full opacity-15 hidden lg:block pointer-events-none">
          <svg viewBox="0 0 600 400" className="w-full h-full">
            <path d="M 50 200 Q 200 80 350 160 Q 450 220 560 140" fill="none" stroke="hsl(187,90%,42%)" strokeWidth="2" className="route-line" />
            <circle cx="50" cy="200" r="5" fill="hsl(187,90%,42%)" opacity="0.8" />
            <circle cx="350" cy="160" r="4" fill="hsl(187,90%,42%)" opacity="0.6" />
            <circle cx="560" cy="140" r="5" fill="hsl(187,90%,42%)" opacity="0.8" />
            <path d="M 80 300 Q 250 350 420 280 Q 500 250 560 300" fill="none" stroke="hsl(38,95%,54%)" strokeWidth="1.5" className="route-line" opacity="0.5" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-600 mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Smart Container Sharing — Now in 180+ Routes
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-700 leading-[1.1] text-foreground mb-6 animate-fade-in">
              Ship Smarter.<br />
              <span className="text-teal">Share the Container.</span><br />
              Save Up to 84%.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl animate-fade-in">
              ShareCargo connects businesses heading to the same destination so you only pay for the container space you actually need. Intelligent matching, transparent pricing, and real-time tracking — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
              <Button
                onClick={handleStartShipment}
                size="lg"
                className="gradient-teal text-navy font-700 text-base hover:opacity-90 transition-opacity gap-2 teal-glow"
              >
                Start a Shipment <ArrowRight size={18} />
              </Button>
              <Button
                onClick={() => window.location.href = "/how-it-works"}
                variant="outline"
                size="lg"
                className="border-white/15 text-foreground hover:bg-white/5 text-base font-600"
              >
                See How It Works
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
              {["No credit card required", "Free to get matched", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-navy-mid/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-border">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-700 font-display text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-600 tracking-wider uppercase mb-3">Process</p>
          <h2 className="text-3xl sm:text-4xl font-display font-700 text-foreground">Ship in 4 Simple Steps</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">From shipment details to real-time tracking — designed to get you moving fast.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, index) => (
            <div key={step.step} className="relative">
              {index < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/40 to-transparent z-0 -translate-y-0.5" style={{ width: "calc(100% - 2rem)" }} />
              )}
              <div className="glass-card rounded-2xl p-6 hover:bg-white/8 transition-all duration-200 relative z-10 h-full">
                <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center mb-4 teal-glow">
                  <span className="text-navy font-700 font-display text-sm">{step.step}</span>
                </div>
                <h3 className="font-display font-600 text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-navy-mid/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-600 tracking-wider uppercase mb-3">Why ShareCargo</p>
            <h2 className="text-3xl sm:text-4xl font-display font-700 text-foreground">Everything You Need to Ship Smarter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl p-6 border border-border hover:border-primary/30 bg-navy-mid/60 hover:bg-navy-mid transition-all duration-200 group">
                  <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
                    feature.color === "teal" ? "bg-primary/15 text-primary" :
                    feature.color === "emerald" ? "bg-emerald-400/15 text-emerald-400" :
                    "bg-yellow-400/15 text-yellow-400"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display font-600 text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ship Visual */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm font-600 tracking-wider uppercase mb-3">Verified Network</p>
              <h2 className="text-3xl sm:text-4xl font-display font-700 text-foreground mb-6">
                Ship with Trust. Arrive with Confidence.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every shipper on our platform goes through identity verification and compliance checks. Our matching algorithm also considers cargo compatibility, ensuring your goods are always in safe company.
              </p>
              <div className="space-y-3">
                {[
                  "KYC-verified business and individual accounts",
                  "Cargo compatibility screening per shipment",
                  "Insurance coordination available for all bookings",
                  "24/7 dispute resolution and customer support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle size={16} className="text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden teal-glow">
                <img src={cargoShipImg} alt="Cargo Ship" className="w-full h-64 lg:h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent rounded-2xl" />
              </div>
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Container SC-8821</p>
                    <p className="font-600 text-foreground text-sm mt-0.5">Shanghai → Rotterdam</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Fill Rate</p>
                    <p className="font-700 font-display text-primary">81%</p>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[81%] gradient-teal rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-navy-mid/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-700 text-foreground">Trusted by Traders Worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 hover:bg-white/8 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full gradient-teal flex items-center justify-center text-navy text-xs font-700">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-600 text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-700 text-foreground mb-4">
            Ready to Ship Smarter?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join 1,200+ verified shippers already saving on every shipment.
          </p>
          <Button
            onClick={handleStartShipment}
            size="lg"
            className="gradient-teal text-navy font-700 text-base gap-2 teal-glow hover:opacity-90 transition-opacity"
          >
            Get Your Free Match <ArrowRight size={18} />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">No commitment — see your match and savings before you pay.</p>
        </div>
      </section>
    </div>
  );
}
