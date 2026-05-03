import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Ship, LayoutDashboard, Package, Plus, Menu, X, Bell, ChevronDown, UserCircle, CheckCheck, Container, Zap, CreditCard, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_NOTIFICATIONS, type AppNotification } from "@/constants/notifications";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/shipments", label: "My Shipments" },
  { href: "/support", label: "Support" },
];

const NOTIF_ICONS: Record<AppNotification["type"], typeof Bell> = {
  shipment: Container,
  match: Zap,
  payment: CreditCard,
  system: Settings,
};

const NOTIF_COLORS: Record<AppNotification["type"], string> = {
  shipment: "text-primary bg-primary/15",
  match: "text-yellow-400 bg-yellow-400/15",
  payment: "text-emerald-400 bg-emerald-400/15",
  system: "text-muted-foreground bg-white/8",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "Just now";
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOneRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  // Close panels on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-navy/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center teal-glow transition-all duration-200 group-hover:scale-105">
              <Ship className="w-4.5 h-4.5 text-navy" size={18} />
            </div>
            <span className="font-display font-700 text-lg text-foreground">
              Share<span className="text-teal">Cargo</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen((o) => !o); setUserMenuOpen(false); }}
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-navy text-[10px] font-700 flex items-center justify-center leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Panel */}
                  <div className={cn(
                    "absolute right-0 top-full mt-2 w-[360px] rounded-2xl border border-border bg-card/98 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right",
                    notifOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                  )}>
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Bell size={14} className="text-primary" />
                        <span className="font-display font-600 text-foreground text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-700">{unreadCount} new</span>
                        )}
                      </div>
                      <button
                        onClick={markAllRead}
                        className={cn(
                          "flex items-center gap-1 text-xs font-500 transition-colors",
                          unreadCount > 0 ? "text-primary hover:text-primary/80" : "text-muted-foreground cursor-default"
                        )}
                        disabled={unreadCount === 0}
                      >
                        <CheckCheck size={13} />
                        Mark all read
                      </button>
                    </div>

                    {/* Notification list */}
                    <div className="overflow-y-auto max-h-[420px] divide-y divide-border/50">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                          <Info size={28} className="text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const Icon = NOTIF_ICONS[notif.type];
                          return (
                            <div
                              key={notif.id}
                              onClick={() => markOneRead(notif.id)}
                              className={cn(
                                "flex gap-3 px-4 py-3.5 cursor-pointer transition-colors group",
                                notif.read ? "hover:bg-white/3" : "bg-primary/4 hover:bg-primary/8"
                              )}
                            >
                              {/* Icon */}
                              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5", NOTIF_COLORS[notif.type])}>
                                <Icon size={14} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className={cn("text-sm leading-snug", notif.read ? "text-foreground font-400" : "text-foreground font-600")}>
                                    {notif.title}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                                    {timeAgo(notif.timestamp)}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                  {notif.message}
                                </p>
                              </div>

                              {/* Unread dot */}
                              <div className="shrink-0 mt-1.5">
                                {!notif.read ? (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                ) : (
                                  <div className="w-2 h-2" />
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Panel footer */}
                    <div className="px-4 py-2.5 border-t border-border bg-white/2">
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="w-full text-xs text-muted-foreground hover:text-foreground text-center transition-colors py-1"
                      >
                        Close panel
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/book")}
                  size="sm"
                  className="gradient-teal text-navy font-600 hover:opacity-90 transition-opacity gap-1.5"
                >
                  <Plus size={15} />
                  New Shipment
                </Button>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full gradient-teal flex items-center justify-center text-navy text-xs font-700">
                      {user.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-foreground">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-card/95 backdrop-blur-xl py-1 shadow-2xl">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-all">
                        <LayoutDashboard size={14} className="text-muted-foreground" /> Dashboard
                      </Link>
                      <Link to="/shipments" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-all">
                        <Package size={14} className="text-muted-foreground" /> My Shipments
                      </Link>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-all">
                        <UserCircle size={14} className="text-muted-foreground" /> My Profile
                      </Link>
                      <Link to="/support" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-all">
                        <Bell size={14} className="text-muted-foreground" /> Support
                      </Link>
                      <hr className="border-border my-1" />
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/5 transition-all">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/auth")} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2">
                  Sign In
                </button>
                <Button onClick={() => navigate("/auth")} size="sm" className="gradient-teal text-navy font-600 hover:opacity-90">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              {user ? (
                <div className="space-y-1">
                  <Link to="/book" onClick={() => setMobileOpen(false)} className="block w-full text-center px-3 py-2.5 rounded-lg gradient-teal text-navy text-sm font-600">
                    + New Shipment
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/5">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Button onClick={() => { navigate("/auth"); setMobileOpen(false); }} className="w-full gradient-teal text-navy font-600">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
