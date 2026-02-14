import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2, User, UserPlus, LogIn } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";

export const customerSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(50),
  lastName: z.string().min(2, "Last name is required").max(50),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  address1: z.string().min(5, "Address is required").max(100),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required").max(50),
  state: z.string().min(2, "State/Province is required").max(50),
  postcode: z.string().min(3, "Postal code is required").max(20),
  country: z.string().min(2, "Country is required"),
  vatNumber: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CustomerData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: CustomerData) => void;
  isLoading?: boolean;
  initialData?: Partial<CustomerData>;
}

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AU", name: "Australia" },
  { code: "NL", name: "Netherlands" },
  { code: "RO", name: "Romania" },
  { code: "PL", name: "Poland" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "BE", name: "Belgium" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
];

export function CustomerForm({ onSubmit, isLoading, initialData }: CustomerFormProps) {
  const [customerType, setCustomerType] = useState<"new" | "existing">("new");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  
  const [formData, setFormData] = useState<Partial<CustomerData>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    vatNumber: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CustomerData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLoginChange = (field: "email" | "password", value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    setLoginError("");
  };

  const handleExistingCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setLoginError("Please enter your email and password");
      return;
    }
    
    setIsLoggingIn(true);
    setLoginError("");
    
    try {
      const result = await apiClient.login(loginData.email, loginData.password);
      
      if (result.ok && result.token) {
        // Fetch client details to auto-fill form
        const meResult = await apiClient.me();
        if (meResult.ok && meResult.client) {
          const client = meResult.client;
          setFormData({
            firstName: client.firstName || "",
            lastName: client.lastName || "",
            email: client.email || loginData.email,
            phone: client.phone || "",
            companyName: client.companyName || "",
            address1: client.address1 || "",
            address2: "",
            city: client.city || "",
            state: client.state || "",
            postcode: client.postcode || "",
            country: client.country || "",
            vatNumber: "",
            password: loginData.password,
            confirmPassword: loginData.password,
            acceptTerms: true,
          });
          toast.success("Logged in! Your details have been filled in.");
          setCustomerType("new");
        }
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = customerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <div className="space-y-6">
      {/* Customer Type Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCustomerType("new")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              customerType === "new"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            New Customer
          </button>
          <button
            type="button"
            onClick={() => setCustomerType("existing")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              customerType === "existing"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <User className="w-4 h-4" />
            Existing Customer
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {customerType === "existing" ? (
          <motion.form
            key="login-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleExistingCustomerLogin}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <LogIn className="w-5 h-5 text-primary" />
                Log In to Your Account
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Log in to auto-fill your billing details and speed up checkout.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => handleLoginChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={loginError ? "border-destructive" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => handleLoginChange("password", e.target.value)}
                    placeholder="••••••••"
                    className={loginError ? "border-destructive" : ""}
                  />
                </div>
                
                {loginError && (
                  <p className="text-sm text-destructive">{loginError}</p>
                )}
                
                <Button type="submit" disabled={isLoggingIn} className="w-full btn-glow" size="lg">
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Log In & Continue
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="register-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Account Information */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Billing Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address1">Street Address *</Label>
                  <Input
                    id="address1"
                    value={formData.address1}
                    onChange={(e) => handleChange("address1", e.target.value)}
                    className={errors.address1 ? "border-destructive" : ""}
                  />
                  {errors.address1 && (
                    <p className="text-xs text-destructive mt-1">{errors.address1}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => handleChange("address2", e.target.value)}
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State / Province *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className={errors.state ? "border-destructive" : ""}
                  />
                  {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label htmlFor="postcode">Postal / ZIP Code *</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => handleChange("postcode", e.target.value)}
                    className={errors.postcode ? "border-destructive" : ""}
                  />
                  {errors.postcode && (
                    <p className="text-xs text-destructive mt-1">{errors.postcode}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleChange("country", value)}
                  >
                    <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-xs text-destructive mt-1">{errors.country}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="vatNumber">VAT / Tax ID (Optional)</Label>
                  <Input
                    id="vatNumber"
                    value={formData.vatNumber}
                    onChange={(e) => handleChange("vatNumber", e.target.value)}
                    placeholder="EU VAT number for tax exemption"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Create Password</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleChange("acceptTerms", checked === true)}
              />
              <div>
                <Label htmlFor="acceptTerms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline" target="_blank">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                </Label>
                {errors.acceptTerms && (
                  <p className="text-xs text-destructive mt-1">{errors.acceptTerms}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full btn-glow" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
