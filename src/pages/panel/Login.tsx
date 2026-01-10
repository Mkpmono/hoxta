import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Shield, AlertCircle, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/panel";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Determine where to redirect based on credentials
      if (email === "owner@demo.hoxta") {
        navigate("/admin", { replace: true });
      } else if (email === "admin@demo.hoxta") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (role: "client" | "admin" | "owner") => {
    loginAsDemo(role);
    if (role === "admin" || role === "owner") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/panel", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <WaveBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-1 mb-8">
          <span className="text-3xl font-bold text-foreground">Ho</span>
          <span className="text-3xl font-bold text-primary">x</span>
          <span className="text-3xl font-bold text-foreground">ta</span>
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Control Panel</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your services</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-muted text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-glow py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center mb-4">Quick demo access</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin("client")}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-muted/50 border border-border hover:border-primary/50 text-foreground text-xs font-medium transition-all hover:bg-muted"
              >
                <User className="w-4 h-4 text-primary" />
                Client
              </button>
              <button
                onClick={() => handleDemoLogin("admin")}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-muted/50 border border-border hover:border-primary/50 text-foreground text-xs font-medium transition-all hover:bg-muted"
              >
                <Shield className="w-4 h-4 text-primary" />
                Admin
              </button>
              <button
                onClick={() => handleDemoLogin("owner")}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-muted/50 border border-border hover:border-yellow-500/50 text-foreground text-xs font-medium transition-all hover:bg-muted"
              >
                <Crown className="w-4 h-4 text-yellow-500" />
                Owner
              </button>
            </div>
          </div>

          {/* Demo Mode Notice */}
          <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-center text-muted-foreground">
              <span className="text-primary font-medium">Demo mode only.</span> Replace with real authentication later.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">← Back to website</Link>
        </p>
      </motion.div>
    </div>
  );
}
