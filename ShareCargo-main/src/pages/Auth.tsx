import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Ship, Eye, EyeOff, ArrowRight, CheckCircle, Shield, Users, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hero-port.jpg";

type Mode = "login" | "register";

const BENEFITS = [
  { icon: TrendingDown, text: "Save up to 84% on sea freight" },
  { icon: Shield, text: "KYC-verified co-shippers only" },
  { icon: Users, text: "1,200+ global trade network" },
];

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  showPass: boolean;
  onTogglePass: () => void;
  options?: { label: string; value: string }[];
}

function Field({ label, id, type = "text", placeholder, value, error, onChange, showPass, onTogglePass, options }: FieldProps) {
  const isPassword = id === "password" || id === "confirmPassword";
  
  if (options) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-500 text-muted-foreground mb-1.5">{label}</label>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40",
            error ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20" : "border-border focus:border-primary focus:ring-primary/20"
          )}
        >
          <option value="" disabled>Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-navy text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-500 text-muted-foreground mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (showPass ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-lg bg-navy-light border text-foreground text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/40",
            error ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20" : "border-border focus:border-primary focus:ring-primary/20"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={onTogglePass}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth() as any;

  const from = (location.state as { from?: string })?.from || "/dashboard";

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    company: "",
    companyType: "",
    companyAddress: "",
    pincode: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (mode === "register" && !form.name.trim()) errs.name = "Full name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email address";
    if (mode === "register" && !form.address.trim()) errs.address = "Address is required";
    if (mode === "register" && !form.company.trim()) errs.company = "Company name is required";
    if (mode === "register" && !form.companyType) errs.companyType = "Company type is required";
    if (mode === "register" && !form.companyAddress.trim()) errs.companyAddress = "Company address is required";
    if (mode === "register" && !form.pincode.trim()) errs.pincode = "Pincode is required";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (mode === "register" && form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (mode === "register" && !form.agree) errs.agree = "You must accept the terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "login") {
        // Login mode - validate credentials
        await login(form.email, form.password);
      } else {
        // Register mode - create new account
        await signup(form.email, form.password, form.name || undefined, form.company || undefined, form.address || undefined, form.companyType || undefined, form.companyAddress || undefined, form.pincode || undefined, form.phone || undefined, form.country || undefined);
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      setGeneralError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePass = () => setShowPass((p) => !p);

  return (
    <div className="min-h-screen flex">
      {/* Left: Form Panel */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center px-8 sm:px-12 py-12 bg-navy relative z-10 shrink-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10 group w-fit">
          <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center teal-glow">
            <Ship size={17} className="text-navy" />
          </div>
          <span className="font-display font-700 text-lg text-foreground">
            Share<span className="text-teal">Cargo</span>
          </span>
        </Link>

        {/* Tab switcher */}
        <div className="flex gap-0 p-1 rounded-xl bg-navy-mid border border-border mb-8">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErrors({}); setGeneralError(""); }}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-600 transition-all duration-200",
                mode === m ? "bg-primary text-navy" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-display font-700 text-foreground">
            {mode === "login" ? "Welcome back" : "Start shipping smarter"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login"
              ? "Sign in to manage your shipments and track savings."
              : "Join 1,200+ verified shippers on ShareCargo."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
              {generalError}
            </div>
          )}
          {mode === "register" && (
            <>
              <Field label="Full Name" id="name" placeholder="Jane Smith" value={form.name} error={errors.name} onChange={(v) => update("name", v)} showPass={showPass} onTogglePass={togglePass} />
              <Field label="Email Address" id="email" type="email" placeholder="you@company.com" value={form.email} error={errors.email} onChange={(v) => update("email", v)} showPass={showPass} onTogglePass={togglePass} />
              <Field label="Address" id="address" placeholder="123 Main Street, City" value={form.address} error={errors.address} onChange={(v) => update("address", v)} showPass={showPass} onTogglePass={togglePass} />
              <Field label="Company Name" id="company" placeholder="Your company name" value={form.company} error={errors.company} onChange={(v) => update("company", v)} showPass={showPass} onTogglePass={togglePass} />
              <Field 
                label="Company Type" 
                id="companyType" 
                value={form.companyType} 
                error={errors.companyType} 
                onChange={(v) => update("companyType", v)} 
                showPass={showPass} 
                onTogglePass={togglePass}
                options={[
                  { label: "Logistics Provider", value: "logistics" },
                  { label: "Importer/Exporter", value: "importer_exporter" },
                  { label: "Freight Forwarder", value: "freight_forwarder" },
                  { label: "Trading Company", value: "trading_company" },
                  { label: "Manufacturer", value: "manufacturer" },
                  { label: "E-commerce", value: "ecommerce" },
                  { label: "Other", value: "other" },
                ]}
              />
              <Field label="Company Address" id="companyAddress" placeholder="Company headquarters address" value={form.companyAddress} error={errors.companyAddress} onChange={(v) => update("companyAddress", v)} showPass={showPass} onTogglePass={togglePass} />
              <Field label="Pincode" id="pincode" placeholder="123456" value={form.pincode} error={errors.pincode} onChange={(v) => update("pincode", v)} showPass={showPass} onTogglePass={togglePass} />
              <Field label="Phone Number" id="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} error={errors.phone} onChange={(v) => update("phone", v)} showPass={showPass} onTogglePass={togglePass} />
              <Field 
                label="Country" 
                id="country" 
                value={form.country} 
                error={errors.country} 
                onChange={(v) => update("country", v)} 
                showPass={showPass} 
                onTogglePass={togglePass}
                options={[
                  { label: "United States", value: "US" },
                  { label: "United Kingdom", value: "UK" },
                  { label: "India", value: "IN" },
                  { label: "China", value: "CN" },
                  { label: "Germany", value: "DE" },
                  { label: "France", value: "FR" },
                  { label: "Japan", value: "JP" },
                  { label: "Canada", value: "CA" },
                  { label: "Australia", value: "AU" },
                  { label: "Brazil", value: "BR" },
                  { label: "Mexico", value: "MX" },
                  { label: "South Korea", value: "KR" },
                  { label: "Singapore", value: "SG" },
                  { label: "Dubai / UAE", value: "AE" },
                  { label: "Other", value: "OTHER" },
                ]}
              />
            </>
          )}
          {mode === "login" && (
            <Field label="Email Address" id="email" type="email" placeholder="you@company.com" value={form.email} error={errors.email} onChange={(v) => update("email", v)} showPass={showPass} onTogglePass={togglePass} />
          )}
          <Field label="Password" id="password" placeholder="Min. 6 characters" value={form.password} error={errors.password} onChange={(v) => update("password", v)} showPass={showPass} onTogglePass={togglePass} />
          {mode === "register" && (
            <Field label="Confirm Password" id="confirmPassword" placeholder="Repeat your password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(v) => update("confirmPassword", v)} showPass={showPass} onTogglePass={togglePass} />
          )}

          {mode === "register" && (
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => update("agree", e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-teal shrink-0"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <span onClick={() => setShowTerms(true)} className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                  {" "}and{" "}
                  <span onClick={() => setShowPrivacy(true)} className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {errors.agree && <p className="text-xs text-red-400 mt-1">{errors.agree}</p>}
            </div>
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full gradient-teal text-navy font-700 text-base gap-2 teal-glow hover:opacity-90 py-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Free Account"}
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>

        {/* Benefits */}
        <div className="mt-8 pt-6 border-t border-border space-y-2.5">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={12} className="text-primary" />
              </div>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Visual Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src={heroImg} alt="Port" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

        {/* Overlay content */}
        <div className="absolute bottom-12 left-10 right-10">
          <div className="glass-card rounded-2xl p-6 max-w-sm border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-primary" />
              <span className="text-sm font-600 text-primary">Live booking confirmed</span>
            </div>
            <p className="font-display font-700 text-foreground text-lg leading-tight mb-1">
              Shanghai → Rotterdam
            </p>
            <p className="text-sm text-muted-foreground mb-4">40ft Container · COSCO Shipping · Jan 22, 2025</p>
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Your cost</p>
                <p className="text-xl font-700 font-display text-primary">$897</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">vs. full container</p>
                <p className="text-sm font-600 text-emerald-400">Saved $3,903 (81%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-navy-mid border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl">Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using ShareCargo, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">2. Use License</h3>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on ShareCargo for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on ShareCargo</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">3. Disclaimer</h3>
              <p>
                The materials on ShareCargo are provided on an 'as is' basis. ShareCargo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">4. Limitations of Liability</h3>
              <p>
                In no event shall ShareCargo or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ShareCargo.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">5. Accuracy of Materials</h3>
              <p>
                The materials appearing on ShareCargo could include technical, typographical, or photographic errors. ShareCargo does not warrant that any of the materials on its website are accurate, complete, or current. ShareCargo may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">6. Shipment Terms</h3>
              <p>
                Users of ShareCargo agree to abide by all international shipping regulations, customs laws, and tariff regulations. All cargo declarations must be accurate and complete. Fraudulent or misleading cargo information may result in legal prosecution.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">7. User Responsibilities</h3>
              <p>
                Users are responsible for maintaining the confidentiality of their account information and password. Users agree to accept responsibility for all activities that occur under their account. You agree to notify ShareCargo immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">8. Modifications to Terms</h3>
              <p>
                ShareCargo may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">9. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where ShareCargo is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-navy-mid border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">1. Introduction</h3>
              <p>
                ShareCargo ("we" or "us" or "our") operates the ShareCargo website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">2. Information Collection and Use</h3>
              <p>
                We collect several different types of information for various purposes to provide and improve our Service to you:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Personal Data:</strong> Name, email address, postal address, phone number, company information</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website and services</li>
                <li><strong>Shipment Data:</strong> Information about cargo, origin, destination, and shipping preferences</li>
                <li><strong>Payment Information:</strong> Credit card details (processed securely by third-party providers)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">3. Use of Data</h3>
              <p>ShareCargo uses the collected data for various purposes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>To provide and maintain our services</li>
                <li>To process your shipment bookings and transactions</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so we can improve our services</li>
                <li>To monitor the usage of our services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">4. Security of Data</h3>
              <p>
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">5. Cookies</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to alert you when cookies are being sent.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">6. Third-Party Links</h3>
              <p>
                Our website may contain links to other websites that are not operated by us. This Privacy Policy applies only to our website, and we are not responsible for the privacy practices of third-party websites.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">7. Your Rights</h3>
              <p>
                You have the right to access, update, or delete the information we have on you. Please contact us at privacy@sharecargo.com to exercise any of these rights.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">8. Changes to This Privacy Policy</h3>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-600 text-foreground mb-2">9. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@sharecargo.com or visit our website at www.sharecargo.com.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
