import React, { useMemo, useState } from "react";
import { cn } from "@/shared/utils/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAuth } from "@/shared/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterCredentials } from "../types/auth";
import { EmailVerificationModal } from "../modal/EmailVerificationModal";
import { validatePassword } from "../utils/passwordValidation";
import { PasswordRequirements } from "./PasswordRequirements";

const normalizeInvitedRole = (
    role?: string | null,
): "admin" | "manager" | "user" => {
    if (role === "manager" || role === "admin") {
        return role;
    }
    return "user";
};

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export function RegisterForm({
    invitedEmail,
    invitedRole,
    invitedToken,
    className,
    ...props
}: React.ComponentProps<"form"> & {
    invitedEmail?: string;
    invitedRole?: "admin" | "manager" | "user";
    invitedToken?: string;
}) {
    const { register } = useAuth();
    const nav = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [organizationName, setOrganizationName] = useState("");

    const [email, setEmail] = useState(invitedEmail ?? "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const [verifyOpen, setVerifyOpen] = useState(false);
    const [verifyUserId, setVerifyUserId] = useState<string | null>(null);

    const [showPassword] = useState(false);
    const [showConfirmPassword] = useState(false);

    const passwordValidation = useMemo(
        () => validatePassword(password),
        [password],
    );
    const passwordsMatch = password === confirm;
    const showPasswordMismatch = confirm.length > 0 && !passwordsMatch;

    const emailValidation = useMemo(() => validateEmail(email), [email]);

    React.useEffect(() => {
        if (invitedEmail && invitedToken) {
            setEmail(invitedEmail);
        }
    }, [invitedEmail, invitedToken]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!invitedToken && !emailValidation) {
            return setError("Please enter a valid email address");
        }

        if (!invitedToken && !organizationName.trim()) {
            return setError("Organization name is required");
        }

        if (!passwordValidation.isValid) {
            return setError(
                "Password must be at least 8 characters with 1 number and 1 special character",
            );
        }

        if (password !== confirm) {
            return setError("Passwords do not match");
        }

        setPending(true);

        try {
            const payload: RegisterCredentials = {
                firstName,
                lastName,
                email: (invitedEmail && invitedToken
                    ? invitedEmail
                    : email
                ).toLowerCase(),
                password,
                organizationName: invitedToken
                    ? undefined
                    : organizationName.trim(),
                invitedToken: invitedToken || null,
            };

            const res = await register(payload);
            setVerifyUserId(res.userId);
            setVerifyOpen(true);
        } catch (err: unknown) {
            const authErr = err as { error?: string; message?: string };
            setError(authErr.error || authErr.message || "Registration failed");
        } finally {
            setPending(false);
        }
    }

    return (
        <>
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
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="Your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="given-name"
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="family-name"
                            required
                        />
                    </div>

                    {!invitedEmail && (
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                className={cn(
                                    email.length > 0 &&
                                        !emailValidation &&
                                        "border-destructive focus-visible:ring-destructive",
                                )}
                            />
                        </div>
                    )}

                    {!invitedToken && (
                        <div className="grid gap-3">
                            <Label htmlFor="organizationName">
                                Organization Name
                            </Label>
                            <Input
                                id="organizationName"
                                type="text"
                                placeholder="Organization Name"
                                value={organizationName}
                                onChange={(e) =>
                                    setOrganizationName(e.target.value)
                                }
                                required
                            />
                        </div>
                    )}

                    {invitedEmail && invitedRole && (
                        <p className="text-sm text-muted-foreground">
                            You’ve been invited to join as a{" "}
                            <span className="font-medium capitalize">
                                {normalizeInvitedRole(invitedRole)}
                            </span>
                            .
                        </p>
                    )}

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
                                        !passwordValidation.isValid &&
                                        "border-destructive focus-visible:ring-destructive",
                                )}
                            />
                        </div>

                        <PasswordRequirements password={password} />
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
                                    showPasswordMismatch &&
                                        "border-destructive focus-visible:ring-destructive",
                                )}
                            />
                        </div>

                        {showPasswordMismatch && (
                            <p className="text-xs text-destructive">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-destructive -mt-2">
                            {error}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? "Creating..." : "Create account"}
                    </Button>
                </div>

                {!invitedEmail && (
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="underline underline-offset-4"
                        >
                            Sign in
                        </Link>
                    </div>
                )}
            </form>

            <EmailVerificationModal
                open={verifyOpen}
                onClose={() => {
                    setVerifyOpen(false);
                    nav("/login", { replace: true });
                }}
                userId={verifyUserId || ""}
            />
        </>
    );
}
