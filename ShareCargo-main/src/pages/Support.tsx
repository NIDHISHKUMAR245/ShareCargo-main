import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MessageSquare, ChevronDown, ChevronUp, Send,
  MessagesSquare, Clock, CheckCircle, HelpCircle, Phone,
  Mail, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── FAQ Data ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    id: "faq-1",
    category: "Container Sharing",
    question: "How does container sharing work on ShareCargo?",
    answer:
      "ShareCargo connects multiple shippers heading to the same destination within a similar timeframe. You enter your shipment details — origin, destination, volume, and cargo type — and our AI engine matches you with compatible co-shippers. All parties share space in the same container, and costs are split proportionally based on the volume each shipper occupies. You only pay for the space you actually use.",
  },
  {
    id: "faq-2",
    category: "Container Sharing",
    question: "How is the matching algorithm determined?",
    answer:
      "Our AI matching engine scores potential container partners based on five factors: route compatibility (origin & destination ports), departure date alignment (within a 5-day window), cargo compatibility (ensuring goods can safely co-exist), co-shipper verification level, and container fill efficiency. Matches are scored from 0–100%, and we only suggest matches above 70%. A 90%+ score means near-perfect alignment.",
  },
  {
    id: "faq-3",
    category: "Container Sharing",
    question: "Is my cargo secure when sharing a container?",
    answer:
      "Yes. All cargo is individually packed and labeled inside the container with clear segregation markings. Every co-shipper on ShareCargo undergoes KYC (Know Your Customer) identity verification before they can book. Cargo is also covered under standard shipper's interest insurance during transit. You can view the verification level of each co-shipper on your shipment detail page.",
  },
  {
    id: "faq-4",
    category: "Pricing",
    question: "How is my cost calculated?",
    answer:
      "Your cost has three components: (1) Container Transportation — your pro-rated share of the sea freight rate, fuel surcharge (BAF), and terminal handling charges based on your volume in CBM. (2) Container Arrangement Fee — covers logistics coordination, bill of lading documentation, and customs clearance support. (3) Platform Fees — a fixed booking fee plus a service fee and container sharing management fee. The full breakdown is shown before you confirm payment.",
  },
  {
    id: "faq-5",
    category: "Pricing",
    question: "What if I need to cancel my booking?",
    answer:
      "Cancellations made more than 7 days before the vessel departure date receive a full refund minus the booking fee ($35–$45). Cancellations 3–7 days before departure incur a 25% cancellation charge. Cancellations within 72 hours of departure are non-refundable. To request a cancellation, go to My Shipments → select your shipment → Cancel Booking, or contact support@sharecargo.com.",
  },
  {
    id: "faq-6",
    category: "Pricing",
    question: "Are there any hidden fees?",
    answer:
      "No. ShareCargo is built around transparent pricing. Every fee — freight rate, surcharges, arrangement fees, and platform charges — is itemized on the payment review page before you confirm. The only additional costs that could arise are destination customs duties or local delivery charges, which are the shipper's responsibility and vary by destination country.",
  },
  {
    id: "faq-7",
    category: "Tracking",
    question: "How do I track my shipment in real time?",
    answer:
      "Navigate to My Shipments and click on any active shipment to view the live tracking timeline. Milestones are updated as your cargo progresses — from port receipt and vessel departure through transshipment hubs to final delivery. You'll also receive automatic notifications via the bell icon in the navbar at each major milestone. Tracking data is provided by our carrier partners and refreshed every 4–6 hours.",
  },
  {
    id: "faq-8",
    category: "Tracking",
    question: "What happens if my shipment is delayed?",
    answer:
      "Delays can occur due to weather, port congestion, or vessel scheduling changes. If your estimated arrival date changes by more than 48 hours, ShareCargo will send a notification with the updated ETA and reason. You can contact support via this page or at support@sharecargo.com to get more details. Delay compensation policies depend on the shipping line's terms of carriage.",
  },
];

