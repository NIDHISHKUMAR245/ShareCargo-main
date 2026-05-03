import { Link } from "react-router-dom";
import { Ship, Globe, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-navy-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                <Ship size={17} className="text-navy" />
              </div>
              <span className="font-display font-700 text-lg">
                Share<span className="text-teal">Cargo</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smart container sharing that makes sea freight affordable for everyone.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Twitter size={16} /></a>
              <a href="#" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Linkedin size={16} /></a>
              <a href="#" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Globe size={16} /></a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-600 text-sm text-foreground mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/shipments" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Find Matches</Link>
              </li>
              <li>
                <Link to="/shipments" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tracking</Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-600 text-sm text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Press Kit</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-600 text-sm text-foreground mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compliance</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2025 ShareCargo Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
