import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { useState } from "react";
import { apiVerify, apiResend } from "../api/auth";

export function EmailVerificationModal({
    open,
    onClose,
    userId,
}: {
    open: boolean;
    onClose: () => void;
    userId: string;
}) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function verify() {
        setLoading(true);
        setError("");

        try {
            await apiVerify({ userId, code });
            onClose();
        } catch (err: unknown) {
            const apiErr = err as { error?: string; message?: string };
            setError(apiErr.error || apiErr.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    }

    async function resend() {
        setLoading(true);
        setError("");

        try {
            await apiResend({ userId });
        } catch (err: unknown) {
            const apiErr = err as { error?: string; message?: string };
            setError(apiErr.error || apiErr.message || "Resend failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent
                className="max-w-sm"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Verify your email</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code we sent to your email.
                </p>

                <div className="flex justify-center my-4">
                    <InputOTP value={code} onChange={setCode} maxLength={6}>
                        <InputOTPGroup>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <InputOTPSlot key={i} index={i} />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                    className="w-full"
                    onClick={verify}
                    disabled={loading || code.length !== 6}
                >
                    Verify Email
                </Button>

                <Button
                    variant="ghost"
                    onClick={resend}
                    disabled={loading}
                    className="w-full mt-2"
                >
                    Resend Code
                </Button>
            </DialogContent>
        </Dialog>
    );
}
