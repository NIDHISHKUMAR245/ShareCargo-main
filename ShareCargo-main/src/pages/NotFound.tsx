import { useNavigate } from "react-router-dom";
import { Ship, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl gradient-teal flex items-center justify-center mx-auto mb-6 teal-glow">
          <Ship size={36} className="text-navy" />
        </div>
        <h1 className="text-6xl font-700 font-display text-primary mb-3">404</h1>
        <h2 className="text-xl font-display font-600 text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">This cargo went off-route. The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/")} className="gradient-teal text-navy font-700 gap-2">
          <ArrowLeft size={16} /> Back to Home Port
        </Button>
      </div>
    </div>
  );
}
