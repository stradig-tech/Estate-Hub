import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            await login(email.trim(), password);
            toast({
                title: "Welcome back!",
                description: "You have signed in successfully.",
            });
            navigate("/", { replace: true });
        } catch (err) {
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.error ||
                err.message ||
                "Invalid email or password";
            setError(msg);
            toast({
                title: "Login failed",
                description: msg,
                variant: "destructive",
            });
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
            icon={LogIn}
            title="Welcome back"
            subtitle="Log in to your account"
            footer={
                <div className="space-y-1.5">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-medium hover:underline">
                            Sign up as Customer
                        </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Are you a real estate agent?{" "}
                        <Link to="/register-agent" className="text-primary font-semibold hover:underline">
                            Register as an Agent
                        </Link>
                    </p>
                </div>
            }
        >
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
                    <span className="bg-card px-3 text-muted-foreground font-medium">or</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="leading-snug">{error}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            placeholder="e.g. you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12"
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
                </div>
                <Button type="submit" className="w-full h-12 font-medium text-base shadow-sm mt-2" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        "Log in"
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
