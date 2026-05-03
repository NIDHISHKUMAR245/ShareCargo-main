import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Building2, Shield, CheckCircle, Star, Camera,
  Bell, Lock, Trash2, Save, ArrowLeft, Package, TrendingDown,
  Calendar, Globe, Phone, Edit3, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const VERIFICATION_CONFIG = {
  premium: { label: "Premium Verified", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/25", icon: Star },
  verified: { label: "Verified", color: "text-teal-400 bg-teal-400/10 border-teal-400/25", icon: CheckCircle },
  basic: { label: "Basic", color: "text-muted-foreground bg-white/5 border-border", icon: User },
};

type TabKey = "personal" | "security" | "notifications";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    companyType: user?.companyType || "",
    address: user?.address || "",
    companyAddress: user?.companyAddress || "",
    pincode: user?.pincode || "",
    phone: user?.phone || "",
    country: user?.country || "",
    city: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    shipmentUpdates: true,
    matchFound: true,
    paymentConfirmed: true,
    promotions: false,
    weeklyReport: true,
    smsAlerts: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // Sync profile state with user data whenever user changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        companyType: user.companyType || "",
        address: user.address || "",
        companyAddress: user.companyAddress || "",
        pincode: user.pincode || "",
        phone: user.phone || "",
        country: user.country || "",
        city: "",
        bio: "",
      });
    }
  }, [user]);

  const updateProfile = (field: string, value: string) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    
    // Update user data in localStorage
    if (user) {
      const updatedUser = {
        ...user,
        name: profile.name,
        email: profile.email,
        company: profile.company,
        companyType: profile.companyType,
        address: profile.address,
        companyAddress: profile.companyAddress,
        pincode: profile.pincode,
        phone: profile.phone,
        country: profile.country,
      };
      
      // Update current user
      localStorage.setItem("sc_auth_user", JSON.stringify(updatedUser));
      
      // Update user in database
      const db = localStorage.getItem("sc_users_db");
      if (db) {
        let users = JSON.parse(db);
        users = users.map((u: any) => 
          u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u
        );
        localStorage.setItem("sc_users_db", JSON.stringify(users));
      }
    }
    
    setSaving(false);
    setEditMode(false);
    toast.success("Profile updated successfully");
  };

  const handleChangePassword = async () => {
    if (!passwords.current) { toast.error("Enter your current password"); return; }
    if (passwords.newPass.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (passwords.newPass !== passwords.confirm) { toast.error("New passwords do not match"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
    toast.success("Password changed successfully");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires contacting support@sharecargo.com");
  };

  const verConfig = VERIFICATION_CONFIG[user?.verificationLevel || "basic"];
  const VerIcon = verConfig.icon;

  // Mock stats
  const memberSince = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Jan 2025";
  const initials = (user?.name || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2);

  const TABS: { key: TabKey; label: string; icon: typeof User }[] = [
    { key: "personal", label: "Personal Info", icon: User },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="min-h-screen pt-16 bg-navy">
      {/* Header */}
      <div className="border-b border-border bg-navy-mid/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-display font-700 text-foreground">My Profile</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

          {/* ── LEFT PANEL ── */}
          <div className="space-y-4">
            {/* Avatar card */}
            <div className="rounded-2xl border border-border bg-navy-mid/70 p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-2xl gradient-teal flex items-center justify-center text-navy text-2xl font-700 font-display teal-glow">
                  {initials}
                </div>
                <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-navy-light border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Camera size={13} />
                </button>
              </div>

              <h2 className="font-display font-700 text-foreground text-lg">{user?.name || "User"}</h2>
              {user?.company && (
                <p className="text-sm text-muted-foreground mt-0.5">{user.company}</p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>

              <div className={cn("mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-600 border", verConfig.color)}>
                <VerIcon size={11} />
                {verConfig.label}
              </div>
            </div>

            {/* Account stats */}
            <div className="rounded-2xl border border-border bg-navy-mid/70 p-5 space-y-4">
              <h3 className="text-sm font-600 text-foreground">Account Overview</h3>
              {[
                { icon: Calendar, label: "Member Since", value: memberSince },
                { icon: Package, label: "Total Shipments", value: "12" },
                { icon: TrendingDown, label: "Total Saved", value: formatCurrency(24680) },
                { icon: Globe, label: "Routes Used", value: "8 trade lanes" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-600 text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign out */}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full px-4 py-2.5 rounded-xl border border-red-400/20 text-red-400 text-sm font-600 hover:bg-red-400/5 transition-all"
            >
              Sign Out
            </button>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-navy-mid/70 border border-border w-fit">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 transition-all duration-150",
                    activeTab === key
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* ── PERSONAL INFO ── */}
            {activeTab === "personal" && (
              <div className="rounded-2xl border border-border bg-navy-mid/70 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-600 text-foreground">Personal Information</h2>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditMode(false); }}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="gradient-teal text-navy font-600 gap-1.5 hover:opacity-90"
                        disabled={saving}
                      >
                        {saving ? (
                          <div className="w-3.5 h-3.5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        ) : (
                          <Save size={13} />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { field: "name", label: "Full Name", icon: User, placeholder: "Your full name" },
                    { field: "email", label: "Email Address", icon: Mail, placeholder: "you@company.com" },
                    { field: "company", label: "Company", icon: Building2, placeholder: "Your company name" },
                    { field: "companyType", label: "Company Type", icon: Building2, placeholder: "e.g. Logistics Provider" },
                    { field: "address", label: "Address", icon: Globe, placeholder: "123 Main Street, City" },
                    { field: "companyAddress", label: "Company Address", icon: Building2, placeholder: "123 Company Street, City" },
                    { field: "pincode", label: "Pincode", icon: Globe, placeholder: "e.g. 12345" },
                    { field: "phone", label: "Phone Number", icon: Phone, placeholder: "+1 (555) 000-0000" },
                    { field: "country", label: "Country", icon: Globe, placeholder: "e.g. United States" },
                    { field: "city", label: "City", icon: Globe, placeholder: "e.g. Los Angeles" },
                  ].map(({ field, label, icon: Icon, placeholder }) => (
                    <div key={field}>
                      <label className="block text-sm font-500 text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1.5"><Icon size={13} />{label}</span>
                      </label>
                      <input
                        type="text"
                        value={profile[field as keyof typeof profile] as string}
                        onChange={(e) => updateProfile(field, e.target.value)}
                        placeholder={placeholder}
                        disabled={!editMode}
                        className={cn(
                          "w-full px-3.5 py-2.5 rounded-lg border text-foreground text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40",
                          editMode
                            ? "bg-navy-light border-border focus:border-primary focus:ring-primary/20"
                            : "bg-white/3 border-transparent text-foreground cursor-default"
                        )}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-500 text-muted-foreground mb-1.5">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile("bio", e.target.value)}
                    placeholder="A short description about yourself or your business..."
                    disabled={!editMode}
                    rows={3}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-lg border text-foreground text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40 resize-none",
                      editMode
                        ? "bg-navy-light border-border focus:border-primary focus:ring-primary/20"
                        : "bg-white/3 border-transparent cursor-default"
                    )}
                  />
                </div>

                {/* Verification banner */}
                <div className={cn("rounded-xl border p-4 flex items-start gap-3", verConfig.color)}>
                  <VerIcon size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-600">{verConfig.label} Account</p>
                    <p className="text-xs opacity-80 mt-0.5">
                      {user?.verificationLevel === "verified"
                        ? "Your identity has been verified. Co-shippers can trust your bookings."
                        : user?.verificationLevel === "premium"
                        ? "You have full premium access with priority matching and dedicated support."
                        : "Complete identity verification to unlock full platform features."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div className="rounded-2xl border border-border bg-navy-mid/70 p-6 space-y-6">
                <div>
                  <h2 className="font-display font-600 text-foreground mb-1">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose how and when you want to be notified.</p>
                </div>

                {[
                  {
                    group: "Shipment Alerts",
                    items: [
                      { key: "shipmentUpdates", label: "Shipment Status Updates", desc: "Get notified when your cargo moves through milestones" },
                      { key: "matchFound", label: "New Container Match Found", desc: "Alert when a compatible container is available for your route" },
                    ],
                  },
                  {
                    group: "Account & Payments",
                    items: [
                      { key: "paymentConfirmed", label: "Payment Confirmations", desc: "Receive receipts and payment status updates" },
                      { key: "weeklyReport", label: "Weekly Shipment Report", desc: "A summary of your active shipments and savings every Monday" },
                    ],
                  },
                  {
                    group: "Marketing",
                    items: [
                      { key: "promotions", label: "Promotions & Offers", desc: "Special discounts and platform announcements" },
                      { key: "smsAlerts", label: "SMS Alerts", desc: "Critical shipment alerts via text message" },
                    ],
                  },
                ].map((group) => (
                  <div key={group.group}>
                    <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-3">{group.group}</p>
                    <div className="space-y-3">
                      {group.items.map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-border bg-white/2 hover:bg-white/4 transition-colors">
                          <div>
                            <p className="text-sm font-500 text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                          </div>
                          <button
                            onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                            className={cn(
                              "relative w-10 h-5.5 rounded-full transition-all duration-200 shrink-0 ml-4",
                              notifications[key as keyof typeof notifications]
                                ? "bg-primary"
                                : "bg-white/10"
                            )}
                            style={{ minWidth: "40px", height: "22px" }}
                          >
                            <div className={cn(
                              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200",
                              notifications[key as keyof typeof notifications] ? "left-[22px]" : "left-0.5"
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => toast.success("Notification preferences saved")}
                  className="gradient-teal text-navy font-600 gap-2 hover:opacity-90"
                >
                  <Save size={14} /> Save Preferences
                </Button>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === "security" && (
              <div className="space-y-5">
                {/* Change Password */}
                <div className="rounded-2xl border border-border bg-navy-mid/70 p-6 space-y-5">
                  <div>
                    <h2 className="font-display font-600 text-foreground mb-1">Change Password</h2>
                    <p className="text-sm text-muted-foreground">Use a strong password of at least 8 characters.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { field: "current", label: "Current Password", show: showCurrentPass, toggle: () => setShowCurrentPass((p) => !p) },
                      { field: "newPass", label: "New Password", show: showNewPass, toggle: () => setShowNewPass((p) => !p) },
                      { field: "confirm", label: "Confirm New Password", show: showNewPass, toggle: () => setShowNewPass((p) => !p) },
                    ].map(({ field, label, show, toggle }) => (
                      <div key={field}>
                        <label className="block text-sm font-500 text-muted-foreground mb-1.5">{label}</label>
                        <div className="relative">
                          <input
                            type={show ? "text" : "password"}
                            value={passwords[field as keyof typeof passwords]}
                            onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-navy-light border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
                          />
                          <button
                            type="button"
                            onClick={toggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {show ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    className="gradient-teal text-navy font-600 gap-2 hover:opacity-90"
                    disabled={saving}
                  >
                    {saving ? <div className="w-3.5 h-3.5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Lock size={14} />}
                    Update Password
                  </Button>
                </div>

                {/* Active sessions (mock) */}
                <div className="rounded-2xl border border-border bg-navy-mid/70 p-6 space-y-4">
                  <h2 className="font-display font-600 text-foreground">Active Sessions</h2>
                  {[
                    { device: "Chrome · macOS", location: "New York, US", time: "Current session", active: true },
                    { device: "Safari · iPhone 15", location: "New York, US", time: "2 days ago", active: false },
                  ].map((session) => (
                    <div key={session.device} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white/2">
                      <div>
                        <p className="text-sm font-500 text-foreground">{session.device}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{session.location} · {session.time}</p>
                      </div>
                      {session.active ? (
                        <span className="text-xs font-600 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">Active</span>
                      ) : (
                        <button className="text-xs text-red-400 hover:underline">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Danger zone */}
                <div className="rounded-2xl border border-red-400/20 bg-red-400/3 p-6 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 mb-1">
                    <Trash2 size={15} />
                    <h2 className="font-display font-600">Danger Zone</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-lg border border-red-400/30 text-red-400 text-sm font-600 hover:bg-red-400/10 transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
