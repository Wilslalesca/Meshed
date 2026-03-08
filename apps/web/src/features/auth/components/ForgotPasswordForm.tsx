import React, { useState } from "react";
import { cn } from "@/shared/utils/utils";
import { Button } from "@/shared/components//ui/button";
import { Input } from "@/shared/components//ui/input";
import { Label } from "@/shared/components//ui/label";
import { Link } from "react-router-dom";
import { apiForgotPassword, apiResetPassword } from "../api/auth";

type Step = "request" | "reset" | "done";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (step === "done") return;

    if (step === "request") {
      setPending(true);
      try {
        const res = await apiForgotPassword({ email: email.toLowerCase() });
        setMessage(res.message);
        setStep("reset");
      } catch (err: unknown) {
        const authErr = err as { message?: string };
        setError(authErr.message || "Failed to send reset code");
      } finally {
        setPending(false);
      }

      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);
    try {
      const res = await apiResetPassword({
        email: email.toLowerCase(),
        code,
        newPassword,
      });
      setMessage(res.message);
      setStep("done");
      setCode("");
      setNewPassword("");
      setConfirm("");
    } catch (err: unknown) {
      const authErr = err as { message?: string };
      setError(authErr.message || "Failed to reset password");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {step === "request"
            ? "Enter your email and we’ll send a reset code."
            : step === "reset"
              ? "Enter the code from your email and choose a new password."
              : "Your password has been reset. You can log in now."}
        </p>
      </div>

      <div className="grid gap-6">
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
            disabled={pending || step === "done"}
          />
        </div>

        {step === "reset" && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="code">Reset code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={pending}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={pending}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
                disabled={pending}
              />
            </div>
          </>
        )}

        {error && <p className="text-sm text-destructive -mt-2">{error}</p>}
        {message && (
          <p className="text-sm text-muted-foreground -mt-2">{message}</p>
        )}

        {step !== "done" && (
          <Button type="submit" className="w-full" disabled={pending}>
            {step === "request" ? "Send reset code" : "Reset password"}
          </Button>
        )}

        <div className="text-center text-sm">
          <Link to="/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </div>
    </form>
  );
}
