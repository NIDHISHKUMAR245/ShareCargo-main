import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, TrendingDown, BarChart3, Leaf, Activity, ArrowRight, Plus,
  LayoutDashboard, Receipt, Download, CheckCircle, RefreshCw, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/features/StatCard";
import ContainerFillBar from "@/components/features/ContainerFillBar";
import { MOCK_DASHBOARD_STATS, MOCK_SHIPMENTS, MOCK_PAYMENT_HISTORY } from "@/constants/mockData";
import type { PaymentRecord } from "@/constants/mockData";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SAVINGS_DATA = [
  { month: "Jul", savings: 1200, shipments: 1 },
  { month: "Aug", savings: 2800, shipments: 2 },
  { month: "Sep", savings: 3100, shipments: 2 },
  { month: "Oct", savings: 4200, shipments: 3 },
  { month: "Nov", savings: 5900, shipments: 3 },
  { month: "Dec", savings: 7480, shipments: 2 },
];

type Tab = "overview" | "payments";

function getPaymentStatusStyle(status: PaymentRecord["status"]) {
  if (status === "paid") return { icon: CheckCircle, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", label: "Paid" };
  if (status === "refunded") return { icon: RefreshCw, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", label: "Refunded" };
  return { icon: Clock, color: "text-muted-foreground bg-white/5 border-border", label: "Pending" };
}

function downloadReceipt(record: PaymentRecord) {
  const lines = [
    "===========================================",
    "         SHARECARGO PAYMENT RECEIPT        ",
    "===========================================",
    "",
    `Receipt Date    : ${formatDate(new Date().toISOString())}`,
    `Payment Date    : ${formatDate(record.date)}`,
    `Shipment Ref    : ${record.shipmentRef}`,
    `Transaction ID  : TXN-${record.id.toUpperCase()}`,
    "",
    "-------------------------------------------",
    " SHIPMENT DETAILS",
    "-------------------------------------------",
    `Route           : ${record.route}`,
    `Container       : ${record.containerType}`,
    `Shipping Line   : ${record.shippingLine}`,
    "",
    "-------------------------------------------",
    " COST BREAKDOWN",
    "-------------------------------------------",
    `Transportation  : ${formatCurrency(record.transportationAmount, record.currency)}`,
    `Arrangement Fee : ${formatCurrency(record.arrangementAmount, record.currency)}`,
    `Platform Fee    : ${formatCurrency(record.platformAmount, record.currency)}`,
    "-------------------------------------------",
    `TOTAL PAID      : ${formatCurrency(record.totalAmount, record.currency)}`,
    "-------------------------------------------",
    "",
    `Status          : ${record.status.toUpperCase()}`,
    "",
    "===========================================",
    "  Thank you for shipping with ShareCargo!  ",
    " support@sharecargo.com | sharecargo.com   ",
    "===========================================",
  ];

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${record.shipmentRef}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const stats = MOCK_DASHBOARD_STATS;
  const activeShipments = MOCK_SHIPMENTS.filter((s) => s.status === "in_transit");
  const userName = user?.name || "Shipper";

  return (
    <div className="min-h-screen pt-16 bg-navy">
      {/* Header */}
      <div className="border-b border-border bg-navy-mid/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-display font-700 text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {userName} · Verified Shipper</p>
            </div>
            <Button
              onClick={() => navigate("/book")}
              className="gradient-teal text-navy font-700 gap-1.5 hover:opacity-90 teal-glow"
            >
              <Plus size={16} /> New Shipment
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {([
              { key: "overview", label: "Overview", icon: LayoutDashboard },
              { key: "payments", label: "Payment History", icon: Receipt },
            ] as { key: Tab; label: string; icon: typeof LayoutDashboard }[]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 transition-all duration-150",
                  tab === key
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Shipments"
                value={`${stats.totalShipments}`}
                icon={Package}
                trend={{ value: "3 this month", positive: true }}
                accentColor="teal"
              />
              <StatCard
                title="Total Savings"
                value={formatCurrency(stats.totalSavings)}
                subtitle={`vs. full container costs`}
                icon={TrendingDown}
                trend={{ value: `${stats.avgSavingsPercentage}% avg`, positive: true }}
                accentColor="emerald"
              />
              <StatCard
                title="Active Shipments"
                value={`${stats.activeShipments}`}
                subtitle="Currently in transit"
                icon={Activity}
                accentColor="amber"
              />
              <StatCard
                title="CO₂ Saved"
                value={`${stats.co2Saved}t`}
                subtitle="vs. individual shipping"
                icon={Leaf}
                accentColor="emerald"
              />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Savings Chart */}
              <div className="lg:col-span-2 rounded-2xl border border-border bg-navy-mid/70 p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display font-600 text-foreground">Cumulative Savings</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full font-600">
                    <BarChart3 size={12} />
                    {formatCurrency(stats.totalSavings)} total
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={SAVINGS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(187,90%,42%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(187,90%,42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,20%,18%)" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(217,28%,10%)", border: "1px solid hsl(217,20%,18%)", borderRadius: "8px", color: "hsl(210,20%,96%)", fontSize: "12px" }}
                      formatter={(value: number) => [formatCurrency(value), "Savings"]}
                    />
                    <Area type="monotone" dataKey="savings" stroke="hsl(187,90%,42%)" fill="url(#savingsGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-navy-mid/70 p-5">
                  <h3 className="font-600 text-foreground text-sm mb-4">Shipping Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Volume Shipped", value: `${stats.totalVolumeShipped} CBM` },
                      { label: "Avg Savings Rate", value: `${stats.avgSavingsPercentage}%` },
                      { label: "Preferred Route", value: "Shanghai → EU" },
                      { label: "Trust Level", value: "Verified ✓" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-600 text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate("/book")}
                  className="w-full rounded-2xl border border-primary/25 bg-primary/5 hover:bg-primary/10 p-5 text-left transition-all group"
                >
                  <p className="text-sm font-600 text-primary group-hover:underline flex items-center gap-1.5">
                    Find a container match <ArrowRight size={14} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Enter your shipment details to get matched instantly</p>
                </button>
              </div>
            </div>

            {/* Active Shipments */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-600 text-foreground">Active Shipments</h2>
                <button onClick={() => navigate("/shipments")} className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight size={13} />
                </button>
              </div>
              <div className="space-y-3">
                {activeShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    onClick={() => navigate(`/shipments/${shipment.id}`)}
                    className="rounded-xl border border-border bg-navy-mid/70 hover:bg-navy-mid hover:border-primary/25 p-4 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{shipment.trackingNumber}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-500 ${getStatusColor(shipment.status)}`}>
                            {getStatusLabel(shipment.status)}
                          </span>
                        </div>
                        <p className="font-600 text-foreground">
                          {shipment.origin.split("(")[0].trim()} → {shipment.destination.split("(")[0].trim()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {shipment.cargoType} · {shipment.volume} CBM · ETA {formatDate(shipment.estimatedArrival)}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <ContainerFillBar
                          fillPercentage={shipment.containerShare.fillPercentage}
                          yourShare={shipment.containerShare.yourShare}
                          totalCapacity={shipment.containerShare.totalCapacity}
                          showLabels={false}
                          className="w-32"
                        />
                        <div className="text-right shrink-0">
                          <p className="font-700 font-display text-primary">{formatCurrency(shipment.pricing.totalCost)}</p>
                          <p className="text-xs text-emerald-400">saved {formatCurrency(shipment.pricing.savings)}</p>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── PAYMENT HISTORY TAB ── */}
        {tab === "payments" && (
          <div className="animate-fade-in space-y-5">
            {/* Summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Payments", value: MOCK_PAYMENT_HISTORY.filter((p) => p.status === "paid").length.toString(), sub: "completed" },
                { label: "Total Paid", value: formatCurrency(MOCK_PAYMENT_HISTORY.filter((p) => p.status === "paid").reduce((s, p) => s + p.totalAmount, 0)), sub: "all time" },
                { label: "Avg per Shipment", value: formatCurrency(Math.round(MOCK_PAYMENT_HISTORY.filter((p) => p.status === "paid").reduce((s, p) => s + p.totalAmount, 0) / MOCK_PAYMENT_HISTORY.filter((p) => p.status === "paid").length)), sub: "per booking" },
                { label: "Refunds", value: MOCK_PAYMENT_HISTORY.filter((p) => p.status === "refunded").length.toString(), sub: "processed" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-navy-mid/70 px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-xl font-700 font-display text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-border bg-navy-mid/70 overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-600 text-foreground flex items-center gap-2">
                  <Receipt size={16} className="text-primary" /> Payment History
                </h2>
                <span className="text-xs text-muted-foreground">{MOCK_PAYMENT_HISTORY.length} records</span>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Date", "Shipment Ref", "Route", "Amount", "Status", "Receipt"].map((col) => (
                        <th key={col} className="px-5 py-3 text-left text-xs font-600 text-muted-foreground uppercase tracking-wide">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_PAYMENT_HISTORY.map((record) => {
                      const { icon: StatusIcon, color, label } = getPaymentStatusStyle(record.status);
                      return (
                        <tr key={record.id} className="hover:bg-white/2 transition-colors group">
                          <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{formatDate(record.date)}</td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs font-600 text-foreground">{record.shipmentRef}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-foreground font-500 whitespace-nowrap">{record.route}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{record.containerType} · {record.shippingLine}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-700 font-display text-primary">{formatCurrency(record.totalAmount, record.currency)}</span>
                            <div className="flex gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">T: {formatCurrency(record.transportationAmount)}</span>
                              <span className="text-[10px] text-muted-foreground">A: {formatCurrency(record.arrangementAmount)}</span>
                              <span className="text-[10px] text-muted-foreground">P: {formatCurrency(record.platformAmount)}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 border", color)}>
                              <StatusIcon size={11} />
                              {label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => downloadReceipt(record)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 text-primary border border-primary/25 bg-primary/5 hover:bg-primary/15 transition-all duration-150 group-hover:border-primary/40"
                            >
                              <Download size={12} />
                              Download
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-border">
                {MOCK_PAYMENT_HISTORY.map((record) => {
                  const { icon: StatusIcon, color, label } = getPaymentStatusStyle(record.status);
                  return (
                    <div key={record.id} className="px-4 py-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-xs font-600 text-foreground">{record.shipmentRef}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(record.date)}</p>
                        </div>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-600 border", color)}>
                          <StatusIcon size={10} />
                          {label}
                        </span>
                      </div>
                      <p className="text-sm font-500 text-foreground">{record.route}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-700 font-display text-primary">{formatCurrency(record.totalAmount, record.currency)}</span>
                        <button
                          onClick={() => downloadReceipt(record)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 text-primary border border-primary/25 bg-primary/5 hover:bg-primary/15 transition-all"
                        >
                          <Download size={12} />
                          Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info note */}
            <p className="text-xs text-muted-foreground text-center">
              Receipts are downloaded as text files. Contact support@sharecargo.com for official invoices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
