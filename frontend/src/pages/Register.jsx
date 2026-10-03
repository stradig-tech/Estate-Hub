import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    UserPlus,
    Mail,
    Lock,
    Phone,
    User,
    Building2,
    Loader2,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

const extractErrorMessage = (err) => {
    const data = err.response?.data;
    if (!data) return err.message || "Registration failed. Please try again.";
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
    return "Registration failed. Please check your information and try again.";
};

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
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

        // Client-side validations
        const newFieldErrors = {};
        if (!fullName.trim()) {
            newFieldErrors.fullName = "Please enter your full name";
        }
        if (!email.trim() || !email.includes("@")) {
            newFieldErrors.email = "Please enter a valid email address";
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
                role: "buyer",
                full_name: fullName.trim(),
                phone: phone.trim() || undefined,
            });

            toast({
                title: "Account Created Successfully!",
                description: "Welcome to EstateHub. You are now logged in as a customer.",
            });

            navigate("/", { replace: true });
        } catch (err) {
            const message = extractErrorMessage(err);
            setError(message);

            // Map backend fields to frontend inputs if available
            const backendFields = err.response?.data?.fields || {};
            const mappedErrors = {};
            if (backendFields.email) mappedErrors.email = Array.isArray(backendFields.email) ? backendFields.email[0] : backendFields.email;
            if (backendFields.password) mappedErrors.password = Array.isArray(backendFields.password) ? backendFields.password[0] : backendFields.password;
            if (backendFields.full_name) mappedErrors.fullName = Array.isArray(backendFields.full_name) ? backendFields.full_name[0] : backendFields.full_name;
            if (backendFields.phone) mappedErrors.phone = Array.isArray(backendFields.phone) ? backendFields.phone[0] : backendFields.phone;
            setFieldErrors(mappedErrors);

            toast({
                title: "Registration failed",
                description: message,
                variant: "destructive",
            });

            errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () => {
        toast({
            title: "Coming Soon",
            description: "Google Social Sign-In will be available in an upcoming update.",
        });
    };

    return (
        <AuthLayout
            icon={UserPlus}
            title="Create an Account"
            subtitle="Sign up as a customer to explore properties, save favorites, and contact agents"
            footer={
                <div className="space-y-2">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Log in
                        </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Are you a real estate professional?{" "}
                        <Link to="/register-agent" className="text-primary font-semibold hover:underline">
                            Register as an Agent
                        </Link>
                    </p>
                </div>
            }
        >
            {/* Agent Callout Banner */}
            <div className="mb-4 p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-primary" />
                        Are you an Agent or Broker?
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Create an Agent account to publish property listings and receive buyer inquiries.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10">
                    <Link to="/register-agent">
                        Agent Sign Up &rarr;
                    </Link>
                </Button>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-sm font-medium mb-4 hover:bg-muted/60 transition-colors"
                onClick={handleGoogle}
            >
                <GoogleIcon className="w-5 h-5 mr-2" />
                Continue with Google
            </Button>

            <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground font-medium">or sign up with email</span>
                </div>
            </div>

            {error && (
                <div
                    ref={errorRef}
                    className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-2.5 animate-in fade-in"
                >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="leading-snug">{error}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="full-name" className="text-sm font-medium">
                        Full name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="full-name"
                            autoComplete="name"
                            placeholder="e.g. John Doe"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                clearFieldError("fullName");
                            }}
                            className={`pl-10 h-12 ${fieldErrors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            required
                        />
                    </div>
                    {fieldErrors.fullName && (
                        <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.fullName}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="e.g. you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearFieldError("email");
                            }}
                            className={`pl-10 h-12 ${fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            required
                        />
                    </div>
                    {fieldErrors.email && (
                        <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone number</Label>
                        <span className="text-xs text-muted-foreground">Optional</span>
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="e.g. +1 (555) 000-0000"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                clearFieldError("phone");
                            }}
                            className={`pl-10 h-12 ${fieldErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                    </div>
                    {fieldErrors.phone && (
                        <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.phone}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password <span className="text-destructive">*</span>
                        </Label>
                        <span className="text-xs text-muted-foreground">Min. 8 characters</span>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearFieldError("password");
                            }}
                            className={`pl-10 pr-10 h-12 ${fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
                    {fieldErrors.password ? (
                        <p className="text-xs text-destructive font-medium mt-1">{fieldErrors.password}</p>
                    ) : (
                        <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="confirm" className="text-sm font-medium">
                        Confirm Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                clearFieldError("confirmPassword");
                            }}
                            className={`pl-10 pr-10 h-12 ${fieldErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
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

                {/* Submit button */}
                <Button
                    type="submit"
                    className="w-full h-12 font-medium text-base shadow-sm mt-3"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating Customer Account...
                        </>
                    ) : (
                        "Create Customer Account"
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
