import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/shared/utils/utils";
import { Button } from "@/shared/components//ui/button";
import { Input } from "@/shared/components//ui/input";
import { Label } from "@/shared/components//ui/label";
import { useAuth } from "@/shared/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import type { Role, RegisterCredentials } from "../types/auth";
import { apiAcceptInvite } from "../api/invite";
import { EmailVerifyModal } from "../modal/EmailVerifyModal";

const roles: Role[] = ["user", "manager", "admin"];

const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
        isValid: minLength && hasNumber && hasSpecialChar,
        minLength,
        hasNumber,
        hasSpecialChar,
    };
};

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export async function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const { register } = useAuth();
    const nav = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get("code");
    const inviteEmail = params.get("email");

    useEffect(() => {
        if (inviteEmail) {
            setEmail(inviteEmail);
        }
    }, []);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState(inviteEmail || "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [role, setRole] = useState<Role>("user");

    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const [verifyOpen, setVerifyOpen] = useState(false);

    const emailValid = useMemo(() => validateEmail(email), [email]);
    const passwordValid = useMemo(() => validatePassword(password), [password]);
    const match = password === confirm;

    
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!emailValid) {
            setError("Please enter a valid email address");
            return;
        }

        if (!passwordValid.isValid) {
            setError(
                "Password must be at least 8 characters with 1 number and 1 special character"
            );
            return;
        }

        if (!match) {
            setError("Passwords do not match");
            return;
        }

        setPending(true);

        try {
            await register({
                firstName,
                lastName: lastName,
                email,
                password,
                role: role as RegisterCredentials["role"],
            });

            setVerifyOpen(true);

        } catch (err: any) {
            setError(err?.message || "Registration failed");
        } finally {
            setPending(false);
        }
    }

    async function handleEmailVerify() {

        if (inviteCode && inviteEmail) {
            await apiAcceptInvite(inviteEmail, inviteCode);
        }

        nav("/dashboard", { replace: true });
    }

    return (
        <>
            <EmailVerifyModal
                open={verifyOpen}
                onOpenChange={setVerifyOpen}
                email={email}
                onVerified={handleEmailVerify}
            >

            <form
                onSubmit={onSubmit}
                className={cn("flex flex-col gap-6", className)}
                {...props}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your details below to create your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="name">First Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="name">Last Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="test@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            className={cn(
                                email.length > 0 &&
                                    !emailValid &&
                                    "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                        {/* {showEmailInvalid && (
                            <p className="text-xs text-destructive">
                                Please enter a valid email address
                            </p>
                        )} */}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                className={cn(
                                    password.length > 0 &&
                                        !passwordValid.isValid &&
                                        "border-destructive focus-visible:ring-destructive"
                                )}
                            />
                            {/* <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button> */}
                        </div>
                        {password.length > 0 && (
                            <div className="text-xs space-y-1">
                                <div
                                    className={cn(
                                        "flex items-center gap-2",
                                        passwordValid.minLength
                                            ? "text-green-600"
                                            : "text-destructive"
                                    )}
                                >
                                    <span className="text-xs">
                                        {passwordValid.minLength ? "✓" : "✗"}
                                    </span>
                                    At least 8 characters
                                </div>
                                <div
                                    className={cn(
                                        "flex items-center gap-2",
                                        passwordValid.hasNumber
                                            ? "text-green-600"
                                            : "text-destructive"
                                    )}
                                >
                                    <span className="text-xs">
                                        {passwordValid.hasNumber ? "✓" : "✗"}
                                    </span>
                                    At least 1 number
                                </div>
                                <div
                                    className={cn(
                                        "flex items-center gap-2",
                                        passwordValid.hasSpecialChar
                                            ? "text-green-600"
                                            : "text-destructive"
                                    )}
                                >
                                    <span className="text-xs">
                                        {passwordValid.hasSpecialChar
                                            ? "✓"
                                            : "✗"}
                                    </span>
                                    At least 1 special character
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="confirm">Confirm password</Label>
                        <div className="relative">
                            <Input
                                id="confirm"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                autoComplete="new-password"
                                className={cn(
                                    !match &&
                                        "border-destructive focus-visible:ring-destructive"
                                )}
                            />
                            {/* <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button> */}
                        </div>
                        {!match && (
                            <p className="text-xs text-destructive">
                                Passwords do not match
                            </p>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                            {roles.map((r) => (
                                <option key={r} value={r}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && (
                        <p className="text-sm text-destructive -mt-2">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? "Creating..." : "Create account"}
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </form>
            </EmailVerifyModal>
        </>
    );
}
