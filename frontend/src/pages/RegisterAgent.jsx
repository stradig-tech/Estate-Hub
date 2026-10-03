import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Briefcase,
    Mail,
    Lock,
    Phone,
    User,
    Building2,
    Award,
    CheckCircle2,
    Loader2,
    Users,
    Clock,
    Eye,
    EyeOff,
    AlertCircle
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const extractErrorMessage = (err) => {
    const data = err.response?.data;
    if (!data) return err.message || "Agent registration failed. Please try again.";
    if (typeof data === "string") return data;
    if (data.error && typeof data.error === "string") return data.error;
    if (data.detail && typeof data.detail === "string") return data.detail;
    if (data.message && typeof data.message === "string") return data.message;
    if (data.fields && typeof data.fields === "object") {
        const firstVal = Object.values(data.fields)[0];
        if (Array.isArray(firstVal) && firstVal.length > 0) return String(firstVal[0]);
        if (typeof firstVal === "string") return firstVal;
    }
    const firstVal = Object.values(data)[0];
    if (Array.isArray(firstVal) && firstVal.length > 0) return String(firstVal[0]);
    if (typeof firstVal === "string") return firstVal;
    return "Agent registration failed. Please check your information.";
};

export default function RegisterAgent() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [agencyName, setAgencyName] = useState("Independent");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const errorRef = useRef(null);

    const clearFieldError = (fieldName) => {
        if (fieldErrors[fieldName]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[fieldName];
                return next;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const newFieldErrors = {};
        if (!fullName.trim()) {
            newFieldErrors.fullName = "Full name is required";
        }
        if (!email.trim() || !email.includes("@")) {
            newFieldErrors.email = "Please enter a valid work email";
        }
        if (!phone.trim()) {
            newFieldErrors.phone = "Phone number is required for agent contact";
        }
        if (!agencyName.trim()) {
            newFieldErrors.agencyName = "Please select your agency association";
        }
        if (!password) {
            newFieldErrors.password = "Password is required";
        } else if (password.length < 8) {
            newFieldErrors.password = "Password must be at least 8 characters long";
        }
        if (!confirmPassword) {
            newFieldErrors.confirmPassword = "Confirm password is required";
        } else if (password !== confirmPassword) {
            newFieldErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            const firstErrMsg = Object.values(newFieldErrors)[0];
            setError(firstErrMsg);
            toast({
                title: "Incomplete details",
                description: firstErrMsg,
                variant: "destructive",
            });
            errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setLoading(true);
        try {
            await register(email.trim(), password, {
                role: "agent",
                full_name: fullName.trim(),
                phone: phone.trim(),
                agency_name: agencyName.trim(),
                license_number: licenseNumber.trim() || undefined,
                bio: bio.trim() || undefined,
            });

            toast({
                title: "Agent Application Submitted!",
                description: "Your application is under review. You can now access your dashboard and profile.",
            });

            navigate("/dashboard", { replace: true });
        } catch (err) {
            const message = extractErrorMessage(err);
            setError(message);

            const backendFields = err.response?.data?.fields || {};
            const mappedErrors = {};
            if (backendFields.email) mappedErrors.email = Array.isArray(backendFields.email) ? backendFields.email[0] : backendFields.email;
            if (backendFields.password) mappedErrors.password = Array.isArray(backendFields.password) ? backendFields.password[0] : backendFields.password;
            if (backendFields.phone) mappedErrors.phone = Array.isArray(backendFields.phone) ? backendFields.phone[0] : backendFields.phone;
            setFieldErrors(mappedErrors);

            toast({
                title: "Application submission failed",
                description: message,
                variant: "destructive",
            });

            errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            icon={Briefcase}
            title="Register as an Agent"
            subtitle="Join our verified real estate network, manage your profile, and connect with active buyers"
            maxWidthClass="max-w-2xl"
            footer={
                <div className="space-y-2">
                    <p>
                        Already have an agent account?{" "}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Log in
                        </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Looking to buy or rent a property instead?{" "}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Register as a Customer
                        </Link>
                    </p>
                </div>
            }
        >
            {/* Switch to Buyer Callout Banner */}
            <div className="mb-3.5 p-3.5 rounded-xl border border-border bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary" />
                        Looking to buy, sell, or rent?
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        If you're a client searching for a home, you only need a standard Customer account.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0 text-xs font-semibold">
                    <Link to="/register">
                        Customer Sign Up &rarr;
                    </Link>
                </Button>
            </div>

            {/* Approval Notice Banner */}
            <div className="mb-3.5 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-200">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                    <div className="font-semibold text-sm text-amber-900 dark:text-amber-100">Verification & Approval Process</div>
                    <p className="mt-1 leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                        Both <strong>Independent</strong> and <strong>For Estate Hub</strong> registrations undergo administrative review. 
                        After signup, you will have immediate access to your profile and dashboard. Property listing features will be activated upon admin approval.
                    </p>
                </div>
            </div>

            {/* Agent Partner Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-foreground/80">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Publish listings upon approval</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Direct inquiry leads</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Verified public profile</span>
                </div>
            </div>

            {error && (
                <div
                    ref={errorRef}
                    className="mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-2.5 animate-in fade-in"
                >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="leading-snug">{error}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="agent-name" className="text-sm font-medium">
                            Full name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            <Input
                                id="agent-name"
                                autoComplete="name"
                                placeholder="e.g. Sarah Connor"
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    clearFieldError("fullName");
                                }}
                                className={`pl-10 h-11 ${fieldErrors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                required
                            />
                        </div>
                        {fieldErrors.fullName && (
                            <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="agent-email" className="text-sm font-medium">
                            Work email <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            <Input
                                id="agent-email"
                                type="email"
                                autoComplete="email"
                                placeholder="e.g. sarah@skyline.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearFieldError("email");
                                }}
                                className={`pl-10 h-11 ${fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                required
                            />
                        </div>
                        {fieldErrors.email && (
                            <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.email}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                        <Label htmlFor="agent-phone" className="text-sm font-medium">
                            Contact phone <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            <Input
                                id="agent-phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="e.g. +1 (555) 234-5678"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    clearFieldError("phone");
                                }}
                                className={`pl-10 h-11 ${fieldErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                required
                            />
                        </div>
                        {fieldErrors.phone && (
                            <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.phone}</p>
                        )}
                    </div>

                    {/* Agency / Brokerage */}
                    <div className="space-y-1.5">
                        <Label htmlFor="agency-name" className="text-sm font-medium">
                            Agency / Brokerage <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                            <select
                                id="agency-name"
                                value={agencyName}
                                onChange={(e) => {
                                    setAgencyName(e.target.value);
                                    clearFieldError("agencyName");
                                }}
                                className="w-full pl-10 pr-8 h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
                                required
                            >
                                <option value="Independent">Independent</option>
                                <option value="For Estate Hub">For Estate Hub</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                        {fieldErrors.agencyName && (
                            <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.agencyName}</p>
                        )}
                    </div>
                </div>

                {/* License Number */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="license-number" className="text-sm font-medium">Real estate license number</Label>
                        <span className="text-xs text-muted-foreground">Recommended</span>
                    </div>
                    <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="license-number"
                            placeholder="e.g. RE-1098452"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                </div>

                {/* Professional Bio */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="agent-bio" className="text-sm font-medium">Professional bio / Experience</Label>
                        <span className="text-xs text-muted-foreground">Optional</span>
                    </div>
                    <Textarea
                        id="agent-bio"
                        placeholder="Tell clients about your real estate expertise, neighborhood specialties, and years of experience..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="resize-none min-h-[90px]"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="agent-password" className="text-sm font-medium">
                                Password <span className="text-destructive">*</span>
                            </Label>
                            <span className="text-xs text-muted-foreground">Min. 8 chars</span>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            <Input
                                id="agent-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearFieldError("password");
                                }}
                                className={`pl-10 pr-10 h-11 ${fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="agent-confirm" className="text-sm font-medium">
                            Confirm password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            <Input
                                id="agent-confirm"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    clearFieldError("confirmPassword");
                                }}
                                className={`pl-10 pr-10 h-11 ${fieldErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                tabIndex={-1}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && (
                            <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 font-medium text-base shadow-sm mt-3"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting Application...
                        </>
                    ) : (
                        "Submit Agent Application for Approval"
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
