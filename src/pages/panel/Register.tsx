import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, User, AlertCircle, Building, 
  Phone, MapPin, Globe, FileText, Check 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { StaticBackground } from "@/components/ui/StaticBackground";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// ISO2 country list (common countries first)
const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "NL", name: "Netherlands" },
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgium" },
  { code: "RO", name: "Romania" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "SK", name: "Slovakia" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SI", name: "Slovenia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "GR", name: "Greece" },
  { code: "CY", name: "Cyprus" },
  { code: "MT", name: "Malta" },
  { code: "LU", name: "Luxembourg" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "IN", name: "India" },
  { code: "NZ", name: "New Zealand" },
  { code: "ZA", name: "South Africa" },
];

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phonenumber: string;
  companyname: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    companyname: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "US",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Preserve returnTo and checkout params
  const returnTo = searchParams.get("returnTo");
  const category = searchParams.get("category");
  const product = searchParams.get("product");
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing");

  const hasCheckoutParams = category || product || plan || billing;

  // Build login URL with same params
  const buildLoginUrl = () => {
    const params = new URLSearchParams();
    if (returnTo) params.set("returnTo", returnTo);
    if (category) params.set("category", category);
    if (product) params.set("product", product);
    if (plan) params.set("plan", plan);
    if (billing) params.set("billing", billing);
    const queryString = params.toString();
    return `/panel/login${queryString ? `?${queryString}` : ""}`;
  };

  // Build success redirect URL
  const getSuccessRedirectUrl = () => {
    if (returnTo) return returnTo;
    if (hasCheckoutParams) {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (product) params.set("product", product);
      if (plan) params.set("plan", plan);
      if (billing) params.set("billing", billing);
      return `/checkout?${params.toString()}`;
    }
    return "/panel";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = (): string | null => {
    if (!formData.firstname.trim()) return t("register.errors.firstnameRequired");
    if (!formData.lastname.trim()) return t("register.errors.lastnameRequired");
    if (!formData.email.trim()) return t("errors.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return t("errors.invalidEmail");
    if (!formData.password) return t("register.errors.passwordRequired");
    if (formData.password.length < 8) return t("errors.minLength", { min: 8 });
    if (formData.password !== formData.confirmPassword) return t("errors.passwordMismatch");
    if (!formData.phonenumber.trim()) return t("register.errors.phoneRequired");
    if (!formData.address1.trim()) return t("register.errors.addressRequired");
    if (!formData.city.trim()) return t("register.errors.cityRequired");
    if (!formData.postcode.trim()) return t("register.errors.postcodeRequired");
    if (!formData.country) return t("register.errors.countryRequired");
    if (!agreedToTerms) return t("register.errors.termsRequired");
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstname,
        lastName: formData.lastname,
        companyName: formData.companyname || undefined,
        phone: formData.phonenumber,
        address1: formData.address1,
        address2: formData.address2 || undefined,
        city: formData.city,
        state: formData.state || undefined,
        postcode: formData.postcode,
        country: formData.country,
      });

      if (result.success) {
        toast({
          title: t("register.success"),
          description: t("register.successMessage"),
        });
        navigate(getSuccessRedirectUrl(), { replace: true });
      } else {
        setError(result.error || t("register.failed"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.serverError"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm";

  const selectClass =
    "w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm appearance-none";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      <StaticBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-4 relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-1 mb-6">
          <span className="text-3xl font-bold text-foreground">Ho</span>
          <span className="text-3xl font-bold text-primary">x</span>
          <span className="text-3xl font-bold text-foreground">ta</span>
        </Link>

        <div className="glass-card p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">{t("register.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("register.subtitle")}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="new" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">{t("checkout.newCustomer")}</TabsTrigger>
              <TabsTrigger value="existing">{t("checkout.existingCustomer")}</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="mt-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.firstName")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="John"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.lastName")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("forms.email")} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("forms.emailPlaceholder")}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.password")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm"
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.confirmPassword")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Company & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.company")} {t("forms.optional")}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="companyname"
                        value={formData.companyname}
                        onChange={handleChange}
                        placeholder={t("forms.companyPlaceholder")}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.phone")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                        placeholder={t("forms.phonePlaceholder")}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("forms.address")} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("forms.address2")} {t("forms.optional")}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                      placeholder="Apt 4B"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* City, State, Postcode */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.city")} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.state")} {t("forms.optional")}
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                      className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("forms.postcode")} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="10001"
                      className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("forms.country")} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={selectClass}
                      required
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    {t("register.agreeToTerms")}{" "}
                    <Link to="/terms" className="text-primary hover:underline" target="_blank">
                      {t("register.termsLink")}
                    </Link>
                  </Label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !agreedToTerms}
                  className="w-full btn-glow py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      {t("register.creating")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      {t("register.createAccount")}
                    </span>
                  )}
                </button>
              </form>
            </TabsContent>

            <TabsContent value="existing" className="mt-4">
              <div className="text-center py-8">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("register.alreadyHaveAccount")}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("register.loginToManage")}
                </p>
                <Link
                  to={buildLoginUrl()}
                  className="inline-flex items-center justify-center gap-2 btn-glow px-6 py-2.5"
                >
                  {t("buttons.signIn")}
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">
            {t("buttons.backToWebsite")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