const CATEGORIES = [
  "Container Matching",
  "Pricing & Payments",
  "Shipment Tracking",
  "Account & Verification",
  "Cancellations & Refunds",
  "Technical Issue",
  "Other",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))];

  const filtered = filter === "All" ? FAQ_ITEMS : FAQ_ITEMS.filter((f) => f.category === filter);

  return (
    <div className="rounded-2xl border border-border bg-navy-mid/70 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-primary" />
          <h2 className="font-display font-600 text-foreground">Frequently Asked Questions</h2>
        </div>
        <div className="flex gap-1.5 sm:ml-auto flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-500 transition-all duration-150 border",
                filter === cat
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "text-muted-foreground border-border hover:text-foreground hover:border-border/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion items */}
      <div className="divide-y divide-border/60">
        {filtered.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="group">
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-5 py-4 text-left transition-all duration-150",
                  isOpen ? "bg-primary/5" : "hover:bg-white/3"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  isOpen ? "bg-primary text-navy" : "bg-white/8 text-muted-foreground"
                )}>
                  {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn(
                      "text-[10px] font-600 uppercase tracking-wider px-1.5 py-0.5 rounded",
                      isOpen ? "text-primary bg-primary/10" : "text-muted-foreground bg-white/5"
                    )}>
                      {item.category}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm font-500 leading-snug transition-colors",
                    isOpen ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                  )}>
                    {item.question}
                  </p>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 ml-9 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 border-t border-border bg-white/2 text-center">
        <p className="text-xs text-muted-foreground">
          Can't find what you're looking for?{" "}
          <a href="mailto:support@sharecargo.com" className="text-primary hover:underline font-500">
            Email us directly
          </a>
        </p>
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ subject: "", category: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.subject.trim()) errs.subject = "Please enter a subject";
    if (!form.category) errs.category = "Please select a category";
    if (form.message.trim().length < 20) errs.message = "Message must be at least 20 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Support ticket submitted! We'll respond within 24 hours.");
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-navy-mid/70 p-8 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-emerald-400/15 flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-400/10">
          <CheckCircle size={26} className="text-emerald-400" />
        </div>
        <h3 className="font-display font-700 text-foreground text-lg mb-2">Message Sent!</h3>
        <p className="text-sm text-muted-foreground mb-1">
          Thanks for reaching out. Our support team typically responds within <strong className="text-foreground">24 hours</strong>.
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          A confirmation has been sent to your registered email address.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ subject: "", category: "", message: "" }); }}
          className="text-sm text-primary hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-navy-mid/70 overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <MessageSquare size={16} className="text-primary" />
        <h2 className="font-display font-600 text-foreground">Send a Message</h2>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-sm font-500 text-muted-foreground mb-1.5">Subject</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="Brief description of your issue"
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40",
              errors.subject
                ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            )}
          />
          {errors.subject && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.subject}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-500 text-muted-foreground mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-sm focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer",
              form.category ? "text-foreground" : "text-muted-foreground/60",
              errors.category
                ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            )}
          >
            <option value="" disabled>Select a category…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0f1b2e] text-white">
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.category}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-500 text-muted-foreground mb-1.5">
            Message
            <span className="ml-2 text-xs text-muted-foreground/60">
              ({form.message.length} chars)
            </span>
          </label>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Describe your issue in detail — include shipment reference numbers if applicable…"
            rows={5}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40 resize-none",
              errors.message
                ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            )}
          />
          {errors.message && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full gradient-teal text-navy font-700 gap-2 hover:opacity-90 teal-glow"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 bg-navy">
      {/* Page header */}
      <div className="border-b border-border bg-navy-mid/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-display font-700 text-foreground">Support Center</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Get help with shipments, pricing, tracking, and your account
              </p>
            </div>
          </div>

          {/* Quick contact options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: Mail,
                title: "Email Support",
                desc: "support@sharecargo.com",
                badge: "24h response",
                badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
              },
              {
                icon: MessagesSquare,
                title: "Live Chat",
                desc: "Chat with an agent now",
                badge: "Online",
                badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
              },
              {
                icon: Phone,
                title: "Phone Support",
                desc: "+1 (800) 743-2290",
                badge: "Mon–Fri 9–18 UTC",
                badgeColor: "text-muted-foreground bg-white/5 border-border",
              },
            ].map(({ icon: Icon, title, desc, badge, badgeColor }) => (
              <div
                key={title}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-border bg-navy-light/50 hover:bg-navy-light/80 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-600 text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground truncate">{desc}</p>
                </div>
                <span className={cn("text-[10px] font-600 border px-2 py-0.5 rounded-full shrink-0", badgeColor)}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── LEFT: FAQ ── */}
          <div className="space-y-5">
            <FAQAccordion />
          </div>

          {/* ── RIGHT: Contact + Live Chat ── */}
          <div className="space-y-5">
            {/* Contact Form */}
            <ContactForm />

            {/* Live Chat placeholder */}
            <div className="rounded-2xl border border-border bg-navy-mid/70 overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <MessagesSquare size={16} className="text-primary" />
                <h2 className="font-display font-600 text-foreground">Live Chat</h2>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-600 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Mock chat messages */}
              <div className="px-4 py-4 space-y-3 bg-navy/40 min-h-[160px]">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full gradient-teal flex items-center justify-center text-navy text-xs font-700 shrink-0">
                    SC
                  </div>
                  <div className="bg-navy-mid rounded-xl rounded-tl-sm px-3.5 py-2.5 max-w-[80%]">
                    <p className="text-sm text-foreground leading-snug">
                      Hi there! 👋 I'm the ShareCargo support assistant. How can I help you today?
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">Just now</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 justify-end">
                  <div className="bg-primary/15 border border-primary/20 rounded-xl rounded-tr-sm px-3.5 py-2.5 max-w-[80%]">
                    <p className="text-sm text-foreground leading-snug italic text-muted-foreground/60">
                      Your message will appear here…
                    </p>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 border-t border-border flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message…"
                  onClick={() => toast.info("Live chat coming soon! Use the contact form or email us.")}
                  readOnly
                  className="flex-1 px-3.5 py-2 rounded-lg bg-navy-light border border-border text-sm text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none cursor-pointer"
                />
                <button
                  onClick={() => toast.info("Live chat coming soon! Use the contact form or email us.")}
                  className="w-9 h-9 rounded-lg gradient-teal flex items-center justify-center text-navy hover:opacity-90 transition-all shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>

              <div className="px-4 pb-3">
                <p className="text-[11px] text-muted-foreground text-center">
                  <Clock size={10} className="inline mr-1" />
                  Average response time: under 3 minutes during business hours
                </p>
              </div>
            </div>

            {/* SLA info */}
            <div className="rounded-xl border border-border bg-white/3 p-4 space-y-2">
              <p className="text-xs font-600 text-foreground">Support Hours</p>
              {[
                { label: "Live Chat & Phone", value: "Mon–Fri  09:00–18:00 UTC" },
                { label: "Email Support", value: "24 / 7 — reply within 24h" },
                { label: "Critical Shipment Issues", value: "24 / 7 on-call support" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-500">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
